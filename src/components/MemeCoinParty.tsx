
import React from "react";
import { motion } from "framer-motion";

const MemeCoinParty = () => {
  return (
    <div className="relative h-[500px]">
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.4, 0.7, 0.4],
        }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "easeInOut", 
        }}
      />
      
      {/* Centerpiece - Exploding meme coin */}
      <motion.div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full 
                  bg-gradient-to-br from-wybe-gradient-from to-wybe-gradient-to flex items-center 
                  justify-center z-20 overflow-hidden"
        animate={{ 
          rotate: 360,
          boxShadow: [
            '0 0 25px rgba(139, 92, 246, 0.6)', 
            '0 0 50px rgba(139, 92, 246, 0.8)', 
            '0 0 25px rgba(139, 92, 246, 0.6)'
          ],
        }}
        transition={{ 
          rotate: { duration: 15, ease: "linear", repeat: Infinity },
          boxShadow: { duration: 2, repeat: Infinity },
        }}
      >
        <motion.span 
          className="text-white text-3xl font-bold z-30"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          WYBE
        </motion.span>
      </motion.div>
      
      {/* Flying meme coins */}
      {[...Array(16)].map((_, i) => (
        <FlyingCoin 
          key={i}
          symbol={['DOGE', 'PEPE', 'SHIB', 'FLOKI', 'WOJAK', 'BONK', 'SOLANA', 'MOON'][i % 8]}
          initialDelay={i * 0.3}
          size={24 + Math.random() * 16}
          speed={6 + Math.random() * 8}
        />
      ))}
      
      {/* Bursting particles */}
      {[...Array(20)].map((_, i) => (
        <BurstParticle key={i} index={i} />
      ))}
      
      {/* Emoji rain */}
      {['🚀', '💰', '🔥', '💎', '🌕', '🐶', '🐸'].map((emoji, i) => (
        <EmojiRain key={i} emoji={emoji} delay={i * 0.7} />
      ))}
      
      {/* Dollar signs rain */}
      {[...Array(10)].map((_, i) => (
        <DollarRain key={i} index={i} />
      ))}
    </div>
  );
};

// Flying meme coin animation
const FlyingCoin = ({ symbol, initialDelay, size, speed }) => {
  // Random start position and direction
  const startX = Math.random() * 1000 - 500;
  const startY = Math.random() * 1000 - 500;
  const direction = Math.random() * 360; // Random angle in degrees
  
  // Convert direction to x and y velocity
  const radians = direction * (Math.PI / 180);
  const velocityX = Math.cos(radians) * speed;
  const velocityY = Math.sin(radians) * speed;
  
  // Calculate end position based on velocity
  const endX = startX + velocityX * 50;
  const endY = startY + velocityY * 50;
  
  return (
    <motion.div
      initial={{ 
        x: startX, 
        y: startY,
        opacity: 0,
        scale: 0
      }}
      animate={{ 
        x: endX, 
        y: endY,
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0],
        rotate: 360
      }}
      transition={{ 
        duration: speed, 
        ease: "linear",
        delay: initialDelay,
        repeat: Infinity,
        repeatDelay: Math.random() * 2
      }}
      className="absolute top-1/2 left-1/2 z-10"
    >
      <div 
        className="rounded-full bg-gradient-to-br from-wybe-gradient-from to-wybe-gradient-to 
                  flex items-center justify-center font-bold text-white border-2 border-white/20"
        style={{ width: `${size}px`, height: `${size}px`, fontSize: `${size/3}px` }}
      >
        {symbol}
      </div>
    </motion.div>
  );
};

// Bursting particle effect
const BurstParticle = ({ index }) => {
  const angle = (index / 20) * 360; // Evenly distribute particles in a circle
  const distance = 100 + Math.random() * 150;
  const size = 2 + Math.random() * 6;
  const delay = Math.random() * 3;
  const duration = 2 + Math.random() * 3;
  
  // Convert angle to x and y coordinates
  const radians = angle * (Math.PI / 180);
  const x = Math.cos(radians) * distance;
  const y = Math.sin(radians) * distance;
  
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-200"
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        marginLeft: `-${size/2}px`,
        marginTop: `-${size/2}px`,
      }}
      initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
      animate={{ 
        x: x,
        y: y,
        scale: [0, 1, 0.5, 0],
        opacity: [0, 1, 0.5, 0],
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        repeatDelay: duration / 2
      }}
    />
  );
};

// Emoji rain effect
const EmojiRain = ({ emoji, delay }) => {
  const startX = Math.random() * 800 - 400;
  
  return (
    <motion.div
      className="absolute top-0 left-1/2 text-2xl md:text-3xl z-10"
      initial={{ 
        x: startX,
        y: -50,
        opacity: 0,
        rotate: -30 + Math.random() * 60
      }}
      animate={{ 
        y: 500,
        opacity: [0, 1, 1, 0],
        rotate: -30 + Math.random() * 60
      }}
      transition={{ 
        duration: 4 + Math.random() * 3,
        delay: delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 3
      }}
    >
      {emoji}
    </motion.div>
  );
};

// Dollar sign rain effect
const DollarRain = ({ index }) => {
  const startX = Math.random() * 800 - 400;
  const size = 12 + Math.random() * 16;
  const delay = Math.random() * 5;
  const duration = 4 + Math.random() * 3;
  const green = Math.floor(150 + Math.random() * 105);
  
  return (
    <motion.div
      className="absolute top-0 left-1/2 font-bold z-10"
      style={{ 
        fontSize: `${size}px`,
        color: `rgb(0, ${green}, 100)`,
      }}
      initial={{ 
        x: startX,
        y: -50,
        opacity: 0,
        rotate: -30 + Math.random() * 60
      }}
      animate={{ 
        y: 500,
        opacity: [0, 1, 1, 0],
        rotate: -30 + Math.random() * 60
      }}
      transition={{ 
        duration: duration,
        delay: delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 2
      }}
    >
      $
    </motion.div>
  );
};

export default MemeCoinParty;
