import React, { useState } from 'react';
import { useWallet } from '@/hooks/useWallet.tsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ArrowDown, Info } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tokenTradingService } from '@/services/tokenTradingService';
import { TradeResult } from '@/services/token/types';
import { Skeleton } from './ui/skeleton';

interface TradingInterfaceProps {
  tokenSymbol: string;
  tokenName: string;
  tokenImage?: string;
}

const TradingInterface: React.FC<TradingInterfaceProps> = ({ tokenSymbol, tokenName, tokenImage }) => {
  const { address: walletAddress, connected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<string>('');
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
  const [estimatedTokens, setEstimatedTokens] = useState<number | null>(null);
  const [gasPriority, setGasPriority] = useState<string>('medium');
  
  // Update estimated values when amount changes
  const handleAmountChange = async (value: string) => {
    setAmount(value);
    
    if (!value || isNaN(parseFloat(value))) {
      setEstimatedPrice(null);
      setEstimatedTokens(null);
      return;
    }
    
    try {
      const numberAmount = parseFloat(value);
      
      if (activeTab === 'buy') {
        // Buying with SOL, estimate tokens received
        const tokens = await tokenTradingService.estimateTokenAmount(tokenSymbol, numberAmount);
        setEstimatedTokens(tokens);
        setEstimatedPrice(numberAmount / tokens);
      } else {
        // Selling tokens, estimate SOL received
        const sol = await tokenTradingService.estimateSolAmount(tokenSymbol, numberAmount);
        setEstimatedPrice(sol / numberAmount);
        setEstimatedTokens(sol);
      }
    } catch (error) {
      console.error("Error estimating:", error);
    }
  };
  
  // Handle trade execution
  const executeTrade = async () => {
    if (!connected || !walletAddress) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const tradeParams = {
        walletAddress,
        tokenSymbol,
        action: activeTab,
        gasPriority: gasPriority as 'low' | 'medium' | 'high',
      };
      
      if (activeTab === 'buy') {
        // @ts-ignore - adding dynamic property
        tradeParams.amountSol = parseFloat(amount);
      } else {
        // @ts-ignore - adding dynamic property
        tradeParams.amountTokens = parseFloat(amount);
      }
      
      const result = await tokenTradingService.executeTrade(tradeParams);
      
      if (result.success) {
        toast.success(`Transaction successful! ${
          activeTab === 'buy' 
            ? `Bought ${estimatedTokens?.toFixed(2)} ${tokenSymbol}`
            : `Sold ${amount} ${tokenSymbol}`
        }`);
        setAmount('');
        setEstimatedPrice(null);
        setEstimatedTokens(null);
      } else {
        toast.error(`Transaction failed: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Trade execution error:", error);
      toast.error("Failed to execute trade");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update the calculateFee function to fix the type error
  const calculateFee = () => {
    if (!amount || isNaN(parseFloat(amount))) return 0;
    const baseAmount = parseFloat(amount);
    return activeTab === 'buy' 
      ? baseAmount * 0.025 
      : (estimatedTokens || 0) * 0.025;
  };
  
  const calculateTotal = () => {
    if (!amount || isNaN(parseFloat(amount))) return 0;
    const baseAmount = parseFloat(amount);
    const fee = calculateFee();
    
    return activeTab === 'buy'
      ? baseAmount - fee
      : (estimatedTokens || 0) - fee;
  };

  return (
    <div className="space-y-4">
      {/* Trading tabs */}
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant={activeTab === 'buy' ? 'default' : 'outline'}
          onClick={() => setActiveTab('buy')}
          className={activeTab === 'buy' ? 'bg-green-600 hover:bg-green-700' : ''}
          disabled={isLoading}
        >
          Buy
        </Button>
        <Button 
          variant={activeTab === 'sell' ? 'default' : 'outline'}
          onClick={() => setActiveTab('sell')}
          className={activeTab === 'sell' ? 'bg-red-600 hover:bg-red-700' : ''}
          disabled={isLoading}
        >
          Sell
        </Button>
      </div>
      
      {/* Input fields */}
      <div className="space-y-6 mt-2">
        <div className="space-y-2">
          <label className="text-sm text-gray-400">
            {activeTab === 'buy' ? 'Amount (SOL)' : `Amount (${tokenSymbol})`}
          </label>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              disabled={isLoading}
              className="flex-1"
              step="0.01"
              min="0"
            />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleAmountChange(activeTab === 'buy' ? '0.1' : '100')}
              disabled={isLoading}
            >
              Min
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleAmountChange(activeTab === 'buy' ? '1' : '1000')}
              disabled={isLoading}
            >
              Max
            </Button>
          </div>
        </div>
        
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center justify-center">
            <ArrowDown className="h-6 w-6 p-1 bg-black border border-gray-700 rounded-full" />
          </div>
          <div className="border-t border-gray-800"></div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm text-gray-400">
            {activeTab === 'buy' ? `Estimated ${tokenSymbol}` : 'Estimated SOL'}
          </label>
          <div className="p-3 bg-black/20 rounded border border-gray-800">
            {isLoading ? (
              <Skeleton className="h-6 w-full bg-gray-800" />
            ) : (
              <div className="flex items-center justify-between">
                <div className="font-mono">
                  {estimatedTokens 
                    ? activeTab === 'buy' 
                      ? estimatedTokens.toFixed(2)
                      : estimatedTokens.toFixed(4)
                    : '0.00'
                  }
                </div>
                <div className="text-sm text-gray-400">
                  {activeTab === 'buy' ? tokenSymbol : 'SOL'}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>Price per token:</span>
            <span>{estimatedPrice ? `${estimatedPrice.toFixed(6)} SOL` : 'N/A'}</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Gas Priority</label>
          <Select
            defaultValue={gasPriority}
            onValueChange={setGasPriority}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Gas Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low (Slower)</SelectItem>
              <SelectItem value="medium">Medium (Recommended)</SelectItem>
              <SelectItem value="high">High (Faster)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2 pt-2">
          <div className="flex items-center justify-between text-sm">
            <span>Fee (2.5%):</span>
            <span>
              {activeTab === 'buy' 
                ? `${calculateFee().toFixed(4)} SOL`
                : `${calculateFee().toFixed(2)} ${activeTab === 'buy' ? tokenSymbol : 'SOL'}`
              }
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm font-bold">
            <span>You will receive:</span>
            <span>
              {activeTab === 'buy' 
                ? `${estimatedTokens?.toFixed(2) || '0.00'} ${tokenSymbol}`
                : `${calculateTotal().toFixed(4)} SOL`
              }
            </span>
          </div>
        </div>
        
        <Button
          className={`w-full ${activeTab === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
          disabled={!connected || isLoading || !amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0}
          onClick={executeTrade}
        >
          {isLoading ? (
            "Processing..."
          ) : !connected ? (
            "Connect Wallet"
          ) : (
            `${activeTab === 'buy' ? 'Buy' : 'Sell'} ${tokenSymbol}`
          )}
        </Button>
        
        <div className="flex items-center justify-center text-xs text-gray-400 gap-1">
          <Info className="h-3 w-3" />
          <span>All transactions are processed on Solana devnet</span>
        </div>
      </div>
    </div>
  );
};

export default TradingInterface;
