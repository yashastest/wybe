
import React from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '@/hooks/useAdmin';
import { motion } from "framer-motion";
import { 
  Home, 
  BarChart2, 
  Settings, 
  Package, 
  LogOut, 
  FileCog, 
  Server, 
  ShieldAlert, 
  FileCode,
  Users
} from "lucide-react";
import { Button } from '@/components/ui/button';

const AdminSidebar: React.FC = () => {
  const { logout } = useAdmin();
  
  return (
    <motion.div
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed left-0 top-0 bottom-0 w-64 bg-black border-r border-white/10 p-4 z-10"
    >
      <div className="flex flex-col h-full">
        <div className="py-4">
          <Link to="/admin" className="flex items-center justify-center">
            <h1 className="font-bold text-2xl text-orange-500">WYBE Admin</h1>
          </Link>
        </div>
        
        <nav className="flex-1 py-6 space-y-2">
          <Link to="/admin">
            <Button variant="ghost" className="w-full justify-start">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
          
          <Link to="/admin/tokens">
            <Button variant="ghost" className="w-full justify-start">
              <Package className="mr-2 h-4 w-4" />
              Tokens
            </Button>
          </Link>
          
          <Link to="/admin/smart-contract-deployment">
            <Button variant="ghost" className="w-full justify-start">
              <FileCode className="mr-2 h-4 w-4" />
              Smart Contracts
            </Button>
          </Link>
          
          <Link to="/admin/deployment">
            <Button variant="ghost" className="w-full justify-start">
              <Server className="mr-2 h-4 w-4" />
              Deployment
            </Button>
          </Link>
          
          <Link to="/admin/security-report">
            <Button variant="ghost" className="w-full justify-start">
              <ShieldAlert className="mr-2 h-4 w-4" />
              Security Report
            </Button>
          </Link>
          
          <Link to="/admin/token-deployment">
            <Button variant="ghost" className="w-full justify-start">
              <FileCog className="mr-2 h-4 w-4" />
              Token Deployment
            </Button>
          </Link>
        </nav>
        
        <div className="pb-6 space-y-2 border-t border-white/10 pt-4">
          <Link to="/admin/settings">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-900/20"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSidebar;
