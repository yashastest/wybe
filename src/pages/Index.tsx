import React, { useEffect, useRef } from "react";
import { motion, useAnimation, useInView } from "framer-motion";
import { ChevronDown, Globe, Shield, TrendingUp, Wallet, Rocket, CircleDollarSign, BookOpen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import HeroSection from "@/components/HeroSection";
import { TypewriterHeading } from "@/components/ui/typewriter-text";

const Index = () => {
  // Ensure the page starts at the top when loaded
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-black overflow-x-hidden pt-0">
      <Header />
      
      {/* Hero Section with updated animations */}
      <HeroSection />
      
      {/* Trading Demo Call to Action */}
      <TradingDemoCallout />
      
      {/* Creator Fees Section */}
      <CreatorFeesSection />
      
      {/* Bonding Curves Learn Section */}
      <BondingCurvesCallout />
      
      <Footer />
    </div>
  );
};

// New Trading Demo Callout Section
const TradingDemoCallout = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);
  
  return (
    <motion.section 
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } }
      }}
      className="py-12 bg-gradient-to-br from-orange-900/20 via-black to-black"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { 
                opacity: 1, 
                x: 0, 
                transition: { delay: 0.2, duration: 0.4 }
              }
            }}
            className="md:w-1/2"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
              <span className="text-white">Experience Our </span>
              <span className="text-orange-400">Trading Platform</span>
            </h2>
            <p className="text-gray-300 mb-6">
              Test drive our intuitive trading interface with mock tokens. 
              See how bonding curves work in real-time and get familiar with our platform.
            </p>
            <Link to="/trade-demo">
              <Button variant="orange" className="font-poppins" size="lg">
                <TrendingUp className="mr-2 h-5 w-5" />
                Try Trading Demo
              </Button>
            </Link>
          </motion.div>
          
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { 
                opacity: 1, 
                scale: 1, 
                transition: { delay: 0.3, duration: 0.5 }
              }
            }}
            className="md:w-1/2"
          >
            <div className="relative h-64 bg-gradient-to-br from-orange-900/30 to-black rounded-xl overflow-hidden border border-orange-500/20 p-4">
              <div className="relative h-full w-full bg-black/40 rounded-lg p-2 backdrop-blur-sm">
                <div className="flex justify-between items-center mb-4 p-2 border-b border-orange-500/20">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gradient-to-br from-orange-600 to-purple-600 rounded-full"></div>
                    <div>
                      <div className="font-bold">WYBE</div>
                      <div className="text-xs text-green-500">+12.5%</div>
                    </div>
                  </div>
                  <div className="text-lg font-mono">$0.0015</div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-500/10 border border-green-500/30 rounded p-2 text-center">
                    <div className="text-xs text-gray-400">Buy</div>
                    <div className="text-green-500 font-bold">↑</div>
                  </div>
                  <div className="bg-red-500/10 border border-red-500/30 rounded p-2 text-center">
                    <div className="text-xs text-gray-400">Sell</div>
                    <div className="text-red-500 font-bold">↓</div>
                  </div>
                </div>
                
                <div className="mt-4 h-20 bg-black/30 rounded relative overflow-hidden">
                  <div className="absolute inset-0">
                    <svg viewBox="0 0 100 20" className="w-full h-full">
                      <path 
                        d="M0,20 L10,15 L20,18 L30,12 L40,16 L50,10 L60,14 L70,8 L80,12 L90,6 L100,0" 
                        stroke="rgba(249, 115, 22, 0.7)" 
                        strokeWidth="1.5" 
                        fill="rgba(249, 115, 22, 0.1)"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
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
        visible: { opacity: 1, transition: { duration: 0.4, staggerChildren: 0.1 } }
      }}
      className={className}
    >
      {children}
    </motion.div>
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
            <TypewriterHeading
              text="Creator Fee Structure"
              highlightWords={["Fee", "Structure"]}
              className="text-3xl md:text-4xl font-bold font-poppins mb-4"
              highlightClassName="text-orange-500"
              delay={50}
              tag="h2"
            />
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
                  transition: { delay: 0.1, duration: 0.3 }
                }
              }}
              className="glass-card p-6 bg-gradient-to-br from-orange-900/20 to-transparent relative overflow-hidden group"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold font-poppins">Performance Based</h3>
                <div className="bg-orange-500/20 p-2 rounded-full">
                  <Rocket size={18} className="text-orange-500" />
                </div>
              </div>
              <div className="text-4xl font-bold text-orange-500 mb-3">
                40%
              </div>
              <p className="text-gray-300 mb-4">
                Of all trading fees when your token reaches $50K market cap within 4 days and sustains it for 48 hours.
              </p>
              <div className="h-1 w-full bg-orange-500/30 rounded-full mb-2 overflow-hidden">
                <motion.div 
                  className="h-full bg-orange-500"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "90%" }}
                  transition={{ duration: 1, delay: 0.5 }}
                  viewport={{ once: true }}
                />
              </div>
              <p className="text-sm text-gray-400 font-mono">High performance reward tier</p>
            </motion.div>
            
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  transition: { delay: 0.2, duration: 0.3 }
                }
              }}
              className="glass-card p-6 bg-gradient-to-br from-blue-900/20 to-transparent relative overflow-hidden group"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold font-poppins">Standard</h3>
                <div className="bg-blue-500/20 p-2 rounded-full">
                  <CircleDollarSign size={18} className="text-blue-500" />
                </div>
              </div>
              <div className="text-4xl font-bold text-blue-500 mb-3">
                20%
              </div>
              <p className="text-gray-300 mb-4">
                Of all trading fees if the $50K cap is not met, starting 7 days after launch.
              </p>
              <div className="h-1 w-full bg-blue-500/30 rounded-full mb-2 overflow-hidden">
                <motion.div 
                  className="h-full bg-blue-500"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "60%" }}
                  transition={{ duration: 1, delay: 0.7 }}
                  viewport={{ once: true }}
                />
              </div>
              <p className="text-sm text-gray-400 font-mono">Default reward tier</p>
            </motion.div>
            
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  transition: { delay: 0.3, duration: 0.3 }
                }
              }}
              className="glass-card p-6 bg-gradient-to-br from-green-900/20 to-transparent relative overflow-hidden group"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold font-poppins">Platform Fee</h3>
                <div className="bg-green-500/20 p-2 rounded-full">
                  <CircleDollarSign size={18} className="text-green-500" />
                </div>
              </div>
              <div className="text-4xl font-bold text-green-500 mb-3">
                2.5%
              </div>
              <p className="text-gray-300 mb-4">
                Total fee on all trades, significantly lower than most DEXs which typically charge 3-5%.
              </p>
              <div className="h-1 w-full bg-green-500/30 rounded-full mb-2 overflow-hidden">
                <motion.div 
                  className="h-full bg-green-500"
                  initial={{ width: "0%" }}
                  whileInView={{ width: "40%" }}
                  transition={{ duration: 1, delay: 0.9 }}
                  viewport={{ once: true }}
                />
              </div>
              <p className="text-sm text-gray-400 font-mono">Applied to all transactions</p>
            </motion.div>
          </div>
          
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { 
                opacity: 1, 
                scale: 1, 
                transition: { delay: 0.4, duration: 0.3 }
              }
            }}
            className="text-center"
          >
            <Link to="/launch">
              <Button variant="green" className="font-poppins font-extrabold">
                Apply for Whitelist
              </Button>
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
            <h3 className="text-2xl font-bold font-poppins mb-4 text-center">The <span className="text-white font-extrabold font-poppins italic">Wybe</span> <span className="text-orange-500">Advantage</span></h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div className="flex items-start gap-3">
                <div className="mt-1 bg-green-500/20 p-2 rounded-full">
                  <Shield size={16} className="text-green-500" />
                </div>
                <div>
                  <h4 className="text-lg font-bold font-poppins mb-1">Enhanced Security</h4>
                  <p className="text-sm text-gray-300">All smart contracts are audited and secured, protecting both creators and investors.</p>
                </div>
              </motion.div>
              <motion.div className="flex items-start gap-3">
                <div className="mt-1 bg-orange-500/20 p-2 rounded-full">
                  <TrendingUp size={16} className="text-orange-500" />
                </div>
                <div>
                  <h4 className="text-lg font-bold font-poppins mb-1">Instant Liquidity</h4>
                  <p className="text-sm text-gray-300">No need to wait for liquidity providers. Trade instantly with the built-in bonding curve.</p>
                </div>
              </motion.div>
              <motion.div className="flex items-start gap-3">
                <div className="mt-1 bg-blue-500/20 p-2 rounded-full">
                  <Wallet size={16} className="text-blue-500" />
                </div>
                <div>
                  <h4 className="text-lg font-bold font-poppins mb-1">Passive Income</h4>
                  <p className="text-sm text-gray-300">Earn 40% of all trading fees as long as your token maintains active trading volume.</p>
                </div>
              </motion.div>
              <motion.div className="flex items-start gap-3">
                <div className="mt-1 bg-gray-500/20 p-2 rounded-full">
                  <Globe size={16} className="text-gray-400" />
                </div>
                <div>
                  <h4 className="text-lg font-bold font-poppins mb-1">Global Reach</h4>
                  <p className="text-sm text-gray-300">Tap into the growing Solana ecosystem with millions of active users worldwide.</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </Section>
      </div>
    </section>
  );
};

// Add a new section to promote the Bonding Curves page
const BondingCurvesCallout = () => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);
  
  return (
    <motion.section 
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } }
      }}
      className="py-16 bg-gradient-to-br from-purple-900/20 via-black to-black"
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="md:w-1/2">
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0, 
                  transition: { delay: 0.2, duration: 0.4 }
                }
              }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-poppins mb-4">
                <span className="text-white">Understand </span>
                <span className="text-purple-400">Bonding Curves</span>
              </h2>
              <p className="text-gray-300 mb-6">
                Curious about how token prices work on our platform? Learn how bonding curves 
                create fair, transparent pricing for meme coins and enable instant liquidity.
              </p>
              <Link to="/bonding-curves">
                <Button variant="outline" className="border-purple-500/50 hover:bg-purple-500/20">
                  <BookOpen className="mr-2 h-5 w-5" />
                  Learn About Bonding Curves
                </Button>
              </Link>
            </motion.div>
          </div>
          
          <div className="md:w-1/2">
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.9 },
                visible: { 
                  opacity: 1, 
                  scale: 1, 
                  transition: { delay: 0.3, duration: 0.5 }
                }
              }}
              className="relative h-64 bg-gradient-to-br from-purple-900/30 to-indigo-900/30 rounded-xl overflow-hidden border border-purple-500/20"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-black/40 p-4 rounded-lg backdrop-blur-sm">
                    <p className="font-mono text-sm text-purple-300 mb-2">Price = f(Supply)</p>
                    <div className="h-24 relative">
                      <svg className="w-full h-full" viewBox="0 0 100 50">
                        <path 
                          d="M 10,40 Q 25,35 40,25 Q 60,15 90,5" 
                          stroke="rgb(192, 132, 252)" 
                          strokeWidth="2" 
                          fill="none"
                        />
                        <circle cx="10" cy="40" r="2" fill="white" />
                        <circle cx="90" cy="5" r="2" fill="white" />
                      </svg>
                      <div className="absolute bottom-0 left-0 text-xs text-gray-400">Supply</div>
                      <div className="absolute top-0 left-0 text-xs text-gray-400 transform -rotate-90 origin-top-left translate-y-6">Price</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default Index;
