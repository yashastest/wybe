
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';
import Index from '@/pages/Index';
import Launch from '@/pages/Launch';
import LaunchToken from '@/pages/LaunchToken';
import LaunchPackage from '@/pages/LaunchPackage';
import Dashboard from '@/pages/Dashboard';
import Discover from '@/pages/Discover';
import TradeDemo from '@/pages/TradeDemo';
import Trade from '@/pages/Trade';
import TokenTrade from '@/pages/TokenTrade';
import TradingHistory from '@/pages/TradingHistory';
import AdminLayout from '@/pages/AdminLayout';
import AdminLogin from '@/pages/AdminLogin';
import NotFound from '@/pages/NotFound';
import AuthenticatedRoute from '@/components/AuthenticatedRoute';

function App() {
  return (
    <Router>
      <Toaster position="bottom-right" />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/launch" element={<Launch />} />
        <Route path="/launch-token" element={<LaunchToken />} />
        <Route path="/package" element={<LaunchPackage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/trade-demo" element={<TradeDemo />} />
        <Route path="/trade" element={<Trade />} />
        <Route path="/trade/:tokenId" element={<Trade />} />
        <Route path="/token/:tokenId" element={<TokenTrade />} />
        <Route path="/trading-history" element={<TradingHistory />} />
        
        {/* Admin routes */}
        <Route path="/admin" element={<AuthenticatedRoute><AdminLayout /></AuthenticatedRoute>} />
        <Route path="/admin-login" element={<AdminLogin />} />
        {/* Add more admin routes here as needed */}
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
