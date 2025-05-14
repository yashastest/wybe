
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { 
  Copy, 
  Check, 
  ArrowRight, 
  Download, 
  Terminal 
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { smartContractService } from "@/services/smartContractService";

interface DeployedContract {
  name: string;
  programId: string;
  network: string;
  deployDate: string;
  txHash: string;
  status: "active" | "pending" | "failed";
}

const SmartContractTestnet = () => {
  const [deployedContracts, setDeployedContracts] = useState<DeployedContract[]>([]);
  const [copiedProgramId, setCopiedProgramId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load deployed contracts
    loadDeployedContracts();
  }, []);

  const loadDeployedContracts = async () => {
    setIsLoading(true);
    try {
      // In a real implementation, this would fetch from a database
      // For now we'll use sample data + any stored in local storage
      const storedContracts = localStorage.getItem('deployedTestnetContracts');
      let contracts: DeployedContract[] = storedContracts ? JSON.parse(storedContracts) : [];
      
      if (contracts.length === 0) {
        // Add a sample contract if none exist
        const config = smartContractService.getContractConfig();
        contracts = [
          {
            name: "Wybe Token Program",
            programId: config.programId || "Wyb111111111111111111111111111111111111111",
            network: "testnet",
            deployDate: new Date().toISOString().split('T')[0],
            txHash: "tx_" + Date.now().toString(16),
            status: "active"
          }
        ];
        localStorage.setItem('deployedTestnetContracts', JSON.stringify(contracts));
      }
      
      setDeployedContracts(contracts);
    } catch (error) {
      console.error("Failed to load deployed contracts:", error);
      toast.error("Failed to load deployed contracts");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, programId: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedProgramId(programId);
      toast.success("Copied to clipboard!");
      
      // Reset copy state after 2 seconds
      setTimeout(() => {
        setCopiedProgramId(null);
      }, 2000);
    });
  };

  const handleMainnetDeployment = (contract: DeployedContract) => {
    // Navigate to deployment page with this contract pre-selected
    localStorage.setItem('selectedContractForMainnet', JSON.stringify(contract));
    toast.info("Selected contract for mainnet deployment");
    
    // Navigate to deployment environment page
    const deployButton = document.querySelector('[data-environment-btn]') as HTMLButtonElement;
    if (deployButton) {
      deployButton.click();
    }
  };

  const downloadContractDetails = (contract: DeployedContract) => {
    const config = smartContractService.getContractConfig();
    const contractDetails = {
      ...contract,
      creatorFeePercentage: config.creatorFeePercentage,
      platformFeePercentage: config.platformFeePercentage,
      rewardClaimPeriodDays: config.rewardClaimPeriodDays,
      dexScreenerThreshold: config.dexScreenerThreshold,
      treasuryAddress: config.treasuryAddress || "Not configured",
      exportDate: new Date().toISOString()
    };
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(contractDetails, null, 2));
    const downloadAnchorElement = document.createElement('a');
    downloadAnchorElement.setAttribute("href", dataStr);
    downloadAnchorElement.setAttribute("download", `${contract.name.replace(/\s+/g, '_')}_details.json`);
    document.body.appendChild(downloadAnchorElement);
    downloadAnchorElement.click();
    downloadAnchorElement.remove();
    
    toast.success("Contract details downloaded");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold font-poppins flex items-center">
            <Terminal className="mr-2 text-orange-500" size={22} />
            Testnet Deployed Contracts
          </h2>
          <p className="text-gray-400 mt-1">
            View and manage your testnet smart contract deployments
          </p>
        </div>
        <Button
          variant="outline"
          className="border-orange-500/30 hover:bg-orange-500/10"
          onClick={loadDeployedContracts}
        >
          Refresh Contracts
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      ) : (
        <>
          {deployedContracts.length === 0 ? (
            <Card className="glass-card border-wybe-primary/20">
              <CardContent className="pt-6">
                <Alert>
                  <AlertTitle>No contracts deployed</AlertTitle>
                  <AlertDescription>
                    You haven't deployed any contracts to the testnet yet. Go to the Smart Contract Deployment page to deploy your first contract.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {deployedContracts.map((contract, index) => (
                <Card key={index} className="glass-card border-wybe-primary/20 overflow-hidden">
                  <CardHeader className="pb-2 border-b border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg font-semibold">{contract.name}</span>
                        <span className="px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded-full">
                          Testnet
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          contract.status === 'active' 
                            ? 'bg-green-500/20 text-green-400' 
                            : contract.status === 'pending' 
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                        }`}>
                          {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-400">{contract.deployDate}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="text-sm text-gray-400">Program ID</div>
                        <div className="flex items-center space-x-2">
                          <Input
                            value={contract.programId}
                            readOnly
                            className="font-mono text-sm bg-black/20"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-shrink-0"
                            onClick={() => copyToClipboard(contract.programId, contract.programId)}
                          >
                            {copiedProgramId === contract.programId ? (
                              <Check size={16} className="text-green-500" />
                            ) : (
                              <Copy size={16} />
                            )}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="text-sm text-gray-400">Transaction Hash</div>
                        <div className="font-mono text-sm truncate bg-black/20 p-2 rounded">{contract.txHash}</div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                        <Button
                          variant="outline"
                          className="w-full sm:w-auto"
                          size="sm"
                          onClick={() => downloadContractDetails(contract)}
                        >
                          <Download size={16} className="mr-2" />
                          Download Details
                        </Button>
                        
                        <Button
                          variant="orange"
                          className="w-full sm:w-auto"
                          size="sm"
                          onClick={() => handleMainnetDeployment(contract)}
                        >
                          <ArrowRight size={16} className="mr-2" />
                          Deploy to Mainnet
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
      
      <Card className="glass-card border-wybe-primary/20">
        <CardHeader>
          <h3 className="text-lg font-semibold">Mainnet Deployment Checklist</h3>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="list-decimal list-inside space-y-3 pl-2">
            <li>Test your contract thoroughly on testnet before deploying to mainnet.</li>
            <li>Verify all treasury wallets are correctly configured with verified addresses.</li>
            <li>Confirm fee percentages and reward periods align with your tokenomics.</li>
            <li>Prepare required SOL for deployment gas fees (minimum 2 SOL recommended).</li>
            <li>Complete a full security audit before proceeding with mainnet deployment.</li>
            <li>Double-check all deployed contract parameters and configurations.</li>
            <li>Have your backup keys and recovery phrases securely stored.</li>
            <li>Ensure you have connected to the mainnet network in wallet settings.</li>
            <li>Once deployed to mainnet, verify the contract on-chain immediately.</li>
            <li>Setup monitoring for your deployed contracts to track activity.</li>
          </ol>
          
          <Alert className="bg-blue-500/10 border-blue-500/30 mt-4">
            <AlertTitle>Testnet to Mainnet Migration</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>When you're ready to deploy to mainnet, use the "Deploy to Mainnet" button above to start the guided process. Make sure your wallet has sufficient SOL to cover deployment fees.</p>
              <p>All configurations will be copied from your testnet deployment, but you'll have a chance to review and modify them before final mainnet deployment.</p>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SmartContractTestnet;
