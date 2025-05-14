
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
  Link,
  Copy,
  Check,
  X,
  Download,
  Upload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

// Define the configuration type
type ConfigurationType = {
  repositoryUrl: string;
  apiUrl: string;
  solanaNetwork: string;
  treasuryWallet: string;
  feePercentage: string;
  gatewayUrl: string;
};

// Define the deployment checklist type
type ChecklistItemType = {
  id: string;
  label: string;
  checked: boolean;
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
  const [copied, setCopied] = useState<string | null>(null);
  const [configuration, setConfiguration] = useState<ConfigurationType>({
    repositoryUrl: "https://github.com/your-org/wybe-token-platform.git",
    apiUrl: "https://api.wybe.io",
    solanaNetwork: "devnet",
    treasuryWallet: "",
    feePercentage: "2.5",
    gatewayUrl: "https://solana-api.projectserum.com"
  });
  
  // Deployment checklist
  const [checklist, setChecklist] = useState<ChecklistItemType[]>([
    { id: "env_setup", label: "Environment Setup Complete", checked: false },
    { id: "wallet_setup", label: "Solana Wallet Configured", checked: false },
    { id: "testnet_deploy", label: "Testnet Deployment Successful", checked: false },
    { id: "frontend_integration", label: "Frontend Integration Complete", checked: false },
    { id: "backend_integration", label: "Backend Integration Complete", checked: false },
    { id: "db_setup", label: "Database Configuration Complete", checked: false },
    { id: "testing", label: "End-to-End Testing Complete", checked: false },
    { id: "mainnet_ready", label: "Ready for Mainnet Deployment", checked: false }
  ]);

  // Toggle checklist item
  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
    
    // Calculate progress after toggling
    const newChecklist = checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    
    const completedItems = newChecklist.filter(item => item.checked).length;
    const percentage = Math.round((completedItems / newChecklist.length) * 100);
    
    if (percentage === 100) {
      toast.success("All deployment steps completed! Ready for production deployment.", {
        duration: 3000,
      });
    } else {
      toast.info(`Deployment progress: ${percentage}%`, {
        duration: 2000,
      });
    }
  };
  
  // Handle configuration change
  const handleConfigChange = (field: keyof ConfigurationType, value: string) => {
    setConfiguration(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Simulated deployment function
  const handleDeploy = () => {
    if (deploymentStatus.mainnet.status === "success") {
      toast.info("Smart contracts already deployed to mainnet", { duration: 3000 });
      return;
    }
    
    setDeploying(true);
    toast.info(`Initiating deployment to ${deploymentNetwork}...`, { duration: 3000 });
    
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
      toast.success(`Deployment to ${deploymentNetwork} completed successfully!`, { duration: 3000 });
    }, 3000);
  };

  // Copy to clipboard function
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    toast.success(`${type} copied to clipboard!`, { duration: 2000 });
    
    setTimeout(() => {
      setCopied(null);
    }, 2000);
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

  // Calculate deployment progress
  const calculateProgress = () => {
    const completedItems = checklist.filter(item => item.checked).length;
    return (completedItems / checklist.length) * 100;
  };

  // Generate environment file content
  const generateEnvContent = () => {
    return `# Wybe Token Platform Environment Configuration
VITE_API_URL=${configuration.apiUrl}
VITE_SOLANA_NETWORK=${configuration.solanaNetwork}
VITE_TREASURY_WALLET=${configuration.treasuryWallet || "your-treasury-wallet-address"}
VITE_DEFAULT_FEE_PERCENTAGE=${configuration.feePercentage}
VITE_SOLANA_RPC=${configuration.gatewayUrl}
# Smart Contract Addresses
VITE_TOKEN_ADDRESS=${deploymentNetwork === "mainnet" ? deploymentStatus.mainnet.tokenAddress || "" : deploymentStatus.testnet.tokenAddress}
VITE_BONDING_CURVE_ADDRESS=${deploymentNetwork === "mainnet" ? deploymentStatus.mainnet.bondingCurveAddress || "" : deploymentStatus.testnet.bondingCurveAddress}
VITE_TREASURY_ADDRESS=${deploymentNetwork === "mainnet" ? deploymentStatus.mainnet.treasuryAddress || "" : deploymentStatus.testnet.treasuryAddress}`;
  };

  // Download environment file
  const downloadEnvFile = () => {
    const content = generateEnvContent();
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = ".env";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Environment file downloaded successfully", { duration: 3000 });
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
        <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
          <Package className="text-orange-500" size={24} />
          Smart Contract Deployment Guide
        </h2>
        
        {/* Deployment Progress Indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-gray-300">Deployment Progress</h3>
            <span className="text-sm font-medium text-orange-400">{Math.round(calculateProgress())}%</span>
          </div>
          <div className="w-full bg-gray-700/50 rounded-full h-2.5">
            <div 
              className="bg-orange-500 h-2.5 rounded-full" 
              style={{ width: `${calculateProgress()}%` }}
            ></div>
          </div>
        </div>

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
                    <button 
                      className="p-1.5 bg-white/10 hover:bg-white/20 rounded transition"
                      onClick={() => copyToClipboard(deploymentStatus.testnet.tokenAddress!, "Token address")}
                    >
                      {copied === "Token address" ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    </button>
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
                    <button 
                      className="p-1.5 bg-white/10 hover:bg-white/20 rounded transition"
                      onClick={() => copyToClipboard(deploymentStatus.testnet.bondingCurveAddress!, "Bonding curve address")}
                    >
                      {copied === "Bonding curve address" ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    </button>
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
                    <button 
                      className="p-1.5 bg-white/10 hover:bg-white/20 rounded transition"
                      onClick={() => copyToClipboard(deploymentStatus.testnet.treasuryAddress!, "Treasury address")}
                    >
                      {copied === "Treasury address" ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    </button>
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
                        <button 
                          className="p-1.5 bg-white/10 hover:bg-white/20 rounded transition"
                          onClick={() => copyToClipboard(deploymentStatus.mainnet.tokenAddress!, "Mainnet token address")}
                        >
                          {copied === "Mainnet token address" ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                        </button>
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
                        <button 
                          className="p-1.5 bg-white/10 hover:bg-white/20 rounded transition"
                          onClick={() => copyToClipboard(deploymentStatus.mainnet.bondingCurveAddress!, "Mainnet bonding curve address")}
                        >
                          {copied === "Mainnet bonding curve address" ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                        </button>
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
                        <button 
                          className="p-1.5 bg-white/10 hover:bg-white/20 rounded transition"
                          onClick={() => copyToClipboard(deploymentStatus.mainnet.treasuryAddress!, "Mainnet treasury address")}
                        >
                          {copied === "Mainnet treasury address" ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                        </button>
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

        {/* Configuration Section */}
        <Card className="mb-6 bg-black/20 border border-orange-500/20">
          <CardHeader>
            <CardTitle className="text-lg">Deployment Configuration</CardTitle>
            <CardDescription>
              Configure your deployment settings. These values will be used in your .env file.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="repo-url" className="text-sm font-medium block mb-1 text-gray-300">Repository URL</label>
              <Input 
                id="repo-url"
                value={configuration.repositoryUrl}
                onChange={(e) => handleConfigChange("repositoryUrl", e.target.value)}
                className="bg-black/30 border-white/10"
                placeholder="https://github.com/your-org/wybe-token-platform.git"
              />
            </div>
            
            <div>
              <label htmlFor="api-url" className="text-sm font-medium block mb-1 text-gray-300">API URL</label>
              <Input 
                id="api-url"
                value={configuration.apiUrl}
                onChange={(e) => handleConfigChange("apiUrl", e.target.value)}
                className="bg-black/30 border-white/10"
                placeholder="https://api.wybe.io"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="solana-network" className="text-sm font-medium block mb-1 text-gray-300">Solana Network</label>
                <Input 
                  id="solana-network"
                  value={configuration.solanaNetwork}
                  onChange={(e) => handleConfigChange("solanaNetwork", e.target.value)}
                  className="bg-black/30 border-white/10"
                  placeholder="mainnet-beta or devnet"
                />
              </div>
              
              <div>
                <label htmlFor="treasury-wallet" className="text-sm font-medium block mb-1 text-gray-300">Treasury Wallet Address</label>
                <Input 
                  id="treasury-wallet"
                  value={configuration.treasuryWallet}
                  onChange={(e) => handleConfigChange("treasuryWallet", e.target.value)}
                  className="bg-black/30 border-white/10"
                  placeholder="Your treasury wallet public key"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="fee-percentage" className="text-sm font-medium block mb-1 text-gray-300">Fee Percentage</label>
                <Input 
                  id="fee-percentage"
                  value={configuration.feePercentage}
                  onChange={(e) => handleConfigChange("feePercentage", e.target.value)}
                  className="bg-black/30 border-white/10"
                  placeholder="2.5"
                  type="number"
                  min="0"
                  step="0.1"
                  max="10"
                />
              </div>
              
              <div>
                <label htmlFor="gateway-url" className="text-sm font-medium block mb-1 text-gray-300">RPC Gateway URL</label>
                <Input 
                  id="gateway-url"
                  value={configuration.gatewayUrl}
                  onChange={(e) => handleConfigChange("gatewayUrl", e.target.value)}
                  className="bg-black/30 border-white/10"
                  placeholder="https://api.mainnet-beta.solana.com"
                />
              </div>
            </div>
            
            <div className="pt-2">
              <Button 
                onClick={downloadEnvFile} 
                variant="outline" 
                className="w-full sm:w-auto flex items-center gap-2"
              >
                <Download size={16} />
                Download Environment File
              </Button>
              
              <div className="mt-4">
                <label htmlFor="env-preview" className="text-sm font-medium block mb-1 text-gray-300">Environment File Preview</label>
                <Textarea 
                  id="env-preview"
                  value={generateEnvContent()}
                  readOnly
                  className="font-mono text-xs bg-black/30 border-white/10 h-32 resize-none"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Deployment Checklist */}
        <Card className="mb-6 bg-black/20 border border-orange-500/20">
          <CardHeader>
            <CardTitle className="text-lg">Deployment Checklist</CardTitle>
            <CardDescription>
              Track your progress through each deployment step
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {checklist.map(item => (
                <li key={item.id} className="flex items-center gap-3">
                  <button
                    onClick={() => toggleChecklistItem(item.id)}
                    className={`w-5 h-5 rounded flex-shrink-0 flex items-center justify-center ${
                      item.checked ? "bg-green-500" : "border border-gray-500"
                    }`}
                  >
                    {item.checked && <Check size={12} className="text-white" />}
                  </button>
                  <span className={item.checked ? "text-green-400" : "text-gray-300"}>
                    {item.label}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

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
                <div className="flex items-center justify-between">
                  <code className="text-orange-400">solana config set --url https://api.{deploymentNetwork}.solana.com</code>
                  <button 
                    className="p-1 bg-white/10 hover:bg-white/20 rounded transition"
                    onClick={() => copyToClipboard(`solana config set --url https://api.${deploymentNetwork}.solana.com`, "Config command")}
                  >
                    {copied === "Config command" ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  </button>
                </div>
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
                <div className="flex items-center justify-between">
                  <code className="text-orange-400">solana program deploy ./build/token_contract.so</code>
                  <button 
                    className="p-1 bg-white/10 hover:bg-white/20 rounded transition"
                    onClick={() => copyToClipboard(`solana program deploy ./build/token_contract.so`, "Deploy token command")}
                  >
                    {copied === "Deploy token command" ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  </button>
                </div>
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
                <div className="flex items-center justify-between">
                  <code className="text-orange-400">solana program deploy ./build/bonding_curve.so</code>
                  <button 
                    className="p-1 bg-white/10 hover:bg-white/20 rounded transition"
                    onClick={() => copyToClipboard(`solana program deploy ./build/bonding_curve.so`, "Deploy bonding curve command")}
                  >
                    {copied === "Deploy bonding curve command" ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  </button>
                </div>
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
                <div className="flex items-center justify-between">
                  <code className="text-orange-400">solana program deploy ./build/treasury.so</code>
                  <button 
                    className="p-1 bg-white/10 hover:bg-white/20 rounded transition"
                    onClick={() => copyToClipboard(`solana program deploy ./build/treasury.so`, "Deploy treasury command")}
                  >
                    {copied === "Deploy treasury command" ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  </button>
                </div>
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
                <div className="flex items-center justify-between">
                  <code className="text-orange-400">solana program call init --treasury {deploymentStatus.testnet.treasuryAddress} --token {deploymentStatus.testnet.tokenAddress} --curve {deploymentStatus.testnet.bondingCurveAddress}</code>
                  <button 
                    className="p-1 bg-white/10 hover:bg-white/20 rounded transition"
                    onClick={() => copyToClipboard(`solana program call init --treasury ${deploymentStatus.testnet.treasuryAddress} --token ${deploymentStatus.testnet.tokenAddress} --curve ${deploymentStatus.testnet.bondingCurveAddress}`, "Init command")}
                  >
                    {copied === "Init command" ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  </button>
                </div>
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
        
        {/* GitHub Integration Section */}
        <Card className="mt-6 bg-black/20 border border-purple-500/20">
          <CardHeader>
            <CardTitle className="text-lg">GitHub Integration</CardTitle>
            <CardDescription>
              Prepare your codebase for version control
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-black/20 p-4 rounded-lg border border-white/10">
              <h4 className="text-md font-medium mb-2">GitHub Repository Setup</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between bg-black/30 p-2 rounded text-sm">
                  <code className="text-orange-400">git init</code>
                  <button 
                    className="p-1 bg-white/10 hover:bg-white/20 rounded transition"
                    onClick={() => copyToClipboard(`git init`, "Git init command")}
                  >
                    {copied === "Git init command" ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  </button>
                </div>
                <div className="flex items-center justify-between bg-black/30 p-2 rounded text-sm">
                  <code className="text-orange-400">git add .</code>
                  <button 
                    className="p-1 bg-white/10 hover:bg-white/20 rounded transition"
                    onClick={() => copyToClipboard(`git add .`, "Git add command")}
                  >
                    {copied === "Git add command" ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  </button>
                </div>
                <div className="flex items-center justify-between bg-black/30 p-2 rounded text-sm">
                  <code className="text-orange-400">git commit -m "Initial commit"</code>
                  <button 
                    className="p-1 bg-white/10 hover:bg-white/20 rounded transition"
                    onClick={() => copyToClipboard(`git commit -m "Initial commit"`, "Git commit command")}
                  >
                    {copied === "Git commit command" ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  </button>
                </div>
                <div className="flex items-center justify-between bg-black/30 p-2 rounded text-sm">
                  <code className="text-orange-400">git remote add origin {configuration.repositoryUrl}</code>
                  <button 
                    className="p-1 bg-white/10 hover:bg-white/20 rounded transition"
                    onClick={() => copyToClipboard(`git remote add origin ${configuration.repositoryUrl}`, "Git remote command")}
                  >
                    {copied === "Git remote command" ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  </button>
                </div>
                <div className="flex items-center justify-between bg-black/30 p-2 rounded text-sm">
                  <code className="text-orange-400">git push -u origin main</code>
                  <button 
                    className="p-1 bg-white/10 hover:bg-white/20 rounded transition"
                    onClick={() => copyToClipboard(`git push -u origin main`, "Git push command")}
                  >
                    {copied === "Git push command" ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-black/20 p-4 rounded-lg border border-white/10">
              <h4 className="text-md font-medium mb-2">.gitignore File</h4>
              <Textarea 
                value={`.env
.env.local
node_modules/
dist/
build/
.DS_Store
*.log
.cache/
coverage/
anchor-program/target/
anchor-program/node_modules/
anchor-program/.anchor/
keypair.json
*-keypair.json`}
                readOnly
                className="font-mono text-xs bg-black/30 border-white/10 h-32 resize-none"
              />
              <Button 
                onClick={() => copyToClipboard(`.env
.env.local
node_modules/
dist/
build/
.DS_Store
*.log
.cache/
coverage/
anchor-program/target/
anchor-program/node_modules/
anchor-program/.anchor/
keypair.json
*-keypair.json`, "Gitignore content")}
                variant="outline" 
                size="sm" 
                className="mt-2"
              >
                {copied === "Gitignore content" ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                Copy
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DeploymentGuide;
