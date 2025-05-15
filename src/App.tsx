import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import Discover from './pages/Discover';
import CreateToken from './pages/CreateToken';
import Trade from './pages/Trade';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminPasswordReset from './pages/AdminPasswordReset';
import NotFoundPage from './pages/NotFoundPage';
import TradingHistory from './pages/TradingHistory';

const App = () => {
  // You can add any global context providers or initial setup here

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/create" element={<CreateToken />} />
        <Route path="/trade/:tokenId?" element={<Trade />} />
        <Route path="/trading-history" element={<TradingHistory />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/reset-password" element={<AdminPasswordReset />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
