
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
import SmartContractTestnet from "@/components/admin/SmartContractTestnet";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import TreasuryWalletManager from "@/components/admin/TreasuryWalletManager";
import DeploymentGuide from "@/components/admin/DeploymentGuide";
import DeploymentEnvironment from "@/components/admin/DeploymentEnvironment";
import AboutProject from "@/components/admin/AboutProject";
import MasterDeploymentGuide from "@/pages/MasterDeploymentGuide";
import { useIsMobile } from "@/hooks/use-mobile";
import useAdmin from "@/hooks/useAdmin";
import AdminUserManager from "@/components/admin/AdminUserManager";
import { 
  LayoutDashboard, 
  Check, 
  Settings, 
  Activity, 
  Package, 
  LogOut, 
  Folder,
  Wallet,
  Menu,
  Cloud,
  Info,
  Shield,
  Users,
  Network,
  FileCode
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Admin = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Use the admin hook with proper authentication
  const { isAuthenticated, isLoading, logout } = useAdmin();

  // State to control when to show content
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    // Check authentication immediately on component mount
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem("wybeAdminLoggedIn") === "true";
      const sessionExists = !!sessionStorage.getItem("wybeAdminSession");
      
      console.log("Admin page initial auth check:", { isLoggedIn, sessionExists });
      
      if (!isLoggedIn || !sessionExists) {
        console.log("Not authenticated, redirecting to login");
        navigate('/admin-login');
        return;
      }
      
      setShowContent(true);
    };
    
    checkAuth();

    // Check if there's an active tab stored in localStorage
    const storedActiveTab = localStorage.getItem('admin-active-tab');
    if (storedActiveTab) {
      setActiveTab(storedActiveTab);
      // Clear it after use
      localStorage.removeItem('admin-active-tab');
    }
  }, [navigate]);

  useEffect(() => {
    // Setup event listeners for data-attribute buttons and custom events
    const setupEventListeners = () => {
      // Environment button (from deployment page)
      document.querySelectorAll('[data-environment-btn]').forEach(btn => {
        btn.addEventListener('click', () => setActiveTab('environment'));
      });
      
      // Contract deployment button (from environment page)
      document.querySelectorAll('[data-contract-btn]').forEach(btn => {
        btn.addEventListener('click', () => setActiveTab('deployment'));
      });
      
      // Deployment env button (from contract page)
      document.querySelectorAll('[data-deployment-env-btn]').forEach(btn => {
        btn.addEventListener('click', () => setActiveTab('environment'));
      });
      
      // Testnet contracts button (from contract page)
      document.querySelectorAll('[data-testnet-btn]').forEach(btn => {
        btn.addEventListener('click', () => setActiveTab('testnet'));
      });

      // Setup custom event listeners for tab changes
      document.addEventListener('deployment-tab-request', () => setActiveTab('deployment'));
      document.addEventListener('testnet-tab-request', () => setActiveTab('testnet'));
      document.addEventListener('guide-tab-request', () => setActiveTab('guide'));
    };
    
    // Run setup after a short delay to ensure elements are rendered
    setTimeout(setupEventListeners, 500);

    return () => {
      // Clean up event listeners
      document.removeEventListener('deployment-tab-request', () => setActiveTab('deployment'));
      document.removeEventListener('testnet-tab-request', () => setActiveTab('testnet'));
      document.removeEventListener('guide-tab-request', () => setActiveTab('guide'));
    };
  }, []);

  // Show loading state if loading or content not ready
  if (isLoading || !showContent) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <div className="animate-pulse text-xl">Loading admin panel...</div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    console.log("useAdmin hook says not authenticated, redirecting to login");
    navigate('/admin-login');
    return null;
  }

  const handleLogout = () => {
    logout();
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
        { id: "deployment", label: "Contract Deployment", icon: <Package size={18} />, dataAttr: "deployment" },
        { id: "testnet", label: "Testnet Contracts", icon: <Network size={18} />, dataAttr: "testnet" },
        { id: "environment", label: "Deployment Environment", icon: <Cloud size={18} />, dataAttr: "environment" },
        { id: "guide", label: "Master Deployment Guide", icon: <FileCode size={18} />, dataAttr: "guide" },
        { id: "treasury", label: "Treasury Management", icon: <Wallet size={18} /> },
        { id: "analytics", label: "Analytics", icon: <Activity size={18} /> },
        { id: "about", label: "About Project", icon: <Info size={18} /> },
      ]
    },
    {
      id: "platform",
      label: "Platform",
      items: [
        { id: "permissions", label: "User Access", icon: <Shield size={18} /> },
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
    
    if (isMobile) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header adminOnly={true} />
      
      <div className="flex flex-1 w-full max-w-[1400px] mx-auto px-4 pt-20">
        {/* Mobile Menu Button */}
        <div className="md:hidden absolute top-20 left-4 z-30">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <button className="p-2 bg-orange-500/20 rounded-md">
                <Menu size={24} />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] pt-16 bg-black border-r border-white/10">
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
                          data-tab={item.dataAttr || item.id}
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
            </SheetContent>
          </Sheet>
        </div>
        
        {/* Sidebar - Desktop Only */}
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
                      data-tab={item.dataAttr || item.id}
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
        
        {/* Mobile Tab Navigation */}
        <div className="md:hidden w-full pb-4">
          <div className="overflow-x-auto pb-2 -mx-4 px-4">
            <div className="inline-flex min-w-full border-b border-white/10">
              <button 
                onClick={() => setActiveTab("dashboard")}
                className={`px-4 py-2 whitespace-nowrap ${activeTab === "dashboard" ? "text-orange-500 border-b-2 border-orange-500" : "text-white"}`}
              >
                Dashboard
              </button>
              <button 
                onClick={() => setActiveTab("contracts")}
                className={`px-4 py-2 whitespace-nowrap ${activeTab === "contracts" ? "text-orange-500 border-b-2 border-orange-500" : "text-white"}`}
              >
                Contracts
              </button>
              <button 
                onClick={() => setActiveTab("deployment")}
                className={`px-4 py-2 whitespace-nowrap ${activeTab === "deployment" ? "text-orange-500 border-b-2 border-orange-500" : "text-white"}`}
                data-tab="deployment"
              >
                Deploy
              </button>
              <button 
                onClick={() => setActiveTab("testnet")}
                className={`px-4 py-2 whitespace-nowrap ${activeTab === "testnet" ? "text-orange-500 border-b-2 border-orange-500" : "text-white"}`}
                data-tab="testnet"
              >
                Testnet
              </button>
              <button 
                onClick={() => setActiveTab("environment")}
                className={`px-4 py-2 whitespace-nowrap ${activeTab === "environment" ? "text-orange-500 border-b-2 border-orange-500" : "text-white"}`}
                data-tab="environment"
              >
                Environment
              </button>
              <button 
                onClick={() => setActiveTab("guide")}
                className={`px-4 py-2 whitespace-nowrap ${activeTab === "guide" ? "text-orange-500 border-b-2 border-orange-500" : "text-white"}`}
                data-tab="guide"
              >
                Guide
              </button>
              <button 
                onClick={() => setActiveTab("treasury")}
                className={`px-4 py-2 whitespace-nowrap ${activeTab === "treasury" ? "text-orange-500 border-b-2 border-orange-500" : "text-white"}`}
              >
                Treasury
              </button>
              <button 
                onClick={() => setActiveTab("settings")}
                className={`px-4 py-2 whitespace-nowrap ${activeTab === "settings" ? "text-orange-500 border-b-2 border-orange-500" : "text-white"}`}
              >
                Settings
              </button>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex-1 p-4 md:p-6 overflow-y-auto w-full md:ml-4"
        >
          {activeTab === "dashboard" && <AdminDashboard />}
          {activeTab === "approvals" && <PendingApprovals />}
          {activeTab === "analytics" && <AnalyticsDashboard />}
          {activeTab === "contracts" && <SmartContractDashboard />}
          {activeTab === "deployment" && <SmartContractDeployment />}
          {activeTab === "environment" && <DeploymentEnvironment />}
          {activeTab === "testnet" && <SmartContractTestnet />}
          {activeTab === "guide" && <MasterDeploymentGuide isAdminPanel={true} />}
          {activeTab === "treasury" && <TreasuryWalletManager />}
          {activeTab === "settings" && <AdminSettings />}
          {activeTab === "about" && <AboutProject />}
          {activeTab === "permissions" && <AdminUserManager />}
        </motion.div>
      </div>
      
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
};

export default Admin;
