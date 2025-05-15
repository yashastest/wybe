
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import TradingInterface from '@/components/TradingInterface';
import TransactionHistory from '@/components/TransactionHistory';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft, Info, TrendingUp, TrendingDown, DollarSign, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useWallet } from '@/hooks/useWallet.tsx';

// Mock coin data (would fetch from API/database in real app)
const coinData = {
  'pepe': {
    name: "Pepe",
    symbol: "PEPE",
    logo: "/coins/pepe.png",
    banner: "/lovable-uploads/11c9cd9c-16fc-462c-912b-bd90bbd2bd17.png",
    price: 0.00000123,
    change24h: 5.67,
    marketCap: 420000000,
    volume24h: 69000000,
    holders: 15800,
    description: "The original meme coin that took the crypto world by storm.",
    website: "https://pepe.io",
    twitter: "@pepe_coin",
    telegram: "@pepe_community"
  },
  'doge': {
    name: "Dogecoin",
    symbol: "DOGE",
    logo: "/coins/doge.png",
    banner: "/lovable-uploads/5f8a8eb9-3963-4b1b-8ca5-2beecbb60b39.png",
    price: 0.123,
    change24h: -2.34,
    marketCap: 16000000000,
    volume24h: 980000000,
    holders: 45700,
    description: "The original dog meme cryptocurrency, started as a joke but gained massive popularity.",
    website: "https://dogecoin.com",
    twitter: "@dogecoin",
    telegram: "@dogecoin_community"
  },
  'shib': {
    name: "Shiba Inu",
    symbol: "SHIB",
    logo: "/coins/shib.png", 
    banner: "/lovable-uploads/a8831646-bbf0-4510-9f62-5999db7cca5d.png",
    price: 0.00002345,
    change24h: 7.89,
    marketCap: 13500000000,
    volume24h: 850000000,
    holders: 38900,
    description: "The 'Dogecoin killer' that evolved into its own ecosystem.",
    website: "https://shibatoken.com",
    twitter: "@shibtoken",
    telegram: "@shibainuofficial"
  },
  'floki': {
    name: "Floki",
    symbol: "FLOKI",
    logo: "/coins/floki.png",
    banner: "/lovable-uploads/11c9cd9c-16fc-462c-912b-bd90bbd2bd17.png",
    price: 0.0001234,
    change24h: 12.34,
    marketCap: 1200000000,
    volume24h: 320000000,
    holders: 24600,
    description: "Named after Elon Musk's dog, Floki aims to be a community-powered meme token.",
    website: "https://floki.com",
    twitter: "@floki",
    telegram: "@flokicommunity"
  },
  'bonk': {
    name: "Bonk",
    symbol: "BONK",
    logo: "/coins/bonk.png",
    banner: "/lovable-uploads/5f8a8eb9-3963-4b1b-8ca5-2beecbb60b39.png",
    price: 0.00000234,
    change24h: -3.45,
    marketCap: 950000000,
    volume24h: 210000000,
    holders: 19800,
    description: "The first dog-themed meme coin on Solana, bringing meme culture to the Solana community.",
    website: "https://bonkcoin.com",
    twitter: "@bonk_sol",
    telegram: "@bonk_community"
  },
  'wojak': {
    name: "Wojak",
    symbol: "WOJAK",
    logo: "/coins/wojak.png",
    banner: "/lovable-uploads/a8831646-bbf0-4510-9f62-5999db7cca5d.png",
    price: 0.0000789,
    change24h: 9.87,
    marketCap: 320000000,
    volume24h: 78000000,
    holders: 8700,
    description: "Based on the famous 'feels guy' internet meme, Wojak represents the emotional rollercoaster of crypto.",
    website: "https://wojak.finance",
    twitter: "@wojak_official",
    telegram: "@wojak_holders"
  },
  'pepes': {
    name: "Pepe Solana",
    symbol: "PEPES",
    logo: "/coins/pepe.png",
    banner: "/lovable-uploads/11c9cd9c-16fc-462c-912b-bd90bbd2bd17.png",
    price: 0.00023,
    change24h: 15.4,
    marketCap: 230000,
    volume24h: 52000,
    holders: 4850,
    description: "Pepe meme coin built on the Solana blockchain for fast and low-cost transactions.",
    website: "https://pepesolana.io",
    twitter: "@pepe_solana",
    telegram: "@pepe_solana_community"
  },
};

// Format functions
const formatPrice = (price: number) => {
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

const formatMarketCap = (marketCap: number) => {
  if (marketCap >= 1000000000) {
    return `$${(marketCap / 1000000000).toFixed(2)}B`;
  } else if (marketCap >= 1000000) {
    return `$${(marketCap / 1000000).toFixed(2)}M`;
  } else {
    return `$${(marketCap / 1000).toFixed(2)}K`;
  }
};

const formatNumber = (num: number) => {
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return num.toString();
};

const TokenTrade: React.FC = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const { connected } = useWallet();
  const [activeTab, setActiveTab] = useState('trade');
  
  // Get coin data based on URL parameter
  const coin = tokenId ? coinData[tokenId as keyof typeof coinData] : undefined;
  
  // If token not found, show error
  if (!coin) {
    return (
      <div className="min-h-screen flex flex-col bg-black text-white">
        <Header />
        <div className="container mx-auto px-4 py-20 flex-grow flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">Token Not Found</h1>
          <p className="mb-8">The token you're looking for doesn't exist or has been removed.</p>
          <Link to="/discover">
            <Button>
              <ArrowLeft className="mr-2" size={16} />
              Return to Discover
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      
      <main className="flex-grow container px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="pt-20 md:pt-24 mb-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <Link to="/discover" className="text-gray-400 hover:text-white transition-colors">
              <div className="flex items-center gap-1">
                <ArrowLeft size={16} />
                <span>Back to Discover</span>
              </div>
            </Link>
          </div>
          
          {/* Token Info Header */}
          <div className="glass-card p-6 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-black/40 border-2 border-white/10">
                  <AspectRatio ratio={1/1}>
                    <img
                      src={coin.logo}
                      alt={coin.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                      }}
                    />
                  </AspectRatio>
                </div>
                
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl md:text-3xl font-bold">{coin.name}</h1>
                    <span className="text-gray-400 font-mono">{coin.symbol}</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <div className={`flex items-center px-2 py-1 rounded-full text-sm ${
                      coin.change24h >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {coin.change24h >= 0 ? 
                        <TrendingUp size={14} className="mr-1" /> : 
                        <TrendingDown size={14} className="mr-1" />
                      }
                      {Math.abs(coin.change24h).toFixed(2)}%
                    </div>
                    <div className="ml-3 text-sm">
                      <span className="text-gray-400">Price: </span>
                      <span className="font-mono">${formatPrice(coin.price)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 md:ml-auto">
                <div className="text-center p-2 bg-black/30 rounded-lg">
                  <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                    <DollarSign size={12} className="text-wybe-primary" />
                    Market Cap
                  </p>
                  <p className="font-mono">{formatMarketCap(coin.marketCap)}</p>
                </div>
                <div className="text-center p-2 bg-black/30 rounded-lg">
                  <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                    <TrendingUp size={12} className="text-wybe-primary" />
                    24h Volume
                  </p>
                  <p className="font-mono">{formatMarketCap(coin.volume24h)}</p>
                </div>
                <div className="text-center p-2 bg-black/30 rounded-lg">
                  <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                    <Users size={12} className="text-wybe-primary" />
                    Holders
                  </p>
                  <p className="font-mono">{formatNumber(coin.holders)}</p>
                </div>
              </div>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="trade" className="font-poppins">Trade</TabsTrigger>
              <TabsTrigger value="info" className="font-poppins">Token Info</TabsTrigger>
              <TabsTrigger value="history" className="font-poppins">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="trade" className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-3">
                  <TradingInterface 
                    tokenSymbol={coin.symbol}
                    tokenName={coin.name}
                    tokenPrice={coin.price} 
                    tokenLogo={coin.logo}
                  />
                </div>
                
                <div className="lg:col-span-2">
                  {connected ? (
                    <TransactionHistory tokenSymbol={coin.symbol} />
                  ) : (
                    <div className="glass-card p-6 h-full flex flex-col items-center justify-center">
                      <Info size={32} className="text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">Connect Your Wallet</h3>
                      <p className="text-sm text-center text-gray-400 mb-4">
                        Connect your wallet to view your transaction history for {coin.symbol}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="info">
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold mb-4">About {coin.name}</h2>
                <p className="text-gray-300 mb-6">{coin.description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Token Information</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-gray-400">Symbol</span>
                        <span className="font-mono">{coin.symbol}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-gray-400">Price</span>
                        <span className="font-mono">${formatPrice(coin.price)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-gray-400">Market Cap</span>
                        <span className="font-mono">{formatMarketCap(coin.marketCap)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-gray-400">24h Volume</span>
                        <span className="font-mono">{formatMarketCap(coin.volume24h)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-gray-400">24h Change</span>
                        <span className={`font-mono ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {coin.change24h >= 0 ? '+' : ''}{coin.change24h.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-3">Community & Links</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-gray-400">Website</span>
                        <a href="#" className="text-wybe-primary hover:underline font-mono">{coin.website}</a>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-gray-400">Twitter</span>
                        <a href="#" className="text-wybe-primary hover:underline font-mono">{coin.twitter}</a>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-gray-400">Telegram</span>
                        <a href="#" className="text-wybe-primary hover:underline font-mono">{coin.telegram}</a>
                      </div>
                      <div className="flex justify-between py-2 border-b border-white/10">
                        <span className="text-gray-400">Holders</span>
                        <span className="font-mono">{formatNumber(coin.holders)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              {connected ? (
                <TransactionHistory tokenSymbol={coin.symbol} fullSize={true} />
              ) : (
                <div className="glass-card p-6 min-h-[300px] flex flex-col items-center justify-center">
                  <Info size={32} className="text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">Connect Your Wallet</h3>
                  <p className="text-sm text-center text-gray-400 mb-4">
                    Connect your wallet to view your transaction history for {coin.symbol}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TokenTrade;
