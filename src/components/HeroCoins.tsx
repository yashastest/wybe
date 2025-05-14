
import React from "react";
import { motion } from "framer-motion";

const HeroCoins = () => {
  return (
    <div className="relative h-72 md:h-96 w-full overflow-hidden">
      {/* Background glow effects */}
      <motion.div
        className="absolute inset-0 rounded-full bg-wybe-primary/10 blur-3xl"
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity, 
          repeatType: "reverse",
          ease: "easeInOut", 
        }}
      />
      
      {/* Solana logo center */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
      >
        <motion.div
          animate={{ 
            boxShadow: [
              '0 0 15px rgba(249, 115, 22, 0.4)', 
              '0 0 30px rgba(249, 115, 22, 0.7)', 
              '0 0 15px rgba(249, 115, 22, 0.4)'
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-wybe-primary to-amber-500/80 flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ 
              duration: 12, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="w-full h-full rounded-full overflow-hidden flex items-center justify-center relative"
          >
            <span className="absolute text-white text-2xl md:text-3xl font-bold z-10">SOL</span>
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10" />
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
      
      {/* Trading-related floating elements */}
      <CoinFloat 
        size={24}
        md_size={32}
        symbol="SOL"
        top="15%"
        left="15%"
        delay={0.2}
        className="bg-gradient-to-br from-orange-500 to-amber-400" 
      />
      <CoinFloat 
        size={30}
        md_size={40}
        symbol="WYBE"
        top="20%"
        right="20%"
        delay={0.4}
        className="bg-gradient-to-br from-wybe-primary to-orange-300" 
      />
      <CoinFloat 
        size={22}
        md_size={28}
        symbol="MEME"
        bottom="25%"
        left="18%"
        delay={0.6}
        className="bg-gradient-to-br from-amber-500 to-yellow-300" 
      />
      <CoinFloat 
        size={28}
        md_size={36}
        symbol="TRADE"
        bottom="20%"
        right="15%"
        delay={0.8}
        className="bg-gradient-to-br from-orange-600 to-orange-400" 
      />
      
      {/* Add chart line animation */}
      <motion.div 
        className="absolute bottom-10 left-5 right-5 h-10 md:h-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <svg width="100%" height="100%" viewBox="0 0 200 50">
          <motion.path
            d="M0,25 C20,40 40,10 60,25 C80,40 100,10 120,25 C140,40 160,10 180,25 C190,15 200,25 200,25"
            fill="none"
            stroke="#F97316"
            strokeWidth="2"
            strokeDasharray="300"
            strokeDashoffset="300"
            initial={{ strokeDashoffset: 300 }}
            animate={{ strokeDashoffset: 0 }}
            transition={{
              duration: 3,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
              repeatDelay: 1
            }}
          />
          <motion.circle
            cx="200"
            cy="25"
            r="3"
            fill="#F97316"
            initial={{ x: -200 }}
            animate={{ x: 0 }}
            transition={{
              duration: 3,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop",
              repeatDelay: 1
            }}
          />
        </svg>
      </motion.div>
    </div>
  );
};

interface CoinFloatProps {
  size: number;
  md_size: number;
  symbol: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  delay: number;
  className: string;
}

const CoinFloat = ({ size, md_size, symbol, top, bottom, left, right, delay, className }: CoinFloatProps) => {
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
          y: [0, -10, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: delay * 2,
          times: [0, 0.5, 1]
        }}
      >
        <motion.div 
          className={`rounded-full flex items-center justify-center border border-white/20 ${className}`}
          style={{ 
            width: `${size}px`, 
            height: `${size}px`,
            '@media (min-width: 768px)': {
              width: `${md_size}px`,
              height: `${md_size}px`,
            }
          }}
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
