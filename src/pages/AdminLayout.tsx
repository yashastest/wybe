
import React from 'react';
import { motion } from "framer-motion";
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useAdmin } from '@/hooks/useAdmin';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdmin();
  const navigate = useNavigate();
  
  // Check if user is authenticated
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Authentication required");
      navigate('/admin-login');
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white p-4">
        <div className="flex items-center justify-center h-screen">
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }
  
  // Only render content if authenticated
  if (!isAuthenticated) {
    return null; // Will be redirected by the useEffect hook
  }
  
  return (
    <div className="min-h-screen bg-black text-white flex">
      <AdminSidebar />
      
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex-1 ml-64 pt-6"
      >
        {children}
      </motion.main>
    </div>
  );
};

export default AdminLayout;
