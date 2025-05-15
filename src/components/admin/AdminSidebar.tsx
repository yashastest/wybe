
import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAdmin } from '@/hooks/useAdmin';
import {
  LayoutDashboard,
  Users,
  FileCode,
  FileCode2,
  Database,
  Layers,
  Book,
  Wallet,
  BarChart2,
  Info,
  Settings,
  LogOut,
  Menu,
  X,
  Server,
  Shield,
  Rocket,
  Zap,
  Terminal,
  Lock,
  AlertTriangle,
  Key,
  Network,
  BadgeCheck,
  Clock,
  Globe,
  FolderOpen
} from 'lucide-react';

type SidebarItem = {
  icon: React.ElementType;
  label: string;
  path: string;
  permission?: string;
  category: 'main' | 'platform' | 'system' | 'security' | 'tools';
};

const AdminSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout, admin } = useAdmin();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get admin permissions from admin object with a safe fallback
  const adminPermissions = admin?.permissions || [];

  const sidebarItems: SidebarItem[] = [
    // Main Category
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin', category: 'main' },
    { icon: Users, label: 'Approvals', path: '/admin/approvals', permission: 'user_management', category: 'main' },
    { icon: Wallet, label: 'Treasury', path: '/admin/treasury', permission: 'treasury_update', category: 'main' },
    { icon: BarChart2, label: 'Analytics', path: '/admin/analytics', permission: 'analytics_view', category: 'main' },
    { icon: Database, label: 'Token Management', path: '/admin/tokens', category: 'main' },
    { icon: FolderOpen, label: 'Projects', path: '/admin/projects', permission: 'project_management', category: 'main' },
    { icon: BadgeCheck, label: 'Verifications', path: '/admin/verifications', permission: 'verification_management', category: 'main' },
    { icon: Clock, label: 'Pending Actions', path: '/admin/pending', category: 'main' },
    
    // Development Category
    { icon: FileCode, label: 'Smart Contracts', path: '/admin/contracts', permission: 'contract_deployment', category: 'tools' },
    { icon: FileCode2, label: 'Contract Deployment', path: '/admin/deployment', permission: 'contract_deployment', category: 'tools' },
    { icon: Database, label: 'Testnet Contracts', path: '/admin/testnet', category: 'tools' },
    { icon: Layers, label: 'Deployment Env', path: '/admin/environment', permission: 'contract_deployment', category: 'tools' },
    { icon: Book, label: 'Deployment Guide', path: '/admin/guide', category: 'tools' },
    { icon: Terminal, label: 'Console', path: '/admin/console', permission: 'developer_tools', category: 'tools' },
    { icon: Globe, label: 'Network Status', path: '/admin/network', category: 'tools' },
    { icon: Rocket, label: 'Launch Tools', path: '/admin/launch-tools', permission: 'launch_tools', category: 'tools' },
    
    // Security Category
    { icon: Shield, label: 'Security Center', path: '/admin/security', permission: 'security_management', category: 'security' },
    { icon: Lock, label: 'Access Control', path: '/admin/access', permission: 'security_management', category: 'security' },
    { icon: Key, label: 'API Keys', path: '/admin/api-keys', permission: 'security_management', category: 'security' },
    { icon: AlertTriangle, label: 'Audit Logs', path: '/admin/audit', permission: 'security_management', category: 'security' },
    { icon: Zap, label: 'Security Events', path: '/admin/security-events', permission: 'security_management', category: 'security' },
    
    // Platform Category
    { icon: Server, label: 'Platform', path: '/admin/platform', permission: 'settings_change', category: 'platform' },
    { icon: Users, label: 'User Access', path: '/admin/users', permission: 'user_management', category: 'platform' },
    { icon: Network, label: 'Integrations', path: '/admin/integrations', permission: 'settings_change', category: 'platform' },
    
    // System Category
    { icon: Settings, label: 'Settings', path: '/admin/settings', permission: 'settings_change', category: 'system' },
    { icon: Info, label: 'About', path: '/admin/about', category: 'system' },
  ];

  const toggleSidebar = () => setCollapsed(!collapsed);

  const handleLogout = () => {
    logout();
  };

  const hasPermission = (item: SidebarItem) => {
    if (!item.permission) return true;
    if (adminPermissions.includes('all')) return true;
    return adminPermissions.includes(item.permission);
  };

  const getMenuItems = (category: 'main' | 'platform' | 'system' | 'security' | 'tools') => {
    return sidebarItems
      .filter(item => item.category === category)
      .filter(item => hasPermission(item));
  };

  const isActive = (path: string) => {
    // Special case for dashboard which is at root path
    if (path === '/admin' && location.pathname === '/admin') return true;
    // For other paths, check if the location starts with the path (for nested routes)
    return path !== '/admin' && location.pathname.startsWith(path);
  };

  // Calculate counts for categories
  const categoryCounts = {
    main: getMenuItems('main').length,
    tools: getMenuItems('tools').length,
    security: getMenuItems('security').length,
    platform: getMenuItems('platform').length,
    system: getMenuItems('system').length
  };

  return (
    <>
      {/* Mobile menu toggle */}
      <div className="fixed top-4 left-4 lg:hidden z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 bg-black/80 rounded-full border border-white/20 text-white"
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {!collapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <motion.div
        className={`fixed top-0 left-0 h-full z-40 transition-all duration-300 bg-black/90 border-r border-white/10 overflow-y-auto lg:sticky ${
          collapsed ? 'w-0 lg:w-20' : 'w-64'
        }`}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`flex flex-col h-full p-4 ${collapsed ? 'lg:items-center' : ''}`}>
          {/* Logo */}
          <div className={`mb-8 mt-2 ${collapsed ? 'justify-center' : 'px-2'}`}>
            <h1 className={`text-xl font-bold text-gradient ${collapsed ? 'lg:hidden' : ''}`}>
              Admin Panel
            </h1>
            {collapsed && (
              <div className="hidden lg:block">
                <span className="text-2xl font-bold text-gradient">W</span>
              </div>
            )}
          </div>

          {/* Main Navigation Items */}
          <div className="flex-grow mb-4 overflow-y-auto">
            {/* Main Section */}
            {categoryCounts.main > 0 && (
              <div className="mb-6">
                <div className={`mb-2 text-xs text-gray-500 uppercase tracking-wider ${
                  collapsed ? 'lg:text-center' : 'px-3'
                }`}>
                  {!collapsed && 'Main'}
                </div>
                <nav className="space-y-1">
                  {getMenuItems('main').map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive: active }) =>
                        `flex items-center py-2 px-3 rounded-lg hover:bg-white/5 transition-colors ${
                          isActive(item.path) ? 'text-wybe-primary bg-wybe-primary/10' : 'text-gray-300'
                        } ${collapsed ? 'lg:justify-center lg:px-2' : ''}`
                      }
                    >
                      <item.icon size={collapsed ? 20 : 16} className="flex-shrink-0" />
                      <span className={`ml-3 ${collapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>
            )}

            {/* Tools Section */}
            {categoryCounts.tools > 0 && (
              <div className="mb-6">
                <div className={`mb-2 text-xs text-gray-500 uppercase tracking-wider ${
                  collapsed ? 'lg:text-center' : 'px-3'
                }`}>
                  {!collapsed && 'Development'}
                </div>
                <nav className="space-y-1">
                  {getMenuItems('tools').map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive: active }) =>
                        `flex items-center py-2 px-3 rounded-lg hover:bg-white/5 transition-colors ${
                          isActive(item.path) ? 'text-wybe-primary bg-wybe-primary/10' : 'text-gray-300'
                        } ${collapsed ? 'lg:justify-center lg:px-2' : ''}`
                      }
                    >
                      <item.icon size={collapsed ? 20 : 16} className="flex-shrink-0" />
                      <span className={`ml-3 ${collapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>
            )}

            {/* Security Section */}
            {categoryCounts.security > 0 && (
              <div className="mb-6">
                <div className={`mb-2 text-xs text-gray-500 uppercase tracking-wider ${
                  collapsed ? 'lg:text-center' : 'px-3'
                }`}>
                  {!collapsed && 'Security'}
                </div>
                <nav className="space-y-1">
                  {getMenuItems('security').map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive: active }) =>
                        `flex items-center py-2 px-3 rounded-lg hover:bg-white/5 transition-colors ${
                          isActive(item.path) ? 'text-wybe-primary bg-wybe-primary/10' : 'text-gray-300'
                        } ${collapsed ? 'lg:justify-center lg:px-2' : ''}`
                      }
                    >
                      <item.icon size={collapsed ? 20 : 16} className="flex-shrink-0" />
                      <span className={`ml-3 ${collapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>
            )}

            {/* Platform Section */}
            {categoryCounts.platform > 0 && (
              <div className="mb-6">
                <div className={`mb-2 text-xs text-gray-500 uppercase tracking-wider ${
                  collapsed ? 'lg:text-center' : 'px-3'
                }`}>
                  {!collapsed && 'Platform'}
                </div>
                <nav className="space-y-1">
                  {getMenuItems('platform').map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive: active }) =>
                        `flex items-center py-2 px-3 rounded-lg hover:bg-white/5 transition-colors ${
                          isActive(item.path) ? 'text-wybe-primary bg-wybe-primary/10' : 'text-gray-300'
                        } ${collapsed ? 'lg:justify-center lg:px-2' : ''}`
                      }
                    >
                      <item.icon size={collapsed ? 20 : 16} className="flex-shrink-0" />
                      <span className={`ml-3 ${collapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>
            )}

            {/* System Section */}
            {categoryCounts.system > 0 && (
              <div>
                <div className={`mb-2 text-xs text-gray-500 uppercase tracking-wider ${
                  collapsed ? 'lg:text-center' : 'px-3'
                }`}>
                  {!collapsed && 'System'}
                </div>
                <nav className="space-y-1">
                  {getMenuItems('system').map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive: active }) =>
                        `flex items-center py-2 px-3 rounded-lg hover:bg-white/5 transition-colors ${
                          isActive(item.path) ? 'text-wybe-primary bg-wybe-primary/10' : 'text-gray-300'
                        } ${collapsed ? 'lg:justify-center lg:px-2' : ''}`
                      }
                    >
                      <item.icon size={collapsed ? 20 : 16} className="flex-shrink-0" />
                      <span className={`ml-3 ${collapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
                    </NavLink>
                  ))}
                </nav>
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`flex items-center py-2 px-3 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors text-gray-300 ${
              collapsed ? 'lg:justify-center lg:px-2' : ''
            }`}
          >
            <LogOut size={collapsed ? 20 : 16} className="flex-shrink-0" />
            <span className={`ml-3 ${collapsed ? 'lg:hidden' : ''}`}>Logout</span>
          </button>

          {/* Toggle button - visible on desktop only */}
          <div className="hidden lg:block mt-6">
            <button
              onClick={toggleSidebar}
              className="w-full flex items-center justify-center py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              {collapsed ? <Menu size={16} /> : <X size={16} />}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default AdminSidebar;
