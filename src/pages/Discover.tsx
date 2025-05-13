
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowUp, ArrowDown, ChevronDown, Filter, Users, Whale, User, Code, Rocket } from "lucide-react";
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

// Mock data for discovered coins
const discoverCoins = [
  {
    id: "pepe",
    name: "Pepe",
    symbol: "PEPE",
    logo: "/coins/pepe.png",
    banner: "/lovable-uploads/11c9cd9c-16fc-462c-912b-bd90bbd2bd17.png",
    price: 0.00000123,
    change24h: 5.67,
    marketCap: 420000000,
    volume24h: 69000000,
    category: ["Meme", "Frog"],
    holders: 15800,
    devWallet: "0x3a2d...f5e6",
    holderStats: {
      whales: 28,
      retail: 15320,
      devs: 3
    }
  },
  {
    id: "doge",
    name: "Dogecoin",
    symbol: "DOGE",
    logo: "/coins/doge.png",
    banner: "/lovable-uploads/5f8a8eb9-3963-4b1b-8ca5-2beecbb60b39.png",
    price: 0.123,
    change24h: -2.34,
    marketCap: 16000000000,
    volume24h: 980000000,
    category: ["Meme", "Dog"],
    holders: 45700,
    devWallet: "0x7c9d...a2b1",
    holderStats: {
      whales: 145,
      retail: 45412,
      devs: 12
    }
  },
  {
    id: "shib",
    name: "Shiba Inu",
    symbol: "SHIB",
    logo: "/coins/shib.png",
    banner: "/lovable-uploads/a8831646-bbf0-4510-9f62-5999db7cca5d.png",
    price: 0.00002345,
    change24h: 7.89,
    marketCap: 13500000000,
    volume24h: 850000000,
    category: ["Meme", "Dog"],
    holders: 38900,
    devWallet: "0x5f4a...d7e2",
    holderStats: {
      whales: 98,
      retail: 38750,
      devs: 7
    }
  },
  {
    id: "floki",
    name: "Floki",
    symbol: "FLOKI",
    logo: "/coins/floki.png",
    banner: "/lovable-uploads/11c9cd9c-16fc-462c-912b-bd90bbd2bd17.png",
    price: 0.0001234,
    change24h: 12.34,
    marketCap: 1200000000,
    volume24h: 320000000,
    category: ["Meme", "Dog"],
    holders: 24600,
    devWallet: "0x2b3c...e9f0",
    holderStats: {
      whales: 54,
      retail: 24520,
      devs: 5
    }
  },
  {
    id: "bonk",
    name: "Bonk",
    symbol: "BONK",
    logo: "/coins/bonk.png",
    banner: "/lovable-uploads/5f8a8eb9-3963-4b1b-8ca5-2beecbb60b39.png",
    price: 0.00000234,
    change24h: -3.45,
    marketCap: 950000000,
    volume24h: 210000000,
    category: ["Meme", "Dog", "Solana"],
    holders: 19800,
    devWallet: "0x9a8b...c3d4",
    holderStats: {
      whales: 32,
      retail: 19750,
      devs: 4
    }
  },
  {
    id: "wojak",
    name: "Wojak",
    symbol: "WOJAK",
    logo: "/coins/wojak.png",
    banner: "/lovable-uploads/a8831646-bbf0-4510-9f62-5999db7cca5d.png",
    price: 0.0000789,
    change24h: 9.87,
    marketCap: 320000000,
    volume24h: 78000000,
    category: ["Meme", "Feels"],
    holders: 8700,
    devWallet: "0x4e5f...1a2b",
    holderStats: {
      whales: 15,
      retail: 8670,
      devs: 2
    }
  },
];

// Format functions
const formatPrice = (price) => {
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

const formatMarketCap = (marketCap) => {
  if (marketCap >= 1000000000) {
    return `$${(marketCap / 1000000000).toFixed(2)}B`;
  } else if (marketCap >= 1000000) {
    return `$${(marketCap / 1000000).toFixed(2)}M`;
  } else {
    return `$${(marketCap / 1000).toFixed(2)}K`;
  }
};

const formatNumber = (num) => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const Discover = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("marketCap");
  const [filterCategory, setFilterCategory] = useState("All");
  
  // Filter and sort coins
  const filteredCoins = discoverCoins
    .filter(coin => {
      const matchesSearch = coin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          coin.symbol.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === "All" || coin.category.includes(filterCategory);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortOption === "marketCap") return b.marketCap - a.marketCap;
      if (sortOption === "volume") return b.volume24h - a.volume24h;
      if (sortOption === "priceAsc") return a.price - b.price;
      if (sortOption === "priceDesc") return b.price - a.price;
      if (sortOption === "change") return b.change24h - a.change24h;
      return 0;
    });

  // All categories from data
  const allCategories = ["All", ...new Set(discoverCoins.flatMap(coin => coin.category))];
  
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
          {filteredCoins.length > 0 ? (
            filteredCoins.map((coin, index) => (
              <CoinCard key={coin.id} coin={coin} index={index} />
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16">
              <h3 className="text-xl font-poppins font-bold mb-2">No coins found 😢</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Coin card component with banner
const CoinCard = ({ coin, index }) => {
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
            src={coin.banner}
            alt={`${coin.name} banner`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </AspectRatio>
      </div>
      
      {/* Logo and symbol - positioned below banner */}
      <div className="px-4 pt-4 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm p-1 border-2 border-white/10">
          <img
            src={coin.logo}
            alt={coin.name}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </div>
        <div>
          <h3 className="font-poppins font-bold text-white text-xl">{coin.name}</h3>
          <p className="text-gray-300 text-sm font-mono">{coin.symbol}</p>
        </div>
        
        {/* Price change indicator */}
        <div className="ml-auto">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
            coin.change24h >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          }`}>
            {coin.change24h >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            <span className="font-mono font-bold">{Math.abs(coin.change24h).toFixed(2)}%</span>
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
          {coin.category.map((cat) => (
            <span
              key={cat}
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
              <p className="font-medium font-mono text-sm">{formatNumber(coin.holderStats.whales)}</p>
            </div>
            <div className="bg-black/30 rounded-lg p-2">
              <p className="text-[10px] text-gray-400 font-mono">👨‍💻 Devs</p>
              <p className="font-medium font-mono text-sm">{formatNumber(coin.holderStats.devs)}</p>
            </div>
            <div className="bg-black/30 rounded-lg p-2">
              <p className="text-[10px] text-gray-400 font-mono">👤 Retail</p>
              <p className="font-medium font-mono text-sm">{formatNumber(coin.holderStats.retail)}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link to={`/trade/${coin.symbol.toLowerCase()}`} className="flex-1">
            <Button className="w-full bg-wybe-primary hover:bg-wybe-primary/90 active:bg-wybe-primary/80 text-white font-poppins font-bold rounded-full">
              Trade 💱
            </Button>
          </Link>
          <Button variant="outline" className="bg-transparent border-white/10 hover:bg-wybe-background-light/50 active:bg-wybe-background-light/70 font-poppins rounded-full">
            Details 📊
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Discover;
