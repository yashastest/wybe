
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FileCode2, Check, ArrowUpRight, Settings, BarChart4, ChevronRight, ExternalLink, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

import { smartContractService, SmartContractConfig } from "@/services/smartContractService";
import AnchorStatusCard from "./AnchorStatusCard";

interface TokenDeploymentStatus {
  name: string;
  symbol: string;
  deployDate: string;
  status: "active" | "pending" | "failed";
  txHash: string;
  programId?: string;
}

const SmartContractDashboard = () => {
  const navigate = useNavigate();
  const [contractConfig, setContractConfig] = useState<SmartContractConfig>({
    creatorFeePercentage: 2.5,
    platformFeePercentage: 2.5,
    rewardClaimPeriodDays: 5,
    dexScreenerThreshold: 50000,
    networkType: 'devnet',
    anchorInstalled: false
  });
  
  const [deploymentHistory, setDeploymentHistory] = useState<TokenDeploymentStatus[]>([
    {
      name: "Sample Token",
      symbol: "SMPL",
      deployDate: "2024-05-12",
      status: "active",
      txHash: "Tx8f3d7a9c",
      programId: "Prog123456789"
    }
  ]);
  
  const [copiedText, setCopiedText] = useState("");

  useEffect(() => {
    // Get the current configuration from the service
    setContractConfig(smartContractService.getContractConfig());
  }, []);

  const handleConfigureClick = () => {
    navigate("/admin/smart-contract-deployment");
  };
  
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(text);
      toast.success(`${type} copied to clipboard!`);
      
      // Reset copy state after 2 seconds
      setTimeout(() => {
        setCopiedText("");
      }, 2000);
    });
  };
  
  const handleViewContracts = () => {
    navigate("/admin/smart-contract-testnet");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-poppins flex items-center">
            <FileCode2 className="mr-2 text-orange-500" size={22} />
            Smart Contract Dashboard
          </h2>
          <p className="text-gray-400 mt-1">Manage and monitor smart contract deployments</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={handleViewContracts} 
            variant="outline" 
            className="flex items-center gap-2 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
          >
            <Code size={14} />
            View Contracts
          </Button>
          <Button 
            onClick={handleConfigureClick} 
            variant="orange" 
            className="flex items-center gap-2"
          >
            <Settings size={14} />
            Configure Deployment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card border-wybe-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white font-poppins text-lg">Creator Fee</CardTitle>
            <CardDescription>Current fee percentage for creators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{contractConfig.creatorFeePercentage}%</span>
              <span className="text-gray-400 text-sm">of trading volume</span>
            </div>
            <Progress 
              className="mt-2" 
              value={contractConfig.creatorFeePercentage * 10} 
              indicatorClassName="bg-wybe-primary" 
            />
          </CardContent>
        </Card>
        
        <Card className="glass-card border-wybe-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white font-poppins text-lg">Platform Fee</CardTitle>
            <CardDescription>Current fee for the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{contractConfig.platformFeePercentage}%</span>
              <span className="text-gray-400 text-sm">of trading volume</span>
            </div>
            <Progress 
              className="mt-2" 
              value={contractConfig.platformFeePercentage * 10} 
              indicatorClassName="bg-wybe-accent" 
            />
          </CardContent>
        </Card>
        
        <Card className="glass-card border-wybe-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-white font-poppins text-lg">Reward Period</CardTitle>
            <CardDescription>Days between reward claims</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-white">{contractConfig.rewardClaimPeriodDays}</span>
              <span className="text-gray-400 text-sm">days</span>
            </div>
            <Progress 
              className="mt-2" 
              value={contractConfig.rewardClaimPeriodDays * 10} 
              indicatorClassName="bg-green-500" 
            />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnchorStatusCard />
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-5 border-wybe-primary/20"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold font-poppins flex items-center">
              <BarChart4 className="mr-2 text-orange-500" size={20} />
              Network Status
            </h3>
            <Badge 
              variant={contractConfig.networkType === 'mainnet' ? 'default' : 'outline'}
              className={
                contractConfig.networkType === 'mainnet' 
                  ? 'bg-green-500/80' 
                  : contractConfig.networkType === 'testnet'
                    ? 'border-amber-500 text-amber-500'
                    : 'border-blue-500 text-blue-500'
              }
            >
              {contractConfig.networkType.toUpperCase()}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400">Active Network</span>
              <span className="font-semibold">{contractConfig.networkType.charAt(0).toUpperCase() + contractConfig.networkType.slice(1)}</span>
            </div>
            <Separator className="bg-white/10" />
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400">DEXScreener Threshold</span>
              <span className="font-semibold">${contractConfig.dexScreenerThreshold.toLocaleString()}</span>
            </div>
            <Separator className="bg-white/10" />
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400">Program ID</span>
              <div className="flex items-center">
                <span className="font-mono text-sm truncate max-w-[150px]">{contractConfig.programId || "Not deployed"}</span>
                {contractConfig.programId && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-1 h-6 w-6 p-0"
                    onClick={() => copyToClipboard(contractConfig.programId || "", "Program ID")}
                  >
                    {copiedText === contractConfig.programId ? <Check size={12} /> : <Copy size={12} />}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      <div className="glass-card p-5 border-wybe-primary/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold font-poppins flex items-center">
            Recent Deployments
          </h3>
          <Button 
            variant="outline" 
            size="sm"
            className="text-xs border-wybe-primary/30 text-wybe-primary hover:bg-wybe-primary/10"
            onClick={handleViewContracts}
          >
            View All Contracts
            <ChevronRight size={14} className="ml-1" />
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-400 border-b border-white/10">
                <th className="pb-2 font-medium">Token</th>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Transaction</th>
                <th className="pb-2 font-medium">Program ID</th>
                <th className="pb-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {deploymentHistory.map((deployment, index) => (
                <tr key={index} className="border-b border-white/5">
                  <td className="py-3">
                    <div>
                      <div className="font-medium">{deployment.name}</div>
                      <div className="text-sm text-gray-400">{deployment.symbol}</div>
                    </div>
                  </td>
                  <td className="py-3 text-sm">{deployment.deployDate}</td>
                  <td className="py-3">
                    <Badge 
                      variant={deployment.status === 'active' ? 'default' : deployment.status === 'pending' ? 'outline' : 'destructive'}
                      className={
                        deployment.status === 'active' 
                          ? 'bg-green-500/80' 
                          : deployment.status === 'pending' 
                            ? 'border-amber-500 text-amber-500' 
                            : 'bg-red-500/80'
                      }
                    >
                      {deployment.status === 'active' && <Check size={12} className="mr-1" />}
                      {deployment.status.charAt(0).toUpperCase() + deployment.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center">
                      <span className="font-mono text-xs">{deployment.txHash}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-1 h-6 w-6 p-0"
                        onClick={() => copyToClipboard(deployment.txHash, "Transaction Hash")}
                      >
                        {copiedText === deployment.txHash ? <Check size={12} /> : <Copy size={12} />}
                      </Button>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center">
                      <span className="font-mono text-xs">{deployment.programId || "N/A"}</span>
                      {deployment.programId && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-1 h-6 w-6 p-0"
                          onClick={() => copyToClipboard(deployment.programId || "", "Program ID")}
                        >
                          {copiedText === deployment.programId ? <Check size={12} /> : <Copy size={12} />}
                        </Button>
                      )}
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-400">
                      <ExternalLink size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default SmartContractDashboard;
