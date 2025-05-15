
import React from "react";
import { Link } from "react-router-dom";
import { Twitter, BookOpen } from "lucide-react";

const Footer = () => {
  const currentYear = 2025;
  
  return (
    <footer className="mt-auto border-t border-white/10 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <img 
                src="/lovable-uploads/dcb3ea81-25ba-4438-90a5-c7403026c91e.png" 
                alt="Wybe Logo" 
                className="h-8 w-8 mr-2" 
              />
              <span className="text-white font-poppins font-extrabold italic tracking-wide">Wybe</span>
            </h3>
            <p className="text-gray-400 mb-4">
              The first fully AI-powered, Solana-based meme coin launchpad with built-in bonding curves and creator incentives.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-wybe-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/launch" className="text-gray-400 hover:text-wybe-primary transition-colors">
                  Launch a Coin
                </Link>
              </li>
              <li>
                <Link to="/trade" className="text-gray-400 hover:text-wybe-primary transition-colors">
                  Trade
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-wybe-primary transition-colors">
                  Creator Dashboard
                </Link>
              </li>
              <li>
                <Link to="/bonding-curves" className="text-gray-400 hover:text-wybe-primary transition-colors flex items-center">
                  <BookOpen size={16} className="mr-2" />
                  <span>Learn About Bonding Curves</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-wybe-primary transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-wybe-primary transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-wybe-primary transition-colors">
                  Solana Explorer
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-wybe-primary transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {currentYear} <span className="text-white font-poppins font-extrabold italic">Wybe</span>. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-wybe-primary transition-colors flex items-center">
              <Twitter className="h-4 w-4 mr-1" />
              <span>Twitter</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-wybe-primary transition-colors flex items-center">
              <span className="font-mono text-lg mr-1">t</span>
              <span>Telegram</span>
            </a>
            <a href="#" className="text-gray-400 hover:text-wybe-primary transition-colors flex items-center">
              <span className="font-mono text-lg mr-1">ﾠﾠﾠ</span>
              <span>Discord</span>
            </a>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <Link 
            to="/bonding-curves" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-poppins font-bold rounded-full hover:from-indigo-500 hover:to-purple-500 transition-all shadow-glow-sm hover:shadow-glow-md"
          >
            <BookOpen size={18} />
            Learn About Bonding Curves
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
