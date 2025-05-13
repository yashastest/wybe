
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Coins, Users, Settings, BarChart, LogOut, Plus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [whitelistWallet, setWhitelistWallet] = useState("");
  const [treasuryWallet, setTreasuryWallet] = useState("DummyTreasuryWallet123456");
  
  useEffect(() => {
    // Check if admin is logged in
    const isAdminLoggedIn = localStorage.getItem("wybeAdminLoggedIn") === "true";
    if (!isAdminLoggedIn) {
      navigate("/admin-login");
      return;
    }
    setIsLoading(false);
  }, [navigate]);
  
  const handleLogout = () => {
    localStorage.removeItem("wybeAdminLoggedIn");
    toast.success("Logged out successfully");
    navigate("/admin-login");
  };
  
  const handleWhitelistWallet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!whitelistWallet) {
      toast.error("Please enter a wallet address");
      return;
    }
    
    // Simulate adding wallet to whitelist
    toast.success(`Wallet ${whitelistWallet.substring(0, 6)}...${whitelistWallet.substring(whitelistWallet.length - 4)} added to whitelist`);
    setWhitelistWallet("");
  };
  
  const handleUpdateTreasury = (e: React.FormEvent) => {
    e.preventDefault();
    if (!treasuryWallet) {
      toast.error("Please enter a valid treasury wallet");
      return;
    }
    
    toast.success("Treasury wallet updated successfully");
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="flex flex-col-reverse md:flex-row gap-6">
          {/* Admin Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="md:w-64 glass-card p-4"
          >
            <div className="flex items-center gap-3 mb-6 p-2 bg-wybe-primary/10 rounded-md">
              <Settings className="text-wybe-primary" size={20} />
              <h2 className="text-lg font-medium">Admin Panel</h2>
            </div>
            
            <nav className="space-y-2">
              <Button variant="ghost" className="w-full justify-start">
                <BarChart className="mr-2" size={18} />
                Dashboard
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Coins className="mr-2" size={18} />
                Manage Coins
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2" size={18} />
                Users
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Settings className="mr-2" size={18} />
                Settings
              </Button>
            </nav>
            
            <div className="mt-auto pt-6">
              <Button 
                variant="ghost" 
                className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10"
                onClick={handleLogout}
              >
                <LogOut className="mr-2" size={18} />
                Logout
              </Button>
            </div>
          </motion.div>
          
          {/* Admin Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-grow"
          >
            <div className="glass-card p-6 mb-6">
              <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card p-4 bg-wybe-primary/10 border border-wybe-primary/30">
                  <h3 className="text-sm text-gray-300 mb-1">Total Coins</h3>
                  <p className="text-2xl font-bold">32</p>
                </div>
                <div className="glass-card p-4 bg-wybe-secondary/10 border border-wybe-secondary/30">
                  <h3 className="text-sm text-gray-300 mb-1">Total Volume</h3>
                  <p className="text-2xl font-bold">3,421 SOL</p>
                </div>
                <div className="glass-card p-4 bg-green-500/10 border border-green-500/30">
                  <h3 className="text-sm text-gray-300 mb-1">Fee Revenue</h3>
                  <p className="text-2xl font-bold">89.5 SOL</p>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6 mb-6">
              <h2 className="text-lg font-medium mb-4">Whitelist Management</h2>
              <form onSubmit={handleWhitelistWallet} className="space-y-4">
                <div>
                  <Label htmlFor="whitelistWallet">Add Wallet to Whitelist</Label>
                  <div className="flex gap-2">
                    <Input
                      id="whitelistWallet"
                      value={whitelistWallet}
                      onChange={(e) => setWhitelistWallet(e.target.value)}
                      placeholder="Enter Solana wallet address"
                      className="bg-wybe-background-light border-wybe-primary/20 focus-visible:ring-wybe-primary"
                    />
                    <Button type="submit" className="btn-primary whitespace-nowrap">
                      <Plus size={18} />
                      Add
                    </Button>
                  </div>
                </div>
              </form>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-300 mb-2">Recent Whitelist Additions</h3>
                <div className="bg-wybe-background/70 rounded-lg p-2">
                  <div className="flex justify-between items-center py-2 px-3 border-b border-white/5">
                    <span>Wybe7g3h2...89dj</span>
                    <span className="text-xs text-gray-400">2 hours ago</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3 border-b border-white/5">
                    <span>WybeN4kl7...23fs</span>
                    <span className="text-xs text-gray-400">5 hours ago</span>
                  </div>
                  <div className="flex justify-between items-center py-2 px-3">
                    <span>Wybe8j3n4...56gh</span>
                    <span className="text-xs text-gray-400">1 day ago</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6">
              <h2 className="text-lg font-medium mb-4">Treasury Settings</h2>
              <form onSubmit={handleUpdateTreasury} className="space-y-4">
                <div>
                  <Label htmlFor="treasuryWallet">Treasury Wallet</Label>
                  <Input
                    id="treasuryWallet"
                    value={treasuryWallet}
                    onChange={(e) => setTreasuryWallet(e.target.value)}
                    placeholder="Enter treasury wallet address"
                    className="bg-wybe-background-light border-wybe-primary/20 focus-visible:ring-wybe-primary"
                  />
                </div>
                
                <Button type="submit" className="btn-primary">
                  Update Treasury Wallet
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Admin;
