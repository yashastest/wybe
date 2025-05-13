
import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Info, Coins, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import BondingCurveChart from "@/components/BondingCurveChart";
import { toast } from "sonner";
import { useWallet } from "@/hooks/useWallet";

const Trade = () => {
  const { wallet, connect } = useWallet();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [activeTab, setActiveTab] = useState("buy");
  const [amount, setAmount] = useState("");
  const [estimatedReceived, setEstimatedReceived] = useState("0");
  
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-12 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left column - Coin info & Chart */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Token header */}
              <div className="glass-card p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-wybe-primary/20 flex items-center justify-center">
                      <Coins className="text-wybe-primary" size={20} />
                    </div>
                    <div>
                      <h1 className="text-xl font-bold">{coinData.name} ({coinData.symbol})</h1>
                      <p className="text-sm text-gray-400">Creator: {coinData.creator}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm px-3 py-1 rounded-full ${parseFloat(coinData.priceChange) >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {coinData.priceChange}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <StatsCard label="Price" value={`${coinData.price} SOL`} />
                  <StatsCard label="Market Cap" value={coinData.marketCap} />
                  <StatsCard label="24h Volume" value={coinData.volume24h} />
                  <StatsCard label="Total Supply" value={coinData.supply} />
                </div>
              </div>
              
              {/* Chart */}
              <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-medium">Bonding Curve</h2>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <Info className="h-4 w-4 text-wybe-secondary" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-wybe-background-light border-white/10">
                        <p>Price increases as more tokens are purchased</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <div className="h-64 md:h-80">
                  <BondingCurveChart />
                </div>
                
                <div className="mt-4 p-3 bg-wybe-primary/10 border border-wybe-primary/20 rounded-lg">
                  <p className="text-sm flex items-center gap-2 text-gray-300">
                    <TrendingUp size={16} className="text-wybe-primary" />
                    <span>Classic bonding curve: Price increases linearly with supply</span>
                  </p>
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
            <div className="glass-card p-6 sticky top-24">
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
