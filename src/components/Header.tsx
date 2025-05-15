import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useWallet } from "@/hooks/useWallet.tsx";  // Updated import with .tsx extension

interface HeaderProps {
  adminOnly?: boolean;
}

const Header: React.FC<HeaderProps> = ({ adminOnly = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { connected, address, connect, disconnect, isConnecting, isSolanaAvailable } = useWallet();
  
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);
  
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const handleWalletConnection = async () => {
    if (connected) {
      disconnect();
    } else {
      await connect();
    }
  };

  // Regular navigation links
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/discover", label: "Discover" },
    { to: "/trade", label: "Trade" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/launch", label: "Launch" },
  ];
  
  // Admin navigation links
  const adminNavLinks = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin-login", label: "Logout" },
  ];

  // Choose which links to display
  const linksToDisplay = adminOnly ? adminNavLinks : navLinks;

  // Truncate address for display
  const truncatedAddress = address ? 
    `${address.substring(0, 4)}...${address.substring(address.length - 4)}` : 
    '';

  return (
    <header className="border-b bg-background sticky top-0 z-40">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex items-center"
            >
              <img 
                src="/lovable-uploads/dcb3ea81-25ba-4438-90a5-c7403026c91e.png" 
                alt="Wybe Logo" 
                className="h-8 w-8 md:h-10 md:w-10" 
              />
              <span className="ml-2 text-xl md:text-2xl text-white font-extrabold font-poppins tracking-wide italic">Wybe</span>
            </motion.div>
          </Link>
        </div>
        <div className="flex items-center space-x-6 text-sm font-medium">
          {/* Regular navigation links */}
          {linksToDisplay.map((link, index) => (
            <motion.div
              key={link.to}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Link
                to={link.to}
                className={`nav-link text-sm font-medium transition-colors hover:text-wybe-primary ${
                  location.pathname === link.to 
                    ? 'active-nav-link' 
                    : 'text-white hover:text-wybe-primary/90'
                }`}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
          
          {/* Add Meme Battle Royale link with orange highlight */}
          <Link
            to="/meme-battle-royale"
            className="flex items-center text-orange-500 font-bold hover:text-orange-600 transition-colors"
          >
            🐸 Meme Battle Royale
          </Link>
          
          {/* Admin navigation links */}
          {adminNavLinks.map((link, index) => (
            <motion.div
              key={link.to}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <Link
                to={link.to}
                className={`nav-link text-sm font-medium transition-colors hover:text-wybe-primary ${
                  location.pathname === link.to 
                    ? 'active-nav-link' 
                    : 'text-white hover:text-wybe-primary/90'
                }`}
              >
                {link.label}
              </Link>
            </motion.div>
          ))}
        </div>
        
        {/* Wallet Connection Button - Desktop */}
        {!adminOnly && (
          <div className="hidden md:flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button 
                onClick={handleWalletConnection} 
                className={connected ? "bg-wybe-primary/20 text-wybe-primary border border-wybe-primary/50" : "bg-wybe-primary hover:bg-wybe-primary/90"}
                disabled={isConnecting}
              >
                <Wallet className="mr-2 h-4 w-4" />
                {isConnecting ? (
                  "Connecting..."
                ) : connected ? (
                  truncatedAddress
                ) : (
                  "Connect Wallet"
                )}
              </Button>
            </motion.div>
            
            {/* Launch Token Button - Desktop */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <Link to="/launch">
                <Button className="btn-primary hover:bg-wybe-primary/90 active:bg-wybe-primary/70">
                  Launch a Token
                </Button>
              </Link>
            </motion.div>
          </div>
        )}
        
        {/* Mobile Menu Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="md:hidden"
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="p-2 text-white focus:outline-none"
              >
                <Menu className="h-6 w-6" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black border border-white/10 mr-4">
              {linksToDisplay.map((link) => (
                <DropdownMenuItem key={link.to} asChild>
                  <Link
                    to={link.to}
                    className={`w-full px-4 py-3 text-sm hover:bg-wybe-primary/20 rounded-md ${
                      location.pathname === link.to ? 'text-wybe-primary' : 'text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              {!adminOnly && (
                <>
                  {/* Wallet Button - Mobile */}
                  <DropdownMenuItem asChild>
                    <Button 
                      onClick={handleWalletConnection} 
                      className={`w-full mt-2 ${connected ? "bg-wybe-primary/20 text-wybe-primary border border-wybe-primary/50" : "bg-wybe-primary hover:bg-wybe-primary/90"}`}
                      disabled={isConnecting}
                    >
                      <Wallet className="mr-2 h-4 w-4" />
                      {isConnecting ? (
                        "Connecting..."
                      ) : connected ? (
                        truncatedAddress
                      ) : (
                        "Connect Wallet"
                      )}
                    </Button>
                  </DropdownMenuItem>
                  
                  {/* Launch Button - Mobile */}
                  <DropdownMenuItem asChild>
                    <Link to="/launch" className="w-full">
                      <Button className="btn-primary w-full mt-2 hover:bg-wybe-primary/90 active:bg-wybe-primary/70">
                        Launch a Token
                      </Button>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;
