
import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { ChevronDown, Globe, Shield, TrendingUp, Wallet, Rocket, CircleDollarSign } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import RocketLaunch from "@/components/RocketLaunch";
import { Link } from "react-router-dom";
import MemeCoins from "@/components/MemeCoins";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black overflow-x-hidden">
      <Header />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Meme Coins Section - replacing Features */}
      <MemeCoins />
      
      {/* Creator Fees Section */}
      <CreatorFeesSection />
      
      <Footer />
    </div>
  );
};

const Section = ({ children, className = "" }) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);
  
  return (
    <motion.div 
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.2 } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-16 md:pt-24 pb-16">
      <div className="container relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              duration: 0.7,
              type: "spring",
              stiffness: 100
            }}
            className="flex-1 max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
              Launch your <motion.span 
                className="text-gradient inline-block"
                animate={{ 
                  scale: [1, 1.03, 1],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse" 
                }}
              >meme empire</motion.span> on Solana. <span className="text-wybe-primary">Instantly.</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Wybe is the first fully AI-powered, Solana-based meme coin launchpad with built-in bonding curves, smart tokenomics, and creator incentives.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/launch">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="btn-primary animate-pulse-glow relative overflow-hidden group">
                    <motion.span
                      className="absolute inset-0 bg-white/10 w-full"
                      animate={{ 
                        x: ["-100%", "100%"],
                        opacity: [0, 0.5, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                        times: [0, 0.5, 1]
                      }}
                    />
                    Launch a Meme Coin
                  </Button>
                </motion.div>
              </Link>
              <Link to="/package">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button variant="outline" className="btn-secondary">
                    Launch Package
                  </Button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex-1 relative"
          >
            <RocketLaunch />
          </motion.div>
        </div>
      </div>
      
      {/* Enhanced scroll indicator with pulse effect */}
      <motion.div 
        className="absolute bottom-4 left-1/2 transform -translate-x-1/2 cursor-pointer z-10"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        whileHover={{ y: 5 }}
      >
        <motion.div
          animate={{ 
            y: [0, 10, 0],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="bg-wybe-primary/20 p-2 rounded-full"
        >
          <ChevronDown className="text-wybe-primary" />
        </motion.div>
      </motion.div>
      
      {/* Enhanced background gradient effects */}
      <motion.div 
        className="absolute top-40 right-20 w-96 h-96 rounded-full blur-3xl"
        animate={{ 
          background: [
            "rgba(139, 92, 246, 0.1)",
            "rgba(168, 85, 247, 0.15)",
            "rgba(139, 92, 246, 0.1)"
          ],
          scale: [1, 1.2, 1]
        }}
        transition={{ 
          duration: 8,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
      
      <motion.div 
        className="absolute bottom-20 left-20 w-64 h-64 rounded-full blur-3xl"
        animate={{ 
          background: [
            "rgba(99, 102, 241, 0.1)",
            "rgba(139, 92, 246, 0.15)",
            "rgba(99, 102, 241, 0.1)"
          ],
          scale: [1, 1.3, 1]
        }}
        transition={{ 
          duration: 10,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1
        }}
      />
    </section>
  );
};

const CreatorFeesSection = () => {
  return (
    <section className="py-16 relative bg-gradient-to-br from-black via-wybe-background-light/10 to-black overflow-hidden">
      <div className="container">
        <Section>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Creator <span className="gradient-text">Fee Structure</span></h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We reward creators who build sustainable meme coins with a generous fee-sharing model.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  transition: { delay: 0.1, duration: 0.5 }
                }
              }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 20px 40px -5px rgba(139, 92, 246, 0.2)"
              }}
              className="glass-card p-6 bg-gradient-to-br from-purple-900/20 to-transparent relative overflow-hidden group"
            >
              {/* Animated gradient border */}
              <motion.div 
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ 
                  background: "linear-gradient(to right, transparent, rgba(139, 92, 246, 0.2), transparent)",
                  backgroundSize: "200% 100%"
                }}
                animate={{ 
                  backgroundPosition: ["0% 0%", "200% 0%"] 
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold">Performance Based</h3>
                <div className="bg-wybe-primary/20 p-2 rounded-full">
                  <Rocket size={18} className="text-wybe-primary" />
                </div>
              </div>
              <motion.div 
                className="text-4xl font-bold text-gradient mb-3"
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
              >
                40%
              </motion.div>
              <p className="text-gray-300 mb-4">
                Of all trading fees when your token reaches $50K market cap within 4 days and sustains it for 48 hours.
              </p>
              <div className="h-1 w-full bg-wybe-primary/30 rounded-full mb-2 overflow-hidden">
                <motion.div 
                  className="h-full bg-wybe-primary"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "90%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  viewport={{ once: true }}
                />
              </div>
              <p className="text-sm text-gray-400">High performance reward tier</p>
            </motion.div>
            
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  transition: { delay: 0.2, duration: 0.5 }
                }
              }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 20px 40px -5px rgba(99, 102, 241, 0.2)"
              }}
              className="glass-card p-6 bg-gradient-to-br from-blue-900/20 to-transparent relative overflow-hidden group"
            >
              {/* Animated gradient border */}
              <motion.div 
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ 
                  background: "linear-gradient(to right, transparent, rgba(99, 102, 241, 0.2), transparent)",
                  backgroundSize: "200% 100%"
                }}
                animate={{ 
                  backgroundPosition: ["0% 0%", "200% 0%"] 
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold">Standard</h3>
                <div className="bg-wybe-primary/20 p-2 rounded-full">
                  <CircleDollarSign size={18} className="text-wybe-primary" />
                </div>
              </div>
              <motion.div 
                className="text-4xl font-bold text-gradient mb-3"
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 0.5
                }}
              >
                20%
              </motion.div>
              <p className="text-gray-300 mb-4">
                Of all trading fees if the $50K cap is not met, starting 7 days after launch.
              </p>
              <div className="h-1 w-full bg-wybe-primary/30 rounded-full mb-2 overflow-hidden">
                <motion.div 
                  className="h-full bg-wybe-primary"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "60%" }}
                  transition={{ duration: 1, delay: 0.7 }}
                  viewport={{ once: true }}
                />
              </div>
              <p className="text-sm text-gray-400">Default reward tier</p>
            </motion.div>
            
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  transition: { delay: 0.3, duration: 0.5 }
                }
              }}
              whileHover={{ 
                y: -5,
                boxShadow: "0 20px 40px -5px rgba(52, 211, 153, 0.2)"
              }}
              className="glass-card p-6 bg-gradient-to-br from-green-900/20 to-transparent relative overflow-hidden group"
            >
              {/* Animated gradient border */}
              <motion.div 
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ 
                  background: "linear-gradient(to right, transparent, rgba(52, 211, 153, 0.2), transparent)",
                  backgroundSize: "200% 100%"
                }}
                animate={{ 
                  backgroundPosition: ["0% 0%", "200% 0%"] 
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
              
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold">Platform Fee</h3>
                <div className="bg-wybe-primary/20 p-2 rounded-full">
                  <CircleDollarSign size={18} className="text-wybe-primary" />
                </div>
              </div>
              <motion.div 
                className="text-4xl font-bold text-gradient mb-3"
                animate={{ 
                  scale: [1, 1.05, 1],
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                  delay: 1
                }}
              >
                2.5%
              </motion.div>
              <p className="text-gray-300 mb-4">
                Total fee on all trades, significantly lower than most DEXs which typically charge 3-5%.
              </p>
              <div className="h-1 w-full bg-wybe-primary/30 rounded-full mb-2 overflow-hidden">
                <motion.div 
                  className="h-full bg-wybe-primary"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "40%" }}
                  transition={{ duration: 1, delay: 0.9 }}
                  viewport={{ once: true }}
                />
              </div>
              <p className="text-sm text-gray-400">Applied to all transactions</p>
            </motion.div>
          </div>
          
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { 
                opacity: 1, 
                scale: 1, 
                transition: { delay: 0.4, duration: 0.5 }
              }
            }}
            className="text-center"
          >
            <Link to="/launch">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button className="btn-primary animate-pulse-glow">
                  Apply for Whitelist
                </Button>
              </motion.div>
            </Link>
          </motion.div>
          
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1, 
                transition: { delay: 0.5, duration: 0.5 }
              }
            }}
            className="mt-16 glass-card p-6 md:p-8 backdrop-blur-lg"
          >
            <h3 className="text-2xl font-bold mb-4 text-center">The Wybe <span className="text-gradient">Advantage</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                className="flex items-start gap-3"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="mt-1 bg-wybe-primary/20 p-2 rounded-full">
                  <Shield size={16} className="text-wybe-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Enhanced Security</h4>
                  <p className="text-sm text-gray-300">All smart contracts are audited and secured, protecting both creators and investors.</p>
                </div>
              </motion.div>
              <motion.div 
                className="flex items-start gap-3"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="mt-1 bg-wybe-primary/20 p-2 rounded-full">
                  <TrendingUp size={16} className="text-wybe-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Instant Liquidity</h4>
                  <p className="text-sm text-gray-300">No need to wait for liquidity providers. Trade instantly with the built-in bonding curve.</p>
                </div>
              </motion.div>
              <motion.div 
                className="flex items-start gap-3"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="mt-1 bg-wybe-primary/20 p-2 rounded-full">
                  <Wallet size={16} className="text-wybe-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Passive Income</h4>
                  <p className="text-sm text-gray-300">Earn 40% of all trading fees as long as your token maintains active trading volume.</p>
                </div>
              </motion.div>
              <motion.div 
                className="flex items-start gap-3"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="mt-1 bg-wybe-primary/20 p-2 rounded-full">
                  <Globe size={16} className="text-wybe-primary" />
                </div>
                <div>
                  <h4 className="text-lg font-medium mb-1">Global Reach</h4>
                  <p className="text-sm text-gray-300">Tap into the growing Solana ecosystem with millions of active users worldwide.</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </Section>
      </div>
      
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-0 right-0 w-1/3 h-screen opacity-10"
        style={{ 
          background: "linear-gradient(135deg, transparent 0%, rgba(139, 92, 246, 0.1) 100%)"
        }}
        animate={{
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </section>
  );
};

export default Index;
