
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface AdminUser {
  id: string;
  email: string;
  permissions: string[];
}

export interface AdminSession {
  admin: AdminUser;
  session: {
    token: string;
    expiresAt: string;
  };
}

export const useAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authCheckCompleted, setAuthCheckCompleted] = useState<boolean>(false);
  const [adminPermissions, setAdminPermissions] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Run auth check on initial mount
  useEffect(() => {
    checkAdminSession();
  }, []);

  const checkAdminSession = async () => {
    setIsLoading(true);
    
    const isLoggedIn = localStorage.getItem("wybeAdminLoggedIn") === "true";
    const sessionData = sessionStorage.getItem("wybeAdminSession");
    
    try {
      if (isLoggedIn && sessionData) {
        const adminSession: AdminSession = JSON.parse(sessionData);
        
        if (!adminSession || !adminSession.admin || !adminSession.session) {
          await logout();
          return;
        }
        
        // Check if session is expired
        const expiresAt = new Date(adminSession.session.expiresAt).getTime();
        const now = new Date().getTime();
        
        if (expiresAt < now) {
          await logout();
          return;
        }
        
        // Session valid
        setIsAuthenticated(true);
        setAdmin(adminSession.admin);
        setAdminPermissions(adminSession.admin.permissions || ['default']);
        
      } else {
        setIsAuthenticated(false);
        setAdmin(null);
        
        // Only redirect if we're on an admin page that requires authentication
        // and not already on the login page
        if (location.pathname.startsWith('/admin') && 
            !location.pathname.includes('/admin-login') &&
            !authCheckCompleted) { // Only redirect on first check
          navigate('/admin-login', { replace: true });
          toast("Authentication required. Please login.");
        }
      }
    } catch (error) {
      console.error('Error checking admin session:', error);
      setIsAuthenticated(false);
      setAdmin(null);
    } finally {
      setIsLoading(false);
      setAuthCheckCompleted(true);
    }
  };
  
  const login = (adminData: AdminUser, sessionData: { token: string, expiresAt: string }) => {
    const adminSession: AdminSession = {
      admin: adminData,
      session: sessionData
    };
    
    localStorage.setItem('wybeAdminLoggedIn', 'true');
    sessionStorage.setItem('wybeAdminSession', JSON.stringify(adminSession));
    
    setIsAuthenticated(true);
    setAdmin(adminData);
    setAdminPermissions(adminData.permissions || ['default']);
  };

  const logout = async () => {
    // Clean up local session data
    localStorage.removeItem("wybeAdminLoggedIn");
    sessionStorage.removeItem("wybeAdminSession");
    setAdmin(null);
    setIsAuthenticated(false);
    setAdminPermissions(['default']);
    navigate('/admin-login', { replace: true });
    toast.success("Logged out successfully");
  };

  const hasPermission = (requiredPermission: string): boolean => {
    // Super admin has all permissions
    if (adminPermissions.includes('all')) return true;
    
    // Check if user has the specific permission
    return adminPermissions.includes(requiredPermission);
  };

  return { 
    isAuthenticated, 
    admin,
    isLoading,
    login,
    logout,
    checkAdminSession,
    adminPermissions,
    hasPermission,
    authCheckCompleted
  };
};

export default useAdmin;
