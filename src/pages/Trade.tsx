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
import { 
  ArrowDown, ArrowUp, TrendingUp, Clock, BarChart3, 
  LineChart, Layers, Star, ArrowUpDown, Wallet, 
  Zap, Users, PieChart, CircleDollarSign, ShieldAlert,
  Info, History as HistoryIcon
} from 'lucide-react';
import { useWallet } from '@/hooks/useWallet.tsx';
import EnhancedTradingInterface from '@/components/EnhancedTradingInterface';
import TradingInterface from '@/components/TradingInterface';
import TransactionHistory from '@/components/TransactionHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Progress } from "@/components/ui/progress";
import { supabase } from '@/integrations/supabase/client';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { tradingService } from '@/services/tradingService';
import TraderActivity from '@/components/TraderActivity';

const Trade = () => {
  // Extract token symbol from URL params or use a default
  const { tokenId } = useParams();
  const defaultToken = "SOL";
  const symbol = tokenId || defaultToken;
  
  const { connected, address } = useWallet();
  const { refreshBalances } = useWalletBalance(symbol);
  
  const [tab, setTab] = useState('chart');
  const [isBondingOpen, setIsBondingOpen] = useState(true);
  const [isCreator, setIsCreator] = useState(false);
  const [canClaimRewards, setCanClaimRewards] = useState(false);
  const [nextClaimDate, setNextClaimDate] = useState<Date | null>(null);
  const [tokenData, setTokenData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEnhanced, setShowEnhanced] = useState(false);
  const [traderActivities, setTraderActivities] = useState<any[]>([]);
  const [dexscreenerProgress, setDexscreenerProgress] = useState(0);
  const [chartType, setChartType] = useState<'price' | 'marketCap'>('price');

  const normalizedSymbol = symbol?.toLowerCase() || '';

  // Get token data from Supabase or use demo data
  useEffect(() => {
    const fetchTokenData = async () => {
      if (!normalizedSymbol) return;
      
      setIsLoading(true);
      try {
        // For demo purposes, always use sample data
        const tokenDetails = {
          name: symbol.charAt(0).toUpperCase() + symbol.slice(1).toLowerCase(),
          symbol: symbol.toUpperCase(),
          market_cap: Math.floor(Math.random() * 40000) + 10000, // Random between 10k and 50k
          creator_wallet: '',
          price: 0.00023,
          change24h: 15.4,
          bondingCurveActive: true,
          bondingCurveLimit: 50000
        };
        
        setTokenData(tokenDetails);
        
        // Calculate DEXScreener progress
        setDexscreenerProgress((tokenDetails.market_cap / 50000) * 100);
        
        // Check if current user is creator (demo)
        if (connected && address) {
          setIsCreator(Math.random() > 0.8); // Random chance of being creator for demo
          setCanClaimRewards(Math.random() > 0.5); // Random chance of having rewards
          
          // Set next claim date
          const nextClaimDays = Math.floor(Math.random() * 5) + 1;
          const claimDate = new Date();
          claimDate.setDate(claimDate.getDate() + nextClaimDays);
          setNextClaimDate(claimDate);
        }
        
        // Generate sample trader activities
        generateTraderActivities();
        
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
          change24h: 15.4,
          bondingCurveActive: true,
          bondingCurveLimit: 50000
        });
        setIsLoading(false);
      }
    };
    
    fetchTokenData();
  }, [normalizedSymbol, connected, address]);

  // Generate sample trader activities for demo
  const generateTraderActivities = () => {
    const activityTypes = ['buy', 'sell', 'mint', 'claim'];
    const traderTypes = ['whale', 'retail', 'developer'];
    const walletPrefixes = ['Wybe', 'Sol', 'Trade', 'Degen'];
    
    const activities = [];
    
    for (let i = 0; i < 20; i++) {
      const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      const traderType = traderTypes[Math.floor(Math.random() * traderTypes.length)];
      const walletPrefix = walletPrefixes[Math.floor(Math.random() * walletPrefixes.length)];
      const wallet = `${walletPrefix}${Math.random().toString(16).substring(2, 8)}`;
      
      // Generate an amount based on trader type
      let amount;
      switch(traderType) {
        case 'whale':
          amount = Math.floor(Math.random() * 100000) + 50000; // 50k-150k
          break;
        case 'developer':
          amount = Math.floor(Math.random() * 10000) + 5000; // 5k-15k
          break;
        default: // retail
          amount = Math.floor(Math.random() * 5000) + 100; // 100-5100
      }
      
      // Calculate time in the past (from 1 minute to 24 hours ago)
      const minutesAgo = Math.floor(Math.random() * 1440) + 1;
      const timestamp = new Date(Date.now() - (minutesAgo * 60 * 1000));
      
      activities.push({
        id: `tx-${i}`,
        type,
        traderType,
        wallet,
        amount,
        timestamp,
        price: 0.00023 * (1 + (Math.random() * 0.1 - 0.05)) // Price with ±5% variation
      });
    }
    
    // Sort by timestamp, most recent first
    activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    setTraderActivities(activities);
  };

  // Reset wallet balance
  useEffect(() => {
    if (connected) {
      refreshBalances();
    }
  }, [connected, normalizedSymbol]);

  // Handle bonding curve explanation toggle
  const toggleBondingCurve = () => {
    setIsBondingOpen(!isBondingOpen);
  };
  
  // Quick trade functions
  const handleQuickBuy = () => {
    if (!connected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    toast.success(`Quick buy order for ${symbol} initiated!`);
  };
  
  const handleQuickSell = () => {
    if (!connected) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    toast.success(`Quick sell order for ${symbol} initiated!`);
  };

  // Claim creator rewards
  const handleClaimRewards = () => {
    if (!connected || !isCreator) {
      toast.error("You must be the creator to claim rewards");
      return;
    }
    
    if (!canClaimRewards) {
      toast.error(`Next claim available in ${getTimeUntilNextClaim()}`);
      return;
    }
    
    toast.success("Creator rewards claimed successfully!");
    setCanClaimRewards(false);
    
    // Set next claim date to 5 days from now
    const claimDate = new Date();
    claimDate.setDate(claimDate.getDate() + 5);
    setNextClaimDate(claimDate);
  };

  // Helper to get time until next claim
  const getTimeUntilNextClaim = () => {
    if (!nextClaimDate) return "now";
    
    const now = new Date();
    const timeDiff = nextClaimDate.getTime() - now.getTime();
    
    if (timeDiff <= 0) return "now";
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} and ${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
  };

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

  // Prepare token data for display
  const token = {
    id: normalizedSymbol,
    name: tokenData?.name || (symbol && `${symbol.charAt(0).toUpperCase()}${symbol.slice(1).toLowerCase()}`),
    symbol: tokenData?.symbol || symbol?.toUpperCase(),
    logo: `/coins/${normalizedSymbol}.png`,
    price: tokenData?.price || 0.00023,
    change24h: tokenData?.change24h || 15.4,
    marketCap: tokenData?.market_cap || 50000,
    volume24h: 52000,
    supply: 1000000000,
    isDexscreenerListed: (tokenData?.market_cap || 0) >= 50000,
    bondingCurveActive: tokenData?.bondingCurveActive || false,
    bondingCurveLimit: tokenData?.bondingCurveLimit || 50000
  };

  // Calculate DEXScreener progress
  const dexScreenerProgress = Math.min(100, (token.marketCap / 50000) * 100);

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
              
              {/* Quick Action Buttons */}
              <div className="flex items-center gap-2 w-full md:w-auto">
                <button 
                  onClick={handleQuickBuy}
                  className="flex-1 md:flex-none bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-500 hover:to-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:shadow-green-600/30 transition-all"
                >
                  <Zap size={16} className="inline mr-1" /> Quick Buy
                </button>
                <button 
                  onClick={handleQuickSell}
                  className="flex-1 md:flex-none bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:shadow-red-600/30 transition-all"
                >
                  <Zap size={16} className="inline mr-1" /> Quick Sell
                </button>
                <Link
                  to="/trading-history"
                  className="flex-1 md:flex-none bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:shadow-indigo-600/30 transition-all"
                >
                  <HistoryIcon size={16} className="inline mr-1" /> History
                </Link>
              </div>
            </div>
          </motion.div>
          
          {/* DEXScreener Listing Progress */}
          {!token.isDexscreenerListed && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-xl backdrop-blur-sm border border-indigo-500/20"
            >
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-400" size={18} />
                  <h3 className="font-bold text-sm">DEXScreener Listing Progress</h3>
                </div>
                <span className="text-xs text-indigo-300">{Math.round(dexScreenerProgress)}%</span>
              </div>
              <Progress value={dexScreenerProgress} className="h-3 bg-gray-800/70">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                  style={{ width: `${dexScreenerProgress}%` }}
                />
              </Progress>
              <p className="mt-2 text-xs text-gray-400">
                ${token.marketCap.toLocaleString()} / $50,000 Market Cap needed for DEXScreener listing
              </p>
            </motion.div>
          )}
          
          {/* Bonding Curve Info */}
          {token.bondingCurveActive && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6"
            >
              <Collapsible 
                open={isBondingOpen} 
                onOpenChange={toggleBondingCurve}
                className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 rounded-xl backdrop-blur-sm border border-blue-500/20"
              >
                <CollapsibleTrigger className="w-full p-4 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <LineChart className="text-blue-400" size={18} />
                    <h3 className="font-bold text-sm">Bonding Curve Active</h3>
                    <div className="ml-2 px-2 py-0.5 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                      Until $50k Market Cap
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: isBondingOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ArrowDown size={16} />
                  </motion.div>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <div className="p-4 pt-0 text-sm text-gray-300">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <p className="mb-2">
                          This token uses a bonding curve pricing mechanism until it reaches $50,000 market cap.
                          Price increases as more tokens are bought and decreases as tokens are sold.
                        </p>
                        <div className="flex items-center gap-2 text-xs mt-3 bg-indigo-900/30 p-2 rounded-lg">
                          <Info size={14} className="text-blue-300" />
                          <span>Trading affects price more significantly during the bonding curve phase</span>
                        </div>
                      </div>
                      <div className="md:w-1/3 h-[120px] bg-indigo-900/20 rounded-lg border border-indigo-500/20 flex items-center justify-center">
                        <BondingCurveChart />
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </motion.div>
          )}

          {/* Toggle between normal and enhanced interfaces for demo */}
          <div className="mb-6 flex justify-center">
            <button 
              onClick={() => setShowEnhanced(!showEnhanced)}
              className="px-4 py-2 bg-indigo-700 hover:bg-indigo-600 rounded-lg text-sm transition-colors"
            >
              Switch to {showEnhanced ? "Standard" : "Enhanced"} Trading Interface
            </button>
          </div>

          {showEnhanced ? (
            // Enhanced Trading Interface
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
              {/* Chart Section - Takes 8/12 columns on large screens */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUpVariants}
                custom={0.1}
                className="lg:col-span-8 rounded-xl overflow-hidden backdrop-blur-lg border border-white/10 bg-gradient-to-br from-indigo-950/50 to-purple-900/20"
              >
                <div className="border-b border-white/10 p-2 md:p-4">
                  <div className="h-[400px] md:h-[500px]">
                    <TradingViewChart 
                      symbol={token.symbol} 
                      chartType={chartType} 
                      onChartTypeChange={setChartType}
                    />
                  </div>
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
                
                {/* Enhanced Live Activity Feed */}
                <div className="mt-2 mx-4 mb-4">
                  <h3 className="text-base font-semibold flex items-center gap-2 mb-3">
                    <TrendingUp size={16} className="text-indigo-400" />
                    Market Activity
                  </h3>
                  <TraderActivity 
                    tokenSymbol={token.symbol}
                    maxHeight="300px"
                    showTitle={false}
                    limit={12}
                  />
                </div>
              </motion.div>

              {/* Enhanced Trading Interface - Takes 4/12 columns on large screens */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUpVariants}
                custom={0.2}
                className="lg:col-span-4"
              >
                <EnhancedTradingInterface 
                  tokenSymbol={token.symbol}
                  tokenName={token.name}
                  tokenPrice={token.price}
                  tokenLogo={token.logo}
                />
              </motion.div>
            </div>
          ) : (
            // Standard Trading Interface
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
              {/* Chart Section - Takes 8/12 columns on large screens */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUpVariants}
                custom={0.1}
                className="lg:col-span-8 rounded-xl overflow-hidden backdrop-blur-lg border border-white/10 bg-gradient-to-br from-indigo-950/50 to-purple-900/20"
              >
                <div className="p-2 md:p-4">
                  <div className="h-[400px] md:h-[450px]">
                    <TradingViewChart 
                      symbol={token.symbol} 
                      chartType={chartType} 
                      onChartTypeChange={setChartType}
                    />
                  </div>
                </div>
                
                <div className="p-3 md:p-4 border-t border-white/10">
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

                {/* Live Activity Feed */}
                <div className="mt-2 mx-4 mb-4">
                  <TraderActivity 
                    tokenSymbol={token.symbol}
                    maxHeight="300px"
                    limit={8}
                  />
                </div>
              </motion.div>

              {/* Standard Trading Interface - Takes 4/12 columns */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeUpVariants}
                custom={0.2}
                className="lg:col-span-4"
              >
                <TradingInterface 
                  tokenSymbol={token.symbol}
                  tokenName={token.name}
                  tokenPrice={token.price}
                  tokenLogo={token.logo}
                />
              </motion.div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Trade;
