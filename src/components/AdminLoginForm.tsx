
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import { Loader } from "lucide-react";

const AdminLoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      toast.error('Username and password are required');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate authentication request
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In production, this would be replaced with an actual API call
      if (username === 'admin' && password === 'password') {
        // Save login state to localStorage for persistence
        localStorage.setItem("wybeAdminLoggedIn", "true");
        toast.success('Login successful');
        navigate('/admin');
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  return (
    <motion.div 
      className="glass-card p-8 max-w-md w-full mx-auto shadow-glow-sm"
      initial="hidden"
      animate="visible"
      variants={formVariants}
    >
      <motion.div variants={itemVariants} className="mb-8 text-center">
        <h2 className="text-3xl font-bold mb-2">
          <span className="text-gradient">Admin Login</span>
        </h2>
        <p className="text-gray-400">
          Sign in to access the admin dashboard
        </p>
      </motion.div>
      
      <motion.form onSubmit={handleLogin} className="space-y-5" variants={itemVariants}>
        <motion.div className="space-y-2" variants={itemVariants}>
          <label htmlFor="username" className="text-sm font-medium">
            Username
          </label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="bg-wybe-background/40 border-wybe-primary/20 focus-visible:ring-wybe-primary/70"
            disabled={isLoading}
            required
          />
        </motion.div>
        
        <motion.div className="space-y-2" variants={itemVariants}>
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="bg-wybe-background/40 border-wybe-primary/20 focus-visible:ring-wybe-primary/70"
            disabled={isLoading}
            required
          />
        </motion.div>
        
        <motion.div className="flex justify-end items-center pt-2" variants={itemVariants}>
          <Button 
            type="submit"
            className="btn-primary w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2 justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <Loader size={16} />
                </motion.div>
                <span>Logging in...</span>
              </div>
            ) : 'Login'}
          </Button>
        </motion.div>
      </motion.form>

      <motion.div 
        className="mt-6 pt-6 border-t border-white/10 text-center text-sm text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p>Use the credentials provided by admin</p>
        <p className="text-xs mt-1">(Default: admin/password)</p>
      </motion.div>
    </motion.div>
  );
};

export default AdminLoginForm;
