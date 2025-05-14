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
  StopCircle,
  AlertTriangle
} from "lucide-react";
import { smartContractService } from "@/services/smartContractService";
import { integrationService } from "@/services/integrationService";
import AnchorStatusCard from "@/components/admin/AnchorStatusCard";

const SmartContractDeployment = () => {
  const [contractName, setContractName] = useState<string>('');
  const [idlContent, setIdlContent] = useState<string>('');
  const [programAddress, setProgramAddress] = useState<string>('');
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [buildOutput, setBuildOutput] = useState<string>('');
  const [deploymentOutput, setDeploymentOutput] = useState<string>('');
  const [isAnchorInstalled, setIsAnchorInstalled] = useState<boolean>(false);
  const [anchorVersion, setAnchorVersion] = useState<string | undefined>(undefined);
  
  useEffect(() => {
    checkAnchorStatus();
  }, []);
  
  const checkAnchorStatus = () => {
    const config = smartContractService.getContractConfig();
    setIsAnchorInstalled(config.anchorInstalled);
    setAnchorVersion(config.anchorVersion);
  };

  const handleBuildContract = async () => {
    setIsBuilding(true);
    setBuildOutput('');
    
    try {
      const buildResult = await smartContractService.buildContract(contractName);
      setBuildOutput(buildResult);
      toast.success("Contract built successfully");
    } catch (error: any) {
      console.error("Error building contract:", error);
      setBuildOutput(`Error building contract: ${error.message}`);
      toast.error("Failed to build contract");
    } finally {
      setIsBuilding(false);
    }
  };

  const handleDeployContract = async () => {
    setIsDeploying(true);
    setDeploymentOutput('');
    
    try {
      const deployResult = await smartContractService.deployContract(contractName, idlContent, programAddress);
      setDeploymentOutput(deployResult);
      toast.success("Contract deployed successfully");
    } catch (error: any) {
      console.error("Error deploying contract:", error);
      setDeploymentOutput(`Error deploying contract: ${error.message}`);
      toast.error("Failed to deploy contract");
    } finally {
      setIsDeploying(false);
    }
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
                <label className="text-sm font-medium">Program Address</label>
                <Input
                  placeholder="auto-generated"
                  value={programAddress}
                  onChange={(e) => setProgramAddress(e.target.value)}
                  className="bg-black/30"
                />
                <p className="text-xs text-gray-400">Leave blank for auto-generation</p>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">IDL Content</label>
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
                  <label className="text-sm font-medium">Build Output</label>
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
                disabled={!isAnchorInstalled || isDeploying}
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
    </motion.div>
  );
};

export default SmartContractDeployment;
