
import React from "react";
import { Link } from "react-router-dom";
import { Github, Twitter, Linkedin, Instagram } from "lucide-react";
import WybeFunLogo from "./WybeFunLogo";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-black to-gray-900 text-white py-12 border-t border-gray-800/30">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <WybeFunLogo size="md" />
            <p className="text-gray-400 mt-2 max-w-xs">
              The next-generation platform for launching and trading meme coins with built-in bonding curves.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://twitter.com/wybefun" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-400 hover:text-orange-500 transition-colors transform hover:scale-110">
                <Twitter size={20} className="hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.7)]" />
              </a>
              <a href="https://github.com/wybefun" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-400 hover:text-orange-500 transition-colors transform hover:scale-110">
                <Github size={20} className="hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.7)]" />
              </a>
              <a href="https://linkedin.com/company/wybefun" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-400 hover:text-orange-500 transition-colors transform hover:scale-110">
                <Linkedin size={20} className="hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.7)]" />
              </a>
              <a href="https://instagram.com/wybefun" target="_blank" rel="noopener noreferrer" 
                 className="text-gray-400 hover:text-orange-500 transition-colors transform hover:scale-110">
                <Instagram size={20} className="hover:drop-shadow-[0_0_8px_rgba(249,115,22,0.7)]" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-gradient bg-gradient-to-r from-orange-500 to-amber-500 inline-block">Platform</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/discover" className="text-gray-400 hover:text-orange-500 transition-colors">Discover Tokens</Link>
              </li>
              <li>
                <Link to="/trade-demo" className="text-gray-400 hover:text-orange-500 transition-colors">
                  <span className="group-hover:underline">Trade Demo</span>
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-400 hover:text-orange-500 transition-colors">Dashboard</Link>
              </li>
              <li>
                <Link to="/launch" className="text-gray-400 hover:text-orange-500 transition-colors">Launch Token</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-gradient bg-gradient-to-r from-blue-500 to-cyan-400 inline-block">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/bonding-curves" className="text-gray-400 hover:text-blue-400 transition-colors">Bonding Curves</Link>
              </li>
              <li>
                <Link to="/security-report" className="text-gray-400 hover:text-blue-400 transition-colors">Security Report</Link>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">Documentation</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">API</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4 text-gradient bg-gradient-to-r from-green-500 to-emerald-400 inline-block">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">About</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Careers</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Press</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Contact</a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Wybe Fun. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link to="/terms" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">Terms</Link>
            <Link to="/privacy" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">Privacy</Link>
            <Link to="/cookies" className="text-gray-400 hover:text-orange-500 transition-colors text-sm">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
