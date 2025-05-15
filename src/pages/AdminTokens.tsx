
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import AdminLayout from '@/components/layouts/AdminLayout';
import TokensList from '@/components/admin/TokensList';
import { useAdmin } from '@/hooks/useAdmin';
import { supabase } from '@/integrations/supabase/client';

const AdminTokens: React.FC = () => {
  const { isAuthenticated, isLoading } = useAdmin();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Authentication required");
      navigate('/admin-login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <AdminLayout>
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Token Management</h1>
        
        <div className="space-y-6">
          <TokensList />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminTokens;
