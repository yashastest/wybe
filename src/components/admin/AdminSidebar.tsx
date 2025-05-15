
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Trophy,
  Wallet,
  Settings,
  LogOut,
  FileCode,
  Shield,
  Code,
  Server,
  Bug,
  FileCode2,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAdmin } from '@/hooks/useAdmin';
import { cn } from '@/lib/utils';

const AdminSidebar = () => {
  const { logout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin-login');
  };

  const NavItem = ({ 
    to, 
    icon: Icon, 
    children 
  }: { 
    to: string; 
    icon: React.ElementType; 
    children: React.ReactNode;
  }) => (
    <NavLink 
      to={to}
      className={({ isActive }) => cn(
        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
        isActive 
          ? "bg-orange-500/20 text-orange-500" 
          : "text-gray-300 hover:bg-white/10"
      )}
    >
      <Icon size={18} />
      <span>{children}</span>
    </NavLink>
  );

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-wybe-background-light border-r border-white/10 p-4 flex flex-col">
      <div className="mb-8 px-3 py-4">
        <h1 className="text-xl font-bold">
          <span className="text-white">Wybe </span>
          <span className="text-orange-500">Admin</span>
        </h1>
      </div>

      <div className="space-y-1 mb-6">
        <NavItem to="/admin" icon={LayoutDashboard}>Dashboard</NavItem>
        <NavItem to="/admin/tokens" icon={Trophy}>Tokens</NavItem>
      </div>

      <div className="mb-6">
        <h2 className="text-xs uppercase text-gray-500 font-medium px-3 mb-2">Deployment</h2>
        <div className="space-y-1">
          <NavItem to="/admin/token-deployment" icon={FileCode}>Token Deployment</NavItem>
          <NavItem to="/admin/smart-contract-deployment" icon={Code}>Smart Contract</NavItem>
          <NavItem to="/admin/deployment" icon={Server}>Deployment Tests</NavItem>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xs uppercase text-gray-500 font-medium px-3 mb-2">Security</h2>
        <div className="space-y-1">
          <NavItem to="/admin/security-report" icon={Shield}>Security Report</NavItem>
          <NavItem to="/admin/tokens" icon={Bug}>Audit Tokens</NavItem>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xs uppercase text-gray-500 font-medium px-3 mb-2">Administration</h2>
        <div className="space-y-1">
          <NavItem to="/admin" icon={Users}>User Management</NavItem>
          <NavItem to="/admin" icon={Wallet}>Treasury</NavItem>
          <NavItem to="/admin" icon={Settings}>Settings</NavItem>
        </div>
      </div>

      <div className="mt-auto">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/10"
          onClick={handleLogout}
        >
          <LogOut size={18} className="mr-2" />
          Log out
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;
