
import React from 'react';
import { motion } from "framer-motion";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminLoginForm from '@/components/AdminLoginForm';
import { useScrollToTop } from '@/hooks/useScrollToTop';

const AdminLogin = () => {
  // Ensure the page starts at the top when loaded
  useScrollToTop();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-grow flex items-center justify-center py-16 px-4 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <AdminLoginForm />
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default AdminLogin;
