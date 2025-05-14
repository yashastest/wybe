
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

export const useAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [adminPermissions, setAdminPermissions] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    checkAdminSession();
  }, [location.pathname]);

  const checkAdminSession = () => {
    setIsLoading(true);
    
    const isLoggedIn = localStorage.getItem("wybeAdminLoggedIn") === "true";
    const sessionData = sessionStorage.getItem("wybeAdminSession");
    const sessionExists = !!sessionData;
    
    console.log("Auth check:", { isLoggedIn, sessionExists, path: location.pathname });
    
    if (isLoggedIn && sessionExists) {
      console.log("Valid session found, setting authenticated to true");
      try {
        // Load permissions from session
        const parsedSession = JSON.parse(sessionData || '{}');
        const permissions = parsedSession.permissions || ['default'];
        setAdminPermissions(permissions);
        
        // Check if session has expired
        const expiryTime = parsedSession.expiryTime;
        if (expiryTime && new Date().getTime() > expiryTime) {
          console.log("Session expired, logging out");
          logout();
          return;
        }
      } catch (error) {
        console.error("Error parsing session data:", error);
        setAdminPermissions(['default']);
      }
      
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      console.log("No valid session found, setting authenticated to false");
      setIsAuthenticated(false);
      
      // Only redirect and show message if we're on an admin page that requires authentication
      // and not already on the login page
      if (location.pathname.includes('/admin') && 
          !location.pathname.includes('/admin-login')) {
        console.log("Redirecting to login page");
        navigate('/admin-login');
        toast.error("Authentication required. Please login.");
      }
      
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("wybeAdminLoggedIn");
    sessionStorage.removeItem("wybeAdminSession");
    setIsAuthenticated(false);
    navigate('/admin-login');
    toast.success("Logged out successfully", {
      duration: 3000, // Shorter duration for toast
    });
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
    hasPermission
  };
};

export default useAdmin;
