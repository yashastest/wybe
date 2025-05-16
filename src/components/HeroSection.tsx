
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import MemeMultiverseMachine from "./MemeMultiverseMachine";
import { TypewriterText, TypewriterHeading, SplitColorHeading, RotatingTypewriterWord } from "@/components/ui/typewriter-text";

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
          
          {/* Right Column - Animation - Now MemeMultiverseMachine */}
          <div className="flex justify-center h-96">
            <MemeMultiverseMachine />
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
