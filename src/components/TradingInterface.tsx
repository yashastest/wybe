import React, { useState, useEffect } from 'react';
import { useWallet } from '@/lib/wallet';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRightLeft, TrendingUp, TrendingDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { tokenTradingService, TradeResult } from '@/services/tokenTradingService';

interface TradingInterfaceProps {
  tokenSymbol: string;
  tokenName?: string;
  tokenIcon?: string;
}

const TradingInterface: React.FC<TradingInterfaceProps> = ({
  tokenSymbol,
  tokenName = '',
  tokenIcon
}) => {
  const { wallet, address, connected, isConnecting, connect } = useWallet();
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [inputAmount, setInputAmount] = useState('');
  const [estimatedAmount, setEstimatedAmount] = useState('');
  const [gasPriority, setGasPriority] = useState<number>(2); // 1: low, 2: medium, 3: high
  const [isCalculating, setIsCalculating] = useState(false);
  const [isTrading, setIsTrading] = useState(false);
  const [tradeResult, setTradeResult] = useState<TradeResult | null>(null);
  
  useEffect(() => {
    if (inputAmount) {
      calculateEstimatedAmount();
    }
  }, [inputAmount, tradeType]);
  
  const calculateEstimatedAmount = async () => {
    if (!inputAmount) {
      setEstimatedAmount('');
      return;
    }
    
    setIsCalculating(true);
    try {
      if (tradeType === 'buy') {
        const solAmount = parseFloat(inputAmount);
        const tokenAmount = await tokenTradingService.estimateTokenAmount(tokenSymbol, solAmount);
        setEstimatedAmount(tokenAmount.toFixed(4));
      } else {
        const tokenAmount = parseFloat(inputAmount);
        const solAmount = await tokenTradingService.estimateSolAmount(tokenSymbol, tokenAmount);
        setEstimatedAmount(solAmount.toFixed(4));
      }
    } catch (error) {
      console.error("Error calculating estimated amount:", error);
      toast.error("Failed to calculate estimated amount");
      setEstimatedAmount('Error');
    } finally {
      setIsCalculating(false);
    }
  };

  // Convert gasPriority string to appropriate format
  const getGasPriorityValue = (priority: number): 'low' | 'medium' | 'high' => {
    switch(priority) {
      case 1: return 'low';
      case 3: return 'high';
      default: return 'medium';
    }
  };

  const executeTrade = async () => {
    if (!connected) {
      toast.error("Please connect your wallet");
      return;
    }
    
    if (!inputAmount) {
      toast.error("Please enter an amount");
      return;
    }
    
    setIsTrading(true);
    setTradeResult(null);
    
    try {
      const tradeParams = {
        tokenSymbol,
        action: tradeType as 'buy' | 'sell',
        walletAddress: address,
        gasPriority: getGasPriorityValue(gasPriority)
      };
      
      let result: TradeResult;
      
      if (tradeType === 'buy') {
        result = await tokenTradingService.executeTrade({
          ...tradeParams,
          amountSol: parseFloat(inputAmount)
        });
      } else {
        result = await tokenTradingService.executeTrade({
          ...tradeParams,
          amountTokens: parseFloat(inputAmount)
        });
      }
      
      setTradeResult(result);
      
      if (result.success) {
        toast.success(`Trade executed successfully! Tx: ${result.txHash}`);
      } else {
        toast.error(`Trade failed: ${result.error || result.errorMessage || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error executing trade:", error);
      toast.error("Failed to execute trade");
    } finally {
      setIsTrading(false);
    }
  };

  return (
    <Card className="glass-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{tokenName || tokenSymbol} Trading</h2>
          {tokenIcon && <img src={tokenIcon} alt="Token Icon" className="w-8 h-8" />}
        </div>
        
        <Tabs defaultValue="buy" className="mb-4">
          <TabsList>
            <TabsTrigger value="buy" onClick={() => setTradeType('buy')}>
              <TrendingUp className="mr-2 h-4 w-4 text-green-500" />
              Buy
            </TabsTrigger>
            <TabsTrigger value="sell" onClick={() => setTradeType('sell')}>
              <TrendingDown className="mr-2 h-4 w-4 text-red-500" />
              Sell
            </TabsTrigger>
          </TabsList>
          <TabsContent value="buy">
            <p className="text-sm text-gray-400">Buy {tokenName || tokenSymbol} with SOL</p>
          </TabsContent>
          <TabsContent value="sell">
            <p className="text-sm text-gray-400">Sell {tokenName || tokenSymbol} for SOL</p>
          </TabsContent>
        </Tabs>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            {tradeType === 'buy' ? 'SOL Amount' : `${tokenName || tokenSymbol} Amount`}
          </label>
          <Input
            type="number"
            placeholder={`Enter amount to ${tradeType}`}
            value={inputAmount}
            onChange={(e) => setInputAmount(e.target.value)}
            className="bg-black/30"
          />
        </div>
        
        <div className="mb-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium mb-2">
              Estimated Amount
            </label>
            {isCalculating && <span className="text-gray-400 text-sm">Calculating...</span>}
          </div>
          <Input
            type="text"
            placeholder="Estimated amount"
            value={estimatedAmount}
            readOnly
            className="bg-black/30"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Gas Priority</label>
          <div className="flex space-x-2">
            <Button
              variant={gasPriority === 1 ? 'default' : 'outline'}
              onClick={() => setGasPriority(1)}
              className={gasPriority === 1 ? 'bg-blue-500' : ''}
            >
              Low
            </Button>
            <Button
              variant={gasPriority === 2 ? 'default' : 'outline'}
              onClick={() => setGasPriority(2)}
              className={gasPriority === 2 ? 'bg-blue-500' : ''}
            >
              Medium
            </Button>
            <Button
              variant={gasPriority === 3 ? 'default' : 'outline'}
              onClick={() => setGasPriority(3)}
              className={gasPriority === 3 ? 'bg-blue-500' : ''}
            >
              High
            </Button>
          </div>
        </div>
        
        <Button
          className="w-full"
          onClick={executeTrade}
          disabled={isTrading || isConnecting || !connected}
        >
          {isConnecting ? 'Connecting Wallet...' : isTrading ? 'Executing Trade...' : connected ? `Execute ${tradeType}` : 'Connect Wallet'}
        </Button>
        
        {tradeResult && (
          <div className="mt-4 p-4 border rounded-md">
            <h3 className="text-lg font-semibold mb-2">Trade Result:</h3>
            <p>Success: {tradeResult.success ? 'Yes' : 'No'}</p>
            {tradeResult.success ? (
              <>
                <p>Tx Hash: {tradeResult.txHash}</p>
                <p>Amount SOL: {tradeResult.amountSol}</p>
                <p>Amount Tokens: {tradeResult.amountTokens}</p>
              </>
            ) : (
              <p>Error: {tradeResult.error || tradeResult.errorMessage}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradingInterface;
