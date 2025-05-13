
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TradingViewChart from '@/components/TradingViewChart';
import BondingCurveChart from '@/components/BondingCurveChart';
import TraderActivityMarkers from '@/components/TraderActivityMarkers';
import { toast } from 'sonner';
import { ArrowDownUp, Wallet, ArrowDown, ArrowUp, TrendingUp, Clock, BarChart3, LineChart, Layers } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet';

const Trade = () => {
  const { symbol } = useParams();
  const { connected, address, connect } = useWallet();
  const [amount, setAmount] = useState('');
  const [receiveAmount, setReceiveAmount] = useState('0.00');
  const [tab, setTab] = useState('buy');

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

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Header />
      
      <main className="flex-grow w-full px-4">
        <div className="max-w-7xl mx-auto py-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-wybe-primary/10 rounded-full flex items-center justify-center">
                  <img 
                    src={token.logo.startsWith('/') ? token.logo : `/coins/${token.id}.png`} 
                    alt={token.name} 
                    className="h-12 w-12 rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-poppins font-bold">{token.name}</h1>
                  <div className="flex items-center gap-3 text-gray-400">
                    <span className="font-mono font-bold">{token.symbol}</span>
                    <span className={token.change24h >= 0 ? "text-green-400 flex items-center" : "text-red-400 flex items-center"}>
                      {token.change24h >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                      {Math.abs(token.change24h)}%
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 font-mono">
                <div className="bg-wybe-background-light/50 px-4 py-2 rounded-lg text-sm">
                  <span className="text-gray-400">Price:</span>{" "}
                  <span className="font-bold">{token.price} SOL</span>
                </div>
                <div className="bg-wybe-background-light/50 px-4 py-2 rounded-lg text-sm">
                  <span className="text-gray-400">24h Vol:</span>{" "}
                  <span className="font-bold">${token.volume24h.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-2 glass-card overflow-hidden"
            >
              <div className="border-b border-white/10 p-4">
                <Tabs defaultValue="chart">
                  <TabsList className="bg-black/40">
                    <TabsTrigger value="chart" className="font-poppins font-bold">
                      <LineChart size={16} className="mr-1" />
                      Price Chart
                    </TabsTrigger>
                    <TabsTrigger value="depth" className="font-poppins font-bold">
                      <Layers size={16} className="mr-1" />
                      Market Depth
                    </TabsTrigger>
                    <TabsTrigger value="activity" className="font-poppins font-bold">
                      <TrendingUp size={16} className="mr-1" />
                      Activity
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="chart" className="mt-4">
                    <div className="h-[400px]">
                      <TradingViewChart symbol={token.symbol} />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="depth" className="mt-4">
                    <div className="h-[400px] flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 size={48} className="mx-auto text-gray-500 mb-2" />
                        <h3 className="text-lg font-poppins font-bold mb-1">Market Depth</h3>
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
                  <div className="bg-wybe-background-light/30 p-3 rounded-lg">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <TrendingUp size={12} />
                      Market Cap
                    </span>
                    <p className="font-bold font-mono text-lg">${token.marketCap.toLocaleString()}</p>
                  </div>
                  <div className="bg-wybe-background-light/30 p-3 rounded-lg">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <ArrowDownUp size={12} />
                      24h Volume
                    </span>
                    <p className="font-bold font-mono text-lg">${token.volume24h.toLocaleString()}</p>
                  </div>
                  <div className="bg-wybe-background-light/30 p-3 rounded-lg">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Layers size={12} />
                      Total Supply
                    </span>
                    <p className="font-bold font-mono text-lg">{token.supply.toLocaleString()}</p>
                  </div>
                  <div className="bg-wybe-background-light/30 p-3 rounded-lg">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={12} />
                      Last Updated
                    </span>
                    <p className="font-bold font-mono text-lg">Just now</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Trading Interface */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-card p-6"
            >
              <h2 className="text-xl font-poppins font-bold mb-6">Trade {token.symbol}</h2>
              
              <Tabs defaultValue="buy" onValueChange={setTab}>
                <TabsList className="mb-6 grid grid-cols-2">
                  <TabsTrigger
                    value="buy"
                    className="data-[state=active]:bg-green-600/20 data-[state=active]:text-green-400 font-poppins font-bold"
                  >
                    Buy
                  </TabsTrigger>
                  <TabsTrigger
                    value="sell"
                    className="data-[state=active]:bg-red-600/20 data-[state=active]:text-red-400 font-poppins font-bold"
                  >
                    Sell
                  </TabsTrigger>
                </TabsList>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm text-gray-400 mb-2 font-mono">
                      {tab === 'buy' ? 'Pay with SOL' : `Sell ${token.symbol}`}
                    </label>
                    <div className="relative">
                      <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="bg-wybe-background-light/50 border-white/10 font-mono text-base h-12"
                      />
                      <div className="absolute top-0 right-0 h-full px-3 flex items-center font-mono">
                        {tab === 'buy' ? 'SOL' : token.symbol}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <div className="bg-wybe-background-light/30 p-1 rounded-full">
                      <ArrowDownUp size={20} className="text-gray-400" />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-400 mb-2 font-mono">
                      {tab === 'buy' ? `Receive ${token.symbol}` : 'Receive SOL'}
                    </label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={receiveAmount}
                        disabled
                        className="bg-wybe-background-light/50 border-white/10 font-mono text-base h-12"
                      />
                      <div className="absolute top-0 right-0 h-full px-3 flex items-center font-mono">
                        {tab === 'buy' ? token.symbol : 'SOL'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button
                      onClick={handleTrade}
                      className={`w-full py-6 font-poppins font-bold text-base ${
                        tab === 'buy'
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-red-600 hover:bg-red-700'
                      }`}
                    >
                      {!connected && (
                        <>
                          <Wallet className="mr-2 h-5 w-5" />
                          Connect Wallet
                        </>
                      )}
                      {connected && tab === 'buy' && `Buy ${token.symbol}`}
                      {connected && tab === 'sell' && `Sell ${token.symbol}`}
                    </Button>
                  </div>
                  
                  <div className="bg-wybe-primary/5 p-4 rounded-lg border border-wybe-primary/20 text-sm">
                    <h3 className="font-poppins font-bold mb-2">Trade Information</h3>
                    <div className="space-y-2 font-mono">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Price</span>
                        <span>{token.price} SOL</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Fee</span>
                        <span>2.5%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Slippage Tolerance</span>
                        <span>0.5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Tabs>
            </motion.div>
          </div>
          
          {/* Bonding Curve Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 glass-card p-6"
          >
            <h2 className="text-xl font-poppins font-bold mb-4">Bonding Curve</h2>
            <p className="text-gray-400 mb-6">
              This token uses a bonding curve mechanism to determine price. The price increases as more tokens are bought and decreases as tokens are sold.
            </p>
            
            <div className="h-[300px]">
              <BondingCurveChart />
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-wybe-background-light/30 p-4 rounded-lg">
                <h3 className="font-poppins font-bold mb-2">How It Works</h3>
                <p className="text-sm text-gray-300">
                  The bonding curve ensures price stability and liquidity for the token by algorithmically adjusting prices based on supply.
                </p>
              </div>
              <div className="bg-wybe-background-light/30 p-4 rounded-lg">
                <h3 className="font-poppins font-bold mb-2">Benefits</h3>
                <p className="text-sm text-gray-300">
                  Always available liquidity, predictable price movements, and incentivized early adoption.
                </p>
              </div>
              <div className="bg-wybe-background-light/30 p-4 rounded-lg">
                <h3 className="font-poppins font-bold mb-2">Current Parameters</h3>
                <p className="text-sm font-mono">
                  <span className="text-gray-400">Curve Type:</span> Exponential<br />
                  <span className="text-gray-400">Reserve Ratio:</span> 20%<br />
                  <span className="text-gray-400">Initial Price:</span> 0.0001 SOL
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Trade;
