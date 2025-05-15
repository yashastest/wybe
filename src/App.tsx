
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Discover from './pages/Discover';
import Trade from './pages/Trade';
import AdminLogin from './pages/AdminLogin';
import TradingHistory from './pages/TradingHistory';
import NotFoundPage from './pages/NotFound';
import AdminDashboard from '@/components/admin/AdminDashboard';
import TokenDeployment from './pages/TokenDeployment';

const App = () => {
  // You can add any global context providers or initial setup here

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Discover />} />
        <Route path="/about" element={<Discover />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/create" element={<Discover />} />
        <Route path="/trade/:tokenId?" element={<Trade />} />
        <Route path="/trading-history" element={<TradingHistory />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/tokens" element={<AdminDashboard />} />
        <Route path="/admin/token-deployment" element={<TokenDeployment />} />
        <Route path="/admin/token-deployment/:tokenId" element={<TokenDeployment />} />
        <Route path="/admin/reset-password" element={<Discover />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
