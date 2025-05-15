
import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import AdminDashboard from '@/components/admin/AdminDashboard';
import TokenDeployment from './TokenDeployment';

const Admin = () => {
  const { pathname } = useLocation();
  const { tokenId } = useParams<{ tokenId?: string }>();
  
  // Render the appropriate component based on the current path
  const renderContent = () => {
    if (pathname.includes('token-deployment')) {
      return <TokenDeployment />; // Let TokenDeployment access tokenId via useParams
    }
    return <AdminDashboard />;
  };

  return renderContent();
};

export default Admin;
