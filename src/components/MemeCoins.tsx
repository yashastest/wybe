
import React from "react";
import { motion } from "framer-motion";
import { IconType } from "lucide-react";
import { Coins, Rocket, Trophy, TrendingUp, ShieldCheck, Users } from "lucide-react";

interface MemeCoinProps {
  name: string;
  symbol: string;
  icon: React.ReactNode;
  description: string;
  trend: "up" | "down" | "stable";
  color: string;
}

const MemeCoins = () => {
  const memeCoinsData: MemeCoinProps[] = [
    {
      name: "Doge Solana",
      symbol: "DOGESOL",
      icon: "🐕",
      description: "Much wow, such Solana, very fast!",
      trend: "up",
      color: "from-yellow-500 to-orange-500"
    },
    {
      name: "Pepe Chain",
      symbol: "PEPEC",
      icon: "🐸",
      description: "The rarest Pepe on the blockchain",
      trend: "up",
      color: "from-green-500 to-emerald-600"
    },
    {
      name: "Moon Shiba",
      symbol: "MSHIB",
      icon: "🌙",
      description: "To the moon and beyond!",
      trend: "stable",
      color: "from-purple-500 to-blue-600"
    },
    {
      name: "Floki Rocket",
      symbol: "FLOKI",
      icon: "🚀",
      description: "Viking journeys to Mars",
      trend: "up",
      color: "from-red-500 to-orange-600"
    },
    {
      name: "Cats Finance",
      symbol: "CATFI",
      icon: "🐱",
      description: "Purr-fect meme ecosystem",
      trend: "down",
      color: "from-blue-400 to-indigo-600"
    },
    {
      name: "Space Doge",
      symbol: "SPDOGE",
      icon: "🌌",
      description: "Exploring new galaxies",
      trend: "up",
      color: "from-indigo-500 to-purple-600"
    }
  ];

  const featuresData = [
    {
      icon: <Rocket className="w-6 h-6" />,
      title: "Instant Launch",
      description: "Create your meme coin with just a few clicks"
    },
    {
      icon: <Coins className="w-6 h-6" />,
      title: "Fixed Supply",
      description: "1 billion tokens with verified supply"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Bonding Curve",
      description: "Built-in automated market maker"
    },
    {
      icon: <Trophy className="w-6 h-6" />,
      title: "Creator Rewards",
      description: "Earn 40% of trading fees with high performance"
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Audited",
      description: "All smart contracts thoroughly audited"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community",
      description: "Built-in tools to grow your following"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="py-16 relative overflow-hidden">
      <div className="container">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="text-center mb-12"
        >
          <motion.h2 
            variants={itemVariants}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            Trending <span className="text-gradient">Meme Coins</span>
          </motion.h2>
          <motion.p 
            variants={itemVariants}
            className="text-lg text-gray-300 max-w-2xl mx-auto"
          >
            Join the meme revolution with Wybe's launchpad and create the next viral sensation
          </motion.p>
        </motion.div>
        
        {/* Meme coins grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {memeCoinsData.map((coin, index) => (
            <MemeCoinCard key={index} coin={coin} index={index} />
          ))}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center my-12"
        >
          <h3 className="text-2xl font-bold mb-2">Ready to create yours?</h3>
          <p className="text-gray-300 mb-6">Launch your meme coin with powerful features</p>
        </motion.div>
        
        {/* Features grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {featuresData.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="glass-card p-6 hover:border-wybe-primary/30 transition-all group"
              whileHover={{ 
                y: -5,
                boxShadow: "0 10px 25px -5px rgba(139, 92, 246, 0.3)" 
              }}
            >
              <div className="w-12 h-12 rounded-full bg-wybe-primary/20 flex items-center justify-center mb-4 group-hover:bg-wybe-primary/30 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-300 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {/* Background elements */}
      <div className="absolute top-40 right-20 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl" />
    </div>
  );
};

const MemeCoinCard = ({ coin, index }) => {
  const getTrendIcon = (trend: string) => {
    if (trend === "up") return <TrendingUp className="w-5 h-5 text-green-400" />;
    if (trend === "down") return <TrendingUp className="w-5 h-5 text-red-400 rotate-180" />;
    return <TrendingUp className="w-5 h-5 text-yellow-400 rotate-90" />;
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { 
          opacity: 1, 
          y: 0,
          transition: { 
            duration: 0.5,
            delay: index * 0.1
          }
        }
      }}
      whileHover={{ 
        y: -5,
        scale: 1.02,
        transition: { duration: 0.2 } 
      }}
      className="glass-card p-6 backdrop-blur-md overflow-hidden relative group"
    >
      {/* Animated background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${coin.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <motion.div 
            className="w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-2xl"
            animate={{
              y: [0, -5, 0],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              times: [0, 0.2, 0.5, 0.8, 1]
            }}
          >
            {coin.icon}
          </motion.div>
          <div>
            <h3 className="font-bold">{coin.name}</h3>
            <p className="text-xs text-wybe-primary font-semibold">${coin.symbol}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          {getTrendIcon(coin.trend)}
        </div>
      </div>
      
      <p className="text-gray-300 text-sm mb-4">{coin.description}</p>
      
      <div className="flex justify-between items-center">
        <div className="bg-black/30 px-3 py-1 rounded-full text-xs">
          Trending #{index + 1}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="text-xs font-semibold text-wybe-primary"
        >
          View More →
        </motion.button>
      </div>
      
      {/* Animated sparkle effect */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-1"
        animate={{ 
          background: [
            "linear-gradient(90deg, #8B5CF6, #6366F1)",
            "linear-gradient(90deg, #6366F1, #A855F7)",
            "linear-gradient(90deg, #A855F7, #8B5CF6)"
          ]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
        }}
      />
    </motion.div>
  );
};

export default MemeCoins;
