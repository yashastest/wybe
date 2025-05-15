
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import AdminLayout from '@/components/layouts/AdminLayout';
import TokenDeploymentPanel from '@/components/admin/TokenDeploymentPanel';
import { useAdmin } from '@/hooks/useAdmin';

const TokenDeployment: React.FC = () => {
  const { isAuthenticated, isLoading } = useAdmin();
  const navigate = useNavigate();
  const { tokenId } = useParams<{ tokenId?: string }>();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Authentication required");
      navigate('/admin-login');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">
          {tokenId ? "Deploy Existing Token" : "Create & Deploy New Token"}
        </h1>
        
        <TokenDeploymentPanel tokenId={tokenId} />
      </div>
    </AdminLayout>
  );
};

export default TokenDeployment;
