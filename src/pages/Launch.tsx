
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Coins, AlertTriangle, Check, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useWallet } from "@/hooks/useWallet";
import { Link } from "react-router-dom";

const Launch = () => {
  const { wallet, connect } = useWallet();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [curveStyle, setCurveStyle] = useState("classic");
  const [showDialog, setShowDialog] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
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
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate checking if wallet is whitelisted
    const isWhitelisted = true;
    
    if (!isWhitelisted) {
      toast.error("Your wallet is not whitelisted to create a coin");
      return;
    }
    
    setIsCreating(true);
    
    // Simulate coin creation
    setTimeout(() => {
      setIsCreating(false);
      setShowDialog(true);
    }, 2000);
  };
  
  const handleCopyAddress = () => {
    navigator.clipboard.writeText("DummyTokenAddress123456789");
    toast.success("Token address copied to clipboard");
  };
  
  const handleStartTrading = () => {
    setShowDialog(false);
    toast.success("Redirecting to trading page...");
    // Redirect to trading page
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Launch Page Content */}
      <div className="flex-grow flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="glass-card p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-wybe-primary/20 flex items-center justify-center mx-auto mb-4">
                <Coins className="text-wybe-primary" size={24} />
              </div>
              <h1 className="text-2xl font-bold">Launch Your Meme Coin</h1>
              <p className="text-gray-400 mt-2">Create and deploy your token in seconds</p>
            </div>
            
            {/* New Package Banner */}
            <div className="mb-6 p-3 glass-card bg-gradient-to-r from-orange-600/30 to-purple-600/30 border border-purple-500/30">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-white">Need full launch support?</h3>
                  <p className="text-xs text-gray-300">All-in $500 package with marketing and support</p>
                </div>
                <Link to="/package">
                  <Button size="sm" className="btn-primary text-xs flex items-center gap-1">
                    Learn More
                    <ChevronRight size={12} />
                  </Button>
                </Link>
              </div>
            </div>
            
            {!isWalletConnected ? (
              <div className="text-center">
                <p className="text-gray-300 mb-4">Connect your wallet to check if you're invited</p>
                <Button onClick={handleConnect} className="btn-primary w-full">
                  Connect Wallet
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Token Name</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Doge Coin" 
                      className="bg-wybe-background-light border-wybe-primary/20 focus-visible:ring-wybe-primary"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="symbol">Token Symbol</Label>
                    <Input 
                      id="symbol" 
                      value={symbol} 
                      onChange={(e) => setSymbol(e.target.value)}
                      placeholder="e.g. DOGE" 
                      className="bg-wybe-background-light border-wybe-primary/20 focus-visible:ring-wybe-primary"
                      maxLength={5}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="curve">Bonding Curve Style</Label>
                    <Select value={curveStyle} onValueChange={setCurveStyle}>
                      <SelectTrigger className="bg-wybe-background-light border-wybe-primary/20 focus:ring-wybe-primary">
                        <SelectValue placeholder="Select curve style" />
                      </SelectTrigger>
                      <SelectContent className="bg-wybe-background-light border-white/10">
                        <SelectItem value="classic">Classic (Linear)</SelectItem>
                        <SelectItem value="exponential">Exponential</SelectItem>
                        <SelectItem value="sigmoid">Sigmoid</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="bg-wybe-primary/10 border border-wybe-primary/20 rounded-lg p-3 mt-4">
                    <p className="text-sm flex items-center gap-2">
                      <AlertTriangle size={16} className="text-wybe-secondary" />
                      <span>Creation fee: ~$1 USDT (paid in SOL)</span>
                    </p>
                  </div>
                  
                  <Button type="submit" className="btn-primary w-full" disabled={isCreating}>
                    {isCreating ? "Creating..." : "Launch Coin"}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
      
      {/* Success Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-wybe-background-light border-wybe-primary/20 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="text-green-500" size={20} />
              Token Created Successfully!
            </DialogTitle>
            <DialogDescription>
              Your meme coin has been deployed to the Solana blockchain.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-wybe-background/70 rounded-lg p-4 border border-white/10">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Token Name:</span>
                <span className="font-medium">{name || "Sample Token"}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Symbol:</span>
                <span className="font-medium">{symbol || "STKN"}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">Total Supply:</span>
                <span className="font-medium">1,000,000,000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-400">Token Address:</span>
                <button 
                  onClick={handleCopyAddress} 
                  className="text-xs bg-wybe-primary/20 hover:bg-wybe-primary/30 text-wybe-primary px-2 py-1 rounded-md transition-colors"
                >
                  DummyToken...789 (Copy)
                </button>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="btn-secondary flex-1">
              View on Solscan
            </Button>
            <Button onClick={handleStartTrading} className="btn-primary flex-1">
              Start Trading
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default Launch;
