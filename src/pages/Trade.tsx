import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import TradingViewChart from '@/components/TradingViewChart';
import BondingCurveChart from '@/components/BondingCurveChart';
import TraderActivityMarkers from '@/components/TraderActivityMarkers';
import { toast } from 'sonner';
import { ArrowDown, ArrowUp, TrendingUp, Clock, BarChart3, LineChart, Layers, Star, ArrowUpDown } from 'lucide-react';
import { useWallet } from '@/lib/wallet';
import TradingInterface from '@/components/TradingInterface';
import TransactionHistory from '@/components/TransactionHistory';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useWalletBalance } from '@/hooks/useWalletBalance';

const Trade = () => {
  const { symbol } = useParams();
  const { connected, address } = useWallet();
  const { refreshBalances } = useWalletBalance(symbol);
  
  const [tab, setTab] = useState('chart');
  const [isBondingOpen, setIsBondingOpen] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [canClaimRewards, setCanClaimRewards] = useState(false);
  const [nextClaimDate, setNextClaimDate] = useState<Date | null>(null);
  const [tokenData, setTokenData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const normalizedSymbol = symbol?.toLowerCase() || '';
  
  // Get token data from Supabase
  useEffect(() => {
    const fetchTokenData = async () => {
      if (!normalizedSymbol) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('tokens')
          .select('*')
          .eq('symbol', normalizedSymbol.toUpperCase())
          .single();
          
        if (error) {
          throw error;
        }
        
        if (data) {
          setTokenData(data);
          
          // Check if current user is creator
          if (connected && address && data.creator_wallet === address) {
            setIsCreator(true);
          } else {
            setIsCreator(false);
          }
        } else {
          toast.error('Token not found');
        }
      } catch (error) {
        console.error('Error fetching token data:', error);
        // Use mock data if token not found in database
        setTokenData({
          name: (symbol && `${symbol.charAt(0).toUpperCase()}${symbol.slice(1).toLowerCase()}`) || 'Token',
          symbol: symbol?.toUpperCase() || 'TOKEN',
          market_cap: 50000,
          creator_wallet: '',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTokenData();
  }, [normalizedSymbol, connected, address]);
  
  // Check if creator can claim rewards
  useEffect(() => {
    const checkCreatorRewards = async () => {
      if (isCreator && tokenData) {
        try {
          // In a real implementation, fetch this from Supabase
          // For now, we'll use a mock implementation
          setCanClaimRewards(Math.random() > 0.5);
          
          if (!canClaimRewards) {
            const nextDate = new Date();
            nextDate.setDate(nextDate.getDate() + 7); // Next claim in 7 days
            setNextClaimDate(nextDate);
          }
        } catch (error) {
          console.error('Error checking creator rewards:', error);
        }
      }
    };
    
    checkCreatorRewards();
  }, [isCreator, tokenData]);

  // Handle creator reward claims
  const handleClaimRewards = async () => {
    if (!connected || !isCreator) return;
    
    toast.loading('Processing claim...');
    
    // In a real implementation, this would call a Supabase function
    // For now, we simulate a successful claim
    setTimeout(() => {
      toast.success('Rewards claimed successfully!', {
        description: 'You received 0.25 SOL in rewards'
      });
      setCanClaimRewards(false);
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 7);
      setNextClaimDate(nextDate);
    }, 2000);
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-indigo-950/40 to-black bg-fixed">
      <Header />
      
      <main className="flex-grow w-full px-4 pt-20 md:pt-24">
        <div className="max-w-7xl mx-auto py-4 md:py-8">
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
                    src={token.logo.startsWith('/') ? token.logo : `/coins/${token.id}.png`} 
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

          {/* Market cap progress to DEXScreener */}
          {!token.isDexscreenerListed && (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
              custom={0.05}
              className="mb-8 p-4 border border-white/10 rounded-xl bg-indigo-900/20 backdrop-blur-sm"
            >
              <div className="flex justify-between mb-2">
                <h3 className="font-poppins font-semibold text-indigo-200 flex items-center gap-2">
                  DEXScreener Eligibility Progress
                </h3>
                <span className="font-mono text-indigo-200">
                  ${token.marketCap.toLocaleString()} / $50,000
                </span>
              </div>
              
              <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                  style={{ width: `${Math.min(100, (token.marketCap / 50000) * 100)}%` }}
                ></div>
              </div>
              
              <p className="text-xs text-gray-300 mt-2">
                When market cap reaches $50,000, this token will be automatically listed on DEXScreener while continuing to trade on our platform.
              </p>
            </motion.div>
          )}

          {/* Creator rewards banner */}
          {isCreator && (
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeUpVariants}
              custom={0.05}
              className="mb-8"
            >
              <div className="p-4 border border-white/10 rounded-xl bg-gradient-to-r from-amber-900/20 to-orange-900/20 backdrop-blur-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-poppins font-semibold text-amber-200 flex items-center gap-2">
                      <Star size={16} className="text-amber-400" />
                      Creator Rewards
                    </h3>
                    <p className="text-sm text-gray-300 mt-1">
                      {canClaimRewards 
                        ? "You have rewards available to claim!"
                        : nextClaimDate 
                          ? `Next claim available ${nextClaimDate.toLocaleDateString()}`
                          : "Start earning rewards from your token's trading activity"}
                    </p>
                  </div>
                  <button 
                    onClick={handleClaimRewards}
                    disabled={!canClaimRewards}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${canClaimRewards 
                      ? "bg-amber-600 hover:bg-amber-500 text-white cursor-pointer" 
                      : "bg-amber-600/30 text-amber-200 cursor-not-allowed"}`}
                  >
                    <Star size={16} />
                    Claim Rewards
                  </button>
                </div>
                
                <p className="text-xs text-amber-200/70 mt-3">
                  As creator, you earn 1% of all trading activity.
                  Rewards can be claimed every 7 days.
                </p>
              </div>
            </motion.div>
          )}

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
                      <TraderActivityMarkers activities={traderActivities} />
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
              <TradingInterface 
                tokenSymbol={token.symbol}
                tokenName={token.name}
                tokenPrice={token.price}
                tokenLogo={token.logo}
              />
            </motion.div>
          </div>
          
          {/* Bonding Curve Section */}
          <Collapsible
            open={isBondingOpen}
            onOpenChange={setIsBondingOpen}
            className="mt-6 md:mt-8"
          >
            <CollapsibleTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3 flex items-center justify-between bg-gradient-to-r from-indigo-950/80 to-purple-900/60 backdrop-blur-lg rounded-xl border border-white/10 px-4 md:px-6 text-white font-poppins font-bold"
              >
                <div className="flex items-center">
                  <Star className="mr-2 h-4 w-4 md:h-5 md:w-5 text-yellow-400" />
                  <span className="bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent text-sm md:text-base">
                    Bonding Curve Information
                  </span>
                </div>
                <div className="text-indigo-300 text-sm">
                  {isBondingOpen ? '↑ Hide' : '↓ Show'}
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
                className="bg-gradient-to-br from-indigo-950/80 to-purple-900/60 backdrop-blur-lg p-4 md:p-6 rounded-xl border border-white/10 mt-2"
              >
                <h2 className="text-lg md:text-xl font-poppins font-bold mb-2 md:mb-4 bg-gradient-to-r from-white via-indigo-100 to-purple-200 bg-clip-text text-transparent">
                  Bonding Curve
                </h2>
                <p className="text-indigo-200 mb-4 md:mb-6 text-sm md:text-base">
                  This token uses a bonding curve mechanism to determine price. The price increases as more tokens are bought and decreases as tokens are sold.
                </p>
                
                <div className="h-[250px] md:h-[300px]">
                  <BondingCurveChart />
                </div>
                
                <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                  <div className="bg-black/30 p-3 md:p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300">
                    <h3 className="font-poppins font-bold mb-1 md:mb-2 text-indigo-200 text-sm md:text-base">How It Works</h3>
                    <p className="text-xs md:text-sm text-gray-300">
                      The bonding curve ensures price stability and liquidity for the token by algorithmically adjusting prices based on supply.
                    </p>
                  </div>
                  <div className="bg-black/30 p-3 md:p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300">
                    <h3 className="font-poppins font-bold mb-1 md:mb-2 text-indigo-200 text-sm md:text-base">Benefits</h3>
                    <p className="text-xs md:text-sm text-gray-300">
                      Always available liquidity, predictable price movements, and incentivized early adoption.
                    </p>
                  </div>
                  <div className="bg-black/30 p-3 md:p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all duration-300">
                    <h3 className="font-poppins font-bold mb-1 md:mb-2 text-indigo-200 text-sm md:text-base">Current Parameters</h3>
                    <p className="text-xs md:text-sm font-mono">
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
