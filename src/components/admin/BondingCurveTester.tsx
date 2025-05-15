import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { TrendingUp, Zap, Coins, Info, RefreshCcw, CheckCircle, AlertTriangle, ArrowRightLeft } from "lucide-react";
import { smartContractService, ContractConfig } from "@/services/smartContractService";
import { tradingService, TokenTradingStatus } from "@/services/tradingService"; // Assuming TokenTradingStatus is exported
import { useWallet } from '@/hooks/useWallet';
import { Alert, AlertDescription } from '@/components/ui/alert';

const BondingCurveTester = () => {
  const [config, setConfig] = useState<ContractConfig | null>(null);
  const [tokens, setTokens] = useState<TokenTradingStatus[]>([]);
  const [selectedTokenSymbol, setSelectedTokenSymbol] = useState<string>('');
  const [mintAmount, setMintAmount] = useState<number>(100);
  const [tradeAmount, setTradeAmount] = useState<number>(10);
  const [isBuy, setIsBuy] = useState<boolean>(true);
  const [mintResult, setMintResult] = useState<string>('');
  const [tradeResult, setTradeResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const { address: walletAddress } = useWallet();

  useEffect(() => {
    setConfig(smartContractService.getContractConfig());
    const fetchedTokens = tradingService.getAllTokenStatuses();
    setTokens(fetchedTokens);
    if (fetchedTokens.length > 0) {
      const firstActiveToken = fetchedTokens.find(t => t.isBondingCurveActive);
      if (firstActiveToken) {
        setSelectedTokenSymbol(firstActiveToken.symbol);
        setCurrentPrice(firstActiveToken.price || 0);
      } else if (fetchedTokens.length > 0) {
        setSelectedTokenSymbol(fetchedTokens[0].symbol);
        setCurrentPrice(fetchedTokens[0].price || 0);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedTokenSymbol) {
      const selectedToken = tokens.find(t => t.symbol === selectedTokenSymbol);
      setCurrentPrice(selectedToken?.price || 0);
    }
  }, [selectedTokenSymbol, tokens]);

  const handleMintTokens = async () => {
    if (!selectedTokenSymbol || mintAmount <= 0) {
      toast.error("Please select a token and enter a valid amount.");
      return;
    }
    if (!walletAddress) {
      toast.error("Please connect your wallet first.");
      return;
    }

    setIsLoading(true);
    setMintResult('');
    
    try {
      // Ensure mintTokensWithBondingCurve is called with correct arguments
      // Original call: smartContractService.mintTokensWithBondingCurve(mintAmount, walletAddress || '', selectedTokenSymbol)
      // Corrected call: Pass only amount and recipient address
      const mintRes = await smartContractService.mintTokensWithBondingCurve(mintAmount, walletAddress);
      
      if (mintRes.success) {
        setMintResult(`Successfully minted ${mintRes.tokens} tokens. Cost: ${mintRes.cost.toFixed(4)} SOL. Tx: ${mintRes.txHash}`);
        toast.success("Tokens minted successfully!");
        // Update token list or specific token details if necessary
        const updatedTokens = tokens.map(t => 
          t.symbol === selectedTokenSymbol 
            ? { ...t, totalSupply: (t.totalSupply || 0) + mintRes.tokens } 
            : t
        );
        setTokens(updatedTokens);
      } else {
        setMintResult(mintRes.error || 'Error minting tokens');
        toast.error("Failed to mint tokens", { description: mintRes.error });
      }
    } catch (error: any) {
      setMintResult(`Error: ${error.message}`);
      toast.error("An unexpected error occurred during minting.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteTrade = async () => {
    if (!selectedTokenSymbol || tradeAmount <= 0) {
      toast.error("Please select a token and enter a valid amount.");
      return;
    }
    if (!walletAddress) {
      toast.error("Please connect your wallet first.");
      return;
    }

    setIsLoading(true);
    setTradeResult('');

    try {
      // Ensure executeTokenTrade is called with correct arguments
      // Original call: smartContractService.executeTokenTrade(tradeAmount, isBuy, walletAddress || '', selectedTokenSymbol, currentPrice)
      // Corrected call: Pass only tokenAmount, isBuy, and wallet address
      const tradeRes = await smartContractService.executeTokenTrade(tradeAmount, isBuy, walletAddress);

      if (tradeRes.success) {
        setTradeResult(`Trade successful! Amount: ${tradeRes.tokenAmount}, SOL: ${tradeRes.solAmount.toFixed(4)}, New Price: ${tradeRes.newPrice.toFixed(6)}. Tx: ${tradeRes.txHash}`);
        toast.success("Trade executed successfully!");
        // Update token list or specific token details
        const updatedTokens = tokens.map(t =>
          t.symbol === selectedTokenSymbol
            ? { ...t, price: tradeRes.newPrice, marketCap: (t.totalSupply || 0) * tradeRes.newPrice }
            : t
        );
        setTokens(updatedTokens);
        setCurrentPrice(tradeRes.newPrice);
      } else {
        setTradeResult(tradeRes.error || 'Error executing trade');
        toast.error("Failed to execute trade", { description: tradeRes.error });
      }
    } catch (error: any) {
      setTradeResult(`Error: ${error.message}`);
      toast.error("An unexpected error occurred during trade.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Zap className="mr-2 text-orange-500" />
            Bonding Curve Configuration
          </CardTitle>
        </CardHeader>
        <CardContent>
          {config ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <p><strong>Bonding Curve Enabled:</strong> {config.bondingCurveEnabled ? 'Yes' : 'No'}</p>
              <p><strong>Limit:</strong> ${config.bondingCurveLimit.toLocaleString()}</p>
              <p><strong>Creator Fee:</strong> {config.creatorFeePercentage}%</p>
              <p><strong>Platform Fee:</strong> {config.platformFeePercentage}%</p>
            </div>
          ) : (
            <p>Loading configuration...</p>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Coins className="mr-2 text-green-500" />
              Mint Tokens
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select Token</label>
              <Select value={selectedTokenSymbol} onValueChange={setSelectedTokenSymbol}>
                <SelectTrigger className="bg-black/30">
                  <SelectValue placeholder="Select a token" />
                </SelectTrigger>
                <SelectContent className="bg-wybe-background-light">
                  {tokens.filter(t => t.isBondingCurveActive).map(token => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      {token.symbol} (Price: ${token.price?.toFixed(6) || 'N/A'})
                    </SelectItem>
                  ))}
                  {tokens.filter(t => t.isBondingCurveActive).length === 0 && (
                    <div className="p-4 text-center text-gray-400">No active bonding curve tokens.</div>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="mintAmount" className="block text-sm font-medium mb-1">Amount to Mint</label>
              <Input
                id="mintAmount"
                type="number"
                value={mintAmount}
                onChange={(e) => setMintAmount(parseFloat(e.target.value))}
                placeholder="e.g., 100"
                className="bg-black/30"
                min="0"
              />
            </div>
            <Button 
              onClick={handleMintTokens} 
              disabled={isLoading || !selectedTokenSymbol || !config?.bondingCurveEnabled}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isLoading ? <RefreshCcw className="animate-spin mr-2" /> : <Coins className="mr-2" />}
              Mint Tokens
            </Button>
            {!config?.bondingCurveEnabled && (
              <Alert variant="warning" className="mt-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Bonding curve is currently disabled in the configuration.
                </AlertDescription>
              </Alert>
            )}
            {mintResult && (
              <Alert variant={mintResult.startsWith("Error") || mintResult.startsWith("Failed") ? "destructive" : "default"} className="mt-4 break-all">
                {mintResult.startsWith("Error") || mintResult.startsWith("Failed") ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                <AlertDescription>{mintResult}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <ArrowRightLeft className="mr-2 text-blue-500" />
              Execute Trade
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select Token</label>
               <Select value={selectedTokenSymbol} onValueChange={setSelectedTokenSymbol}>
                <SelectTrigger className="bg-black/30">
                  <SelectValue placeholder="Select a token" />
                </SelectTrigger>
                <SelectContent className="bg-wybe-background-light">
                  {tokens.map(token => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      {token.symbol} (Price: ${token.price?.toFixed(6) || 'N/A'})
                    </SelectItem>
                  ))}
                   {tokens.length === 0 && (
                    <div className="p-4 text-center text-gray-400">No tokens available.</div>
                  )}
                </SelectContent>
              </Select>
            </div>
            {currentPrice !== null && (
              <p className="text-sm text-gray-400">Current Price: ${currentPrice.toFixed(6)}</p>
            )}
            <div>
              <label htmlFor="tradeAmount" className="block text-sm font-medium mb-1">Token Amount</label>
              <Input
                id="tradeAmount"
                type="number"
                value={tradeAmount}
                onChange={(e) => setTradeAmount(parseFloat(e.target.value))}
                placeholder="e.g., 10"
                className="bg-black/30"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Trade Type</label>
              <Select value={isBuy ? "buy" : "sell"} onValueChange={(value) => setIsBuy(value === "buy")}>
                <SelectTrigger className="bg-black/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-wybe-background-light">
                  <SelectItem value="buy">Buy Tokens</SelectItem>
                  <SelectItem value="sell">Sell Tokens</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={handleExecuteTrade} 
              disabled={isLoading || !selectedTokenSymbol}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? <RefreshCcw className="animate-spin mr-2" /> : <ArrowRightLeft className="mr-2" />}
              Execute Trade
            </Button>
             {tradeResult && (
              <Alert variant={tradeResult.startsWith("Error") || tradeResult.startsWith("Failed") ? "destructive" : "default"} className="mt-4 break-all">
                {tradeResult.startsWith("Error") || tradeResult.startsWith("Failed") ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                <AlertDescription>{tradeResult}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center text-xl">
            <Info className="mr-2 text-yellow-500" />
            Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-gray-300">
          <p>This tool allows you to test the bonding curve mechanics by minting new tokens (simulating initial liquidity or creator mints) and executing buy/sell trades against the curve.</p>
          <p>Minting tokens increases the total supply, which should affect the price based on the bonding curve formula.</p>
          <p>Trading tokens simulates market activity. Buys should increase the price, and sells should decrease it, according to the curve.</p>
          <p>Fees (creator & platform) are applied on trades as per the current contract configuration.</p>
          <p>Ensure your wallet is connected to interact with these functions.</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BondingCurveTester;
