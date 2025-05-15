
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import AdminDashboard from '@/components/admin/AdminDashboard';
import TokenDeployment from './TokenDeployment';

const Admin = () => {
  const { pathname } = useLocation();
  
  // Render the appropriate component based on the current path
  const renderContent = () => {
    if (pathname.includes('token-deployment')) {
      return <TokenDeployment />;  // TokenDeployment will access tokenId from useParams itself
    }
    return <AdminDashboard />;
  };

  return renderContent();
};

export default Admin;
