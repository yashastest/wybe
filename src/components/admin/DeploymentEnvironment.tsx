
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
  CloudCog, 
  Globe, 
  Server, 
  LinkIcon, 
  Save, 
  RefreshCcw, 
  ListChecks,
  CheckCircle2,
  ExternalLink,
  Settings2,
  AlertTriangle,
  LucideMonitorDown
} from "lucide-react";
import { tradingService, DeploymentEnvironment as TradingDeploymentEnvironment } from "@/services/tradingService";
import { integrationService, DeploymentResult } from "@/services/integrationService";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DeploymentConfigChecker from './DeploymentConfigChecker';
import DeploymentProgressTracker from '@/components/DeploymentProgressTracker';

interface DeploymentChecklistItem {
  id: string;
  title: string;
  description: string;
  checked: boolean;
}

const INITIAL_CHECKLIST: DeploymentChecklistItem[] = [
  { id: 'contract', title: 'Smart Contract Built & Deployed', description: 'Anchor contract compiled and deployed to testnet.', checked: false },
  { id: 'idl', title: 'IDL Generated & Verified', description: 'Interface Definition Language file is correct and matches contract.', checked: false },
  { id: 'env_vars', title: 'Environment Variables Set', description: 'Supabase & Solana RPC URLs, Program ID configured.', checked: false },
  { id: 'treasury', title: 'Treasury Wallet Configured', description: 'Platform treasury wallet address is set.', checked: false },
  { id: 'domain', title: 'Frontend Domain Pointing', description: '(Optional) Custom domain for frontend app is ready.', checked: false },
  { id: 'final_tests', title: 'Final Testnet Run Through', description: 'Full user flow tested on testnet environment.', checked: false },
];

// Deployment steps
const DEPLOYMENT_STEPS = [
  {
    id: 'build_contract',
    title: 'Build Smart Contract',
    description: 'Compile and optimize smart contract code',
    status: 'completed' as const
  },
  {
    id: 'test_contract',
    title: 'Run Contract Tests',
    description: 'Execute test suite for smart contract',
    status: 'completed' as const,
    dependsOn: ['build_contract']
  },
  {
    id: 'deploy_contract',
    title: 'Deploy to Selected Network',
    description: 'Deploy contract to the selected Solana network',
    status: 'in-progress' as const,
    dependsOn: ['test_contract']
  },
  {
    id: 'verify_deployment',
    title: 'Verify Deployment',
    description: 'Verify contract is correctly deployed',
    status: 'pending' as const,
    dependsOn: ['deploy_contract']
  },
  {
    id: 'generate_client',
    title: 'Generate Client SDK',
    description: 'Generate TypeScript client SDK from IDL',
    status: 'pending' as const,
    dependsOn: ['verify_deployment']
  },
  {
    id: 'deploy_frontend',
    title: 'Deploy Frontend',
    description: 'Deploy frontend application with contract integration',
    status: 'pending' as const,
    dependsOn: ['generate_client']
  }
];

const DeploymentEnvironment = () => {
  const [environment, setEnvironment] = useState<TradingDeploymentEnvironment | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null);
  const [checklist, setChecklist] = useState<DeploymentChecklistItem[]>(INITIAL_CHECKLIST);
  const [deploymentProgress, setDeploymentProgress] = useState<number>(65);
  const [currentDeployStep, setCurrentDeployStep] = useState<string>('deploy_contract');
  const [healthStatus, setHealthStatus] = useState<{
    api: 'healthy' | 'degraded' | 'down';
    rpc: 'healthy' | 'degraded' | 'down';
    database: 'healthy' | 'degraded' | 'down';
  }>({
    api: 'healthy',
    rpc: 'healthy',
    database: 'healthy',
  });

  useEffect(() => {
    setEnvironment(tradingService.getDeploymentEnvironment());
    const savedResult = integrationService.getDeploymentResult();
    if (savedResult) {
      setDeploymentResult(savedResult);
    }
    
    // Load checklist from localStorage
    const savedChecklist = localStorage.getItem('deploymentChecklist');
    if (savedChecklist) {
      try {
        const parsedChecklist: DeploymentChecklistItem[] = JSON.parse(savedChecklist);
        // Ensure all initial items are present, and update checked status
        const updatedChecklist = INITIAL_CHECKLIST.map(initialItem => {
          const savedItem = parsedChecklist.find(item => item.id === initialItem.id);
          return savedItem ? { ...initialItem, checked: savedItem.checked } : initialItem;
        });
        setChecklist(updatedChecklist);
      } catch (e) {
        console.error("Error parsing checklist from localStorage", e);
        localStorage.setItem('deploymentChecklist', JSON.stringify(INITIAL_CHECKLIST)); // Reset if malformed
      }
    } else {
       localStorage.setItem('deploymentChecklist', JSON.stringify(INITIAL_CHECKLIST));
    }
    
    // Simulate periodic health checks
    const healthCheckInterval = setInterval(() => {
      setHealthStatus({
        api: Math.random() > 0.1 ? 'healthy' : Math.random() > 0.5 ? 'degraded' : 'down',
        rpc: Math.random() > 0.1 ? 'healthy' : Math.random() > 0.5 ? 'degraded' : 'down',
        database: Math.random() > 0.05 ? 'healthy' : Math.random() > 0.5 ? 'degraded' : 'down',
      });
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(healthCheckInterval);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!environment) return;
    const { name, value } = e.target;
    setEnvironment({
      ...environment,
      [name]: value,
    });
  };

  const handleSelectChange = (value: 'mainnet' | 'testnet' | 'devnet') => {
    if (!environment) return;
    setEnvironment({
      ...environment,
      networkType: value,
    });
  };

  const handleSaveChanges = () => {
    if (!environment) return;
    setIsLoading(true);
    tradingService.updateDeploymentEnvironment(environment);
    // Simulate saving to a backend
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Deployment environment saved successfully!");
    }, 1000);
  };
  
  const handleChecklistItemToggle = (id: string) => {
    const updatedChecklist = checklist.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setChecklist(updatedChecklist);
    localStorage.setItem('deploymentChecklist', JSON.stringify(updatedChecklist));
  };
  
  const handleFixIssue = (checkId: string) => {
    toast.info(`Attempting to fix issue: ${checkId}`);
    
    // Simulate fixing the issue
    setTimeout(() => {
      toast.success(`Issue resolved: ${checkId}`);
    }, 2000);
  };

  const allChecked = checklist.every(item => item.checked);
  
  const getHealthIcon = (status: 'healthy' | 'degraded' | 'down') => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'down':
        return <LucideMonitorDown className="h-4 w-4 text-red-500" />;
    }
  };
  
  // If environment isn't loaded yet, show a loading state
  if (!environment) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCcw className="animate-spin text-orange-500" size={32} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Settings2 className="mr-2 text-orange-500" />
              Environment Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="frontendUrl" className="block text-sm font-medium mb-1">Frontend URL</label>
              <Input
                id="frontendUrl"
                name="frontendUrl"
                value={environment.frontendUrl}
                onChange={handleInputChange}
                className="bg-black/30"
                placeholder="https://app.yourdomain.com"
              />
            </div>
            <div>
              <label htmlFor="backendUrl" className="block text-sm font-medium mb-1">Backend URL (API)</label>
              <Input
                id="backendUrl"
                name="backendUrl"
                value={environment.backendUrl}
                onChange={handleInputChange}
                className="bg-black/30"
                placeholder="https://api.yourdomain.com"
              />
            </div>
            <div>
              <label htmlFor="explorerUrl" className="block text-sm font-medium mb-1">Explorer URL Base</label>
              <Input
                id="explorerUrl"
                name="explorerUrl"
                value={environment.explorerUrl}
                onChange={handleInputChange}
                className="bg-black/30"
                placeholder="https://explorer.solana.com"
              />
            </div>
            <div>
              <label htmlFor="networkType" className="block text-sm font-medium mb-1">Network Type</label>
              <Select 
                value={environment.networkType} 
                onValueChange={handleSelectChange}
              >
                <SelectTrigger className="bg-black/30">
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent className="bg-wybe-background-light">
                  <SelectItem value="mainnet">Mainnet</SelectItem>
                  <SelectItem value="testnet">Testnet</SelectItem>
                  <SelectItem value="devnet">Devnet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Health status indicators */}
            <div className="p-3 bg-black/30 rounded-lg border border-white/5 space-y-2">
              <h3 className="text-sm font-medium mb-2">System Health</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">API Status</span>
                  <div className="flex items-center">
                    {getHealthIcon(healthStatus.api)}
                    <span className={`ml-1.5 capitalize ${
                      healthStatus.api === 'healthy' ? 'text-green-400' : 
                      healthStatus.api === 'degraded' ? 'text-yellow-400' : 
                      'text-red-400'
                    }`}>
                      {healthStatus.api}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">RPC Connection</span>
                  <div className="flex items-center">
                    {getHealthIcon(healthStatus.rpc)}
                    <span className={`ml-1.5 capitalize ${
                      healthStatus.rpc === 'healthy' ? 'text-green-400' : 
                      healthStatus.rpc === 'degraded' ? 'text-yellow-400' : 
                      'text-red-400'
                    }`}>
                      {healthStatus.rpc}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Database</span>
                  <div className="flex items-center">
                    {getHealthIcon(healthStatus.database)}
                    <span className={`ml-1.5 capitalize ${
                      healthStatus.database === 'healthy' ? 'text-green-400' : 
                      healthStatus.database === 'degraded' ? 'text-yellow-400' : 
                      'text-red-400'
                    }`}>
                      {healthStatus.database}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <Button onClick={handleSaveChanges} disabled={isLoading} className="w-full bg-orange-600 hover:bg-orange-700">
              {isLoading ? <RefreshCcw className="animate-spin mr-2" /> : <Save className="mr-2" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <ListChecks className="mr-2 text-blue-500" />
              Pre-Deployment Checklist
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {checklist.map(item => (
              <div key={item.id} className="flex items-start space-x-3 p-3 bg-black/20 rounded-md">
                <input
                  type="checkbox"
                  id={item.id}
                  checked={item.checked}
                  onChange={() => handleChecklistItemToggle(item.id)}
                  className="mt-1 h-4 w-4 rounded border-gray-600 text-orange-500 focus:ring-orange-500 cursor-pointer"
                />
                <div className="flex-1">
                  <label htmlFor={item.id} className="block text-sm font-medium cursor-pointer">{item.title}</label>
                  <p className="text-xs text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
            {allChecked && (
              <Alert variant="success" className="mt-4">
                <CheckCircle2 className="h-4 w-4" />
                <AlertDescription>
                  All checks passed! You are ready for mainnet deployment.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="glass-card md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <Server className="mr-2 text-purple-500" />
              Deployment Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DeploymentProgressTracker 
              steps={DEPLOYMENT_STEPS} 
              currentStepId={currentDeployStep}
              overallProgress={deploymentProgress} 
            />
          </CardContent>
        </Card>
        
        <Card className="glass-card md:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <CloudCog className="mr-2 text-cyan-500" />
              Configuration Check
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DeploymentConfigChecker 
              environment={environment.networkType} 
              onFixIssue={handleFixIssue}
            />
          </CardContent>
        </Card>
      </div>

      {deploymentResult && deploymentResult.success && (
        <Card className="glass-card border-green-500/30">
          <CardHeader>
            <CardTitle className="flex items-center text-xl text-green-400">
              <CheckCircle2 className="mr-2" />
              Last Deployment Successful
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">{deploymentResult.message}</p>
            {deploymentResult.transactionId && (
              <p className="text-sm">
                Transaction ID: 
                <a 
                  href={`${environment.explorerUrl}/tx/${deploymentResult.transactionId}?cluster=${environment.networkType}`}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="ml-1 text-orange-400 hover:text-orange-300 underline"
                >
                  {deploymentResult.transactionId.substring(0,15)}... <ExternalLink size={12} className="inline-block" />
                </a>
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default DeploymentEnvironment;
