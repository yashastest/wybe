
import React from "react";
import { motion } from "framer-motion";
import { 
  Rocket, 
  ArrowRight,
  CircleDollarSign,
  Shield,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const DeploymentEnvironment = () => {
  return (
    <section className="py-16 bg-black">
      <div className="container mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="text-white">Complete </span>
            <span className="text-orange-500">Deployment Environment</span>
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Everything you need to launch, trade, and manage your meme coins on Solana blockchain with ease.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card p-6 bg-gradient-to-br from-blue-900/20 to-transparent relative overflow-hidden"
          >
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-xl font-bold text-white">Frontend</h3>
              <span className="bg-blue-500/20 p-2 rounded-full">
                <Star size={18} className="text-blue-400" />
              </span>
            </div>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center text-gray-300">
                <span className="mr-2 text-blue-400">•</span>
                React + Vite for fast development
              </li>
              <li className="flex items-center text-gray-300">
                <span className="mr-2 text-blue-400">•</span>
                Framer Motion animations
              </li>
              <li className="flex items-center text-gray-300">
                <span className="mr-2 text-blue-400">•</span>
                TailwindCSS for responsive design
              </li>
              <li className="flex items-center text-gray-300">
                <span className="mr-2 text-blue-400">•</span>
                User dashboard with real-time charts
              </li>
            </ul>
            <div className="mt-auto">
              <Button variant="link" className="text-blue-400 p-0 flex items-center">
                View Documentation
                <ArrowRight size={14} className="ml-1" />
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-6 bg-gradient-to-br from-orange-900/20 to-transparent relative overflow-hidden"
          >
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-xl font-bold text-white">Smart Contracts</h3>
              <span className="bg-orange-500/20 p-2 rounded-full">
                <Shield size={18} className="text-orange-400" />
              </span>
            </div>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center text-gray-300">
                <span className="mr-2 text-orange-400">•</span>
                Solana SPL token standards 
              </li>
              <li className="flex items-center text-gray-300">
                <span className="mr-2 text-orange-400">•</span>
                Automated bonding curve deployment
              </li>
              <li className="flex items-center text-gray-300">
                <span className="mr-2 text-orange-400">•</span>
                Creator royalty smart contracts
              </li>
              <li className="flex items-center text-gray-300">
                <span className="mr-2 text-orange-400">•</span>
                Secure trading protocols
              </li>
            </ul>
            <div className="mt-auto">
              <Button variant="link" className="text-orange-400 p-0 flex items-center">
                Smart Contract Docs
                <ArrowRight size={14} className="ml-1" />
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-card p-6 bg-gradient-to-br from-green-900/20 to-transparent relative overflow-hidden"
          >
            <div className="mb-4 flex items-start justify-between">
              <h3 className="text-xl font-bold text-white">Deployment</h3>
              <span className="bg-green-500/20 p-2 rounded-full">
                <Rocket size={18} className="text-green-400" />
              </span>
            </div>
            <ul className="space-y-2 mb-4">
              <li className="flex items-center text-gray-300">
                <span className="mr-2 text-green-400">•</span>
                One-click token deployment
              </li>
              <li className="flex items-center text-gray-300">
                <span className="mr-2 text-green-400">•</span>
                Vercel frontend hosting included
              </li>
              <li className="flex items-center text-gray-300">
                <span className="mr-2 text-green-400">•</span>
                Automated CI/CD pipeline setup
              </li>
              <li className="flex items-center text-gray-300">
                <span className="mr-2 text-green-400">•</span>
                Custom domain configuration
              </li>
            </ul>
            <div className="mt-auto">
              <Button variant="link" className="text-green-400 p-0 flex items-center">
                Deployment Guide
                <ArrowRight size={14} className="ml-1" />
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="glass-card p-8 max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-orange-500/20 p-3 rounded-full">
              <CircleDollarSign className="text-orange-500 h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">Infrastructure Integration</h3>
          </div>
          
          <div className="bg-black/30 border border-white/5 rounded-lg p-4 mb-6">
            <h4 className="font-mono text-sm text-gray-400 mb-2">Deployment Architecture</h4>
            <div className="grid grid-cols-3 gap-2">
              <div className="border border-blue-500/20 rounded p-3 text-center">
                <div className="text-xs text-blue-400 mb-1">Frontend</div>
                <div className="text-gray-300 text-xs">Vercel/Netlify</div>
              </div>
              <div className="flex items-center justify-center">
                <ArrowRight className="text-gray-500" size={14} />
              </div>
              <div className="border border-green-500/20 rounded p-3 text-center">
                <div className="text-xs text-green-400 mb-1">API Layer</div>
                <div className="text-gray-300 text-xs">Node.js + Express</div>
              </div>
            </div>
            <div className="flex justify-center my-2">
              <ArrowRight className="text-gray-500 transform rotate-90" size={14} />
            </div>
            <div className="border border-orange-500/20 rounded p-3 text-center mx-auto w-2/3">
              <div className="text-xs text-orange-400 mb-1">Smart Contract</div>
              <div className="text-gray-300 text-xs">Solana Blockchain</div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link to="/admin/deploy">
              <Button variant="orange" size="lg" className="px-8">
                <Rocket className="mr-2" size={16} />
                Deploy Your Environment
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DeploymentEnvironment;
