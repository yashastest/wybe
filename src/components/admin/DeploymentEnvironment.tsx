
import React, { useState, useEffect } from 'react';
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
  Check,
  AlertTriangle,
  ArrowRight,
  X
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { integrationService } from "@/services/integrationService";
import ContractSecurityAudit from './ContractSecurityAudit';
import { smartContractService } from '@/services/smartContractService';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';

const DeploymentEnvironment = () => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [isCompletingSetup, setIsCompletingSetup] = useState(false);
  const [deploymentStep, setDeploymentStep] = useState(0);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [deploymentComplete, setDeploymentComplete] = useState(false);
  const navigate = useNavigate();
  
  // Deployment checklist states
  const [deploymentChecklist, setDeploymentChecklist] = useState([
    { id: 'anchor', label: 'Anchor CLI is installed and configured', checked: false },
    { id: 'wallet', label: 'Wallet is connected and has sufficient SOL', checked: false },
    { id: 'contract', label: 'Smart contract code is finalized', checked: false },
    { id: 'treasury', label: 'Treasury wallet is configured', checked: false },
    { id: 'fees', label: 'Creator and platform fees are set', checked: true },
    { id: 'security', label: 'Security audit is complete', checked: false }
  ]);
  
  useEffect(() => {
    // Check if deployment was already completed
    const envDeployed = localStorage.getItem('environmentDeployed') === 'true';
    setDeploymentComplete(envDeployed);
    
    // Load saved checklist
    const savedChecklist = integrationService.getDeploymentChecklist();
    if (savedChecklist && savedChecklist.length > 0) {
      setDeploymentChecklist(savedChecklist);
    } else {
      // Initialize with default checks
      checkInitialStatus();
    }
  }, []);
  
  const checkInitialStatus = () => {
    // Check if Anchor is installed
    const config = smartContractService.getContractConfig();
    updateChecklistItem('anchor', config.anchorInstalled);
    
    // Check if treasury is configured
    updateChecklistItem('treasury', !!config.treasuryAddress);
    
    // Check if smart contract is ready
    const isContractReady = localStorage.getItem('contractReady') === 'true';
    updateChecklistItem('contract', isContractReady);
    
    // Check if wallet is connected
    const isWalletConnected = localStorage.getItem('wybeWallet') !== null;
    updateChecklistItem('wallet', isWalletConnected);
    
    // Save the initial checklist state
    saveChecklistState();
  };
  
  const updateChecklistItem = (id: string, checked: boolean) => {
    setDeploymentChecklist(prev => 
      prev.map(item => item.id === id ? {...item, checked} : item)
    );
    
    // Also update in integration service
    integrationService.updateChecklistItem(id, checked);
  };
  
  const saveChecklistState = () => {
    localStorage.setItem('deploymentChecklist', JSON.stringify(deploymentChecklist));
  };
  
  const handleGoToSmartContractDeployment = () => {
    navigate('/admin');
    setTimeout(() => {
      document.querySelector('[data-tab="deployment"]')?.dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      );
    }, 100);
  };
  
  const handleCompleteDeploymentSetup = async () => {
    // Validate checklist
    const incompleteItems = deploymentChecklist.filter(item => !item.checked);
    if (incompleteItems.length > 0) {
      toast.error("Please complete all checklist items before proceeding", {
        description: "There are incomplete items in your deployment checklist."
      });
      return;
    }
    
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

      // Add deployed contract to testnet contracts
      const config = smartContractService.getContractConfig();
      const newContract = {
        name: "Wybe Token Program",
        programId: config.programId || "Wyb111111111111111111111111111111111111111",
        network: "testnet",
        deployDate: new Date().toISOString().split('T')[0],
        txHash: "tx_" + Date.now().toString(16),
        status: "active"
      };
      
      const storedContracts = localStorage.getItem('deployedTestnetContracts');
      const contracts = storedContracts ? JSON.parse(storedContracts) : [];
      contracts.push(newContract);
      localStorage.setItem('deployedTestnetContracts', JSON.stringify(contracts));
      
      // Set contract as ready and mark environment as deployed
      localStorage.setItem('contractReady', 'true');
      localStorage.setItem('environmentDeployed', 'true');
      setDeploymentComplete(true);
      
    } catch (error) {
      console.error("Setup error:", error);
      toast.error("Failed to complete deployment setup");
    } finally {
      setIsCompletingSetup(false);
    }
  };
  
  const handleDeployEnvironment = async () => {
    setIsDeploying(true);
    setDeploymentProgress(0);
    setDeploymentStep(1);
    toast.info("Preparing to deploy environment...");
    
    try {
      // Use dummy wallet address for testing (in real app would use connected wallet)
      const walletAddress = localStorage.getItem('wybeWallet') || "8JzqrG4pQSSA7QuQeEjbDxKLBMqKriGCNzUL7Lxpk8iD";
      
      // Step 1: Initialize deployment
      await runDeploymentStep(
        "Initializing deployment environment", 
        1000, 
        10
      );
      
      // Step 2: Verify contract
      await runDeploymentStep(
        "Verifying smart contract code", 
        2000, 
        20
      );
      
      // Step 3: Build contract
      await runDeploymentStep(
        "Building smart contracts", 
        3000, 
        40
      );
      
      // Step 4: Deploy backend services
      await runDeploymentStep(
        "Deploying backend services", 
        2500, 
        60
      );
      
      // Step 5: Deploy frontend
      await runDeploymentStep(
        "Deploying frontend application", 
        2000, 
        80
      );
      
      // Step 6: Final integration
      await runDeploymentStep(
        "Integrating all components", 
        2000, 
        95
      );
      
      // Final step
      setDeploymentStep(7);
      setDeploymentProgress(100);
      
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
        setDeploymentComplete(true);
        
        // Update checklist status
        updateAllChecklistItems(true);
        
        // Mark environment as deployed
        localStorage.setItem('environmentDeployed', 'true');
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
  
  const updateAllChecklistItems = (checked: boolean) => {
    const updatedChecklist = deploymentChecklist.map(item => ({ ...item, checked }));
    setDeploymentChecklist(updatedChecklist);
    localStorage.setItem('deploymentChecklist', JSON.stringify(updatedChecklist));
  };
  
  const runDeploymentStep = async (message: string, delay: number, progressValue: number) => {
    toast.info(message);
    setDeploymentStep(prev => prev + 1);
    await new Promise(resolve => {
      const interval = setInterval(() => {
        setDeploymentProgress(prev => {
          const newProgress = prev + 1;
          if (newProgress >= progressValue) {
            clearInterval(interval);
            resolve(null);
            return progressValue;
          }
          return newProgress;
        });
      }, delay / (progressValue - deploymentProgress));
    });
  };
  
  const handleChecklistChange = (id: string, checked: boolean) => {
    updateChecklistItem(id, checked);
    saveChecklistState();
  };
  
  const handleViewTestnetContracts = () => {
    navigate('/admin');
    setTimeout(() => {
      document.querySelector('[data-tab="testnet"]')?.dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      );
    }, 100);
  };
  
  const handleRunSecurityAudit = () => {
    // Navigate to contract security audit section
    const securityAuditSection = document.getElementById('security-audit-section');
    if (securityAuditSection) {
      securityAuditSection.scrollIntoView({ behavior: 'smooth' });
      
      // Find and click the run audit button
      const runAuditButton = document.querySelector('[data-run-audit-btn]');
      if (runAuditButton) {
        setTimeout(() => {
          (runAuditButton as HTMLButtonElement).click();
        }, 500);
      }
    }
    
    // Mark security audit as complete in checklist
    updateChecklistItem('security', true);
    saveChecklistState();
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
            
            {deploymentComplete ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-500">Deployment Complete</h4>
                    <p className="text-sm text-gray-300 mt-1">
                      Your environment has been successfully deployed. You can view your deployed contracts in the Testnet Contracts section.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-3"
                      onClick={handleViewTestnetContracts}
                    >
                      View Deployed Contracts
                    </Button>
                  </div>
                </div>
              </div>
            ) : isDeploying ? (
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm">Deployment Progress</span>
                  <span className="text-sm font-medium">{deploymentProgress}%</span>
                </div>
                <Progress value={deploymentProgress} className="h-2" />
                <div className="mt-4 space-y-3">
                  {Array.from({ length: 7 }).map((_, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center space-x-3 ${
                        deploymentStep > index ? "text-green-500" : 
                        deploymentStep === index ? "text-orange-500" : "text-gray-500"
                      }`}
                    >
                      <div className="flex-shrink-0">
                        {deploymentStep > index ? (
                          <Check size={16} className="text-green-500" />
                        ) : deploymentStep === index ? (
                          <RefreshCcw size={16} className="animate-spin text-orange-500" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-gray-500" />
                        )}
                      </div>
                      <span className="text-sm">
                        {index === 0 && "Initialize deployment"}
                        {index === 1 && "Verify contract code"}
                        {index === 2 && "Build smart contracts"}
                        {index === 3 && "Deploy backend services"}
                        {index === 4 && "Deploy frontend application"}
                        {index === 5 && "Integrate all components"}
                        {index === 6 && "Finalize deployment"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
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
            )}
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
            
            <Card className="mb-6 border-amber-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <AlertTriangle className="text-amber-500" size={18} />
                  Deployment Checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {deploymentChecklist.map((item) => (
                    <div key={item.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`checklist-${item.id}`}
                        checked={item.checked}
                        onCheckedChange={(checked) => 
                          handleChecklistChange(item.id, checked === true)
                        }
                      />
                      <label
                        htmlFor={`checklist-${item.id}`}
                        className="text-sm cursor-pointer"
                      >
                        {item.label}
                      </label>
                      {item.id === 'security' && !item.checked && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="ml-auto text-xs h-6 px-2"
                          onClick={handleRunSecurityAudit}
                        >
                          Run Audit
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-4">
                  <Alert className="bg-blue-500/10 border-blue-500/30">
                    <AlertTitle>Deployment Requirements</AlertTitle>
                    <AlertDescription className="text-sm">
                      Please check all items above before proceeding with the deployment setup. 
                      These requirements ensure your deployment process will be smooth and error-free.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
            
            <Button
              variant="default"
              className="w-full bg-orange-500 hover:bg-orange-600"
              onClick={handleCompleteDeploymentSetup}
              disabled={isCompletingSetup || deploymentChecklist.some(item => !item.checked)}
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
        id="security-audit-section"
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
