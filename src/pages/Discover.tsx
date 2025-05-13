
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, Filter, TrendingUp, Calendar, Coins } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const Discover = () => {
  const [sortBy, setSortBy] = useState("marketCap");
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Mock data for coins
  const coins = [
    {
      name: "Pepe Solana",
      symbol: "PEPES",
      marketCap: 230000,
      volume24h: 52000,
      priceChange: 15.4,
      launchDate: "2025-04-01",
      status: "live",
      trades: 1240
    },
    {
      name: "Solana Doge",
      symbol: "SOLDOGE",
      marketCap: 450000,
      volume24h: 87000,
      priceChange: -5.3,
      launchDate: "2025-04-05",
      status: "live",
      trades: 2130
    },
    {
      name: "Moon Shot",
      symbol: "MOON",
      marketCap: 120000,
      volume24h: 31000,
      priceChange: 40.2,
      launchDate: "2025-04-10",
      status: "live",
      trades: 980
    },
    {
      name: "Wybe Coin",
      symbol: "WYBE",
      marketCap: 780000,
      volume24h: 145000,
      priceChange: 8.7,
      launchDate: "2025-03-28",
      status: "live",
      trades: 4500
    },
    {
      name: "Cat Protocol",
      symbol: "MEOW",
      marketCap: null,
      volume24h: null,
      priceChange: null,
      launchDate: "2025-05-15",
      status: "upcoming",
      trades: 0
    },
    {
      name: "Rocket Finance",
      symbol: "ROCKET",
      marketCap: null,
      volume24h: null,
      priceChange: null,
      launchDate: "2025-05-20",
      status: "upcoming",
      trades: 0
    }
  ];
  
  // Filter and sort coins
  const filteredCoins = coins.filter(coin => {
    // Filter by name or symbol
    if (searchTerm && !coin.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
        !coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    
    // Filter by type
    if (filterType === "live" && coin.status !== "live") return false;
    if (filterType === "upcoming" && coin.status !== "upcoming") return false;
    
    return true;
  }).sort((a, b) => {
    if (sortBy === "marketCap") {
      return (b.marketCap || 0) - (a.marketCap || 0);
    } else if (sortBy === "volume24h") {
      return (b.volume24h || 0) - (a.volume24h || 0);
    } else if (sortBy === "trades") {
      return b.trades - a.trades;
    } else if (sortBy === "priceChange") {
      return (b.priceChange || 0) - (a.priceChange || 0);
    } else if (sortBy === "launchDate") {
      return new Date(a.launchDate).getTime() - new Date(b.launchDate).getTime();
    }
    return 0;
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-12 flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Discover Coins</h1>
          <p className="text-xl text-gray-300">
            Explore trending coins and upcoming launches on Wybe
          </p>
        </motion.div>
        
        {/* Filters and Search */}
        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full md:w-auto flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                placeholder="Search coins..." 
                className="pl-10 bg-wybe-background-light border-wybe-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-gray-400 whitespace-nowrap">Filter:</span>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="bg-wybe-background-light border-wybe-primary/20 w-[120px]">
                    <SelectValue placeholder="Filter by" />
                  </SelectTrigger>
                  <SelectContent className="bg-wybe-background-light border-white/10">
                    <SelectItem value="all">All Coins</SelectItem>
                    <SelectItem value="live">Live Coins</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2 w-full md:w-auto">
                <span className="text-gray-400 whitespace-nowrap">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-wybe-background-light border-wybe-primary/20 w-[150px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent className="bg-wybe-background-light border-white/10">
                    <SelectItem value="marketCap">Market Cap</SelectItem>
                    <SelectItem value="volume24h">Volume (24h)</SelectItem>
                    <SelectItem value="priceChange">Price Change</SelectItem>
                    <SelectItem value="trades">Number of Trades</SelectItem>
                    <SelectItem value="launchDate">Launch Date</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs for Live and Upcoming */}
        <Tabs defaultValue="all" className="mb-8">
          <TabsList className="bg-wybe-background-light border border-wybe-primary/20 mb-6">
            <TabsTrigger value="all">All Coins</TabsTrigger>
            <TabsTrigger value="live">Live Trading</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Launches</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCoins.map((coin) => (
                <CoinCard key={coin.symbol} coin={coin} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="live">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCoins.filter(c => c.status === "live").map((coin) => (
                <CoinCard key={coin.symbol} coin={coin} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="upcoming">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCoins.filter(c => c.status === "upcoming").map((coin) => (
                <CoinCard key={coin.symbol} coin={coin} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Smart Contract Testing Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="glass-card p-6 mb-8 overflow-hidden"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Coins className="text-wybe-primary" size={20} />
            Smart Contract Deployment Guide
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">Testnet Deployment</h3>
              <p className="text-gray-300 mb-3">
                Before mainnet deployment, test your token on Solana Devnet/Testnet using this address:
              </p>
              <div className="bg-wybe-background/80 p-3 rounded-md border border-wybe-primary/20 flex justify-between items-center">
                <code className="text-wybe-secondary text-sm">
                  FG9SYnttGJKQsHqNPZhwGVkzkJEGnY8kaySvbSSNYNtw
                </code>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="text-xs hover:bg-wybe-primary/20"
                  onClick={() => {
                    navigator.clipboard.writeText("FG9SYnttGJKQsHqNPZhwGVkzkJEGnY8kaySvbSSNYNtw");
                    toast.success("Testnet address copied to clipboard!");
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Mainnet Deployment Steps</h3>
              <ol className="space-y-4 pl-5 list-decimal text-gray-300">
                <li>
                  <p><strong>Set Up Development Environment</strong></p>
                  <p className="text-sm text-gray-400 mt-1">Install Solana CLI tools and Anchor framework</p>
                  <code className="text-xs block bg-wybe-background/80 p-2 rounded-md mt-1 border border-wybe-primary/20">
                    $ sh -c "$(curl -sSfL https://release.solana.com/v1.16.5/install)" <br />
                    $ npm install -g @project-serum/anchor-cli
                  </code>
                </li>
                <li>
                  <p><strong>Configure Your Wallet</strong></p>
                  <p className="text-sm text-gray-400 mt-1">Generate a new keypair or use your existing one</p>
                  <code className="text-xs block bg-wybe-background/80 p-2 rounded-md mt-1 border border-wybe-primary/20">
                    $ solana-keygen new -o ~/.config/solana/id.json <br />
                    $ solana config set -k ~/.config/solana/id.json
                  </code>
                </li>
                <li>
                  <p><strong>Fund Your Wallet</strong></p>
                  <p className="text-sm text-gray-400 mt-1">Ensure you have enough SOL for deployment (~5 SOL recommended)</p>
                </li>
                <li>
                  <p><strong>Initialize Anchor Project</strong></p>
                  <code className="text-xs block bg-wybe-background/80 p-2 rounded-md mt-1 border border-wybe-primary/20">
                    $ anchor init wybe_token <br />
                    $ cd wybe_token
                  </code>
                </li>
                <li>
                  <p><strong>Build the Project</strong></p>
                  <code className="text-xs block bg-wybe-background/80 p-2 rounded-md mt-1 border border-wybe-primary/20">
                    $ anchor build
                  </code>
                </li>
                <li>
                  <p><strong>Deploy to Mainnet</strong></p>
                  <code className="text-xs block bg-wybe-background/80 p-2 rounded-md mt-1 border border-wybe-primary/20">
                    $ solana config set --url https://api.mainnet-beta.solana.com <br />
                    $ anchor deploy
                  </code>
                </li>
                <li>
                  <p><strong>Verify Deployment</strong></p>
                  <p className="text-sm text-gray-400 mt-1">Check your program ID and verify on Solscan</p>
                  <code className="text-xs block bg-wybe-background/80 p-2 rounded-md mt-1 border border-wybe-primary/20">
                    $ solana address -k target/deploy/wybe_token-keypair.json
                  </code>
                </li>
                <li>
                  <p><strong>Initialize Your Token</strong></p>
                  <p className="text-sm text-gray-400 mt-1">Create the token, set supply, and configure bonding curve</p>
                </li>
              </ol>
            </div>
          </div>
          
          <div className="mt-8">
            <Button className="btn-primary" onClick={() => toast.info("Our team can help you with deployment!")}>
              Request Deployment Assistance
            </Button>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

// Coin Card Component
const CoinCard = ({ coin }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="glass-card overflow-hidden"
    >
      <div className={`h-1.5 w-full ${coin.status === 'upcoming' ? 'bg-wybe-secondary' : coin.priceChange >= 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold">{coin.name}</h3>
            <p className="text-wybe-secondary font-medium">{coin.symbol}</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-wybe-primary/20 flex items-center justify-center">
            <Coins className="text-wybe-primary" size={20} />
          </div>
        </div>
        
        {coin.status === "live" ? (
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div>
              <p className="text-sm text-gray-400">Market Cap</p>
              <p className="font-medium">${coin.marketCap.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Volume (24h)</p>
              <p className="font-medium">${coin.volume24h.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Price Change</p>
              <p className={`font-medium ${coin.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {coin.priceChange >= 0 ? '+' : ''}{coin.priceChange}%
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Trades</p>
              <p className="font-medium">{coin.trades.toLocaleString()}</p>
            </div>
          </div>
        ) : (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={16} className="text-wybe-secondary" />
              <p className="text-sm">
                Launching on {new Date(coin.launchDate).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-wybe-primary/10 border border-wybe-primary/20 rounded-lg p-3 mt-2">
              <p className="text-sm flex items-center gap-2">
                <TrendingUp size={16} className="text-wybe-secondary" />
                <span>Upcoming token launch via Wybe Assisted Launch</span>
              </p>
            </div>
          </div>
        )}
        
        <div className="flex gap-2 mt-4">
          {coin.status === "live" ? (
            <Link to={`/trade/${coin.symbol.toLowerCase()}`} className="w-full">
              <Button className="btn-primary w-full">Trade Now</Button>
            </Link>
          ) : (
            <Button className="btn-secondary w-full" disabled>Coming Soon</Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Discover;
