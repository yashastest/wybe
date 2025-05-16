
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AdminLayout from '@/components/layouts/AdminLayout';
import TokensList from '@/components/admin/TokensList';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ListedToken } from '@/services/token/types'; // Correct import
import { tokenTradingService } from '@/services/tokenTradingService';

const AdminTokens: React.FC = () => {
  const { isAuthenticated, isLoading } = useAdmin();
  const [tokens, setTokens] = useState<ListedToken[]>([]); // Use ListedToken directly
  const [isLoadingTokens, setIsLoadingTokens] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Authentication required");
      navigate('/admin-login');
    } else if (isAuthenticated) {
      loadTokens();
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  const loadTokens = async () => {
    setIsLoadingTokens(true);
    try {
      const listedTokens = await tokenTradingService.getListedTokens();
      // listedTokens are already of type ListedToken from types.ts (due to service update)
      // No complex conversion needed if the service returns the correct type.
      setTokens(listedTokens);
    } catch (error) {
      console.error("Error loading tokens:", error);
      toast.error("Failed to load tokens");
    } finally {
      setIsLoadingTokens(false);
    }
  };
  
  const handleCreateToken = () => {
    navigate('/admin/token-deployment');
  };

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Token Management</h1>
          
          <Button 
            onClick={handleCreateToken}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create New Token
          </Button>
        </div>
        
        <div className="space-y-6">
          <TokensList 
            tokens={tokens} 
            isLoading={isLoadingTokens} 
            onRefresh={loadTokens}
          />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTokens;
