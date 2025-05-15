
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { smartContractService, ContractConfig } from '@/services/smartContractService';
import { ArrowRight, ChevronRight, Settings, TrendingUp } from 'lucide-react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';

const BondingCurveTester: React.FC = () => {
  const [tokenSymbol, setTokenSymbol] = useState<string>('WYBE');
  const [mintAmount, setMintAmount] = useState<number>(100);
  const [tradeAmount, setTradeAmount] = useState<number>(50);
  const [tradeDirection, setTradeDirection] = useState<'buy' | 'sell'>('buy');
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [isTrading, setIsTrading] = useState<boolean>(false);
  const [contractConfig, setContractConfig] = useState<ContractConfig>(
    smartContractService.getContractConfig()
  );
  
  const [lastMintResult, setLastMintResult] = useState<{
    tokens: number;
    cost: number;
    txHash: string;
  } | null>(null);
  
  const [lastTradeResult, setLastTradeResult] = useState<{
    tokenAmount: number;
    solAmount: number;
    price: number;
    txHash: string;
  } | null>(null);
  
  const testMintTokens = async () => {
    setIsMinting(true);
    try {
      const result = await smartContractService.mintTokensWithBondingCurve(
        tokenSymbol,
        mintAmount.toString()
      );
      
      if (result.success && result.tokens && result.cost) {
        setLastMintResult({
          tokens: result.tokens,
          cost: result.cost,
          txHash: result.txHash || 'unknown'
        });
        toast.success(`Successfully minted ${result.tokens} ${tokenSymbol} tokens`);
      } else {
        toast.error(`Failed to mint tokens: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error minting tokens:", error);
      toast.error("Error minting tokens. Please check console for details.");
    } finally {
      setIsMinting(false);
    }
  };
  
  const testTradeTokens = async () => {
    setIsTrading(true);
    try {
      const result = await smartContractService.executeTokenTrade(
        tokenSymbol,
        tradeDirection,
        tradeAmount.toString()
      );
      
      if (result.success && result.tokenAmount && result.solAmount && result.newPrice) {
        setLastTradeResult({
          tokenAmount: result.tokenAmount,
          solAmount: result.solAmount,
          price: result.newPrice,
          txHash: result.txHash || 'unknown'
        });
        
        if (tradeDirection === 'buy') {
          toast.success(`Successfully bought ${result.tokenAmount} ${tokenSymbol} tokens for ${result.solAmount} SOL`);
        } else {
          toast.success(`Successfully sold ${result.tokenAmount} ${tokenSymbol} tokens for ${result.solAmount} SOL`);
        }
        
        // Update the price display
        setContractConfig(prev => ({
          ...prev,
          currentPrice: result.newPrice
        }));
      } else {
        toast.error(`Failed to execute trade: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error trading tokens:", error);
      toast.error("Error trading tokens. Please check console for details.");
    } finally {
      setIsTrading(false);
    }
  };
  
  const toggleBondingCurve = async (enabled: boolean) => {
    try {
      const updatedConfig = await smartContractService.updateContractConfig({
        bondingCurveEnabled: enabled
      });
      
      setContractConfig(updatedConfig);
      toast.success(`Bonding curve ${enabled ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error("Error updating bonding curve config:", error);
      toast.error("Failed to update bonding curve settings");
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <h3 className="text-lg font-semibold flex items-center">
            <Settings className="mr-2 text-orange-500" size={20} />
            Bonding Curve Configuration
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="bonding-curve-switch"
                  checked={contractConfig.bondingCurveEnabled}
                  onCheckedChange={toggleBondingCurve}
                />
                <Label htmlFor="bonding-curve-switch">
                  {contractConfig.bondingCurveEnabled ? 'Bonding Curve Enabled' : 'Bonding Curve Disabled'}
                </Label>
              </div>
              
              <div className="text-sm">
                <span className="text-gray-400">Curve Limit:</span>
                <span className="ml-2 font-mono">{contractConfig.bondingCurveLimit?.toLocaleString()}</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-400">Creator Fee</Label>
                <div className="font-mono text-lg">{contractConfig.creatorFeePercentage}%</div>
              </div>
              <div>
                <Label className="text-sm text-gray-400">Platform Fee</Label>
                <div className="font-mono text-lg">{contractConfig.platformFeePercentage}%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {contractConfig.bondingCurveEnabled && (
        <>
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <h3 className="text-lg font-semibold flex items-center">
                <TrendingUp className="mr-2 text-orange-500" size={20} />
                Test Token Minting
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="token-symbol">Token Symbol</Label>
                    <Input
                      id="token-symbol"
                      value={tokenSymbol}
                      onChange={(e) => setTokenSymbol(e.target.value)}
                      placeholder="WYBE"
                    />
                  </div>
                  <div>
                    <Label htmlFor="mint-amount">Amount to Mint</Label>
                    <Input
                      id="mint-amount"
                      type="number"
                      value={mintAmount}
                      onChange={(e) => setMintAmount(parseInt(e.target.value))}
                      min={1}
                    />
                  </div>
                </div>
                
                <Button 
                  className="w-full"
                  variant="orange" 
                  onClick={testMintTokens}
                  disabled={isMinting || !contractConfig.bondingCurveEnabled}
                >
                  {isMinting ? 'Minting...' : 'Test Mint Tokens'}
                </Button>
                
                {lastMintResult && (
                  <div className="mt-4 p-4 border border-orange-500/20 rounded-md bg-orange-500/5">
                    <h4 className="text-sm font-semibold mb-2">Last Mint Result:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tokens Minted:</span>
                        <span className="font-mono">{lastMintResult.tokens} {tokenSymbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Cost:</span>
                        <span className="font-mono">{lastMintResult.cost} SOL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">TX Hash:</span>
                        <span className="font-mono text-xs truncate max-w-48">{lastMintResult.txHash}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <h3 className="text-lg font-semibold flex items-center">
                <ArrowRight className="mr-2 text-orange-500" size={20} />
                Test Token Trading
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="trade-direction">Trade Direction</Label>
                    <div className="flex mt-2">
                      <Button
                        variant={tradeDirection === 'buy' ? 'default' : 'outline'}
                        className={tradeDirection === 'buy' ? 'bg-green-600' : ''}
                        onClick={() => setTradeDirection('buy')}
                      >
                        Buy
                      </Button>
                      <Button
                        variant={tradeDirection === 'sell' ? 'default' : 'outline'}
                        className={`ml-2 ${tradeDirection === 'sell' ? 'bg-red-600' : ''}`}
                        onClick={() => setTradeDirection('sell')}
                      >
                        Sell
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="trade-amount">Amount to {tradeDirection === 'buy' ? 'Buy' : 'Sell'}</Label>
                    <Input
                      id="trade-amount"
                      type="number"
                      value={tradeAmount}
                      onChange={(e) => setTradeAmount(parseInt(e.target.value))}
                      min={1}
                    />
                  </div>
                </div>
                
                <Button 
                  className="w-full"
                  variant={tradeDirection === 'buy' ? 'green' : 'destructive'} 
                  onClick={testTradeTokens}
                  disabled={isTrading || !contractConfig.bondingCurveEnabled}
                >
                  {isTrading ? 'Processing...' : `Test ${tradeDirection === 'buy' ? 'Buy' : 'Sell'} Tokens`}
                </Button>
                
                {lastTradeResult && (
                  <div className="mt-4 p-4 border border-orange-500/20 rounded-md bg-orange-500/5">
                    <h4 className="text-sm font-semibold mb-2">Last Trade Result:</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Token Amount:</span>
                        <span className="font-mono">{lastTradeResult.tokenAmount} {tokenSymbol}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">SOL Amount:</span>
                        <span className="font-mono">{lastTradeResult.solAmount} SOL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">New Token Price:</span>
                        <span className="font-mono">{lastTradeResult.price.toFixed(6)} SOL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">TX Hash:</span>
                        <span className="font-mono text-xs truncate max-w-48">{lastTradeResult.txHash}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default BondingCurveTester;
