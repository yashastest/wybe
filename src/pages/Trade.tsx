
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import TradingViewChart from '@/components/TradingViewChart';
import BondingCurveChart from '@/components/BondingCurveChart';
import TraderActivityMarkers from '@/components/TraderActivityMarkers';
import { toast } from 'sonner';
import { ArrowDownUp, Wallet, ArrowDown, ArrowUp, TrendingUp, Clock, BarChart3, LineChart, Layers, Star, Flame, Sparkles, Zap } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';

const Trade = () => {
  const { symbol } = useParams();
  const { connected, address, connect } = useWallet();
  const [amount, setAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('0.00');
  const [tab, setTab] = useState('buy');
  const [isBondingOpen, setIsBondingOpen] = useState(false);

  // Mock data for the selected token
  const token = {
    id: symbol?.toLowerCase() || 'pepes',
    name: (symbol && `${symbol.charAt(0).toUpperCase()}${symbol.slice(1).toLowerCase()}`) || 'Pepe Solana',
    symbol: symbol?.toUpperCase() || 'PEPES',
    logo: `/coins/${symbol?.toLowerCase() || 'pepe'}.png`,
    price: 0.00023,
    change24h: 15.4,
    marketCap: 230000,
    volume24h: 52000,
    supply: 1000000000
  };

  // Sample trader activities for the chart
  const traderActivities = [
    {
      type: 'developer' as const,
      price: 0.00021,
      timestamp: '2024-04-20T10:30:00Z',
      action: 'buy' as const,
      quantity: 50000,
      percentage: 12
    },
    {
      type: 'whale' as const,
      price: 0.00022,
      timestamp: '2024-04-21T14:15:00Z',
      action: 'buy' as const,
      quantity: 200000
    },
    {
      type: 'retail' as const,
      price: 0.00023,
      timestamp: '2024-04-22T09:45:00Z',
      action: 'sell' as const,
      quantity: 10000
    },
    {
      type: 'whale' as const,
      price: 0.00024,
      timestamp: '2024-04-23T16:20:00Z',
      action: 'sell' as const,
      quantity: 100000
    }
  ];

  // Process trade
  const handleTrade = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!connected) {
      connect();
      return;
    }

    const transactionType = tab === 'buy' ? 'Purchase' : 'Sale';
    
    toast.success(`${transactionType} Successful`, {
      description: `${transactionType} of ${receiveAmount} ${token.symbol} completed`
    });
    
    setAmount('');
    setReceiveAmount('0.00');
  };

  // Calculate receive amount based on input and selected tab
  useEffect(() => {
    const parsedAmount = parseFloat(amount) || 0;
    
    if (tab === 'buy') {
      // Simple calculation for demo purposes
      const tokenAmount = parsedAmount / token.price;
      setReceiveAmount(tokenAmount ? tokenAmount.toFixed(2) : '0.00');
    } else {
      // Sell calculation
      const solAmount = parsedAmount * token.price;
      setReceiveAmount(solAmount ? solAmount.toFixed(5) : '0.00');
    }
  }, [amount, tab, token.price]);

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (delay = 0) => ({
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut", delay }
    })
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.03, 1],
      transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-indigo-950/40 to-black bg-fixed">
      <Header />
      
      <main className="flex-grow w-full px-4">
        <div className="max-w-7xl mx-auto py-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="h-16 w-16 rounded-full flex items-center justify-center relative overflow-hidden"
                  animate={{
                    boxShadow: [
                      "0 0 15px rgba(139, 92, 246, 0.5)",
                      "0 0 25px rgba(51, 195, 240, 0.7)",
                      "0 0 15px rgba(139, 92, 246, 0.5)"
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 via-indigo-500 to-blue-400 opacity-50" />
                  <img 
                    src={token.logo.startsWith('/') ? token.logo : `/coins/${token.id}.png`} 
                    alt={token.name} 
                    className="h-12 w-12 rounded-full relative z-10 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </motion.div>
                <div>
                  <h1 className="text-3xl font-poppins font-bold">
                    <span className="bg-gradient-to-r from-purple-500 via-indigo-400 to-blue-500 bg-clip-text text-transparent">
                      {token.name}
                    </span>
                  </h1>
                  <div className="flex items-center gap-3 text-gray-300">
                    <span className="font-mono font-bold bg-gradient-to-r from-purple-500 to-indigo-500 px-2 py-0.5 rounded text-white">
                      {token.symbol}
                    </span>
                    <span className={token.change24h >= 0 ? "text-green-400 flex items-center" : "text-red-400 flex items-center"}>
                      {token.change24h >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                      {Math.abs(token.change24h)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 font-mono">
                <motion.div 
                  variants={pulseVariants}
                  animate="pulse"
                  className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 backdrop-blur-lg px-4 py-2 rounded-lg text-sm border border-white/10"
                >
                  <span className="text-gray-400">Price:</span>{" "}
                  <span className="font-bold text-white">{token.price} SOL</span>
                </motion.div>
                <motion.div 
                  variants={pulseVariants}
                  animate="pulse"
                  className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 backdrop-blur-lg px-4 py-2 rounded-lg text-sm border border-white/10"
                >
                  <span className="text-gray-400">24h Vol:</span>{" "}
                  <span className="font-bold text-white">${token.volume24h.toLocaleString()}</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Section */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
              custom={0.1}
              className="lg:col-span-2 rounded-xl overflow-hidden backdrop-blur-lg border border-white/10 bg-gradient-to-br from-indigo-950/50 to-purple-900/20"
            >
              <div className="border-b border-white/10 p-4">
                <Tabs defaultValue="chart">
                  <TabsList className="bg-black/40 backdrop-blur-md">
                    <TabsTrigger 
                      value="chart" 
                      className="font-poppins font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/50 data-[state=active]:to-indigo-600/50"
                    >
                      <LineChart size={16} className="mr-2" />
                      Price Chart
                    </TabsTrigger>
                    <TabsTrigger 
                      value="depth" 
                      className="font-poppins font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/50 data-[state=active]:to-indigo-600/50"
                    >
                      <Layers size={16} className="mr-2" />
                      Market Depth
                    </TabsTrigger>
                    <TabsTrigger 
                      value="activity" 
                      className="font-poppins font-bold data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/50 data-[state=active]:to-indigo-600/50"
                    >
                      <TrendingUp size={16} className="mr-2" />
                      Activity
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="chart" className="mt-4">
                    <TradingViewChart symbol={token.symbol} />
                  </TabsContent>
                  
                  <TabsContent value="depth" className="mt-4">
                    <div className="h-[400px] flex items-center justify-center">
                      <div className="text-center">
                        <motion.div
                          animate={{
                            opacity: [0.7, 1, 0.7],
                            scale: [1, 1.05, 1]
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <BarChart3 size={48} className="mx-auto text-indigo-400 mb-2" />
                        </motion.div>
                        <h3 className="text-lg font-poppins font-bold mb-1 text-gradient">Market Depth</h3>
                        <p className="text-gray-400">Market depth data will appear here</p>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="activity" className="mt-4">
                    <div className="h-[400px]">
                      <TraderActivityMarkers activities={traderActivities} />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/40 backdrop-blur-sm p-3 rounded-lg border border-white/5 shadow-glow-sm hover:shadow-glow-md transition-all duration-300">
                    <span className="text-xs text-indigo-300 flex items-center gap-1">
                      <TrendingUp size={12} className="text-indigo-400" />
                      Market Cap
                    </span>
                    <p className="font-bold font-mono text-lg text-white">${token.marketCap.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/40 backdrop-blur-sm p-3 rounded-lg border border-white/5 shadow-glow-sm hover:shadow-glow-md transition-all duration-300">
                    <span className="text-xs text-indigo-300 flex items-center gap-1">
                      <ArrowDownUp size={12} className="text-indigo-400" />
                      24h Volume
                    </span>
                    <p className="font-bold font-mono text-lg text-white">${token.volume24h.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/40 backdrop-blur-sm p-3 rounded-lg border border-white/5 shadow-glow-sm hover:shadow-glow-md transition-all duration-300">
                    <span className="text-xs text-indigo-300 flex items-center gap-1">
                      <Layers size={12} className="text-indigo-400" />
                      Total Supply
                    </span>
                    <p className="font-bold font-mono text-lg text-white">{token.supply.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/40 backdrop-blur-sm p-3 rounded-lg border border-white/5 shadow-glow-sm hover:shadow-glow-md transition-all duration-300">
                    <span className="text-xs text-indigo-300 flex items-center gap-1">
                      <Clock size={12} className="text-indigo-400" />
                      Last Updated
                    </span>
                    <p className="font-bold font-mono text-lg text-white">Just now</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Trading Interface */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
              custom={0.2}
              className="bg-gradient-to-br from-indigo-950/80 to-purple-900/60 backdrop-blur-lg p-6 rounded-xl border border-white/10 shadow-glow-sm"
            >
              <h2 className="text-xl font-poppins font-bold mb-6 flex items-center">
                <Flame size={20} className="mr-2 text-orange-500" />
                <span className="bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent">
                  Trade {token.symbol}
                </span>
              </h2>
              
              <Tabs defaultValue="buy" onValueChange={setTab}>
                <TabsList className="mb-6 grid grid-cols-2 bg-black/40 backdrop-blur">
                  <TabsTrigger
                    value="buy"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600/50 data-[state=active]:to-emerald-600/20 data-[state=active]:text-green-400 font-poppins font-bold"
                  >
                    <Sparkles size={16} className="mr-2" />
                    Buy
                  </TabsTrigger>
                  <TabsTrigger
                    value="sell"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-600/50 data-[state=active]:to-rose-600/20 data-[state=active]:text-red-400 font-poppins font-bold"
                  >
                    <Zap size={16} className="mr-2" />
                    Sell
                  </TabsTrigger>
                </TabsList>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-indigo-200 mb-2 font-mono">
                      {tab === 'buy' ? 'Pay with SOL' : `Sell ${token.symbol}`}
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="bg-black/30 border-white/10 font-mono text-base h-12 focus:border-indigo-500 focus:ring-indigo-500/30"
                      />
                      <div className="absolute top-0 right-0 h-full px-3 flex items-center font-mono text-indigo-200">
                        {tab === 'buy' ? 'SOL' : token.symbol}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <motion.div 
                      className="bg-gradient-to-r from-indigo-600/30 to-purple-600/30 p-2 rounded-full"
                      animate={{
                        rotate: [0, 180, 360],
                      }}
                      transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    >
                      <ArrowDownUp size={20} className="text-indigo-300" />
                    </motion.div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-indigo-200 mb-2 font-mono">
                      {tab === 'buy' ? `Receive ${token.symbol}` : 'Receive SOL'}
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={receiveAmount}
                        disabled
                        className="bg-black/30 border-white/10 font-mono text-base h-12"
                      />
                      <div className="absolute top-0 right-0 h-full px-3 flex items-center font-mono text-indigo-200">
                        {tab === 'buy' ? token.symbol : 'SOL'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        onClick={handleTrade}
                        className={`w-full py-6 font-poppins font-bold text-base ${
                          tab === 'buy'
                            ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 shadow-[0_0_15px_rgba(34,197,94,0.5)] hover:shadow-[0_0_20px_rgba(34,197,94,0.7)]'
                            : 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 shadow-[0_0_15px_rgba(239,68,68,0.5)] hover:shadow-[0_0_20px_rgba(239,68,68,0.7)]'
                        } transition-all duration-300`}
                      >
                        {!connected && (
                          <>
                            <Wallet className="mr-2 h-5 w-5" />
                            Connect Wallet
                          </>
                        )}
                        {connected && tab === 'buy' && (
                          <>
                            <Star className="mr-2 h-5 w-5" />
                            Buy {token.symbol}
                          </>
                        )}
                        {connected && tab === 'sell' && (
                          <>
                            <Zap className="mr-2 h-5 w-5" />
                            Sell {token.symbol}
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                  
                  <motion.div 
                    className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 p-4 rounded-lg border border-indigo-500/20 text-sm"
                    animate={{
                      boxShadow: [
                        "0 0 10px rgba(139, 92, 246, 0.2)",
                        "0 0 15px rgba(139, 92, 246, 0.4)",
                        "0 0 10px rgba(139, 92, 246, 0.2)"
                      ]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <h3 className="font-poppins font-bold mb-2 text-indigo-200">Trade Information</h3>
                    <div className="space-y-2 font-mono">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Price</span>
                        <span className="text-white">{token.price} SOL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Fee</span>
                        <span className="text-white">2.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Slippage Tolerance</span>
                        <span className="text-white">0.5%</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </Tabs>
            </motion.div>
          </div>
          
          {/* Bonding Curve Section */}
          <Collapsible
            open={isBondingOpen}
            onOpenChange={setIsBondingOpen}
            className="mt-8"
          >
            <CollapsibleTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3 flex items-center justify-between bg-gradient-to-r from-indigo-950/80 to-purple-900/60 backdrop-blur-lg rounded-xl border border-white/10 px-6 text-white font-poppins font-bold"
              >
                <div className="flex items-center">
                  <Star className="mr-2 h-5 w-5 text-yellow-400" />
                  <span className="bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent">
                    Bonding Curve Information
                  </span>
                </div>
                <div className="text-indigo-300">
                  {isBondingOpen ? '↑ Hide Details' : '↓ Show Details'}
                </div>
              </motion.button>
            </CollapsibleTrigger>
            
            <CollapsibleContent>
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                  opacity: isBondingOpen ? 1 : 0,
                  height: isBondingOpen ? 'auto' : 0
                }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-br from-indigo-950/80 to-purple-900/60 backdrop-blur-lg p-6 rounded-xl border border-white/10 mt-2"
              >
                <h2 className="text-xl font-poppins font-bold mb-4 bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent">
                  Bonding Curve
                </h2>
                <p className="text-indigo-200 mb-6">
                  This token uses a bonding curve mechanism to determine price. The price increases as more tokens are bought and decreases as tokens are sold.
                </p>
                
                <div className="h-[300px]">
                  <BondingCurveChart />
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-black/30 p-4 rounded-lg border border-white/5 hover:border-white/10 transition-all duration-300">
                    <h3 className="font-poppins font-bold mb-2 text-indigo-200">How It Works</h3>
                    <p className="text-sm text-gray-300">
                      The bonding curve ensures price stability and liquidity for the token by algorithmically adjusting prices based on supply.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg border border-white/5 hover:border-white/10 transition-all duration-300">
                    <h3 className="font-poppins font-bold mb-2 text-indigo-200">Benefits</h3>
                    <p className="text-sm text-gray-300">
                      Always available liquidity, predictable price movements, and incentivized early adoption.
                    </p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg border border-white/5 hover:border-white/10 transition-all duration-300">
                    <h3 className="font-poppins font-bold mb-2 text-indigo-200">Current Parameters</h3>
                    <p className="text-sm font-mono">
                      <span className="text-gray-400">Curve Type:</span> <span className="text-white">Exponential</span><br />
                      <span className="text-gray-400">Reserve Ratio:</span> <span className="text-white">20%</span><br />
                      <span className="text-gray-400">Initial Price:</span> <span className="text-white">0.0001 SOL</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Trade;
