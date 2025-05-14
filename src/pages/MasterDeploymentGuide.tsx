
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Play, 
  Server, 
  Globe, 
  Database, 
  Code, 
  ExternalLink, 
  ChevronRight, 
  Box, 
  RefreshCw,
  Landmark,
  AlertTriangle,
  CheckCheck,
  UploadCloud,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import useAdmin from '@/hooks/useAdmin';

// Define types for the deployment steps
interface DeploymentStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'error';
  substeps: {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed' | 'error';
  }[];
}

interface DeploymentConfig {
  networkType: 'mainnet' | 'testnet' | 'devnet';
  frontendDeployment: 'vercel' | 'netlify' | 'github-pages';
  databaseSync: boolean;
  analyticsEnabled: boolean;
  programIdMapping: Record<string, string>; // testnet to mainnet mapping
}

const MasterDeploymentGuide = () => {
  const { isAuthenticated } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [deploymentSteps, setDeploymentSteps] = useState<DeploymentStep[]>([
    {
      id: 'contracts',
      title: 'Smart Contract Deployment',
      description: 'Deploy smart contracts from testnet to mainnet',
      status: 'pending',
      substeps: [
        { id: 'contracts-verify', title: 'Verify testnet contracts', description: 'Check testnet contract functionality and structure', status: 'pending' },
        { id: 'contracts-migrate', title: 'Migrate to mainnet', description: 'Deploy equivalent contracts to mainnet', status: 'pending' },
        { id: 'contracts-validate', title: 'Validate deployments', description: 'Verify successful deployment and record addresses', status: 'pending' }
      ]
    },
    {
      id: 'integration',
      title: 'Frontend & Backend Integration',
      description: 'Connect the frontend and backend with the blockchain',
      status: 'pending',
      substeps: [
        { id: 'integration-map', title: 'Map contract addresses', description: 'Update contract address mappings', status: 'pending' },
        { id: 'integration-config', title: 'Configure services', description: 'Set up network configurations', status: 'pending' },
        { id: 'integration-test', title: 'Integration testing', description: 'Test end-to-end functionality', status: 'pending' }
      ]
    },
    {
      id: 'database',
      title: 'Database Synchronization',
      description: 'Set up database for transaction syncing',
      status: 'pending',
      substeps: [
        { id: 'database-schema', title: 'Prepare schema', description: 'Create tables and indexes for transaction data', status: 'pending' },
        { id: 'database-sync', title: 'Configure sync service', description: 'Set up blockchain event listeners', status: 'pending' },
        { id: 'database-test', title: 'Test data flow', description: 'Verify transaction recording', status: 'pending' }
      ]
    },
    {
      id: 'deployment',
      title: 'Final Deployment',
      description: 'Deploy the complete application',
      status: 'pending',
      substeps: [
        { id: 'deployment-build', title: 'Build application', description: 'Compile production-ready build', status: 'pending' },
        { id: 'deployment-host', title: 'Deploy hosting', description: 'Upload to hosting provider', status: 'pending' },
        { id: 'deployment-verify', title: 'Verify deployment', description: 'Final end-to-end testing', status: 'pending' }
      ]
    }
  ]);
  
  const [deploymentConfig, setDeploymentConfig] = useState<DeploymentConfig>({
    networkType: 'mainnet',
    frontendDeployment: 'vercel',
    databaseSync: true,
    analyticsEnabled: true,
    programIdMapping: {}
  });
  
  const [deploymentProgress, setDeploymentProgress] = useState<number>(0);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [deploymentComplete, setDeploymentComplete] = useState<boolean>(false);
  
  // Load testnet contracts
  const testnetContracts = JSON.parse(localStorage.getItem('deployedTestnetContracts') || '[]');
  
  // Calculate total progress based on completed steps
  const calculateProgress = () => {
    const totalSubsteps = deploymentSteps.reduce(
      (acc, step) => acc + step.substeps.length, 0
    );
    
    const completedSubsteps = deploymentSteps.reduce(
      (acc, step) => acc + step.substeps.filter(substep => substep.status === 'completed').length, 0
    );
    
    return Math.round((completedSubsteps / totalSubsteps) * 100);
  };
  
  // Update program ID mapping
  const updateProgramIdMapping = (testnetId: string, mainnetId: string) => {
    setDeploymentConfig(prev => ({
      ...prev,
      programIdMapping: {
        ...prev.programIdMapping,
        [testnetId]: mainnetId
      }
    }));
  };
  
  // Start deployment process
  const startDeployment = async () => {
    if (isDeploying) return;
    
    if (deploymentConfig.programIdMapping && Object.keys(deploymentConfig.programIdMapping).length === 0) {
      toast.error("Please map testnet program IDs to mainnet program IDs first");
      return;
    }
    
    setIsDeploying(true);
    setDeploymentComplete(false);
    
    // Simulate deployment process
    await simulateDeployment();
    
    setIsDeploying(false);
    setDeploymentComplete(true);
    toast.success("Deployment completed successfully!");
  };
  
  // Simulate the deployment process
  const simulateDeployment = async () => {
    // Update step 1: Contract verification
    await updateStepStatus('contracts', 'in-progress');
    await simulateSubstep('contracts', 'contracts-verify');
    await simulateSubstep('contracts', 'contracts-migrate');
    await simulateSubstep('contracts', 'contracts-validate');
    await updateStepStatus('contracts', 'completed');
    
    // Update step 2: Integration
    await updateStepStatus('integration', 'in-progress');
    await simulateSubstep('integration', 'integration-map');
    await simulateSubstep('integration', 'integration-config');
    await simulateSubstep('integration', 'integration-test');
    await updateStepStatus('integration', 'completed');
    
    // Update step 3: Database sync
    await updateStepStatus('database', 'in-progress');
    await simulateSubstep('database', 'database-schema');
    await simulateSubstep('database', 'database-sync');
    await simulateSubstep('database', 'database-test');
    await updateStepStatus('database', 'completed');
    
    // Update step 4: Final deployment
    await updateStepStatus('deployment', 'in-progress');
    await simulateSubstep('deployment', 'deployment-build');
    await simulateSubstep('deployment', 'deployment-host');
    await simulateSubstep('deployment', 'deployment-verify');
    await updateStepStatus('deployment', 'completed');
  };
  
  // Update the status of a main step
  const updateStepStatus = async (stepId: string, status: 'pending' | 'in-progress' | 'completed' | 'error') => {
    setDeploymentSteps(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, status } : step
      )
    );
    
    // Update progress
    setDeploymentProgress(calculateProgress());
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
  };
  
  // Update the status of a substep
  const simulateSubstep = async (stepId: string, substepId: string) => {
    // Set to in-progress
    setDeploymentSteps(prev => 
      prev.map(step => 
        step.id === stepId 
          ? {
              ...step,
              substeps: step.substeps.map(substep => 
                substep.id === substepId 
                  ? { ...substep, status: 'in-progress' } 
                  : substep
              )
            } 
          : step
      )
    );
    
    // Simulate processing time (random between 1-3 seconds)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    // Set to completed
    setDeploymentSteps(prev => 
      prev.map(step => 
        step.id === stepId 
          ? {
              ...step,
              substeps: step.substeps.map(substep => 
                substep.id === substepId 
                  ? { ...substep, status: 'completed' } 
                  : substep
              )
            } 
          : step
      )
    );
    
    // Update progress
    setDeploymentProgress(calculateProgress());
  };
  
  // Navigate to appropriate pages
  const handleNavigation = (route: string) => {
    navigate(route);
  };
  
  // Reset the deployment process
  const resetDeployment = () => {
    // Reset all steps to pending
    setDeploymentSteps(prev => 
      prev.map(step => ({
        ...step,
        status: 'pending',
        substeps: step.substeps.map(substep => ({
          ...substep,
          status: 'pending'
        }))
      }))
    );
    
    setDeploymentProgress(0);
    setDeploymentComplete(false);
    toast.info("Deployment process reset");
  };
  
  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Card className="w-[350px] glass-card">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Please log in to access the deployment guide</p>
            <Button onClick={() => navigate('/admin-login')} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold font-poppins">Master Deployment Guide</h1>
            <p className="text-gray-400 text-sm mt-1">
              Complete end-to-end deployment process from testnet to production
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
              onClick={() => handleNavigation('/admin/smart-contract-testnet')}
            >
              <Code size={16} />
              View Testnet Contracts
            </Button>
            <Button 
              variant="orange" 
              className="flex items-center gap-2"
              onClick={startDeployment}
              disabled={isDeploying || deploymentComplete}
            >
              {isDeploying ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Deploying...
                </>
              ) : deploymentComplete ? (
                <>
                  <CheckCheck size={16} />
                  Deployed
                </>
              ) : (
                <>
                  <UploadCloud size={16} />
                  Start Deployment
                </>
              )}
            </Button>
          </div>
        </div>
        
        {testnetContracts.length === 0 && (
          <Alert variant="destructive" className="bg-red-500/10 border-red-500/30">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>No testnet contracts found</AlertTitle>
            <AlertDescription>
              You need to deploy contracts to testnet before proceeding with mainnet deployment.
              <Button 
                variant="link" 
                className="text-red-400 p-0 h-auto mt-2"
                onClick={() => handleNavigation('/admin/smart-contract-deployment')}
              >
                Go to Smart Contract Deployment <ChevronRight size={14} />
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="checklist">Checklist</TabsTrigger>
            <TabsTrigger value="config">Configuration</TabsTrigger>
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
            <TabsTrigger value="verification">Verification</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            <Card className="glass-card border-wybe-primary/20">
              <CardHeader>
                <CardTitle className="text-xl font-poppins flex items-center">
                  <Server className="mr-2 text-orange-500" size={20} />
                  Deployment Process Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">End-to-End Deployment Flow</h3>
                  <p className="text-gray-300 mb-4">
                    This guide provides a comprehensive process for deploying your Wybe application from 
                    development to production. Follow these steps to ensure a smooth deployment.
                  </p>
                  
                  <div className="relative">
                    {/* Progress line */}
                    <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-gray-700"></div>
                    
                    {deploymentSteps.map((step, index) => (
                      <div key={step.id} className="relative pl-10 pb-8">
                        {/* Step indicator */}
                        <div className={`absolute left-0 rounded-full h-7 w-7 flex items-center justify-center border ${
                          step.status === 'completed' ? 'bg-green-500 border-green-600' :
                          step.status === 'in-progress' ? 'bg-blue-500 border-blue-600' :
                          step.status === 'error' ? 'bg-red-500 border-red-600' :
                          'bg-gray-800 border-gray-700'
                        }`}>
                          {step.status === 'completed' ? (
                            <CheckCircle2 size={14} />
                          ) : step.status === 'in-progress' ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : step.status === 'error' ? (
                            <AlertCircle size={14} />
                          ) : (
                            <span className="text-xs">{index + 1}</span>
                          )}
                        </div>
                        
                        <h4 className="text-lg font-medium">{step.title}</h4>
                        <p className="text-gray-400 mt-1">{step.description}</p>
                        
                        <div className="mt-3 space-y-2">
                          {step.substeps.map(substep => (
                            <div key={substep.id} className="flex items-center gap-2 text-sm pl-2">
                              <div className={`h-4 w-4 rounded-full flex items-center justify-center ${
                                substep.status === 'completed' ? 'text-green-500' :
                                substep.status === 'in-progress' ? 'text-blue-500' :
                                substep.status === 'error' ? 'text-red-500' :
                                'text-gray-500'
                              }`}>
                                {substep.status === 'completed' ? (
                                  <CheckCircle2 size={12} />
                                ) : substep.status === 'in-progress' ? (
                                  <Loader2 size={12} className="animate-spin" />
                                ) : substep.status === 'error' ? (
                                  <AlertCircle size={12} />
                                ) : (
                                  <div className="h-1.5 w-1.5 rounded-full bg-current"></div>
                                )}
                              </div>
                              <span>{substep.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Alert className="bg-blue-500/10 border-blue-500/20">
                  <AlertTriangle className="h-4 w-4 text-blue-500" />
                  <AlertTitle>Production Deployment</AlertTitle>
                  <AlertDescription>
                    Always perform a full testing cycle before deploying to production. This ensures all components 
                    work together correctly and minimizes the risk of issues in the live environment.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="glass-card border-wybe-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white font-poppins text-lg flex items-center">
                    <Code className="mr-2 text-orange-500" size={18} />
                    Smart Contracts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300 mb-3">
                    Deploy your testnet contracts to mainnet while preserving all functionality.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-sm"
                    onClick={() => setActiveTab('checklist')}
                  >
                    View Contract Checklist <ChevronRight size={14} className="ml-1" />
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-wybe-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white font-poppins text-lg flex items-center">
                    <Globe className="mr-2 text-orange-500" size={18} />
                    Frontend Deployment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300 mb-3">
                    Deploy your application to Vercel, Netlify, or other hosting providers.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-sm"
                    onClick={() => setActiveTab('config')}
                  >
                    Configure Deployment <ChevronRight size={14} className="ml-1" />
                  </Button>
                </CardContent>
              </Card>
              
              <Card className="glass-card border-wybe-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white font-poppins text-lg flex items-center">
                    <Database className="mr-2 text-orange-500" size={18} />
                    Database Sync
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-300 mb-3">
                    Configure database synchronization with blockchain events.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-sm"
                    onClick={() => setActiveTab('deployment')}
                  >
                    Setup Sync Service <ChevronRight size={14} className="ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="checklist" className="space-y-6 mt-6">
            <Card className="glass-card border-wybe-primary/20">
              <CardHeader>
                <CardTitle className="text-xl font-poppins flex items-center">
                  <CheckCircle2 className="mr-2 text-orange-500" size={20} />
                  Deployment Checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-4">
                  <AccordionItem value="contracts" className="border-gray-700">
                    <AccordionTrigger className="text-lg font-medium hover:no-underline">
                      Smart Contract Migration
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Testnet Contracts Review</h4>
                        <div className="bg-black/20 p-4 rounded-md max-h-60 overflow-y-auto">
                          {testnetContracts.length > 0 ? (
                            <div className="space-y-4">
                              {testnetContracts.map((contract: any, idx: number) => (
                                <div key={idx} className="flex flex-col space-y-2 pb-3 border-b border-gray-800">
                                  <div className="flex justify-between">
                                    <span className="font-medium">{contract.name}</span>
                                    <Badge
                                      variant={contract.status === 'active' ? 'default' : 'outline'}
                                      className={contract.status === 'active' ? 'bg-green-500/50' : ''}
                                    >
                                      {contract.status}
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 text-sm">
                                    <div>
                                      <span className="text-gray-400">Program ID:</span>
                                      <div className="font-mono text-xs mt-1 bg-black/40 p-1.5 rounded">
                                        {contract.programId}
                                      </div>
                                    </div>
                                    <div>
                                      <span className="text-gray-400">Mainnet ID:</span>
                                      <div className="flex items-center mt-1">
                                        <Input
                                          placeholder="Enter mainnet program ID"
                                          className="h-8 text-xs font-mono bg-black/40 border-gray-700"
                                          value={deploymentConfig.programIdMapping[contract.programId] || ''}
                                          onChange={(e) => updateProgramIdMapping(contract.programId, e.target.value)}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-4 text-gray-400">
                              <AlertTriangle size={24} className="mx-auto mb-2" />
                              <p>No testnet contracts found</p>
                              <Button 
                                variant="link" 
                                className="text-wybe-primary mt-2 p-0 h-auto"
                                onClick={() => handleNavigation('/admin/smart-contract-deployment')}
                              >
                                Deploy Testnet Contracts First
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <Alert className="bg-amber-500/10 border-amber-500/20">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <AlertTitle>Program ID Mapping</AlertTitle>
                        <AlertDescription>
                          You must provide the matching mainnet program IDs for each testnet contract. These will be used
                          to update your application configuration during deployment.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Migration Checklist</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-green-500" />
                            <span>Verify contract functionality on testnet</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-green-500" />
                            <span>Audit contract security</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-green-500" />
                            <span>Deploy to mainnet with the same parameters</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-green-500" />
                            <span>Record mainnet program IDs</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CheckCircle2 size={16} className="text-green-500" />
                            <span>Verify mainnet transactions</span>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="frontend" className="border-gray-700">
                    <AccordionTrigger className="text-lg font-medium hover:no-underline">
                      Frontend & Backend Integration
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Configuration Updates</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center">
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                            </div>
                            <span>Update network RPC endpoints to mainnet</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center">
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                            </div>
                            <span>Update program IDs to mainnet addresses</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center">
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                            </div>
                            <span>Configure environment variables</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center">
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                            </div>
                            <span>Update API endpoints for backend services</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-800/50 p-4 rounded-md border border-gray-700">
                        <h4 className="font-medium mb-2">Vercel Deployment Configuration</h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Build Command</span>
                            <code className="bg-black/30 px-2 py-1 rounded text-xs">npm run build</code>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Output Directory</span>
                            <code className="bg-black/30 px-2 py-1 rounded text-xs">dist</code>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-300">Install Command</span>
                            <code className="bg-black/30 px-2 py-1 rounded text-xs">npm install</code>
                          </div>
                          <Separator className="bg-gray-700/50" />
                          <div>
                            <span className="text-gray-300">Environment Variables</span>
                            <div className="mt-2 space-y-2">
                              <div className="grid grid-cols-2 gap-2">
                                <code className="bg-black/30 px-2 py-1 rounded text-xs">VITE_NETWORK_TYPE</code>
                                <code className="bg-black/30 px-2 py-1 rounded text-xs">mainnet</code>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <code className="bg-black/30 px-2 py-1 rounded text-xs">VITE_MAIN_PROGRAM_ID</code>
                                <code className="bg-black/30 px-2 py-1 rounded text-xs">[Your Mainnet ID]</code>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Button variant="outline" className="w-full">
                        View Full Configuration Guide
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="database" className="border-gray-700">
                    <AccordionTrigger className="text-lg font-medium hover:no-underline">
                      Database & Transaction Sync
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">Database Schema</h4>
                        <div className="bg-black/20 p-4 rounded-md font-mono text-xs overflow-x-auto">
                          <pre>{`
CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  transaction_hash VARCHAR(64) UNIQUE NOT NULL,
  block_number BIGINT NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  from_address VARCHAR(44) NOT NULL,
  to_address VARCHAR(44) NOT NULL,
  token_amount NUMERIC(20, 9) NOT NULL,
  token_price NUMERIC(20, 9) NOT NULL,
  usd_value NUMERIC(20, 2),
  transaction_type VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL,
  program_id VARCHAR(44) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transactions_timestamp ON transactions(timestamp);
CREATE INDEX idx_transactions_from_address ON transactions(from_address);
CREATE INDEX idx_transactions_to_address ON transactions(to_address);
CREATE INDEX idx_transactions_program_id ON transactions(program_id);
`}</pre>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Blockchain Event Listener</h4>
                        <p className="text-sm text-gray-300">
                          The listener service connects to the Solana RPC endpoint and captures all relevant
                          transactions for your smart contracts.
                        </p>
                        <div className="bg-black/20 p-4 rounded-md font-mono text-xs overflow-x-auto">
                          <pre>{`
// Sample Solana event listener pseudo-code
const connection = new Connection(MAINNET_RPC_URL);

// Listen for program transaction signatures
connection.onProgramAccountChange(
  new PublicKey(PROGRAM_ID),
  async (accountInfo, context) => {
    // Process transaction data
    const signature = context.slot.toString();
    const txData = await connection.getTransaction(signature);
    
    // Write to database
    await db.insertTransaction({
      transaction_hash: signature,
      block_number: context.slot,
      timestamp: new Date(),
      // Additional data extracted from txData
    });
  }
);
`}</pre>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium">Integration Checklist</h4>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center">
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                            </div>
                            <span>Set up database with proper schema</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center">
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                            </div>
                            <span>Configure blockchain event listeners</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center">
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                            </div>
                            <span>Test data flow with sample transactions</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center">
                              <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                            </div>
                            <span>Set up transaction API for frontend</span>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="config" className="space-y-6 mt-6">
            <Card className="glass-card border-wybe-primary/20">
              <CardHeader>
                <CardTitle className="text-xl font-poppins flex items-center">
                  <Settings className="mr-2 text-orange-500" size={20} />
                  Deployment Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="networkType">Network Type</Label>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="mainnet"
                            name="networkType"
                            className="h-4 w-4 text-wybe-primary"
                            checked={deploymentConfig.networkType === 'mainnet'}
                            onChange={() => setDeploymentConfig(prev => ({ ...prev, networkType: 'mainnet' }))}
                          />
                          <Label htmlFor="mainnet" className="text-sm font-normal">Mainnet</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="testnet"
                            name="networkType"
                            className="h-4 w-4 text-wybe-primary"
                            checked={deploymentConfig.networkType === 'testnet'}
                            onChange={() => setDeploymentConfig(prev => ({ ...prev, networkType: 'testnet' }))}
                          />
                          <Label htmlFor="testnet" className="text-sm font-normal">Testnet</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="devnet"
                            name="networkType"
                            className="h-4 w-4 text-wybe-primary"
                            checked={deploymentConfig.networkType === 'devnet'}
                            onChange={() => setDeploymentConfig(prev => ({ ...prev, networkType: 'devnet' }))}
                          />
                          <Label htmlFor="devnet" className="text-sm font-normal">Devnet</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="frontendDeployment">Frontend Deployment</Label>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="vercel"
                            name="frontendDeployment"
                            className="h-4 w-4 text-wybe-primary"
                            checked={deploymentConfig.frontendDeployment === 'vercel'}
                            onChange={() => setDeploymentConfig(prev => ({ ...prev, frontendDeployment: 'vercel' }))}
                          />
                          <Label htmlFor="vercel" className="text-sm font-normal">Vercel</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="netlify"
                            name="frontendDeployment"
                            className="h-4 w-4 text-wybe-primary"
                            checked={deploymentConfig.frontendDeployment === 'netlify'}
                            onChange={() => setDeploymentConfig(prev => ({ ...prev, frontendDeployment: 'netlify' }))}
                          />
                          <Label htmlFor="netlify" className="text-sm font-normal">Netlify</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="github-pages"
                            name="frontendDeployment"
                            className="h-4 w-4 text-wybe-primary"
                            checked={deploymentConfig.frontendDeployment === 'github-pages'}
                            onChange={() => setDeploymentConfig(prev => ({ ...prev, frontendDeployment: 'github-pages' }))}
                          />
                          <Label htmlFor="github-pages" className="text-sm font-normal">GitHub Pages</Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="databaseSync" className="flex-grow">Database Sync</Label>
                      <Switch
                        id="databaseSync"
                        checked={deploymentConfig.databaseSync}
                        onCheckedChange={(checked) =>
                          setDeploymentConfig(prev => ({ ...prev, databaseSync: checked }))
                        }
                      />
                    </div>
                    
                    <div className="flex items-center justify-between space-x-2">
                      <Label htmlFor="analyticsEnabled" className="flex-grow">Enable Analytics</Label>
                      <Switch
                        id="analyticsEnabled"
                        checked={deploymentConfig.analyticsEnabled}
                        onCheckedChange={(checked) =>
                          setDeploymentConfig(prev => ({ ...prev, analyticsEnabled: checked }))
                        }
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Network Configuration</Label>
                      <Card className="bg-black/30 border-gray-700">
                        <CardContent className="pt-4 space-y-3 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">RPC Endpoint:</span>
                            <code className="text-xs">
                              {deploymentConfig.networkType === 'mainnet' 
                                ? 'https://api.mainnet-beta.solana.com' 
                                : deploymentConfig.networkType === 'testnet'
                                  ? 'https://api.testnet.solana.com'
                                  : 'https://api.devnet.solana.com'}
                            </code>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Explorer URL:</span>
                            <code className="text-xs">
                              {deploymentConfig.networkType === 'mainnet' 
                                ? 'https://explorer.solana.com' 
                                : deploymentConfig.networkType === 'testnet'
                                  ? 'https://explorer.solana.com/?cluster=testnet'
                                  : 'https://explorer.solana.com/?cluster=devnet'}
                            </code>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Commitment:</span>
                            <code className="text-xs">confirmed</code>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Frontend Build Configuration</Label>
                      <Card className="bg-black/30 border-gray-700">
                        <CardContent className="pt-4 space-y-3 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Build Command:</span>
                            <code className="text-xs">npm run build</code>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Output Directory:</span>
                            <code className="text-xs">dist</code>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Node Version:</span>
                            <code className="text-xs">18.x</code>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    
                    <Alert className="bg-blue-500/10 border-blue-500/20">
                      <AlertTitle>Deployment Configuration</AlertTitle>
                      <AlertDescription className="text-sm">
                        These settings will be used to generate the deployment configuration for your chosen platform.
                        Make sure all settings are correct before proceeding.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="deployment" className="space-y-6 mt-6">
            <Card className="glass-card border-wybe-primary/20">
              <CardHeader>
                <CardTitle className="text-xl font-poppins flex items-center">
                  <UploadCloud className="mr-2 text-orange-500" size={20} />
                  Deployment Process
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="w-full bg-gray-800/50 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-amber-500 h-full transition-all duration-500 ease-in-out"
                    style={{ width: `${deploymentProgress}%` }}
                  ></div>
                </div>
                <div className="text-center text-sm">
                  <span className="font-medium">{deploymentProgress}% Complete</span>
                  {isDeploying && (
                    <p className="text-gray-400 animate-pulse mt-1">Deployment in progress...</p>
                  )}
                  {deploymentComplete && (
                    <p className="text-green-400 mt-1">Deployment completed successfully!</p>
                  )}
                </div>
                
                <div className="space-y-4">
                  {deploymentSteps.map(step => (
                    <Card 
                      key={step.id} 
                      className={`border ${
                        step.status === 'completed' ? 'border-green-500/30' : 
                        step.status === 'in-progress' ? 'border-blue-500/30' : 
                        step.status === 'error' ? 'border-red-500/30' : 
                        'border-gray-700'
                      }`}
                    >
                      <CardHeader className="py-3 px-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base font-medium flex items-center">
                            {step.status === 'completed' ? (
                              <CheckCircle2 size={18} className="mr-2 text-green-500" />
                            ) : step.status === 'in-progress' ? (
                              <Loader2 size={18} className="mr-2 text-blue-500 animate-spin" />
                            ) : step.status === 'error' ? (
                              <AlertCircle size={18} className="mr-2 text-red-500" />
                            ) : (
                              <div className="w-[18px] h-[18px] mr-2"></div>
                            )}
                            {step.title}
                          </CardTitle>
                          <Badge
                            variant="outline"
                            className={`${
                              step.status === 'completed' ? 'border-green-500 text-green-500' : 
                              step.status === 'in-progress' ? 'border-blue-500 text-blue-500 animate-pulse' : 
                              step.status === 'error' ? 'border-red-500 text-red-500' : 
                              'border-gray-500 text-gray-500'
                            }`}
                          >
                            {step.status === 'completed' ? 'Completed' : 
                             step.status === 'in-progress' ? 'In Progress' : 
                             step.status === 'error' ? 'Error' : 'Pending'}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="px-4 py-3 pt-0">
                        <div className="space-y-2">
                          {step.substeps.map(substep => (
                            <div key={substep.id} className="flex items-center">
                              <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-2 ${
                                substep.status === 'completed' ? 'text-green-500' : 
                                substep.status === 'in-progress' ? 'text-blue-500' : 
                                substep.status === 'error' ? 'text-red-500' : 
                                'text-gray-500'
                              }`}>
                                {substep.status === 'completed' ? (
                                  <CheckCircle2 size={14} />
                                ) : substep.status === 'in-progress' ? (
                                  <Loader2 size={14} className="animate-spin" />
                                ) : substep.status === 'error' ? (
                                  <AlertCircle size={14} />
                                ) : (
                                  <div className="w-2 h-2 rounded-full bg-current"></div>
                                )}
                              </div>
                              <span className="text-sm">{substep.title}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="flex gap-3 justify-center">
                  {!isDeploying && !deploymentComplete && (
                    <Button
                      variant="orange"
                      className="px-8"
                      onClick={startDeployment}
                    >
                      <Play size={16} className="mr-2" />
                      Start Deployment
                    </Button>
                  )}
                  
                  {isDeploying && (
                    <Button
                      disabled
                      className="px-8 opacity-50"
                    >
                      <Loader2 size={16} className="mr-2 animate-spin" />
                      Deploying...
                    </Button>
                  )}
                  
                  {deploymentComplete && (
                    <>
                      <Button
                        variant="default"
                        className="px-8 bg-green-500 hover:bg-green-600"
                        onClick={() => window.open('https://example.com', '_blank')}
                      >
                        <ExternalLink size={16} className="mr-2" />
                        View Deployed App
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="px-8"
                        onClick={resetDeployment}
                      >
                        <RefreshCw size={16} className="mr-2" />
                        Reset Process
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="verification" className="space-y-6 mt-6">
            <Card className="glass-card border-wybe-primary/20">
              <CardHeader>
                <CardTitle className="text-xl font-poppins flex items-center">
                  <CheckCheck className="mr-2 text-orange-500" size={20} />
                  Deployment Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Final Checklist</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="border-gray-700">
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-base font-medium flex items-center">
                          <Landmark size={18} className="mr-2 text-orange-500" />
                          Smart Contract Verification
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 py-3 pt-0 space-y-2">
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center mr-2 text-green-500">
                            <CheckCircle2 size={14} />
                          </div>
                          <span className="text-sm">Contract addresses are correct</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center mr-2 text-green-500">
                            <CheckCircle2 size={14} />
                          </div>
                          <span className="text-sm">Functions execute correctly</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center mr-2 text-green-500">
                            <CheckCircle2 size={14} />
                          </div>
                          <span className="text-sm">Fee parameters match expectations</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center mr-2 text-green-500">
                            <CheckCircle2 size={14} />
                          </div>
                          <span className="text-sm">Events emit properly</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-gray-700">
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-base font-medium flex items-center">
                          <Globe size={18} className="mr-2 text-orange-500" />
                          Frontend Verification
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 py-3 pt-0 space-y-2">
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center mr-2 text-green-500">
                            <CheckCircle2 size={14} />
                          </div>
                          <span className="text-sm">All pages load correctly</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center mr-2 text-green-500">
                            <CheckCircle2 size={14} />
                          </div>
                          <span className="text-sm">Wallet connection works</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center mr-2 text-green-500">
                            <CheckCircle2 size={14} />
                          </div>
                          <span className="text-sm">Transaction functionality works</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center mr-2 text-green-500">
                            <CheckCircle2 size={14} />
                          </div>
                          <span className="text-sm">UI is responsive on all devices</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-gray-700">
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-base font-medium flex items-center">
                          <Database size={18} className="mr-2 text-orange-500" />
                          Database & Backend
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 py-3 pt-0 space-y-2">
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center mr-2 text-green-500">
                            <CheckCircle2 size={14} />
                          </div>
                          <span className="text-sm">Transaction sync is operational</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center mr-2 text-green-500">
                            <CheckCircle2 size={14} />
                          </div>
                          <span className="text-sm">APIs return correct data</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center mr-2 text-green-500">
                            <CheckCircle2 size={14} />
                          </div>
                          <span className="text-sm">Error handling is implemented</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center mr-2 text-green-500">
                            <CheckCircle2 size={14} />
                          </div>
                          <span className="text-sm">Data consistency verified</span>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="border-gray-700">
                      <CardHeader className="py-3 px-4">
                        <CardTitle className="text-base font-medium flex items-center">
                          <Box size={18} className="mr-2 text-orange-500" />
                          Security & Performance
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 py-3 pt-0 space-y-2">
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center mr-2 text-green-500">
                            <CheckCircle2 size={14} />
                          </div>
                          <span className="text-sm">SSL is properly configured</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center mr-2 text-green-500">
                            <CheckCircle2 size={14} />
                          </div>
                          <span className="text-sm">Frontend performance is optimized</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center mr-2 text-green-500">
                            <CheckCircle2 size={14} />
                          </div>
                          <span className="text-sm">API rate limiting is in place</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-5 h-5 rounded-full flex items-center justify-center mr-2 text-green-500">
                            <CheckCircle2 size={14} />
                          </div>
                          <span className="text-sm">Input validation is implemented</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
                
                <Alert className="bg-green-500/10 border-green-500/20">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <AlertTitle>Deployment Complete</AlertTitle>
                  <AlertDescription>
                    Your application has been successfully deployed and verified. All systems are operational and ready for use.
                  </AlertDescription>
                </Alert>
                
                <div className="flex gap-3 justify-center">
                  <Button
                    variant="orange"
                    className="px-8"
                    onClick={() => window.open('https://example.com', '_blank')}
                  >
                    <ExternalLink size={16} className="mr-2" />
                    Visit Live Application
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="px-8"
                    onClick={() => handleNavigation('/admin')}
                  >
                    Return to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default MasterDeploymentGuide;
