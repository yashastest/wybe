import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowUpDown, AlertCircle, Check, Loader, Wallet, ArrowDown, 
  Star, Settings, Zap, TrendingUp, ChevronRight, BarChart3, 
  Flame, Users, CircleDollarSign 
} from 'lucide-react';
import { Info } from './Icons'; // Import the Info icon from our custom Icons component
import { useWallet } from '@/hooks/useWallet.tsx';
import { motion } from 'framer-motion';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { tokenTradingService, TradeResult } from '@/services/tokenTradingService';
import { 
  resolveAndFormat, 
  estimateTokensFromSol, 
  estimateSolFromTokens 
} from '@/utils/tradeUtils';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface EnhancedTradingInterfaceProps {
  tokenSymbol: string;
  tokenName: string;
  tokenPrice: number;
  tokenLogo?: string;
}

// Generate demo booming coins data
const generateBoomingCoins = () => {
  const coins = [
    { symbol: "PEPE", name: "Pepe", change: 72.4, price: 0.00017 },
    { symbol: "BONK", name: "Bonk", change: 45.8, price: 0.00035 },
    { symbol: "SAMO", name: "Samoyedcoin", change: 38.2, price: 0.00124 },
    { symbol: "MEME", name: "Memecoin", change: 27.9, price: 0.00056 },
    { symbol: "DOGE", name: "Dogecoin", change: 18.6, price: 0.00087 }
  ];
  return coins.sort((a, b) => b.change - a.change);
};

// Generate demo whale activity data
const generateWhaleActivity = () => {
  const activities = [
    { symbol: "PEPE", amount: 2500000, time: "2m ago", type: "buy" },
    { symbol: "BONK", amount: 1800000, time: "15m ago", type: "sell" },
    { symbol: "WIF", amount: 3200000, time: "32m ago", type: "buy" },
    { symbol: "DOGE", amount: 1500000, time: "1h ago", type: "buy" }
  ];
  return activities;
};

// Generate demo retail activity data
const generateRetailActivity = () => {
  const activities = [
    { symbol: "SAMO", amount: 25000, time: "5m ago", type: "buy" },
    { symbol: "PEPE", amount: 18000, time: "12m ago", type: "buy" },
    { symbol: "BONK", amount: 32000, time: "45m ago", type: "buy" },
    { symbol: "MEME", amount: 15000, time: "1h ago", type: "sell" }
  ];
  return activities;
};

// Mini chart component
const MiniChart = ({ trend }: { trend: 'up' | 'down' | 'neutral' }) => {
  return (
    <div className="h-8 w-16">
      <svg viewBox="0 0 100 40" className="w-full h-full">
        <path 
          d={trend === 'up' 
            ? "M0,35 Q20,32 30,25 T50,15 T70,10 T100,5" 
            : trend === 'down' 
            ? "M0,5 Q20,8 30,15 T50,25 T70,30 T100,35"
            : "M0,20 Q20,22 30,18 T50,22 T70,18 T100,20"}
          fill="none" 
          stroke={trend === 'up' ? "#22C55E" : trend === 'down' ? "#EF4444" : "#8B5CF6"} 
          strokeWidth="3" 
        />
      </svg>
    </div>
  );
};

const EnhancedTradingInterface: React.FC<EnhancedTradingInterfaceProps> = ({
  tokenSymbol,
  tokenName,
  tokenPrice,
  tokenLogo
}) => {
  const { connected, address, connect } = useWallet();
  const { solBalance, tokenBalances, refreshBalances } = useWalletBalance(tokenSymbol);
  const navigate = useNavigate();
  
  const [tab, setTab] = useState('buy');
  const [advancedTab, setAdvancedTab] = useState('trading');
  const [amount, setAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('0.00');
  const [gasPriority, setGasPriority] = useState(1); // Default gas priority multiplier
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastTradeResult, setLastTradeResult] = useState<TradeResult | null>(null);
  const [solAmount, setSolAmount] = useState('');
  const [tokenAmount, setTokenAmount] = useState('');
  const [estimatedTokens, setEstimatedTokens] = useState('0.0000');
  const [estimatedSol, setEstimatedSol] = useState('0.0000');
  const [isLoadingEstimate, setIsLoadingEstimate] = useState(false);
  
  // Enhanced settings
  const [useAdvancedGas, setUseAdvancedGas] = useState(false);
  const [enableAutoSlippage, setEnableAutoSlippage] = useState(true);
  const [slippageTolerance, setSlippageTolerance] = useState(0.5);
  const [transactionDeadline, setTransactionDeadline] = useState(30);
  const [enableFlashbots, setEnableFlashbots] = useState(false);
  
  // Quick settings
  const [quickBuyAmount, setQuickBuyAmount] = useState(0.1); // Default quick buy amount in SOL
  
  // Trending data
  const [boomingCoins, setBoomingCoins] = useState<any[]>([]);
  const [whaleActivity, setWhaleActivity] = useState<any[]>([]);
  const [retailActivity, setRetailActivity] = useState<any[]>([]);
  
  // Get token balance if available
  const tokenBalance = tokenBalances[tokenSymbol]?.balance || 0;

  // Load demo data on component mount
  useEffect(() => {
    setBoomingCoins(generateBoomingCoins());
    setWhaleActivity(generateWhaleActivity());
    setRetailActivity(generateRetailActivity());
  }, []);

  // Calculate receive amount based on input and selected tab
  useEffect(() => {
    const calculateReceiveAmount = async () => {
      const parsedAmount = parseFloat(amount) || 0;
      
      try {
        if (tab === 'buy') {
          // Estimate token amount from SOL amount
          const tokenAmount = await tokenTradingService.estimateTokenAmount(tokenSymbol, parsedAmount);
          setReceiveAmount(tokenAmount.toFixed(2));
        } else {
          // Estimate SOL amount from token amount
          const solAmount = await tokenTradingService.estimateSolAmount(tokenSymbol, parsedAmount);
          setReceiveAmount(solAmount.toFixed(5));
        }
      } catch (error) {
        console.error('Error calculating receive amount:', error);
        setReceiveAmount('0.00');
      }
    };
    
    calculateReceiveAmount();
  }, [amount, tab, tokenSymbol, tokenPrice]);

  const handleMaxClick = () => {
    if (tab === 'buy') {
      // Use 95% of SOL balance to account for gas fees
      setAmount((solBalance * 0.95).toFixed(5));
    } else {
      // Use 100% of token balance
      setAmount(tokenBalance.toFixed(2));
    }
  };

  const handleTrade = async () => {
    if (!connected || !address) {
      connect();
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const parsedAmount = parseFloat(amount);

    // Validate balance
    if (tab === 'buy' && parsedAmount > solBalance) {
      toast.error('Insufficient SOL balance');
      return;
    }

    if (tab === 'sell' && parsedAmount > tokenBalance) {
      toast.error(`Insufficient ${tokenSymbol} balance`);
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(`${tab === 'buy' ? 'Buying' : 'Selling'} ${tokenSymbol}...`);

    try {
      const tradeParams = {
        walletAddress: address,
        tokenSymbol: tokenSymbol,
        action: tab as 'buy' | 'sell',
        gasPriority: gasPriority,
        [tab === 'buy' ? 'amountSol' : 'amountTokens']: parsedAmount
      };

      const result = await tokenTradingService.executeTrade(tradeParams);
      setLastTradeResult(result);

      if (result.success) {
        toast.success(
          `${tab === 'buy' ? 'Bought' : 'Sold'} ${tokenSymbol}`, 
          { 
            id: toastId,
            description: `${tab === 'buy' ? 'Purchased' : 'Sold'} ${result.amountTokens?.toFixed(2)} ${tokenSymbol} ${tab === 'buy' ? 'for' : 'and received'} ${result.amountSol?.toFixed(5)} SOL` 
          }
        );
        
        // Reset form
        setAmount('');
        setReceiveAmount('0.00');
        
        // Refresh balances
        setTimeout(() => refreshBalances(), 1000);
      } else {
        toast.error(
          `Failed to ${tab} ${tokenSymbol}`, 
          { id: toastId, description: result.error || 'Unknown error' }
        );
      }
    } catch (error) {
      console.error(`Error during ${tab}:`, error);
      toast.error(
        `Failed to ${tab} ${tokenSymbol}`, 
        { id: toastId, description: error instanceof Error ? error.message : 'Unknown error occurred' }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickBuy = async () => {
    if (!connected || !address) {
      connect();
      return;
    }

    if (quickBuyAmount <= 0 || quickBuyAmount > solBalance) {
      toast.error('Invalid quick buy amount or insufficient balance');
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(`Quick buying ${tokenSymbol}...`);

    try {
      const tradeParams = {
        walletAddress: address,
        tokenSymbol: tokenSymbol,
        action: 'buy' as const,
        gasPriority: 3, // Higher gas priority for quick buys
        amountSol: quickBuyAmount
      };

      const result = await tokenTradingService.executeTrade(tradeParams);

      if (result.success) {
        toast.success(
          `Quick bought ${tokenSymbol}`, 
          { 
            id: toastId,
            description: `Purchased ${result.amountTokens?.toFixed(2)} ${tokenSymbol} for ${result.amountSol?.toFixed(5)} SOL` 
          }
        );
        
        // Refresh balances
        setTimeout(() => refreshBalances(), 1000);
      } else {
        toast.error(
          `Quick buy failed`, 
          { id: toastId, description: result.error || 'Unknown error' }
        );
      }
    } catch (error) {
      console.error(`Error during quick buy:`, error);
      toast.error(
        `Quick buy failed`, 
        { id: toastId, description: error instanceof Error ? error.message : 'Unknown error occurred' }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickSell = async () => {
    if (!connected || !address) {
      connect();
      return;
    }

    if (tokenBalance <= 0) {
      toast.error(`No ${tokenSymbol} balance to sell`);
      return;
    }

    setIsSubmitting(true);
    const toastId = toast.loading(`Quick selling ${tokenSymbol}...`);

    try {
      const tradeParams = {
        walletAddress: address,
        tokenSymbol: tokenSymbol,
        action: 'sell' as const,
        gasPriority: 3, // Higher gas priority for quick sells
        amountTokens: tokenBalance * 0.25 // Sell 25% of balance by default
      };

      const result = await tokenTradingService.executeTrade(tradeParams);

      if (result.success) {
        toast.success(
          `Quick sold ${tokenSymbol}`, 
          { 
            id: toastId,
            description: `Sold ${result.amountTokens?.toFixed(2)} ${tokenSymbol} for ${result.amountSol?.toFixed(5)} SOL` 
          }
        );
        
        // Refresh balances
        setTimeout(() => refreshBalances(), 1000);
      } else {
        toast.error(
          `Quick sell failed`, 
          { id: toastId, description: result.error || 'Unknown error' }
        );
      }
    } catch (error) {
      console.error(`Error during quick sell:`, error);
      toast.error(
        `Quick sell failed`, 
        { id: toastId, description: error instanceof Error ? error.message : 'Unknown error occurred' }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSolAmountChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setSolAmount(e.target.value);
    
    if (value > 0) {
      setIsLoadingEstimate(true);
      const estimatedTokens = await estimateTokensFromSol(
        tokenTradingService, tokenSymbol, value
      );
      setEstimatedTokens(estimatedTokens);
      setIsLoadingEstimate(false);
    } else {
      setEstimatedTokens('0.0000');
    }
  };
  
  const handleTokenAmountChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setTokenAmount(e.target.value);
    
    if (value > 0) {
      setIsLoadingEstimate(true);
      const estimatedSol = await estimateSolFromTokens(
        tokenTradingService, tokenSymbol, value
      );
      setEstimatedSol(estimatedSol);
      setIsLoadingEstimate(false);
    } else {
      setEstimatedSol('0.0000');
    }
  };

  const handleGoToToken = (symbol: string) => {
    navigate(`/trade/${symbol.toLowerCase()}`);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-950/80 to-purple-900/60 backdrop-blur-lg p-4 md:p-6 rounded-xl border border-white/10 shadow-glow-sm">
      <Tabs defaultValue="trading" value={advancedTab} onValueChange={setAdvancedTab} className="mb-6">
        <TabsList className="grid grid-cols-3 bg-black/40 backdrop-blur mb-4">
          <TabsTrigger value="trading" className="text-xs md:text-sm">
            <ArrowUpDown className="md:mr-2 h-4 w-4" />
            <span className="hidden md:inline">Trading</span>
          </TabsTrigger>
          <TabsTrigger value="trending" className="text-xs md:text-sm">
            <Flame className="md:mr-2 h-4 w-4" />
            <span className="hidden md:inline">Trending</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs md:text-sm">
            <Settings className="md:mr-2 h-4 w-4" />
            <span className="hidden md:inline">Settings</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="trading" className="mt-0">
          <h2 className="text-lg md:text-xl font-poppins font-bold mb-4 md:mb-6 flex items-center">
            <Star size={18} className="mr-2 text-orange-500" />
            <span className="bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent">
              Trade {tokenSymbol}
            </span>
          </h2>
          
          {/* Wallet Balance Display */}
          {connected && (
            <div className="mb-4 p-3 bg-indigo-900/40 rounded-lg border border-indigo-500/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-300 text-sm">Your Wallet</span>
                <span className="text-indigo-200 text-xs font-mono">{address?.substring(0, 6)}...{address?.substring(address.length - 4)}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-gray-400 text-sm">SOL Balance</span>
                <span className="font-mono text-white">{solBalance.toFixed(5)} SOL</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 text-sm">{tokenSymbol} Balance</span>
                <span className="font-mono text-white">{tokenBalance.toLocaleString(undefined, {maximumFractionDigits: 2})} {tokenSymbol}</span>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <Button
              onClick={handleQuickBuy}
              disabled={isSubmitting || !connected}
              className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white rounded-lg font-bold shadow-lg hover:shadow-green-600/30 transition-all"
            >
              <Zap size={16} className="mr-1" />
              Quick Buy
            </Button>
            <Button
              onClick={handleQuickSell}
              disabled={isSubmitting || !connected || tokenBalance <= 0}
              className="bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white rounded-lg font-bold shadow-lg hover:shadow-red-600/30 transition-all"
            >
              <Zap size={16} className="mr-1" />
              Quick Sell
            </Button>
          </div>
          
          <Tabs defaultValue="buy" value={tab} onValueChange={setTab}>
            <TabsList className="mb-4 md:mb-6 grid grid-cols-2 bg-black/40 backdrop-blur">
              <TabsTrigger
                value="buy"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600/50 data-[state=active]:to-emerald-600/20 data-[state=active]:text-green-400 font-poppins font-bold"
              >
                Buy
              </TabsTrigger>
              <TabsTrigger
                value="sell"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/50 data-[state=active]:to-rose-600/20 data-[state=active]:text-red-400 font-poppins font-bold"
              >
                Sell
              </TabsTrigger>
            </TabsList>
            
            <div className="space-y-4 md:space-y-6">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="block text-sm text-indigo-200 font-mono">
                    {tab === 'buy' ? 'Pay with SOL' : `Sell ${tokenSymbol}`}
                  </label>
                  
                  {connected && (
                    <button 
                      onClick={handleMaxClick}
                      className="text-xs text-indigo-300 hover:text-indigo-100 transition-colors"
                    >
                      {tab === 'buy' ? 'Use Max Balance' : 'Sell All'}
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="bg-black/30 border-white/10 font-mono text-base h-10 md:h-12 focus:border-indigo-500 focus:ring-indigo-500/30 rounded-xl"
                    disabled={isSubmitting}
                  />
                  <div className="absolute top-0 right-0 h-full px-3 flex items-center font-mono text-indigo-200">
                    {tab === 'buy' ? 'SOL' : tokenSymbol}
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <motion.div 
                  className="bg-gradient-to-r from-indigo-600/30 to-purple-600/30 p-2 rounded-full"
                  animate={{
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  <ArrowUpDown size={20} className="text-indigo-300" />
                </motion.div>
              </div>
              
              <div>
                <label className="block text-sm text-indigo-200 mb-1 md:mb-2 font-mono">
                  {tab === 'buy' ? `Receive ${tokenSymbol}` : 'Receive SOL'}
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    value={receiveAmount}
                    disabled
                    className="bg-black/30 border-white/10 font-mono text-base h-10 md:h-12 rounded-xl"
                  />
                  <div className="absolute top-0 right-0 h-full px-3 flex items-center font-mono text-indigo-200">
                    {tab === 'buy' ? tokenSymbol : 'SOL'}
                  </div>
                </div>
              </div>
              
              {/* Gas Advanced Settings */}
              {useAdvancedGas ? (
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="gas-settings" className="border-indigo-500/20">
                    <AccordionTrigger className="text-sm text-indigo-200 hover:text-indigo-100 py-2">
                      Advanced Gas Settings
                    </AccordionTrigger>
                    <AccordionContent className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-indigo-200">Gas Priority</span>
                          <span className="text-xs font-mono text-indigo-300">{gasPriority}x</span>
                        </div>
                        <Slider
                          value={[gasPriority]}
                          min={1}
                          max={5}
                          step={0.5}
                          onValueChange={([value]) => setGasPriority(value)}
                          disabled={isSubmitting}
                          className="py-1"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Switch 
                            id="flashbots" 
                            checked={enableFlashbots} 
                            onCheckedChange={setEnableFlashbots}
                          />
                          <Label htmlFor="flashbots" className="text-sm text-indigo-200">Use Flashbots</Label>
                        </div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Info size={14} className="text-indigo-400" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs max-w-[200px]">
                                Flashbots protects your transaction from front-running and sandwich attacks.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Switch 
                              id="auto-slippage" 
                              checked={enableAutoSlippage} 
                              onCheckedChange={setEnableAutoSlippage}
                            />
                            <Label htmlFor="auto-slippage" className="text-sm text-indigo-200">Auto Slippage</Label>
                          </div>
                          
                          {!enableAutoSlippage && (
                            <span className="text-xs font-mono text-indigo-300">{slippageTolerance}%</span>
                          )}
                        </div>
                        
                        {!enableAutoSlippage && (
                          <Slider
                            value={[slippageTolerance]}
                            min={0.1}
                            max={5}
                            step={0.1}
                            onValueChange={([value]) => setSlippageTolerance(value)}
                            disabled={enableAutoSlippage || isSubmitting}
                            className="py-1"
                          />
                        )}
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-indigo-200">Transaction Deadline</span>
                          <span className="text-xs font-mono text-indigo-300">{transactionDeadline} mins</span>
                        </div>
                        <Select
                          value={transactionDeadline.toString()}
                          onValueChange={(value) => setTransactionDeadline(parseInt(value))}
                          disabled={isSubmitting}
                        >
                          <SelectTrigger className="bg-black/30 border-white/10">
                            <SelectValue placeholder="Select deadline" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 minutes</SelectItem>
                            <SelectItem value="10">10 minutes</SelectItem>
                            <SelectItem value="20">20 minutes</SelectItem>
                            <SelectItem value="30">30 minutes</SelectItem>
                            <SelectItem value="60">60 minutes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <div className="p-3 bg-black/30 rounded-lg border border-white/5">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-indigo-200">Gas Priority</span>
                    <span className="text-xs font-mono text-indigo-300">{gasPriority}x</span>
                  </div>
                  <Slider
                    value={[gasPriority]}
                    min={1}
                    max={5}
                    step={0.5}
                    onValueChange={([value]) => setGasPriority(value)}
                    disabled={isSubmitting}
                    className="py-1"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-400">
                      Higher gas = faster confirmation
                    </p>
                    <Button 
                      variant="link" 
                      className="text-xs text-indigo-300 p-0 h-auto" 
                      onClick={() => setUseAdvancedGas(true)}
                    >
                      Advanced
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="pt-1 md:pt-2">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    onClick={handleTrade}
                    disabled={isSubmitting}
                    className={`w-full py-4 md:py-6 font-poppins font-bold text-sm md:text-base rounded-xl flex items-center justify-center ${
                      tab === 'buy'
                        ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:shadow-[0_0_20px_rgba(34,197,94,0.7)]'
                        : 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:shadow-[0_0_20px_rgba(239,68,68,0.7)]'
                    } transition-all duration-300`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader className="mr-2 h-5 w-5 animate-spin" />
                        {tab === 'buy' ? 'Buying...' : 'Selling...'}
                      </>
                    ) : !connected ? (
                      <>
                        <Wallet className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                        Connect Wallet
                      </>
                    ) : tab === 'buy' ? (
                      <>
                        <ArrowDown className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                        Buy {tokenSymbol}
                      </>
                    ) : (
                      <>
                        <ArrowDown className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                        Sell {tokenSymbol}
                      </>
                    )}
                  </Button>
                </motion.div>
              </div>
              
              <motion.div 
                className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 p-3 md:p-4 rounded-xl border border-indigo-500/20 text-xs md:text-sm"
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(139, 92, 246, 0.2)",
                    "0 0 15px rgba(139, 92, 246, 0.4)",
                    "0 0 10px rgba(139, 92, 246, 0.2)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <h3 className="font-poppins font-bold mb-2 text-indigo-200">Trade Information</h3>
                <div className="space-y-1 md:space-y-2 font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Price</span>
                    <span className="text-white">{tokenPrice.toFixed(6)} SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Platform Fee</span>
                    <span className="text-white">1%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Creator Fee</span>
                    <span className="text-white">1%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Gas Priority</span>
                    <span className="text-white">{gasPriority}x</span>
                  </div>
                  {useAdvancedGas && !enableAutoSlippage && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Slippage Tolerance</span>
                      <span className="text-white">{slippageTolerance}%</span>
                    </div>
                  )}
                </div>
              </motion.div>
              
              {/* Warning for low balance */}
              {connected && tab === 'buy' && parseFloat(amount || '0') > solBalance && (
                <div className="bg-red-900/30 border border-red-500/30 p-3 rounded-lg flex items-start gap-2">
                  <AlertCircle size={16} className="text-red-400 mt-0.5" />
                  <p className="text-xs text-red-200">
                    Insufficient SOL balance. You need at least {parseFloat(amount).toFixed(5)} SOL for this transaction.
                  </p>
                </div>
              )}
              
              {connected && tab === 'sell' && parseFloat(amount || '0') > tokenBalance && (
                <div className="bg-red-900/30 border border-red-500/30 p-3 rounded-lg flex items-start gap-2">
                  <AlertCircle size={16} className="text-red-400 mt-0.5" />
                  <p className="text-xs text-red-200">
                    Insufficient {tokenSymbol} balance. You need at least {parseFloat(amount).toFixed(2)} {tokenSymbol} for this transaction.
                  </p>
                </div>
              )}
              
              {/* Last transaction success message */}
              {lastTradeResult?.success && (
                <div className="bg-green-900/30 border border-green-500/30 p-3 rounded-lg flex items-start gap-2">
                  <Check size={16} className="text-green-400 mt-0.5" />
                  <div className="text-xs text-green-200">
                    <p className="font-medium">Transaction Successful!</p>
                    <p className="mt-1 font-mono">
                      {tab === 'buy' 
                        ? `Bought ${lastTradeResult.amountTokens?.toFixed(2)} ${tokenSymbol} for ${lastTradeResult.amountSol?.toFixed(5)} SOL`
                        : `Sold ${lastTradeResult.amountTokens?.toFixed(2)} ${tokenSymbol} for ${lastTradeResult.amountSol?.toFixed(5)} SOL`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Tabs>
        </TabsContent>
        
        <TabsContent value="trending" className="mt-0 space-y-6">
          <div>
            <h3 className="text-base font-semibold mb-3 flex items-center">
              <Flame size={16} className="text-orange-500 mr-2" />
              Booming Coins
            </h3>
            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
              {boomingCoins.map((coin) => (
                <motion.div
                  key={coin.symbol}
                  className="p-3 bg-gradient-to-r from-indigo-900/30 to-purple-900/20 rounded-lg border border-indigo-500/20 flex items-center"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  onClick={() => handleGoToToken(coin.symbol)}
                >
                  <div className="mr-3 p-2 bg-indigo-900/50 rounded-full">
                    <TrendingUp size={16} className="text-green-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="font-medium">{coin.name}</span>
                      <div className="text-green-400 text-sm font-medium">+{coin.change}%</div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-400">{coin.symbol}</span>
                      <span className="text-xs font-mono">{coin.price.toFixed(6)} SOL</span>
                    </div>
                  </div>
                  <MiniChart trend="up" />
                  <ChevronRight size={16} className="ml-2 text-gray-500" />
                </motion.div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-base font-semibold mb-3 flex items-center">
              <BadgeDollarSign size={16} className="text-blue-400 mr-2" />
              Whale Activity
            </h3>
            <Card className="bg-gradient-to-r from-blue-900/20 to-indigo-900/10 border-blue-500/20">
              <CardContent className="p-3 space-y-3 max-h-[200px] overflow-y-auto">
                {whaleActivity.map((activity, i) => (
                  <div key={`whale-${i}`} className="flex items-center justify-between border-b border-blue-500/10 pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-full ${activity.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {activity.type === 'buy' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          {activity.symbol}
                        </div>
                        <div className="text-xs text-gray-400">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono">
                        {activity.amount.toLocaleString()}
                      </div>
                      <Button 
                        variant="link" 
                        className="text-xs text-blue-400 p-0 h-auto"
                        onClick={() => handleGoToToken(activity.symbol)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <h3 className="text-base font-semibold mb-3 flex items-center">
              <Users size={16} className="text-purple-400 mr-2" />
              Retail Activity
            </h3>
            <Card className="bg-gradient-to-r from-purple-900/20 to-indigo-900/10 border-purple-500/20">
              <CardContent className="p-3 space-y-3 max-h-[200px] overflow-y-auto">
                {retailActivity.map((activity, i) => (
                  <div key={`retail-${i}`} className="flex items-center justify-between border-b border-purple-500/10 pb-2 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-full ${activity.type === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {activity.type === 'buy' ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                      </div>
                      <div>
                        <div className="text-sm font-medium">
                          {activity.symbol}
                        </div>
                        <div className="text-xs text-gray-400">
                          {activity.time}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-mono">
                        {activity.amount.toLocaleString()}
                      </div>
                      <Button 
                        variant="link" 
                        className="text-xs text-purple-400 p-0 h-auto"
                        onClick={() => handleGoToToken(activity.symbol)}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-0 space-y-6">
          <h3 className="text-base font-semibold mb-3 flex items-center">
            <Settings size={16} className="text-indigo-400 mr-2" />
            Trading Settings
          </h3>
          
          <div className="space-y-4">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="quickBuy" className="text-sm">Quick Buy Amount (SOL)</Label>
                <span className="text-xs font-mono">{quickBuyAmount} SOL</span>
              </div>
              <Slider
                id="quickBuy"
                value={[quickBuyAmount]}
                min={0.01}
                max={Math.max(0.5, solBalance)}
                step={0.01}
                onValueChange={([value]) => setQuickBuyAmount(value)}
              />
              <div className="grid grid-cols-4 gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setQuickBuyAmount(0.05)}
                  className="text-xs h-8"
                >
                  0.05
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setQuickBuyAmount(0.1)}
                  className="text-xs h-8"
                >
                  0.1
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setQuickBuyAmount(0.25)}
                  className="text-xs h-8"
                >
                  0.25
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setQuickBuyAmount(0.5)}
                  className="text-xs h-8"
                >
                  0.5
                </Button>
              </div>
            </div>
            
            <Card className="bg-gradient-to-r from-indigo-900/20 to-purple-900/10 border-indigo-500/20">
              <CardContent className="p-4 space-y-4">
                <h4 className="text-sm font-medium">Gas Optimization</h4>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="advanced-gas" 
                      checked={useAdvancedGas}
                      onCheckedChange={setUseAdvancedGas}
                    />
                    <Label htmlFor="advanced-gas" className="text-sm">Advanced Gas Settings</Label>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="flashbots-enabled" 
                      checked={enableFlashbots}
                      onCheckedChange={setEnableFlashbots}
                    />
                    <Label htmlFor="flashbots-enabled" className="text-sm">Use Flashbots</Label>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info size={14} className="text-indigo-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-[200px]">
                          Flashbots protects your transaction from front-running and sandwich attacks.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Switch 
                      id="auto-slippage-enabled" 
                      checked={enableAutoSlippage}
                      onCheckedChange={setEnableAutoSlippage}
                    />
                    <Label htmlFor="auto-slippage-enabled" className="text-sm">Auto Slippage</Label>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info size={14} className="text-indigo-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs max-w-[200px]">
                          Automatically calculate the optimal slippage tolerance for each transaction.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-indigo-900/20 to-purple-900/10 border-indigo-500/20">
              <CardContent className="p-4">
                <h4 className="text-sm font-medium mb-3">Display Options</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="chart-type" className="text-sm">Default Chart Type</Label>
                    <Select
                      id="chart-type"
                      value={chartType}
                      onValueChange={(value) => setChartType(value as 'price' | 'marketCap')}
                    >
                      <SelectTrigger className="w-32 bg-black/30 border-white/10 h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price">Price</SelectItem>
                        <SelectItem value="marketCap">Market Cap</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedTradingInterface;
