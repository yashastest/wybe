
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import SmartContractSteps from "@/components/SmartContractSteps";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Shimmer } from "@/components/ui/shimmer";
import Header from "@/components/Header";

const Admin = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleLogout = () => {
    toast.success("Logged out successfully");
    // Redirect to login page
    setTimeout(() => {
      window.location.href = "/admin-login";
    }, 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="mb-8"
        >
          <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gradient">Admin Dashboard</h1>
            <Button variant="outline" onClick={handleLogout} className="bg-wybe-background-light border-wybe-primary/20">
              Logout
            </Button>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="pending">Pending Approvals</TabsTrigger>
                <TabsTrigger value="contracts">Smart Contracts</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pending" className="space-y-4">
                {loading ? (
                  <LoadingPendingApprovals />
                ) : (
                  <PendingApprovals />
                )}
              </TabsContent>
              
              <TabsContent value="contracts">
                {loading ? (
                  <div className="glass-card p-6">
                    <Skeleton className="h-8 w-64 mb-4" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-6 w-3/4" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                      <Skeleton className="h-48 w-full" />
                      <Skeleton className="h-48 w-full" />
                    </div>
                  </div>
                ) : (
                  <SmartContractSteps className="glass-card" />
                )}
              </TabsContent>
              
              <TabsContent value="analytics">
                {loading ? (
                  <div className="glass-card p-6">
                    <Skeleton className="h-8 w-64 mb-4" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                      <Skeleton className="h-20 w-full" />
                    </div>
                    <Skeleton className="h-64 w-full" />
                  </div>
                ) : (
                  <AnalyticsDashboard />
                )}
              </TabsContent>
              
              <TabsContent value="settings">
                {loading ? (
                  <div className="glass-card p-6">
                    <Skeleton className="h-8 w-64 mb-4" />
                    <div className="space-y-4 mb-6">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                    <Skeleton className="h-10 w-32" />
                  </div>
                ) : (
                  <AdminSettings />
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

const LoadingPendingApprovals = () => {
  return (
    <div className="glass-card p-6">
      <Shimmer className="h-8 w-64 mb-4" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border border-white/5 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <Shimmer className="h-6 w-40" rounded="lg" />
              <Shimmer className="h-8 w-24" rounded="full" />
            </div>
            <div className="space-y-2">
              <Shimmer className="h-4 w-full" />
              <Shimmer className="h-4 w-3/4" />
            </div>
            <div className="flex justify-between mt-4">
              <Shimmer className="h-4 w-32" />
              <Shimmer className="h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PendingApprovals = () => {
  const approvals = [
    {
      id: "REQ-001",
      name: "Pepe Solana",
      symbol: "PEPES",
      email: "creator@pepesolana.com",
      telegram: "@pepesolcreator",
      status: "pending",
      description: "A new Pepe-themed token built on Solana with focus on community engagement and memes",
      submitted: "2023-05-12T14:30:00Z",
    },
    {
      id: "REQ-002",
      name: "Doge Sol",
      symbol: "DSOL",
      email: "founder@dogesol.io",
      telegram: "@dogesolfound",
      status: "pending",
      description: "Bringing the Doge meme to Solana ecosystem with innovative tokenomics and community rewards",
      submitted: "2023-05-12T16:45:00Z",
    },
    {
      id: "REQ-003",
      name: "Floki Fortune",
      symbol: "FLOKIF",
      email: "team@flokifortune.com",
      telegram: "@flokifortuneofficial",
      status: "pending",
      description: "A Floki-inspired token with a focus on charitable giving and community growth",
      submitted: "2023-05-13T09:15:00Z",
    }
  ];
  
  const handleApprove = (id) => {
    toast.success(`Approved request ${id}`);
  };
  
  const handleReject = (id) => {
    toast.success(`Rejected request ${id}`);
  };
  
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className="glass-card p-6"
    >
      <h2 className="text-xl font-bold mb-4">Whitelist Requests</h2>
      <div className="space-y-4">
        {approvals.map((request, index) => (
          <motion.div 
            key={request.id}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { 
                opacity: 1, 
                y: 0,
                transition: { duration: 0.3, delay: index * 0.1 }
              }
            }}
            className="border border-wybe-primary/20 rounded-lg p-4 bg-gradient-to-r from-wybe-background-light to-transparent hover:border-wybe-primary/40 transition-colors"
          >
            <div className="flex justify-between items-center mb-2">
              <div>
                <h3 className="text-lg font-medium">{request.name} <span className="text-wybe-primary">({request.symbol})</span></h3>
                <p className="text-sm text-gray-400">Request ID: {request.id}</p>
              </div>
              <div className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs uppercase font-bold">
                {request.status}
              </div>
            </div>
            <p className="text-sm text-gray-300 mb-3">{request.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white/5 rounded p-2">
                <p className="text-xs text-gray-400">Contact Email</p>
                <p className="text-sm">{request.email}</p>
              </div>
              <div className="bg-white/5 rounded p-2">
                <p className="text-xs text-gray-400">Telegram</p>
                <p className="text-sm">{request.telegram}</p>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-400">
                Submitted on {new Date(request.submitted).toLocaleString()}
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-400"
                  size="sm"
                  onClick={() => handleReject(request.id)}
                >
                  Reject
                </Button>
                <Button 
                  className="bg-green-500/80 hover:bg-green-500 text-white"
                  size="sm"
                  onClick={() => handleApprove(request.id)}
                >
                  Approve
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const AnalyticsDashboard = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className="glass-card p-6"
    >
      <h2 className="text-xl font-bold mb-6">Platform Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="glass-card p-4 bg-gradient-to-r from-purple-500/20 to-transparent"
        >
          <p className="text-sm text-gray-400">Total Tokens Launched</p>
          <h3 className="text-2xl font-bold text-gradient">247</h3>
          <p className="text-xs text-green-400">+12% from last month</p>
        </motion.div>
        
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { delay: 0.1 } }
          }}
          className="glass-card p-4 bg-gradient-to-r from-blue-500/20 to-transparent"
        >
          <p className="text-sm text-gray-400">Total Trading Volume</p>
          <h3 className="text-2xl font-bold text-gradient">$4.2M</h3>
          <p className="text-xs text-green-400">+8.3% from last month</p>
        </motion.div>
        
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { delay: 0.2 } }
          }}
          className="glass-card p-4 bg-gradient-to-r from-green-500/20 to-transparent"
        >
          <p className="text-sm text-gray-400">Active Users</p>
          <h3 className="text-2xl font-bold text-gradient">5,487</h3>
          <p className="text-xs text-green-400">+15.7% from last month</p>
        </motion.div>
      </div>
      
      <motion.div 
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { delay: 0.3 } }
        }}
        className="glass-card p-4 h-64 bg-gradient-to-b from-wybe-background-light to-transparent mb-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium">Trading Volume (Last 30 Days)</h3>
          <div className="bg-wybe-primary/20 text-wybe-primary px-3 py-1 rounded-full text-xs">
            Chart view
          </div>
        </div>
        <div className="w-full h-40 flex items-center justify-center">
          <p className="text-gray-400">Analytics chart placeholder</p>
        </div>
      </motion.div>
      
      <motion.div 
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { delay: 0.4 } }
        }}
      >
        <p className="text-center text-gray-400 text-sm">
          Analytics data last updated: {new Date().toLocaleString()}
        </p>
      </motion.div>
    </motion.div>
  );
};

const AdminSettings = () => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className="glass-card p-6"
    >
      <motion.h2 
        className="text-xl font-bold mb-6"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 }
        }}
      >
        Admin Settings
      </motion.h2>
      
      <motion.div
        className="space-y-6 max-w-2xl"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <h3 className="font-medium mb-2">Platform Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="font-medium">Maintenance Mode</p>
                <p className="text-xs text-gray-400">Temporarily disable public access to platform</p>
              </div>
              <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs">
                Disabled
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="font-medium">Token Approvals</p>
                <p className="text-xs text-gray-400">Require manual approval for new tokens</p>
              </div>
              <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs">
                Enabled
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="font-medium">Fee Distribution</p>
                <p className="text-xs text-gray-400">Automatically distribute fees to creators</p>
              </div>
              <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs">
                Enabled
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { delay: 0.2 } }
          }}
        >
          <h3 className="font-medium mb-2">Admin Access</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="font-medium">admin@wybe.com</p>
                <p className="text-xs text-gray-400">Super Admin</p>
              </div>
              <Button variant="outline" className="bg-wybe-background border-wybe-primary/30 text-wybe-primary text-xs h-8">
                Manage Permissions
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="font-medium">support@wybe.com</p>
                <p className="text-xs text-gray-400">Support Staff</p>
              </div>
              <Button variant="outline" className="bg-wybe-background border-wybe-primary/30 text-wybe-primary text-xs h-8">
                Manage Permissions
              </Button>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { delay: 0.3 } }
          }}
          className="pt-4"
        >
          <Button className="btn-primary">Save Settings</Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Admin;
