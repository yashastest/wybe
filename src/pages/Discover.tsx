
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ArrowUp, ArrowDown, ChevronDown, Filter, Users, DollarSign, User, Code, Rocket, Flame } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface HolderStats {
  whales: number;
  devs: number;
  retail: number;
}

interface ListedToken {
  id?: string;
  name?: string;
  symbol?: string;
  logo?: string;
  banner?: string;
  price?: number;
  marketCap?: number;
  volume24h?: number;
  change24h?: number;
  holders?: number;
  category?: string[];
  holderStats?: HolderStats;
}

// Sample tokens for the demo
const sampleTokens: ListedToken[] = [
  {
    id: "wybe-token",
    name: "Wybe",
    symbol: "WYBE",
    logo: "/lovable-uploads/dcb3ea81-25ba-4438-90a5-c7403026c91e.png",
    banner: "/lovable-uploads/5f8a8eb9-3963-4b1b-8ca5-2beecbb60b39.png",
    price: 0.00145,
    marketCap: 1450000,
    volume24h: 345000,
    change24h: 25.4,
    holders: 1200,
    category: ["Meme", "Utility"],
    holderStats: { whales: 12, devs: 8, retail: 1180 }
  },
  {
    id: "solana-doge",
    name: "Solana Doge",
    symbol: "SOLDOGE",
    logo: "/lovable-uploads/dcb3ea81-25ba-4438-90a5-c7403026c91e.png", 
    banner: "/lovable-uploads/5f8a8eb9-3963-4b1b-8ca5-2beecbb60b39.png",
    price: 0.0000235,
    marketCap: 2350000,
    volume24h: 789000,
    change24h: 12.8,
    holders: 3500,
    category: ["Meme", "Doge"],
    holderStats: { whales: 23, devs: 5, retail: 3472 }
  },
  {
    id: "pepe-sol",
    name: "Pepe Solana",
    symbol: "PEPES",
    logo: "/lovable-uploads/dcb3ea81-25ba-4438-90a5-c7403026c91e.png",
    banner: "/lovable-uploads/5f8a8eb9-3963-4b1b-8ca5-2beecbb60b39.png",
    price: 0.00000812,
    marketCap: 812000,
    volume24h: 156000,
    change24h: -8.2,
    holders: 2100,
    category: ["Meme", "Pepe"],
    holderStats: { whales: 8, devs: 3, retail: 2089 }
  },
  {
    id: "solana-cat",
    name: "Solana Cat",
    symbol: "SCAT",
    logo: "/lovable-uploads/dcb3ea81-25ba-4438-90a5-c7403026c91e.png",
    banner: "/lovable-uploads/5f8a8eb9-3963-4b1b-8ca5-2beecbb60b39.png",
    price: 0.000124,
    marketCap: 1240000,
    volume24h: 234000,
    change24h: 5.6,
    holders: 1800,
    category: ["Meme", "Cat"],
    holderStats: { whales: 15, devs: 7, retail: 1778 }
  }
];

const formatPrice = (price?: number) => {
  if (price === undefined || price === null) return "0.00";
  if (isNaN(price)) return "0.00";
  
  try {
    if (price < 0.00001) {
      return price.toFixed(8);
    } else if (price < 0.01) {
      return price.toFixed(6);
    } else if (price < 1) {
      return price.toFixed(4);
    } else {
      return price.toFixed(2);
    }
  } catch (error) {
    console.error("Error formatting price:", error);
    return "0.00";
  }
};

const formatMarketCap = (marketCap?: number) => {
  if (marketCap === undefined || marketCap === null) return "$0";
  if (isNaN(marketCap)) return "$0";
  
  try {
    if (marketCap >= 1000000000) {
      return `$${(marketCap / 1000000000).toFixed(2)}B`;
    } else if (marketCap >= 1000000) {
      return `$${(marketCap / 1000000).toFixed(2)}M`;
    } else {
      return `$${(marketCap / 1000).toFixed(2)}K`;
    }
  } catch (error) {
    console.error("Error formatting marketCap:", error);
    return "$0";
  }
};

const formatNumber = (num?: number) => {
  if (num === undefined || num === null) return "0";
  if (isNaN(num)) return "0";
  
  try {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  } catch (error) {
    console.error("Error formatting number:", error);
    return "0";
  }
};

const formatPercentage = (value?: number) => {
  if (value === undefined || value === null) return "0.00";
  try {
    return Math.abs(value).toFixed(2);
  } catch (error) {
    console.error("Error formatting percentage:", error);
    return "0.00";
  }
};

const Discover = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("marketCap");
  const [filterCategory, setFilterCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [coins, setCoins] = useState<ListedToken[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>(["All"]);
  
  useEffect(() => {
    const fetchTokens = async () => {
      setIsLoading(true);
      try {
        // In a real app, you would fetch from API
        // For now we'll use the sample data
        setTimeout(() => {
          setCoins(sampleTokens);
          
          // Extract all unique categories with safety checks
          const categories = ["All"];
          const uniqueCategories = new Set<string>();
          
          sampleTokens.forEach(coin => {
            if (Array.isArray(coin.category)) {
              coin.category.forEach(category => {
                if (typeof category === 'string') {
                  uniqueCategories.add(category);
                }
              });
            }
          });
          
          uniqueCategories.forEach(category => categories.push(category));
          setAllCategories(categories);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Failed to fetch tokens:", error);
        toast.error("Failed to load tokens", { 
          description: "Please try again later"
        });
        setCoins([]);
        setIsLoading(false);
      }
    };
    
    fetchTokens();
  }, []);
  
  // Filter and sort coins with safety checks
  const filteredCoins = coins
    .filter(coin => {
      const name = (coin.name || '').toLowerCase();
      const symbol = (coin.symbol || '').toLowerCase();
      const searchTermLower = searchTerm.toLowerCase();
      
      const matchesSearch = name.includes(searchTermLower) || symbol.includes(searchTermLower);
      
      const categories = Array.isArray(coin.category) ? coin.category : [];
      const matchesCategory = filterCategory === "All" || categories.includes(filterCategory);
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      // Adding null checks for all sort options
      if (sortOption === "marketCap") {
        const aValue = a.marketCap || 0;
        const bValue = b.marketCap || 0;
        return bValue - aValue;
      }
      
      if (sortOption === "volume") {
        const aValue = a.volume24h || 0;
        const bValue = b.volume24h || 0;
        return bValue - aValue;
      }
      
      if (sortOption === "priceAsc") {
        const aValue = a.price || 0;
        const bValue = b.price || 0;
        return aValue - bValue;
      }
      
      if (sortOption === "priceDesc") {
        const aValue = a.price || 0;
        const bValue = b.price || 0;
        return bValue - aValue;
      }
      
      if (sortOption === "change") {
        const aValue = a.change24h || 0;
        const bValue = b.change24h || 0;
        return bValue - aValue;
      }
      
      return 0;
    });
  
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      
      <main className="flex-grow container px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="pt-20 md:pt-24"
        >
          <h1 className="text-3xl font-poppins font-bold mb-2">Discover <span className="text-gradient">Meme Coins</span> 🚀</h1>
          <p className="text-gray-300 mb-8">Explore trending and popular meme coins on the Solana blockchain</p>
        </motion.div>
        
        {/* Search and filter section */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative col-span-1 md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search by name or symbol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-wybe-background-light/30 border border-white/10 rounded-full pl-10 pr-4 py-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-wybe-primary"
              />
            </div>
            
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1 bg-wybe-background-light/30 border-white/10 font-poppins rounded-full">
                    <Filter size={16} className="mr-2" />
                    Category: {filterCategory}
                    <ChevronDown size={16} className="ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-wybe-background-light/90 border-white/10 backdrop-blur-lg rounded-xl">
                  {allCategories.map((category) => (
                    <DropdownMenuItem 
                      key={category}
                      onClick={() => setFilterCategory(category)}
                      className={filterCategory === category ? "bg-wybe-primary/20 text-wybe-primary font-mono font-bold rounded-lg" : "font-mono"}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1 bg-wybe-background-light/30 border-white/10 font-poppins rounded-full">
                    Sort By
                    <ChevronDown size={16} className="ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-wybe-background-light/90 border-white/10 backdrop-blur-lg rounded-xl">
                  <DropdownMenuItem 
                    onClick={() => setSortOption("marketCap")} 
                    className={sortOption === "marketCap" ? "bg-wybe-primary/20 text-wybe-primary font-mono font-bold rounded-lg" : "font-mono"}
                  >
                    Market Cap
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortOption("volume")}
                    className={sortOption === "volume" ? "bg-wybe-primary/20 text-wybe-primary font-mono font-bold rounded-lg" : "font-mono"}
                  >
                    Volume
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortOption("priceDesc")}
                    className={sortOption === "priceDesc" ? "bg-wybe-primary/20 text-wybe-primary font-mono font-bold rounded-lg" : "font-mono"}
                  >
                    Price (High to Low)
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortOption("priceAsc")}
                    className={sortOption === "priceAsc" ? "bg-wybe-primary/20 text-wybe-primary font-mono font-bold rounded-lg" : "font-mono"}
                  >
                    Price (Low to High)
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortOption("change")}
                    className={sortOption === "change" ? "bg-wybe-primary/20 text-wybe-primary font-mono font-bold rounded-lg" : "font-mono"}
                  >
                    24h Change
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        {/* Coins grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 6 }).map((_, index) => (
              <div key={`skeleton-${index}`} className="glass-card overflow-hidden">
                <Skeleton className="w-full h-32 md:h-36" />
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="w-24 h-5 mb-2" />
                      <Skeleton className="w-12 h-4" />
                    </div>
                    <Skeleton className="w-16 h-6 rounded-full" />
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <Skeleton className="h-16 rounded-lg" />
                    <Skeleton className="h-16 rounded-lg" />
                  </div>
                  <div className="flex gap-1 mb-4">
                    <Skeleton className="w-16 h-5 rounded-full" />
                    <Skeleton className="w-16 h-5 rounded-full" />
                  </div>
                  <div className="flex gap-2">
                    <Skeleton className="h-10 flex-1 rounded-full" />
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                </div>
              </div>
            ))
          ) : filteredCoins.length > 0 ? (
            filteredCoins.map((coin, index) => (
              <CoinCard key={coin.id || `coin-${index}`} coin={coin} index={index} />
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16">
              <h3 className="text-xl font-poppins font-bold mb-2">No coins found 😢</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
              
              <div className="mt-8">
                <Link to="/launch">
                  <Button className="bg-wybe-primary hover:bg-wybe-primary/90 text-white font-poppins py-6 px-8">
                    <Rocket className="mr-2" />
                    Launch Your Own Token
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {!isLoading && filteredCoins.length > 0 && (
          <div className="text-center pb-12">
            <Link to="/launch">
              <Button className="bg-wybe-primary hover:bg-wybe-primary/90 text-white font-poppins py-6 px-8">
                <Rocket className="mr-2" />
                Launch Your Own Token
              </Button>
            </Link>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

// Coin card component with banner and safety checks
const CoinCard = ({ coin, index }: { coin: ListedToken, index: number }) => {
  // Default placeholder images
  const defaultBanner = "/lovable-uploads/5f8a8eb9-3963-4b1b-8ca5-2beecbb60b39.png";
  const defaultLogo = "/placeholder.svg";
  
  // Safety check for categories
  const categories = Array.isArray(coin.category) ? coin.category : [];
  
  // Safety check for holderStats
  const holderStats = coin.holderStats || { 
    whales: 0,
    devs: 0,
    retail: 0
  };

  // Safety check for change24h
  const change24h = coin.change24h || 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="glass-card overflow-hidden hover:shadow-glow-sm transition-all duration-300"
    >
      {/* Banner image */}
      <div className="w-full h-32 md:h-36 relative">
        <AspectRatio ratio={16 / 9}>
          <img
            src={coin.banner || defaultBanner}
            alt={`${coin.name || 'Token'} banner`}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = defaultBanner;
            }}
          />
        </AspectRatio>
      </div>
      
      {/* Logo and symbol - positioned below banner */}
      <div className="px-4 pt-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm p-1 border-2 border-white/10">
          <img
            src={coin.logo || defaultLogo}
            alt={coin.name || 'Token'}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = defaultLogo;
            }}
          />
        </div>
        <div>
          <h3 className="font-poppins font-bold text-white text-xl">{coin.name || 'Unnamed Token'}</h3>
          <p className="text-gray-300 text-sm font-mono">{coin.symbol || 'TOKEN'}</p>
        </div>
        
        {/* Price change indicator */}
        <div className="ml-auto">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
            change24h >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          }`}>
            {change24h >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            <span className="font-mono font-bold">{formatPercentage(change24h)}%</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-black/20 rounded-xl p-2">
            <p className="text-xs text-gray-400 font-mono">Price</p>
            <p className="font-medium font-mono">${formatPrice(coin.price)}</p>
          </div>
          <div className="bg-black/20 rounded-xl p-2">
            <p className="text-xs text-gray-400 font-mono">Market Cap</p>
            <p className="font-medium font-mono">{formatMarketCap(coin.marketCap)}</p>
          </div>
          <div className="bg-black/20 rounded-xl p-2">
            <p className="text-xs text-gray-400 font-mono">Volume (24h)</p>
            <p className="font-medium font-mono">{formatMarketCap(coin.volume24h)}</p>
          </div>
          <div className="bg-black/20 rounded-xl p-2">
            <p className="text-xs text-gray-400 font-mono">Holders</p>
            <p className="font-medium font-mono">👥 {formatNumber(coin.holders)}</p>
          </div>
        </div>
        
        {/* Category tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          {categories.map((cat, idx) => (
            <span
              key={`${coin.id}-cat-${idx}`}
              className="text-[10px] px-2 py-0.5 bg-wybe-primary/10 text-wybe-primary rounded-full font-mono"
            >
              {cat}
            </span>
          ))}
        </div>
        
        {/* Holder statistics with emojis */}
        <div className="mb-4 bg-wybe-background-light/30 rounded-xl p-3">
          <p className="text-xs text-gray-300 font-mono mb-2">Holder Distribution</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-black/30 rounded-lg p-2">
              <p className="text-[10px] text-gray-400 font-mono">🐋 Whales</p>
              <p className="font-medium font-mono text-sm">{formatNumber(holderStats.whales)}</p>
            </div>
            <div className="bg-black/30 rounded-lg p-2">
              <p className="text-[10px] text-gray-400 font-mono">👨‍💻 Devs</p>
              <p className="font-medium font-mono text-sm">{formatNumber(holderStats.devs)}</p>
            </div>
            <div className="bg-black/30 rounded-lg p-2">
              <p className="text-[10px] text-gray-400 font-mono">👤 Retail</p>
              <p className="font-medium font-mono text-sm">{formatNumber(holderStats.retail)}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link to={`/trade/${(coin.symbol || '').toLowerCase()}`} className="flex-1">
            <Button className="w-full bg-wybe-primary hover:bg-wybe-primary/90 active:bg-wybe-primary/80 text-white font-poppins font-bold rounded-full">
              Trade 💱
            </Button>
          </Link>
          <Link to={`/trade/${(coin.symbol || '').toLowerCase()}?tab=info`}>
            <Button variant="outline" className="bg-transparent border-white/10 hover:bg-wybe-background-light/50 active:bg-wybe-background-light/70 font-poppins rounded-full">
              Details 📊
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Discover;
