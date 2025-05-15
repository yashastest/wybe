
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpDown, AlertCircle, Check, Loader, Wallet, ArrowDown, Star, PocketKnife, Percent } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet.tsx';
import { motion } from 'framer-motion';
import { useTokenTrading } from '@/hooks/useTokenTrading';
import { tokenTradingService } from '@/services/tokenTradingService';

interface EnhancedTradingInterfaceProps {
  tokenSymbol: string;
  tokenName: string;
  tokenPrice: number;
  tokenLogo?: string;
}

const EnhancedTradingInterface: React.FC<EnhancedTradingInterfaceProps> = ({
  tokenSymbol,
  tokenName,
  tokenPrice,
  tokenLogo
}) => {
  const { connected, address, connect, isSolanaAvailable } = useWallet();
  const { 
    buyTokens, 
    sellTokens, 
    sellAllTokens, 
    isLoading, 
    solBalance, 
    tokenBalance 
  } = useTokenTrading(tokenSymbol);
  
  const [tab, setTab] = useState('buy');
  const [amount, setAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('0.00');
  const [gasPriority, setGasPriority] = useState(3); // Default to high gas priority
  
  // Calculate receive amount based on input and selected tab
  useEffect(() => {
    const parsedAmount = parseFloat(amount) || 0;
    
    if (tab === 'buy') {
      // Estimate token amount from SOL amount
      const tokenAmount = tokenTradingService.estimateTokenAmount(
        tokenSymbol, 
        parsedAmount, 
        'buy'
      );
      setReceiveAmount(tokenAmount ? tokenAmount.toFixed(2) : '0.00');
    } else {
      // Estimate SOL amount from token amount
      const solAmount = tokenTradingService.estimateSolAmount(
        tokenSymbol, 
        parsedAmount, 
        'sell'
      );
      setReceiveAmount(solAmount ? solAmount.toFixed(5) : '0.00');
    }
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

    if (tab === 'buy') {
      await buyTokens(parsedAmount, gasPriority);
    } else {
      await sellTokens(parsedAmount, gasPriority);
    }

    // Reset input field after transaction attempt
    setAmount('');
  };

  const handleSellAll = async () => {
    if (!connected || !address) {
      connect();
      return;
    }

    await sellAllTokens(gasPriority);
    
    // Reset input field after transaction attempt
    setAmount('');
  };
  
  // Detect Phantom wallet
  useEffect(() => {
    const checkPhantomWallet = () => {
      if (window.solana && window.solana.isPhantom) {
        console.log("Phantom wallet detected");
      }
    };
    
    checkPhantomWallet();
    const interval = setInterval(checkPhantomWallet, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-br from-indigo-950/80 to-purple-900/60 backdrop-blur-lg p-4 md:p-6 rounded-xl border border-white/10 shadow-glow-sm">
      <h2 className="text-lg md:text-xl font-poppins font-bold mb-4 md:mb-6 flex items-center">
        <Star size={18} className="mr-2 text-orange-500" />
        <span className="bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent">
          Trade {tokenSymbol}
        </span>
      </h2>
      
      {/* Wallet Connection Status */}
      {!connected && (
        <div className="mb-4 p-3 bg-indigo-900/40 rounded-lg border border-indigo-500/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-300 text-sm">Wallet Status</span>
            <span className="text-red-400 text-xs font-mono flex items-center">
              <AlertCircle size={12} className="mr-1" /> Not Connected
            </span>
          </div>
          <div className="mb-2">
            {isSolanaAvailable ? (
              <div className="text-xs text-green-400 flex items-center">
                <Check size={12} className="mr-1" /> Phantom wallet detected
              </div>
            ) : (
              <div className="text-xs text-yellow-400">
                Phantom wallet not detected. Install Phantom for best experience.
              </div>
            )}
          </div>
          <Button 
            onClick={connect} 
            variant="default" 
            className="w-full bg-indigo-600 hover:bg-indigo-700"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Connect Wallet
          </Button>
        </div>
      )}
      
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
                disabled={isLoading}
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
              <span className="text-sm text-indigo-200 flex items-center">
                <Percent size={14} className="mr-1 text-indigo-400" />
                Gas Priority
              </span>
              <span className="text-xs font-mono text-indigo-300">{gasPriority}x</span>
            </div>
            <Slider
              value={[gasPriority]}
              min={1}
              max={5}
              step={0.5}
              onValueChange={([value]) => setGasPriority(value)}
              disabled={isLoading}
              className="py-1"
            />
            <p className="text-xs text-gray-400 mt-2">
              Higher gas priority = faster transaction confirmation but slightly higher fees
            </p>
          </div>
          
          {/* Trading Buttons */}
          <div className="pt-1 md:pt-2 space-y-3">
            {/* Main Buy/Sell Button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={handleTrade}
                disabled={isLoading}
                className={`w-full py-4 md:py-6 font-poppins font-bold text-sm md:text-base rounded-xl flex items-center justify-center ${
                  tab === 'buy'
                    ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:shadow-[0_0_20px_rgba(34,197,94,0.7)]'
                    : 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:shadow-[0_0_20px_rgba(239,68,68,0.7)]'
                } transition-all duration-300`}
              >
                {isLoading ? (
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
            
            {/* Quick Action Buttons for Sell Tab */}
            {tab === 'sell' && connected && (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={handleMaxClick}
                  disabled={isLoading || tokenBalance <= 0}
                  variant="outline"
                  className="bg-black/30 border-red-500/30 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                >
                  <Percent className="mr-2 h-4 w-4" />
                  Sell 100%
                </Button>
                <Button
                  onClick={handleSellAll}
                  disabled={isLoading || tokenBalance <= 0}
                  variant="outline"
                  className="bg-black/30 border-red-500/30 text-red-400 hover:bg-red-900/20 hover:text-red-300"
                >
                  <PocketKnife className="mr-2 h-4 w-4" />
                  Sell All Holdings
                </Button>
              </div>
            )}
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
        </div>
      </Tabs>
    </div>
  );
};

export default EnhancedTradingInterface;
