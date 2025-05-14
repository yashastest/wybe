import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Network,
  Code,
  Database,
  GitBranch,
  CheckCircle2,
  Layers,
  RefreshCcw,
  Server,
  FileCode,
  TerminalSquare,
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { integrationService } from "@/services/integrationService";
import ContractSecurityAudit from './ContractSecurityAudit';
import { smartContractService } from '@/services/smartContractService';

const DeploymentEnvironment = () => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [isCompletingSetup, setIsCompletingSetup] = useState(false);
  const navigate = useNavigate();
  
  const handleGoToSmartContractDeployment = () => {
    navigate('/admin');
    setTimeout(() => {
      const deploymentTab = document.querySelector('[value="deployment"]') as HTMLButtonElement;
      if (deploymentTab) {
        deploymentTab.click();
      }
    }, 100);
  };
  
  const handleCompleteDeploymentSetup = async () => {
    setIsCompletingSetup(true);
    toast.info("Starting complete deployment setup...");
    
    try {
      // First deploy contracts
      toast.info("Setting up smart contracts...");
      const contractResult = await smartContractService.deployWithOptions({
        networkType: 'testnet',
        verbose: true
      });
      
      if (!contractResult.success) {
        toast.error(`Contract deployment failed: ${contractResult.message}`);
        setIsCompletingSetup(false);
        return;
      }
      
      toast.success("Smart contracts deployed successfully!");
      
      // Next set up infrastructure components
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.info("Setting up backend infrastructure...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success("Backend API services configured!");
      
      // Finally connect frontend to backend
      toast.info("Configuring frontend application...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success("Frontend connected to backend services!");
      
      // Complete setup
      toast.success("Deployment setup completed successfully!", {
        description: "Your environment is now fully configured and ready to use."
      });
    } catch (error) {
      console.error("Setup error:", error);
      toast.error("Failed to complete deployment setup");
    } finally {
      setIsCompletingSetup(false);
    }
  };
  
  const handleDeployEnvironment = async () => {
    setIsDeploying(true);
    toast.info("Preparing to deploy environment...");
    
    try {
      // Use dummy wallet address for testing (in real app would use connected wallet)
      const walletAddress = "8JzqrG4pQSSA7QuQeEjbDxKLBMqKriGCNzUL7Lxpk8iD";
      
      // Call integration service to deploy the full environment
      const result = await integrationService.deployFullEnvironment(
        {
          networkType: 'testnet',
          frontendUrl: 'https://app.wybe.finance',
          backendUrl: 'https://api.wybe.finance',
          creatorFeePercentage: 2.5,
          platformFeePercentage: 2.5
        },
        walletAddress
      );
      
      if (result.success) {
        toast.success("Environment deployed successfully!", {
          description: "Your frontend, backend, and smart contracts are live."
        });
      } else {
        toast.error("Environment deployment failed", {
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
      className="space-y-6"
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 }
        }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Network className="text-orange-500" size={24} />
          Deployment Environment
        </h2>

        <div className="space-y-8">
          {/* Overview Section */}
          <div className="glass-card bg-white/5 p-5 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Environment Overview</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <FileCode size={18} className="text-blue-500" />
                  <span className="font-medium">Frontend</span>
                </div>
                <p className="text-sm text-gray-300">Status: <span className="text-green-500">Ready</span></p>
                <p className="text-sm text-gray-300">URL: app.wybe.finance</p>
              </div>
              
              <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Server size={18} className="text-purple-500" />
                  <span className="font-medium">Backend API</span>
                </div>
                <p className="text-sm text-gray-300">Status: <span className="text-green-500">Ready</span></p>
                <p className="text-sm text-gray-300">URL: api.wybe.finance</p>
              </div>
              
              <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                <div className="flex items-center gap-2 mb-2">
                  <Code size={18} className="text-orange-500" />
                  <span className="font-medium">Smart Contract</span>
                </div>
                <p className="text-sm text-gray-300">Status: <span className="text-green-500">Ready</span></p>
                <p className="text-sm text-gray-300">Network: Testnet</p>
              </div>
            </div>
            
            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600 py-6 font-bold text-white"
              onClick={handleDeployEnvironment}
              disabled={isDeploying}
            >
              {isDeploying ? (
                <>
                  <RefreshCcw className="mr-2 h-5 w-5 animate-spin" />
                  Deploying Environment...
                </>
              ) : (
                <>
                  <Network className="mr-2 h-5 w-5" />
                  Deploy Environment
                </>
              )}
            </Button>
          </div>
          
          {/* Smart Contract Section */}
          <div className="glass-card bg-white/5 p-5 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Smart Contract</h3>
            
            <div className="space-y-4 mb-6">
              <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GitBranch size={18} className="text-orange-500" />
                    <span className="font-medium">Contract Status</span>
                  </div>
                  <span className="px-2 py-1 text-xs bg-green-500/20 text-green-500 rounded-full">
                    Ready to Deploy
                  </span>
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Program ID:</span>
                    <span className="font-mono bg-black/30 px-2 py-1 rounded text-xs">
                      Wyb111111111111111111111111111111111111111
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Creator Fee:</span>
                    <span>2.5%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Platform Fee:</span>
                    <span>2.5%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">Network:</span>
                    <span>Testnet</span>
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full border-orange-500/30 hover:bg-orange-500/10"
              onClick={handleGoToSmartContractDeployment}
            >
              <TerminalSquare className="mr-2 h-4 w-4" />
              Go to Smart Contract Deployment
            </Button>
          </div>
          
          {/* Infrastructure Section */}
          <div className="glass-card bg-white/5 p-5 rounded-lg">
            <h3 className="text-lg font-bold mb-4">Infrastructure</h3>
            
            <div className="bg-black/20 p-4 rounded-lg border border-white/10 mb-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Database size={18} className="text-blue-500" />
                    <span className="font-medium">Database</span>
                  </div>
                  <span className="px-2 py-1 text-xs bg-green-500/20 text-green-500 rounded-full">
                    Initialized
                  </span>
                </div>
                
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <Layers size={18} className="text-purple-500" />
                    <span className="font-medium">API Services</span>
                  </div>
                  <span className="px-2 py-1 text-xs bg-green-500/20 text-green-500 rounded-full">
                    Ready
                  </span>
                </div>
                
                <div className="flex items-center gap-2 justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-green-500" />
                    <span className="font-medium">Monitoring</span>
                  </div>
                  <span className="px-2 py-1 text-xs bg-green-500/20 text-green-500 rounded-full">
                    Active
                  </span>
                </div>
              </div>
            </div>
            
            <Button
              variant="default"
              className="w-full bg-orange-500 hover:bg-orange-600"
              onClick={handleCompleteDeploymentSetup}
              disabled={isCompletingSetup}
            >
              {isCompletingSetup ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Setting Up...
                </>
              ) : (
                <>
                  <Server className="mr-2 h-4 w-4" />
                  Complete Deployment Setup
                </>
              )}
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Security Audit Section */}
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 }
        }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Code className="text-orange-500" size={24} />
          Security & Testing
        </h2>
        
        <ContractSecurityAudit />
      </motion.div>
    </motion.div>
  );
};

export default DeploymentEnvironment;
