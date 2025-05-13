
import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { ChevronDown, Globe, Shield, TrendingUp, Wallet } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import HeroCoins from "@/components/HeroCoins";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
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
              <Link to="/launch">
                <Button className="btn-primary animate-pulse-glow">
                  Launch a Meme Coin
                </Button>
              </Link>
              <Link to="/package">
                <Button variant="outline" className="btn-secondary">
                  Launch Package
                </Button>
              </Link>
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
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: <Wallet />,
      title: "Create",
      description: "Launch your own meme coin in seconds. Fixed 1B supply, no coding required."
    },
    {
      icon: <TrendingUp />,
      title: "Trade",
      description: "Built-in bonding curve provides instant liquidity. No need for external DEX."
    },
    {
      icon: <Shield />,
      title: "Reward",
      description: "Earn 40% of trading fees when you reach $50K market cap and volume."
    }
  ];

  return (
    <section className="py-16 relative overflow-hidden" id="features">
      <div className="container mx-auto px-4">
        <Section>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It <span className="text-wybe-primary">Works</span></h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Wybe provides everything you need to launch, trade, and grow your meme coin.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { 
                    opacity: 1, 
                    y: 0, 
                    transition: {
                      delay: index * 0.2,
                      duration: 0.5
                    }
                  }
                }}
                className="glass-card p-6 md:p-8 flex flex-col items-center text-center hover:border-wybe-primary/30 transition-colors"
              >
                <div className="w-16 h-16 bg-wybe-primary/20 text-wybe-primary rounded-full flex items-center justify-center mb-6 animate-pulse-slow">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </Section>
      </div>
    </section>
  );
};

const CreatorFeesSection = () => {
  return (
    <section className="py-16 relative bg-gradient-to-br from-wybe-background via-wybe-background-light/50 to-wybe-background">
      <div className="container mx-auto px-4">
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
              className="glass-card p-6 bg-gradient-to-br from-purple-900/20 to-transparent"
            >
              <h3 className="text-xl font-bold mb-3">Performance Based</h3>
              <div className="text-4xl font-bold text-gradient mb-3">40%</div>
              <p className="text-gray-300 mb-4">
                Of all trading fees when your token reaches $50K market cap within 4 days and sustains it for 48 hours.
              </p>
              <div className="h-1 w-full bg-wybe-primary/30 rounded-full mb-2"></div>
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
              className="glass-card p-6 bg-gradient-to-br from-blue-900/20 to-transparent"
            >
              <h3 className="text-xl font-bold mb-3">Standard</h3>
              <div className="text-4xl font-bold text-gradient mb-3">20%</div>
              <p className="text-gray-300 mb-4">
                Of all trading fees if the $50K cap is not met, starting 7 days after launch.
              </p>
              <div className="h-1 w-full bg-wybe-primary/30 rounded-full mb-2"></div>
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
              className="glass-card p-6 bg-gradient-to-br from-green-900/20 to-transparent"
            >
              <h3 className="text-xl font-bold mb-3">Platform Fee</h3>
              <div className="text-4xl font-bold text-gradient mb-3">2.5%</div>
              <p className="text-gray-300 mb-4">
                Total fee on all trades, significantly lower than most DEXs which typically charge 3-5%.
              </p>
              <div className="h-1 w-full bg-wybe-primary/30 rounded-full mb-2"></div>
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
            <Link to="/package">
              <Button className="btn-primary animate-pulse-glow">
                Learn More About Our Launch Package
              </Button>
            </Link>
          </motion.div>
        </Section>
      </div>
    </section>
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
