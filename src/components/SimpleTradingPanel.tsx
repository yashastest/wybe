
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { 
  ArrowUpDown, 
  Loader2, 
  Flame,
  Snowflake,
  Rocket
} from 'lucide-react';
import { toast } from 'sonner';
import { useWallet } from '@/hooks/useWallet.tsx';
import { useTokenTrading } from '@/hooks/useTokenTrading';
import { ListedToken } from '@/services/token/types';

interface SimpleTradingPanelProps {
  selectedToken: ListedToken;
  solBalance: number;
  tokenBalance: number;
  isLoading: boolean;
}

const SimpleTradingPanel: React.FC<SimpleTradingPanelProps> = ({ 
  selectedToken, 
  solBalance, 
  tokenBalance,
  isLoading: tradingLoading 
}) => {
  const { connect, connected } = useWallet();
  const { buyTokens, sellTokens } = useTokenTrading(selectedToken?.symbol);
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<string>('');
  const [slippage, setSlippage] = useState<number>(1);
  const [gasPriority, setGasPriority] = useState<number>(2); // 1=Low, 2=Medium, 3=High
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Estimated values
  const [estimatedTokens, setEstimatedTokens] = useState<number>(0);
  const [estimatedSol, setEstimatedSol] = useState<number>(0);
  
  // Reset amount when switching tabs
  useEffect(() => {
    setAmount('');
    setEstimatedTokens(0);
    setEstimatedSol(0);
  }, [activeTab]);
  
  // Update estimates when amount changes
  useEffect(() => {
    const numericAmount = parseFloat(amount) || 0;
    
    if (numericAmount > 0) {
      if (activeTab === 'buy') {
        // Buying tokens with SOL
        const tokenPrice = selectedToken?.price || 0.001;
        const tokensEstimate = numericAmount / tokenPrice;
        setEstimatedTokens(tokensEstimate);
        setEstimatedSol(numericAmount);
      } else {
        // Selling tokens for SOL
        const tokenPrice = selectedToken?.price || 0.001;
        const solEstimate = numericAmount * tokenPrice;
        setEstimatedSol(solEstimate);
        setEstimatedTokens(numericAmount);
      }
    } else {
      setEstimatedTokens(0);
      setEstimatedSol(0);
    }
  }, [amount, activeTab, selectedToken?.price]);
  
  // Handle amount input change
  const handleAmountChange = (value: string) => {
    // Only allow numbers and decimals
    if (/^[0-9]*\.?[0-9]*$/.test(value) || value === '') {
      setAmount(value);
    }
  };
  
  // Handle max button click
  const handleMaxClick = () => {
    if (activeTab === 'buy') {
      // Set max SOL (leave some for gas)
      const maxSol = Math.max(0, solBalance - 0.01);
      setAmount(maxSol.toString());
    } else {
      // Set max token amount
      setAmount(tokenBalance.toString());
    }
  };
  
  // Handle trade execution
  const handleTrade = async () => {
    if (!connected) {
      try {
        await connect();
        toast.info("Please try your trade again after connecting");
        return;
      } catch (error) {
        toast.error("Failed to connect wallet");
        return;
      }
    }
    
    const numericAmount = parseFloat(amount);
    
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (activeTab === 'buy' && numericAmount > solBalance) {
      toast.error("Insufficient SOL balance");
      return;
    }
    
    if (activeTab === 'sell' && numericAmount > tokenBalance) {
      toast.error(`Insufficient ${selectedToken.symbol} balance`);
      return;
    }
    
    setIsLoading(true);
    
    try {
      let result;
      
      if (activeTab === 'buy') {
        result = await buyTokens(numericAmount, gasPriority);
      } else {
        result = await sellTokens(numericAmount, gasPriority);
      }
      
      if (result.success) {
        toast.success(`Successfully ${activeTab === 'buy' ? 'bought' : 'sold'} ${selectedToken.symbol}`);
        setAmount('');
      } else {
        toast.error(result.error || "Transaction failed");
      }
    } catch (error) {
      console.error("Trade error:", error);
      toast.error("Transaction failed");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Quick buy buttons (percentages of max)
  const renderQuickBuyButtons = () => {
    const percentages = [25, 50, 75, 100];
    return (
      <div className="flex gap-1 mt-2">
        {percentages.map(percent => (
          <Button
            key={percent}
            variant="outline"
            size="sm"
            className="flex-1 text-xs bg-[#1A1F2C]/60 hover:bg-[#232734] border-gray-700"
            onClick={() => {
              const maxAmount = activeTab === 'buy' 
                ? Math.max(0, solBalance - 0.01) 
                : tokenBalance;
              const amount = (maxAmount * (percent / 100)).toFixed(
                activeTab === 'buy' ? 4 : 6
              );
              setAmount(amount);
            }}
          >
            {percent}%
          </Button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Buy/Sell tabs */}
      <div className="flex rounded-lg overflow-hidden border border-gray-800">
        <button
          onClick={() => setActiveTab('buy')}
          className={`flex-1 py-2 flex items-center justify-center gap-1 ${
            activeTab === 'buy' 
              ? 'bg-green-600/20 text-green-400 border-b-2 border-green-500' 
              : 'bg-[#1A1F2C]/40 text-gray-300 hover:bg-[#1A1F2C]/60'
          }`}
        >
          <span>Buy</span>
          <Badge variant="outline" className="ml-1 bg-green-900/30 text-green-400 border-green-700/50">
            {selectedToken?.symbol}
          </Badge>
        </button>
        <button
          onClick={() => setActiveTab('sell')}
          className={`flex-1 py-2 flex items-center justify-center gap-1 ${
            activeTab === 'sell' 
              ? 'bg-red-600/20 text-red-400 border-b-2 border-red-500' 
              : 'bg-[#1A1F2C]/40 text-gray-300 hover:bg-[#1A1F2C]/60'
          }`}
        >
          <span>Sell</span>
          <Badge variant="outline" className="ml-1 bg-red-900/30 text-red-400 border-red-700/50">
            {selectedToken?.symbol}
          </Badge>
        </button>
      </div>
      
      {/* Amount input */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">
            {activeTab === 'buy' ? 'Amount (SOL)' : `Amount (${selectedToken?.symbol})`}
          </span>
          <span className="text-xs text-gray-400">
            Balance: {activeTab === 'buy' 
              ? `${solBalance.toFixed(4)} SOL` 
              : `${tokenBalance.toFixed(6)} ${selectedToken?.symbol}`
            }
          </span>
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="0.0"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            className="bg-[#1A1F2C]/40 border-gray-700"
          />
          <Button 
            variant="outline" 
            className="bg-[#1A1F2C]/40 border-gray-700"
            onClick={handleMaxClick}
          >
            Max
          </Button>
        </div>
        
        {/* Quick buy buttons */}
        {renderQuickBuyButtons()}
      </div>
      
      {/* Estimated output */}
      <div className="p-3 bg-[#1A1F2C]/40 rounded-md border border-gray-800">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-400">You will receive (estimated)</span>
          <span className="font-medium">
            {activeTab === 'buy' 
              ? `${estimatedTokens.toFixed(6)} ${selectedToken?.symbol}` 
              : `${estimatedSol.toFixed(4)} SOL`
            }
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Price</span>
          <span>${selectedToken?.price.toFixed(6)} per {selectedToken?.symbol}</span>
        </div>
      </div>
      
      {/* Gas priority */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Transaction Speed</span>
          <span className="text-sm">
            {gasPriority === 1 ? 'Low' : gasPriority === 2 ? 'Medium' : 'High'}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            className={`flex-1 ${gasPriority === 1 ? 'bg-blue-900/30 border-blue-700' : 'bg-transparent'}`}
            onClick={() => setGasPriority(1)}
          >
            <Snowflake className="h-4 w-4 mr-1" />
            Low
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`flex-1 ${gasPriority === 2 ? 'bg-orange-900/30 border-orange-700' : 'bg-transparent'}`}
            onClick={() => setGasPriority(2)}
          >
            <Flame className="h-4 w-4 mr-1" />
            Medium
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`flex-1 ${gasPriority === 3 ? 'bg-red-900/30 border-red-700' : 'bg-transparent'}`}
            onClick={() => setGasPriority(3)}
          >
            <Rocket className="h-4 w-4 mr-1" />
            High
          </Button>
        </div>
      </div>
      
      {/* Trade button */}
      <Button
        className={`w-full ${
          activeTab === 'buy' 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-red-600 hover:bg-red-700'
        }`}
        disabled={isLoading || tradingLoading || !amount || parseFloat(amount) <= 0}
        onClick={handleTrade}
      >
        {isLoading || tradingLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : !connected ? (
          'Connect Wallet'
        ) : (
          `${activeTab === 'buy' ? 'Buy' : 'Sell'} ${selectedToken?.symbol}`
        )}
      </Button>
      
      {/* Slippage tolerance */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Slippage Tolerance</span>
          <span className="text-sm">{slippage}%</span>
        </div>
        <Slider
          value={[slippage]}
          min={0.1}
          max={5}
          step={0.1}
          onValueChange={(value) => setSlippage(value[0])}
          className="mt-2"
        />
        <div className="flex justify-between text-xs text-gray-500">
          <span>0.1%</span>
          <span>5%</span>
        </div>
      </div>
    </div>
  );
};

export default SimpleTradingPanel;
