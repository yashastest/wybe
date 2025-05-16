
import React from 'react';
import { motion } from 'framer-motion';

type WybeHero3DProps = {
  className?: string;
}

/**
 * Placeholder component for the future 3D Wybe Coin Factory animation
 * This will be replaced with the actual 3D animation when it's delivered by the animator
 */
const WybeHero3D: React.FC<WybeHero3DProps> = ({ className = "" }) => {
  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Placeholder for the 3D animation */}
      <motion.div 
        className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#111122]/40 to-black/60 rounded-lg border border-orange-500/20 p-6"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: 1,
          boxShadow: ["0 0 0px rgba(249, 115, 22, 0)", "0 0 25px rgba(249, 115, 22, 0.3)", "0 0 0px rgba(249, 115, 22, 0)"]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      >
        <div className="flex flex-col items-center">
          <div className="text-center mb-4">
            <p className="text-orange-400 font-bold text-lg">Coming Soon</p>
            <h3 className="text-2xl font-bold">Wybe Coin Factory</h3>
            <p className="text-gray-400 text-sm mt-1">Powered by the People</p>
          </div>
          
          <div className="relative w-32 h-32">
            {/* Animated coin placeholder */}
            <motion.div
              className="absolute inset-0 w-32 h-32 rounded-full bg-gradient-to-br from-orange-500/80 to-amber-400/80"
              animate={{ 
                rotateY: 360,
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <div className="flex items-center justify-center w-full h-full">
                <span className="text-white text-2xl font-bold">WYBE</span>
              </div>
            </motion.div>
          </div>
          
          <p className="mt-6 text-gray-300 text-sm max-w-md text-center">
            3D animation of the Wybe Coin Factory coming soon. 
            Featuring Doge, Pepe, Wojak, and an interactive minting machine!
          </p>
        </div>
      </motion.div>
      
      {/* Animation integration instructions - can be removed in production */}
      <div className="absolute bottom-4 left-4 right-4 bg-blue-900/80 p-2 text-xs text-blue-200 rounded hidden">
        Developer note: Replace this component with the 3D animation when delivered.
        Expected formats: .webm, .mp4 or Lottie JSON.
      </div>
    </div>
  );
};

export default WybeHero3D;
