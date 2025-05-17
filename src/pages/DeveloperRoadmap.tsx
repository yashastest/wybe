
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, AlertCircle, ArrowRight, Code, Database, Wallet, Server, Layout, BarChart3, Lock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  steps: {
    title: string;
    description: string;
    code?: string;
  }[];
  priority: 'high' | 'medium' | 'low';
  category: 'frontend' | 'backend' | 'smart-contract' | 'deployment';
  estimatedTime: string;
  dependencies?: string[];
}

const roadmapItems: RoadmapItem[] = [
  {
    id: 'env-setup',
    title: 'Environment Setup',
    description: 'Configure application environment variables and deployment settings',
    status: 'in-progress',
    priority: 'high',
    category: 'deployment',
    estimatedTime: '1-2 hours',
    steps: [
      {
        title: 'Create .env file',
        description: 'Create a .env file in the project root with the WalletConnect Project ID',
        code: `# .env file in project root
VITE_WALLETCONNECT_PROJECT_ID='your_project_id_from_walletconnect'`
      },
      {
        title: 'Configure Supabase Project',
        description: 'Ensure all necessary Supabase secrets are set up'
      },
      {
        title: 'Set Network Configuration',
        description: 'Configure target blockchain networks (testnet/mainnet)'
      }
    ]
  },
  {
    id: 'smart-contract-deployment',
    title: 'Smart Contract Deployment',
    description: 'Deploy and configure smart contracts for token trading and management',
    status: 'pending',
    priority: 'high',
    category: 'smart-contract',
    estimatedTime: '3-5 hours',
    steps: [
      {
        title: 'Compile Contracts',
        description: 'Use Hardhat or another framework to compile smart contracts'
      },
      {
        title: 'Deploy to Test Network',
        description: 'Deploy contracts to a test network and verify functionality'
      },
      {
        title: 'Record Contract Addresses and ABIs',
        description: 'Document all deployed contract addresses and ABIs for frontend integration'
      },
      {
        title: 'Contract Verification',
        description: 'Verify contract source code on block explorers'
      }
    ]
  },
  {
    id: 'contract-integration',
    title: 'Smart Contract Integration',
    description: 'Connect frontend to deployed smart contracts',
    status: 'pending',
    priority: 'high',
    category: 'frontend',
    estimatedTime: '4-6 hours',
    dependencies: ['smart-contract-deployment', 'env-setup'],
    steps: [
      {
        title: 'Create Contract Helper Classes',
        description: 'Create typed wrappers for contract interactions',
        code: `// src/services/contracts/tokenContract.ts
import { ethers } from 'ethers';
import TOKEN_ABI from '@/abis/Token.json';

export class TokenContract {
  contract: ethers.Contract;
  
  constructor(address: string, provider: ethers.providers.Provider) {
    this.contract = new ethers.Contract(address, TOKEN_ABI, provider);
  }
  
  async getPrice(): Promise<ethers.BigNumber> {
    return this.contract.getCurrentPrice();
  }
  
  async buy(signer: ethers.Signer, amount: ethers.BigNumber): Promise<ethers.ContractTransaction> {
    return this.contract.connect(signer).buy({ value: amount });
  }
}`
      },
      {
        title: 'Implement Contract Event Listeners',
        description: 'Set up listeners for contract events to update UI in real-time'
      },
      {
        title: 'Error Handling for Contract Interactions',
        description: 'Implement robust error handling for contract interactions'
      }
    ]
  },
  {
    id: 'real-data-integration',
    title: 'Replace Mock Data with Real Data',
    description: 'Update services to use real blockchain data instead of mock data',
    status: 'pending',
    priority: 'high',
    category: 'frontend',
    estimatedTime: '5-8 hours',
    dependencies: ['contract-integration'],
    steps: [
      {
        title: 'Update Token Trading Service',
        description: 'Replace mock API calls with real contract interactions'
      },
      {
        title: 'Implement Token Price Feeds',
        description: 'Connect to oracles or other price feed sources for real-time pricing'
      },
      {
        title: 'Update Wallet Balance Hooks',
        description: 'Replace mock balance data with real on-chain queries'
      },
      {
        title: 'Update Transaction History',
        description: 'Fetch real transaction data from blockchain or indexers'
      }
    ]
  },
  {
    id: 'backend-integration',
    title: 'Backend Services Integration',
    description: 'Update Supabase functions and services to work with real contracts',
    status: 'pending',
    priority: 'medium',
    category: 'backend',
    estimatedTime: '6-10 hours',
    dependencies: ['contract-integration'],
    steps: [
      {
        title: 'Update Token Transactions Edge Function',
        description: 'Modify the token-transactions function to interact with real contracts'
      },
      {
        title: 'Implement Backend Event Listeners',
        description: 'Create services to listen for and process blockchain events'
      },
      {
        title: 'Set Up Data Sync Processes',
        description: 'Create indexers or listeners for blockchain events'
      },
      {
        title: 'Create Admin API Endpoints',
        description: 'Implement secure API endpoints for admin functions'
      }
    ]
  },
  {
    id: 'admin-functionality',
    title: 'Admin Functionality',
    description: 'Connect admin panels to real contract deployment and management',
    status: 'pending',
    priority: 'medium',
    category: 'frontend',
    estimatedTime: '4-6 hours',
    dependencies: ['backend-integration'],
    steps: [
      {
        title: 'Connect Token Deployment Panel',
        description: 'Connect the Token Deployment Panel to actual deployment functions'
      },
      {
        title: 'Implement Admin Authentication',
        description: 'Set up secure authentication for admin functions'
      },
      {
        title: 'Create Token Management Functions',
        description: 'Implement functions for managing existing tokens'
      }
    ]
  },
  {
    id: 'testing',
    title: 'Testing and Quality Assurance',
    description: 'Comprehensive testing of all application features',
    status: 'pending',
    priority: 'high',
    category: 'deployment',
    estimatedTime: '8-12 hours',
    dependencies: ['contract-integration', 'real-data-integration', 'admin-functionality'],
    steps: [
      {
        title: 'Wallet Connection Testing',
        description: 'Test wallet connection with multiple providers'
      },
      {
        title: 'Token Trading Testing',
        description: 'Test buying and selling tokens with small amounts'
      },
      {
        title: 'Admin Function Testing',
        description: 'Test all admin functions and permissions'
      },
      {
        title: 'Cross-browser Testing',
        description: 'Test application across different browsers and devices'
      }
    ]
  },
  {
    id: 'deployment',
    title: 'Production Deployment',
    description: 'Deploy the application to production environment',
    status: 'pending',
    priority: 'medium',
    category: 'deployment',
    estimatedTime: '3-5 hours',
    dependencies: ['testing'],
    steps: [
      {
        title: 'Frontend Deployment',
        description: 'Deploy the frontend to a production hosting service'
      },
      {
        title: 'Configure Domain and SSL',
        description: 'Set up proper domain and SSL certificates'
      },
      {
        title: 'Set Up Monitoring',
        description: 'Configure monitoring and alerts'
      }
    ]
  },
  {
    id: 'documentation',
    title: 'Documentation',
    description: 'Create comprehensive documentation for the application',
    status: 'pending',
    priority: 'low',
    category: 'deployment',
    estimatedTime: '4-6 hours',
    steps: [
      {
        title: 'User Documentation',
        description: 'Create documentation for end users'
      },
      {
        title: 'API Documentation',
        description: 'Document all API endpoints and contract interactions'
      },
      {
        title: 'Developer Documentation',
        description: 'Create documentation for future developers'
      }
    ]
  }
];

const calculateProgress = () => {
  const total = roadmapItems.length;
  const completed = roadmapItems.filter(item => item.status === 'completed').length;
  const inProgress = roadmapItems.filter(item => item.status === 'in-progress').length;
  
  return {
    completed: (completed / total) * 100,
    inProgress: (inProgress / total) * 100,
    overall: ((completed + (inProgress * 0.5)) / total) * 100
  };
};

const DeveloperRoadmap = () => {
  const progress = calculateProgress();
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'frontend': return <Layout size={18} />;
      case 'backend': return <Database size={18} />;
      case 'smart-contract': return <Code size={18} />;
      case 'deployment': return <Server size={18} />;
      default: return <BarChart3 size={18} />;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="text-green-500" size={20} />;
      case 'in-progress': return <Circle className="text-amber-400" size={20} />;
      case 'pending': return <Circle className="text-gray-400" size={20} />;
      default: return <AlertCircle className="text-red-500" size={20} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Developer Roadmap</h1>
              <p className="text-gray-400">
                A comprehensive guide to implement and deploy the Wybe trading platform
              </p>
            </div>
            
            <Card className="w-full md:w-64 bg-black/30 border-wybe-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-gray-300">Overall Progress</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Completed</span>
                    <span>{Math.round(progress.completed)}%</span>
                  </div>
                  <Progress value={progress.completed} className="h-1 bg-gray-800" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>In Progress</span>
                    <span>{Math.round(progress.inProgress)}%</span>
                  </div>
                  <Progress value={progress.inProgress} className="h-1 bg-gray-800" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium">Overall</span>
                    <span className="font-medium">{Math.round(progress.overall)}%</span>
                  </div>
                  <Progress value={progress.overall} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <ArrowRight className="mr-2 text-wybe-primary" size={20} />
                Implementation Steps
              </h2>
              
              <div className="space-y-6">
                {roadmapItems.map((item, index) => (
                  <Card key={item.id} className="bg-black/30 border-wybe-primary/10 overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(item.status)}
                          <CardTitle className="text-lg">{item.title}</CardTitle>
                        </div>
                        <Badge
                          variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'outline'}
                          className="capitalize"
                        >
                          {item.priority} priority
                        </Badge>
                      </div>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pb-0">
                      <div className="space-y-3">
                        {item.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="pb-2">
                            <div className="font-medium text-sm mb-1">{stepIndex + 1}. {step.title}</div>
                            <div className="text-xs text-gray-400">{step.description}</div>
                            {step.code && (
                              <div className="mt-2 p-2 bg-black border border-gray-800 rounded text-xs font-mono text-green-400 whitespace-pre overflow-x-auto">
                                {step.code}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="pt-3 pb-3 flex items-center justify-between text-xs text-gray-400 border-t border-gray-800">
                      <div className="flex items-center gap-2">
                        <div className="bg-gray-800 p-1 rounded">
                          {getCategoryIcon(item.category)}
                        </div>
                        <span className="capitalize">{item.category}</span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {item.dependencies && (
                          <div className="flex items-center gap-1">
                            <Lock size={12} />
                            <span>
                              Dependencies: {item.dependencies.map(dep => {
                                const depItem = roadmapItems.find(i => i.id === dep);
                                return depItem ? depItem.title.split(' ')[0] : dep;
                              }).join(', ')}
                            </span>
                          </div>
                        )}
                        <div>Est. time: {item.estimatedTime}</div>
                      </div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
            
            <div>
              <div className="sticky top-24">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <BarChart3 className="mr-2 text-wybe-primary" size={20} />
                  Progress Summary
                </h2>
                
                <Card className="bg-black/30 border-wybe-primary/10">
                  <CardHeader>
                    <CardTitle className="text-base">Task Completion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Completed</span>
                        <Badge variant="outline" className="bg-green-500/10 text-green-500">
                          {roadmapItems.filter(item => item.status === 'completed').length} / {roadmapItems.length}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">In Progress</span>
                        <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                          {roadmapItems.filter(item => item.status === 'in-progress').length} / {roadmapItems.length}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Pending</span>
                        <Badge variant="outline" className="bg-gray-500/10 text-gray-400">
                          {roadmapItems.filter(item => item.status === 'pending').length} / {roadmapItems.length}
                        </Badge>
                      </div>
                      
                      <Separator className="my-2" />
                      
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Estimated Completion Time</div>
                        <div className="text-2xl font-bold">
                          {roadmapItems.reduce((acc, item) => {
                            const [min, max] = item.estimatedTime.split('-').map(t => parseInt(t, 10));
                            return acc + (min + max) / 2;
                          }, 0).toFixed(0)} hours
                        </div>
                        <div className="text-xs text-gray-400">
                          Assuming sequential implementation of dependent tasks
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-black/30 border-wybe-primary/10 mt-6">
                  <CardHeader>
                    <CardTitle className="text-base">Priority Tasks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {roadmapItems
                        .filter(item => item.priority === 'high' && item.status !== 'completed')
                        .map(item => (
                          <div key={item.id} className="flex items-start gap-2 pb-2 border-b border-gray-800 last:border-0 last:pb-0">
                            <div className="mt-0.5">{getStatusIcon(item.status)}</div>
                            <div>
                              <div className="font-medium text-sm">{item.title}</div>
                              <div className="text-xs text-gray-400">{item.category} • {item.estimatedTime}</div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DeveloperRoadmap;
