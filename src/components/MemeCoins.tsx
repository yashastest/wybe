import React, { useState, useEffect } from "react";
import { TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface CoinData {
  id: string;
  name: string;
  symbol: string;
  logo: string | null;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  category: string[];
}

// Helper to safely extract values from bonding_curve JSONB data
const extractFromBondingCurve = (bondingCurve: any, field: string, defaultValue: any) => {
  if (!bondingCurve) return defaultValue;
  if (typeof bondingCurve !== 'object') return defaultValue;
  return bondingCurve[field] || defaultValue;
};

const formatPrice = (price: number): string => {
  if (price < 0.00001) {
    return price.toFixed(8);
  } else if (price < 0.01) {
    return price.toFixed(6);
  } else if (price < 1) {
    return price.toFixed(4);
  } else {
    return price.toFixed(2);
  }
};

const formatMarketCap = (marketCap: number): string => {
  if (marketCap >= 1000000000) {
    return `$${(marketCap / 1000000000).toFixed(2)}B`;
  } else if (marketCap >= 1000000) {
    return `$${(marketCap / 1000000).toFixed(2)}M`;
  } else {
    return `$${(marketCap / 1000).toFixed(2)}K`;
  }
};

const MemeCoins: React.FC = () => {
  const [coins, setCoins] = useState<CoinData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchTokens = async () => {
      setIsLoading(true);
      try {
        // Fetch tokens directly from Supabase
        const { data: tokensData, error } = await supabase
          .from('tokens')
          .select('*')
          .order('market_cap', { ascending: false })
          .limit(6);
        
        if (error) {
          throw error;
        }
        
        if (!tokensData || tokensData.length === 0) {
          setCoins([]);
          setIsLoading(false);
          return;
        }
        
        // Map database tokens to CoinData format
        const coinData: CoinData[] = tokensData.map(token => {
          // Handle calculation of change24h from bonding curve data if available
          const change24h = extractFromBondingCurve(token.bonding_curve, 'change_24h', Math.random() * 20 - 10);
          
          // Extract categories from tags if available
          const categories = extractFromBondingCurve(token.bonding_curve, 'tags', ['Meme']);
          
          return {
            id: token.id,
            name: token.name,
            symbol: token.symbol,
            logo: null, // Will be updated with storage URL when available
            price: extractFromBondingCurve(token.bonding_curve, 'price', 0.01),
            change24h: change24h,
            marketCap: token.market_cap || 10000,
            volume24h: extractFromBondingCurve(token.bonding_curve, 'volume_24h', token.market_cap * 0.1 || 1000),
            category: Array.isArray(categories) ? categories : [categories],
          };
        });
        
        setCoins(coinData);
      } catch (error) {
        console.error("Failed to fetch tokens:", error);
        toast.error("Failed to load token data");
        setCoins([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTokens();
  }, []);

  return (
    <section id="memecoins" className="py-16 container">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-bold text-gradient">Trending Meme Coins</h2>
          <p className="text-muted-foreground">
            Track the hottest meme coins in the crypto market
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="glass-card p-4">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-24 mb-2" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
                <Skeleton className="h-16 mb-3" />
                <Skeleton className="h-8" />
              </div>
            ))
          ) : coins.length > 0 ? (
            coins.map((coin) => (
              <div
                key={coin.id}
                className="glass-card p-4 hover:shadow-glow-sm transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-black/40">
                    <AspectRatio ratio={1 / 1}>
                      <img
                        src={coin.logo || "/placeholder.svg"}
                        alt={coin.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </AspectRatio>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-bold">{coin.name}</h3>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-wybe-primary" />
                        <span className="text-xs text-muted-foreground">
                          Trending
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-sm text-muted-foreground">
                        {coin.symbol}
                      </span>
                      <div
                        className={`flex items-center gap-1 text-sm ${
                          coin.change24h >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {coin.change24h >= 0 ? (
                          <ArrowUp className="w-3 h-3" />
                        ) : (
                          <ArrowDown className="w-3 h-3" />
                        )}
                        <span>{Math.abs(coin.change24h).toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs text-muted-foreground">Price</p>
                      <p className="font-medium">${formatPrice(coin.price)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Market Cap</p>
                      <p className="font-medium">
                        {formatMarketCap(coin.marketCap)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {coin.category.map((cat, idx) => (
                      <span
                        key={`${cat}-${idx}`}
                        className="px-2 py-1 bg-wybe-primary/10 rounded-full text-xs text-wybe-primary"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                  
                  <div className="mt-3">
                    <Link 
                      to={`/trade/${coin.symbol.toLowerCase()}`} 
                      className="w-full inline-block py-2 px-4 text-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-lg text-white font-medium transition-all duration-300 shadow-glow-sm hover:shadow-glow-md"
                    >
                      Trade {coin.symbol}
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-12">
              <h3 className="text-lg font-medium mb-2">No coins available yet</h3>
              <p className="text-muted-foreground mb-4">Be the first to launch a token on our platform!</p>
              <Link to="/launch" className="text-wybe-primary hover:text-wybe-primary/80 py-2 px-4 bg-wybe-primary/10 rounded-lg">
                Launch Your Token →
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default MemeCoins;
