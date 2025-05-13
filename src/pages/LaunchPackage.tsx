
import React from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight, Shield, Rocket, Coins, AlertTriangle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";

const LaunchPackage = () => {
  const stepContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const stepItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <div className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-wybe-background via-purple-900/40 to-wybe-background z-0"></div>
        <div className="absolute inset-0 bg-grid-pattern opacity-10 z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 mr-4">
                  <AspectRatio ratio={1/1}>
                    <img 
                      src="/lovable-uploads/11c9cd9c-16fc-462c-912b-bd90bbd2bd17.png" 
                      alt="Wybe Logo" 
                      className="object-contain animate-pulse-slow"
                    />
                  </AspectRatio>
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gradient">
                  Launch Your Meme Coin with Wybe
                </h1>
              </div>
              
              <h2 className="text-xl md:text-2xl font-medium text-white/90 mb-6">
                $500 All-In Package for Serious Creators
              </h2>
              
              <p className="text-gray-300 mb-8">
                We're on a mission to clean up meme coins and help serious creators build real wealth — not just hype.
                Our full-service package makes launching your coin easy, secure, and high-potential — zero rugpulls, full support.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="btn-primary flex gap-2">
                  <Rocket size={18} />
                  Apply for Whitelist
                </Button>
                <Button variant="outline" className="btn-secondary flex gap-2">
                  Contact Us
                  <ChevronRight size={18} />
                </Button>
              </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center">
              <motion.div
                className="bg-gradient-to-br from-wybe-primary/30 to-wybe-secondary/20 glass-card p-6 border-2 border-wybe-primary/40 rounded-2xl shadow-glow-md"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center mb-6">
                  <Coins className="text-wybe-primary mr-3" size={28} />
                  <h2 className="text-2xl font-bold">Pricing</h2>
                </div>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-300">Flat Fee:</span>
                  <span className="text-2xl font-bold text-white">$500</span>
                </div>
                
                <p className="text-white/70 mb-4 text-sm">
                  One-time fee includes all services listed below.
                  We do not take equity or ownership in your project. You own your coin 100%.
                </p>
                
                <div className="space-y-3">
                  {[
                    "Coin Creation & Launch on Solana",
                    "Full Marketing Support",
                    "Anti-Rug Vetting & Whitelisting",
                    "Listing on our Meme Coin Launchpad",
                    "Launch Strategy & Timing",
                    "Post-Launch Guidance & Monitoring"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="mt-1">
                        <Check size={16} className="text-green-400" />
                      </div>
                      <span className="text-white/90">{item}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Launch Process Section */}
      <div className="bg-wybe-background-light/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gradient">Step-by-Step Launch Process</h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              We've streamlined the process of launching your meme coin to make it simple, secure,
              and effective. Here's how it works:
            </p>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
            variants={stepContainerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {[
              {
                title: "Submit Whitelist Request",
                description: "Creators submit a project proposal via our whitelist request form. This includes project vision, team details, and wallet address.",
                icon: <Rocket className="text-orange-400" size={24} />
              },
              {
                title: "Verification & Contact",
                description: "Our team reviews the request and reaches out to the creator via Telegram or email for a quick onboarding call.",
                icon: <Shield className="text-wybe-secondary" size={24} />
              },
              {
                title: "Wallet Whitelisting",
                description: "Once approved, the creator's wallet is whitelisted for launch.",
                icon: <Check className="text-green-400" size={24} />
              },
              {
                title: "Launch Preparation",
                description: "We set up the token using our secure launch tools, coordinate with trusted partner communities, schedule your ideal launch date & time, and begin pre-launch marketing.",
                icon: <Coins className="text-wybe-primary" size={24} />
              },
              {
                title: "Payment & Confirmation",
                description: "You pay the $500 launch fee, and we finalize your launch timeline.",
                icon: <AlertTriangle className="text-yellow-400" size={24} />
              },
              {
                title: "Launch & Earn",
                description: "We launch the token and push it with full marketing support across our network.",
                icon: <Rocket className="text-red-400" size={24} />
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                className="glass-card p-6 relative"
                variants={stepItemVariants}
              >
                <div className="absolute -top-4 -left-4 w-9 h-9 rounded-full bg-wybe-background flex items-center justify-center border-2 border-wybe-primary/50">
                  <span className="font-bold">{index + 1}</span>
                </div>
                
                <div className="flex items-center mb-4">
                  <div className="mr-3">{step.icon}</div>
                  <h3 className="text-xl font-bold">{step.title}</h3>
                </div>
                
                <p className="text-white/80 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Earnings Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="md:w-1/2">
              <div className="flex items-center gap-3 mb-6">
                <img 
                  src="/lovable-uploads/11c9cd9c-16fc-462c-912b-bd90bbd2bd17.png" 
                  alt="Wybe Logo" 
                  className="w-10 h-10"
                />
                <h2 className="text-3xl font-bold text-gradient">Earnings & Rewards</h2>
              </div>
              
              <p className="text-gray-300 mb-6">
                We're incentivized by your success. Here's how earnings work:
              </p>
              
              <Card className="bg-gradient-to-br from-green-900/40 to-transparent border-green-500/30 mb-6">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-green-500/20 p-2 rounded-full">
                      <Check className="text-green-400" size={20} />
                    </div>
                    <h3 className="text-xl font-medium text-green-300">High Performance Path</h3>
                  </div>
                  <p className="text-white/80 ml-11">
                    If your token reaches $50K market cap within 4 days and sustains it for 48 hours,
                    <span className="font-bold text-green-300 block mt-1">→ You earn 40% of the trading fees generated by your project.</span>
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-orange-900/40 to-transparent border-orange-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-orange-500/20 p-2 rounded-full">
                      <AlertTriangle className="text-orange-400" size={20} />
                    </div>
                    <h3 className="text-xl font-medium text-orange-300">Standard Path</h3>
                  </div>
                  <p className="text-white/80 ml-11">
                    If the $50K cap is not met or sustained,
                    <span className="font-bold text-orange-300 block mt-1">→ You'll receive 20% of the trading fees generated by your project after 7 days from launch.</span>
                  </p>
                </CardContent>
              </Card>
              
              <p className="text-white/70 mt-6">
                This ensures both transparency and performance-based incentives — we only win when you do.
              </p>
            </div>
            
            <div className="md:w-1/2">
              <div className="glass-card p-8 border-2 border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <Shield className="text-wybe-primary" size={28} />
                  <h2 className="text-2xl font-bold">Why We Do This</h2>
                </div>
                
                <p className="text-white/80 mb-6">
                  Rugpulls have made meme coins risky. We're changing that.
                </p>
                
                <p className="text-white/80 mb-6">
                  By vetting every project, providing a safe launch process, and aligning incentives through 
                  fair rewards, Wybe is building a reliable launch ecosystem for meme coins to become legitimate, 
                  wealth-generating assets — not pump-and-dump scams.
                </p>
                
                <div className="bg-wybe-primary/10 border border-wybe-primary/30 rounded-xl p-6 text-center">
                  <h3 className="text-xl font-bold mb-4">Ready to Launch?</h3>
                  <p className="text-white/80 mb-6">
                    Submit your project and take the first step towards a real, successful meme coin launch — backed by Wybe.
                  </p>
                  <Button className="btn-primary w-full">Apply for Whitelist Now</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default LaunchPackage;
