import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpDown, AlertCircle, Check, Loader, Wallet, ArrowDown, Star } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet.tsx';
import { motion } from 'framer-motion';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { tokenTradingService, TradeResult } from '@/services/tokenTradingService';
import { resolveAndFormat, estimateTokensFromSol, estimateSolFromTokens } from '@/utils/tradeUtils';

interface TradingInterfaceProps {
  tokenSymbol: string;
  tokenName: string;
  tokenPrice: number;
  tokenLogo?: string;
}

const TradingInterface: React.FC<TradingInterfaceProps> = ({
  tokenSymbol,
  tokenName,
  tokenPrice,
  tokenLogo
}) => {
  const { connected, address, connect } = useWallet();
  const { solBalance, tokenBalances, refreshBalances } = useWalletBalance(tokenSymbol);
  
  const [tab, setTab] = useState('buy');
  const [amount, setAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('0.00');
  const [gasPriority, setGasPriority] = useState(1); // Default gas priority multiplier
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastTradeResult, setLastTradeResult] = useState<TradeResult | null>(null);
  const [solAmount, setSolAmount] = useState('');
  const [estimatedTokens, setEstimatedTokens] = useState('0.0000');
  const [estimatedSol, setEstimatedSol] = useState('0.0000');
  const [isLoadingEstimate, setIsLoadingEstimate] = useState(false);
  
  // Get token balance if available
  const tokenBalance = tokenBalances[tokenSymbol]?.balance || 0;

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
          { id: toastId, description: result.error || 'Unknown error' }  // Using result.error instead of result.errorMessage
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

  return (
    <div className="bg-gradient-to-br from-indigo-950/80 to-purple-900/60 backdrop-blur-lg p-4 md:p-6 rounded-xl border border-white/10 shadow-glow-sm">
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
          
          {/* Gas Priority Slider */}
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
            <p className="text-xs text-gray-400 mt-2">
              Higher gas priority = faster transaction confirmation but slightly higher fees
            </p>
          </div>
          
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
    </div>
  );
};

export default TradingInterface;
