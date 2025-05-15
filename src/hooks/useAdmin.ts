
import { useState, useEffect } from 'react';

interface Admin {
  id: string;
  email: string;
}

interface Session {
  token: string;
  expiresAt: string;
}

interface AdminSession {
  admin: Admin;
  session: Session;
}

export const useAdmin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authCheckCompleted, setAuthCheckCompleted] = useState<boolean>(false);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const isLoggedIn = localStorage.getItem('wybeAdminLoggedIn') === 'true';
        
        if (!isLoggedIn) {
          setIsAuthenticated(false);
          setAdmin(null);
          setSession(null);
          return;
        }
        
        const sessionData = sessionStorage.getItem('wybeAdminSession');
        
        if (!sessionData) {
          setIsAuthenticated(false);
          setAdmin(null);
          setSession(null);
          localStorage.removeItem('wybeAdminLoggedIn');
          return;
        }
        
        const adminSession: AdminSession = JSON.parse(sessionData);
        
        if (!adminSession || !adminSession.admin || !adminSession.session) {
          setIsAuthenticated(false);
          setAdmin(null);
          setSession(null);
          localStorage.removeItem('wybeAdminLoggedIn');
          sessionStorage.removeItem('wybeAdminSession');
          return;
        }
        
        // Check if session is expired
        const expiresAt = new Date(adminSession.session.expiresAt);
        const now = new Date();
        
        if (expiresAt < now) {
          // Session expired
          setIsAuthenticated(false);
          setAdmin(null);
          setSession(null);
          localStorage.removeItem('wybeAdminLoggedIn');
          sessionStorage.removeItem('wybeAdminSession');
          return;
        }
        
        // Session valid
        setIsAuthenticated(true);
        setAdmin(adminSession.admin);
        setSession(adminSession.session);
      } catch (error) {
        console.error('Error checking auth:', error);
        setIsAuthenticated(false);
        setAdmin(null);
        setSession(null);
      } finally {
        setIsLoading(false);
        setAuthCheckCompleted(true);
      }
    };
    
    checkAuth();
  }, []);
  
  const logout = () => {
    localStorage.removeItem('wybeAdminLoggedIn');
    sessionStorage.removeItem('wybeAdminSession');
    setIsAuthenticated(false);
    setAdmin(null);
    setSession(null);
  };
  
  return {
    isAuthenticated,
    admin,
    session,
    isLoading,
    authCheckCompleted,
    logout
  };
};
