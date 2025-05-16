
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import MemeCoinParty from "./MemeCoinParty";
import { TypewriterText, TypewriterHeading, SplitColorHeading, RotatingTypewriterWord } from "@/components/ui/typewriter-text";

// Placeholder for the 2D Wybe Meme Mint factory animation
const WybeMemeFactoryPlaceholder = () => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="relative w-full h-full min-h-[400px] flex items-center justify-center">
      {showPreview ? (
        // Animation preview placeholder - to be replaced with actual animation
        <WybeMemeFactory2D />
      ) : (
        // Description of the animation concept
        <div className="bg-gradient-to-br from-black/40 to-purple-900/20 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30 text-center">
          <h3 className="text-xl font-bold text-orange-400 mb-3">Wybe Meme Mint Animation</h3>
          <p className="text-gray-300 mb-4">2D factory animation where meme characters (Doge, Pepe, Wojak) create Wybe coins on a conveyor belt.</p>
          <Button 
            variant="outline" 
            className="border-orange-500/50 text-orange-400 hover:bg-orange-500/20"
            onClick={() => setShowPreview(true)}
          >
            Show Preview
          </Button>
        </div>
      )}
    </div>
  );
};

// Interactive preview of the 2D animation concept
const WybeMemeFactory2D = () => {
  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
      {/* Factory Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-black/60 rounded-xl border border-purple-500/20"></div>
      
      {/* Conveyor Belt */}
      <div className="absolute bottom-10 left-0 right-0 h-12 bg-gray-800/50 border-t border-b border-gray-600/50"></div>
      
      {/* Input Tube - Left Side */}
      <div className="absolute left-4 top-1/4 bottom-10 w-12 bg-gray-700/50 rounded-t-full border border-gray-600/30">
        <div className="absolute top-0 left-0 right-0 h-8 flex justify-center items-start">
          <div className="animate-bounce h-4 w-4 bg-orange-500 rounded-full"></div>
        </div>
      </div>
      
      {/* Meme Characters - Will be animated */}
      <div className="absolute left-1/4 bottom-16 animate-pulse">
        <div className="h-12 w-12 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold">
          D
        </div>
        <div className="mt-1 text-xs text-center text-gray-300">Doge</div>
      </div>
      
      <div className="absolute left-1/2 bottom-16 transform -translate-x-1/2 animate-pulse">
        <div className="h-12 w-12 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
          P
        </div>
        <div className="mt-1 text-xs text-center text-gray-300">Pepe</div>
      </div>
      
      <div className="absolute right-1/4 bottom-16 animate-pulse">
        <div className="h-12 w-12 rounded-full bg-blue-400 flex items-center justify-center text-white font-bold">
          W
        </div>
        <div className="mt-1 text-xs text-center text-gray-300">Wojak</div>
      </div>
      
      {/* Stamping Machine */}
      <div className="absolute left-1/2 top-12 transform -translate-x-1/2 w-20 h-32 bg-gray-700/70 rounded-t-lg border border-gray-600/50">
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gray-800/70 flex items-center justify-center text-xs text-orange-300">
          WYBE STAMP
        </div>
        <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 h-16 w-4 bg-gray-600 animate-pulse"></div>
      </div>
      
      {/* Coins on Conveyor */}
      <div className="absolute bottom-6 left-1/4 h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-yellow-600 border-2 border-orange-300 animate-pulse"></div>
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-yellow-600 border-2 border-orange-300"></div>
      
      {/* Coin Launcher - Right Side */}
      <div className="absolute right-4 bottom-10 w-16 h-24 bg-gray-700/50 rounded-t-lg border border-gray-600/30"></div>
      
      {/* Hero Coin - Center */}
      <div className="absolute left-1/2 top-1/3 transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
        <div className="h-24 w-24 rounded-full bg-gradient-to-br from-orange-400 to-yellow-600 border-4 border-orange-300 shadow-lg shadow-orange-500/30 flex items-center justify-center">
          <span className="font-bold text-white text-2xl">W</span>
        </div>
      </div>
      
      {/* Animation Control */}
      <div className="absolute bottom-2 right-2">
        <Button 
          variant="ghost" 
          size="sm"
          className="text-xs text-gray-400"
          onClick={(e) => e.currentTarget.closest('.w-full')?.classList.toggle('animate-pulse')}
        >
          Toggle Animation
        </Button>
      </div>
    </div>
  );
};

const HeroSection = () => {
  const [showFullTagline, setShowFullTagline] = useState(false);
  
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
          
          {/* Right Column - Animation */}
          <div className="flex justify-center">
            <WybeMemeFactoryPlaceholder />
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

export default HeroSection;
