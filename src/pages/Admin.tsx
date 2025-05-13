
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { 
  BarChart3, 
  Layers, 
  Users, 
  Settings, 
  LogOut, 
  Rocket, 
  FileCode2,
  ShieldCheck,
  Clock,
  Home
} from "lucide-react";
import SmartContractSteps from "@/components/SmartContractSteps";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Shimmer } from "@/components/ui/shimmer";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "@/components/Header";
import AdminPasswordReset from "@/components/AdminPasswordReset";

// Import admin components
import PendingApprovals from "@/components/admin/PendingApprovals";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import AdminSettings from "@/components/admin/AdminSettings";
import SmartContractDashboard from "@/components/admin/SmartContractDashboard";
import AdminDashboard from "@/components/admin/AdminDashboard";

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
    <div className="min-h-screen flex flex-col bg-black">
      <Header adminOnly={true} />
      
      <div className="flex flex-grow overflow-hidden">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-[250px] bg-black border-r border-white/10 hidden md:flex flex-col p-4"
        >
          <div className="mb-8 px-4">
            <h2 className="text-xl font-bold text-gradient">Admin Panel</h2>
            <p className="text-xs text-gray-400 mt-1">Manage platform & users</p>
          </div>
          
          <ScrollArea className="flex-grow pr-4">
            <div className="space-y-1 mb-6">
              <p className="text-xs text-gray-500 uppercase font-semibold px-4 pb-2">Main</p>
              <SidebarLink icon={<Home className="w-4 h-4" />} text="Dashboard" active={true} />
              <SidebarLink icon={<ShieldCheck className="w-4 h-4" />} text="Approvals" />
              <SidebarLink icon={<FileCode2 className="w-4 h-4" />} text="Smart Contracts" />
              <SidebarLink icon={<BarChart3 className="w-4 h-4" />} text="Analytics" />
            </div>
            
            <div className="space-y-1 mb-6">
              <p className="text-xs text-gray-500 uppercase font-semibold px-4 pb-2">Management</p>
              <SidebarLink icon={<Users className="w-4 h-4" />} text="Users" />
              <SidebarLink icon={<Layers className="w-4 h-4" />} text="Projects" />
              <SidebarLink icon={<Clock className="w-4 h-4" />} text="Activity" />
            </div>
            
            <div className="space-y-1">
              <p className="text-xs text-gray-500 uppercase font-semibold px-4 pb-2">Platform</p>
              <SidebarLink icon={<Settings className="w-4 h-4" />} text="Settings" />
              <SidebarLink icon={<LogOut className="w-4 h-4" />} text="Logout" onClick={handleLogout} />
            </div>
          </ScrollArea>
          
          <div className="mt-auto pt-4 px-3">
            <div className="p-3 rounded-lg bg-wybe-primary/10 border border-wybe-primary/20">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-wybe-primary/20 flex items-center justify-center">
                  <Rocket className="w-4 h-4 text-wybe-primary" />
                </div>
                <div className="ml-3">
                  <p className="text-xs font-medium">Admin</p>
                  <p className="text-xs text-gray-400">admin@wybe.com</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Main content */}
        <main className="flex-grow container px-4 py-8 overflow-y-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="mb-8"
          >
            <motion.div variants={itemVariants} className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gradient">Admin Dashboard</h1>
              <div className="flex items-center gap-3">
                <AdminPasswordReset />
                <Button variant="outline" onClick={handleLogout} className="bg-wybe-background-light border-wybe-primary/20">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Tabs defaultValue="dashboard" className="w-full">
                <TabsList className="grid grid-cols-2 md:grid-cols-5 mb-8">
                  <TabsTrigger value="dashboard" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <span className="hidden sm:inline">Dashboard</span>
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span className="hidden sm:inline">Approvals</span>
                    <span className="sm:hidden">Approvals</span>
                  </TabsTrigger>
                  <TabsTrigger value="contracts" className="flex items-center gap-2">
                    <FileCode2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Smart Contracts</span>
                    <span className="sm:hidden">Contracts</span>
                  </TabsTrigger>
                  <TabsTrigger value="analytics" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" />
                    <span>Analytics</span>
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="dashboard" className="space-y-4">
                  {loading ? (
                    <LoadingDashboard />
                  ) : (
                    <AdminDashboard />
                  )}
                </TabsContent>
                
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
                    <SmartContractDashboard />
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
    </div>
  );
};

const SidebarLink = ({ icon, text, active = false, onClick = () => {} }) => {
  return (
    <button 
      className={`flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm transition-colors ${
        active ? 'bg-wybe-primary/20 text-wybe-primary' : 'hover:bg-white/5'
      }`}
      onClick={onClick}
    >
      {icon}
      <span>{text}</span>
    </button>
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

const LoadingDashboard = () => {
  return (
    <div className="space-y-8">
      <Shimmer className="h-10 w-64 mb-4" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="glass-card p-6">
            <div className="flex justify-between mb-4">
              <Shimmer className="h-16 w-16" rounded="lg" />
              <Shimmer className="h-12 w-12" rounded="full" />
            </div>
            <Shimmer className="h-4 w-20 mb-2" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card p-6 lg:col-span-2">
          <Shimmer className="h-6 w-40 mb-4" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Shimmer key={i} className="h-16 w-full" rounded="lg" />
            ))}
          </div>
        </div>
        <div className="glass-card p-6">
          <Shimmer className="h-6 w-40 mb-4" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Shimmer key={i} className="h-12 w-full" rounded="lg" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
