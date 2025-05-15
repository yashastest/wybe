
import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@/hooks/useWallet.tsx';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowRightLeft, 
  TrendingUp, 
  TrendingDown, 
  Info, 
  Fuel, 
  AlertCircle,
  RefreshCw,
  Check,
  X
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { tokenTradingService } from '@/services/tokenTradingService';
import { TradeResult } from '@/services/token/types';
import { formatCurrency } from '@/utils/tradeUtils';

interface EnhancedTradingInterfaceProps {
  tokenSymbol: string;
  tokenName: string;
  tokenPrice?: number;
  tokenLogo?: string;
}

const EnhancedTradingInterface: React.FC<EnhancedTradingInterfaceProps> = ({
  tokenSymbol,
  tokenName,
  tokenPrice = 0.0015,
  tokenLogo
}) => {
  const { connected, address } = useWallet();
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [inputAmount, setInputAmount] = useState<string>('');
  const [estimatedAmount, setEstimatedAmount] = useState<number>(0);
  const [gasPriority, setGasPriority] = useState<number>(2);
  const [isAutoSlippage, setIsAutoSlippage] = useState<boolean>(true);
  const [slippageTolerance, setSlippageTolerance] = useState<number>(0.5);
  const [isEstimating, setIsEstimating] = useState<boolean>(false);
  const [isBuying, setIsBuying] = useState<boolean>(false);
  const [isSelling, setIsSelling] = useState<boolean>(false);
  const [tradeResult, setTradeResult] = useState<TradeResult | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  // Mock trending tokens data
  const [trendingTokens, setTrendingTokens] = useState([
    { symbol: 'PEPE', name: 'Pepe Token', price: 0.000023, change24h: 12.5 },
    { symbol: 'DOGE', name: 'Dogecoin', price: 0.12, change24h: -3.2 },
    { symbol: 'SHIB', name: 'Shiba Inu', price: 0.000009, change24h: 5.8 },
    { symbol: 'FLOKI', name: 'Floki Inu', price: 0.00015, change24h: 8.2 },
  ]);
  
  // Mock whale activity data
  const [whaleActivity, setWhaleActivity] = useState([
    { symbol: 'WYBE', action: 'buy', amount: 25000, time: '10 mins ago' },
    { symbol: 'PEPE', action: 'sell', amount: 15000, time: '25 mins ago' },
    { symbol: 'DOGE', action: 'buy', amount: 100000, time: '1 hour ago' },
  ]);
  
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  const estimateAmount = useCallback(async () => {
    if (!inputAmount || isNaN(Number(inputAmount))) {
      setEstimatedAmount(0);
      return;
    }
    
    setIsEstimating(true);
    try {
      // Mock estimation with simulated delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (tradeType === 'buy') {
        // If buying, estimate token amount from SOL input
        const mockTokenAmount = parseFloat(inputAmount) / tokenPrice;
        setEstimatedAmount(mockTokenAmount);
      } else {
        // If selling, estimate SOL amount from token input
        const mockSolAmount = parseFloat(inputAmount) * tokenPrice;
        setEstimatedAmount(mockSolAmount);
      }
    } catch (error) {
      console.error("Failed to estimate amount:", error);
      toast.error("Failed to estimate amount. Please try again.");
      setEstimatedAmount(0);
    } finally {
      setIsEstimating(false);
    }
  }, [tradeType, inputAmount, tokenPrice]);
  
  useEffect(() => {
    if (inputAmount) {
      estimateAmount();
    } else {
      setEstimatedAmount(0);
    }
  }, [inputAmount, estimateAmount]);
  
  const handleInputChange = (value: string) => {
    setInputAmount(value);
  };

  const getGasPriorityValue = (priority: number): 'low' | 'medium' | 'high' => {
    switch(priority) {
      case 1: return 'low';
      case 3: return 'high';
      default: return 'medium';
    }
  };

  const formatTradeResult = (result: TradeResult): string => {
    if (!result.success) {
      return result.error || result.errorMessage || 'Trade failed';
    }
    
    const amount = result.amount || result.amountSol 
      ? formatCurrency(result.amount || result.amountSol || 0) + ' SOL' 
      : result.amountTokens 
        ? result.amountTokens + ' ' + tokenSymbol 
        : 'Unknown amount';
        
    return `Trade successful! You ${tradeType === 'buy' ? 'bought' : 'sold'} ${amount}.`;
  };

  const executeTrade = async () => {
    if (!connected) {
      toast.error("Please connect your wallet to trade");
      return;
    }
    
    if (!inputAmount || isNaN(Number(inputAmount))) {
      toast.error("Please enter a valid amount to trade");
      return;
    }
    
    setTradeResult(null);
    
    try {
      // Mock trade execution with simulated delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let result: TradeResult;
      
      if (tradeType === 'buy') {
        setIsBuying(true);
        result = {
          success: true,
          txHash: `tx_${Date.now().toString(36)}`,
          amountSol: parseFloat(inputAmount),
          amountTokens: estimatedAmount,
          price: tokenPrice,
        };
      } else {
        setIsSelling(true);
        result = {
          success: true,
          txHash: `tx_${Date.now().toString(36)}`,
          amountTokens: parseFloat(inputAmount),
          amountSol: estimatedAmount,
          price: tokenPrice,
        };
      }
      
      if (result.success) {
        toast.success(formatTradeResult(result));
      } else {
        toast.error(formatTradeResult(result));
      }
      
      setTradeResult(result);
      setInputAmount('');
    } catch (error: any) {
      console.error("Failed to execute trade:", error);
      toast.error("Failed to execute trade. Please try again.");
      setTradeResult({
        success: false,
        error: 'Trade execution failed',
        errorMessage: error.message || 'Unknown error'
      });
    } finally {
      setIsBuying(false);
      setIsSelling(false);
    }
  };
  
  // Quick buy function
  const quickBuy = (amount: number) => {
    setTradeType('buy');
    setInputAmount(amount.toString());
    executeTrade();
  };

  return (
    <Card className="glass-card">
      <Tabs defaultValue="trade" className="w-full">
        <TabsList>
          <TabsTrigger value="trade">Trade</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="whales">Whale Activity</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="trade">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                {tradeType === 'buy' ? 'Buy' : 'Sell'} {tokenName} ({tokenSymbol})
              </h2>
              {tokenLogo && (
                <img src={tokenLogo} alt={tokenName} className="w-8 h-8 rounded-full" />
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant={tradeType === 'buy' ? 'default' : 'outline'}
                onClick={() => setTradeType('buy')}
                className={tradeType === 'buy' ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                Buy
              </Button>
              <Button 
                variant={tradeType === 'sell' ? 'default' : 'outline'}
                onClick={() => setTradeType('sell')}
                className={tradeType === 'sell' ? 'bg-red-600 hover:bg-red-700' : ''}
              >
                Sell
              </Button>
            </div>
            
            <div className="grid gap-2">
              <Input 
                type="number"
                placeholder={`Enter ${tradeType === 'buy' ? 'SOL' : tokenSymbol} amount`}
                value={inputAmount}
                onChange={(e) => handleInputChange(e.target.value)}
                ref={inputRef}
              />
              <p className="text-sm text-gray-400">
                Estimated {tradeType === 'buy' ? tokenSymbol : 'SOL'}:{' '}
                {isEstimating ? <RefreshCw className="inline-block h-4 w-4 animate-spin" /> : estimatedAmount.toLocaleString()}
              </p>
            </div>
            
            {/* Quick Buy Options */}
            {tradeType === 'buy' && (
              <div className="grid grid-cols-4 gap-2">
                <Button size="sm" variant="outline" onClick={() => setInputAmount('0.1')}>0.1 SOL</Button>
                <Button size="sm" variant="outline" onClick={() => setInputAmount('0.5')}>0.5 SOL</Button>
                <Button size="sm" variant="outline" onClick={() => setInputAmount('1')}>1 SOL</Button>
                <Button size="sm" variant="outline" onClick={() => setInputAmount('5')}>5 SOL</Button>
              </div>
            )}
            
            {/* Gas Settings Summary */}
            <div className="flex items-center justify-between text-xs bg-gray-800/50 p-2 rounded">
              <span>Gas: {getGasPriorityValue(gasPriority)}</span>
              <span>Slippage: {isAutoSlippage ? 'Auto' : `${slippageTolerance}%`}</span>
            </div>
            
            <Button 
              className="w-full"
              onClick={executeTrade}
              disabled={!connected || isBuying || isSelling}
            >
              {connected ? (
                isBuying ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Buying {tokenSymbol}...
                  </>
                ) : isSelling ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Selling {tokenSymbol}...
                  </>
                ) : (
                  <>
                    <ArrowRightLeft className="mr-2 h-4 w-4" />
                    Execute Trade
                  </>
                )
              ) : (
                "Connect Wallet to Trade"
              )}
            </Button>
            
            {tradeResult && (
              <div className={`p-3 rounded-md ${tradeResult.success ? 'bg-green-900/20 border border-green-500/30' : 'bg-red-900/20 border border-red-500/30'}`}>
                <div className="flex items-start">
                  <div className={`p-1 rounded-full mr-2 ${tradeResult.success ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    {tradeResult.success ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${tradeResult.success ? 'text-green-500' : 'text-red-500'}`}>
                      {formatTradeResult(tradeResult)}
                    </p>
                    {tradeResult.txHash && (
                      <p className="text-xs text-gray-400 mt-1 font-mono">
                        Tx: {tradeResult.txHash.slice(0, 16)}...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </TabsContent>
        
        <TabsContent value="trending">
          <CardContent className="space-y-4">
            <h3 className="text-base font-medium">Trending Tokens</h3>
            
            <div className="space-y-3">
              {trendingTokens.map((token, index) => (
                <div key={index} className="flex items-center justify-between bg-black/20 p-3 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                      {token.symbol.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{token.name}</p>
                      <p className="text-xs text-gray-400">{token.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${token.price.toFixed(6)}</p>
                    <p className={`text-xs ${token.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {token.change24h >= 0 ? '+' : ''}{token.change24h}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="whales">
          <CardContent className="space-y-4">
            <h3 className="text-base font-medium">Recent Whale Activity</h3>
            
            <div className="space-y-3">
              {whaleActivity.map((activity, index) => (
                <div key={index} className="bg-black/20 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded-full ${activity.action === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {activity.action === 'buy' ? (
                          <TrendingUp className={`h-4 w-4 text-green-500`} />
                        ) : (
                          <TrendingDown className={`h-4 w-4 text-red-500`} />
                        )}
                      </div>
                      <span className="font-medium">{activity.symbol}</span>
                    </div>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                  <p className="mt-1 text-sm">
                    Whale {activity.action === 'buy' ? 'bought' : 'sold'} <span className="font-medium">{activity.amount.toLocaleString()}</span> tokens
                  </p>
                  <div className="mt-2">
                    <Button variant="secondary" size="sm" className="w-full">
                      View Token
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="settings">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Transaction Settings</h3>
              <p className="text-sm text-gray-500">Customize your transaction preferences.</p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium block">Gas Priority</label>
              <Select value={gasPriority.toString()} onValueChange={(value) => setGasPriority(parseInt(value))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gas priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Low <Fuel className="inline-block h-3 w-3 text-green-500 ml-1" /></SelectItem>
                  <SelectItem value="2">Medium <Fuel className="inline-block h-3 w-3 text-yellow-500 ml-1" /></SelectItem>
                  <SelectItem value="3">High <Fuel className="inline-block h-3 w-3 text-red-500 ml-1" /></SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-400">Higher gas priority may result in faster transaction confirmation.</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Auto Slippage Tolerance</label>
                <Switch id="auto-slippage" checked={isAutoSlippage} onCheckedChange={setIsAutoSlippage} />
              </div>
              
              {!isAutoSlippage && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Slippage Tolerance (%)</label>
                  <Input 
                    type="number" 
                    placeholder="Enter slippage tolerance" 
                    value={slippageTolerance.toString()}
                    onChange={(e) => setSlippageTolerance(parseFloat(e.target.value))}
                  />
                  <p className="text-xs text-gray-400">Slippage tolerance is the percentage of price movement you are willing to accept.</p>
                </div>
              )}
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default EnhancedTradingInterface;
