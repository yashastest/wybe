import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ListChecks, Rocket, ShieldCheck, Timer, HelpCircle, AlertCircle, CheckCircle } from 'lucide-react';
import { useTokenTrading } from '@/hooks/useTokenTrading';
import { useWallet } from '@/hooks/useWallet.tsx';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/tradeUtils';
import DexScreenerListingProgress from '@/components/DexScreenerListingProgress';

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
  
  const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAction(e.target.value as 'buy' | 'sell');
  };
  
  const handleSlippageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSlippage(e.target.value);
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
    <Card className="bg-wybe-background-light border-white/10">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          Trade {selectedToken.name} ({selectedToken.symbol})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Token Selector */}
        <div>
          <Label htmlFor="token">Select Token</Label>
          <Select onValueChange={(value) => {
            const selected = tokens.find(token => token.symbol === value);
            if (selected) {
              onSelectToken(selected);
            }
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a token" defaultValue={selectedToken.symbol} />
            </SelectTrigger>
            <SelectContent>
              {tokens.map((token) => (
                <SelectItem key={token.symbol} value={token.symbol}>
                  {token.name} ({token.symbol})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Trade Action */}
        <div>
          <Label htmlFor="action">Action</Label>
          <Select defaultValue={action} onValueChange={handleActionChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select action" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buy">Buy</SelectItem>
              <SelectItem value="sell">Sell</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Amount Input */}
        <div>
          <Label htmlFor="amount">Amount ({action === 'buy' ? 'SOL' : selectedToken.symbol})</Label>
          <Input 
            type="number" 
            id="amount" 
            placeholder={`Enter amount to ${action}`} 
            value={amount}
            onChange={handleAmountChange}
          />
        </div>
        
        {/* Slippage Tolerance */}
        <div>
          <Label htmlFor="slippage">Slippage Tolerance</Label>
          <Select defaultValue={slippage} onValueChange={handleSlippageChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select slippage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.5">0.5%</SelectItem>
              <SelectItem value="1">1%</SelectItem>
              <SelectItem value="2">2%</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Estimated Price Impact */}
        <div>
          <Label>Estimated Price Impact</Label>
          <Progress value={15} className="h-2 bg-gray-700">
            <div className="h-full bg-orange-500 transition-all" style={{ width: '15%' }} />
          </Progress>
          <div className="text-xs text-gray-400 flex justify-between">
            <span>0%</span>
            <span>15%</span>
          </div>
        </div>
        
        {/* Wallet Balances */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-400">SOL Balance</div>
            <div className="font-medium">{solBalance.toFixed(4)} SOL</div>
          </div>
          <div>
            <div className="text-sm text-gray-400">{selectedToken.symbol} Balance</div>
            <div className="font-medium">{tokenBalance.toFixed(2)} {selectedToken.symbol}</div>
          </div>
        </div>
        
        {/* Trade Button */}
        <Button 
          className="w-full bg-orange-600 hover:bg-orange-700"
          onClick={executeTrade}
          disabled={isExecuting}
        >
          {isExecuting ? 'Executing Trade...' : `Swap ${amount} ${action === 'buy' ? 'SOL' : selectedToken.symbol} `}
        </Button>
        
        {/* Token Stats */}
        <div className="border-t border-white/10 pt-4 mt-4">
          <div className="text-sm font-medium mb-2">Token Stats</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-gray-400">Market Cap</div>
              <div className="font-medium">${formatCurrency(tokenStats.marketCap)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">24h Volume</div>
              <div className="font-medium">${formatCurrency(tokenStats.volume24h)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Liquidity</div>
              <div className="font-medium">${formatCurrency(tokenStats.liquidity)}</div>
            </div>
            <div>
              <div className="text-xs text-gray-400">Time Since Launch</div>
              <div className="font-medium">{tokenStats.timeSinceLaunch}</div>
            </div>
          </div>
          
          {/* Token Security & Eligibility */}
          <div className="mt-4">
            <div className="text-xs text-gray-400 flex items-center gap-1.5">
              <ListChecks className="h-3.5 w-3.5" />
              Eligibility & Security
            </div>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="bg-green-500 text-white text-xs">
                <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                {tokenStats.isAudited ? 'Audited' : 'Not Audited'}
              </Badge>
              <Badge variant="secondary" className="bg-green-500 text-white text-xs">
                <CheckCircle className="h-3.5 w-3.5 mr-1" />
                {tokenStats.isVerified ? 'Verified' : 'Unverified'}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* DexScreener Listing Progress */}
        <DexScreenerListingProgress
          tokenSymbol={selectedToken.symbol}
          progress={65}
          status="in_progress"
        />
      </CardContent>
    </Card>
  );
};

export default TradingInterface;
