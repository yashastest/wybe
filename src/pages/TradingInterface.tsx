import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowUpDown, Wallet, TrendingUp, ArrowRight, ArrowDown } from "lucide-react";
import { toast } from 'sonner';
import { useWallet } from '@/hooks/useWallet';
import { tradingService } from '@/services/token/tradingService';
import { formatCurrency } from '@/utils/tradeUtils';

export interface TradingInterfaceProps {
  tokenSymbol: string;
  tokenName: string;
  tokenPrice: number;
  tokenLogo?: string;
}

const TradingInterface: React.FC<TradingInterfaceProps> = ({ tokenSymbol, tokenName, tokenPrice, tokenLogo }) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [amountSol, setAmountSol] = useState<number>(0.1);
  const [amountTokens, setAmountTokens] = useState<number>(0);
  const [estimatedFee, setEstimatedFee] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [gasPriority, setGasPriority] = useState<number>(1);
  const { connected, address } = useWallet();

  // Calculate estimated token amount when SOL amount changes
  useEffect(() => {
    if (amountSol > 0 && activeTab === 'buy') {
      const calculateTokenAmount = async () => {
        try {
          const tokenAmount = await tradingService.estimateTokenAmount(tokenSymbol, amountSol);
          setAmountTokens(tokenAmount);

          // Estimate fee (0.5% example fee)
          setEstimatedFee(amountSol * 0.005 * gasPriority);
        } catch (error) {
          console.error('Error estimating token amount:', error);
        }
      };
      
      calculateTokenAmount();
    }
  }, [amountSol, tokenSymbol, activeTab, gasPriority]);

  // Calculate estimated SOL amount when token amount changes
  useEffect(() => {
    if (amountTokens > 0 && activeTab === 'sell') {
      const calculateSolAmount = async () => {
        try {
          const solAmount = await tradingService.estimateSolAmount(tokenSymbol, amountTokens);
          setAmountSol(solAmount);

          // Estimate fee (0.5% example fee)
          setEstimatedFee(solAmount * 0.005 * gasPriority);
        } catch (error) {
          console.error('Error estimating SOL amount:', error);
        }
      };
      
      calculateSolAmount();
    }
  }, [amountTokens, tokenSymbol, activeTab, gasPriority]);

  // Handle input change for SOL amount
  const handleSolInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setAmountSol(value);
    } else {
      setAmountSol(0);
      setAmountTokens(0);
    }
  };

  // Handle input change for token amount
  const handleTokenInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setAmountTokens(value);
    } else {
      setAmountTokens(0);
      setAmountSol(0);
    }
  };

  // Execute trade
  const handleTrade = async () => {
    if (!connected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }

    if ((activeTab === 'buy' && amountSol <= 0) || (activeTab === 'sell' && amountTokens <= 0)) {
      toast.error(`Please enter a valid ${activeTab === 'buy' ? 'SOL' : 'token'} amount`);
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await tradingService.executeTrade({
        tokenSymbol,
        action: activeTab,
        walletAddress: address,
        amountSol: activeTab === 'buy' ? amountSol : undefined,
        amountTokens: activeTab === 'sell' ? amountTokens : undefined,
        gasPriority
      });

      if (result.success) {
        toast.success(`${activeTab === 'buy' ? 'Bought' : 'Sold'} ${formatCurrency(result.amountTokens || 0, 2)} ${tokenSymbol} tokens`);
        // Would reset form or refresh balances here in a complete implementation
      } else {
        toast.error(result.error || 'Transaction failed');
      }
    } catch (error) {
      console.error('Error executing trade:', error);
      toast.error('An unexpected error occurred while executing the trade');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Trade {tokenSymbol}</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs 
          defaultValue="buy" 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as 'buy' | 'sell')} 
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="buy">Buy {tokenSymbol}</TabsTrigger>
            <TabsTrigger value="sell">Sell {tokenSymbol}</TabsTrigger>
          </TabsList>
          
          <TabsContent value="buy" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sol-amount">SOL Amount</Label>
              <div className="relative">
                <Input
                  id="sol-amount"
                  type="number"
                  placeholder="0.1"
                  step="0.01"
                  min="0"
                  value={amountSol || ''}
                  onChange={handleSolInputChange}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-sm text-gray-500">SOL</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center py-2">
              <ArrowDown className="text-gray-400" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="token-amount">Estimated {tokenSymbol} Tokens</Label>
              <div className="relative">
                <Input
                  id="token-amount"
                  type="number"
                  placeholder="0"
                  disabled
                  value={amountTokens || ''}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-sm text-gray-500">{tokenSymbol}</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="sell" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token-sell-amount">{tokenSymbol} Amount</Label>
              <div className="relative">
                <Input
                  id="token-sell-amount"
                  type="number"
                  placeholder="100"
                  step="1"
                  min="0"
                  value={amountTokens || ''}
                  onChange={handleTokenInputChange}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-sm text-gray-500">{tokenSymbol}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center py-2">
              <ArrowDown className="text-gray-400" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sol-estimate">Estimated SOL</Label>
              <div className="relative">
                <Input
                  id="sol-estimate"
                  type="number"
                  placeholder="0"
                  disabled
                  value={amountSol || ''}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <span className="text-sm text-gray-500">SOL</span>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <div className="mt-6 space-y-4">
            <div>
              <Label className="text-sm">Transaction Speed</Label>
              <RadioGroup 
                defaultValue="1" 
                value={gasPriority.toString()} 
                onValueChange={(value) => setGasPriority(Number(value))}
                className="flex space-x-2 mt-2"
              >
                <div className="flex flex-col items-center">
                  <RadioGroupItem value="0.5" id="r1" className="peer sr-only" />
                  <Label 
                    htmlFor="r1" 
                    className="flex flex-col items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground cursor-pointer"
                  >
                    <span>Slow</span>
                    <span className="text-xs opacity-70">-50% fee</span>
                  </Label>
                </div>
                <div className="flex flex-col items-center">
                  <RadioGroupItem value="1" id="r2" className="peer sr-only" />
                  <Label 
                    htmlFor="r2" 
                    className="flex flex-col items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground cursor-pointer"
                  >
                    <span>Normal</span>
                    <span className="text-xs opacity-70">Standard</span>
                  </Label>
                </div>
                <div className="flex flex-col items-center">
                  <RadioGroupItem value="2" id="r3" className="peer sr-only" />
                  <Label 
                    htmlFor="r3" 
                    className="flex flex-col items-center px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-md peer-data-[state=checked]:bg-primary peer-data-[state=checked]:text-primary-foreground cursor-pointer"
                  >
                    <span>Fast</span>
                    <span className="text-xs opacity-70">2x fee</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
              <div className="flex justify-between text-sm mb-2">
                <span>Estimated Price:</span>
                <span className="font-medium">{formatCurrency(tokenPrice, 6, '◎ ')}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span>Transaction Fee:</span>
                <span className="font-medium">{formatCurrency(estimatedFee, 4, '◎ ')}</span>
              </div>
              <div className="flex justify-between text-sm font-bold">
                <span>Total:</span>
                <span>{formatCurrency(activeTab === 'buy' ? amountSol + estimatedFee : amountSol - estimatedFee, 4, '◎ ')}</span>
              </div>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleTrade}
              disabled={!connected || isSubmitting || (activeTab === 'buy' && amountSol <= 0) || (activeTab === 'sell' && amountTokens <= 0)}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center">
                  {activeTab === 'buy' ? (
                    <>
                      <TrendingUp className="mr-2 h-4 w-4" />
                      Buy {tokenSymbol}
                    </>
                  ) : (
                    <>
                      <ArrowRight className="mr-2 h-4 w-4" />
                      Sell {tokenSymbol}
                    </>
                  )}
                </span>
              )}
            </Button>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TradingInterface;
