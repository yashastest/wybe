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
  X
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { tokenTradingService, TradeResult } from '@/services/tokenTradingService';
import { formatCurrency } from '@/utils/tradeUtils';

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
  
  const inputRef = React.useRef<HTMLInputElement>(null);
  
  const estimateAmount = useCallback(async () => {
    if (!inputAmount || isNaN(Number(inputAmount))) {
      setEstimatedAmount(0);
      return;
    }
    
    setIsEstimating(true);
    try {
      if (tradeType === 'buy') {
        const tokenAmount = await tokenTradingService.estimateTokenAmount(tokenSymbol, parseFloat(inputAmount));
        setEstimatedAmount(tokenAmount);
      } else {
        const solAmount = await tokenTradingService.estimateSolAmount(tokenSymbol, parseFloat(inputAmount));
        setEstimatedAmount(solAmount);
      }
    } catch (error) {
      console.error("Failed to estimate amount:", error);
      toast.error("Failed to estimate amount. Please try again.");
      setEstimatedAmount(0);
    } finally {
      setIsEstimating(false);
    }
  }, [tradeType, inputAmount, tokenSymbol]);
  
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
      return result.errorMessage || result.error || 'Trade failed';
    }
    
    const amount = result.amountSol ? formatCurrency(result.amountSol) + ' SOL' : result.amountTokens ? result.amountTokens + ' ' + tokenSymbol : 'Unknown amount';
    return `Trade successful! You ${tradeType === 'buy' ? 'bought' : 'sold'} ${amount}. Tx: ${result.txHash}`;
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
      const tradeParams = {
        tokenSymbol,
        action: tradeType as 'buy' | 'sell',
        walletAddress: address,
        gasPriority: getGasPriorityValue(gasPriority)
      };
      
      let result: TradeResult;
      
      if (tradeType === 'buy') {
        setIsBuying(true);
        result = await tokenTradingService.executeTrade({
          ...tradeParams,
          amountSol: parseFloat(inputAmount)
        });
      } else {
        setIsSelling(true);
        result = await tokenTradingService.executeTrade({
          ...tradeParams,
          amountTokens: parseFloat(inputAmount)
        });
      }
      
      if (result.success) {
        toast.success(formatTradeResult(result));
      } else {
        toast.error(formatTradeResult(result));
      }
      
      setTradeResult(result);
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

  return (
    <Card className="glass-card">
      <Tabs defaultValue="trade" className="w-full">
        <TabsList>
          <TabsTrigger value="trade" onClick={() => setShowSettings(false)}>Trade</TabsTrigger>
          <TabsTrigger value="settings" onClick={() => setShowSettings(true)}>Settings</TabsTrigger>
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
                className={tradeType === 'buy' ? 'bg-green-600' : ''}
              >
                Buy
              </Button>
              <Button 
                variant={tradeType === 'sell' ? 'default' : 'outline'}
                onClick={() => setTradeType('sell')}
                className={tradeType === 'sell' ? 'bg-red-600' : ''}
              >
                Sell
              </Button>
            </div>
            
            <div className="grid gap-2">
              <Input 
                type="number"
                placeholder={`Enter SOL amount to ${tradeType === 'buy' ? 'buy' : 'sell'}`}
                value={inputAmount}
                onChange={(e) => handleInputChange(e.target.value)}
                ref={inputRef}
              />
              <p className="text-sm text-gray-400">
                Estimated {tradeType === 'buy' ? tokenSymbol : 'SOL'}:{' '}
                {isEstimating ? <RefreshCw className="inline-block h-4 w-4 animate-spin" /> : estimatedAmount.toLocaleString()}
              </p>
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
              <div className={`p-3 rounded-md ${tradeResult.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {formatTradeResult(tradeResult)}
              </div>
            )}
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
