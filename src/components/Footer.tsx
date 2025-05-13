
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="mt-auto border-t border-white/10 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">
              <span className="text-wybe-primary">Wybe</span>
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
          <p className="text-gray-400 text-sm">© 2023 Wybe. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-wybe-primary transition-colors">
              Twitter
            </a>
            <a href="#" className="text-gray-400 hover:text-wybe-primary transition-colors">
              Telegram
            </a>
            <a href="#" className="text-gray-400 hover:text-wybe-primary transition-colors">
              Discord
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
