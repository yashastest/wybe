
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Trophy, 
  TrendingUp, 
  BarChart, 
  Wallet,
  ArrowRight,
  ShieldCheck,
  Clock
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import TokenPerformanceChart from "@/components/TokenPerformanceChart";
import { toast } from "sonner";
import { useWallet } from "@/hooks/useWallet";
import { TypewriterText } from "@/components/ui/typewriter-text";

const Dashboard = () => {
  const { wallet, connect } = useWallet();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  
  // Mock creator data
  const creatorData = {
    tokens: [
      {
        name: "Pepe Solana",
        symbol: "PEPES",
        address: "DummyTokenAddress123456789",
        marketCap: 48000,
        volume24h: 12000,
        totalFees: 1240,
        treasuryFee: 10000000,
        eligibilityProgress: 96,
        timeRemaining: "5 hours"
      },
      {
        name: "Doge Sol",
        symbol: "DSOL",
        address: "DummyTokenAddress987654321",
        marketCap: 85000,
        volume24h: 56000,
        totalFees: 3200,
        treasuryFee: 10000000,
        eligibilityProgress: 100,
        timeRemaining: "Eligible Now!"
      }
    ]
  };
  
  const handleConnect = async () => {
    try {
      await connect();
      setIsWalletConnected(true);
      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect wallet");
    }
  };
  
  const handleClaim = (tokenSymbol: string) => {
    toast.success(`Claimed rewards for ${tokenSymbol}!`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Added pt-24 instead of py-12 to create more space at the top */}
      <div className="container mx-auto px-4 pt-24 pb-12 flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">
            <span className="text-white">Creator </span>
            <span className="text-orange-500">Dashboard</span>
          </h1>
          <TypewriterText 
            text="Track your token performance and claim rewards" 
            className="text-gray-400 mt-2" 
            delay={50}
          />
        </motion.div>
        
        {!isWalletConnected ? (
          <div className="glass-card p-16 text-center">
            <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
              <Wallet className="text-orange-500" size={24} />
            </div>
            <h2 className="text-xl font-bold mb-2">Connect Your Wallet</h2>
            <p className="text-gray-400 mb-6">Connect your wallet to view your creator dashboard</p>
            <Button onClick={handleConnect} className="bg-orange-600 hover:bg-orange-700">
              Connect Wallet
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatsCard 
                icon={<BarChart className="text-orange-500" />}
                title="Total Market Cap"
                value="$133,000"
                subtitle="Across all tokens"
              />
              <StatsCard 
                icon={<TrendingUp className="text-orange-500" />}
                title="24h Volume"
                value="$68,000"
                subtitle="Across all tokens"
              />
              <StatsCard 
                icon={<Trophy className="text-orange-500" />}
                title="Total Rewards"
                value="4,440 SOL"
                subtitle="Earned from trading fees"
              />
            </div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-xl font-bold mb-4">Your Tokens</h2>
              
              {creatorData.tokens.map((token, index) => (
                <div key={index} className="glass-card p-6 mb-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                    <div className="mb-4 md:mb-0">
                      <h3 className="text-lg font-bold">{token.name} ({token.symbol})</h3>
                      <p className="text-sm text-gray-400">
                        {token.address.substring(0, 8)}...{token.address.substring(token.address.length - 4)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                      >
                        View Chart
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                        onClick={() => window.open(`/trade/${token.symbol.toLowerCase()}`, '_blank')}
                      >
                        Trade
                      </Button>
                      <Button 
                        onClick={() => handleClaim(token.symbol)} 
                        className={token.eligibilityProgress === 100 
                          ? "bg-orange-600 hover:bg-orange-700" 
                          : "bg-gray-600 hover:bg-gray-700"}
                        disabled={token.eligibilityProgress < 100}
                      >
                        {token.eligibilityProgress === 100 ? "Claim Rewards" : "Not Eligible"}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <StatsItem label="Market Cap" value={`$${token.marketCap.toLocaleString()}`} />
                        <StatsItem label="24h Volume" value={`$${token.volume24h.toLocaleString()}`} />
                        <StatsItem label="Total Fees" value={`${token.totalFees} SOL`} />
                        <StatsItem label="Treasury Fee" value={`${(token.treasuryFee/1000000).toFixed(1)}M ${token.symbol}`} />
                      </div>
                      
                      <div className="glass-card bg-wybe-background/40 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <ShieldCheck size={18} className="text-orange-500" />
                            <span className="font-medium">Reward Eligibility</span>
                          </div>
                          <span className="text-sm bg-orange-500/20 text-orange-500 px-2 py-1 rounded">
                            {token.eligibilityProgress}%
                          </span>
                        </div>
                        <Progress value={token.eligibilityProgress} className="h-2 mb-2 bg-gray-700">
                          <div className="h-full bg-orange-500 transition-all" style={{ width: `${token.eligibilityProgress}%` }}></div>
                        </Progress>
                        <div className="flex items-center gap-1 text-sm text-gray-400">
                          <Clock size={14} />
                          <span>{token.timeRemaining}</span>
                          {token.eligibilityProgress < 100 && (
                            <span className="ml-1">
                              before 48h trading volume threshold is met
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="h-48">
                      <TokenPerformanceChart symbol={token.symbol} />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-8" // Added margin bottom to give space for footer
            >
              <div className="glass-card p-6">
                <h2 className="text-xl font-bold mb-4">Eligibility Requirements</h2>
                <div className="space-y-4">
                  <RequirementCard 
                    title="Market Cap Threshold"
                    description="Your token must reach a market cap of at least $50,000"
                    icon={<TrendingUp size={20} />}
                  />
                  <RequirementCard 
                    title="Volume Requirement"
                    description="Maintain $50K+ trading volume for 48 hours continuously"
                    icon={<BarChart size={20} />}
                  />
                  <RequirementCard 
                    title="Reward Distribution"
                    description="You'll receive 40% of all trading fees once eligible"
                    icon={<Trophy size={20} />}
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
      
      {/* Added pb-6 to give space before footer */}
      <div className="pb-6"></div>
      
      <Footer />
    </div>
  );
};

const StatsCard = ({ icon, title, value, subtitle }) => {
  return (
    <Card className="bg-wybe-background-light border-white/10">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{title}</CardTitle>
          <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
            {icon}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardContent>
    </Card>
  );
};

const StatsItem = ({ label, value }) => {
  return (
    <div>
      <p className="text-sm text-gray-400 mb-1">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
};

const RequirementCard = ({ title, description, icon }) => {
  return (
    <div className="flex gap-4 items-start p-4 bg-wybe-background/40 rounded-lg">
      <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  );
};

export default Dashboard;
