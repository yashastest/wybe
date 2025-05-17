
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Discover from "./pages/Discover";
import Launch from "./pages/Launch";
import TradeDemo from "./pages/TradeDemo";
import NotFound from "./pages/NotFound";
import SecurityReport from "./pages/SecurityReport";
import BondingCurves from "./pages/BondingCurves";
import Dashboard from "./pages/Dashboard";
import LaunchPackage from "./pages/LaunchPackage";
import Index from "./pages/Index";
import ScrollToTop from "./components/ScrollToTop";
import Admin from "./pages/Admin";
import AdminTokens from "./pages/AdminTokens";
import TokenDeployment from "./pages/TokenDeployment";
import AdminLogin from "./pages/AdminLogin";
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import DeveloperRoadmap from "./pages/DeveloperRoadmap";

function App() {
  return (
    // NOTE: Router is moved to main.tsx to ensure all components have proper context
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/launch" element={<Launch />} />
        <Route path="/trade-demo" element={<TradeDemo />} />
        <Route path="/package" element={<LaunchPackage />} />
        <Route path="/security-report" element={<SecurityReport />} />
        <Route path="/bonding-curves" element={<BondingCurves />} />
        <Route path="/developer-roadmap" element={<DeveloperRoadmap />} />
        
        {/* Admin routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route 
          path="/admin" 
          element={
            <AuthenticatedRoute>
              <Admin />
            </AuthenticatedRoute>
          } 
        />
        <Route 
          path="/admin/tokens" 
          element={
            <AuthenticatedRoute>
              <AdminTokens />
            </AuthenticatedRoute>
          } 
        />
        <Route 
          path="/admin/token-deployment" 
          element={
            <AuthenticatedRoute>
              <TokenDeployment />
            </AuthenticatedRoute>
          } 
        />
        <Route 
          path="/admin/token-deployment/:tokenId" 
          element={
            <AuthenticatedRoute>
              <TokenDeployment />
            </AuthenticatedRoute>
          } 
        />
        <Route 
          path="/admin/security-report" 
          element={
            <AuthenticatedRoute>
              <SecurityReport />
            </AuthenticatedRoute>
          } 
        />
        <Route 
          path="/admin/smart-contract-deployment" 
          element={
            <AuthenticatedRoute>
              <Admin />
            </AuthenticatedRoute>
          } 
        />
        <Route 
          path="/admin/deployment" 
          element={
            <AuthenticatedRoute>
              <Admin />
            </AuthenticatedRoute>
          } 
        />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
