
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useWallet } from '@/lib/wallet';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from "@/components/ThemeProvider";

interface HeaderProps {
  adminOnly?: boolean;
}

const Header: React.FC<HeaderProps> = ({ adminOnly = false }) => {
  const location = useLocation();
  const { wallet, connect, disconnect, connected } = useWallet();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { setTheme, theme } = useTheme();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { label: "Discover", href: "/discover" },
    { label: "Launch", href: "/launch" },
    { label: "Dashboard", href: "/dashboard" },
    { label: "Developer Roadmap", href: "/developer-roadmap" },
    { label: "Deployment Guide", href: "/master-deployment-guide" }
  ];

  return (
    <motion.header
      className="bg-black/50 backdrop-blur-md sticky top-0 z-50 border-b border-wybe-primary/10"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link to="/" className="flex items-center font-bold text-xl text-white">
          <img src="/wybe-logo-sm.svg" alt="Wybe Logo" className="h-8 w-auto mr-2" />
          <span className="font-poppins">Wybe</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {!adminOnly && navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-gray-300 hover:text-white px-3 py-2 text-sm font-medium ${location.pathname === link.href ? 'text-white' : ''}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation Trigger */}
        {!adminOnly && (
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-black border-r border-wybe-primary/10">
              <SheetHeader className="space-y-2">
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Navigate the Wybe platform.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    to={link.href}
                    className={`block text-lg text-gray-300 hover:text-white py-2 ${location.pathname === link.href ? 'text-white' : ''}`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        )}

        {/* Wallet Connection & Actions */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "light" ? <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" /> : <Sun className="h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {!adminOnly && connected ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://robohash.org/${wallet}.png?size=48x48`} alt={wallet} />
                    <AvatarFallback>{wallet ? wallet.substring(0, 2).toUpperCase() : "WY"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem disabled>
                  <span className="truncate">{wallet}</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={disconnect}>
                  Disconnect
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            !adminOnly && (
              <Button variant="default" size="sm" onClick={connect} className="font-semibold font-poppins">
                Connect Wallet
              </Button>
            )
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
