
import React from "react";
import { motion } from "framer-motion";
import { Star, Rocket } from "lucide-react";

const RocketLaunch = () => {
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
      
      {/* Center rocket */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 100 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 1.2 }}
        className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
      >
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 2, 0, -2, 0],
          }}
          transition={{ 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut", 
          }}
          className="relative"
        >
          <div className="flex flex-col items-center justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut", 
              }}
            >
              <Rocket size={80} className="text-wybe-primary mb-2 rotate-[315deg]" />
            </motion.div>
            <motion.div
              animate={{ 
                opacity: [0.5, 1, 0.5],
                width: ["100%", "200%", "100%"],
                height: ["100%", "200%", "100%"],
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut", 
              }}
              className="w-16 h-16 bg-wybe-primary/40 rounded-full blur-xl absolute bottom-0 -z-10"
            />
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut", 
              }}
              className="bg-gradient-to-br from-wybe-gradient-from to-wybe-gradient-to py-2 px-4 rounded-full shadow-glow-md text-white font-bold"
            >
              WYBE
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Floating coins with emoji faces */}
      <FloatingMeme 
        emoji="🐶"
        top="15%"
        left="20%"
        size={50}
        delay={0.2}
        duration={5}
      />
      <FloatingMeme 
        emoji="🐸"
        top="25%"
        right="20%"
        size={40}
        delay={0.7}
        duration={7}
      />
      <FloatingMeme 
        emoji="🦊"
        bottom="25%"
        left="25%"
        size={45}
        delay={1.1}
        duration={6}
      />
      <FloatingMeme 
        emoji="🦆"
        bottom="20%"
        right="22%"
        size={35}
        delay={0.5}
        duration={8}
      />
      
      {/* Stars */}
      {[...Array(20)].map((_, i) => (
        <FloatingStar 
          key={i}
          top={`${Math.random() * 90}%`}
          left={`${Math.random() * 90}%`}
          size={Math.random() * 8 + 2}
          delay={Math.random() * 5}
          duration={Math.random() * 10 + 10}
        />
      ))}
    </div>
  );
};

interface FloatingMemeProps {
  emoji: string;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size: number;
  delay: number;
  duration: number;
}

const FloatingMeme = ({ emoji, top, bottom, left, right, size, delay, duration }: FloatingMemeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay }}
      className="absolute"
      style={{ top, bottom, left, right }}
    >
      <motion.div
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 5, 0, -5, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{ 
          duration, 
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut",
          delay: delay * 2,
        }}
      >
        <motion.div 
          className="rounded-full flex items-center justify-center border border-white/20 bg-black/50 backdrop-blur-sm overflow-hidden"
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
          <span className="text-2xl" style={{ fontSize: `${size/2}px` }}>{emoji}</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

interface FloatingStarProps {
  top: string;
  left: string;
  size: number;
  delay: number;
  duration: number;
}

const FloatingStar = ({ top, left, size, delay, duration }: FloatingStarProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 0] }}
      transition={{ 
        duration,
        repeat: Infinity,
        delay,
        ease: "easeInOut",
      }}
      className="absolute"
      style={{ top, left }}
    >
      <Star size={size} className="text-white/70" />
    </motion.div>
  );
};

export default RocketLaunch;
