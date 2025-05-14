
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  PackagePlus, 
  Terminal, 
  FileCode2, 
  ArrowRight, 
  RefreshCcw,
  Play,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check
} from "lucide-react";
import { smartContractService } from "@/services/smartContractService";
import { integrationService } from "@/services/integrationService";
import AnchorStatusCard from "@/components/admin/AnchorStatusCard";
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';

// Sample IDL for easier testing
const SAMPLE_IDL = `{
  "version": "0.1.0",
  "name": "wybe_token_program",
  "instructions": [
    {
      "name": "initialize",
      "accounts": [
        { "name": "tokenAccount", "isMut": true, "isSigner": false },
        { "name": "authority", "isMut": true, "isSigner": true },
        { "name": "systemProgram", "isMut": false, "isSigner": false }
      ],
      "args": [
        { "name": "name", "type": "string" },
        { "name": "symbol", "type": "string" },
        { "name": "creatorFee", "type": "u64" },
        { "name": "platformFee", "type": "u64" }
      ]
    },
    {
      "name": "updateFees",
      "accounts": [
        { "name": "tokenAccount", "isMut": true, "isSigner": false },
        { "name": "authority", "isMut": false, "isSigner": true }
      ],
      "args": [
        { "name": "creatorFee", "type": "u64" },
        { "name": "platformFee", "type": "u64" }
      ]
    }
  ],
  "accounts": [
    {
      "name": "TokenAccount",
      "type": {
        "kind": "struct",
        "fields": [
          { "name": "name", "type": "string" },
          { "name": "symbol", "type": "string" },
          { "name": "creatorFee", "type": "u64" },
          { "name": "platformFee", "type": "u64" },
          { "name": "authority", "type": "publicKey" }
        ]
      }
    }
  ],
  "errors": [
    { "code": 6000, "name": "Unauthorized", "msg": "You are not authorized" },
    { "code": 6001, "name": "InvalidFees", "msg": "Invalid fee configuration" }
  ]
}`;

const SmartContractDeployment = () => {
  const [contractName, setContractName] = useState<string>('WybeToken');
  const [idlContent, setIdlContent] = useState<string>('');
  const [programAddress, setProgramAddress] = useState<string>('');
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [buildOutput, setBuildOutput] = useState<string>('');
  const [deploymentOutput, setDeploymentOutput] = useState<string>('');
  const [isAnchorInstalled, setIsAnchorInstalled] = useState<boolean>(false);
  const [anchorVersion, setAnchorVersion] = useState<string | undefined>(undefined);
  const [lastBuiltContract, setLastBuiltContract] = useState<string | null>(null);
  const [copiedProgram, setCopiedProgram] = useState<boolean>(false);
  const [deploymentSuccess, setDeploymentSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAnchorStatus();
    
    // Load saved contract data
    const savedContract = localStorage.getItem('lastBuiltContract');
    const savedIdl = localStorage.getItem('savedIdl');
    
    if (savedContract) {
      setLastBuiltContract(savedContract);
    }
    
    if (savedIdl) {
      setIdlContent(savedIdl);
    } else {
      // For ease of testing, use sample IDL if none saved
      setIdlContent(SAMPLE_IDL);
    }
  }, []);
  
  const checkAnchorStatus = () => {
    const config = smartContractService.getContractConfig();
    setIsAnchorInstalled(config.anchorInstalled);
    setAnchorVersion(config.anchorVersion);
  };

  const handleBuildContract = async () => {
    if (!contractName) {
      toast.error("Please enter a contract name");
      return;
    }
    
    setIsBuilding(true);
    setBuildOutput('');
    
    try {
      const buildResult = await smartContractService.buildContract(contractName);
      setBuildOutput(buildResult);
      setLastBuiltContract(contractName);
      localStorage.setItem('lastBuiltContract', contractName);
      
      // If IDL is provided, save it
      if (idlContent) {
        try {
          // Validate JSON format
          JSON.parse(idlContent);
          localStorage.setItem('savedIdl', idlContent);
        } catch (e) {
          toast.warning("The provided IDL is not valid JSON. It will not be saved.");
        }
      }
      
      toast.success("Contract built successfully", {
        description: "Your smart contract has been built and is ready for deployment."
      });
      
      // Mark contract as ready
      localStorage.setItem('contractReady', 'true');
      
      // Update checklist
      const deploymentChecklist = JSON.parse(localStorage.getItem('deploymentChecklist') || '[]');
      const updatedChecklist = deploymentChecklist.map((item: any) => 
        item.id === 'contract' ? {...item, checked: true} : item
      );
      localStorage.setItem('deploymentChecklist', JSON.stringify(updatedChecklist));
      
    } catch (error: any) {
      console.error("Error building contract:", error);
      setBuildOutput(`Error building contract: ${error.message}`);
      toast.error("Failed to build contract", {
        description: error.message
      });
    } finally {
      setIsBuilding(false);
    }
  };

  const handleDeployContract = async () => {
    if (!contractName) {
      toast.error("Please enter a contract name");
      return;
    }
    
    setIsDeploying(true);
    setDeploymentOutput('');
    setDeploymentSuccess(false);
    
    try {
      let idlToUse = idlContent;
      
      // If IDL is empty, use a basic template
      if (!idlToUse.trim()) {
        idlToUse = SAMPLE_IDL;
      }
      
      const deployResult = await smartContractService.deployContract(
        contractName, 
        idlToUse, 
        programAddress
      );
      
      // Set deployment output string based on deployment result
      setDeploymentOutput(deployResult.message || JSON.stringify(deployResult));
      toast.success("Contract deployed successfully", {
        description: "Your smart contract has been deployed and is ready for use."
      });
      setDeploymentSuccess(true);
      
      // Store as ready contract
      localStorage.setItem('contractReady', 'true');
      
      // Generate a mock program ID if none was returned
      const generatedProgramId = "Wyb" + Math.random().toString(36).substring(2, 15) + 
                                Math.random().toString(36).substring(2, 15);
      
      // Use the returned program ID or generated one
      const finalProgramId = programAddress || generatedProgramId;
      setProgramAddress(finalProgramId);
      
      // Add deployed contract to testnet contracts
      const newContract = {
        name: contractName,
        programId: finalProgramId,
        network: "testnet",
        deployDate: new Date().toISOString().split('T')[0],
        txHash: deployResult.transactionId || "tx_" + Date.now().toString(16),
        status: "active"
      };
      
      const storedContracts = localStorage.getItem('deployedTestnetContracts');
      const contracts = storedContracts ? JSON.parse(storedContracts) : [];
      contracts.push(newContract);
      localStorage.setItem('deployedTestnetContracts', JSON.stringify(contracts));
      
    } catch (error: any) {
      console.error("Error deploying contract:", error);
      setDeploymentOutput(`Error deploying contract: ${error.message}`);
      toast.error("Failed to deploy contract", {
        description: error.message
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const copyProgramId = () => {
    if (programAddress) {
      navigator.clipboard.writeText(programAddress);
      setCopiedProgram(true);
      toast.success("Program ID copied to clipboard");
      
      setTimeout(() => {
        setCopiedProgram(false);
      }, 2000);
    }
  };

  const loadSampleIdl = () => {
    setIdlContent(SAMPLE_IDL);
    toast.success("Sample IDL loaded");
  };
  
  const handleGoToDeploymentEnvironment = () => {
    navigate('/admin/deployment');
  };
  
  const handleViewTestnetContracts = () => {
    navigate('/admin');
    setTimeout(() => {
      document.querySelector('[data-tab="testnet"]')?.dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      );
    }, 100);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2 space-y-6">
          <AnchorStatusCard />
          
          <Card className="glass-card border-wybe-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <h3 className="text-lg font-semibold font-poppins flex items-center">
                <PackagePlus className="mr-2 text-orange-500" size={20} />
                Contract Details
              </h3>
              {lastBuiltContract && (
                <Badge variant="outline" className="border-green-500 text-green-400">
                  Last Built: {lastBuiltContract}
                </Badge>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Contract Name</label>
                <Input
                  placeholder="MyTokenContract"
                  value={contractName}
                  onChange={(e) => setContractName(e.target.value)}
                  className="bg-black/30"
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Program Address</label>
                  {programAddress && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-5 px-2 text-xs"
                      onClick={copyProgramId}
                    >
                      {copiedProgram ? (
                        <Check size={12} className="text-green-500 mr-1" />
                      ) : (
                        <Copy size={12} className="mr-1" />
                      )}
                      {copiedProgram ? "Copied" : "Copy"}
                    </Button>
                  )}
                </div>
                <Input
                  placeholder="auto-generated"
                  value={programAddress}
                  onChange={(e) => setProgramAddress(e.target.value)}
                  className="bg-black/30 font-mono text-sm"
                />
                <p className="text-xs text-gray-400">Leave blank for auto-generation</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">IDL Content</label>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-5 px-2 text-xs"
                    onClick={loadSampleIdl}
                  >
                    Load Sample
                  </Button>
                </div>
                <Textarea
                  placeholder="Paste your IDL JSON here"
                  value={idlContent}
                  onChange={(e) => setIdlContent(e.target.value)}
                  className="bg-black/30 min-h-[150px] font-mono text-xs"
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="w-full md:w-1/2 space-y-6">
          <Card className="glass-card border-wybe-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <h3 className="text-lg font-semibold font-poppins flex items-center">
                <Terminal className="mr-2 text-orange-500" size={20} />
                Build Contract
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="bg-orange-500 hover:bg-orange-600 w-full justify-start gap-2"
                onClick={handleBuildContract}
                disabled={isBuilding}
              >
                {isBuilding ? (
                  <>
                    <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
                    Building...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Build Contract
                  </>
                )}
              </Button>
              
              {buildOutput && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">Build Output</label>
                    {buildOutput.includes('Successfully built') && (
                      <Badge variant="outline" className="border-green-500 text-green-500">Success</Badge>
                    )}
                  </div>
                  <Textarea
                    value={buildOutput}
                    readOnly
                    className="bg-black/30 min-h-[150px] font-mono text-xs"
                  />
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="glass-card border-wybe-primary/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <h3 className="text-lg font-semibold font-poppins flex items-center">
                <FileCode2 className="mr-2 text-orange-500" size={20} />
                Deploy Contract
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="bg-green-500 hover:bg-green-600 w-full justify-start gap-2"
                onClick={handleDeployContract}
                disabled={!buildOutput || isDeploying}
              >
                {isDeploying ? (
                  <>
                    <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-4 h-4 mr-2" />
                    Deploy Contract
                  </>
                )}
              </Button>
              
              {!isAnchorInstalled && (
                <div className="mt-4">
                  <div className="rounded-md bg-amber-500/10 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-amber-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-amber-800">
                          Anchor CLI Required
                        </h3>
                        <div className="mt-2 text-sm text-amber-700">
                          <p>
                            Please install Anchor CLI to deploy contracts. See the Anchor Status card for installation instructions.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {deploymentOutput && (
                <div className="space-y-2">
                  <label className="text-sm font-medium">Deployment Output</label>
                  <Textarea
                    value={deploymentOutput}
                    readOnly
                    className="bg-black/30 min-h-[150px] font-mono text-xs"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {deploymentSuccess && (
        <Card className="glass-card border-green-500/20 mt-6">
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center">
              <CheckCircle2 className="mr-2 text-green-500" size={20} />
              Next Steps
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertDescription>
                Your smart contract has been successfully deployed to the testnet. You can now view it in the Testnet Contracts page and prepare for mainnet deployment.
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                variant="orange" 
                className="flex-1" 
                onClick={handleGoToDeploymentEnvironment}
              >
                Go to Deployment Environment
              </Button>
              <Button 
                variant="outline" 
                className="flex-1" 
                onClick={handleViewTestnetContracts}
              >
                View Testnet Contracts
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default SmartContractDeployment;
