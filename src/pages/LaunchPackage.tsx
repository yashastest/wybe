
import React from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight, Shield, Rocket, Coins, AlertTriangle, Download, Globe, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

const LaunchPackage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main>
        {/* Hero Section */}
        <HeroSection />
        
        {/* Launch Process Section */}
        <LaunchProcessSection />
        
        {/* Creator Fees Section */}
        <CreatorFeesSection />
        
        {/* Earnings Section */}
        <EarningsSection />
      </main>
      
      <Footer />
    </div>
  );
};

const Section = ({ children, className = "" }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

const HeroSection = () => {
  return (
    <div className="relative py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-wybe-background via-wybe-primary/20 to-wybe-background z-0"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-10 z-0"></div>
      
      <Section className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="md:w-1/2">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 mr-4">
                <AspectRatio ratio={1/1}>
                  <img 
                    src="/lovable-uploads/dcb3ea81-25ba-4438-90a5-c7403026c91e.png" 
                    alt="Wybe Logo" 
                    className="object-contain"
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
              <Link to="/launch">
                <Button className="btn-primary flex gap-2 w-full sm:w-auto">
                  <Rocket size={18} />
                  Apply for Whitelist
                </Button>
              </Link>
              <Button variant="outline" className="btn-secondary flex gap-2 w-full sm:w-auto">
                Contact Us
                <ChevronRight size={18} />
              </Button>
            </div>
          </div>
          
          <div className="md:w-1/2 flex justify-center">
            <div className="bg-gradient-to-br from-wybe-primary/30 to-wybe-secondary/20 glass-card p-6 border-2 border-wybe-secondary/40 rounded-2xl shadow-glow-md">
              <div className="flex items-center mb-6">
                <Coins className="text-wybe-secondary mr-3" size={28} />
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
                      <Check size={16} className="text-wybe-success" />
                    </div>
                    <span className="text-white/90">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

const LaunchProcessSection = () => {
  return (
    <div className="bg-wybe-background-light/70 py-16">
      <Section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-gradient">Step-by-Step Launch Process</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            We've streamlined the process of launching your meme coin to make it simple, secure,
            and effective. Here's how it works:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[
            {
              title: "Submit Whitelist Request",
              description: "Creators submit a project proposal via our whitelist request form. This includes project vision, team details, and wallet address.",
              icon: <Rocket className="text-wybe-warning" size={24} />
            },
            {
              title: "Verification & Contact",
              description: "Our team reviews the request and reaches out to the creator via Telegram or email for a quick onboarding call.",
              icon: <Shield className="text-wybe-secondary" size={24} />
            },
            {
              title: "Wallet Whitelisting",
              description: "Once approved, the creator's wallet is whitelisted for launch.",
              icon: <Check className="text-wybe-success" size={24} />
            },
            {
              title: "Launch Preparation",
              description: "We set up the token using our secure launch tools, coordinate with trusted partner communities, schedule your ideal launch date & time, and begin pre-launch marketing.",
              icon: <Coins className="text-wybe-primary" size={24} />
            },
            {
              title: "Payment & Confirmation",
              description: "You pay the $500 launch fee, and we finalize your launch timeline.",
              icon: <AlertTriangle className="text-wybe-warning" size={24} />
            },
            {
              title: "Launch & Earn",
              description: "We launch the token and push it with full marketing support across our network.",
              icon: <Rocket className="text-wybe-danger" size={24} />
            }
          ].map((step, index) => (
            <div 
              key={index}
              className="glass-card p-6 relative"
            >
              <div className="absolute -top-4 -left-4 w-9 h-9 rounded-full bg-wybe-background flex items-center justify-center border-2 border-wybe-primary/50">
                <span className="font-bold">{index + 1}</span>
              </div>
              
              <div className="flex items-center mb-4">
                <div className="mr-3">{step.icon}</div>
                <h3 className="text-xl font-bold">{step.title}</h3>
              </div>
              
              <p className="text-white/80 text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
};

const CreatorFeesSection = () => {
  return (
    <div className="py-16 bg-gradient-to-br from-wybe-background to-wybe-background-light/60">
      <Section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 gradient-text">How Creator Fees Work</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Our platform is designed to reward serious creators while maintaining a sustainable ecosystem.
            Here's how the fee structure works for your meme coin:
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
          <div className="glass-card p-6">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mb-4">
              <Coins className="text-purple-400" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Platform Fee</h3>
            <p className="text-white/70 text-sm mb-3">
              A 2.5% fee is applied to all trading transactions on the platform to maintain operation and liquidity.
            </p>
            <div className="bg-purple-500/10 p-3 rounded-lg border border-purple-500/20">
              <p className="text-sm text-white/80">
                <span className="font-bold text-purple-400">Note:</span> This fee is lower than most DEXs which typically charge 3-5%.
              </p>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
              <Download className="text-green-400" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Creator Share</h3>
            <p className="text-white/70 text-sm mb-3">
              As a creator, you earn up to 40% of all trading fees generated by your coin when performance targets are met.
            </p>
            <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
              <p className="text-sm text-white/80">
                <span className="font-bold text-green-400">Benefit:</span> This aligns incentives and rewards creators who build communities, not just launch coins.
              </p>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
              <Globe className="text-blue-400" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Social Requirements</h3>
            <p className="text-white/70 text-sm mb-3">
              Creators are required to provide social channels (Telegram, Twitter) and optionally a website for community building.
            </p>
            <div className="bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
              <p className="text-sm text-white/80">
                <span className="font-bold text-blue-400">Why:</span> Proper community channels increase token credibility and growth potential.
              </p>
            </div>
          </div>
        </div>
        
        <div className="glass-card p-6 md:p-8 border-2 border-wybe-primary/30 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-4 text-center">Platform Fee Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-purple-900/30 to-purple-600/10 rounded-xl border border-purple-500/20">
              <p className="text-2xl font-bold text-gradient mb-2">40%</p>
              <p className="text-sm text-white/80">To Creator<br />(Performance-based)</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-900/30 to-blue-600/10 rounded-xl border border-blue-500/20">
              <p className="text-2xl font-bold text-gradient mb-2">30%</p>
              <p className="text-sm text-white/80">To Liquidity<br />Pool</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-indigo-900/30 to-indigo-600/10 rounded-xl border border-indigo-500/20">
              <p className="text-2xl font-bold text-gradient mb-2">30%</p>
              <p className="text-sm text-white/80">To Platform<br />Operations</p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p className="text-white/70 mb-4">
              This transparent fee structure ensures that all stakeholders are aligned in creating successful, sustainable meme coins.
            </p>
            <Link to="/launch">
              <Button className="btn-primary">
                Start Your Coin Launch
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
};

const EarningsSection = () => {
  return (
    <div className="py-16">
      <Section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2">
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="/lovable-uploads/dcb3ea81-25ba-4438-90a5-c7403026c91e.png" 
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

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col items-center">
                  <MessageCircle className="text-wybe-secondary mb-2" size={24} />
                  <h4 className="font-semibold mb-1">Community Focus</h4>
                  <p className="text-xs text-center text-white/70">Active engagement with holders</p>
                </div>
                
                <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-4 flex flex-col items-center">
                  <Shield className="text-wybe-primary mb-2" size={24} />
                  <h4 className="font-semibold mb-1">No Rugpulls</h4>
                  <p className="text-xs text-center text-white/70">Verified team & locked liquidity</p>
                </div>
              </div>
              
              <div className="bg-wybe-primary/10 border border-wybe-primary/30 rounded-xl p-6 text-center">
                <h3 className="text-xl font-bold mb-4">Ready to Launch?</h3>
                <p className="text-white/80 mb-6">
                  Submit your project and take the first step towards a real, successful meme coin launch — backed by Wybe.
                </p>
                <Link to="/launch">
                  <Button className="btn-primary w-full">Apply for Whitelist Now</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default LaunchPackage;
