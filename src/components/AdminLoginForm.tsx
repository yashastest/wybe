
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom';
import AdminPasswordReset from './AdminPasswordReset';

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
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In production, this would be replaced with an actual API call
      if (username === 'admin' && password === 'password') {
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
  
  return (
    <div className="glass-card p-6 max-w-md w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
      
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="username" className="text-sm font-medium">
            Username
          </label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            className="bg-wybe-background/40 border-wybe-primary/20"
            disabled={isLoading}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="bg-wybe-background/40 border-wybe-primary/20"
            disabled={isLoading}
            required
          />
        </div>
        
        <div className="flex items-center justify-between pt-2">
          <AdminPasswordReset />
          <Button 
            type="submit"
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminLoginForm;
