import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { 
  Rocket, 
  CheckCircle2, 
  AlertTriangle, 
  Terminal, 
  Clock, 
  Server, 
  ShieldCheck, 
  ArrowRight, 
  RefreshCcw, 
  FileCode, 
  DatabaseBackup, 
  HardDrive,
  Bug
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { DeploymentStepper } from "@/components/admin/DeploymentStepper";
import { DeploymentConsole } from "@/components/admin/DeploymentConsole";
import { DeploymentTests } from "@/components/admin/DeploymentTests";
import { DeploymentStatus } from "@/components/admin/DeploymentStatus";
import { integrationService } from "@/services/integrationService";
import { smartContractService } from "@/services/smartContractService";

// Define our local version of DeploymentStep
export interface DeploymentStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  command?: string;
  prerequisite?: string[];
  output?: string;
  verificationSteps?: {
    id: string;
    title: string;
    status: 'pending' | 'success' | 'error';
    message?: string;
  }[];
}

interface MasterDeploymentGuideProps {
  isAdminPanel?: boolean;
}

const MasterDeploymentGuide: React.FC<MasterDeploymentGuideProps> = ({ isAdminPanel }) => {
  const [activePhase, setActivePhase] = useState<string>('prepare');
  const [deploymentProgress, setDeploymentProgress] = useState<number>(0);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [deploymentNetwork, setDeploymentNetwork] = useState<string>('testnet');
  const [isRunningTest, setIsRunningTest] = useState<boolean>(false);
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>([]);
  const [deploymentStarted, setDeploymentStarted] = useState<boolean>(false);
  const [isAutoMode, setIsAutoMode] = useState<boolean>(false);
  
  useEffect(() => {
    // Load deployment steps from service
    const steps = integrationService.getDeploymentSteps(deploymentNetwork);
    setDeploymentSteps(steps);
    
    // Reset progress when network changes
    setDeploymentProgress(0);
    setCurrentStepIndex(0);
    setDeploymentStarted(false);
    setConsoleOutput([]);
  }, [deploymentNetwork]);
  
  useEffect(() => {
    // Update overall progress based on completed steps
    if (deploymentSteps.length > 0) {
      const completedSteps = deploymentSteps.filter(step => step.status === 'completed').length;
      const newProgress = Math.round((completedSteps / deploymentSteps.length) * 100);
      setDeploymentProgress(newProgress);
    }
  }, [deploymentSteps]);
  
  // Auto-proceed with steps when in auto mode
  useEffect(() => {
    if (isAutoMode && deploymentStarted) {
      const currentStep = deploymentSteps[currentStepIndex];
      
      if (currentStep && currentStep.status === 'pending') {
        const runStepTimer = setTimeout(() => {
          handleRunStep(currentStepIndex);
        }, 2000);
        
        return () => clearTimeout(runStepTimer);
      }
    }
  }, [isAutoMode, deploymentStarted, currentStepIndex, deploymentSteps]);
  
  // Auto proceed to next step after completion
  useEffect(() => {
    if (isAutoMode && deploymentStarted) {
      const currentStep = deploymentSteps[currentStepIndex];
      
      if (currentStep && currentStep.status === 'completed' && currentStepIndex < deploymentSteps.length - 1) {
        const nextStepTimer = setTimeout(() => {
          setCurrentStepIndex(prevIndex => prevIndex + 1);
        }, 1500);
        
        return () => clearTimeout(nextStepTimer);
      }
    }
  }, [deploymentSteps, currentStepIndex, isAutoMode, deploymentStarted]);
  
  const addConsoleMessage = (message: string) => {
    setConsoleOutput(prev => [...prev, message]);
  };
  
  const handleDeploymentStart = () => {
    setDeploymentStarted(true);
    const initializedSteps = [...deploymentSteps];
    initializedSteps[0].status = 'pending';
    setDeploymentSteps(initializedSteps);
    
    addConsoleMessage(`[${new Date().toLocaleTimeString()}] Deployment started on ${deploymentNetwork}`);
    addConsoleMessage(`[${new Date().toLocaleTimeString()}] Ready to run first step: ${deploymentSteps[0].title}`);
    
    toast.success(`Deployment process initiated on ${deploymentNetwork}`);
  };
  
  const handleRunStep = async (stepIndex: number) => {
    const updatedSteps = [...deploymentSteps];
    const step = updatedSteps[stepIndex];
    
    // Check prerequisites
    if (step.prerequisite && step.prerequisite.length > 0) {
      const prerequisites = step.prerequisite;
      const unmetPrerequisites = prerequisites.filter(preReqId => {
        const preReqStep = updatedSteps.find(s => s.id === preReqId);
        return !preReqStep || preReqStep.status !== 'completed';
      });
      
      if (unmetPrerequisites.length > 0) {
        toast.error("Cannot proceed: prerequisites not met");
        addConsoleMessage(`[${new Date().toLocaleTimeString()}] Error: Prerequisites not met for step ${step.id}`);
        return;
      }
    }
    
    // Mark step as in progress
    step.status = 'in-progress';
    setDeploymentSteps(updatedSteps);
    
    addConsoleMessage(`[${new Date().toLocaleTimeString()}] Executing: ${step.title}`);
    if (step.command) {
      addConsoleMessage(`[${new Date().toLocaleTimeString()}] $ ${step.command}`);
    }
    
    try {
      // Simulate step execution
      const result = await simulateStepExecution(step);
      
      // Update step with result
      const finalUpdatedSteps = [...updatedSteps] as DeploymentStep[];
      finalUpdatedSteps[stepIndex] = {
        ...finalUpdatedSteps[stepIndex],
        status: result.success ? 'completed' : 'failed',
        output: result.output,
        verificationSteps: result.verificationSteps
      };
      
      setDeploymentSteps(finalUpdatedSteps);
      
      if (result.success) {
        addConsoleMessage(`[${new Date().toLocaleTimeString()}] ✓ Step completed successfully`);
        toast.success(`Step completed: ${step.title}`);
        
        // Auto move to next step if not in last step
        if (!isAutoMode && stepIndex < deploymentSteps.length - 1) {
          setCurrentStepIndex(stepIndex + 1);
        }
      } else {
        addConsoleMessage(`[${new Date().toLocaleTimeString()}] ✗ Step failed: ${result.error}`);
        toast.error(`Step failed: ${result.error}`);
      }
    } catch (error: any) {
      addConsoleMessage(`[${new Date().toLocaleTimeString()}] ✗ Execution error: ${error.message}`);
      
      // Update step as failed
      const errorUpdatedSteps = [...updatedSteps];
      errorUpdatedSteps[stepIndex].status = 'failed';
      setDeploymentSteps(errorUpdatedSteps);
      
      toast.error(`Step failed with error: ${error.message}`);
    }
  };
  
  const simulateStepExecution = (step: DeploymentStep): Promise<{
    success: boolean;
    output: string;
    error?: string;
    verificationSteps?: {
      id: string;
      title: string;
      status: 'pending' | 'success' | 'error';
      message?: string;
    }[];
  }> => {
    return new Promise((resolve) => {
      // In a real implementation, this would call an actual deployment service
      setTimeout(() => {
        // Simulate a real deployment with 90% success rate
        const success = Math.random() > 0.1;
        
        if (success) {
          resolve({
            success: true,
            output: `Successfully executed ${step.title}\nTransaction signature: ${generateMockSignature()}`,
            verificationSteps: [
              { id: 'verify-1', title: 'Bytecode verification', status: 'success' },
              { id: 'verify-2', title: 'Account creation', status: 'success' },
              { id: 'verify-3', title: 'Permission setup', status: 'success' }
            ]
          });
        } else {
          resolve({
            success: false,
            output: `Error executing ${step.title}`,
            error: 'Transaction simulation failed',
            verificationSteps: [
              { id: 'verify-1', title: 'Bytecode verification', status: 'success' },
              { id: 'verify-2', title: 'Account creation', status: 'error', message: 'Insufficient funds' },
              { id: 'verify-3', title: 'Permission setup', status: 'pending' }
            ]
          });
        }
      }, 2000);
    });
  };
  
  const handleRunTests = async () => {
    setIsRunningTest(true);
    addConsoleMessage(`[${new Date().toLocaleTimeString()}] Running deployment tests...`);
    
    try {
      // In a real implementation, this would call actual test services
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      addConsoleMessage(`[${new Date().toLocaleTimeString()}] ✓ All tests passed successfully`);
      toast.success('All deployment tests passed successfully');
    } catch (error: any) {
      addConsoleMessage(`[${new Date().toLocaleTimeString()}] ✗ Test failed: ${error.message}`);
      toast.error(`Test failed: ${error.message}`);
    } finally {
      setIsRunningTest(false);
    }
  };
  
  const generateMockSignature = () => {
    return Array.from({ length: 32 }, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('');
  };
  
  const handleNetworkChange = (network: string) => {
    if (deploymentStarted) {
      const confirmChange = window.confirm(
        "Changing the network will reset the current deployment progress. Are you sure you want to continue?"
      );
      
      if (!confirmChange) return;
    }
    
    setDeploymentNetwork(network);
  };
  
  const handleReset = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset the deployment progress? All steps will be reset."
    );
    
    if (confirmReset) {
      const resetSteps = deploymentSteps.map(step => ({
        ...step,
        status: 'pending',
        output: undefined,
        verificationSteps: step.verificationSteps ? 
          step.verificationSteps.map(v => ({ ...v, status: 'pending', message: undefined })) : 
          undefined
      }));
      
      setDeploymentSteps(resetSteps);
      setCurrentStepIndex(0);
      setDeploymentStarted(false);
      setConsoleOutput([]);
      setDeploymentProgress(0);
      setIsAutoMode(false);
      
      toast.info('Deployment reset successfully');
    }
  };
  
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Rocket className="text-orange-500" />
            Master Deployment Guide
          </h1>
          <p className="text-gray-400 mt-1">
            Complete step-by-step process to deploy Wybe Token Platform smart contracts
          </p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap justify-end">
          <Tabs 
            value={deploymentNetwork} 
            onValueChange={handleNetworkChange}
            className="w-full md:w-auto"
          >
            <TabsList className="bg-black/20 border border-white/10">
              <TabsTrigger value="localnet" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-500">
                Localnet
              </TabsTrigger>
              <TabsTrigger value="devnet" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-500">
                Devnet
              </TabsTrigger>
              <TabsTrigger value="testnet" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-500">
                Testnet
              </TabsTrigger>
              <TabsTrigger value="mainnet" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-500">
                Mainnet
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <Button
            variant="outline"
            className="border-red-500/30 text-red-500 hover:bg-red-500/10"
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </div>
      
      <div className="glass-card border-orange-500/20 p-6">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold">Deployment Progress</h2>
              {deploymentProgress === 100 && (
                <Badge variant="outline" className="bg-green-500/20 text-green-500 border-green-500/30">
                  Complete
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-orange-400">{deploymentProgress}%</span>
              
              {!deploymentStarted && (
                <Button 
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={handleDeploymentStart}
                >
                  Start Deployment
                </Button>
              )}
              
              {deploymentStarted && !isAutoMode && (
                <Button 
                  variant="outline"
                  className="border-orange-500/30 text-orange-500 hover:bg-orange-500/10"
                  onClick={() => setIsAutoMode(true)}
                >
                  Auto Mode
                </Button>
              )}
              
              {deploymentStarted && isAutoMode && (
                <Button 
                  variant="outline"
                  className="border-amber-500/30 text-amber-500 hover:bg-amber-500/10"
                  onClick={() => setIsAutoMode(false)}
                >
                  Manual Mode
                </Button>
              )}
            </div>
          </div>
          <Progress 
            value={deploymentProgress} 
            className="h-2"
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <DeploymentStepper
              steps={deploymentSteps}
              currentStepIndex={currentStepIndex}
              setCurrentStepIndex={setCurrentStepIndex}
              onRunStep={handleRunStep}
              deploymentStarted={deploymentStarted}
            />
          </div>
          
          <div className="lg:col-span-3">
            <Tabs defaultValue="console" className="w-full">
              <TabsList className="bg-black/20 border border-white/10 w-full">
                <TabsTrigger value="console" className="flex-1 data-[state=active]:bg-black/30">
                  <Terminal className="w-4 h-4 mr-2" /> Console
                </TabsTrigger>
                <TabsTrigger value="tests" className="flex-1 data-[state=active]:bg-black/30">
                  <Bug className="w-4 h-4 mr-2" /> Tests
                </TabsTrigger>
                <TabsTrigger value="status" className="flex-1 data-[state=active]:bg-black/30">
                  <HardDrive className="w-4 h-4 mr-2" /> Status
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="console" className="mt-4">
                <DeploymentConsole consoleOutput={consoleOutput} />
              </TabsContent>
              
              <TabsContent value="tests" className="mt-4">
                <DeploymentTests 
                  isRunningTest={isRunningTest}
                  onRunTests={handleRunTests}
                  deploymentNetwork={deploymentNetwork}
                />
              </TabsContent>
              
              <TabsContent value="status" className="mt-4">
                <DeploymentStatus 
                  deploymentNetwork={deploymentNetwork} 
                  deploymentProgress={deploymentProgress}
                  currentStepIndex={currentStepIndex}
                  steps={deploymentSteps}
                />
              </TabsContent>
            </Tabs>
            
            {deploymentSteps[currentStepIndex] && deploymentSteps[currentStepIndex].output && (
              <Card className="mt-4 bg-black/20 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Step Output</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="bg-black/30 p-4 rounded-md text-xs text-green-400 font-mono overflow-auto max-h-32">
                    {deploymentSteps[currentStepIndex].output}
                  </pre>
                </CardContent>
              </Card>
            )}
            
            {deploymentSteps[currentStepIndex]?.verificationSteps && 
              deploymentSteps[currentStepIndex].status === 'completed' && (
              <Card className="mt-4 bg-black/20 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Verification Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {deploymentSteps[currentStepIndex].verificationSteps?.map((verifyStep) => (
                      <li key={verifyStep.id} className="flex items-center gap-2">
                        {verifyStep.status === 'success' && <CheckCircle2 size={16} className="text-green-500" />}
                        {verifyStep.status === 'error' && <AlertTriangle size={16} className="text-red-500" />}
                        {verifyStep.status === 'pending' && <Clock size={16} className="text-yellow-500" />}
                        <span className={`text-sm ${
                          verifyStep.status === 'error' 
                            ? 'text-red-400' 
                            : verifyStep.status === 'success' 
                              ? 'text-green-400' 
                              : 'text-yellow-400'
                        }`}>
                          {verifyStep.title}
                        </span>
                        {verifyStep.message && (
                          <span className="text-xs text-gray-400 ml-1">
                            - {verifyStep.message}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card border-orange-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheck className="text-orange-500" size={20} />
              Security Checklist
            </CardTitle>
            <CardDescription>
              Essential security measures before deployment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {[
                { id: 'audit', label: 'Smart contract audit completed', checked: true },
                { id: 'keys', label: 'Deployment keys secured with hardware wallet', checked: true },
                { id: 'multisig', label: 'Treasury configured with multisig', checked: false },
                { id: 'backup', label: 'Backup procedures documented', checked: true },
                { id: 'tests', label: 'All test cases passing', checked: true },
                { id: 'incident', label: 'Incident response plan documented', checked: true },
              ].map((item) => (
                <div key={item.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-black/20">
                  <div className={`w-5 h-5 rounded flex items-center justify-center ${
                    item.checked ? 'bg-green-500' : 'border border-gray-500'
                  }`}>
                    {item.checked && <CheckCircle2 size={12} className="text-white" />}
                  </div>
                  <span className={item.checked ? 'text-green-400' : ''}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-orange-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="text-orange-500" size={20} />
              Network Parameters
            </CardTitle>
            <CardDescription>
              Configuration for {deploymentNetwork} network
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="p-3 rounded-md bg-black/20 border border-white/10">
                <div className="text-xs text-gray-400">RPC Endpoint</div>
                <div className="font-mono text-sm truncate">
                  {deploymentNetwork === 'mainnet' 
                    ? 'https://api.mainnet-beta.solana.com' 
                    : deploymentNetwork === 'testnet'
                      ? 'https://api.testnet.solana.com'
                      : deploymentNetwork === 'devnet'
                        ? 'https://api.devnet.solana.com'
                        : 'http://localhost:8899'
                  }
                </div>
              </div>
              
              <div className="p-3 rounded-md bg-black/20 border border-white/10">
                <div className="text-xs text-gray-400">Fee Estimator</div>
                <div className="font-mono text-sm">
                  {deploymentNetwork === 'mainnet' 
                    ? '~7.5 SOL' 
                    : deploymentNetwork === 'testnet'
                      ? '~5 SOL'
                      : '~2 SOL'
                  }
                </div>
              </div>
              
              <div className="p-3 rounded-md bg-black/20 border border-white/10">
                <div className="text-xs text-gray-400">Platform Fee</div>
                <div className="font-mono text-sm">2.5%</div>
              </div>
              
              <div className="p-3 rounded-md bg-black/20 border border-white/10">
                <div className="text-xs text-gray-400">Creator Fee</div>
                <div className="font-mono text-sm">2.5%</div>
              </div>
              
              <div className="p-3 rounded-md bg-black/20 border border-white/10 col-span-2">
                <div className="text-xs text-gray-400">Treasury Allocation</div>
                <div className="font-mono text-sm">1% of minted tokens</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-orange-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCode className="text-orange-500" size={20} />
              Contract Information
            </CardTitle>
            <CardDescription>
              Smart contracts for deployment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { id: 'token', name: 'Token Contract', status: 'ready' },
                { id: 'bonding', name: 'Treasury Contract', status: 'ready' },
                { id: 'oracle', name: 'Oracle Contract', status: 'requires-config' },
              ].map((contract) => (
                <div 
                  key={contract.id} 
                  className="p-3 rounded-md bg-black/20 border border-white/10 flex items-center justify-between"
                >
                  <div>
                    <div className="text-sm font-medium">{contract.name}</div>
                    <div className="text-xs text-gray-400">v1.0.5</div>
                  </div>
                  
                  <Badge 
                    variant="outline" 
                    className={
                      contract.status === 'ready' 
                        ? 'bg-green-500/20 text-green-500 border-green-500/30'
                        : 'bg-amber-500/20 text-amber-500 border-amber-500/30'
                    }
                  >
                    {contract.status === 'ready' ? 'Ready' : 'Needs Config'}
                  </Badge>
                </div>
              ))}
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-4 border-orange-500/30 text-orange-500 hover:bg-orange-500/10"
              onClick={() => window.open('/admin', '_blank')}
            >
              View All Contracts
              <ArrowRight size={16} className="ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {deploymentProgress === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-green-500/10 border border-green-500/30 rounded-lg text-center"
        >
          <CheckCircle2 size={48} className="mx-auto text-green-500 mb-2" />
          <h2 className="text-xl font-bold text-green-400 mb-2">Deployment Complete!</h2>
          <p className="text-gray-300 mb-4">
            All smart contracts have been successfully deployed to {deploymentNetwork}.
            Your platform is now ready for integration testing.
          </p>
          <div className="flex justify-center gap-3">
            <Button className="bg-green-600 hover:bg-green-700">
              View Deployment Summary
            </Button>
            <Button variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/10">
              Continue to Verification
            </Button>
          </div>
        </motion.div>
      )}
      
      <Separator className="my-8 bg-white/10" />
      
      <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg mt-4">
        <h4 className="text-blue-400 font-medium mb-2">Need Help?</h4>
        <p className="text-gray-300 text-sm">
          If you're encountering issues with the deployment process, refer to the 
          <a href="/admin/deployment" className="text-blue-400 underline mx-1">Deployment Environment</a> 
          or contact our support team at <span className="text-blue-400">support@wybe.finance</span>
        </p>
      </div>
    </div>
  );
};

export default MasterDeploymentGuide;
