
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from '@/components/admin/AdminDashboard';
import TokenDeployment from './TokenDeployment';

const Admin = () => {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="tokens" element={<AdminDashboard />} />
      <Route path="token-deployment" element={<TokenDeployment />} />
      <Route path="token-deployment/:tokenId" element={<TokenDeployment />} />
      <Route path="*" element={<AdminDashboard />} />
    </Routes>
  );
};

export default Admin;
