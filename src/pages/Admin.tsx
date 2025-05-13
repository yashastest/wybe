
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield,
  Users,
  Settings,
  Wallet,
  Plus,
  Check,
  X,
  Download,
  Rocket
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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

const Admin = () => {
  const { wallet, connect } = useWallet();
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newTreasuryWallet, setNewTreasuryWallet] = useState("");
  const [newWhitelistWallet, setNewWhitelistWallet] = useState("");
  const [showDeployDialog, setShowDeployDialog] = useState(false);
  const [selectedToken, setSelectedToken] = useState(null);
  
  // Mock data
  const mockCoins = [
    {
      name: "Pepe Solana",
      symbol: "PEPES",
      address: "DummyAddress123456",
      creator: "Creator123",
      marketCap: "$48,000",
      volume: "$12,000",
      deployed: true
    },
    {
      name: "Doge Sol",
      symbol: "DSOL",
      address: "DummyAddress789012",
      creator: "Creator456",
      marketCap: "$85,000",
      volume: "$56,000",
      deployed: true
    },
    {
      name: "Shiba Solana",
      symbol: "SHIBSOL",
      address: "DummyAddress345678",
      creator: "Creator789",
      marketCap: "$12,000",
      volume: "$5,000",
      deployed: false
    },
  ];
  
  const mockWhitelist = [
    { wallet: "WhitelistedWallet123", added: "2023-05-10", status: "Active" },
    { wallet: "WhitelistedWallet456", added: "2023-05-12", status: "Active" },
    { wallet: "WhitelistedWallet789", added: "2023-05-15", status: "Pending" },
  ];
  
  const handleConnect = async () => {
    try {
      await connect();
      setIsWalletConnected(true);
      
      // In a real app, you'd check if the wallet is an admin
      setIsAdmin(true);
      
      toast.success("Admin wallet connected!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to connect wallet");
    }
  };
  
  const handleUpdateTreasury = () => {
    if (!newTreasuryWallet) {
      toast.error("Please enter a valid wallet address");
      return;
    }
    
    // In a real app, this would call the contract
    toast.success("Treasury wallet updated successfully!");
    setNewTreasuryWallet("");
  };
  
  const handleAddToWhitelist = () => {
    if (!newWhitelistWallet) {
      toast.error("Please enter a valid wallet address");
      return;
    }
    
    // In a real app, this would call the contract
    toast.success("Wallet added to whitelist!");
    setNewWhitelistWallet("");
  };
  
  const handleRemoveFromWhitelist = (wallet: string) => {
    // In a real app, this would call the contract
    toast.success(`${wallet} removed from whitelist`);
  };
  
  const handleDownloadContract = (token) => {
    toast.success(`Downloading contract for ${token.symbol}...`);
  };
  
  const handleDeployToMainnet = () => {
    setShowDeployDialog(false);
    toast.success(`Deploying ${selectedToken.symbol} to mainnet...`);
    
    // Simulate deployment progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      if (progress <= 100) {
        toast(`Deployment progress: ${progress}%`);
      } else {
        clearInterval(interval);
        toast.success(`${selectedToken.symbol} successfully deployed to mainnet!`);
      }
    }, 1000);
  };
  
  const openDeployDialog = (token) => {
    setSelectedToken(token);
    setShowDeployDialog(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="container mx-auto px-4 py-12 flex-grow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-gray-400 mt-2">Manage your Wybe platform settings</p>
        </motion.div>
        
        {!isWalletConnected ? (
          <div className="glass-card p-16 text-center">
            <div className="w-16 h-16 rounded-full bg-wybe-primary/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="text-wybe-primary" size={24} />
            </div>
            <h2 className="text-xl font-bold mb-2">Admin Authentication Required</h2>
            <p className="text-gray-400 mb-6">Connect your admin wallet to access the panel</p>
            <Button onClick={handleConnect} className="btn-primary">
              Connect Admin Wallet
            </Button>
          </div>
        ) : !isAdmin ? (
          <div className="glass-card p-16 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4">
              <X className="text-red-500" size={24} />
            </div>
            <h2 className="text-xl font-bold mb-2">Unauthorized Access</h2>
            <p className="text-gray-400 mb-6">Your wallet does not have admin privileges</p>
            <Button onClick={() => setIsWalletConnected(false)} className="btn-secondary">
              Disconnect
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="treasury" className="space-y-6">
            <TabsList className="grid grid-cols-3 max-w-md mx-auto mb-8">
              <TabsTrigger value="treasury">Treasury</TabsTrigger>
              <TabsTrigger value="tokens">Tokens</TabsTrigger>
              <TabsTrigger value="whitelist">Whitelist</TabsTrigger>
            </TabsList>
            
            {/* Treasury Tab */}
            <TabsContent value="treasury">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="glass-card p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-wybe-primary/20 flex items-center justify-center">
                      <Wallet className="text-wybe-primary" size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Treasury Management</h2>
                      <p className="text-gray-400">Update the platform treasury wallet</p>
                    </div>
                  </div>
                  
                  <div className="mb-6 p-4 bg-wybe-background/40 rounded-lg">
                    <h3 className="text-sm font-medium mb-2">Current Treasury Wallet</h3>
                    <div className="font-mono bg-wybe-background p-3 rounded border border-wybe-primary/20 text-gray-300">
                      TreasuryWalletAddress123456789
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                      This wallet receives 1% of all newly created tokens
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="treasury">New Treasury Wallet Address</Label>
                      <Input 
                        id="treasury"
                        value={newTreasuryWallet}
                        onChange={(e) => setNewTreasuryWallet(e.target.value)}
                        placeholder="Enter Solana address" 
                        className="bg-wybe-background-light border-wybe-primary/20 focus-visible:ring-wybe-primary"
                      />
                    </div>
                    
                    <Button onClick={handleUpdateTreasury} className="btn-primary">
                      Update Treasury Wallet
                    </Button>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
            
            {/* Tokens Tab */}
            <TabsContent value="tokens">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="glass-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-wybe-primary/20 flex items-center justify-center">
                        <Settings className="text-wybe-primary" size={20} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">Token Management</h2>
                        <p className="text-gray-400">View and manage all created meme coins</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Symbol</TableHead>
                          <TableHead className="hidden md:table-cell">Address</TableHead>
                          <TableHead className="hidden md:table-cell">Creator</TableHead>
                          <TableHead className="hidden md:table-cell">Market Cap</TableHead>
                          <TableHead className="hidden md:table-cell">Volume</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockCoins.map((token, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-medium">{token.name}</TableCell>
                            <TableCell>{token.symbol}</TableCell>
                            <TableCell className="hidden md:table-cell font-mono text-xs">
                              {token.address}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">{token.creator}</TableCell>
                            <TableCell className="hidden md:table-cell">{token.marketCap}</TableCell>
                            <TableCell className="hidden md:table-cell">{token.volume}</TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleDownloadContract(token)}
                                className="h-8 w-8 p-0"
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                              {!token.deployed && (
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => openDeployDialog(token)}
                                  className="h-8 w-8 p-0"
                                >
                                  <Rocket className="h-4 w-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
            
            {/* Whitelist Tab */}
            <TabsContent value="whitelist">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="glass-card p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-full bg-wybe-primary/20 flex items-center justify-center">
                      <Users className="text-wybe-primary" size={20} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">Wallet Whitelist</h2>
                      <p className="text-gray-400">Manage wallets allowed to create meme coins</p>
                    </div>
                  </div>
                  
                  <div className="mb-6 space-y-4">
                    <div>
                      <Label htmlFor="whitelist">Add Wallet to Whitelist</Label>
                      <div className="flex space-x-2">
                        <Input 
                          id="whitelist"
                          value={newWhitelistWallet}
                          onChange={(e) => setNewWhitelistWallet(e.target.value)}
                          placeholder="Enter Solana address" 
                          className="bg-wybe-background-light border-wybe-primary/20 focus-visible:ring-wybe-primary"
                        />
                        <Button onClick={handleAddToWhitelist} className="shrink-0">
                          <Plus size={18} className="mr-2" />
                          Add
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Wallet</TableHead>
                          <TableHead>Added On</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {mockWhitelist.map((item, i) => (
                          <TableRow key={i}>
                            <TableCell className="font-mono">{item.wallet}</TableCell>
                            <TableCell>{item.added}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                item.status === "Active" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"
                              }`}>
                                {item.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleRemoveFromWhitelist(item.wallet)}
                                className="h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-400"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </motion.div>
            </TabsContent>
          </Tabs>
        )}
      </div>
      
      {/* Deploy to Mainnet Dialog */}
      <Dialog open={showDeployDialog} onOpenChange={setShowDeployDialog}>
        <DialogContent className="bg-wybe-background-light border-wybe-primary/20 sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Deploy to Mainnet</DialogTitle>
            <DialogDescription>
              This will deploy {selectedToken?.symbol} to Solana mainnet. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div className="bg-wybe-background/70 p-4 rounded-lg border border-white/10">
                <h4 className="text-sm font-medium mb-2">Token Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Name:</span>
                    <span>{selectedToken?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Symbol:</span>
                    <span>{selectedToken?.symbol}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Address:</span>
                    <span className="font-mono">{selectedToken?.address}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20">
                <p className="text-yellow-400 text-sm flex items-center gap-2">
                  <AlertTriangle size={16} />
                  <span>This will require paying Solana transaction fees from your admin wallet</span>
                </p>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-row sm:justify-between gap-3">
            <Button variant="ghost" onClick={() => setShowDeployDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeployToMainnet} className="btn-primary">
              <Rocket size={16} className="mr-2" />
              Deploy to Mainnet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

const AlertTriangle = ({ size = 24, className = "" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
      <path d="M12 9v4"></path>
      <path d="M12 17h.01"></path>
    </svg>
  );
};

export default Admin;
