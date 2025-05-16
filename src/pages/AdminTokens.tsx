
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AdminLayout from '@/components/layouts/AdminLayout';
import TokensList from '@/components/admin/TokensList';
import { useAdmin } from '@/hooks/useAdmin';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ListedToken as TokenType } from '@/services/token/types';
import { tokenTradingService } from '@/services/tokenTradingService';

const AdminTokens: React.FC = () => {
  const { isAuthenticated, isLoading } = useAdmin();
  const [tokens, setTokens] = useState<TokenType[]>([]);
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
      
      // Convert from tokenTradingService.ListedToken to token/types.ListedToken
      // Ensuring that all required properties are present
      const convertedTokens: TokenType[] = listedTokens.map(token => ({
        id: token.id,
        symbol: token.symbol,
        name: token.name,
        price: token.price,
        priceChange24h: token.priceChange24h,
        logo: token.logo,
        contractAddress: token.contractAddress || '',
        marketCap: token.marketCap,
        volume24h: token.volume24h,
        totalSupply: token.totalSupply,
        description: token.description,
        isAssisted: token.isAssisted,
        creatorAddress: token.creatorAddress
        // Add any other required properties from TokenType
      }));
      
      setTokens(convertedTokens);
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
