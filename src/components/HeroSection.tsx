
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-16 md:pt-24 pb-16 min-h-[80vh] flex items-center">
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
                Launch your <span className="text-gradient">meme empire</span> <br className="hidden md:block" /> on Solana. <span className="text-wybe-primary">Instantly.</span>
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-lg text-gray-300 max-w-xl"
            >
              Wybe is the first fully AI-powered, Solana-based meme coin launchpad with built-in bonding curves, smart tokenomics, and creator incentives.
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
          
          {/* Right Column - 3D Model or Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
            className="flex justify-center"
          >
            <div className="relative h-[500px] w-[500px] max-w-full">
              {/* Main circular background */}
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-gradient-to-br from-purple-900/30 to-blue-900/30 backdrop-blur-xl"
                animate={{ 
                  boxShadow: [
                    "0 0 40px rgba(139, 92, 246, 0.3)", 
                    "0 0 60px rgba(139, 92, 246, 0.4)", 
                    "0 0 40px rgba(139, 92, 246, 0.3)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              
              {/* Central coin */}
              <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full bg-gradient-to-br from-wybe-gradient-from to-wybe-gradient-to flex items-center justify-center z-10 overflow-hidden"
                animate={{ 
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity, 
                  ease: "easeInOut"
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/30"
                  animate={{ 
                    rotate: [0, 360],
                  }}
                  transition={{ 
                    duration: 16, 
                    repeat: Infinity, 
                    ease: "linear"
                  }}
                />
                <span className="text-white text-5xl font-jetbrains font-black z-20">WYBE</span>
              </motion.div>
              
              {/* Orbiting coins */}
              <OrbitalCoin 
                symbol="SOL"
                distance={180}
                size={50}
                angle={0}
                duration={25}
                delay={0}
              />
              <OrbitalCoin 
                symbol="DOGE"
                distance={180}
                size={45}
                angle={72}
                duration={25}
                delay={5}
              />
              <OrbitalCoin 
                symbol="PEPE"
                distance={180}
                size={40}
                angle={144}
                duration={25}
                delay={10}
              />
              <OrbitalCoin 
                symbol="SHIB"
                distance={180}
                size={35}
                angle={216}
                duration={25}
                delay={15}
              />
              <OrbitalCoin 
                symbol="FLOKI"
                distance={180}
                size={30}
                angle={288}
                duration={25}
                delay={20}
              />
              
              {/* Decorative elements */}
              <motion.div
                className="absolute top-[10%] right-[10%] w-20 h-20 rounded-full bg-wybe-primary/10 backdrop-blur-md"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.4, 0.7, 0.4]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-[15%] left-[15%] w-16 h-16 rounded-full bg-blue-500/10 backdrop-blur-md"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              />
              <motion.div
                className="absolute top-[20%] left-[20%] w-12 h-12 rounded-full bg-violet-500/10 backdrop-blur-md"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              />
            </div>
          </motion.div>
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

// Orbital coin component for the hero section
const OrbitalCoin = ({ symbol, distance, size, angle, duration, delay }) => {
  const orbitRadius = distance;
  const initialX = Math.cos((angle * Math.PI) / 180) * orbitRadius;
  const initialY = Math.sin((angle * Math.PI) / 180) * orbitRadius;
  
  return (
    <motion.div
      className="absolute top-1/2 left-1/2 z-20"
      style={{ 
        marginTop: -size/2,
        marginLeft: -size/2,
        x: initialX,
        y: initialY,
      }}
      animate={{
        x: [
          initialX,
          Math.cos(((angle + 90) * Math.PI) / 180) * orbitRadius,
          Math.cos(((angle + 180) * Math.PI) / 180) * orbitRadius,
          Math.cos(((angle + 270) * Math.PI) / 180) * orbitRadius,
          initialX,
        ],
        y: [
          initialY,
          Math.sin(((angle + 90) * Math.PI) / 180) * orbitRadius,
          Math.sin(((angle + 180) * Math.PI) / 180) * orbitRadius,
          Math.sin(((angle + 270) * Math.PI) / 180) * orbitRadius,
          initialY,
        ],
      }}
      transition={{
        duration: duration,
        ease: "linear",
        delay: delay,
        repeat: Infinity,
      }}
    >
      <motion.div 
        className="flex items-center justify-center rounded-full bg-gradient-to-br from-wybe-gradient-from/80 to-wybe-gradient-to/80 shadow-glow-md"
        style={{ width: `${size}px`, height: `${size}px` }}
        animate={{ rotate: 360 }}
        transition={{ duration: 15, ease: "linear", repeat: Infinity }}
      >
        <span className="text-white text-xs font-jetbrains font-bold">{symbol}</span>
      </motion.div>
    </motion.div>
  );
};

export default HeroSection;
