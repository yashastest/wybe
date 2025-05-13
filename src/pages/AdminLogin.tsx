
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Shield, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if already logged in
    const isAdminLoggedIn = localStorage.getItem("wybeAdminLoggedIn") === "true";
    if (isAdminLoggedIn) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Temporary admin credentials - in a real app these would be verified securely
    // These should be changed after initial deployment
    if (username === "admin" && password === "wybe2023") {
      localStorage.setItem("wybeAdminLoggedIn", "true");
      toast.success("Login successful!");
      navigate("/admin");
    } else {
      toast.error("Invalid credentials");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-wybe-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-card p-8 border-2 border-wybe-primary/30">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-wybe-primary/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="text-wybe-primary" size={24} />
            </div>
            <h1 className="text-2xl font-bold">Admin Access</h1>
            <p className="text-gray-400 mt-2">Enter your credentials to continue</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="bg-wybe-background-light border-wybe-primary/20 focus-visible:ring-wybe-primary"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="bg-wybe-background-light border-wybe-primary/20 focus-visible:ring-wybe-primary"
                required
              />
            </div>
            
            <div className="pt-2">
              <Button type="submit" className="btn-primary w-full" disabled={isLoading}>
                {isLoading ? (
                  "Logging in..."
                ) : (
                  <>
                    <LogIn size={18} />
                    <span>Login</span>
                  </>
                )}
              </Button>
            </div>
            
            <div className="text-center mt-4">
              <p className="text-sm text-gray-400 flex items-center justify-center gap-1">
                <Lock size={14} />
                <span>Secured admin access only</span>
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
