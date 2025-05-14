import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  ChartLine, 
  ArrowUpRight, 
  Info, 
  RefreshCcw,
  Check,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { tradingService, TokenTransaction } from "@/services/tradingService";
import { smartContractService } from "@/services/smartContractService";
import { toast } from "sonner";
import { useWallet } from "@/hooks/useWallet";

const BondingCurveTester = () => {
  const { address } = useWallet();
  const [selectedToken, setSelectedToken] = useState<string | null>(null);
  const [supplyValue, setSupplyValue] = useState<number>(1000000);
  const [chartData, setChartData] = useState<any[]>([]);
  const [tokenDetails, setTokenDetails] = useState<any>(null);
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [mintAmount, setMintAmount] = useState<number>(10000);
  const [isMinting, setIsMinting] = useState<boolean>(false);
  const [isTrading, setIsTrading] = useState<boolean>(false);
  const [tradeAmount, setTradeAmount] = useState<number>(5000);
  const [config, setConfig] = useState({
    bondingCurveEnabled: true,
    bondingCurveLimit: 50000,
    creatorFeePercentage: 2.5,
    platformFeePercentage: 2.5
  });

  useEffect(() => {
    // Load contract config
    const contractConfig = smartContractService.getContractConfig();
    setConfig({
      bondingCurveEnabled: contractConfig.bondingCurveEnabled,
      bondingCurveLimit: contractConfig.bondingCurveLimit,
      creatorFeePercentage: contractConfig.creatorFeePercentage,
      platformFeePercentage: contractConfig.platformFeePercentage
    });
    
    // Generate initial chart data
    generateChartData();
    
    // Load tokens
    const tokens = tradingService.getAllTokenStatuses();
    if (tokens.length > 0) {
      handleSelectToken(tokens[0].symbol);
    }
  }, []);

  const generateChartData = () => {
    const data = [];
    const maxSupply = supplyValue * 2;
    const step = maxSupply / 10;
    
    for (let supply = 0; supply <= maxSupply; supply += step) {
      // Simple bonding curve: price = (supply / 10000)^2 + 0.01
      const price = supply === 0 ? 0.01 : Math.pow(supply / 10000, 2) + 0.01;
      const marketCap = supply * price;
      
      data.push({
        supply: supply.toLocaleString(),
        price: price.toFixed(4),
        marketCap: marketCap.toFixed(2),
      });
      
      // Add extra points near the $50k boundary to show the transition more clearly
      if (marketCap > 45000 && marketCap < 55000 && supply + step <= maxSupply) {
        // Add a point just before $50k
        const beforeSupply = (50000 / price) * 0.98;
        const beforePrice = Math.pow(beforeSupply / 10000, 2) + 0.01;
        data.push({
          supply: beforeSupply.toLocaleString(),
          price: beforePrice.toFixed(4),
          marketCap: (beforeSupply * beforePrice).toFixed(2),
        });
        
        // Add the exact $50k point
        const exactSupply = 50000 / price;
        data.push({
          supply: exactSupply.toLocaleString(),
          price: price.toFixed(4),
          marketCap: "50000.00",
          isTransition: true,
        });
        
        // Add a point just after $50k (fixed price)
        const afterSupply = exactSupply * 1.02;
        data.push({
          supply: afterSupply.toLocaleString(),
          price: price.toFixed(4),
          marketCap: (afterSupply * price).toFixed(2),
        });
      }
    }
    
    setChartData(data);
  };

  const handleSelectToken = (symbol: string) => {
    setSelectedToken(symbol);
    
    // Get token details
    const token = tradingService.getTokenStatus(symbol);
    setTokenDetails(token);
    
    // Get token transactions
    const tokenTransactions = tradingService.getTokenTransactions(symbol);
    setTransactions(tokenTransactions);
  };

  const handleMintTokens = async () => {
    if (!selectedToken || !tokenDetails || !mintAmount || mintAmount <= 0) return;
    
    setIsMinting(true);
    try {
      // Fixed: Remove the fourth argument as the function expects only 3
      const result = await smartContractService.mintTokensWithBondingCurve(
        tokenDetails.contractAddress!,
        mintAmount,
        address || tokenDetails.creator!
      );
      
      if (result.success) {
        toast.success(result.message || "Tokens minted successfully");
        
        // Refresh token details
        const token = tradingService.getTokenStatus(selectedToken);
        setTokenDetails(token);
        
        // Refresh transactions
        const tokenTransactions = tradingService.getTokenTransactions(selectedToken);
        setTransactions(tokenTransactions);
      } else {
        toast.error(result.message || "Failed to mint tokens");
      }
    } catch (error: any) {
      toast.error(`Error minting tokens: ${error.message}`);
    } finally {
      setIsMinting(false);
    }
  };
  
  const handleExecuteTrade = async () => {
    if (!selectedToken || !tokenDetails || !tradeAmount || tradeAmount <= 0) return;
    
    setIsTrading(true);
    try {
      // Generate a random buyer address
      const buyerAddress = `Wybe${Math.random().toString(36).substring(2, 10)}`;
      
      // Use trading service to execute trade
      const result = await smartContractService.executeTokenTrade(
        tokenDetails.contractAddress!,
        tradeAmount,
        tokenDetails.price!,
        address || tokenDetails.creator!,
        buyerAddress
      );
      
      if (result.success) {
        toast.success(result.message);
        
        // Refresh token details
        const token = tradingService.getTokenStatus(selectedToken);
        setTokenDetails(token);
        
        // Refresh transactions
        const tokenTransactions = tradingService.getTokenTransactions(selectedToken);
        setTransactions(tokenTransactions);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      toast.error(`Error executing trade: ${error.message}`);
    } finally {
      setIsTrading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="glass-card border-wybe-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ChartLine className="mr-2 text-blue-500" />
            Bonding Curve System Test
          </CardTitle>
          <CardDescription>
            Analyze and test the bonding curve implementation for token pricing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-2">Select Token</label>
              <div className="flex flex-wrap gap-2">
                {tradingService.getAllTokenStatuses().map((token) => (
                  <Badge
                    key={token.symbol}
                    variant={selectedToken === token.symbol ? "default" : "outline"}
                    className={`cursor-pointer ${
                      selectedToken === token.symbol ? "bg-blue-600" : ""
                    }`}
                    onClick={() => handleSelectToken(token.symbol)}
                  >
                    {token.symbol}
                    {token.isBondingCurveActive && (
                      <span className="ml-1 text-xs">🔄</span>
                    )}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium mb-2">Bonding Curve Status</label>
              <div className="flex flex-wrap gap-2">
                <Badge variant={config.bondingCurveEnabled ? "default" : "destructive"}>
                  {config.bondingCurveEnabled ? "Enabled" : "Disabled"}
                </Badge>
                <Badge variant="outline">
                  Limit: ${config.bondingCurveLimit.toLocaleString()}
                </Badge>
                <Badge variant="outline">
                  Creator Fee: {config.creatorFeePercentage}%
                </Badge>
                <Badge variant="outline">
                  Platform Fee: {config.platformFeePercentage}%
                </Badge>
              </div>
            </div>
          </div>
          
          {tokenDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{tokenDetails.symbol} Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Market Cap</TableCell>
                        <TableCell>${tokenDetails.marketCap.toLocaleString()}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Current Price</TableCell>
                        <TableCell>${tokenDetails.price?.toFixed(6) || "0.010000"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Total Supply</TableCell>
                        <TableCell>{tokenDetails.totalSupply?.toLocaleString() || "0"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Bonding Curve</TableCell>
                        <TableCell>
                          {tokenDetails.isBondingCurveActive ? (
                            <Badge className="bg-green-600">Active</Badge>
                          ) : (
                            <Badge className="bg-blue-600">Completed</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">DEXScreener</TableCell>
                        <TableCell>
                          {tokenDetails.listedOnDexscreener ? (
                            <Badge className="bg-green-600">Listed</Badge>
                          ) : (
                            <Badge variant="outline">Not Listed</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Token Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Mint Tokens</label>
                    <div className="flex gap-2">
                      <Input 
                        type="number" 
                        value={mintAmount}
                        onChange={(e) => setMintAmount(parseInt(e.target.value))}
                        min="1"
                      />
                      <Button 
                        onClick={handleMintTokens}
                        disabled={isMinting}
                        className="whitespace-nowrap"
                      >
                        {isMinting ? (
                          <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowUpRight className="mr-2 h-4 w-4" />
                        )}
                        Mint
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      1% will go to treasury wallet
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">Execute Trade</label>
                    <div className="flex gap-2">
                      <Input 
                        type="number" 
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(parseInt(e.target.value))}
                        min="1"
                      />
                      <Button 
                        onClick={handleExecuteTrade}
                        disabled={isTrading}
                        variant="secondary"
                        className="whitespace-nowrap"
                      >
                        {isTrading ? (
                          <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <ArrowUpRight className="mr-2 h-4 w-4" />
                        )}
                        Trade
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {config.creatorFeePercentage}% creator fee + {config.platformFeePercentage}% platform fee
                    </p>
                  </div>
                  
                  {tokenDetails.marketCap >= config.bondingCurveLimit && tokenDetails.isBondingCurveActive && (
                    <Alert className="bg-amber-500/10 border-amber-500/50">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <AlertDescription className="text-amber-500">
                        This token has reached the bonding curve limit but is still marked as active. Update it in the smart contract.
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  {!tokenDetails.isBondingCurveActive && (
                    <Alert className="bg-blue-500/10 border-blue-500/50">
                      <Info className="h-4 w-4 text-blue-500" />
                      <AlertDescription className="text-blue-500">
                        This token has switched to fixed price trading after reaching the $50k market cap threshold.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
          
          <div className="pt-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Bonding Curve Visualization</span>
                  <div className="text-sm font-normal flex items-center">
                    <Input
                      type="number"
                      value={supplyValue}
                      onChange={(e) => setSupplyValue(parseInt(e.target.value))}
                      className="w-32 h-7 mr-2 text-xs"
                      min="100000"
                    />
                    <Button 
                      onClick={generateChartData} 
                      size="sm" 
                      variant="outline" 
                      className="h-7 text-xs"
                    >
                      Update
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis 
                        dataKey="supply" 
                        tickFormatter={(value) => value.toString().split(',')[0] + 'k'} 
                      />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip 
                        formatter={(value: any) => [`${value}`, '']}
                        labelFormatter={(value) => `Supply: ${value}`}
                      />
                      <Legend />
                      <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="price"
                        name="Token Price (USD)"
                        stroke="#3b82f6"
                        activeDot={{ r: 8 }}
                        dot={false}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="marketCap"
                        name="Market Cap (USD)"
                        stroke="#10b981"
                        // Fix the dot property to use proper ReactNode format
                        dot={false}
                        activeDot={(props) => {
                          const { isTransition, cx, cy } = props;
                          if (isTransition) {
                            return <circle cx={cx} cy={cy} r={6} fill="#ef4444" />;
                          }
                          return null;
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="border-t border-border mt-4 pt-4">
                  <h4 className="text-sm font-medium mb-2">Bonding Curve Explained</h4>
                  <p className="text-sm text-muted-foreground">
                    The bonding curve determines token price based on supply. Price increases as more tokens are created,
                    following the formula: <span className="font-mono">price = (supply/10000)² + 0.01</span>.
                    After reaching a $50k market cap, the bonding curve deactivates, and tokens trade at market price.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {transactions.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-auto max-h-[300px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Bonding</TableHead>
                        <TableHead>Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((tx, i) => (
                        <TableRow key={i}>
                          <TableCell>
                            <Badge
                              variant={tx.type === 'mint' ? 'outline' : tx.type === 'trade' ? 'secondary' : 'default'}
                            >
                              {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{tx.amount.toLocaleString()}</TableCell>
                          <TableCell>${tx.price.toFixed(6)}</TableCell>
                          <TableCell>${tx.totalValue.toLocaleString()}</TableCell>
                          <TableCell>
                            {tx.isBondingCurve ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <span className="h-4 w-4 text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>{new Date(tx.timestamp).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default BondingCurveTester;
