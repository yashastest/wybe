import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  FileCode,
  Globe,
  Link
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// Define the type for deployment status
type DeploymentStatusType = {
  status: string;
  tokenAddress?: string;
  bondingCurveAddress?: string;
  treasuryAddress?: string;
};

// Define the overall deployment state type
type DeploymentStateType = {
  testnet: DeploymentStatusType;
  mainnet: DeploymentStatusType;
};

const DeploymentGuide = () => {
  const [deploymentNetwork, setDeploymentNetwork] = useState("testnet");
  const [deploymentStatus, setDeploymentStatus] = useState<DeploymentStateType>({
    testnet: {
      status: "success",
      tokenAddress: "FG9SYnttGJKQsHqNPZhwGVkzkJEGnY8kaySvbSSNYNtw",
      bondingCurveAddress: "Hj9R5Tender3SbKgX1CnUAaTPyYyXU23WgfST1KFsPJE",
      treasuryAddress: "3gF2KHp6KkE2HUMvhiL9aVyvyWpBJ2Pu2fGwFeJXdPSS"
    },
    mainnet: {
      status: "pending"
    }
  });
  const [deploying, setDeploying] = useState(false);

  // Simulated deployment function
  const handleDeploy = () => {
    if (deploymentStatus.mainnet.status === "success") {
      toast.info("Smart contracts already deployed to mainnet");
      return;
    }
    
    setDeploying(true);
    toast.info(`Initiating deployment to ${deploymentNetwork}...`);
    
    // Simulate deployment process
    setTimeout(() => {
      if (deploymentNetwork === "mainnet") {
        setDeploymentStatus({
          ...deploymentStatus,
          mainnet: {
            status: "success",
            tokenAddress: "9vnJ1uFmU3ZTZivxALCkyk9NAAKQ9vHaemRS8M4GXJi5",
            bondingCurveAddress: "D5M89vNj3MexY1zq7xaKnKYyLBVf3LqTuZfrbKTd4AU7",
            treasuryAddress: "FZNVXxLjefJPtxNxvTUiY3Yn4PFwKUvX2XgKQ4Cp8HLu"
          }
        });
      }
      setDeploying(false);
      toast.success(`Deployment to ${deploymentNetwork} completed successfully!`);
    }, 3000);
  };

  // Get status icon based on deployment status
  const getStatusIcon = (status) => {
    if (status === "success") {
      return <CheckCircle2 className="text-green-500" />;
    }
    if (status === "pending") {
      return <AlertTriangle className="text-yellow-500" />;
    }
    return <AlertTriangle className="text-red-500" />;
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
          <Package className="text-orange-500" size={24} />
          Smart Contract Deployment Guide
        </h2>

        <Tabs 
          value={deploymentNetwork} 
          onValueChange={setDeploymentNetwork} 
          className="mb-6"
        >
          <TabsList className="bg-black/20 border border-white/10">
            <TabsTrigger value="testnet" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-500">
              Testnet
            </TabsTrigger>
            <TabsTrigger value="mainnet" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-500">
              Mainnet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="testnet" className="mt-4">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6 flex items-center gap-3">
              <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-green-400">Testnet Deployment Complete</h3>
                <p className="text-sm text-gray-300">All smart contracts have been successfully deployed to Solana testnet</p>
              </div>
            </div>
            
            <div className="bg-white/5 p-4 rounded-lg border border-white/10 mb-6">
              <h3 className="text-lg font-medium mb-3">Testnet Contract Addresses</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Token Contract</p>
                  <div className="flex items-center gap-2">
                    <code className="bg-black/30 px-3 py-1 rounded font-mono text-orange-500 text-sm flex-1 overflow-x-auto">
                      {deploymentStatus.testnet.tokenAddress}
                    </code>
                    <a 
                      href={`https://explorer.solana.com/address/${deploymentStatus.testnet.tokenAddress}?cluster=testnet`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
                    >
                      <Link size={12} className="mr-1" />
                      Explorer
                    </a>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Bonding Curve Contract</p>
                  <div className="flex items-center gap-2">
                    <code className="bg-black/30 px-3 py-1 rounded font-mono text-orange-500 text-sm flex-1 overflow-x-auto">
                      {deploymentStatus.testnet.bondingCurveAddress}
                    </code>
                    <a 
                      href={`https://explorer.solana.com/address/${deploymentStatus.testnet.bondingCurveAddress}?cluster=testnet`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
                    >
                      <Link size={12} className="mr-1" />
                      Explorer
                    </a>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">Treasury Contract</p>
                  <div className="flex items-center gap-2">
                    <code className="bg-black/30 px-3 py-1 rounded font-mono text-orange-500 text-sm flex-1 overflow-x-auto">
                      {deploymentStatus.testnet.treasuryAddress}
                    </code>
                    <a 
                      href={`https://explorer.solana.com/address/${deploymentStatus.testnet.treasuryAddress}?cluster=testnet`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
                    >
                      <Link size={12} className="mr-1" />
                      Explorer
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mainnet" className="mt-4">
            {deploymentStatus.mainnet.status === "success" ? (
              <>
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-6 flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-green-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-green-400">Mainnet Deployment Complete</h3>
                    <p className="text-sm text-gray-300">All smart contracts have been successfully deployed to Solana mainnet</p>
                  </div>
                </div>
                
                <div className="bg-white/5 p-4 rounded-lg border border-white/10 mb-6">
                  <h3 className="text-lg font-medium mb-3">Mainnet Contract Addresses</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Token Contract</p>
                      <div className="flex items-center gap-2">
                        <code className="bg-black/30 px-3 py-1 rounded font-mono text-orange-500 text-sm flex-1 overflow-x-auto">
                          {deploymentStatus.mainnet.tokenAddress}
                        </code>
                        <a 
                          href={`https://explorer.solana.com/address/${deploymentStatus.mainnet.tokenAddress}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
                        >
                          <Link size={12} className="mr-1" />
                          Explorer
                        </a>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Bonding Curve Contract</p>
                      <div className="flex items-center gap-2">
                        <code className="bg-black/30 px-3 py-1 rounded font-mono text-orange-500 text-sm flex-1 overflow-x-auto">
                          {deploymentStatus.mainnet.bondingCurveAddress}
                        </code>
                        <a 
                          href={`https://explorer.solana.com/address/${deploymentStatus.mainnet.bondingCurveAddress}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
                        >
                          <Link size={12} className="mr-1" />
                          Explorer
                        </a>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Treasury Contract</p>
                      <div className="flex items-center gap-2">
                        <code className="bg-black/30 px-3 py-1 rounded font-mono text-orange-500 text-sm flex-1 overflow-x-auto">
                          {deploymentStatus.mainnet.treasuryAddress}
                        </code>
                        <a 
                          href={`https://explorer.solana.com/address/${deploymentStatus.mainnet.treasuryAddress}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors"
                        >
                          <Link size={12} className="mr-1" />
                          Explorer
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-6 flex items-center gap-3">
                  <AlertTriangle size={20} className="text-yellow-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-yellow-400">Ready for Mainnet Deployment</h3>
                    <p className="text-sm text-gray-300">Please review the deployment steps below before proceeding</p>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-orange-500 hover:bg-orange-600 mb-6"
                  onClick={handleDeploy}
                  disabled={deploying}
                >
                  {deploying ? "Deploying..." : "Deploy to Mainnet"}
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </>
            )}
          </TabsContent>
        </Tabs>

        <div className="bg-white/5 p-4 rounded-lg border border-orange-500/20">
          <h3 className="text-lg font-medium mb-4">Deployment Steps</h3>
          
          <div className="space-y-6">
            <div className="relative pl-8 border-l border-white/10">
              <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 -translate-x-3">
                <span className="text-green-500 text-xs font-bold">1</span>
              </div>
              <h4 className="font-medium text-white mb-1">Prepare Your Environment</h4>
              <p className="text-sm text-gray-300 mb-2">
                Ensure you have a Solana wallet with enough SOL to cover deployment costs
              </p>
              <div className="bg-black/20 p-2 rounded border border-white/10 text-sm mb-2">
                <code className="text-orange-400">solana config set --url https://api.{deploymentNetwork}.solana.com</code>
              </div>
              <p className="text-xs text-gray-400">
                ✓ Check balance: <code className="bg-black/30 px-1 rounded">solana balance</code>
              </p>
            </div>
            
            <div className="relative pl-8 border-l border-white/10">
              <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 -translate-x-3">
                <span className="text-green-500 text-xs font-bold">2</span>
              </div>
              <h4 className="font-medium text-white mb-1">Deploy Token Contract</h4>
              <p className="text-sm text-gray-300 mb-2">
                The token contract manages the core functionality of your token
              </p>
              <div className="bg-black/20 p-2 rounded border border-white/10 text-sm mb-2">
                <code className="text-orange-400">solana program deploy ./build/token_contract.so</code>
              </div>
              <p className="text-xs text-gray-400">
                ✓ Estimated cost: ~0.5 SOL
              </p>
            </div>
            
            <div className="relative pl-8 border-l border-white/10">
              <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 -translate-x-3">
                <span className="text-green-500 text-xs font-bold">3</span>
              </div>
              <h4 className="font-medium text-white mb-1">Deploy Bonding Curve Contract</h4>
              <p className="text-sm text-gray-300 mb-2">
                This contract manages the price function and trading mechanics
              </p>
              <div className="bg-black/20 p-2 rounded border border-white/10 text-sm mb-2">
                <code className="text-orange-400">solana program deploy ./build/bonding_curve.so</code>
              </div>
              <p className="text-xs text-gray-400">
                ✓ Estimated cost: ~0.7 SOL
              </p>
            </div>
            
            <div className="relative pl-8 border-l border-white/10">
              <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 -translate-x-3">
                <span className="text-green-500 text-xs font-bold">4</span>
              </div>
              <h4 className="font-medium text-white mb-1">Deploy Treasury Contract</h4>
              <p className="text-sm text-gray-300 mb-2">
                The treasury contract collects and distributes fees
              </p>
              <div className="bg-black/20 p-2 rounded border border-white/10 text-sm mb-2">
                <code className="text-orange-400">solana program deploy ./build/treasury.so</code>
              </div>
              <p className="text-xs text-gray-400">
                ✓ Estimated cost: ~0.5 SOL
              </p>
            </div>
            
            <div className="relative pl-8">
              <div className="absolute left-0 top-0 flex items-center justify-center w-6 h-6 rounded-full bg-green-500/20 -translate-x-3">
                <span className="text-green-500 text-xs font-bold">5</span>
              </div>
              <h4 className="font-medium text-white mb-1">Initialize Contracts</h4>
              <p className="text-sm text-gray-300 mb-2">
                Link all contracts together and set initial parameters
              </p>
              <div className="bg-black/20 p-2 rounded border border-white/10 text-sm mb-2">
                <code className="text-orange-400">solana program call init --treasury {deploymentStatus.testnet.treasuryAddress} --token {deploymentStatus.testnet.tokenAddress} --curve {deploymentStatus.testnet.bondingCurveAddress}</code>
              </div>
              <p className="text-xs text-gray-400">
                ✓ Estimated cost: ~0.2 SOL
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <h4 className="text-blue-400 font-medium mb-2">Deployment Tips</h4>
          <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300">
            <li>Always deploy to testnet first and thoroughly test before going to mainnet</li>
            <li>Ensure you have at least 3 SOL to cover all deployment costs</li>
            <li>Keep your deployment keys secure - never share them publicly</li>
            <li>Monitor gas prices and deploy during periods of lower network congestion</li>
            <li>After deployment, verify all contracts on Solana Explorer</li>
          </ul>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DeploymentGuide;
