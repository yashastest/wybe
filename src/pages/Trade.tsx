
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Info, Coins, TrendingUp, History, Calendar } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import BondingCurveChart from "@/components/BondingCurveChart";
import TradingViewChart from "@/components/TradingViewChart";
import TraderActivityMarkers, { TraderActivity } from "@/components/TraderActivityMarkers";
import { toast } from "sonner";
import { useWallet } from "@/hooks/useWallet";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useIsMobile } from "@/hooks/use-mobile";

const Trade = () => {
  const { wallet, connect } = useWallet();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [activeTab, setActiveTab] = useState("buy");
  const [activeHistoryTab, setActiveHistoryTab] = useState("all");
  const [amount, setAmount] = useState("");
  const [estimatedReceived, setEstimatedReceived] = useState("0");
  const [chartTimeframe, setChartTimeframe] = useState("1D");
  const [chartType, setChartType] = useState<'price' | 'marketCap'>('price');
  const [bondingCurveType, setBondingCurveType] = useState<"linear" | "exponential" | "sigmoid">("linear");
  const isMobile = useIsMobile();
  
  // Mock coin data
  const coinData = {
    name: "Pepe Solana",
    symbol: "PEPES",
    creator: "DummyWallet123456",
    supply: "1,000,000,000",
    price: "0.00023",
    marketCap: "$230,000",
    volume24h: "$52,000",
    priceChange: "+15.4%"
  };

  // Mock trade history data
  const tradeHistory = [
    { 
      type: "buy",
      amount: "500,000",
      price: "0.00020",
      value: "100",
      wallet: "DUmm...7j2k",
      time: "2 mins ago"
    },
    { 
      type: "sell",
      amount: "250,000",
      price: "0.00022",
      value: "55",
      wallet: "8kAs...1x3P",
      time: "15 mins ago"
    },
    { 
      type: "buy",
      amount: "750,000",
      price: "0.00019",
      value: "142.5",
      wallet: "3mNb...9q7R",
      time: "35 mins ago"
    },
    { 
      type: "sell",
      amount: "120,000",
      price: "0.00021",
      value: "25.2",
      wallet: "2xYz...8h6G",
      time: "1 hour ago"
    },
    { 
      type: "buy",
      amount: "1,000,000",
      price: "0.00018",
      value: "180",
      wallet: "7jKl...5t4R",
      time: "2 hours ago"
    },
    { 
      type: "buy",
      amount: "350,000",
      price: "0.00019",
      value: "66.5",
      wallet: "9pQr...3d2F",
      time: "3 hours ago"
    }
  ];
  
  // Mock trader activity data
  const traderActivities: TraderActivity[] = [
    {
      type: 'developer',
      price: 0.00018,
      timestamp: '2025-04-01T10:00:00Z',
      action: 'buy',
      quantity: 5000000,
      percentage: 12.5
    },
    {
      type: 'whale',
      price: 0.00021,
      timestamp: '2025-04-05T14:30:00Z',
      action: 'buy',
      quantity: 2000000
    },
    {
      type: 'retail',
      price: 0.00023,
      timestamp: '2025-04-10T09:15:00Z',
      action: 'buy',
      quantity: 50000
    },
    {
      type: 'whale',
      price: 0.00025,
      timestamp: '2025-04-12T16:45:00Z',
      action: 'sell',
      quantity: 1000000
    }
  ];

  // Filter trade history based on active tab
  const filteredHistory = tradeHistory.filter(trade => {
    if (activeHistoryTab === "all") return true;
    return trade.type === activeHistoryTab;
  });
  
  const handleConnect = async () => {
    try {
      await connect();
      setIsWalletConnected(true);
      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect wallet");
    }
  };
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAmount(value);
    
    // Calculate estimated received (simplified for demo)
    if (value === '') {
      setEstimatedReceived("0");
    } else {
      const numValue = parseFloat(value);
      if (activeTab === "buy") {
        setEstimatedReceived(Math.floor(numValue / 0.00023 * 0.99).toString());
      } else {
        setEstimatedReceived((numValue * 0.00023 * 0.99).toFixed(5));
      }
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isWalletConnected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    toast.success(`${activeTab === "buy" ? "Buy" : "Sell"} transaction submitted!`);
    setAmount("");
    setEstimatedReceived("0");
  };

  const timeFrameOptions = ["5m", "15m", "30m", "1h", "4h", "1D", "1W", "1M"];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-grow overflow-x-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left column - Coin info & Chart */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Token header */}
              <div className="glass-card p-4 md:p-6 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-wybe-primary/20 flex items-center justify-center overflow-hidden">
                      <AspectRatio ratio={1 / 1} className="relative w-full h-full">
                        <img 
                          src="/lovable-uploads/a8831646-bbf0-4510-9f62-5999db7cca5d.png" 
                          alt="Wybe Logo"
                          className="object-cover"
                        />
                      </AspectRatio>
                    </div>
                    <div>
                      <h1 className="text-lg md:text-xl font-bold">{coinData.name} ({coinData.symbol})</h1>
                      <p className="text-xs md:text-sm text-gray-400">
                        Creator: <a href="#" className="hover:text-wybe-primary transition-colors hover:underline">
                          {coinData.creator}
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm px-3 py-1 rounded-full ${parseFloat(coinData.priceChange) >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {coinData.priceChange}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  <StatsCard label="Price" value={`${coinData.price} SOL`} />
                  <StatsCard label="Market Cap" value={coinData.marketCap} />
                  <StatsCard label="24h Volume" value={coinData.volume24h} />
                  <StatsCard label="Total Supply" value={coinData.supply} />
                </div>
                
                <div className="mt-4 p-3 bg-wybe-primary/10 border border-wybe-primary/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-wybe-primary" />
                    <p className="text-xs md:text-sm text-gray-300">
                      Contract: <a 
                        href={`https://solscan.io/token/FG9SYnttGJKQsHqNPZhwGVkzkJEGnY8kaySvbSSNYNtw`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-wybe-secondary hover:underline"
                      >
                        FG9SYnttGJKQsHqNPZhwGVkzkJEGnY8kaySvbSSNYNtw
                      </a>
                    </p>
                  </div>
                </div>
                
                {/* Trader activity markers */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-sm text-gray-400">Trading Activity:</span>
                  <TraderActivityMarkers activities={traderActivities} />
                </div>
              </div>
              
              {/* Chart Controls */}
              <div className="glass-card p-3 md:p-4 mb-2">
                <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center space-x-2 w-full sm:w-auto">
                    <span className="text-xs md:text-sm text-gray-400">Chart Type:</span>
                    <div className="flex">
                      <Button 
                        size="sm" 
                        variant={chartType === 'price' ? 'default' : 'outline'}
                        className="rounded-r-none text-xs h-8"
                        onClick={() => setChartType('price')}
                      >
                        Price
                      </Button>
                      <Button 
                        size="sm" 
                        variant={chartType === 'marketCap' ? 'default' : 'outline'}
                        className="rounded-l-none text-xs h-8"
                        onClick={() => setChartType('marketCap')}
                      >
                        Market Cap
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <span className="text-xs md:text-sm text-gray-400">Timeframe:</span>
                    <div className="flex flex-wrap gap-1">
                      {timeFrameOptions.map((tf) => (
                        <Button 
                          key={tf}
                          size="sm" 
                          variant={chartTimeframe === tf ? 'default' : 'outline'}
                          className="text-xs h-7 px-2"
                          onClick={() => setChartTimeframe(tf)}
                        >
                          {tf}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Price Chart */}
              <div className="glass-card p-3 md:p-4 mb-6">
                <TradingViewChart 
                  symbol={coinData.symbol}
                  timeframe={chartTimeframe}
                  chartType={chartType}
                  containerClassName="h-[300px] md:h-[400px]"
                />
              </div>
              
              {/* Bonding Curve Section - New Addition */}
              <div className="glass-card p-3 md:p-6 mb-6">
                <div className="flex flex-wrap items-center justify-between mb-4">
                  <h2 className="text-lg font-medium flex items-center gap-2">
                    <TrendingUp size={18} className="text-wybe-primary" />
                    Bonding Curve
                  </h2>
                  
                  <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <span className="text-xs md:text-sm text-gray-400">Curve Type:</span>
                    <div className="flex">
                      <Button 
                        size="sm" 
                        variant={bondingCurveType === 'linear' ? 'default' : 'outline'}
                        className="rounded-r-none text-xs h-8"
                        onClick={() => setBondingCurveType('linear')}
                      >
                        Linear
                      </Button>
                      <Button 
                        size="sm" 
                        variant={bondingCurveType === 'exponential' ? 'default' : 'outline'}
                        className="rounded-none border-x-0 text-xs h-8"
                        onClick={() => setBondingCurveType('exponential')}
                      >
                        Exponential
                      </Button>
                      <Button 
                        size="sm" 
                        variant={bondingCurveType === 'sigmoid' ? 'default' : 'outline'}
                        className="rounded-l-none text-xs h-8"
                        onClick={() => setBondingCurveType('sigmoid')}
                      >
                        Sigmoid
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="mb-2">
                  <p className="text-sm text-gray-300">
                    This bonding curve shows how token price changes as supply is sold. {bondingCurveType === 'linear' ? 
                    'Linear curves have a constant price increase.' : 
                    bondingCurveType === 'exponential' ? 
                    'Exponential curves accelerate price growth as supply decreases.' : 
                    'Sigmoid curves have slow initial growth, rapid middle growth, and slow final growth.'}
                  </p>
                </div>
                
                <BondingCurveChart 
                  curveType={bondingCurveType} 
                  height={250} 
                  animated={true}
                />
              </div>
              
              {/* Trade History */}
              <div className="glass-card p-3 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium flex items-center gap-2">
                    <History size={18} className="text-wybe-primary" />
                    Trade History
                  </h2>
                  
                  <div className="flex items-center gap-2">
                    <Tabs value={activeHistoryTab} onValueChange={setActiveHistoryTab}>
                      <TabsList className="bg-wybe-background-light border border-wybe-primary/20 h-8">
                        <TabsTrigger value="all" className="text-xs h-6">All</TabsTrigger>
                        <TabsTrigger value="buy" className="text-xs h-6">Buys</TabsTrigger>
                        <TabsTrigger value="sell" className="text-xs h-6">Sells</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
                
                <div className="overflow-x-auto -mx-3 px-3">
                  <table className="w-full min-w-[640px]">
                    <thead>
                      <tr className="text-left text-gray-400 text-sm border-b border-white/10">
                        <th className="pb-2">Type</th>
                        <th className="pb-2">Amount</th>
                        <th className="pb-2">Price</th>
                        <th className="pb-2">Total Value</th>
                        <th className="pb-2">Wallet</th>
                        <th className="pb-2 text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredHistory.map((trade, index) => (
                        <tr key={index} className="border-b border-white/5 last:border-b-0">
                          <td className={`py-3 ${trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                            {trade.type === 'buy' ? 'Buy' : 'Sell'}
                          </td>
                          <td className="py-3">{trade.amount} {coinData.symbol}</td>
                          <td className="py-3">{trade.price} SOL</td>
                          <td className="py-3">{trade.value} SOL</td>
                          <td className="py-3 text-gray-400">{trade.wallet}</td>
                          <td className="py-3 text-right text-gray-400">{trade.time}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </div>
          
          {/* Right column - Trade form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="glass-card p-4 md:p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Trade {coinData.symbol}</h2>
              
              {!isWalletConnected ? (
                <div className="text-center p-6">
                  <p className="text-gray-300 mb-4">Connect your wallet to trade</p>
                  <Button onClick={handleConnect} className="btn-primary w-full">
                    Connect Wallet
                  </Button>
                </div>
              ) : (
                <>
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid grid-cols-2 mb-6">
                      <TabsTrigger value="buy">Buy</TabsTrigger>
                      <TabsTrigger value="sell">Sell</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="buy">
                      <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-400 mb-1 block">Pay with SOL</label>
                            <div className="relative">
                              <Input 
                                value={amount} 
                                onChange={handleAmountChange}
                                placeholder="0.0" 
                                className="bg-wybe-background-light border-wybe-primary/20 focus-visible:ring-wybe-primary pr-16"
                                type="number"
                                step="0.001"
                                min="0"
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                SOL
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-center py-2">
                            <div className="bg-wybe-background-light rounded-full p-1">
                              <ArrowRight className="text-wybe-primary" />
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-sm text-gray-400 mb-1 block">Receive (estimated)</label>
                            <div className="relative">
                              <Input 
                                value={estimatedReceived} 
                                readOnly 
                                className="bg-wybe-background-light border-wybe-primary/20 focus-visible:ring-wybe-primary pr-16"
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                {coinData.symbol}
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-wybe-background/50 rounded-lg p-3 mt-2">
                            <div className="flex justify-between text-sm text-gray-400 mb-1">
                              <span>Price</span>
                              <span>{coinData.price} SOL per {coinData.symbol}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-400">
                              <span>Fee</span>
                              <span>1.0%</span>
                            </div>
                          </div>
                          
                          <Button type="submit" className="btn-primary w-full">
                            Buy {coinData.symbol}
                          </Button>
                        </div>
                      </form>
                    </TabsContent>
                    
                    <TabsContent value="sell">
                      <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm text-gray-400 mb-1 block">Sell {coinData.symbol}</label>
                            <div className="relative">
                              <Input 
                                value={amount} 
                                onChange={handleAmountChange}
                                placeholder="0.0" 
                                className="bg-wybe-background-light border-wybe-primary/20 focus-visible:ring-wybe-primary pr-16"
                                type="number"
                                step="1"
                                min="0"
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                {coinData.symbol}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-center py-2">
                            <div className="bg-wybe-background-light rounded-full p-1">
                              <ArrowRight className="text-wybe-primary" />
                            </div>
                          </div>
                          
                          <div>
                            <label className="text-sm text-gray-400 mb-1 block">Receive (estimated)</label>
                            <div className="relative">
                              <Input 
                                value={estimatedReceived} 
                                readOnly 
                                className="bg-wybe-background-light border-wybe-primary/20 focus-visible:ring-wybe-primary pr-16"
                              />
                              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                SOL
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-wybe-background/50 rounded-lg p-3 mt-2">
                            <div className="flex justify-between text-sm text-gray-400 mb-1">
                              <span>Price</span>
                              <span>{coinData.price} SOL per {coinData.symbol}</span>
                            </div>
                            <div className="flex justify-between text-sm text-gray-400">
                              <span>Fee</span>
                              <span>1.0%</span>
                            </div>
                          </div>
                          
                          <Button type="submit" className="btn-primary w-full">
                            Sell {coinData.symbol}
                          </Button>
                        </div>
                      </form>
                    </TabsContent>
                  </Tabs>
                </>
              )}
              
              {/* Token stats */}
              <div className="mt-6 pt-6 border-t border-white/10">
                <h3 className="text-md font-medium mb-3">Token Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Total Fees Collected</span>
                    <span>2,450 SOL</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Creator Rewards</span>
                    <span>980 SOL</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Treasury Fee</span>
                    <span>10,000,000 {coinData.symbol}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

const StatsCard = ({ label, value }: { label: string; value: string }) => {
  return (
    <div className="bg-wybe-background/60 rounded-lg p-3">
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="text-lg font-medium">{value}</p>
    </div>
  );
};

export default Trade;
