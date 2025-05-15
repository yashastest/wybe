
import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

type AdminLayoutProps = {
  children: React.ReactNode;
};

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [pageTitle, setPageTitle] = useState('Dashboard');
  const location = useLocation();
  
  // Extract page title from path
  useEffect(() => {
    const path = location.pathname;
    let title = 'Dashboard';
    
    if (path === '/admin') {
      title = 'Dashboard';
    } else {
      // Extract the last segment of the path and capitalize it
      const segments = path.split('/').filter(Boolean);
      if (segments.length > 1) {
        title = segments[segments.length - 1]
          .split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }
    }
    
    setPageTitle(title);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-black to-gray-900">
      <AdminSidebar />
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gradient mb-1">{pageTitle}</h1>
          <p className="text-gray-400">Manage your platform resources and settings</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default AdminLayout;
