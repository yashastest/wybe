
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import TradingViewChart from '@/components/TradingViewChart';
import BondingCurveChart from '@/components/BondingCurveChart';
import TraderActivityMarkers from '@/components/TraderActivityMarkers';
import { toast } from 'sonner';
import { ArrowDown, ArrowUp, TrendingUp, Clock, BarChart3, LineChart, Layers, Star, ArrowUpDown } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet.tsx';
import EnhancedTradingInterface from '@/components/EnhancedTradingInterface';
import TradingInterface from '@/components/TradingInterface';
import TransactionHistory from '@/components/TransactionHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useWalletBalance } from '@/hooks/useWalletBalance';

const Trade = () => {
  // Extract token symbol from URL params or use a default
  const { tokenId } = useParams();
  const defaultToken = "SOL";
  const symbol = tokenId || defaultToken;
  
  const { connected, address } = useWallet();
  const { refreshBalances } = useWalletBalance(symbol);
  
  const [tab, setTab] = useState('chart');
  const [isBondingOpen, setIsBondingOpen] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [canClaimRewards, setCanClaimRewards] = useState(false);
  const [nextClaimDate, setNextClaimDate] = useState<Date | null>(null);
  const [tokenData, setTokenData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEnhanced, setShowEnhanced] = useState(false);

  const normalizedSymbol = symbol?.toLowerCase() || '';

  // Get token data from Supabase or use demo data
  useEffect(() => {
    const fetchTokenData = async () => {
      if (!normalizedSymbol) return;
      
      setIsLoading(true);
      try {
        // For demo purposes, always use sample data
        setTokenData({
          name: symbol.charAt(0).toUpperCase() + symbol.slice(1).toLowerCase(),
          symbol: symbol.toUpperCase(),
          market_cap: 250000,
          creator_wallet: '',
          price: 0.00023,
          change24h: 15.4
        });
        
        // Check if current user is creator (demo)
        if (connected && address) {
          setIsCreator(Math.random() > 0.8); // Random chance of being creator for demo
        }
        
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching token data:', error);
        // Use mock data if token not found in database
        setTokenData({
          name: `${symbol.charAt(0).toUpperCase()}${symbol.slice(1).toLowerCase()}`,
          symbol: symbol?.toUpperCase(),
          market_cap: 50000,
          creator_wallet: '',
          price: 0.00023,
          change24h: 15.4
        });
        setIsLoading(false);
      }
    };
    
    fetchTokenData();
  }, [normalizedSymbol, connected, address]);

  // Demo data
  const token = {
    id: normalizedSymbol,
    name: tokenData?.name || (symbol && `${symbol.charAt(0).toUpperCase()}${symbol.slice(1).toLowerCase()}`),
    symbol: tokenData?.symbol || symbol?.toUpperCase(),
    logo: `/coins/${normalizedSymbol}.png`,
    price: 0.00023,
    change24h: 15.4,
    marketCap: tokenData?.market_cap || 50000,
    volume24h: 52000,
    supply: 1000000000,
    isDexscreenerListed: tokenData?.market_cap >= 50000
  };

  // Reset wallet balance
  useEffect(() => {
    if (connected) {
      refreshBalances();
    }
  }, [connected, normalizedSymbol]);

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

  // Sample token options for demo
  const demoTokens = [
    { id: "bonk", name: "Bonk", symbol: "BONK" },
    { id: "samo", name: "Samoyedcoin", symbol: "SAMO" },
    { id: "meme", name: "Memecoin", symbol: "MEME" },
    { id: "pepe", name: "Pepe", symbol: "PEPE" }
  ];
  
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-indigo-950/40 to-black bg-fixed">
        <Header />
        <main className="flex-grow w-full px-4 pt-20 md:pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl text-indigo-200">Loading token data...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-indigo-950/40 to-black bg-fixed">
      <Header />
      
      <main className="flex-grow w-full px-4 pt-20 md:pt-24">
        <div className="max-w-7xl mx-auto py-4 md:py-8">
          {/* Demo Token Selection */}
          <div className="mb-6 p-4 bg-indigo-900/30 rounded-xl">
            <h3 className="font-bold mb-2">Select a demo token to trade:</h3>
            <div className="flex flex-wrap gap-2">
              {demoTokens.map(token => (
                <Link 
                  key={token.id}
                  to={`/trade/${token.id}`}
                  className="px-3 py-1 bg-indigo-700/50 hover:bg-indigo-600/50 rounded-full text-sm transition-colors"
                >
                  {token.symbol}
                </Link>
              ))}
            </div>
          </div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUpVariants}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <motion.div 
                  className="h-14 w-14 md:h-16 md:w-16 rounded-full flex items-center justify-center relative overflow-hidden"
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
                    src={token.logo.startsWith('/') ? token.logo : `/placeholder.svg`} 
                    alt={token.name} 
                    className="h-10 w-10 md:h-12 md:w-12 rounded-full relative z-10 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </motion.div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-poppins font-bold">
                    <span className="bg-gradient-to-r from-purple-500 via-indigo-400 to-blue-500 bg-clip-text text-transparent">
                      {token.name}
                    </span>
                  </h1>
                  <div className="flex items-center gap-3 text-gray-300">
                    <span className="font-mono font-bold bg-gradient-to-r from-purple-500 to-indigo-500 px-2 py-0.5 rounded-full text-white">
                      {token.symbol}
                    </span>
                    <span className={token.change24h >= 0 ? "text-green-400 flex items-center" : "text-red-400 flex items-center"}>
                      {token.change24h >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                      {Math.abs(token.change24h)}%
                    </span>
                    
                    {token.isDexscreenerListed && (
                      <div className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded flex items-center gap-1">
                        <Star size={10} />
                        DEXScreener
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 md:gap-3 font-mono mt-2 md:mt-0 w-full md:w-auto">
                <motion.div 
                  variants={pulseVariants}
                  animate="pulse"
                  className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 backdrop-blur-lg px-2 md:px-4 py-2 rounded-xl text-xs md:text-sm border border-white/10 flex-1 md:flex-none text-center md:text-left"
                >
                  <span className="text-gray-400">Price:</span>{" "}
                  <span className="font-bold text-white">{token.price} SOL</span>
                </motion.div>
                <motion.div 
                  variants={pulseVariants}
                  animate="pulse"
                  className="bg-gradient-to-r from-indigo-900/80 to-purple-900/80 backdrop-blur-lg px-2 md:px-4 py-2 rounded-xl text-xs md:text-sm border border-white/10 flex-1 md:flex-none text-center md:text-left"
                >
                  <span className="text-gray-400">24h Vol:</span>{" "}
                  <span className="font-bold text-white">${token.volume24h.toLocaleString()}</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Toggle between normal and enhanced interfaces for demo */}
          <div className="mb-6 flex justify-center">
            <button 
              onClick={() => setShowEnhanced(!showEnhanced)}
              className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 rounded-lg text-sm transition-colors"
            >
              Switch to {showEnhanced ? "Standard" : "Enhanced"} Trading Interface
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Chart Section */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
              custom={0.1}
              className="lg:col-span-2 rounded-xl overflow-hidden backdrop-blur-lg border border-white/10 bg-gradient-to-br from-indigo-950/50 to-purple-900/20"
            >
              <div className="border-b border-white/10 p-2 md:p-4">
                <Tabs defaultValue="chart" value={tab} onValueChange={setTab}>
                  <TabsList className="bg-black/40 backdrop-blur-md w-full overflow-x-auto flex-nowrap">
                    <TabsTrigger 
                      value="chart" 
                      className="font-poppins font-bold whitespace-nowrap data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/50 data-[state=active]:to-indigo-600/50"
                    >
                      <LineChart size={14} className="mr-1 md:mr-2" />
                      Price Chart
                    </TabsTrigger>
                    <TabsTrigger 
                      value="depth" 
                      className="font-poppins font-bold whitespace-nowrap data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/50 data-[state=active]:to-indigo-600/50"
                    >
                      <Layers size={14} className="mr-1 md:mr-2" />
                      Market Depth
                    </TabsTrigger>
                    <TabsTrigger 
                      value="activity" 
                      className="font-poppins font-bold whitespace-nowrap data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/50 data-[state=active]:to-indigo-600/50"
                    >
                      <TrendingUp size={14} className="mr-1 md:mr-2" />
                      Activity
                    </TabsTrigger>
                    <TabsTrigger 
                      value="history" 
                      className="font-poppins font-bold whitespace-nowrap data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600/50 data-[state=active]:to-indigo-600/50"
                    >
                      <Clock size={14} className="mr-1 md:mr-2" />
                      Your History
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="chart" className="mt-4">
                    <div className="h-[300px] md:h-[400px]">
                      <TradingViewChart symbol={token.symbol} />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="depth" className="mt-4">
                    <div className="h-[300px] md:h-[400px] flex items-center justify-center">
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
                    <div className="h-[300px] md:h-[400px]">
                      <TraderActivityMarkers activities={[]} />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="history" className="mt-4">
                    <div className="h-[300px] md:h-[400px] overflow-y-auto">
                      <TransactionHistory tokenSymbol={token.symbol} />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
              
              <div className="p-3 md:p-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                  <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/40 backdrop-blur-sm p-2 md:p-3 rounded-xl border border-white/5 shadow-glow-sm hover:shadow-glow-md transition-all duration-300">
                    <span className="text-xs text-indigo-300 flex items-center gap-1">
                      <TrendingUp size={12} className="text-indigo-400" />
                      Market Cap
                    </span>
                    <p className="font-bold font-mono text-sm md:text-lg text-white">${token.marketCap.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/40 backdrop-blur-sm p-2 md:p-3 rounded-xl border border-white/5 shadow-glow-sm hover:shadow-glow-md transition-all duration-300">
                    <span className="text-xs text-indigo-300 flex items-center gap-1">
                      <ArrowUpDown size={12} className="text-indigo-400" />
                      24h Volume
                    </span>
                    <p className="font-bold font-mono text-sm md:text-lg text-white">${token.volume24h.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/40 backdrop-blur-sm p-2 md:p-3 rounded-xl border border-white/5 shadow-glow-sm hover:shadow-glow-md transition-all duration-300">
                    <span className="text-xs text-indigo-300 flex items-center gap-1">
                      <Layers size={12} className="text-indigo-400" />
                      Total Supply
                    </span>
                    <p className="font-bold font-mono text-sm md:text-lg text-white">{token.supply.toLocaleString()}</p>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/40 backdrop-blur-sm p-2 md:p-3 rounded-xl border border-white/5 shadow-glow-sm hover:shadow-glow-md transition-all duration-300">
                    <span className="text-xs text-indigo-300 flex items-center gap-1">
                      <Clock size={12} className="text-indigo-400" />
                      Last Updated
                    </span>
                    <p className="font-bold font-mono text-sm md:text-lg text-white">Just now</p>
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
            >
              {showEnhanced ? (
                <EnhancedTradingInterface 
                  tokenSymbol={token.symbol}
                  tokenName={token.name}
                  tokenPrice={token.price}
                  tokenLogo={token.logo}
                />
              ) : (
                <TradingInterface 
                  tokenSymbol={token.symbol}
                  tokenName={token.name}
                  tokenPrice={token.price}
                  tokenLogo={token.logo}
                />
              )}
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Trade;
