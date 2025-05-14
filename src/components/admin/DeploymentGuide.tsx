
import React from 'react';
import { motion } from "framer-motion";
import { Book, Link, ExternalLink, Download, CheckCircle, Terminal } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";

const DeploymentGuide = () => {
  const downloadGuide = () => {
    // Create a link to download the deployment guide
    const link = document.createElement('a');
    link.href = '/anchor-program/DEPLOYMENT_GUIDE.md';
    link.download = 'WYBE_DEPLOYMENT_GUIDE.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Book className="text-orange-500" />
          Master Deployment Guide
        </h1>
        <Button onClick={downloadGuide} variant="outline" className="bg-transparent">
          <Download className="mr-2 h-4 w-4" />
          Download Guide
        </Button>
      </div>
      
      <Alert className="bg-orange-500/10 border-orange-500/30">
        <AlertDescription className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-orange-500" />
          This guide contains detailed instructions for deploying WYBE smart contracts to mainnet and testnet.
        </AlertDescription>
      </Alert>
      
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">Deployment Overview</h2>
        <p className="mb-6 text-gray-300">
          The WYBE deployment process consists of several steps to ensure secure and efficient deployment of smart contracts
          to the Solana blockchain. This guide covers all necessary steps from environment setup to final verification.
        </p>
        
        <div className="space-y-6">
          {/* Main sections of the guide */}
          <div>
            <h3 className="text-lg font-medium text-wybe-primary flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Prerequisites
            </h3>
            <Separator className="my-2 bg-white/10" />
            <ul className="space-y-2 mt-3 text-gray-300">
              <li>• Anchor framework installed (v0.28.0 or higher)</li>
              <li>• Solana CLI tools (v1.16.0 or higher)</li>
              <li>• Node.js (v16.0.0 or higher)</li>
              <li>• Rust (stable)</li>
              <li>• Hardware wallet for production deployments</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-wybe-primary flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Token Contract Deployment
            </h3>
            <Separator className="my-2 bg-white/10" />
            <p className="text-gray-300 mb-3">
              The token contract includes core functionality for meme coin creation, trading, and bonding curve implementation.
              All aspects of the protocol can be configured during deployment.
            </p>
            <div className="bg-black/30 p-3 rounded-md font-mono text-sm">
              # First build the program<br />
              anchor build<br /><br />
              
              # Deploy to your selected network<br />
              anchor deploy --provider.cluster devnet
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-wybe-primary flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Treasury Contract Deployment
            </h3>
            <Separator className="my-2 bg-white/10" />
            <p className="text-gray-300 mb-3">
              The treasury manages all fee collection and distribution, including creator rewards and platform fees.
            </p>
            <div className="bg-black/30 p-3 rounded-md font-mono text-sm">
              # Deploy treasury contract<br />
              solana program deploy ./target/deploy/wybe_treasury.so
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-wybe-primary flex items-center gap-2">
              <Link className="h-4 w-4" />
              Full Deployment Documentation
            </h3>
            <Separator className="my-2 bg-white/10" />
            <p className="text-gray-300">
              For complete step-by-step instructions, please refer to the comprehensive deployment guides in the project repository:
            </p>
            <div className="flex flex-col gap-2 mt-3">
              <Button variant="outline" className="justify-start bg-transparent">
                <ExternalLink className="mr-2 h-4 w-4" />
                <span>Devnet Deployment Guide</span>
              </Button>
              <Button variant="outline" className="justify-start bg-transparent">
                <ExternalLink className="mr-2 h-4 w-4" />
                <span>Mainnet Deployment Guide</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Integration with Frontend */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">Frontend Integration</h2>
        <p className="text-gray-300 mb-4">
          After deploying smart contracts, integration with the frontend application is essential for a complete user experience.
          Follow these guidelines to ensure proper integration:
        </p>
        
        <div className="space-y-4">
          <div className="bg-black/30 p-4 rounded-md">
            <h4 className="font-medium mb-2">1. Update Program IDs</h4>
            <p className="text-sm text-gray-400 mb-2">
              After deployment, update the program IDs in the frontend configuration:
            </p>
            <div className="bg-black/50 p-2 rounded font-mono text-xs">
              // Example configuration update<br />
              const PROGRAM_IDS = {`{`}<br />
              &nbsp;&nbsp;TOKEN: "WybeTokenV1111111111111111111111111111111111",<br />
              &nbsp;&nbsp;TREASURY: "WybeTreasury11111111111111111111111111111111"<br />
              {`}`};
            </div>
          </div>
          
          <div className="bg-black/30 p-4 rounded-md">
            <h4 className="font-medium mb-2">2. Configure Transaction Handlers</h4>
            <p className="text-sm text-gray-400">
              Ensure that all transaction handlers are properly configured to interact with deployed contracts.
            </p>
          </div>
          
          <div className="bg-black/30 p-4 rounded-md">
            <h4 className="font-medium mb-2">3. Test Integration</h4>
            <p className="text-sm text-gray-400">
              Thoroughly test all integrations using the testnet deployment before proceeding to mainnet.
            </p>
          </div>
        </div>
      </div>
      
      {/* Security Considerations */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold mb-4">Security Considerations</h2>
        <p className="text-gray-300 mb-4">
          Security is paramount when deploying financial contracts. Consider these security best practices:
        </p>
        
        <div className="space-y-3 text-gray-300">
          <p>• Use hardware wallets for all mainnet deployments</p>
          <p>• Complete a full security audit before mainnet deployment</p>
          <p>• Implement proper access control for all admin functions</p>
          <p>• Test extensively on devnet before mainnet deployment</p>
          <p>• Monitor contracts after deployment for any unusual activity</p>
        </div>
      </div>
    </motion.div>
  );
};

export default DeploymentGuide;
