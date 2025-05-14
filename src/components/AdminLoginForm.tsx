
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import AdminPasswordReset from "./AdminPasswordReset";

const AdminLoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // For demo purposes - in a real app, this would be an API call
    setTimeout(() => {
      // Demo credentials - in production, this would validate against a database
      if (username === 'admin' && password === 'admin123') {
        console.log("Credentials valid, setting session data");
        
        // Clear any previous session data first
        localStorage.removeItem('wybeAdminLoggedIn');
        sessionStorage.removeItem('wybeAdminSession');
        
        // Set new session data
        localStorage.setItem('wybeAdminLoggedIn', 'true');
        sessionStorage.setItem('wybeAdminSession', Date.now().toString());
        
        toast.success('Login successful!');
        
        // Force a small delay before navigation to ensure session data is set
        setTimeout(() => {
          console.log("Redirecting to admin panel");
          navigate('/admin');
        }, 100);
      } else {
        toast.error('Invalid credentials. Please check username and password.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="glass-card p-6 w-full max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-medium">
            Username
          </label>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full"
            placeholder="Enter your username"
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
          Username: <span className="text-white font-mono">admin</span> <br />
          Password: <span className="text-white font-mono">admin123</span>
        </p>
      </form>
    </div>
  );
};

export default AdminLoginForm;
