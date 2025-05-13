
import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TrendingCoins = () => {
  // Mock data
  const trendingCoins = [
    {
      name: "Pepe Solana",
      symbol: "PEPES",
      price: "0.00023",
      change: "+15.4%",
      volume: "$52,000",
      marketCap: "$230,000",
      positive: true,
      sparkline: [20, 22, 25, 22, 26, 27, 30, 28, 30, 35]
    },
    {
      name: "Doge Sol",
      symbol: "DSOL",
      price: "0.00056",
      change: "+8.2%",
      volume: "$120,000",
      marketCap: "$560,000",
      positive: true,
      sparkline: [40, 42, 45, 42, 46, 44, 48, 52, 50, 55]
    },
    {
      name: "Shiba Solana",
      symbol: "SHIBSOL",
      price: "0.00012",
      change: "-4.7%",
      volume: "$32,000",
      marketCap: "$120,000",
      positive: false,
      sparkline: [25, 22, 20, 18, 20, 22, 18, 16, 18, 15]
    },
    {
      name: "Floki Sun",
      symbol: "FLOKISUN",
      price: "0.00034",
      change: "+22.3%",
      volume: "$78,000",
      marketCap: "$340,000",
      positive: true,
      sparkline: [30, 35, 38, 40, 38, 42, 45, 50, 48, 55]
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {trendingCoins.map((coin, index) => (
        <TrendingCoinCard key={index} coin={coin} delay={index * 0.1} />
      ))}
    </div>
  );
};

const TrendingCoinCard = ({ coin, delay }) => {
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
      className="glass-card p-5 hover:border-wybe-primary/30 transition-colors"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold">{coin.name}</h3>
          <p className="text-sm text-gray-400">{coin.symbol}</p>
        </div>
        <div className={`flex items-center px-2 py-1 rounded-full text-sm ${
            coin.positive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
          }`}
        >
          {coin.positive ? 
            <TrendingUp size={14} className="mr-1" /> : 
            <TrendingDown size={14} className="mr-1" />
          }
          {coin.change}
        </div>
      </div>
      
      <div className="mb-4 h-16">
        <Sparkline data={coin.sparkline} positive={coin.positive} />
      </div>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div>
          <p className="text-xs text-gray-400">Price</p>
          <p className="font-medium">{coin.price} SOL</p>
        </div>
        <div>
          <p className="text-xs text-gray-400">Volume (24h)</p>
          <p className="font-medium">{coin.volume}</p>
        </div>
      </div>
      
      <Link to={`/trade/${coin.symbol.toLowerCase()}`}>
        <Button className="w-full btn-primary text-sm py-1 h-8">
          Trade {coin.symbol}
        </Button>
      </Link>
    </motion.div>
  );
};

const Sparkline = ({ data, positive }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((value - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');
  
  return (
    <div className="w-full h-full">
      <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
        <linearGradient id={`gradient-${positive}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={positive ? "#22c55e" : "#ef4444"} stopOpacity="0.2" />
          <stop offset="100%" stopColor={positive ? "#22c55e" : "#ef4444"} stopOpacity="0" />
        </linearGradient>
        
        <polygon 
          points={`0,100 ${points} 100,100`} 
          fill={`url(#gradient-${positive})`}
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
