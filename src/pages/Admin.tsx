
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import AdminGuide from './AdminGuide';
import AdminEnvironment from './AdminEnvironment';
import AdminAbout from './AdminAbout';
import AdminSettings from './AdminSettings';
import AdminTreasury from './AdminTreasury';
import AdminAnalytics from './AdminAnalytics';
import AdminUsers from './AdminUsers';
import AdminTokens from './AdminTokens';

const Admin = () => {
  return (
    <Routes>
      <Route index element={<AdminDashboard />} />
      <Route path="guide" element={<AdminGuide />} />
      <Route path="environment" element={<AdminEnvironment />} />
      <Route path="about" element={<AdminAbout />} />
      <Route path="settings" element={<AdminSettings />} />
      <Route path="treasury" element={<AdminTreasury />} />
      <Route path="analytics" element={<AdminAnalytics />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="tokens" element={<AdminTokens />} />
    </Routes>
  );
};

export default Admin;
