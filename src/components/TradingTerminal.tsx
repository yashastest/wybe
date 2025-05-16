import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { ListedToken } from '@/services/tokenTradingService'; 
import { useWallet } from '@/lib/wallet';
import { useTokenTrading } from '@/hooks/useTokenTrading';
import { formatCurrency } from '@/utils/tradeUtils';
import TradingChart from './TradingChart';
import TokenSelector from './TokenSelector';
import TokenInfo from './TokenInfo';
import TradeEntryPanel from './TradeEntryPanel';
import TradingActivityFeed from './TradingActivityFeed';
import {
  ArrowRightLeft,
  ChevronDown,
  ChevronUp,
  Settings,
  RefreshCw,
  CircleDollarSign,
  CircleMinus,
  CirclePlus,
  TrendingUp,
  ChartBar,
  Info,
  Activity,
  Search,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';

interface TradingTerminalProps {
  tokens: ListedToken[];
  selectedToken: ListedToken;
  onSelectToken: (token: ListedToken) => void;
}

const TradingTerminal: React.FC<TradingTerminalProps> = ({ 
  tokens, 
  selectedToken, 
  onSelectToken 
}) => {
  const { connected, address } = useWallet();
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [inputAmount, setInputAmount] = useState<string>('');
  const [gasPriority, setGasPriority] = useState<number>(2);
  const [viewMode, setViewMode] = useState<'trading' | 'analytics'>('trading');
  const [chartTimeframe, setChartTimeframe] = useState<string>('1D');
  const [activePanel, setActivePanel] = useState<'order' | 'market' | 'history'>('order');
  
  const { 
    solBalance, 
    tokenBalance,
    isLoading,
    buyTokens,
    sellTokens,
    sellAllTokens,
    tradeHistory,
    fetchTradeHistory
  } = useTokenTrading(selectedToken.symbol);

  // Auto fetch trade history when wallet or selected token changes
  useEffect(() => {
    if (connected && address) {
      fetchTradeHistory(address);
    }
  }, [connected, address, selectedToken.symbol, fetchTradeHistory]);

  // Calculate derived trading stats
  const high24h = selectedToken.price * 1.05; // Default calculation if high24h is not available
  const low24h = selectedToken.price * 0.95; // Default calculation if low24h is not available
  
  // Calculate trading stats
  const tradingStats = {
    marketCap: `$${formatNumber(selectedToken.marketCap || 0)}`,
    volume24h: `$${formatNumber(selectedToken.volume24h || 0)}`,
    high24h: `$${high24h.toFixed(6)}`,
    low24h: `$${low24h.toFixed(6)}`,
    priceChange: selectedToken.priceChange24h || 0
  };

  // Format large numbers with commas and abbreviations for millions/billions
  function formatNumber(num: number) {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(2) + 'B';
    }
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toFixed(2);
  }

  const handleTradeTypeChange = (type: 'buy' | 'sell') => {
    if (type === 'sell' && !connected) {
      toast.error("Please connect your wallet to sell tokens");
      return;
    }
    setTradeType(type);
  };

  const handleInputChange = (value: string) => {
    setInputAmount(value);
  };

  const handleBuyToken = async () => {
    if (!connected) {
      toast.error("Please connect your wallet");
      return;
    }
    
    const amount = parseFloat(inputAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    const result = await buyTokens(amount, gasPriority);
    if (result.success) {
      setInputAmount('');
      toast.success(`Successfully purchased ${selectedToken.symbol} tokens`);
    }
  };
  
  const handleSellToken = async () => {
    if (!connected) {
      toast.error("Please connect your wallet");
      return;
    }
    
    const amount = parseFloat(inputAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    const result = await sellTokens(amount, gasPriority);
    if (result.success) {
      setInputAmount('');
      toast.success(`Successfully sold ${selectedToken.symbol} tokens`);
    }
  };
  
  const handleSellAllTokens = async () => {
    if (!connected) {
      toast.error("Please connect your wallet");
      return;
    }
    
    if (tokenBalance <= 0) {
      toast.error("You don't have any tokens to sell");
      return;
    }
    
    const result = await sellAllTokens(gasPriority);
    if (result.success) {
      toast.success(`Successfully sold all ${selectedToken.symbol} tokens`);
    }
  };

  // Quick trade actions
  const quickBuy = (amount: number) => {
    setTradeType('buy');
    setInputAmount(amount.toString());
  };

  const quickSell = (percentage: number) => {
    if (tokenBalance <= 0) {
      toast.error("You don't have any tokens to sell");
      return;
    }
    
    setTradeType('sell');
    const sellAmount = (tokenBalance * percentage / 100).toFixed(0);
    setInputAmount(sellAmount);
  };
  
  return (
    <div className="trading-terminal w-full">
      {/* Top bar with token selector and info */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="w-full md:w-1/4 bg-[#151720] rounded-lg p-3">
          <TokenSelector 
            tokens={tokens} 
            selectedToken={selectedToken} 
            onSelectToken={onSelectToken}
          />
        </div>
        
        <div className="flex-1 bg-[#151720] rounded-lg p-4">
          <TokenInfo
            token={selectedToken}
            tradingStats={tradingStats}
          />
        </div>
      </div>
      
      {/* Main trading interface */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Main chart - takes up 3/4 of the width on desktop */}
        <div className="lg:col-span-3 space-y-4">
          {/* Chart with timeframe buttons */}
          <Card className="border-0 bg-[#151720] shadow-md overflow-hidden">
            <CardHeader className="p-3 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white flex items-center gap-2">
                    {selectedToken.symbol}
                    <Badge className={`${selectedToken.priceChange24h >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {selectedToken.priceChange24h >= 0 ? '+' : ''}{selectedToken.priceChange24h}%
                    </Badge>
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-xs">
                  {['15m', '1H', '4H', '1D', '1W'].map(timeframe => (
                    <Button
                      key={timeframe}
                      variant={chartTimeframe === timeframe ? "default" : "outline"}
                      size="sm"
                      className="h-7 px-2 text-xs bg-opacity-20"
                      onClick={() => setChartTimeframe(timeframe)}
                    >
                      {timeframe}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 h-[400px]">
              <TradingChart 
                symbol={selectedToken.symbol} 
                timeframe={chartTimeframe} 
              />
            </CardContent>
          </Card>
          
          {/* Trading activity, market data, and analytics in tabs */}
          <Card className="border-0 bg-[#151720] shadow-md">
            <Tabs defaultValue="activity">
              <CardHeader className="p-3 border-b border-gray-800">
                <div className="flex justify-between items-center">
                  <TabsList className="bg-[#1A1F2C]/60">
                    <TabsTrigger value="activity" className="flex items-center gap-1">
                      <Activity className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Activity</span>
                    </TabsTrigger>
                    <TabsTrigger value="whales" className="flex items-center gap-1">
                      <CircleDollarSign className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Whales</span>
                    </TabsTrigger>
                    <TabsTrigger value="market" className="flex items-center gap-1">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Market</span>
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="flex items-center gap-1">
                      <ChartBar className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">Analytics</span>
                    </TabsTrigger>
                  </TabsList>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-3">
                <TabsContent value="activity" className="mt-0">
                  <TradingActivityFeed tokenSymbol={selectedToken.symbol} />
                </TabsContent>
                
                <TabsContent value="whales" className="mt-0">
                  <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    <span>Whale activity shows transactions over $10,000 equivalent</span>
                  </div>
                  <WhaleActivityFeed tokenSymbol={selectedToken.symbol} />
                </TabsContent>
                
                <TabsContent value="market" className="mt-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {tokens.slice(0, 8).map((token) => (
                      <TokenMarketCard 
                        key={token.id} 
                        token={token} 
                        onClick={() => onSelectToken(token)} 
                      />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="analytics" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Token Statistics</h3>
                      <div className="bg-[#1A1F2C]/40 p-3 rounded-md">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-gray-400">Market Cap</p>
                            <p className="font-medium">{tradingStats.marketCap}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">24h Volume</p>
                            <p className="font-medium">{tradingStats.volume24h}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">24h High</p>
                            <p className="font-medium">{tradingStats.high24h}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">24h Low</p>
                            <p className="font-medium">{tradingStats.low24h}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Holders</p>
                            <p className="font-medium">834</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Total Supply</p>
                            <p className="font-medium">100M</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Market Sentiment</h3>
                      <div className="bg-[#1A1F2C]/40 p-3 rounded-md">
                        <div className="flex justify-between mb-1">
                          <span className="text-xs">Bullish</span>
                          <span className="text-xs text-green-400">64%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-600 to-green-400" 
                            style={{ width: '64%' }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
        
        {/* Trade entry panel */}
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-0 bg-[#151720] shadow-md overflow-hidden">
            <CardHeader className="p-3 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <ArrowRightLeft className="h-4 w-4" />
                  Trade {selectedToken.symbol}
                </CardTitle>
                
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="p-3">
              <div className="space-y-4">
                {/* Buy/Sell Selector */}
                <div className="flex items-center justify-between bg-[#1A1F2C]/50 rounded-lg p-1">
                  <Button
                    variant={tradeType === 'buy' ? 'default' : 'ghost'}
                    onClick={() => handleTradeTypeChange('buy')}
                    className={`flex-1 text-xs h-8 ${tradeType === 'buy' ? 'bg-gradient-to-r from-green-600 to-green-500' : ''}`}
                  >
                    <ArrowUp className="h-3.5 w-3.5 mr-1" /> Buy
                  </Button>
                  <Button
                    variant={tradeType === 'sell' ? 'default' : 'ghost'}
                    onClick={() => handleTradeTypeChange('sell')}
                    className={`flex-1 text-xs h-8 ${tradeType === 'sell' ? 'bg-gradient-to-r from-red-600 to-red-500' : ''}`}
                    disabled={!connected}
                  >
                    <ArrowDown className="h-3.5 w-3.5 mr-1" /> Sell
                  </Button>
                </div>
                
                {/* Input Amount */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>
                      {tradeType === 'buy' ? 'Pay (SOL)' : `Amount (${selectedToken.symbol})`}
                    </span>
                    <span className="text-gray-400">
                      Balance: {tradeType === 'buy' 
                        ? `${formatCurrency(solBalance)} SOL` 
                        : `${formatCurrency(tokenBalance)} ${selectedToken.symbol}`}
                    </span>
                  </div>
                  <Input
                    type="text"
                    value={inputAmount}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="bg-[#101219] border-gray-800 h-10"
                    placeholder={tradeType === 'buy' ? "SOL amount to pay" : "Token amount to sell"}
                  />
                </div>
                
                {/* Estimated Receive */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>
                      {tradeType === 'buy' ? `Receive (${selectedToken.symbol})` : 'Receive (SOL)'}
                    </span>
                    <span className="text-xs flex items-center gap-1">
                      Price: ${selectedToken.price.toFixed(6)}
                    </span>
                  </div>
                  <div className="bg-[#101219] border border-gray-800 rounded-md p-2 text-sm h-10 flex items-center">
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <>
                        {inputAmount && !isNaN(parseFloat(inputAmount)) ? (
                          parseFloat(inputAmount) > 0 ? (
                            tradeType === 'buy' ? (
                              parseFloat(inputAmount) / selectedToken.price
                            ) : (
                              parseFloat(inputAmount) * selectedToken.price
                            )
                          ).toFixed(6) : "0.00"
                        ) : "0.00"}
                      </>
                    )}
                    <span className="ml-1 text-gray-400">
                      {tradeType === 'buy' ? selectedToken.symbol : 'SOL'}
                    </span>
                  </div>
                </div>
                
                {/* Quick Trade Buttons */}
                <div className="grid grid-cols-4 gap-2">
                  {tradeType === 'buy' ? (
                    <>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => quickBuy(0.1)}>0.1</Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => quickBuy(0.5)}>0.5</Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => quickBuy(1)}>1.0</Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => quickBuy(5)}>5.0</Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => quickSell(25)}>25%</Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => quickSell(50)}>50%</Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => quickSell(75)}>75%</Button>
                      <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => handleSellAllTokens()}>Max</Button>
                    </>
                  )}
                </div>
                
                {/* Gas Settings */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs items-center">
                    <span>Gas Priority</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs ${gasPriority === 1 ? 'text-white' : 'text-gray-400'}`}>Low</span>
                      <Slider
                        value={[gasPriority]}
                        min={1}
                        max={3}
                        step={1}
                        onValueChange={(values) => setGasPriority(values[0])}
                        className="w-20"
                      />
                      <span className={`text-xs ${gasPriority === 3 ? 'text-white' : 'text-gray-400'}`}>High</span>
                    </div>
                  </div>
                </div>
                
                {/* Execute Trade Button */}
                <Button 
                  className="w-full h-10"
                  variant={tradeType === 'buy' ? 'default' : 'destructive'}
                  disabled={!connected || isNaN(parseFloat(inputAmount)) || parseFloat(inputAmount) <= 0 || isLoading}
                  onClick={tradeType === 'buy' ? handleBuyToken : handleSellToken}
                >
                  {connected ? (
                    isLoading ? (
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <>
                        {tradeType === 'buy' ? (
                          <>
                            <CirclePlus className="h-4 w-4 mr-2" />
                            Buy {selectedToken.symbol}
                          </>
                        ) : (
                          <>
                            <CircleMinus className="h-4 w-4 mr-2" />
                            Sell {selectedToken.symbol}
                          </>
                        )}
                      </>
                    )
                  ) : (
                    "Connect Wallet"
                  )}
                </Button>
                
                {/* Trade History */}
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-medium">Your Trade History</h3>
                    <Button variant="ghost" size="sm" className="h-6 text-xs">View All</Button>
                  </div>
                  
                  <div className="bg-[#1A1F2C]/40 rounded-md overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-gray-800">
                          <TableHead className="text-xs">Side</TableHead>
                          <TableHead className="text-xs">Amount</TableHead>
                          <TableHead className="text-xs">Price</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {!connected ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center text-xs text-gray-400 py-4">
                              Connect wallet to view history
                            </TableCell>
                          </TableRow>
                        ) : tradeHistory.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={3} className="text-center text-xs text-gray-400 py-4">
                              No trade history
                            </TableCell>
                          </TableRow>
                        ) : (
                          tradeHistory.slice(0, 5).map((trade, index) => (
                            <TableRow key={index} className="border-gray-800">
                              <TableCell className={`text-xs font-medium ${trade.side === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                                {trade.side.toUpperCase()}
                              </TableCell>
                              <TableCell className="text-xs">
                                {formatCurrency(trade.amount)}
                              </TableCell>
                              <TableCell className="text-xs">
                                ${trade.price?.toFixed(6)}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Helper components to keep the main component clean
const TokenMarketCard = ({ token, onClick }: { token: ListedToken, onClick: () => void }) => (
  <div 
    className="bg-[#1A1F2C]/50 p-2 rounded cursor-pointer hover:bg-[#1A1F2C]/80 transition-colors"
    onClick={onClick}
  >
    <div className="flex items-center gap-2 mb-1">
      <div className="h-6 w-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
        {token.symbol.charAt(0)}
      </div>
      <span className="text-xs font-medium">{token.symbol}</span>
    </div>
    <div className="flex justify-between items-center">
      <span className="text-xs">${token.price.toFixed(6)}</span>
      <Badge className={`text-xs ${token.priceChange24h >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
        {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h}%
      </Badge>
    </div>
  </div>
);

const WhaleActivityFeed = ({ tokenSymbol }: { tokenSymbol: string }) => {
  // Mock whale activity data
  const whaleActivity = [
    { 
      action: 'buy',
      amount: 25000,
      value: 15250,
      time: '10 mins ago',
      wallet: '8zjX...BhR'
    },
    { 
      action: 'sell',
      amount: 50000,
      value: 30500,
      time: '25 mins ago',
      wallet: '9ajX...CyZ'
    },
    { 
      action: 'buy',
      amount: 100000,
      value: 61000,
      time: '1 hour ago',
      wallet: '7wpX...AiJ'
    }
  ];
  
  return (
    <div className="space-y-3">
      {whaleActivity.map((activity, index) => (
        <div key={index} className="bg-[#1A1F2C]/50 p-2 rounded-md">
          <div className="flex justify-between">
            <div className="flex items-center">
              <div className={`p-1 rounded-full mr-2 ${activity.action === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                {activity.action === 'buy' ? (
                  <ArrowUp className={`h-3 w-3 text-green-400`} />
                ) : (
                  <ArrowDown className={`h-3 w-3 text-red-400`} />
                )}
              </div>
              <div>
                <div className="text-xs font-medium flex items-center">
                  <span className={activity.action === 'buy' ? 'text-green-400' : 'text-red-400'}>
                    {activity.action === 'buy' ? 'Bought' : 'Sold'}
                  </span>
                  <span className="text-white ml-1">
                    {formatNumber(activity.amount)} {tokenSymbol}
                  </span>
                </div>
                <div className="text-xs text-gray-400">by {activity.wallet}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs font-medium">${formatNumber(activity.value)}</div>
              <div className="text-xs text-gray-400">{activity.time}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
  
  function formatNumber(num: number) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }
};

export default TradingTerminal;
