
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Discover from './pages/Discover';
import Trade from './pages/Trade';
import AdminLogin from './pages/AdminLogin';
import TradingHistory from './pages/TradingHistory';
import NotFoundPage from './pages/NotFound';
import Admin from './pages/Admin';
import AdminTokens from './pages/AdminTokens';
import TokenDeployment from './pages/TokenDeployment';
import SecurityReport from './pages/SecurityReport';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Launch from './pages/Launch';
import BondingCurves from './pages/BondingCurves';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<Discover />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/create" element={<Discover />} />
        <Route path="/trade/:tokenId?" element={<Trade />} />
        <Route path="/trading-history" element={<TradingHistory />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/launch" element={<Launch />} />
        <Route path="/bonding-curves" element={<BondingCurves />} />
        <Route path="/security-report" element={<SecurityReport />} />
          
        {/* Admin routes */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/tokens" element={<AdminTokens />} />
        <Route path="/admin/token-deployment" element={<TokenDeployment />} />
        <Route path="/admin/token-deployment/:tokenId" element={<TokenDeployment />} />
        <Route path="/admin/security-report" element={<SecurityReport />} />
        <Route path="/admin/smart-contract-deployment" element={<Admin />} />
        <Route path="/admin/deployment" element={<Admin />} />
          
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
