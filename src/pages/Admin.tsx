
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
  Download,
  ShieldCheck,
  Globe,
  Clock
} from "lucide-react";
import SmartContractSteps from "@/components/SmartContractSteps";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Shimmer } from "@/components/ui/shimmer";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import AdminPasswordReset from "@/components/AdminPasswordReset";

// Add components for each tab to make the file more manageable
import PendingApprovals from "@/components/admin/PendingApprovals";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import AdminSettings from "@/components/admin/AdminSettings";
import SmartContractDashboard from "@/components/admin/SmartContractDashboard";

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
      
      <main className="flex-grow container mx-auto px-4 py-8">
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
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="pending" className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="hidden sm:inline">Pending Approvals</span>
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

export default Admin;
