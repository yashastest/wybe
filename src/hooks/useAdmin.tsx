
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const useAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdminSession();
  }, []);

  const checkAdminSession = () => {
    setIsLoading(true);
    
    const isLoggedIn = localStorage.getItem("wybeAdminLoggedIn") === "true";
    const sessionExists = !!sessionStorage.getItem("wybeAdminSession");
    
    console.log("Auth check:", { isLoggedIn, sessionExists });
    
    if (isLoggedIn && sessionExists) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      
      // Only redirect and show message if we're on an admin page that requires authentication
      // and not already on the login page
      if (window.location.pathname.includes('/admin') && 
          !window.location.pathname.includes('/admin-login')) {
        navigate('/admin-login');
        toast.error("Authentication required. Please login.");
      }
    }
    
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("wybeAdminLoggedIn");
    sessionStorage.removeItem("wybeAdminSession");
    setIsAuthenticated(false);
    navigate('/admin-login');
    toast.success("Logged out successfully");
  };

  return { isAuthenticated, isLoading, logout, checkAdminSession };
};

export default useAdmin;
