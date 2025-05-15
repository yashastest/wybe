
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Server, 
  Database, 
  Network, 
  Download, 
  Copy, 
  CloudOff,
  RefreshCw,
  ChevronRight,
  Link2,
  Terminal,
  Cpu
} from 'lucide-react';
import { tradingService } from '@/services/tradingService';
import DeploymentProgressTracker from '@/components/DeploymentProgressTracker';
import DeploymentConfigChecker from '@/components/admin/DeploymentConfigChecker';
import { useNavigate } from 'react-router-dom';

const DeploymentSummary: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [deploymentConfig, setDeploymentConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [deploymentSteps, setDeploymentSteps] = useState([
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
      status: 'completed' as const,
      dependsOn: ['test_contract']
    },
    {
      id: 'verify_deployment',
      title: 'Verify Deployment',
      description: 'Verify contract is correctly deployed',
      status: 'completed' as const,
      dependsOn: ['deploy_contract']
    },
    {
      id: 'generate_client',
      title: 'Generate Client SDK',
      description: 'Generate TypeScript client SDK from IDL',
      status: 'completed' as const,
      dependsOn: ['verify_deployment']
    },
    {
      id: 'deploy_frontend',
      title: 'Deploy Frontend',
      description: 'Deploy frontend application with contract integration',
      status: 'completed' as const,
      dependsOn: ['generate_client']
    }
  ]);
  
  useEffect(() => {
    // Fetch deployment config
    const config = tradingService.getDeploymentEnvironment();
    setDeploymentConfig(config);
    
    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  
  const handleCopyAddress = () => {
    navigator.clipboard.writeText('TokenCsn1RpqzV4KHAm9RLzvrhy9BjJNw2k6Kq4J6YgsM');
    toast.success("Program ID copied to clipboard");
  };
  
  if (isLoading || !deploymentConfig) {
    return (
      <div className="min-h-screen flex flex-col bg-black">
        <Header />
        <div className="flex-1 container py-12 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="mx-auto h-12 w-12 text-orange-500 animate-spin" />
            <h2 className="mt-4 text-xl font-semibold">Loading deployment summary...</h2>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">Deployment Summary</h1>
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin')}
              className="bg-black/30 border-orange-500/30 text-orange-400 hover:bg-orange-900/20 hover:text-orange-300"
            >
              Admin Dashboard
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          {/* Network and Status Banner */}
          <Card className="glass-card mb-6 border-green-500/20 bg-gradient-to-r from-green-950/30 to-emerald-900/10">
            <CardContent className="p-5">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <div className="flex items-center">
                  <CheckCircle2 size={28} className="text-green-500 mr-3" />
                  <div>
                    <h2 className="text-xl font-semibold text-green-400">Deployment Active</h2>
                    <p className="text-gray-400">Smart contract is active on {deploymentConfig.networkType}</p>
                  </div>
                </div>
                
                <div className="mt-4 md:mt-0 flex items-center md:flex-row gap-3">
                  <div className="px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 text-sm font-medium flex items-center">
                    <Server size={14} className="mr-1.5" />
                    {deploymentConfig.networkType === 'mainnet' ? 'Production' : 'Testing Environment'}
                  </div>
                  <Button variant="outline" size="sm" className="text-white bg-black/40 hover:bg-black/60">
                    <Link2 className="mr-1.5 h-4 w-4" />
                    View in Explorer
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-3 bg-black/40 backdrop-blur">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="status">Health Status</TabsTrigger>
              <TabsTrigger value="details">Technical Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <Terminal className="mr-2 text-orange-500" />
                      Deployment Progress
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DeploymentProgressTracker 
                      steps={deploymentSteps} 
                      overallProgress={100} 
                      currentStepId="deploy_frontend" 
                    />
                  </CardContent>
                </Card>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="glass-card h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl">
                        <Server className="mr-2 text-blue-500" />
                        Environment
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-sm text-gray-400 mb-1">Frontend URL</h3>
                        <p className="text-white font-mono text-sm flex items-center">
                          {deploymentConfig.frontendUrl} 
                          <ExternalLink size={14} className="ml-1.5 text-orange-400" />
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm text-gray-400 mb-1">Backend URL</h3>
                        <p className="text-white font-mono text-sm flex items-center">
                          {deploymentConfig.backendUrl}
                          <ExternalLink size={14} className="ml-1.5 text-orange-400" />
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm text-gray-400 mb-1">Explorer</h3>
                        <p className="text-white font-mono text-sm flex items-center">
                          {deploymentConfig.explorerUrl}
                          <ExternalLink size={14} className="ml-1.5 text-orange-400" />
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm text-gray-400 mb-1">Network Type</h3>
                        <div className="flex items-center mt-1">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            deploymentConfig.networkType === 'mainnet' ? 'bg-green-900/40 text-green-400' : 
                            deploymentConfig.networkType === 'testnet' ? 'bg-yellow-900/40 text-yellow-400' : 
                            'bg-blue-900/40 text-blue-400'
                          }`}>
                            {deploymentConfig.networkType}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="glass-card h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center text-xl">
                        <Cpu className="mr-2 text-purple-500" />
                        Program Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-sm text-gray-400 mb-1">Program ID</h3>
                        <div className="flex items-center bg-black/40 rounded-md p-2 font-mono text-sm">
                          <span className="text-white truncate">TokenCsn1RpqzV4KHAm9RLzvrhy9BjJNw2k6Kq4J6YgsM</span>
                          <Button variant="ghost" size="sm" onClick={handleCopyAddress} className="ml-2 h-8 w-8 p-0">
                            <Copy size={14} />
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm text-gray-400 mb-1">Program Version</h3>
                        <p className="text-white">v1.0.0</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm text-gray-400 mb-1">Last Updated</h3>
                        <p className="text-white">May 15, 2025</p>
                      </div>
                      
                      <div className="flex space-x-2 pt-2">
                        <Button variant="outline" size="sm" className="text-sm">
                          <Download size={14} className="mr-1.5" />
                          Download IDL
                        </Button>
                        <Button variant="outline" size="sm" className="text-sm">
                          <Terminal size={14} className="mr-1.5" />
                          View ABI
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </TabsContent>
            
            <TabsContent value="status">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="glass-card mb-6">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <Network className="mr-2 text-green-500" />
                      Service Health
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-green-900/20 border border-green-500/20 rounded-lg">
                          <div className="flex items-center mb-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                            <h3 className="font-medium">Frontend</h3>
                          </div>
                          <p className="text-sm text-green-400">Operational</p>
                          <p className="text-xs text-gray-400 mt-1">Last checked: 5 mins ago</p>
                        </div>
                        
                        <div className="p-4 bg-green-900/20 border border-green-500/20 rounded-lg">
                          <div className="flex items-center mb-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                            <h3 className="font-medium">Backend API</h3>
                          </div>
                          <p className="text-sm text-green-400">Operational</p>
                          <p className="text-xs text-gray-400 mt-1">Last checked: 3 mins ago</p>
                        </div>
                        
                        <div className="p-4 bg-yellow-900/20 border border-yellow-500/20 rounded-lg">
                          <div className="flex items-center mb-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
                            <h3 className="font-medium">RPC Connection</h3>
                          </div>
                          <p className="text-sm text-yellow-400">Degraded Performance</p>
                          <p className="text-xs text-gray-400 mt-1">Last checked: 1 min ago</p>
                        </div>
                      </div>
                      
                      <Alert variant="default" className="bg-black/30 border-orange-500/20">
                        <AlertTriangle className="h-4 w-4 text-orange-400" />
                        <AlertDescription className="text-sm">
                          The RPC connection is currently experiencing degraded performance. This may affect transaction times. Our team is investigating.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="p-4 bg-black/30 border border-white/10 rounded-lg space-y-4">
                        <h3 className="font-medium">System Metrics</h3>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-400">API Response Time</span>
                            <span className="text-sm font-mono text-white">124 ms</span>
                          </div>
                          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: '30%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-400">RPC Response Time</span>
                            <span className="text-sm font-mono text-white">512 ms</span>
                          </div>
                          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 rounded-full" style={{ width: '70%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-400">Database Load</span>
                            <span className="text-sm font-mono text-white">23%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: '23%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <AlertTriangle className="mr-2 text-yellow-500" />
                      Recent Incidents
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-yellow-900/10 border border-yellow-500/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium flex items-center">
                            <CloudOff className="h-4 w-4 mr-2 text-yellow-500" />
                            RPC Degradation
                          </h3>
                          <span className="text-xs text-yellow-400">May 15, 2025 - Ongoing</span>
                        </div>
                        <p className="text-sm text-gray-300">
                          RPC connections experiencing increased latency. Our team is working with the infrastructure provider to resolve the issue.
                        </p>
                      </div>
                      
                      <div className="p-4 bg-green-900/10 border border-green-500/20 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium flex items-center">
                            <Database className="h-4 w-4 mr-2 text-green-500" />
                            Database Migration
                          </h3>
                          <span className="text-xs text-green-400">May 10, 2025 - Resolved</span>
                        </div>
                        <p className="text-sm text-gray-300">
                          Scheduled database migration completed successfully. No data loss or downtime occurred.
                        </p>
                      </div>
                      
                      <div className="flex justify-center mt-6">
                        <Button variant="outline" className="bg-black/30 text-gray-300">
                          View Incident History
                          <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="details">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <DeploymentConfigChecker environment={deploymentConfig.networkType} />
                
                <Card className="glass-card mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center text-xl">
                      <Terminal className="mr-2 text-purple-500" />
                      Technical Parameters
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="bg-black/40 border border-white/10 rounded-lg p-4">
                        <h3 className="text-sm font-medium mb-3">Smart Contract Parameters</h3>
                        <div className="space-y-2 font-mono text-xs">
                          <div className="grid grid-cols-3 gap-2">
                            <div className="text-gray-400">FEE_DENOMINATOR</div>
                            <div className="col-span-2 text-white">10000</div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="text-gray-400">PLATFORM_FEE_BPS</div>
                            <div className="col-span-2 text-white">100 (1%)</div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="text-gray-400">CREATOR_FEE_BPS</div>
                            <div className="col-span-2 text-white">100 (1%)</div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="text-gray-400">MAX_PRICE_IMPACT_BPS</div>
                            <div className="col-span-2 text-white">1000 (10%)</div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="text-gray-400">TREASURY_WALLET</div>
                            <div className="col-span-2 text-white truncate">Hk2m5...X7sFm</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-black/40 border border-white/10 rounded-lg p-4">
                        <h3 className="text-sm font-medium mb-3">API Configuration</h3>
                        <div className="space-y-2 font-mono text-xs">
                          <div className="grid grid-cols-3 gap-2">
                            <div className="text-gray-400">RATE_LIMIT</div>
                            <div className="col-span-2 text-white">100 requests/minute</div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="text-gray-400">CACHE_DURATION</div>
                            <div className="col-span-2 text-white">60 seconds</div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="text-gray-400">MAX_BATCH_SIZE</div>
                            <div className="col-span-2 text-white">100 items</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-black/40 border border-white/10 rounded-lg p-4">
                        <h3 className="text-sm font-medium mb-3">Infrastructure</h3>
                        <div className="space-y-2 font-mono text-xs">
                          <div className="grid grid-cols-3 gap-2">
                            <div className="text-gray-400">FRONTEND_HOSTING</div>
                            <div className="col-span-2 text-white">Vercel</div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="text-gray-400">DATABASE</div>
                            <div className="col-span-2 text-white">Supabase (PostgreSQL)</div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="text-gray-400">SOLANA_RPC</div>
                            <div className="col-span-2 text-white">Helius</div>
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            <div className="text-gray-400">BACKEND_FUNCTIONS</div>
                            <div className="col-span-2 text-white">Supabase Edge Functions</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DeploymentSummary;
