
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import Launch from './pages/Launch';
import LaunchPackage from './pages/LaunchPackage';
import Discover from './pages/Discover';
import Trade from './pages/Trade';
import TokenTrade from './pages/TokenTrade';
import NotFound from './pages/NotFound';
import { Toaster } from "sonner";
import SecurityReport from './pages/SecurityReport';
import TokenDeployment from './pages/TokenDeployment';
import { WalletProvider } from '@/hooks/useWallet.tsx';
import BondingCurves from './pages/BondingCurves';

function App() {
  return (
    <div className="min-h-screen bg-black text-white">
      <WalletProvider>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/launch" element={<Launch />} />
          <Route path="/package" element={<LaunchPackage />} />
          <Route path="/launch/:packageId" element={<LaunchPackage />} />
          <Route path="/discover" element={<Discover />} />
          <Route path="/trade" element={<Trade />} />
          <Route path="/trade/:tokenId" element={<TokenTrade />} />
          <Route path="/security-report" element={<SecurityReport />} />
          <Route path="/token-deployment" element={<TokenDeployment />} />
          <Route path="/token-deployment/:tokenId" element={<TokenDeployment />} />
          <Route path="/bonding-curves" element={<BondingCurves />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster position="top-center" />
      </WalletProvider>
    </div>
  );
}

export default App;
