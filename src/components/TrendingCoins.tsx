import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Rocket, Users, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { tokenTradingService } from "@/services/tokenTradingService";
import { toast } from "sonner";
import { ListedToken } from "@/services/token/types";

// Define a type for the mapped trending coin if it differs significantly from ListedToken
// For now, it seems we can use ListedToken and map specific display fields
interface DisplayTrendingCoin extends ListedToken {
  displayPrice: string;
  displayChange: string;
  displayVolume: string;
  displayMarketCap: string;
  isPositiveTrend: boolean;
  sparklineData: number[];
}

const TrendingCoins = () => {
  const [trendingCoins, setTrendingCoins] = useState<DisplayTrendingCoin[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchTrendingCoins = async () => {
      setIsLoading(true);
      try {
        const allCoins: ListedToken[] = await tokenTradingService.getListedTokens();
        
        const trending: DisplayTrendingCoin[] = allCoins
          .sort((a, b) => (b.volume24h || 0) - (a.volume24h || 0))
          .slice(0, 4)
          .map(coin => {
            const isPositive = (coin.change24h || coin.priceChange24h || 0) >= 0;
            return {
              ...coin, // Spread all properties from ListedToken
              displayPrice: `${coin.price.toFixed(4)} SOL`, // Example formatting
              displayChange: `${isPositive ? '+' : ''}${(coin.change24h || coin.priceChange24h || 0).toFixed(1)}%`,
              displayVolume: formatVolume(coin.volume24h || 0),
              displayMarketCap: formatVolume(coin.marketCap || 0),
              isPositiveTrend: isPositive,
              sparklineData: generateMockSparkline(isPositive),
              // holderStats is now part of ListedToken from types.ts, ensure service provides it
              holderStats: coin.holderStats || {
                whales: Math.floor(Math.random() * 5),
                retail: Math.floor(Math.random() * 100) + 20,
                devs: 1
              }
            };
          });
        
        setTrendingCoins(trending);
      } catch (error) {
        console.error("Failed to fetch trending coins:", error);
        toast.error("Failed to load trending coins", { description: "Please try again later" });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTrendingCoins();
  }, []);
  
  // Format volume for display
  const formatVolume = (volume?: number) => {
    if (volume === undefined || volume === null || isNaN(volume)) return "$0.00";
    if (volume >= 1000000) {
      return `$${(volume / 1000000).toFixed(2)}M`;
    } else if (volume >= 1000) {
      return `$${(volume / 1000).toFixed(2)}K`;
    } else {
      return `$${volume.toFixed(2)}`;
    }
  };
  
  // Generate mock sparkline data based on positive/negative trend
  const generateMockSparkline = (isPositive: boolean) => {
    if (isPositive) {
      return [20, 22, 25, 22, 26, 27, 30, 28, 30, 35];
    } else {
      return [35, 32, 30, 28, 30, 27, 26, 22, 20, 18];
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {isLoading ? (
        // Show skeletons while loading
        Array.from({ length: 4 }).map((_, index) => (
          <div key={`skeleton-${index}`} className="glass-card p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <Skeleton className="h-5 w-24 mb-1" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="mb-4 h-16 rounded-xl" />
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Skeleton className="h-16 rounded-xl" />
              <Skeleton className="h-16 rounded-xl" />
            </div>
            <Skeleton className="mb-4 h-24 rounded-xl" />
            <Skeleton className="h-10 rounded-xl" />
          </div>
        ))
      ) : trendingCoins.length > 0 ? (
        trendingCoins.map((coin, index) => (
          <TrendingCoinCard key={coin.id} coin={coin} delay={index * 0.1} />
        ))
      ) : (
        <div className="col-span-1 md:col-span-2 lg:col-span-4 text-center py-12 glass-card">
          <AlertCircle className="mx-auto mb-4 text-gray-400" size={32} />
          <h3 className="text-xl font-medium mb-2">No Trending Coins</h3>
          <p className="text-gray-400 mb-6">Launch your own token to be featured here!</p>
          <Link to="/launch">
            <Button variant="default">Launch a Token</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

const TrendingCoinCard = ({ coin, delay }: { coin: DisplayTrendingCoin, delay: number }) => {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        delay: delay
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="glass-card p-5 hover:border-wybe-primary/30 hover:shadow-glow-sm transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold">{coin.name}</h3>
          <p className="text-sm text-gray-400">{coin.symbol}</p>
        </div>
        <div className={`flex items-center px-2 py-1 rounded-full text-sm ${
            coin.isPositiveTrend ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}
        >
          {coin.isPositiveTrend ? 
            <TrendingUp size={14} className="mr-1" /> : 
            <TrendingDown size={14} className="mr-1" />
          }
          {coin.displayChange}
        </div>
      </div>
      
      <div className="mb-4 h-16 rounded-xl overflow-hidden bg-black/20">
        <Sparkline data={coin.sparklineData} positive={coin.isPositiveTrend} />
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-black/20 rounded-xl p-2">
          <p className="text-xs text-gray-400">💰 Price</p>
          <p className="font-medium">{coin.displayPrice}</p>
        </div>
        <div className="bg-black/20 rounded-xl p-2">
          <p className="text-xs text-gray-400">📊 Volume</p>
          <p className="font-medium">{coin.displayVolume}</p>
        </div>
      </div>
      
      {/* Holder statistics with icons, coin.holderStats is now available */}
      <div className="mb-4 bg-wybe-background-light/30 rounded-xl p-2">
        <p className="text-xs text-gray-300 mb-1 flex items-center gap-1">
          <Users size={12} className="text-wybe-primary" />
          Holder Stats
        </p>
        <div className="grid grid-cols-3 gap-1 text-center">
          <div className="bg-black/30 rounded-lg p-1">
            <p className="text-[10px] text-gray-400">🐋 Whales</p>
            <p className="font-medium text-xs">{coin.holderStats.whales}</p>
          </div>
          <div className="bg-black/30 rounded-lg p-1">
            <p className="text-[10px] text-gray-400">👨‍💻 Devs</p>
            <p className="font-medium text-xs">{coin.holderStats.devs}</p>
          </div>
          <div className="bg-black/30 rounded-lg p-1">
            <p className="text-[10px] text-gray-400">👤 Retail</p>
            <p className="font-medium text-xs">{coin.holderStats.retail}</p>
          </div>
        </div>
      </div>
      
      {/* Trade button */}
      <Link to={`/trade/${coin.symbol.toLowerCase()}`}>
        <Button className="w-full btn-primary text-sm py-1 h-8 flex items-center justify-center gap-1 group">
          <span>Trade {coin.symbol}</span>
          <Rocket size={14} className="group-hover:translate-x-1 transition-transform" />
        </Button>
      </Link>
    </motion.div>
  );
};

const Sparkline = ({ data, positive }: { data: number[], positive: boolean }) => {
  if (!data || data.length === 0) return <div className="w-full h-full bg-black/10" />; // Handle empty data
  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  // Avoid division by zero if all data points are the same
  const range = (maxVal - minVal === 0) ? 1 : (maxVal - minVal);
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    // Ensure y is between 0 and 100, default to 50 if range is 0
    const yBase = range === 1 ? 50 : 100 - ((value - minVal) / range) * 100;
    const y = Math.max(0, Math.min(100, yBase)); 
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="w-full h-full">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <linearGradient id={`gradient-${positive ? 'positive' : 'negative'}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={positive ? "#22c55e" : "#ef4444"} stopOpacity="0.2" />
          <stop offset="100%" stopColor={positive ? "#22c55e" : "#ef4444"} stopOpacity="0" />
        </linearGradient>
        
        <polygon 
          points={`0,100 ${points} 100,100`} 
          fill={`url(#gradient-${positive ? 'positive' : 'negative'})`}
        />
        
        <polyline
          points={points}
          fill="none"
          stroke={positive ? "#22c55e" : "#ef4444"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default TrendingCoins;
