
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import AdminPasswordReset from "./AdminPasswordReset";
import { supabase } from "@/integrations/supabase/client";

const AdminLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Use the Supabase RPC function to authenticate admin
      const { data, error } = await supabase.rpc('authenticate_admin', {
        input_email: email,
        input_password: password
      });

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        throw new Error('Invalid credentials');
      }

      // Admin is authenticated, create session data
      const adminData = data[0];
      const sessionData = {
        id: adminData.id,
        email: adminData.email,
        permissions: ['all'], // Super admin has all permissions
        loginTime: Date.now(),
        expiryTime: Date.now() + (12 * 60 * 60 * 1000), // 12 hour expiry
      };
      
      // Set session data
      localStorage.setItem('wybeAdminLoggedIn', 'true');
      sessionStorage.setItem('wybeAdminSession', JSON.stringify(sessionData));
      
      toast.success('Login successful!');
      
      // Navigate to admin page
      setTimeout(() => {
        navigate('/admin', { replace: true });
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error("Login error:", error);
      toast.error('Invalid credentials. Please check email and password.');
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-6 w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
            placeholder="Enter your email"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pr-10"
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOffIcon className="h-4 w-4 text-gray-400" />
              ) : (
                <EyeIcon className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
          <div className="text-right text-sm">
            <AdminPasswordReset />
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </Button>
        
        <p className="text-sm text-center text-gray-400 mt-4">
          Demo credentials: <br />
          Email: <span className="text-white font-mono">admin@wybe.app</span> <br />
          Password: <span className="text-white font-mono">admin123</span>
        </p>
      </form>
    </div>
  );
};

export default AdminLoginForm;
