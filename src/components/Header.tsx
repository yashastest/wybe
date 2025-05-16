
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, Wallet, DollarSign, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useWallet } from "@/hooks/useWallet.tsx";

interface HeaderProps {
  adminOnly?: boolean;
}

interface NavLink {
  to: string;
  label: string;
  icon?: React.ReactNode;
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
      try {
        await connect();
      } catch (error) {
        console.error("Wallet connection error:", error);
      }
    }
  };

  // Regular navigation links
  const navLinks: NavLink[] = [
    { to: "/", label: "Home" },
    { to: "/discover", label: "Discover" },
    { to: "/trade-demo", label: "Trade Demo", icon: <TrendingUp className="h-4 w-4 mr-1" /> },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/launch", label: "Launch" },
    { to: "/package", label: "Launch Package" },
  ];
  
  // Admin navigation links
  const adminNavLinks: NavLink[] = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin-login", label: "Logout" },
  ];

  // Choose which links to display
  const linksToDisplay = adminOnly ? adminNavLinks : navLinks;

  // Truncate address for display - with safety check
  const truncatedAddress = address ? 
    `${address.substring(0, 4)}...${address.substring(address.length - 4)}` : 
    '';

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-100 bg-black ${
        scrolled ? 'py-2 shadow-lg' : 'py-3'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
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
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {linksToDisplay.map((link, index) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Link
                  to={link.to}
                  className={`nav-link text-sm font-medium transition-colors hover:text-wybe-primary flex items-center ${
                    location.pathname === link.to 
                      ? 'active-nav-link' 
                      : 'text-white hover:text-wybe-primary/90'
                  } ${link.to === '/trade-demo' ? 'bg-gradient-to-r from-orange-600 to-orange-500 px-3 py-1 rounded-md text-black' : ''}`}
                >
                  {link.icon && link.icon}
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>
          
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
                      className={`w-full px-4 py-3 text-sm hover:bg-wybe-primary/20 rounded-md flex items-center ${
                        location.pathname === link.to ? 'text-wybe-primary' : 'text-white'
                      } ${link.to === '/trade-demo' ? 'bg-gradient-to-br from-orange-600/30 to-orange-500/30 text-black' : ''}`}
                    >
                      {link.icon && link.icon}
                      {link.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
                
                {/* Package link with special styling */}
                <DropdownMenuItem asChild>
                  <Link
                    to="/package"
                    className={`w-full px-4 py-3 text-sm hover:bg-wybe-primary/20 rounded-md flex items-center ${
                      location.pathname === '/package' ? 'text-wybe-primary' : 'text-white'
                    }`}
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    Launch Package ($500)
                  </Link>
                </DropdownMenuItem>
                
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
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </motion.div>
        </div>
      </div>
    </header>
  );
};

export default Header;
