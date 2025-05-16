
import React from 'react';
import { motion } from "framer-motion";
import AdminLoginForm from '@/components/AdminLoginForm';
import Header from '@/components/Header';

const AdminLogin: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header adminOnly={true} />
      
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto py-20 px-4"
      >
        <div className="flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full max-w-md"
          >
            <AdminLoginForm />
          </motion.div>
        </div>
      </motion.main>
    </div>
  );
};

export default AdminLogin;
