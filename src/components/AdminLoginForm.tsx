
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import AdminPasswordReset from './AdminPasswordReset';

const AdminLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Call the auth-admin edge function to authenticate
      const { data, error } = await supabase.functions.invoke('auth-admin', {
        body: { email, password }
      });
      
      if (error || !data.success) {
        throw new Error(error?.message || data?.error || 'Invalid credentials');
      }
      
      // Authentication successful
      toast.success('Login successful!');
      
      // Store admin session data
      localStorage.setItem('wybeAdminLoggedIn', 'true');
      sessionStorage.setItem('wybeAdminSession', JSON.stringify({
        admin: data.admin,
        session: data.session
      }));
      
      // Redirect to admin dashboard
      navigate('/admin', { replace: true });
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed: ' + (error.message || 'Invalid credentials'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full bg-wybe-background-light border-white/5">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          <span className="text-white">Admin </span>
          <span className="text-orange-500">Login</span>
        </CardTitle>
        <CardDescription className="text-center">Enter your credentials to access the administration panel</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email"
              type="email"
              placeholder="admin@wybe.app"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-wybe-background/40"
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
            </div>
            <Input 
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-wybe-background/40"
              disabled={isLoading}
              required
            />
          </div>
          <Button 
            type="submit" 
            className="w-full bg-orange-600 hover:bg-orange-700"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              'Log in'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <AdminPasswordReset />
      </CardFooter>
    </Card>
  );
};

export default AdminLoginForm;
