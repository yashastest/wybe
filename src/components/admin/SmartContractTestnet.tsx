
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
  Terminal,
  Code,
  ExternalLink,
  Eye
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { smartContractService } from "@/services/smartContractService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface DeployedContract {
  name: string;
  programId: string;
  network: string;
  deployDate: string;
  txHash: string;
  status: "active" | "pending" | "failed";
  code?: string;
}

const SmartContractTestnet = () => {
  const [deployedContracts, setDeployedContracts] = useState<DeployedContract[]>([]);
  const [copiedProgramId, setCopiedProgramId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedContract, setSelectedContract] = useState<DeployedContract | null>(null);
  const [showContractDialog, setShowContractDialog] = useState(false);

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
        // Add sample contracts if none exist
        const config = smartContractService.getContractConfig();
        contracts = [
          {
            name: "Wybe Token Program",
            programId: config.programId || "Wyb111111111111111111111111111111111111111",
            network: "testnet",
            deployDate: new Date().toISOString().split('T')[0],
            txHash: "tx_" + Date.now().toString(16),
            status: "active",
            code: `// Sample token program code
module Token {
  public struct TokenData has key, store {
    supply: u64,
    symbol: vector<u8>,
    decimals: u8,
    name: vector<u8>,
    creator: address,
    is_frozen: bool,
  }

  public fun initialize(creator: &signer, supply: u64, symbol: vector<u8>, 
                        name: vector<u8>, decimals: u8) {
    // Token initialization logic
    // Creates new token with initial supply
  }

  public fun mint(token_admin: &signer, amount: u64): TokenData {
    // Minting logic
    // Returns newly minted tokens
  }

  public fun transfer(from: &signer, to: address, amount: u64) {
    // Transfer logic
    // Moves tokens from sender to recipient
  }
}`
          },
          {
            name: "Wybe Reward Distribution",
            programId: "RWD222222222222222222222222222222222222222",
            network: "testnet",
            deployDate: new Date().toISOString().split('T')[0],
            txHash: "tx_" + Date.now().toString(16).substring(2),
            status: "active",
            code: `// Reward distribution program
module RewardDistribution {
  public struct RewardConfig has key {
    claim_period_days: u64,
    fee_percentage: u64,
    last_distribution: u64,
    treasury: address,
  }

  public fun initialize(admin: &signer, claim_period: u64, fee: u64) {
    // Initialize reward distribution parameters
  }

  public fun distribute_rewards(admin: &signer) {
    // Check eligibility and distribute rewards to stakeholders
  }

  public fun update_config(admin: &signer, new_period: u64, new_fee: u64) {
    // Update reward configuration parameters
  }
}`
          },
          {
            name: "Wybe Treasury Manager",
            programId: "TRS333333333333333333333333333333333333333",
            network: "testnet",
            deployDate: new Date().toISOString().split('T')[0],
            txHash: "tx_" + Date.now().toString(16).substring(3),
            status: "active",
            code: `// Treasury management program
module TreasuryManager {
  public struct Treasury has key {
    balance: u64,
    admin: address,
    withdrawal_limit: u64,
    last_withdrawal_time: u64,
  }

  public fun initialize(admin: &signer, withdrawal_limit: u64) {
    // Set up treasury with initial parameters
  }

  public fun deposit(sender: &signer, amount: u64) {
    // Handle deposits to the treasury
  }

  public fun withdraw(admin: &signer, amount: u64) {
    // Process withdrawals with proper authorization
  }

  public fun update_withdrawal_limit(admin: &signer, new_limit: u64) {
    // Modify withdrawal restrictions
  }
}`
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
  
  const viewContractCode = (contract: DeployedContract) => {
    setSelectedContract(contract);
    setShowContractDialog(true);
  };
  
  const copyContractCode = (code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      toast.success("Contract code copied to clipboard!");
    });
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
                        <div className="flex flex-wrap gap-2">
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
                            variant="outline"
                            className="w-full sm:w-auto bg-blue-500/10 hover:bg-blue-500/20 border-blue-500/30"
                            size="sm"
                            onClick={() => viewContractCode(contract)}
                          >
                            <Code size={16} className="mr-2" />
                            View Contract
                          </Button>
                        </div>
                        
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
      
      {/* Contract Code Dialog */}
      <Dialog open={showContractDialog} onOpenChange={setShowContractDialog}>
        <DialogContent className="sm:max-w-4xl bg-wybe-background-light border-wybe-primary/20">
          <DialogHeader>
            <DialogTitle>
              {selectedContract?.name} - Contract Code
            </DialogTitle>
            <DialogDescription>
              View and copy the smart contract code for development purposes
            </DialogDescription>
          </DialogHeader>
          
          <Tabs defaultValue="code" className="w-full">
            <TabsList className="grid grid-cols-2">
              <TabsTrigger value="code">Contract Code</TabsTrigger>
              <TabsTrigger value="details">Contract Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="code" className="mt-4">
              <div className="bg-black/50 rounded-md p-4 relative">
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="absolute right-2 top-2 h-8 w-8 p-0" 
                  onClick={() => selectedContract?.code && copyContractCode(selectedContract.code)}
                >
                  <Copy size={16} />
                </Button>
                <pre className="text-xs overflow-x-auto font-mono text-gray-300 max-h-[400px] overflow-y-auto p-2">
                  {selectedContract?.code || "// No code available for this contract"}
                </pre>
              </div>
              <p className="text-sm text-gray-400 mt-2">Click the copy button in the top right to copy the entire contract code.</p>
            </TabsContent>
            
            <TabsContent value="details">
              {selectedContract && (
                <div className="space-y-4 py-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-sm text-gray-400">Contract Name</h4>
                      <p className="font-medium">{selectedContract.name}</p>
                      <Separator className="my-2 bg-white/10" />
                      
                      <h4 className="text-sm text-gray-400">Program ID</h4>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-xs bg-black/30 p-2 rounded flex-1">{selectedContract.programId}</p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 w-8 p-0" 
                          onClick={() => copyToClipboard(selectedContract.programId, selectedContract.programId)}
                        >
                          {copiedProgramId === selectedContract.programId ? <Check size={14} /> : <Copy size={14} />}
                        </Button>
                      </div>
                      <Separator className="my-2 bg-white/10" />
                      
                      <h4 className="text-sm text-gray-400">Network</h4>
                      <p>{selectedContract.network.charAt(0).toUpperCase() + selectedContract.network.slice(1)}</p>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm text-gray-400">Deployment Date</h4>
                      <p>{selectedContract.deployDate}</p>
                      <Separator className="my-2 bg-white/10" />
                      
                      <h4 className="text-sm text-gray-400">Transaction Hash</h4>
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-xs bg-black/30 p-2 rounded flex-1">{selectedContract.txHash}</p>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="h-8 w-8 p-0" 
                          onClick={() => copyToClipboard(selectedContract.txHash, "txhash")}
                        >
                          <Copy size={14} />
                        </Button>
                      </div>
                      <Separator className="my-2 bg-white/10" />
                      
                      <h4 className="text-sm text-gray-400">Status</h4>
                      <p className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        selectedContract.status === 'active' 
                          ? 'bg-green-500/20 text-green-400' 
                          : selectedContract.status === 'pending' 
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-red-500/20 text-red-400'
                      }`}>
                        {selectedContract.status.charAt(0).toUpperCase() + selectedContract.status.slice(1)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <Button 
                      onClick={() => downloadContractDetails(selectedContract)} 
                      variant="outline" 
                      className="mr-2"
                    >
                      <Download size={16} className="mr-2" />
                      Download Full Details
                    </Button>
                    
                    <Button variant="ghost" className="text-blue-400">
                      <ExternalLink size={16} className="mr-2" />
                      View on Explorer
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default SmartContractTestnet;
