
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import MemeCoinParty from "./MemeCoinParty";

const HeroSection = () => {
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
              <span className="text-wybe-primary font-mono text-sm uppercase tracking-wider font-bold">Powered by Solana</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-poppins font-extrabold mt-2 leading-tight">
                Build your <span className="text-gradient">meme empire</span> <br className="hidden md:block" /> in seconds <span className="text-wybe-primary">🚀</span>
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg text-gray-300 max-w-xl"
            >
              First AI meme launchpad on Solana with bonding curves, killer tokenomics, and creator rewards. Go from zero to hero, instantly.
            </motion.p>
            
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
                  <Button className="btn-primary font-poppins font-bold text-base px-8 py-6 bg-gradient-to-r from-wybe-gradient-from to-wybe-gradient-to">
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
                  <Button variant="outline" className="btn-secondary font-poppins font-bold text-base px-8 py-6">
                    Launch Package
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="grid grid-cols-3 gap-8 mt-8 pt-8 border-t border-white/10"
            >
              <div>
                <h3 className="text-3xl font-jetbrains font-bold text-wybe-primary">3s</h3>
                <p className="text-sm text-gray-400 mt-1">Average Deploy Time</p>
              </div>
              <div>
                <h3 className="text-3xl font-jetbrains font-bold text-wybe-primary">247+</h3>
                <p className="text-sm text-gray-400 mt-1">Projects Launched</p>
              </div>
              <div>
                <h3 className="text-3xl font-jetbrains font-bold text-wybe-primary">$4.2M</h3>
                <p className="text-sm text-gray-400 mt-1">Total Trading Volume</p>
              </div>
            </motion.div>
          </motion.div>
          
          {/* Right Column - Meme Coin Party Animation */}
          <div className="flex justify-center">
            <MemeCoinParty />
          </div>
        </div>
      </div>
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <motion.div 
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full opacity-20"
          style={{ 
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(99, 102, 241, 0.2) 100%)",
            filter: "blur(50px)"
          }}
        />
        <motion.div 
          className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full opacity-10"
          style={{ 
            background: "linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(168, 85, 247, 0.2) 100%)",
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
