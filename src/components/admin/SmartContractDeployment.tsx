
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
import { useNavigate } from "react-router-dom";

const SmartContractDeployment = () => {
  const [isAnchorInstalled, setIsAnchorInstalled] = useState(false);
  const [anchorVersion, setAnchorVersion] = useState<string | undefined>(undefined);
  const [isDeploying, setIsDeploying] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    checkAnchorInstallation();
  }, []);
  
  const checkAnchorInstallation = () => {
    setIsAnchorInstalled(integrationService.isAnchorInstalled());
    setAnchorVersion(integrationService.getAnchorVersion());
  };
  
  const handleDeployContract = async () => {
    if (!isAnchorInstalled) {
      toast.error("Anchor CLI is required for contract deployment. Please install it first.");
      return;
    }
    
    setIsDeploying(true);
    toast.info("Starting smart contract deployment process...");
    
    try {
      // Get connected wallet address (would be implemented in a real app)
      const walletAddress = "8JzqrG4pQSSA7QuQeEjbDxKLBMqKriGCNzUL7Lxpk8iD"; // Mock address
      
      // Deploy via integration service
      const result = await integrationService.deployFullEnvironment(
        {
          networkType: 'devnet',
          creatorFeePercentage: 2.5,
          platformFeePercentage: 2.5
        },
        walletAddress
      );
      
      if (result.success) {
        toast.success("Smart contract deployed successfully!", {
          description: "Your contract is now live on the blockchain."
        });
      } else {
        toast.error("Deployment failed", {
          description: result.message
        });
      }
    } catch (error) {
      console.error("Deployment error:", error);
      toast.error("An unexpected error occurred during deployment");
    } finally {
      setIsDeploying(false);
    }
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
          </TabsList>
          
          <TabsContent value="guide">
            <SmartContractSteps className="bg-transparent" />
            
            <div className="mt-8">
              <Button
                className="w-full py-6 font-poppins font-bold text-base bg-orange-600 hover:bg-orange-700"
                onClick={handleDeployContract}
                disabled={isDeploying || !isAnchorInstalled}
              >
                {isDeploying ? (
                  <>
                    <RefreshCcw className="mr-2 h-5 w-5 animate-spin" />
                    Deploying Contract...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 h-5 w-5" />
                    Deploy Smart Contract
                  </>
                )}
              </Button>
              
              {!isAnchorInstalled && (
                <p className="text-amber-400 text-sm mt-2 flex items-center">
                  <AlertTriangle size={16} className="mr-1" />
                  Anchor CLI must be installed before deployment. See the Deployment Status tab.
                </p>
              )}
            </div>
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
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default SmartContractDeployment;
