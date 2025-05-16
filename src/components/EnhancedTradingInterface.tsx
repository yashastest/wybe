
import React, { useState, useEffect, useCallback } from 'react';
import { useWallet } from '@/lib/wallet';
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
  X,
  Search,
  Activity,
  ChartBar,
  Settings,
  CircleDollarSign,
  CircleMinus,
  CirclePlus
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { tokenTradingService } from '@/services/tokenTradingService';
import { formatCurrency } from '@/utils/tradeUtils';
import TokenBondingCurve from './TokenBondingCurve';
import DexScreenerListingProgress from './DexScreenerListingProgress';

interface EnhancedTradingInterfaceProps {
  tokenSymbol: string;
  tokenName: string;
  tokenPrice?: number;
  tokenLogo?: string;
}

interface WhaleActivity {
  symbol: string;
  action: 'buy' | 'sell';
  amount: number;
  time: string;
  price?: number;
  wallet?: string;
  dollarValue?: number;
}

interface TrendingToken {
  symbol: string;
  name: string;
  price: number;
  change24h: number;
  logo?: string;
  volume?: number;
}

interface TradeSettings {
  autoSlippage: boolean;
  slippageTolerance: number;
  gasPriority: 'low' | 'medium' | 'high';
  confirmTrades: boolean;
  quickBuyAmount: number;
  quickSellPercentage: number;
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
  const [tradeResult, setTradeResult] = useState<any | null>(null);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [tradeSettings, setTradeSettings] = useState<TradeSettings>({
    autoSlippage: true,
    slippageTolerance: 0.5,
    gasPriority: 'medium',
    confirmTrades: true,
    quickBuyAmount: 1,
    quickSellPercentage: 50
  });
  
  // Mock trending tokens data with more realistic data and logos
  const [trendingTokens, setTrendingTokens] = useState<TrendingToken[]>([
    { symbol: 'PEPE', name: 'Pepe Token', price: 0.000023, change24h: 12.5, logo: '/lovable-uploads/a8831646-bbf0-4510-9f62-5999db7cca5d.png', volume: 2450000 },
    { symbol: 'DOGE', name: 'Dogecoin', price: 0.12, change24h: -3.2, logo: '/lovable-uploads/11c9cd9c-16fc-462c-912b-bd90bbd2bd17.png', volume: 5670000 },
    { symbol: 'SHIB', name: 'Shiba Inu', price: 0.000009, change24h: 5.8, logo: '/lovable-uploads/5f8a8eb9-3963-4b1b-8ca5-2beecbb60b39.png', volume: 3420000 },
    { symbol: 'FLOKI', name: 'Floki Inu', price: 0.00015, change24h: 8.2, logo: null, volume: 890000 },
  ]);
  
  // Mock whale activity data (now with dollar values)
  const [whaleActivity, setWhaleActivity] = useState<WhaleActivity[]>([
    { symbol: 'WYBE', action: 'buy', amount: 25000, time: '10 mins ago', price: 0.0015, wallet: '8zjX...BhR', dollarValue: 14500 },
    { symbol: 'PEPE', action: 'sell', amount: 650000, time: '25 mins ago', price: 0.000023, wallet: '9ajX...CyZ', dollarValue: 12950 },
    { symbol: 'DOGE', action: 'buy', amount: 100000, time: '1 hour ago', price: 0.12, wallet: '7wpX...AiJ', dollarValue: 11200 },
  ]);
  
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  // Generate random new whale activities
  useEffect(() => {
    const interval = setInterval(() => {
      // Choose a random token
      const tokens = ['WYBE', 'PEPE', 'DOGE', 'SHIB', 'FLOKI'];
      const randomToken = tokens[Math.floor(Math.random() * tokens.length)];
      
      // Get token price
      const tokenInfo = trendingTokens.find(t => t.symbol === randomToken);
      const price = tokenInfo?.price || Math.random() * 0.1;
      
      // Generate action
      const action: 'buy' | 'sell' = Math.random() > 0.5 ? 'buy' : 'sell';
      
      // Generate amount for whale transactions (large enough to exceed $10k)
      const amount = Math.floor(Math.random() * 500000) + 100000;
      const dollarValue = price * amount;
      
      // Only add if it's a true "whale" activity (> $10,000)
      if (dollarValue < 10000) {
        return; // Skip this iteration
      }
      
      // Generate time (just now)
      const time = 'just now';
      
      // Generate wallet
      const wallet = `${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`;
      
      // Create new activity
      const newActivity: WhaleActivity = {
        symbol: randomToken,
        action,
        amount,
        time,
        price,
        wallet,
        dollarValue: Math.round(dollarValue)
      };
      
      // Update state
      setWhaleActivity(prev => {
        const updated = [newActivity, ...prev];
        return updated.slice(0, 5); // Keep only 5 most recent
      });
      
    }, 8000); // Update every 8 seconds
    
    return () => clearInterval(interval);
  }, [trendingTokens]);
  
  // Update trending tokens periodically with random price changes
  useEffect(() => {
    const interval = setInterval(() => {
      setTrendingTokens(prev => 
        prev.map(token => {
          // Random price change (-2% to +2%)
          const priceChange = token.price * (Math.random() * 0.04 - 0.02);
          
          // Update price
          const newPrice = Math.max(0.000001, token.price + priceChange);
          
          // Update 24h change (-1% to +1%)
          const change24hDelta = (Math.random() * 2) - 1;
          const newChange24h = Math.max(-15, Math.min(15, token.change24h + change24hDelta));
          
          // Random volume change (-5% to +5%)
          const volumeChange = (token.volume || 0) * (Math.random() * 0.1 - 0.05);
          const newVolume = Math.max(100000, (token.volume || 500000) + volumeChange);
          
          return {
            ...token,
            price: newPrice,
            change24h: newChange24h,
            volume: newVolume
          };
        })
      );
    }, 5000); // Update every 5 seconds
    
    return () => clearInterval(interval);
  }, []);
  
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

  const formatTradeResult = (result: any): string => {
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
      
      let result: any;
      
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
  
  // Quick buy function with settings
  const quickBuy = () => {
    setTradeType('buy');
    setInputAmount(tradeSettings.quickBuyAmount.toString());
    executeTrade();
  };

  // Quick sell function with settings
  const quickSell = () => {
    // Simulate selling a percentage of holdings
    const mockHoldings = 12500; // Mock token holdings
    const sellAmount = (mockHoldings * tradeSettings.quickSellPercentage / 100).toFixed(0);
    
    setTradeType('sell');
    setInputAmount(sellAmount);
    executeTrade();
  };
  
  // Sell all function
  const sellAll = () => {
    // Simulate selling all holdings
    const mockHoldings = 12500; // Mock token holdings
    
    setTradeType('sell');
    setInputAmount(mockHoldings.toString());
    executeTrade();
  };
  
  const updateTradeSetting = (setting: keyof TradeSettings, value: any) => {
    setTradeSettings({
      ...tradeSettings,
      [setting]: value
    });
  };

  return (
    <Card className="glass-card bg-gradient-to-br from-black/60 to-black/30 border-gray-800 shadow-lg">
      <Tabs defaultValue="trade" className="w-full">
        <TabsList className="grid grid-cols-4 gap-0">
          <TabsTrigger value="trade" className="flex items-center bg-gradient-to-r from-purple-500/10 to-blue-500/10">
            <ArrowRightLeft className="h-3 w-3 mr-2" /> Trade
          </TabsTrigger>
          <TabsTrigger value="trending" className="flex items-center">
            <TrendingUp className="h-3 w-3 mr-2" /> Trending
          </TabsTrigger>
          <TabsTrigger value="whales" className="flex items-center">
            <CircleDollarSign className="h-3 w-3 mr-2" /> Whales
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <ChartBar className="h-3 w-3 mr-2" /> Analytics
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="trade">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                {tokenLogo ? (
                  <img src={tokenLogo} alt={tokenName} className="w-6 h-6 rounded-full" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                    {tokenSymbol.charAt(0)}
                  </div>
                )}
                {tradeType === 'buy' ? 'Buy' : 'Sell'} {tokenSymbol}
              </h2>
              <div className="text-sm flex items-center gap-2">
                <span className="bg-gradient-to-r from-green-500 to-green-300 bg-clip-text text-transparent font-medium">${tokenPrice.toFixed(6)}</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-black/80 backdrop-blur-xl border-gray-700">
                    <div className="space-y-4">
                      <h4 className="font-medium text-base">Trade Settings</h4>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Auto Slippage</span>
                          <Switch 
                            checked={tradeSettings.autoSlippage} 
                            onCheckedChange={(checked) => updateTradeSetting('autoSlippage', checked)} 
                          />
                        </div>
                        
                        {!tradeSettings.autoSlippage && (
                          <div className="grid grid-cols-3 gap-2">
                            <Button 
                              size="sm" 
                              variant={tradeSettings.slippageTolerance === 0.1 ? "default" : "outline"}
                              onClick={() => updateTradeSetting('slippageTolerance', 0.1)}
                            >
                              0.1%
                            </Button>
                            <Button 
                              size="sm" 
                              variant={tradeSettings.slippageTolerance === 0.5 ? "default" : "outline"}
                              onClick={() => updateTradeSetting('slippageTolerance', 0.5)}
                            >
                              0.5%
                            </Button>
                            <Button 
                              size="sm" 
                              variant={tradeSettings.slippageTolerance === 1.0 ? "default" : "outline"}
                              onClick={() => updateTradeSetting('slippageTolerance', 1.0)}
                            >
                              1.0%
                            </Button>
                          </div>
                        )}
                        
                        <div className="pt-2">
                          <span className="text-sm">Gas Priority</span>
                          <div className="grid grid-cols-3 gap-2 mt-1">
                            <Button 
                              size="sm" 
                              variant={tradeSettings.gasPriority === 'low' ? "default" : "outline"}
                              onClick={() => updateTradeSetting('gasPriority', 'low')}
                            >
                              Low
                            </Button>
                            <Button 
                              size="sm" 
                              variant={tradeSettings.gasPriority === 'medium' ? "default" : "outline"}
                              onClick={() => updateTradeSetting('gasPriority', 'medium')}
                            >
                              Medium
                            </Button>
                            <Button 
                              size="sm" 
                              variant={tradeSettings.gasPriority === 'high' ? "default" : "outline"}
                              onClick={() => updateTradeSetting('gasPriority', 'high')}
                            >
                              High
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2 pt-2">
                          <span className="text-sm">Quick Trade Settings</span>
                          <div className="flex items-center justify-between">
                            <label className="text-xs text-gray-400">Quick Buy Amount (SOL)</label>
                            <Select 
                              value={tradeSettings.quickBuyAmount.toString()}
                              onValueChange={(value) => updateTradeSetting('quickBuyAmount', parseFloat(value))}
                            >
                              <SelectTrigger className="w-24 h-7">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="0.1">0.1</SelectItem>
                                <SelectItem value="0.5">0.5</SelectItem>
                                <SelectItem value="1">1.0</SelectItem>
                                <SelectItem value="5">5.0</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <label className="text-xs text-gray-400">Quick Sell (% of holdings)</label>
                            <Select 
                              value={tradeSettings.quickSellPercentage.toString()}
                              onValueChange={(value) => updateTradeSetting('quickSellPercentage', parseInt(value))}
                            >
                              <SelectTrigger className="w-24 h-7">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="10">10%</SelectItem>
                                <SelectItem value="25">25%</SelectItem>
                                <SelectItem value="50">50%</SelectItem>
                                <SelectItem value="75">75%</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-sm">Confirm Trades</span>
                          <Switch 
                            checked={tradeSettings.confirmTrades} 
                            onCheckedChange={(checked) => updateTradeSetting('confirmTrades', checked)} 
                          />
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant={tradeType === 'buy' ? 'default' : 'outline'}
                onClick={() => setTradeType('buy')}
                className={`flex-1 ${tradeType === 'buy' ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600' : ''}`}
              >
                Buy
              </Button>
              <Button 
                variant={tradeType === 'sell' ? 'default' : 'outline'}
                onClick={() => setTradeType('sell')}
                className={`flex-1 ${tradeType === 'sell' ? 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600' : ''}`}
              >
                Sell
              </Button>
            </div>
            
            <div className="grid gap-2">
              <div className="bg-black/40 backdrop-blur-md p-3 rounded-md">
                <div className="flex justify-between mb-1">
                  <label className="text-xs text-gray-400">
                    {tradeType === 'buy' ? 'SOL Amount' : `${tokenSymbol} Amount`}
                  </label>
                  <span className="text-xs text-gray-400">
                    Balance: {tradeType === 'buy' ? '2.45 SOL' : `12,500 ${tokenSymbol}`}
                  </span>
                </div>
                <Input 
                  type="number"
                  placeholder={`Enter ${tradeType === 'buy' ? 'SOL' : tokenSymbol} amount`}
                  value={inputAmount}
                  onChange={(e) => handleInputChange(e.target.value)}
                  ref={inputRef}
                  className="bg-black/30 border-gray-700"
                />
              </div>
              
              <div className="flex justify-center">
                <div className="bg-black/30 p-1 rounded-full">
                  <ArrowRightLeft className="h-4 w-4" />
                </div>
              </div>
              
              <div className="bg-black/40 backdrop-blur-md p-3 rounded-md">
                <div className="flex justify-between mb-1">
                  <label className="text-xs text-gray-400">
                    {tradeType === 'buy' ? `${tokenSymbol} Amount` : 'SOL Amount'}
                  </label>
                </div>
                <div className="bg-black/30 border border-gray-700 px-3 py-2 rounded-md flex justify-between">
                  <span>
                    {isEstimating ? 
                      <RefreshCw className="inline-block h-4 w-4 animate-spin" /> : 
                      estimatedAmount.toLocaleString(undefined, {maximumFractionDigits: 6})
                    }
                  </span>
                  <span className="text-gray-400">
                    {tradeType === 'buy' ? tokenSymbol : 'SOL'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Quick Trade Buttons */}
            <div className="grid grid-cols-3 gap-2">
              <Button 
                size="sm" 
                variant="secondary"
                className="bg-gradient-to-r from-green-600/30 to-green-400/20 hover:from-green-600/40 hover:to-green-400/30"
                onClick={quickBuy}
              >
                <CirclePlus className="h-4 w-4 mr-2" />
                Quick Buy
              </Button>
              <Button 
                size="sm" 
                variant="secondary"
                className="bg-gradient-to-r from-red-600/30 to-red-400/20 hover:from-red-600/40 hover:to-red-400/30"
                onClick={quickSell}
              >
                <CircleMinus className="h-4 w-4 mr-2" />
                Quick Sell
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                className="border-red-500/30 hover:bg-red-500/10 text-red-400"
                onClick={sellAll}
              >
                Sell All
              </Button>
            </div>
            
            {/* Gas Settings Summary */}
            <div className="flex items-center justify-between text-xs bg-black/40 p-2 rounded backdrop-blur-md">
              <div className="flex items-center space-x-1">
                <Fuel className="h-3 w-3" />
                <span>Gas: {tradeSettings.gasPriority}</span>
              </div>
              <span>Slippage: {tradeSettings.autoSlippage ? 'Auto' : `${tradeSettings.slippageTolerance}%`}</span>
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all"
              onClick={executeTrade}
              disabled={!connected || isBuying || isSelling}
              variant={tradeType === 'buy' ? "default" : "destructive"}
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
                    {tradeType === 'buy' ? 'Buy' : 'Sell'} {tokenSymbol}
                  </>
                )
              ) : (
                "Connect Wallet to Trade"
              )}
            </Button>
            
            {tradeResult && (
              <div className={`p-3 rounded-md backdrop-blur-md ${tradeResult.success ? 'bg-green-900/20 border border-green-500/30' : 'bg-red-900/20 border border-red-500/30'}`}>
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
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">Trending Tokens</h3>
              <div className="text-xs text-gray-400">
                Updates every 5s
              </div>
            </div>
            
            <div className="space-y-3">
              {trendingTokens.map((token, index) => (
                <div key={index} className="flex items-center justify-between bg-gradient-to-r from-black/40 to-black/20 hover:from-black/50 hover:to-black/30 transition-colors p-3 rounded-lg backdrop-blur-md">
                  <div className="flex items-center space-x-3">
                    {token.logo ? (
                      <img src={token.logo} alt={token.name} className="h-8 w-8 rounded-full" />
                    ) : (
                      <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {token.symbol.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{token.name}</p>
                      <p className="text-xs text-gray-400">{token.symbol}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">${token.price.toFixed(6)}</p>
                    <p className={`text-xs ${token.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(2)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <div className="text-sm font-medium mb-2">Market Sentiment</div>
              <div className="bg-black/30 p-3 rounded-md backdrop-blur-md">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Bullish</span>
                  <span className="text-green-500 text-sm">64%</span>
                </div>
                <div className="h-2 w-full bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-green-600 to-green-400" style={{ width: '64%' }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="whales">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-medium">Whale Activity</h3>
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> $10k+ trades
              </div>
            </div>
            
            <div className="space-y-3">
              {whaleActivity.map((activity, index) => (
                <div key={index} className="bg-gradient-to-r from-black/40 to-black/20 hover:from-black/50 hover:to-black/30 p-3 rounded-lg backdrop-blur-md">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <div className={`p-1 rounded-full ${activity.action === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                        {activity.action === 'buy' ? (
                          <TrendingUp className={`h-4 w-4 text-green-500`} />
                        ) : (
                          <TrendingDown className={`h-4 w-4 text-red-500`} />
                        )}
                      </div>
                      <div>
                        <span className="font-medium">{activity.symbol}</span>
                        <span className="text-xs text-gray-400 ml-2">{activity.wallet}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                  <p className="mt-1 text-sm">
                    Whale {activity.action === 'buy' ? 'bought' : 'sold'} <span className="font-medium">{activity.amount.toLocaleString()}</span> tokens
                    {activity.price && (
                      <span className="text-gray-400 ml-1">@ ${activity.price.toFixed(6)}</span>
                    )}
                    {activity.dollarValue && (
                      <span className="ml-1 text-xs bg-gradient-to-r from-amber-500 to-yellow-300 bg-clip-text text-transparent font-semibold">
                        (≈${activity.dollarValue.toLocaleString()})
                      </span>
                    )}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Button variant="secondary" size="sm" className="flex-1 bg-gradient-to-r from-blue-700/30 to-blue-500/20 hover:from-blue-700/40 hover:to-blue-500/30">
                      View Token
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Copy Trade
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="bg-black/30 p-3 rounded-md backdrop-blur-md">
              <p className="text-sm mb-2 flex justify-between">
                <span>Whale Alert Settings</span>
                <Switch checked={true} />
              </p>
              <p className="text-xs text-gray-400">
                Get notified when whale activity (trades over $10,000) is detected on tokens you follow.
              </p>
            </div>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="analytics">
          <CardContent className="space-y-4">
            <Card className="bg-black/30 border-gray-800 shadow-inner">
              <CardContent className="p-4">
                <div className="text-sm font-medium mb-2">Token Analytics</div>
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-gradient-to-br from-black/40 to-indigo-950/10 p-2 rounded backdrop-blur-md">
                      <div className="text-xs text-gray-400">24h Volume</div>
                      <div className="font-medium bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">$124,560</div>
                    </div>
                    <div className="bg-gradient-to-br from-black/40 to-indigo-950/10 p-2 rounded backdrop-blur-md">
                      <div className="text-xs text-gray-400">Market Cap</div>
                      <div className="font-medium bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">$1.5M</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-gradient-to-br from-black/40 to-indigo-950/10 p-2 rounded backdrop-blur-md">
                      <div className="text-xs text-gray-400">Holders</div>
                      <div className="font-medium bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">843</div>
                    </div>
                    <div className="bg-gradient-to-br from-black/40 to-indigo-950/10 p-2 rounded backdrop-blur-md">
                      <div className="text-xs text-gray-400">Trades (24h)</div>
                      <div className="font-medium bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">324</div>
                    </div>
                    <div className="bg-gradient-to-br from-black/40 to-indigo-950/10 p-2 rounded backdrop-blur-md">
                      <div className="text-xs text-gray-400">Buys / Sells</div>
                      <div className="font-medium bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">65% / 35%</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 gap-4">
              <TokenBondingCurve tokenSymbol={tokenSymbol} currentPrice={tokenPrice} />
              <DexScreenerListingProgress tokenSymbol={tokenSymbol} progress={65} />
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default EnhancedTradingInterface;
