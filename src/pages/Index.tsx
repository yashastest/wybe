import React from "react";
import { motion } from "framer-motion";
import { ChevronDown, Globe, Shield, TrendingUp, Wallet } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TrendingCoins from "@/components/TrendingCoins";
import { Button } from "@/components/ui/button";
import HeroCoins from "@/components/HeroCoins";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 md:pt-24 pb-16">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="flex-1 max-w-2xl"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4">
                Launch your <span className="text-gradient">meme empire</span> on Solana. <span className="text-wybe-primary">Instantly.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                Wybe is the first fully AI-powered, Solana-based meme coin launchpad with built-in bonding curves, smart tokenomics, and creator incentives.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="btn-primary">
                  Launch a Meme Coin
                </Button>
                <Button variant="outline" className="btn-secondary">
                  Explore Trending Coins
                </Button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex-1 relative"
            >
              <HeroCoins />
            </motion.div>
          </div>
        </div>
        
        {/* Subtle scroll indicator */}
        <motion.div 
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 cursor-pointer"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.5 }}
          whileHover={{ y: 5 }}
        >
          <ChevronDown className="text-wybe-primary animate-bounce" />
        </motion.div>
        
        {/* Background gradient effect */}
        <div className="absolute top-40 right-20 w-96 h-96 bg-wybe-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-wybe-accent/20 rounded-full blur-3xl" />
      </section>
      
      {/* Features Section */}
      <section className="py-16 relative overflow-hidden" id="features">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It <span className="text-wybe-primary">Works</span></h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Wybe provides everything you need to launch, trade, and grow your meme coin.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            <FeatureCard 
              icon={<Wallet />}
              title="Create"
              description="Launch your own meme coin in seconds. Fixed 1B supply, no coding required."
              delay={0}
            />
            <FeatureCard 
              icon={<TrendingUp />}
              title="Trade"
              description="Built-in bonding curve provides instant liquidity. No need for external DEX."
              delay={0.2}
            />
            <FeatureCard 
              icon={<Shield />}
              title="Reward"
              description="Earn 40% of trading fees when you reach $50K market cap and volume."
              delay={0.4}
            />
          </div>
        </div>
      </section>
      
      {/* Trending Coins Section */}
      <section className="py-16 relative">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trending <span className="text-wybe-primary">Coins</span></h2>
            <p className="text-xl text-gray-300">
              The hottest meme coins on the platform right now.
            </p>
          </motion.div>
          
          <TrendingCoins />
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay }}
      className="glass-card p-6 md:p-8 flex flex-col items-center text-center"
    >
      <div className="w-16 h-16 bg-wybe-primary/20 text-wybe-primary rounded-full flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </motion.div>
  );
};

export default Index;
