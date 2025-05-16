
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const MemeMultiverseMachine = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Animation states for different elements
  const portalVariants = {
    animate: {
      scale: [0.8, 1.2, 1],
      rotate: [0, 180, 360],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }
    }
  };
  
  const memeVariants = {
    initial: { scale: 0, opacity: 0, y: -50 },
    animate: (custom: number) => ({
      scale: [0, 1.2, 1],
      opacity: [0, 1, 0.8],
      y: [custom * -50, 0, custom * 20],
      transition: {
        delay: custom * 0.5,
        duration: 2,
        repeat: Infinity,
        repeatDelay: 6
      }
    })
  };
  
  const coinVariants = {
    initial: { scale: 0, opacity: 0, rotate: 0 },
    animate: {
      scale: [0, 1.2, 1],
      opacity: [0, 1, 1],
      rotate: [0, 360, 720],
      transition: {
        delay: 4,
        duration: 3,
        repeat: Infinity,
        repeatDelay: 5
      }
    }
  };
  
  const glowVariants = {
    animate: {
      opacity: [0.4, 0.8, 0.4],
      scale: [0.8, 1.2, 0.8],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }
    }
  };
  
  const machineVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        delay: 1,
        duration: 1
      }
    }
  };
  
  const landscapeVariants = {
    animate: {
      y: [-5, 5, -5],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      }
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Background - cosmic meme landscape */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        variants={landscapeVariants}
        animate="animate"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-black to-blue-900/20 z-0" />
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-purple-500/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-500/10 to-transparent" />
      </motion.div>
      
      {/* Portal - meme vortex */}
      <motion.div
        className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-gradient-to-r from-purple-500/80 via-orange-500/50 to-blue-500/80 blur-md z-10"
        variants={portalVariants}
        animate="animate"
      />
      
      {/* Meme fragments swirling in */}
      <motion.div 
        className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full border-4 border-white/20 flex items-center justify-center overflow-hidden z-20"
        variants={portalVariants}
        animate="animate"
      >
        <div className="absolute inset-2 rounded-full bg-black/50 backdrop-blur-sm" />
        
        {/* Meme elements */}
        <motion.div
          className="absolute w-10 h-10 bg-yellow-300 rounded-full"
          variants={memeVariants}
          initial="initial"
          animate="animate"
          custom={1}
        >
          {/* Doge face */}
          <div className="w-full h-full flex items-center justify-center text-lg">🐕</div>
        </motion.div>
        
        <motion.div
          className="absolute w-8 h-8 bg-green-400 rounded-md"
          variants={memeVariants}
          initial="initial"
          animate="animate"
          custom={2}
        >
          {/* Pepe */}
          <div className="w-full h-full flex items-center justify-center text-lg">🐸</div>
        </motion.div>
        
        <motion.div
          className="absolute w-9 h-9 bg-blue-300 rounded-full"
          variants={memeVariants}
          initial="initial"
          animate="animate"
          custom={1.5}
        >
          {/* Wojak */}
          <div className="w-full h-full flex items-center justify-center text-lg">🧔</div>
        </motion.div>
      </motion.div>
      
      {/* Wybe Engine - The machine */}
      <motion.div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/4 w-60 h-40 rounded-xl bg-gradient-to-b from-gray-800 to-gray-900 border border-orange-500/50 flex flex-col items-center z-20"
        variants={machineVariants}
        initial="initial"
        animate="animate"
      >
        <div className="text-xs font-mono font-bold text-orange-500 mt-2 px-3 py-1 bg-black/50 rounded-md">WYBE ENGINE</div>
        
        {/* Machine lights and details */}
        <div className="flex justify-between w-full px-4 mt-2">
          <motion.div 
            className="w-3 h-3 rounded-full bg-green-500"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <motion.div 
            className="w-3 h-3 rounded-full bg-blue-500"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.3, repeat: Infinity }}
          />
          <motion.div 
            className="w-3 h-3 rounded-full bg-red-500"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 0.7, repeat: Infinity }}
          />
        </div>
        
        {/* Processing window */}
        <div className="w-48 h-16 bg-black/60 mt-3 rounded-md border border-gray-700 relative overflow-hidden">
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{
              background: [
                'linear-gradient(90deg, rgba(255,105,180,0.3) 0%, rgba(255,223,0,0.3) 100%)',
                'linear-gradient(90deg, rgba(46,191,145,0.3) 0%, rgba(70,252,242,0.3) 100%)',
                'linear-gradient(90deg, rgba(255,105,180,0.3) 0%, rgba(255,223,0,0.3) 100%)'
              ]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          
          {/* Processing animation */}
          <div className="relative w-full h-full flex items-center justify-center">
            <motion.div
              className="h-0.5 w-full bg-orange-500/50 absolute top-1/2"
              animate={{ left: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
          </div>
        </div>
        
        {/* Launch pad */}
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-16 h-6 bg-gradient-to-t from-gray-800 to-gray-900 border-t border-orange-500/30 rounded-b-lg" />
      </motion.div>
      
      {/* Final Wybe Coin */}
      <motion.div 
        className="absolute top-3/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-gradient-to-r from-orange-500 via-yellow-500 to-orange-400 flex items-center justify-center z-30"
        variants={coinVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div 
          className="absolute inset-0 rounded-full bg-orange-500 opacity-50 blur-md"
          variants={glowVariants}
          animate="animate"
        />
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 border-4 border-orange-300/80 flex items-center justify-center">
          <span className="text-white font-bold text-2xl font-mono">W</span>
        </div>
      </motion.div>
      
      {/* Particles and effects */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{ 
              x: Math.random() * 100 - 50 + '%',
              y: Math.random() * 100 - 50 + '%',
              opacity: 0 
            }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              repeatDelay: Math.random() * 3,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default MemeMultiverseMachine;
