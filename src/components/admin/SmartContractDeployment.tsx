
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  FileCode2, 
  Code, 
  CheckCircle2, 
  Shield, 
  Rocket,
  ArrowRight,
  CircleDollarSign,
  Terminal,
  AlertTriangle,
  RefreshCcw
} from "lucide-react";
import SmartContractSteps from "@/components/SmartContractSteps";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { smartContractService } from "@/services/smartContractService";
import { integrationService } from "@/services/integrationService";
import AnchorStatusCard from "./AnchorStatusCard";

const SmartContractDeployment = () => {
  const [requestSent, setRequestSent] = useState(false);
  const [isAnchorInstalled, setIsAnchorInstalled] = useState(false);
  const [anchorVersion, setAnchorVersion] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    checkAnchorInstallation();
  }, []);
  
  const checkAnchorInstallation = () => {
    setIsAnchorInstalled(integrationService.isAnchorInstalled());
    setAnchorVersion(integrationService.getAnchorVersion());
  };
  
  const handleDeploymentRequest = () => {
    setRequestSent(true);
    toast.success("Deployment request submitted successfully", {
      description: "Our team will contact you within 24 hours."
    });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className="space-y-6 pt-8"
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 }
        }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold font-poppins mb-6 flex items-center gap-2">
          <FileCode2 className="text-orange-500" size={24} />
          Smart Contract Deployment
        </h2>

        <Tabs defaultValue="guide">
          <TabsList className="mb-6">
            <TabsTrigger value="guide" className="flex items-center gap-2 font-poppins font-bold">
              <Code size={16} />
              Implementation Guide
            </TabsTrigger>
            <TabsTrigger value="status" className="flex items-center gap-2 font-poppins font-bold">
              <Terminal size={16} />
              Deployment Status
            </TabsTrigger>
            <TabsTrigger value="request" className="flex items-center gap-2 font-poppins font-bold">
              <Rocket size={16} />
              Request Deployment
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="guide">
            <SmartContractSteps className="bg-transparent" />
          </TabsContent>
          
          <TabsContent value="status">
            <div className="space-y-4">
              <p className="text-gray-300 mb-6">
                Check the status of Anchor CLI installation and deployment environment.
                Real contract deployment requires Anchor CLI to be installed on your system.
              </p>
              
              <AnchorStatusCard />
              
              <div className="glass-card p-5 bg-gradient-to-br from-wybe-primary/10 to-transparent mt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-wybe-primary/20 p-2 rounded-full">
                    <AlertTriangle className="h-5 w-5 text-wybe-primary" />
                  </div>
                  <h3 className="text-lg font-poppins font-bold">Deployment Requirements</h3>
                </div>
                
                <ul className="space-y-3 mb-4">
                  <li className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isAnchorInstalled ? 'bg-green-500/20' : 'bg-gray-500/20'}`}>
                      {isAnchorInstalled ? (
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                      ) : (
                        <div className="h-1.5 w-1.5 rounded-full bg-gray-500" />
                      )}
                    </div>
                    <span>Anchor CLI installed {isAnchorInstalled && anchorVersion && `(${anchorVersion})`}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                    </div>
                    <span>Solana CLI configured</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                    </div>
                    <span>Project structure initialized</span>
                  </li>
                </ul>
                
                <div className="bg-black/30 p-4 rounded-lg mb-4">
                  <h4 className="font-poppins font-bold mb-2 flex items-center gap-2">
                    <Terminal size={16} className="text-wybe-primary" />
                    Command Line Tools
                  </h4>
                  <p className="text-sm text-gray-300 mb-3">
                    For real contract deployment, ensure these tools are installed:
                  </p>
                  <div className="space-y-2 text-sm font-mono bg-black/50 p-3 rounded-md">
                    <div className="flex justify-between items-center">
                      <span>anchor</span>
                      <span className={isAnchorInstalled ? "text-green-400" : "text-red-400"}>
                        {isAnchorInstalled ? "✓ installed" : "✗ missing"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>solana</span>
                      <span className="text-green-400">✓ installed</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>node</span>
                      <span className="text-green-400">✓ installed</span>
                    </div>
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2 font-poppins"
                  onClick={() => window.open("https://www.anchor-lang.com/docs/installation", "_blank")}
                >
                  <Terminal size={16} />
                  Anchor Installation Guide
                  <ArrowRight size={16} />
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="request" className="space-y-8">
            <div className="glass-card p-6 bg-gradient-to-br from-orange-500/10 to-transparent">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-orange-500/20 p-3 rounded-full">
                  <Shield className="text-orange-500 h-6 w-6" />
                </div>
                <h3 className="text-xl font-poppins font-bold">Professional Deployment Service</h3>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                Our expert team will handle all aspects of your token deployment and smart contract setup, ensuring a smooth and secure launch on the Solana blockchain. We take care of the technical details so you can focus on building your community.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-black/30 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CheckCircle2 className="text-green-500 mr-2 h-5 w-5" />
                    <h4 className="font-poppins font-bold">Security Audited</h4>
                  </div>
                  <p className="text-sm text-gray-400">All contracts undergo multi-layer security audits before deployment</p>
                </div>
                <div className="bg-black/30 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CheckCircle2 className="text-green-500 mr-2 h-5 w-5" />
                    <h4 className="font-poppins font-bold">Custom Parameters</h4>
                  </div>
                  <p className="text-sm text-gray-400">Configure tokenomics, supply, and bonding curve parameters</p>
                </div>
                <div className="bg-black/30 p-4 rounded-lg">
                  <div className="flex items-center mb-2">
                    <CheckCircle2 className="text-green-500 mr-2 h-5 w-5" />
                    <h4 className="font-poppins font-bold">Full Support</h4>
                  </div>
                  <p className="text-sm text-gray-400">Dedicated technical support during and after deployment</p>
                </div>
              </div>
              
              <div className="bg-wybe-background/80 border border-white/10 p-4 rounded-lg mb-6">
                <h4 className="flex items-center text-lg font-poppins font-bold mb-3">
                  <CircleDollarSign className="text-orange-500 mr-2" />
                  Pricing
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="font-mono font-bold mb-1">Standard Package</p>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-2xl font-bold">2 SOL</span>
                      <span className="text-gray-400 text-sm">+ gas fees</span>
                    </div>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li className="flex items-center">
                        <CheckCircle2 className="text-green-500 mr-2 h-3 w-3" />
                        Basic token setup
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="text-green-500 mr-2 h-3 w-3" />
                        Linear bonding curve
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="text-green-500 mr-2 h-3 w-3" />
                        Standard fee model
                      </li>
                    </ul>
                  </div>
                  <div>
                    <p className="font-mono font-bold mb-1">Premium Package</p>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-2xl font-bold">5 SOL</span>
                      <span className="text-gray-400 text-sm">+ gas fees</span>
                    </div>
                    <ul className="text-sm space-y-1 text-gray-300">
                      <li className="flex items-center">
                        <CheckCircle2 className="text-green-500 mr-2 h-3 w-3" />
                        Advanced tokenomics
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="text-green-500 mr-2 h-3 w-3" />
                        Custom bonding curve
                      </li>
                      <li className="flex items-center">
                        <CheckCircle2 className="text-green-500 mr-2 h-3 w-3" />
                        Advanced features (staking, etc.)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <Button 
                className={`w-full py-6 font-poppins font-bold text-base ${
                  requestSent ? "bg-green-600 hover:bg-green-700" : "bg-orange-600 hover:bg-orange-700"
                }`}
                onClick={handleDeploymentRequest}
                disabled={requestSent}
              >
                {requestSent ? (
                  <>
                    <CheckCircle2 className="mr-2 h-5 w-5" />
                    Request Submitted
                  </>
                ) : (
                  <>
                    Request Deployment Assistance
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
            
            {requestSent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 border-green-500/30"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-500/20 p-2 rounded-full">
                    <CheckCircle2 className="text-green-500" />
                  </div>
                  <h3 className="text-xl font-poppins font-bold">Request Received</h3>
                </div>
                <p className="text-gray-300">
                  Your deployment request has been successfully submitted. Our team will review your request and contact you within 24 hours to discuss next steps. Please ensure your contact information is up-to-date in your account settings.
                </p>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default SmartContractDeployment;
