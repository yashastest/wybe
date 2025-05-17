
// Roadmap items data structure
export interface RoadmapStep {
  title: string;
  description: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending' | 'failed';
  priority: 'high' | 'medium' | 'low';
  category: 'frontend' | 'backend' | 'smart-contract' | 'deployment' | string;
  estimatedTime: string;
  steps: RoadmapStep[];
  dependencies?: string[];
}

// Simplified data structure - reduced for performance
export const roadmapItems: RoadmapItem[] = [
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
        description: 'Create typed wrappers for contract interactions'
      },
      {
        title: 'Implement Contract Event Listeners',
        description: 'Set up listeners for contract events to update UI in real-time'
      }
    ]
  }
];

export const calculateProgress = () => {
  const total = roadmapItems.length;
  const completed = roadmapItems.filter(item => item.status === 'completed').length;
  const inProgress = roadmapItems.filter(item => item.status === 'in-progress').length;
  
  return {
    completed: (completed / total) * 100,
    inProgress: (inProgress / total) * 100,
    overall: ((completed + (inProgress * 0.5)) / total) * 100
  };
};
