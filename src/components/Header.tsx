
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/useWallet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { wallet, isConnecting, connect, disconnect, connectPhantom, isSolanaAvailable } = useWallet();
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
  
  return (
    <header className="sticky top-0 z-50 glass-nav">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={closeMobileMenu}>
              <div className="h-8 w-8 mr-2 overflow-hidden rounded-full">
                <AspectRatio ratio={1 / 1} className="relative w-full h-full">
                  <img 
                    src="/lovable-uploads/a8831646-bbf0-4510-9f62-5999db7cca5d.png" 
                    alt="Wybe Logo" 
                    className="object-cover"
                  />
                </AspectRatio>
              </div>
              <div className="text-2xl font-bold text-white">
                <span className="text-wybe-primary">Wybe</span>
              </div>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active-nav-link' : ''}`}>
              Home
            </Link>
            <Link to="/discover" className={`nav-link ${isActive('/discover') ? 'active-nav-link' : ''}`}>
              Discover
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
          </nav>
          
          <div className="flex items-center">
            {wallet ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="bg-wybe-background-light border-wybe-primary/20 text-white hover:bg-wybe-background flex items-center gap-1"
                  >
                    {wallet.substring(0, 4)}...{wallet.substring(wallet.length - 4)}
                    <ChevronDown size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-wybe-background-light border-white/10 w-56">
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-wybe-primary/20"
                    onClick={disconnect}
                  >
                    Disconnect Wallet
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    className="btn-primary"
                    disabled={isConnecting}
                  >
                    {isConnecting ? "Connecting..." : "Connect Wallet"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-wybe-background-light border-white/10 w-56">
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-wybe-primary/20"
                    onClick={connect}
                  >
                    Connect Demo Wallet
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer hover:bg-wybe-primary/20"
                    onClick={connectPhantom}
                  >
                    Connect Phantom Wallet
                    {!isSolanaAvailable && " (Install)"}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
              to="/discover" 
              className={`block py-2 ${isActive('/discover') ? 'text-wybe-primary' : 'text-white'}`}
              onClick={closeMobileMenu}
            >
              Discover
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
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
