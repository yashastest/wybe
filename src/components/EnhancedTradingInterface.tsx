import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  ArrowUpDown, 
  TrendingUp, 
  TrendingDown, 
  Info, 
  AlertTriangle, 
  BarChart3, 
  Wallet, 
  Clock, 
  Zap, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Flame,
  Snowflake,
  BarChart4,
  Rocket,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useTokenTrading } from '@/hooks/useTokenTrading';
import { useWallet } from '@/hooks/useWallet';
import { calculatePriceImpact, formatCurrency, calculateTokenAmount, calculateSolAmount } from '@/utils/tradeUtils';
import TokenPriceChart from './TokenPriceChart';
import DexScreenerListingProgress from './DexScreenerListingProgress';
import { ListedToken } from '@/services/tokenTradingService';

interface EnhancedTradingInterfaceProps {
  tokens: ListedToken[];
  selectedToken: ListedToken;
  onSelectToken: (token: ListedToken) => void;
}

const EnhancedTradingInterface: React.FC<EnhancedTradingInterfaceProps> = ({
  tokens,
  selectedToken,
  onSelectToken
}) => {
  // Trading state
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<string>('');
  const [slippage, setSlippage] = useState<number>(1);
  const [gasPriority, setGasPriority] = useState<number>(2); // 1=Low, 2=Medium, 3=High
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(false);
  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  
  // Market data
  const [marketSentiment, setMarketSentiment] = useState<'bullish' | 'bearish' | 'neutral'>('neutral');
  const [priceImpact, setPriceImpact] = useState<number>(0);
  const [estimatedPrice, setEstimatedPrice] = useState<number>(selectedToken.price);
  const [estimatedTokens, setEstimatedTokens] = useState<number>(0);
  const [estimatedSol, setEstimatedSol] = useState<number>(0);
  
  // Hooks
  const { address, connected, connect } = useWallet();
  const { 
    buyTokens, 
    sellTokens, 
    sellAllTokens, 
    solBalance, 
    tokenBalance,
    isLoading: tradeLoading 
  } = useTokenTrading(selectedToken.symbol);
  
  // Reset amount when switching tabs
  useEffect(() => {
    setAmount('');
    setEstimatedTokens(0);
    setEstimatedSol(0);
    setPriceImpact(0);
  }, [activeTab]);
  
  // Update estimates when amount changes
  useEffect(() => {
    const numericAmount = parseFloat(amount) || 0;
    
    if (numericAmount > 0) {
      if (activeTab === 'buy') {
        // Buying tokens with SOL
        const tokensEstimate = calculateTokenAmount(numericAmount, selectedToken.price);
        setEstimatedTokens(tokensEstimate);
        setEstimatedSol(numericAmount);
        
        // Calculate price impact (higher for larger purchases)
        const impact = calculatePriceImpact(selectedToken.price, numericAmount, 'buy', slippage);
        setPriceImpact(impact);
        
        // Adjust estimated price with impact
        setEstimatedPrice(selectedToken.price * (1 + impact / 100));
      } else {
        // Selling tokens for SOL
        const solEstimate = calculateSolAmount(numericAmount, selectedToken.price);
        setEstimatedSol(solEstimate);
        setEstimatedTokens(numericAmount);
        
        // Calculate price impact (higher for larger sales)
        const impact = calculatePriceImpact(selectedToken.price, numericAmount, 'sell', slippage);
        setPriceImpact(impact);
        
        // Adjust estimated price with impact
        setEstimatedPrice(selectedToken.price * (1 - impact / 100));
      }
    } else {
      setEstimatedTokens(0);
      setEstimatedSol(0);
      setPriceImpact(0);
      setEstimatedPrice(selectedToken.price);
    }
  }, [amount, activeTab, selectedToken.price, slippage]);
  
  // Update market sentiment randomly (simulated)
  useEffect(() => {
    const sentiments: Array<'bullish' | 'bearish' | 'neutral'> = ['bullish', 'bearish', 'neutral'];
    const randomSentiment = sentiments[Math.floor(Math.random() * sentiments.length)];
    setMarketSentiment(randomSentiment);
  }, [selectedToken]);
  
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
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
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
  
  // Handle sell all
  const handleSellAll = async () => {
    if (!connected) {
      try {
        await connect();
        toast.info("Please try again after connecting");
        return;
      } catch (error) {
        toast.error("Failed to connect wallet");
        return;
      }
    }
    
    if (tokenBalance <= 0) {
      toast.error(`No ${selectedToken.symbol} to sell`);
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await sellAllTokens(gasPriority);
      
      if (result.success) {
        toast.success(`Successfully sold all ${selectedToken.symbol}`);
        setAmount('');
      } else {
        toast.error(result.error || "Transaction failed");
      }
    } catch (error) {
      console.error("Sell all error:", error);
      toast.error("Transaction failed");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Render token selection dropdown
  const renderTokenSelect = () => (
    <div className="relative">
      <Button
        variant="outline"
        className="w-full justify-between bg-wybe-background-light border-gray-700"
        onClick={() => setIsTokenSelectOpen(!isTokenSelectOpen)}
      >
        <div className="flex items-center">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 mr-2" />
          <span>{selectedToken.symbol}</span>
        </div>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </Button>
      
      <AnimatePresence>
        {isTokenSelectOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-1 bg-wybe-background-light border border-gray-700 rounded-md shadow-lg"
          >
            <div className="max-h-60 overflow-auto py-1">
              {tokens.map((token) => (
                <div
                  key={token.symbol}
                  className={`px-3 py-2 hover:bg-gray-800 cursor-pointer flex items-center justify-between ${
                    token.symbol === selectedToken.symbol ? 'bg-gray-800' : ''
                  }`}
                  onClick={() => {
                    onSelectToken(token);
                    setIsTokenSelectOpen(false);
                  }}
                >
                  <div className="flex items-center">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 mr-2" />
                    <span>{token.symbol}</span>
                  </div>
                  <span className="text-sm text-gray-400">${token.price.toFixed(4)}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
  
  // Render price impact indicator
  const renderPriceImpact = () => {
    let impactColor = 'text-green-500';
    let impactText = 'Low';
    
    if (priceImpact > 5) {
      impactColor = 'text-red-500';
      impactText = 'High';
    } else if (priceImpact > 2) {
      impactColor = 'text-orange-500';
      impactText = 'Medium';
    }
    
    return (
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Price Impact</span>
        <span className={impactColor}>
          {priceImpact.toFixed(2)}% ({impactText})
        </span>
      </div>
    );
  };
  
  // Render market sentiment indicator
  const renderMarketSentiment = () => {
    switch (marketSentiment) {
      case 'bullish':
        return (
          <div className="flex items-center text-green-500">
            <TrendingUp className="h-4 w-4 mr-1" />
            <span>Bullish</span>
          </div>
        );
      case 'bearish':
        return (
          <div className="flex items-center text-red-500">
            <TrendingDown className="h-4 w-4 mr-1" />
            <span>Bearish</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center text-gray-400">
            <ArrowUpDown className="h-4 w-4 mr-1" />
            <span>Neutral</span>
          </div>
        );
    }
  };
  
  // Render gas priority selector
  const renderGasPriority = () => (
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
  );
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Left column - Chart and token info */}
      <div className="lg:col-span-2 space-y-4">
        {/* Price chart */}
        <Card className="bg-wybe-background-light border-gray-800">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center">
                <span>{selectedToken.name}</span>
                <Badge variant="outline" className="ml-2 bg-wybe-background border-gray-700">
                  {selectedToken.symbol}
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold">${selectedToken.price.toFixed(6)}</span>
                <Badge 
                  variant={selectedToken.priceChange24h >= 0 ? 'default' : 'destructive'}
                  className={selectedToken.priceChange24h >= 0 ? 'bg-green-600' : ''}
                >
                  {selectedToken.priceChange24h >= 0 ? '+' : ''}
                  {selectedToken.priceChange24h.toFixed(2)}%
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <TokenPriceChart symbol={selectedToken.symbol} />
            </div>
          </CardContent>
        </Card>
        
        {/* Token stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-wybe-background-light border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Market Cap</span>
                <span className="font-medium">${formatCurrency(selectedToken.marketCap || 0)}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-wybe-background-light border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">24h Volume</span>
                <span className="font-medium">${formatCurrency(selectedToken.volume24h || 0)}</span>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-wybe-background-light border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Sentiment</span>
                {renderMarketSentiment()}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* DexScreener listing progress */}
        <DexScreenerListingProgress 
          tokenSymbol={selectedToken.symbol} 
          progress={65} 
          status="in_progress"
        />
      </div>
      
      {/* Right column - Trading interface */}
      <div className="space-y-4">
        <Card className="bg-wybe-background-light border-gray-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Trade {selectedToken.symbol}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'buy' | 'sell')} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="buy" className="data-[state=active]:bg-green-600">Buy</TabsTrigger>
                <TabsTrigger value="sell" className="data-[state=active]:bg-red-600">Sell</TabsTrigger>
              </TabsList>
              
              <TabsContent value="buy" className="space-y-4">
                <div className="space-y-4">
                  {/* Token selector */}
                  {renderTokenSelect()}
                  
                  {/* Amount input */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Amount (SOL)</span>
                      <span className="text-sm text-gray-400">
                        Balance: {solBalance.toFixed(4)} SOL
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="0.0"
                        value={amount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        className="bg-wybe-background border-gray-700"
                      />
                      <Button 
                        variant="outline" 
                        className="bg-wybe-background border-gray-700"
                        onClick={handleMaxClick}
                      >
                        Max
                      </Button>
                    </div>
                  </div>
                  
                  {/* Estimated tokens */}
                  <div className="p-3 bg-wybe-background rounded-md border border-gray-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-400">You will receive (estimated)</span>
                      <span className="font-medium">{estimatedTokens.toFixed(6)} {selectedToken.symbol}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Price</span>
                      <span>${estimatedPrice.toFixed(6)} per {selectedToken.symbol}</span>
                    </div>
                  </div>
                  
                  {/* Price impact */}
                  {renderPriceImpact()}
                  
                  {/* Advanced options toggle */}
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between text-gray-400 hover:text-white"
                      onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                    >
                      <span>Advanced Options</span>
                      {isAdvancedOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    
                    <AnimatePresence>
                      {isAdvancedOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2 space-y-4">
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
                              />
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>0.1%</span>
                                <span>5%</span>
                              </div>
                            </div>
                            
                            {/* Gas priority */}
                            {renderGasPriority()}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Buy button */}
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading || tradeLoading || !amount || parseFloat(amount) <= 0}
                    onClick={handleTrade}
                  >
                    {isLoading || tradeLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : !connected ? (
                      'Connect Wallet to Buy'
                    ) : (
                      `Buy ${selectedToken.symbol}`
                    )}
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="sell" className="space-y-4">
                <div className="space-y-4">
                  {/* Token selector */}
                  {renderTokenSelect()}
                  
                  {/* Amount input */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Amount ({selectedToken.symbol})</span>
                      <span className="text-sm text-gray-400">
                        Balance: {tokenBalance.toFixed(6)} {selectedToken.symbol}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="0.0"
                        value={amount}
                        onChange={(e) => handleAmountChange(e.target.value)}
                        className="bg-wybe-background border-gray-700"
                      />
                      <Button 
                        variant="outline" 
                        className="bg-wybe-background border-gray-700"
                        onClick={handleMaxClick}
                      >
                        Max
                      </Button>
                    </div>
                  </div>
                  
                  {/* Estimated SOL */}
                  <div className="p-3 bg-wybe-background rounded-md border border-gray-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-400">You will receive (estimated)</span>
                      <span className="font-medium">{estimatedSol.toFixed(6)} SOL</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Price</span>
                      <span>${estimatedPrice.toFixed(6)} per {selectedToken.symbol}</span>
                    </div>
                  </div>
                  
                  {/* Price impact */}
                  {renderPriceImpact()}
                  
                  {/* Advanced options toggle */}
                  <div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-between text-gray-400 hover:text-white"
                      onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
                    >
                      <span>Advanced Options</span>
                      {isAdvancedOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                    
                    <AnimatePresence>
                      {isAdvancedOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2 space-y-4">
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
                              />
                              <div className="flex justify-between text-xs text-gray-500">
                                <span>0.1%</span>
                                <span>5%</span>
                              </div>
                            </div>
                            
                            {/* Gas priority */}
                            {renderGasPriority()}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Sell buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      className="w-full bg-red-600 hover:bg-red-700"
                      disabled={isLoading || tradeLoading || !amount || parseFloat(amount) <= 0}
                      onClick={handleTrade}
                    >
                      {isLoading || tradeLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        `Sell ${selectedToken.symbol}`
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-red-600 text-red-500 hover:bg-red-900/20"
                      disabled={isLoading || tradeLoading || tokenBalance <= 0}
                      onClick={handleSellAll}
                    >
                      Sell All
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Wallet info */}
        <Card className="bg-wybe-background-light border-gray-800">
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">SOL Balance</span>
              <span className="font-medium">{solBalance.toFixed(4)} SOL</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">{selectedToken.symbol} Balance</span>
              <span className="font-medium">{tokenBalance.toFixed(6)} {selectedToken.symbol}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">{selectedToken.symbol} Value</span>
              <span className="font-medium">${(tokenBalance * selectedToken.price).toFixed(2)}</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Market alerts */}
        <Alert className="bg-wybe-background-light border-amber-800/50">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <AlertDescription className="text-sm">
            {marketSentiment === 'bullish' ? (
              'Bullish momentum detected. Consider increasing position.'
            ) : marketSentiment === 'bearish' ? (
              'Bearish signals detected. Trade with caution.'
            ) : (
              'Market is consolidating. Watch for breakout signals.'
            )}
          </AlertDescription>
        </Alert>
      </div>
      
      {/* Confetti effect on successful trade */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {/* Confetti animation would go here */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="bg-green-500 text-white p-4 rounded-full"
            >
              <Sparkles className="h-8 w-8" />
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedTradingInterface;
