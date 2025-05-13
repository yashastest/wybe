
import React from "react";
import { motion } from "framer-motion";

const HeroCoins = () => {
  return (
    <div className="relative h-96">
      {/* Large center coin */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
      >
        <div className="w-48 h-48 rounded-full bg-gradient-to-br from-wybe-gradient-from to-wybe-gradient-to shadow-glow-lg flex items-center justify-center">
          <span className="text-white text-4xl font-bold">WYBE</span>
        </div>
      </motion.div>
      
      {/* Smaller floating coins */}
      <CoinFloat 
        size={32}
        symbol="SOL"
        top="10%"
        left="10%"
        delay={0.2}
        className="bg-wybe-primary/80" 
      />
      <CoinFloat 
        size={40}
        symbol="DOGE"
        top="15%"
        right="15%"
        delay={0.4}
        className="bg-purple-600/80" 
      />
      <CoinFloat 
        size={28}
        symbol="PEPE"
        bottom="25%"
        left="8%"
        delay={0.6}
        className="bg-violet-500/80" 
      />
      <CoinFloat 
        size={36}
        symbol="SHIB"
        bottom="20%"
        right="10%"
        delay={0.8}
        className="bg-indigo-600/80" 
      />
      <CoinFloat 
        size={24}
        symbol="FLOKI"
        top="50%"
        left="20%"
        delay={1.0}
        className="bg-violet-700/80" 
      />
      
      {/* Background glow */}
      <div className="absolute inset-0 rounded-full bg-wybe-primary/10 blur-3xl transform -translate-y-8"></div>
    </div>
  );
};

interface CoinFloatProps {
  size: number;
  symbol: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  delay: number;
  className: string;
}

const CoinFloat = ({ size, symbol, top, bottom, left, right, delay, className }: CoinFloatProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="absolute"
      style={{ top, bottom, left, right }}
    >
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: delay * 2
        }}
      >
        <div 
          className={`rounded-full flex items-center justify-center border border-white/20 shadow-glow-sm ${className}`}
          style={{ width: `${size}px`, height: `${size}px` }}
        >
          <span className="text-white text-xs font-bold">{symbol}</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HeroCoins;
