
import React from 'react';
import { useParams, useLocation, Navigate } from 'react-router-dom';
import AdminDashboard from '@/components/admin/AdminDashboard';
import TokenDeployment from './TokenDeployment';
import AdminTokens from './AdminTokens';
import SecurityReport from './SecurityReport';
import SmartContractDeployment from '@/components/admin/SmartContractDeployment';
import { DeploymentTests } from '@/components/admin/DeploymentTests';
import { useAdmin } from '@/hooks/useAdmin';
import AdminLayout from '@/components/layouts/AdminLayout';
import { toast } from 'sonner';

const Admin = () => {
  const { isAuthenticated, isLoading } = useAdmin();
  const { pathname } = useLocation();
  
  // Wait for authentication check to complete
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="container mx-auto p-6 flex items-center justify-center h-[60vh]">
          <p className="text-lg">Loading admin panel...</p>
        </div>
      </AdminLayout>
    );
  }
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    toast.error("Authentication required");
    return <Navigate to="/admin-login" replace />;
  }
  
  // Render the appropriate component based on the current path
  const renderContent = () => {
    if (pathname === '/admin/tokens') {
      return <AdminTokens />;
    }
    
    if (pathname.includes('/admin/token-deployment')) {
      return <TokenDeployment />;
    }
    
    if (pathname === '/admin/security-report') {
      return <SecurityReport />;
    }
    
    if (pathname === '/admin/smart-contract-deployment') {
      return (
        <AdminLayout>
          <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Smart Contract Deployment</h1>
            <SmartContractDeployment />
          </div>
        </AdminLayout>
      );
    }
    
    if (pathname === '/admin/deployment') {
      return (
        <AdminLayout>
          <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Deployment Environment</h1>
            <DeploymentTests 
              isRunningTest={false} 
              onRunTests={() => console.log('Running tests')} 
              deploymentNetwork="testnet" 
            />
          </div>
        </AdminLayout>
      );
    }
    
    // Default to dashboard
    return <AdminDashboard />;
  };

  return renderContent();
};

export default Admin;
