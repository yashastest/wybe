
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black border-t border-white/10 py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center mb-8">
          <Link to="/security-report">
            <Button variant="outline" className="border-white/20 hover:bg-white/5">
              <ShieldCheck className="mr-2 h-5 w-5 text-green-500" />
              Security Report
            </Button>
          </Link>
          <p className="text-gray-400 text-sm mt-2">
            View our comprehensive security report and smart contract audit
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">WYBE Token</h3>
            <p className="text-gray-400 text-sm">
              The next generation of meme tokens with built-in utility
              and sustainable tokenomics.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="text-gray-400 hover:text-white">Home</Link></li>
              <li><Link to="/trade" className="text-gray-400 hover:text-white">Trade</Link></li>
              <li><Link to="/launch" className="text-gray-400 hover:text-white">Launch Token</Link></li>
              <li><Link to="/discover" className="text-gray-400 hover:text-white">Discover</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white">Documentation</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Tutorials</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">FAQs</a></li>
              <li><Link to="/security-report" className="text-gray-400 hover:text-white">Security Report</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Connect</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white">Twitter</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Discord</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Telegram</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Github</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} WYBE Token. All rights reserved.
          </p>
          
          <div className="flex space-x-6">
            <a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a>
            <Link to="/security-report" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
              Security Report
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
