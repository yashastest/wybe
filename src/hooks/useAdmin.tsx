
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface AdminSession {
  id: string;
  email: string;
  userId: string;
  permissions: string[];
  loginTime: number;
  expiryTime: number;
  accessToken?: string;
}

export const useAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminPermissions, setAdminPermissions] = useState<string[]>([]);
  const [adminSession, setAdminSession] = useState<AdminSession | null>(null);
  const [authCheckCompleted, setAuthCheckCompleted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Run auth check only once on initial mount
  useEffect(() => {
    const checkAuth = async () => {
      if (!authCheckCompleted) {
        await checkAdminSession();
      }
    };
    
    checkAuth();
  }, []); // Empty dependency array to run only once

  // Listen for auth state changes
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event, !!session);
        
        if (event === 'SIGNED_OUT') {
          await logout();
        }
      }
    );

    return () => {
      if (authListener && authListener.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  const checkAdminSession = async () => {
    setIsLoading(true);
    
    const isLoggedIn = localStorage.getItem("wybeAdminLoggedIn") === "true";
    const sessionDataStr = sessionStorage.getItem("wybeAdminSession");
    const sessionExists = !!sessionDataStr;
    
    console.log("Auth check:", { isLoggedIn, sessionExists, path: location.pathname });
    
    try {
      if (isLoggedIn && sessionExists) {
        console.log("Valid session found, setting authenticated to true");
        try {
          // Load session from sessionStorage
          const parsedSession = JSON.parse(sessionDataStr || '{}') as AdminSession;
          setAdminSession(parsedSession);
          setAdminPermissions(parsedSession.permissions || ['default']);
          
          // Check if session has expired
          const expiryTime = parsedSession.expiryTime;
          if (expiryTime && new Date().getTime() > expiryTime) {
            console.log("Session expired, logging out");
            await logout();
            return;
          }
          
          // If we have an accessToken, validate it against Supabase
          if (parsedSession.accessToken) {
            const { data, error } = await supabase.auth.getUser(parsedSession.accessToken);
            
            if (error || !data.user) {
              console.log("Invalid or expired token, logging out");
              await logout();
              return;
            }
            
            // Ensure this user is actually an admin by checking the admins table
            const { data: adminData, error: adminError } = await supabase
              .from('admins')
              .select('id')
              .eq('user_id', data.user.id)
              .single();
              
            if (adminError || !adminData) {
              console.log("User is not an admin, logging out");
              await logout();
              return;
            }
          }
          
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error parsing session data:", error);
          setAdminPermissions(['default']);
          await logout();
          return;
        }
      } else {
        console.log("No valid session found, setting authenticated to false");
        setIsAuthenticated(false);
        
        // Only redirect if we're on an admin page that requires authentication
        // and not already on the login page
        if (location.pathname.startsWith('/admin') && 
            !location.pathname.includes('/admin-login') &&
            !authCheckCompleted) { // Only redirect on first check
          console.log("Redirecting to login page");
          navigate('/admin-login', { replace: true });
          toast.error("Authentication required. Please login.");
        }
      }
    } finally {
      setIsLoading(false);
      setAuthCheckCompleted(true);
    }
  };

  const logout = async () => {
    // Sign out from Supabase if we have an active session
    if (adminSession?.accessToken) {
      await supabase.auth.signOut();
    }
    
    // Clear local session data
    localStorage.removeItem("wybeAdminLoggedIn");
    sessionStorage.removeItem("wybeAdminSession");
    setAdminSession(null);
    setIsAuthenticated(false);
    setAuthCheckCompleted(true); // Keep auth check completed to prevent loops
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
    isLoading, 
    logout, 
    checkAdminSession,
    adminPermissions,
    hasPermission,
    authCheckCompleted,
    adminSession
  };
};

export default useAdmin;
