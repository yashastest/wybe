
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { wallet, isConnecting, connect, disconnect } = useWallet();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };
  
  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
    }
  };
  
  const handleDisconnect = () => {
    disconnect();
  };
  
  return (
    <header className="sticky top-0 z-50 glass-nav">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMobileMenu}>
              <div className="text-2xl font-bold text-white">
                <span className="text-wybe-primary">Wybe</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active-nav-link' : ''}`}>
              Home
            </Link>
            <Link to="/launch" className={`nav-link ${isActive('/launch') ? 'active-nav-link' : ''}`}>
              Launch
            </Link>
            <Link to="/trade" className={`nav-link ${isActive('/trade') ? 'active-nav-link' : ''}`}>
              Trade
            </Link>
            <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active-nav-link' : ''}`}>
              Dashboard
            </Link>
            <Link to="/admin" className={`nav-link ${isActive('/admin') ? 'active-nav-link' : ''}`}>
              Admin
            </Link>
          </nav>
          
          <div className="flex items-center">
            {wallet ? (
              <Button 
                variant="outline" 
                onClick={handleDisconnect}
                className="bg-wybe-background-light border-wybe-primary/20 text-white hover:bg-wybe-background"
              >
                {wallet.substring(0, 4)}...{wallet.substring(wallet.length - 4)}
              </Button>
            ) : (
              <Button 
                onClick={handleConnect} 
                disabled={isConnecting}
                className="btn-primary"
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            )}
            
            <Button
              variant="ghost"
              className="ml-2 md:hidden"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-wybe-background-light border-t border-white/10">
          <div className="container mx-auto px-4 py-4 space-y-2">
            <Link 
              to="/" 
              className={`block py-2 ${isActive('/') ? 'text-wybe-primary' : 'text-white'}`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>
            <Link 
              to="/launch" 
              className={`block py-2 ${isActive('/launch') ? 'text-wybe-primary' : 'text-white'}`}
              onClick={closeMobileMenu}
            >
              Launch
            </Link>
            <Link 
              to="/trade" 
              className={`block py-2 ${isActive('/trade') ? 'text-wybe-primary' : 'text-white'}`}
              onClick={closeMobileMenu}
            >
              Trade
            </Link>
            <Link 
              to="/dashboard" 
              className={`block py-2 ${isActive('/dashboard') ? 'text-wybe-primary' : 'text-white'}`}
              onClick={closeMobileMenu}
            >
              Dashboard
            </Link>
            <Link 
              to="/admin" 
              className={`block py-2 ${isActive('/admin') ? 'text-wybe-primary' : 'text-white'}`}
              onClick={closeMobileMenu}
            >
              Admin
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
