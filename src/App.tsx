
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Discover from './pages/Discover';
import Trade from './pages/Trade';
import AdminLogin from './pages/AdminLogin';
import TradingHistory from './pages/TradingHistory';
import NotFoundPage from './pages/NotFound';
import AdminDashboard from '@/components/admin/AdminDashboard';
import TokenDeployment from './pages/TokenDeployment';
import { WalletProvider } from '@/hooks/useWallet.tsx';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Launch from './pages/Launch';

const App = () => {
  // You can add any global context providers or initial setup here

  return (
    <WalletProvider>
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
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/tokens" element={<AdminDashboard />} />
          <Route path="/admin/token-deployment" element={<TokenDeployment />} />
          <Route path="/admin/token-deployment/:tokenId" element={<TokenDeployment />} />
          <Route path="/admin/reset-password" element={<Discover />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </WalletProvider>
  );
};

export default App;
