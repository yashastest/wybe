
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Info } from "lucide-react";
import { TypewriterText, RotatingTypewriterWord, SplitColorHeading } from "@/components/ui/typewriter-text";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const HeroSection = () => {
  const [showFullTagline, setShowFullTagline] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  
  const handleTypewriterComplete = () => {
    setShowFullTagline(true);
  };
  
  return (
    <section className="relative overflow-hidden pt-28 md:pt-32 pb-16 min-h-[80vh] flex items-center">
      <div className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <span className="text-orange-500 font-mono text-sm uppercase tracking-wider font-bold">Powered by Solana</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-poppins font-extrabold mt-2 leading-tight">
                <span className="text-white">Build your meme </span>
                <RotatingTypewriterWord 
                  words={["empire", "gang", "community", "kingdom", "crew"]}
                  colors={["text-orange-500", "text-blue-500", "text-green-500", "text-purple-500", "text-pink-500"]}
                  typingDelay={100}
                  deletingDelay={50}
                  pauseDuration={1500}
                  className="font-extrabold"
                />
                <span className="text-white"> in seconds 🚀</span>
              </h1>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg text-gray-300 max-w-xl"
            >
              <TypewriterText 
                text="First AI meme launchpad on Solana with bonding curves, killer tokenomics, and creator rewards."
                delay={20}
                onComplete={handleTypewriterComplete}
              />
              {showFullTagline && (
                <span className="ml-1 text-orange-500">Go from zero to hero, instantly.</span>
              )}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex flex-wrap gap-4 mt-4"
            >
              <Link to="/launch">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button className="font-poppins font-bold text-base px-8 py-6" variant="orange">
                    Launch a Meme Coin
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              </Link>
              <Link to="/package">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Button variant="blue" className="font-poppins font-bold text-base px-8 py-6">
                    Launch Package
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-8 pt-8 border-t border-white/10"
            >
              <div className="text-center md:text-left">
                <h3 className="text-2xl font-bold mb-3 text-gradient">
                  <span className="text-white">Launch in </span>
                  <span className="text-orange-500">3 seconds</span>
                  <span className="text-white">, make your coin </span>
                  <span className="text-orange-500">tradeable</span>
                  <span className="text-white"> and earn </span>
                  <span className="text-orange-500">creator rewards</span>
                </h3>
                <p className="text-gray-300">
                  We are making meme coin trading an asset class for creators
                </p>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right Column - 2D Animation */}
          <div className="flex justify-center">
            {showPlaceholder ? (
              <WybeCoinFactoryPlaceholder setShowPlaceholder={setShowPlaceholder} />
            ) : (
              <WybeCoinFactory2D />
            )}
          </div>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <motion.div 
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full opacity-20"
          style={{ 
            background: "linear-gradient(135deg, rgba(249, 115, 22, 0.3) 0%, rgba(234, 88, 12, 0.2) 100%)",
            filter: "blur(50px)"
          }}
        />
        <motion.div 
          className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-10"
          style={{ 
            background: "linear-gradient(135deg, rgba(249, 115, 22, 0.3) 0%, rgba(234, 88, 12, 0.2) 100%)",
            filter: "blur(60px)"
          }}
        />
      </div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />
    </section>
  );
};

// Placeholder component that demonstrates the animation concept with a toggle for preview
const WybeCoinFactoryPlaceholder = ({ setShowPlaceholder }) => {
  return (
    <div className="relative w-full max-w-xl h-[400px] bg-gradient-to-br from-black/80 to-orange-900/20 rounded-xl border border-orange-500/20 p-6 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-white">Wybe Coin Factory <span className="text-orange-500">Animation</span></h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowPlaceholder(false)} 
                className="hover:bg-orange-500/20"
              >
                <Info className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs">Click to view animation preview</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center gap-4">
        <div className="p-4 bg-orange-500/10 rounded-full">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-4xl animate-pulse">
            W
          </div>
        </div>
        
        <div className="max-w-md">
          <h4 className="text-lg font-bold mb-2">2D Animation Concept</h4>
          <p className="text-sm text-gray-300 mb-4">
            "Wybe Coin Factory – Powered by the People" - A side-scrolling 2D animation with meme characters operating machinery that stamps and launches Wybe coins.
          </p>
          
          <div className="flex flex-wrap justify-center gap-2 text-xs">
            <span className="px-2 py-1 bg-orange-500/20 rounded-full">Meme Characters</span>
            <span className="px-2 py-1 bg-blue-500/20 rounded-full">Factory Conveyor</span>
            <span className="px-2 py-1 bg-green-500/20 rounded-full">Coin Stamping</span>
            <span className="px-2 py-1 bg-purple-500/20 rounded-full">Rocket Launch</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// This will be replaced with the actual animation when it's ready
// For now, it shows a simple interactive preview of the concept
const WybeCoinFactory2D = () => {
  return (
    <div className="relative w-full max-w-xl h-[400px] bg-gradient-to-br from-black/80 to-orange-900/20 rounded-xl border border-orange-500/20 overflow-hidden">
      {/* Factory Background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMxLjIgMCAyLjQtLjIgMy42LS42TDQwIDYwSDIwVjQ1LjVjMC04LjMgNS4zLTE1LjUgMTMtMTggLjktLjQgMS44LS43IDIuNy0uOS44LS4xIDEuNi0uMiAyLjMtLjIiIGZpbGw9IiMzOTMzNDAiIGZpbGwtb3BhY2l0eT0iLjQiLz48cGF0aCBkPSJNMzAgMEg2MHYyMWMtNi40IDMuOS0xNC42IDYtMjMgNmgtN1YweiIgZmlsbD0iIzM5MzM0MCIgZmlsbC1vcGFjaXR5PSIuNCIvPjxwYXRoIGQ9Ik00MCA2MEgxLjRDLjUgNTUuOCAwIDUxLjIgMCA0Ni40YzAtOS43IDMuMi0xOC42IDguNi0yNS44IDUuMi03IDEyLTEyLjIgMjAtMTUuNEw0MCA2MHoiIGZpbGw9IiMzOTMzNDAiIGZpbGwtb3BhY2l0eT0iLjMiLz48L2c+PC9zdmc+')] opacity-20"></div>
      
      {/* Animation Elements */}
      <div className="absolute inset-0 p-4 flex flex-col">
        <div className="flex-1 relative">
          {/* Conveyor Belt */}
          <div className="absolute bottom-8 left-0 right-0 h-12 bg-gray-800/50 border-t border-b border-orange-500/30 overflow-hidden">
            <div className="absolute inset-0 flex items-center">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i} 
                  className="h-0.5 w-6 bg-gray-600 mx-6"
                  style={{
                    animation: 'moveRight 8s linear infinite',
                    animationDelay: `${i * 0.8}s`
                  }}
                ></div>
              ))}
            </div>
          </div>

          {/* Character 1 - Doge */}
          <motion.div 
            className="absolute bottom-20 left-10 w-12 h-12 rounded-full bg-yellow-300 flex items-center justify-center"
            animate={{ 
              y: [0, -10, 0], 
              rotate: [0, -5, 0, 5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            <span className="font-bold">D</span>
          </motion.div>
          
          {/* Character 2 - Pepe */}
          <motion.div 
            className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full bg-green-500 flex items-center justify-center"
            animate={{ 
              y: [0, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            <span className="font-bold">P</span>
          </motion.div>
          
          {/* Character 3 - Wojak */}
          <motion.div 
            className="absolute bottom-20 right-10 w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center"
            animate={{ 
              rotate: [0, 10, 0, -10, 0],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            <span className="font-bold">W</span>
          </motion.div>

          {/* Coin Stamper */}
          <motion.div
            className="absolute left-1/2 bottom-32 transform -translate-x-1/2 w-20 h-40"
            initial={{ y: -50 }}
            animate={{ 
              y: [-50, 0, -50]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            <div className="w-20 h-20 bg-gray-700 rounded-md flex items-center justify-center">
              <span className="text-orange-500 font-bold text-lg">W</span>
            </div>
            <div className="h-20 w-4 bg-gray-600 mx-auto"></div>
          </motion.div>
          
          {/* Hero Coin */}
          <motion.div 
            className="absolute top-10 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20"
            animate={{ 
              rotateY: [0, 360],
              scale: [1, 1.05, 1]
            }}
            transition={{ 
              rotateY: { duration: 8, repeat: Infinity, ease: "linear" },
              scale: { duration: 3, repeat: Infinity, repeatType: "reverse" }
            }}
          >
            <span className="font-extrabold text-2xl text-black">W</span>
          </motion.div>
          
          {/* Coin Launcher */}
          <div className="absolute bottom-20 right-0 w-20 h-16 bg-gray-700/50 rounded-l-lg border border-orange-500/30">
            {[...Array(3)].map((_, i) => (
              <motion.div 
                key={i}
                className="absolute w-6 h-6 rounded-full bg-orange-500"
                initial={{ x: 50, y: 0, opacity: 0 }}
                animate={{ 
                  x: [50, 150],
                  y: [0, -100 - i*30],
                  opacity: [0, 1, 0]
                }}
                transition={{ 
                  duration: 1.5, 
                  delay: i * 0.7,
                  repeat: Infinity,
                  repeatDelay: 2
                }}
              />
            ))}
          </div>
          
          {/* Flowing Coins */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`coin-${i}`}
              className="absolute bottom-12 w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center"
              initial={{ x: -30 }}
              animate={{ 
                x: [-30 + (i * 50), 420],
              }}
              transition={{ 
                duration: 8,
                delay: i * 1.6,
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              <span className="text-xs font-bold">W</span>
            </motion.div>
          ))}
          
          {/* "Powered By The People" Text */}
          <div className="absolute bottom-1 left-0 right-0 text-center">
            <span className="text-xs font-mono text-orange-500 tracking-wider opacity-70">POWERED BY THE PEOPLE</span>
          </div>
        </div>
      </div>
      
      {/* Meme Factory Overlay */}
      <div className="absolute top-2 left-2">
        <span className="text-xs font-mono bg-black/50 px-2 py-1 rounded text-orange-400">
          WYBE COIN FACTORY
        </span>
      </div>

      {/* Add animation styles */}
      <style jsx>{`
        @keyframes moveRight {
          from { transform: translateX(-100px); }
          to { transform: translateX(100vw); }
        }
      `}</style>
    </div>
  );
};

export default HeroSection;
