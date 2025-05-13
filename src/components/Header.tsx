
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  adminOnly?: boolean;
}

const Header: React.FC<HeaderProps> = ({ adminOnly = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  
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

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-100 glass-nav ${
        scrolled ? 'py-3 shadow-lg' : 'py-5'
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
              <span className="ml-2 text-xl md:text-2xl font-bold font-poppins tracking-wide text-white italic">Wybe</span>
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
                  className={`nav-link text-sm font-medium ${
                    location.pathname === link.to ? 'active-nav-link' : ''
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </nav>
          
          {!adminOnly && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="hidden md:block"
            >
              <Link to="/launch">
                <Button className="btn-primary">
                  Launch a Token
                </Button>
              </Link>
            </motion.div>
          )}
          
          {/* Mobile Menu Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="md:hidden"
          >
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-white focus:outline-none"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </motion.div>
        </div>
        
        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden mt-4 pb-4"
          >
            <nav className="flex flex-col space-y-4">
              {linksToDisplay.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-link text-sm font-medium py-2 ${
                    location.pathname === link.to ? 'active-nav-link' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              {!adminOnly && (
                <Link to="/launch" className="mt-2">
                  <Button className="btn-primary w-full">
                    Launch a Token
                  </Button>
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
