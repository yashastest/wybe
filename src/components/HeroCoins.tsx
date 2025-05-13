
import React from "react";
import { motion } from "framer-motion";

const HeroCoins = () => {
  return (
    <div className="relative h-96">
      {/* Background glow effects */}
      <motion.div
        className="absolute inset-0 rounded-full bg-wybe-primary/10 blur-3xl"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.6, 0.8, 0.6],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          repeatType: "reverse",
          ease: "easeInOut", 
        }}
      />
      
      {/* Large center coin */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
      >
        <motion.div
          animate={{ 
            boxShadow: [
              '0 0 15px rgba(139, 92, 246, 0.4)', 
              '0 0 30px rgba(139, 92, 246, 0.7)', 
              '0 0 15px rgba(139, 92, 246, 0.4)'
            ],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          className="w-48 h-48 rounded-full bg-gradient-to-br from-wybe-gradient-from to-wybe-gradient-to flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 20, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="w-full h-full rounded-full overflow-hidden flex items-center justify-center relative"
          >
            <span className="absolute text-white text-4xl font-bold z-10">WYBE</span>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10" />
            </div>
          </motion.div>
        </motion.div>
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
        animate={{ 
          y: [0, -15, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: delay * 2,
          times: [0, 0.5, 1]
        }}
      >
        <motion.div 
          className={`rounded-full flex items-center justify-center border border-white/20 ${className}`}
          style={{ width: `${size}px`, height: `${size}px` }}
          animate={{ 
            boxShadow: [
              '0 0 5px rgba(255,255,255,0.2)', 
              '0 0 10px rgba(255,255,255,0.4)', 
              '0 0 5px rgba(255,255,255,0.2)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity, delay: delay }}
        >
          <span className="text-white text-xs font-bold">{symbol}</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default HeroCoins;
