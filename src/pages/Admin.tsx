
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import PendingApprovals from "@/components/admin/PendingApprovals";
import AdminSettings from "@/components/admin/AdminSettings";
import SmartContractDashboard from "@/components/admin/SmartContractDashboard";
import SmartContractDeployment from "@/components/admin/SmartContractDeployment";
import { useNavigate } from "react-router-dom";
import { useWallet } from "@/hooks/useWallet";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { connected, address } = useWallet();
  const navigate = useNavigate();

  // Sample admin accounts for demo purposes
  const adminAccounts = [
    "8B5CF6FeDfC9SYnttGJKQsHqNPZhwGVkzkJEGnY8kaySvbSSNYNtw", 
    "7C3AEDHj9R5Tender3SbKgX1CnUAaTPyYyXU23WgfST1KFsPJE", 
    "6E59A53gF2KHp6KkE2HUMvhiL9aVyvyWpBJ2Pu2fGwFeJXdPSS"
  ];
  
  const isAdmin = connected && adminAccounts.includes(address);

  // Redirect if not admin
  React.useEffect(() => {
    if (!isAdmin) {
      navigate("/admin-login");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />
      
      <div className="flex flex-col flex-1 w-full max-w-[1400px] mx-auto px-4 md:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-poppins font-bold text-gradient mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your platform settings, tokens, and analytics</p>
        </motion.div>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="flex-1">
          <div className="border-b border-white/10 pb-3 mb-6">
            <TabsList className="space-x-2 bg-transparent">
              <TabsTrigger 
                value="dashboard" 
                className="data-[state=active]:bg-wybe-primary/20 data-[state=active]:text-wybe-primary font-poppins font-bold"
              >
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-wybe-primary/20 data-[state=active]:text-wybe-primary font-poppins font-bold"
              >
                Analytics
              </TabsTrigger>
              <TabsTrigger 
                value="approvals" 
                className="data-[state=active]:bg-wybe-primary/20 data-[state=active]:text-wybe-primary font-poppins font-bold"
              >
                Pending Approvals
              </TabsTrigger>
              <TabsTrigger 
                value="contracts" 
                className="data-[state=active]:bg-wybe-primary/20 data-[state=active]:text-wybe-primary font-poppins font-bold"
              >
                Smart Contracts
              </TabsTrigger>
              <TabsTrigger 
                value="deployment" 
                className="data-[state=active]:bg-wybe-primary/20 data-[state=active]:text-wybe-primary font-poppins font-bold"
              >
                Contract Deployment
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="data-[state=active]:bg-wybe-primary/20 data-[state=active]:text-wybe-primary font-poppins font-bold"
              >
                Settings
              </TabsTrigger>
            </TabsList>
          </div>
          
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <TabsContent value="dashboard" className="mt-0">
              <AdminDashboard />
            </TabsContent>
            
            <TabsContent value="analytics" className="mt-0">
              <AnalyticsDashboard />
            </TabsContent>
            
            <TabsContent value="approvals" className="mt-0">
              <PendingApprovals />
            </TabsContent>
            
            <TabsContent value="contracts" className="mt-0">
              <SmartContractDashboard />
            </TabsContent>
            
            <TabsContent value="deployment" className="mt-0">
              <SmartContractDeployment />
            </TabsContent>
            
            <TabsContent value="settings" className="mt-0">
              <AdminSettings />
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
      
      <Footer />
    </div>
  );
};

export default Admin;
