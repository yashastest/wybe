
import React, { useState, useEffect } from "react";
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
import { 
  LayoutDashboard, 
  Check, 
  Settings, 
  Activity, 
  Package, 
  LogOut, 
  Folder 
} from "lucide-react";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const navigate = useNavigate();

  // Check if user is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("wybeAdminLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/admin-login");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("wybeAdminLoggedIn");
    navigate("/admin-login");
  };

  // Admin sections
  const adminSections = [
    {
      id: "main",
      label: "Main",
      items: [
        { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
        { id: "approvals", label: "Approvals", icon: <Check size={18} /> },
        { id: "contracts", label: "Smart Contracts", icon: <Folder size={18} /> },
        { id: "analytics", label: "Analytics", icon: <Activity size={18} /> },
      ]
    },
    {
      id: "platform",
      label: "Platform",
      items: [
        { id: "projects", label: "Projects", icon: <Package size={18} /> },
        { id: "activity", label: "Activity", icon: <Activity size={18} /> },
      ]
    },
    {
      id: "system",
      label: "System",
      items: [
        { id: "settings", label: "Settings", icon: <Settings size={18} /> },
        { id: "logout", label: "Logout", icon: <LogOut size={18} />, action: handleLogout }
      ]
    }
  ];

  const handleNavClick = (tabId, action) => {
    if (action) {
      action();
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header adminOnly={true} />
      
      {/* Added top padding to create space */}
      <div className="flex flex-1 w-full max-w-[1400px] mx-auto pt-20">
        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="w-64 border-r border-white/10 p-4 hidden md:block"
        >
          {adminSections.map((section) => (
            <div key={section.id} className="mb-6">
              <h3 className="text-gray-400 uppercase text-xs font-semibold mb-3 pl-2">
                {section.label}
              </h3>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavClick(item.id, item.action)}
                      className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-3 transition-colors ${
                        activeTab === item.id && !item.action
                          ? "bg-orange-500/20 text-orange-500"
                          : "hover:bg-white/5"
                      }`}
                    >
                      <span className={activeTab === item.id && !item.action ? "text-orange-500" : "text-gray-400"}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
        
        {/* Mobile Tabs */}
        <div className="md:hidden w-full px-4 pt-4">
          <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full bg-transparent border border-white/10 rounded-lg p-1">
              <TabsTrigger 
                value="dashboard" 
                className="flex-1 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-500"
              >
                <LayoutDashboard size={16} className="mr-1" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="approvals" 
                className="flex-1 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-500"
              >
                <Check size={16} className="mr-1" />
                Approvals
              </TabsTrigger>
              <TabsTrigger 
                value="settings" 
                className="flex-1 data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-500"
              >
                <Settings size={16} className="mr-1" />
                Settings
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {/* Main Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-4 md:p-6 overflow-y-auto"
        >
          {activeTab === "dashboard" && <AdminDashboard />}
          {activeTab === "approvals" && <PendingApprovals />}
          {activeTab === "analytics" && <AnalyticsDashboard />}
          {activeTab === "contracts" && <SmartContractDashboard />}
          {activeTab === "deployment" && <SmartContractDeployment />}
          {activeTab === "settings" && <AdminSettings />}
          {activeTab === "projects" && (
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4">Projects</h2>
              <p className="text-gray-300">View and manage platform projects.</p>
            </div>
          )}
          {activeTab === "activity" && (
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold mb-4">Activity Log</h2>
              <p className="text-gray-300">Track platform activity and events.</p>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Added bottom padding for footer clearance */}
      <div className="pb-6"></div>
      
      <Footer />
    </div>
  );
};

export default Admin;
