
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [scrolled, setScrolled] = useState(false);
  const { wallet, isConnecting, connect, disconnect, connectPhantom, isSolanaAvailable } = useWallet();
  const location = useLocation();
  
  // Check if we're on the admin route
  const isAdminRoute = location.pathname.includes('/admin');
  
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // Animation variants
  const logoVariants = {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const navVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5, staggerChildren: 0.1, delayChildren: 0.3 } }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  
  return (
    <header className={`sticky top-0 z-50 glass-nav ${scrolled ? 'shadow-glow-sm' : ''}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          <motion.div 
            className="flex items-center"
            initial="initial"
            animate="animate"
            variants={logoVariants}
          >
            <Link to="/" className="flex items-center" onClick={closeMobileMenu}>
              <div className="h-10 w-10 mr-2 overflow-hidden rounded-full animate-pulse-glow">
                <AspectRatio ratio={1 / 1} className="relative w-full h-full">
                  <img 
                    src="/lovable-uploads/5f8a8eb9-3963-4b1b-8ca5-2beecbb60b39.png" 
                    alt="Wybe Logo" 
                    className="object-cover"
                  />
                </AspectRatio>
              </div>
              <span className="text-white font-bold text-xl ml-2">WYBE</span>
            </Link>
          </motion.div>
          
          {/* Desktop Navigation - Show different nav for admin vs normal users */}
          {!isAdminRoute ? (
            <motion.nav 
              className="hidden md:flex space-x-6"
              initial="initial"
              animate="animate"
              variants={navVariants}
            >
              <motion.div variants={itemVariants}>
                <Link to="/" className={`nav-link ${isActive('/') ? 'active-nav-link' : ''}`}>
                  Home
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link to="/package" className={`nav-link ${isActive('/package') ? 'active-nav-link' : ''}`}>
                  Launch Package
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link to="/launch" className={`nav-link ${isActive('/launch') ? 'active-nav-link' : ''}`}>
                  Launch
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link to="/trade" className={`nav-link ${isActive('/trade') ? 'active-nav-link' : ''}`}>
                  Trade
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active-nav-link' : ''}`}>
                  Dashboard
                </Link>
              </motion.div>
            </motion.nav>
          ) : (
            <motion.div 
              className="hidden md:block"
              initial="initial"
              animate="animate"
              variants={navVariants}
            >
              <motion.div variants={itemVariants}>
                <span className="text-gradient font-medium">Admin Panel</span>
              </motion.div>
            </motion.div>
          )}
          
          <motion.div 
            className="flex items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {isAdminRoute ? (
              <Link to="/admin-login">
                <Button 
                  variant="outline" 
                  className="bg-wybe-background-light border-wybe-primary/20 text-white hover:bg-wybe-background flex items-center gap-1"
                >
                  Back to Login
                </Button>
              </Link>
            ) : wallet ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    className="bg-wybe-background-light border-wybe-primary/20 text-white hover:bg-wybe-background flex items-center gap-1 shadow-glow-sm"
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
                    className="btn-primary animate-rainbow-glow"
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
              className="ml-2 md:hidden text-white hover:bg-wybe-primary/20"
              onClick={toggleMobileMenu}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </motion.div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="md:hidden bg-wybe-background-light border-t border-white/10"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {!isAdminRoute ? (
                <>
                  <Link 
                    to="/" 
                    className={`block py-2 ${isActive('/') ? 'text-wybe-primary' : 'text-white'}`}
                    onClick={closeMobileMenu}
                  >
                    Home
                  </Link>
                  <Link 
                    to="/package" 
                    className={`block py-2 ${isActive('/package') ? 'text-wybe-primary' : 'text-white'}`}
                    onClick={closeMobileMenu}
                  >
                    Launch Package
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
                </>
              ) : (
                <span className="block py-2 text-gradient font-medium">Admin Panel</span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
