
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowUp, ArrowDown, ChevronDown, Filter } from "lucide-react";
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
      
      <main className="flex-grow container px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-3xl font-poppins font-bold mb-2">Discover <span className="text-gradient">Meme Coins</span></h1>
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
                className="bg-wybe-background-light/30 border border-white/10 rounded-lg pl-10 pr-4 py-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-wybe-primary"
              />
            </div>
            
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1 bg-wybe-background-light/30 border-white/10 font-poppins">
                    <Filter size={16} className="mr-2" />
                    Category: {filterCategory}
                    <ChevronDown size={16} className="ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-wybe-background-light/90 border-white/10 backdrop-blur-lg">
                  {allCategories.map((category) => (
                    <DropdownMenuItem 
                      key={category}
                      onClick={() => setFilterCategory(category)}
                      className={filterCategory === category ? "bg-wybe-primary/20 text-wybe-primary font-mono font-bold" : "font-mono"}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex-1 bg-wybe-background-light/30 border-white/10 font-poppins">
                    Sort By
                    <ChevronDown size={16} className="ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-wybe-background-light/90 border-white/10 backdrop-blur-lg">
                  <DropdownMenuItem 
                    onClick={() => setSortOption("marketCap")} 
                    className={sortOption === "marketCap" ? "bg-wybe-primary/20 text-wybe-primary font-mono font-bold" : "font-mono"}
                  >
                    Market Cap
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortOption("volume")}
                    className={sortOption === "volume" ? "bg-wybe-primary/20 text-wybe-primary font-mono font-bold" : "font-mono"}
                  >
                    Volume
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortOption("priceDesc")}
                    className={sortOption === "priceDesc" ? "bg-wybe-primary/20 text-wybe-primary font-mono font-bold" : "font-mono"}
                  >
                    Price (High to Low)
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortOption("priceAsc")}
                    className={sortOption === "priceAsc" ? "bg-wybe-primary/20 text-wybe-primary font-mono font-bold" : "font-mono"}
                  >
                    Price (Low to High)
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setSortOption("change")}
                    className={sortOption === "change" ? "bg-wybe-primary/20 text-wybe-primary font-mono font-bold" : "font-mono"}
                  >
                    24h Change
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        {/* Coins grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCoins.length > 0 ? (
            filteredCoins.map((coin, index) => (
              <CoinCard key={coin.id} coin={coin} index={index} />
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-16">
              <h3 className="text-xl font-poppins font-bold mb-2">No coins found</h3>
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
      <div className="w-full h-36 relative">
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
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        
        {/* Logo and symbol on banner */}
        <div className="absolute bottom-0 left-0 p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm p-1">
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
        </div>
        
        {/* Price change indicator */}
        <div className="absolute top-4 right-4">
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${
            coin.change24h >= 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
          }`}>
            {coin.change24h >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
            <span className="font-mono font-bold">{Math.abs(coin.change24h).toFixed(2)}%</span>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-xs text-gray-400 font-mono">Price</p>
            <p className="font-medium font-mono">${formatPrice(coin.price)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-mono">Market Cap</p>
            <p className="font-medium font-mono">{formatMarketCap(coin.marketCap)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-mono">Volume (24h)</p>
            <p className="font-medium font-mono">{formatMarketCap(coin.volume24h)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-mono">Categories</p>
            <div className="flex flex-wrap gap-1 mt-1">
              {coin.category.slice(0, 2).map((cat) => (
                <span
                  key={cat}
                  className="text-[10px] px-1.5 py-0.5 bg-wybe-primary/10 text-wybe-primary rounded-full font-mono"
                >
                  {cat}
                </span>
              ))}
              {coin.category.length > 2 && (
                <span className="text-[10px] px-1.5 py-0.5 bg-gray-700/30 text-gray-400 rounded-full">
                  +{coin.category.length - 2}
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Link to={`/trade/${coin.symbol.toLowerCase()}`} className="flex-1">
            <Button className="w-full bg-wybe-primary hover:bg-wybe-primary/90 font-poppins font-bold">
              Trade
            </Button>
          </Link>
          <Button variant="outline" className="bg-transparent border-white/10 hover:bg-wybe-background-light/50 font-poppins">
            Details
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default Discover;
