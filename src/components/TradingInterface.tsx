
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ListChecks, Rocket, ShieldCheck, Timer, HelpCircle, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';
import { useTokenTrading } from '@/hooks/useTokenTrading';
import { useWallet } from '@/hooks/useWallet.tsx';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/tradeUtils';
import DexScreenerListingProgress from '@/components/DexScreenerListingProgress';
import TokenPriceChart from './TokenPriceChart';

interface TradingInterfaceProps {
  tokens: { symbol: string; name: string; price: number; }[];
  selectedToken: { symbol: string; name: string; price: number; };
  onSelectToken: (token: { symbol: string; name: string; price: number; }) => void;
}

const TradingInterface: React.FC<TradingInterfaceProps> = ({ tokens, selectedToken, onSelectToken }) => {
  const [amount, setAmount] = useState('');
  const [action, setAction] = useState<'buy' | 'sell'>('buy');
  const [slippage, setSlippage] = useState('0.5');
  const [isExecuting, setIsExecuting] = useState(false);
  const { address } = useWallet();
  const { buyTokens, sellTokens, solBalance, tokenBalance } = useTokenTrading(selectedToken?.symbol);
  
  // Mock token data (replace with actual data fetching)
  const [tokenStats, setTokenStats] = useState({
    marketCap: 48000,
    volume24h: 12000,
    liquidity: 6400,
    isAudited: true,
    isVerified: true,
    timeSinceLaunch: '2 days',
  });
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };
  
  const handleActionChange = (value: string) => {
    setAction(value as 'buy' | 'sell');
  };
  
  const handleSlippageChange = (value: string) => {
    setSlippage(value);
  };
  
  const executeTrade = async () => {
    if (!address) {
      toast.error("Connect your wallet to trade");
      return;
    }
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast.error("Enter a valid amount to trade");
      return;
    }
    
    setIsExecuting(true);
    try {
      const numericAmount = Number(amount);
      
      if (action === 'buy') {
        await buyTokens(numericAmount);
      } else {
        await sellTokens(numericAmount);
      }
      
      toast.success(`Successfully ${action === 'buy' ? 'bought' : 'sold'} ${amount} ${selectedToken.symbol}`);
    } catch (error: any) {
      console.error("Trade execution error:", error);
      toast.error(`Trade failed: ${error.message || 'Unknown error'}`);
    } finally {
      setIsExecuting(false);
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-1">
      {/* Chart Section */}
      <div className="md:col-span-7 bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
        <div className="flex items-center justify-between mb-1">
          <div className="text-sm font-medium">
            {selectedToken.name} ({selectedToken.symbol}) Price
          </div>
          <div className="flex items-center">
            <Badge variant="outline" className="text-xs bg-[#1A1F2C]/60 border-gray-700">24H</Badge>
          </div>
        </div>
        <div className="h-[210px]">
          <TokenPriceChart symbol={selectedToken.symbol} height="100%" />
        </div>
        
        <div className="grid grid-cols-4 gap-1 mt-2">
          <div className="bg-[#1A1F2C]/40 border border-gray-800/50 p-1.5 rounded-md">
            <div className="text-xs text-gray-400">Market Cap</div>
            <div className="font-medium text-sm">${formatCurrency(tokenStats.marketCap)}</div>
          </div>
          <div className="bg-[#1A1F2C]/40 border border-gray-800/50 p-1.5 rounded-md">
            <div className="text-xs text-gray-400">24h Volume</div>
            <div className="font-medium text-sm">${formatCurrency(tokenStats.volume24h)}</div>
          </div>
          <div className="bg-[#1A1F2C]/40 border border-gray-800/50 p-1.5 rounded-md">
            <div className="text-xs text-gray-400">Liquidity</div>
            <div className="font-medium text-sm">${formatCurrency(tokenStats.liquidity)}</div>
          </div>
          <div className="bg-[#1A1F2C]/40 border border-gray-800/50 p-1.5 rounded-md">
            <div className="text-xs text-gray-400">Since Launch</div>
            <div className="font-medium text-sm">{tokenStats.timeSinceLaunch}</div>
          </div>
        </div>
      </div>
      
      {/* Trading Form */}
      <div className="md:col-span-5 bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
        <div className="space-y-2">
          {/* Token Selector */}
          <div>
            <Label htmlFor="token" className="text-xs text-gray-400 mb-1 block">Token</Label>
            <Select onValueChange={(value) => {
              const selected = tokens.find(token => token.symbol === value);
              if (selected) {
                onSelectToken(selected);
              }
            }}>
              <SelectTrigger className="w-full h-8 text-sm bg-[#1A1F2C]/60 border-gray-700">
                <SelectValue placeholder="Select a token" defaultValue={selectedToken.symbol} />
              </SelectTrigger>
              <SelectContent className="bg-[#1A1F2C] border-gray-700">
                {tokens.map((token) => (
                  <SelectItem key={token.symbol} value={token.symbol}>
                    {token.name} ({token.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {/* Trade Action */}
            <div>
              <Label htmlFor="action" className="text-xs text-gray-400 mb-1 block">Action</Label>
              <Select defaultValue={action} onValueChange={handleActionChange}>
                <SelectTrigger className="w-full h-8 text-sm bg-[#1A1F2C]/60 border-gray-700">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1F2C] border-gray-700">
                  <SelectItem value="buy">Buy</SelectItem>
                  <SelectItem value="sell">Sell</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Slippage Tolerance */}
            <div>
              <Label htmlFor="slippage" className="text-xs text-gray-400 mb-1 block">Slippage</Label>
              <Select defaultValue={slippage} onValueChange={handleSlippageChange}>
                <SelectTrigger className="w-full h-8 text-sm bg-[#1A1F2C]/60 border-gray-700">
                  <SelectValue placeholder="Select slippage" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1F2C] border-gray-700">
                  <SelectItem value="0.5">0.5%</SelectItem>
                  <SelectItem value="1">1%</SelectItem>
                  <SelectItem value="2">2%</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Amount Input */}
          <div>
            <Label htmlFor="amount" className="text-xs text-gray-400 mb-1 block">Amount ({action === 'buy' ? 'SOL' : selectedToken.symbol})</Label>
            <Input 
              type="number" 
              id="amount" 
              placeholder={`Enter amount to ${action}`} 
              value={amount}
              onChange={handleAmountChange}
              className="h-8 text-sm bg-[#1A1F2C]/60 border-gray-700"
            />
          </div>
          
          {/* Estimated Price Impact */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <Label className="text-xs text-gray-400">Price Impact</Label>
              <span className="text-xs text-orange-500">15%</span>
            </div>
            <Progress value={15} className="h-1.5 bg-gray-700">
              <div className="h-full bg-orange-500 transition-all" style={{ width: '15%' }} />
            </Progress>
          </div>
          
          {/* Wallet Balances */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-[#1A1F2C]/40 border border-gray-800/50 p-2 rounded-md">
              <div className="text-xs text-gray-400">SOL Balance</div>
              <div className="font-medium text-sm">{solBalance.toFixed(4)}</div>
            </div>
            <div className="bg-[#1A1F2C]/40 border border-gray-800/50 p-2 rounded-md">
              <div className="text-xs text-gray-400">{selectedToken.symbol} Balance</div>
              <div className="font-medium text-sm">{tokenBalance.toFixed(2)}</div>
            </div>
          </div>
          
          {/* Trade Button */}
          <Button 
            className="w-full bg-orange-600 hover:bg-orange-700 h-8 text-sm mt-1"
            onClick={executeTrade}
            disabled={isExecuting}
          >
            {isExecuting ? 'Executing...' : `Swap ${amount || '0'} ${action === 'buy' ? 'SOL' : selectedToken.symbol} `}
          </Button>
          
          {/* Token Security & Eligibility */}
          <div className="mt-1">
            <div className="flex flex-wrap items-center gap-1 mt-1">
              <Badge variant="secondary" className="bg-green-600/80 text-white text-xs px-1.5 py-0">
                <ShieldCheck className="h-3 w-3 mr-0.5" />
                {tokenStats.isAudited ? 'Audited' : 'Not Audited'}
              </Badge>
              <Badge variant="secondary" className="bg-green-600/80 text-white text-xs px-1.5 py-0">
                <CheckCircle className="h-3 w-3 mr-0.5" />
                {tokenStats.isVerified ? 'Verified' : 'Unverified'}
              </Badge>
              <Badge variant="secondary" className="bg-purple-600/80 text-white text-xs px-1.5 py-0">
                <TrendingUp className="h-3 w-3 mr-0.5" />
                Trending
              </Badge>
            </div>
          </div>
          
          {/* DexScreener Listing Progress - Compact version */}
          <DexScreenerListingProgress
            tokenSymbol={selectedToken.symbol}
            progress={65}
            status="in_progress"
          />
        </div>
      </div>
    </div>
  );
};

export default TradingInterface;
