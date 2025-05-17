
import { ReactNode } from 'react';

export interface RoadmapItemStep {
  title: string;
  description: string;
}

export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  category: 'frontend' | 'backend' | 'smart-contract' | 'deployment';
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  steps: RoadmapItemStep[];
  dependencies?: string[];
}

export const roadmapItems: RoadmapItem[] = [
  {
    id: 'setup-dev-env',
    title: 'Setup Development Environment',
    description: 'Configure the development environment with necessary tools and packages',
    status: 'completed',
    category: 'frontend',
    priority: 'high',
    estimatedTime: '4-8',
    steps: [
      {
        title: 'Install Node.js and npm',
        description: 'Download and install the latest LTS version of Node.js'
      },
      {
        title: 'Set up React with Vite',
        description: 'Initialize a new React project with Vite for faster development'
      },
      {
        title: 'Configure Tailwind CSS',
        description: 'Install and configure Tailwind CSS for styling'
      }
    ]
  },
  {
    id: 'implement-ui',
    title: 'Implement User Interface',
    description: 'Build the user interface components for the platform',
    status: 'in-progress',
    category: 'frontend',
    priority: 'high',
    estimatedTime: '16-24',
    steps: [
      {
        title: 'Create component library',
        description: 'Develop reusable UI components for buttons, cards, inputs, etc.'
      },
      {
        title: 'Implement layout system',
        description: 'Create responsive layouts for different screen sizes'
      },
      {
        title: 'Build navigation system',
        description: 'Create header, footer, and navigation components'
      }
    ],
    dependencies: ['setup-dev-env']
  },
  {
    id: 'setup-backend',
    title: 'Setup Backend Services',
    description: 'Configure backend services for data storage and API endpoints',
    status: 'in-progress',
    category: 'backend',
    priority: 'high',
    estimatedTime: '12-16',
    steps: [
      {
        title: 'Setup Supabase project',
        description: 'Create a new Supabase project and configure authentication'
      },
      {
        title: 'Design database schema',
        description: 'Create tables, relationships, and indexes'
      },
      {
        title: 'Implement API endpoints',
        description: 'Create functions for CRUD operations'
      }
    ],
    dependencies: ['setup-dev-env']
  },
  {
    id: 'smart-contract-dev',
    title: 'Smart Contract Development',
    description: 'Develop and test the smart contracts for token functionality',
    status: 'pending',
    category: 'smart-contract',
    priority: 'high',
    estimatedTime: '24-32',
    steps: [
      {
        title: 'Design token contract',
        description: 'Define the token standard and functionalities'
      },
      {
        title: 'Implement bonding curve logic',
        description: 'Create the mathematical model for token pricing'
      },
      {
        title: 'Write unit tests',
        description: 'Test all contract functions and edge cases'
      },
      {
        title: 'Audit security',
        description: 'Perform security analysis and fix vulnerabilities'
      }
    ],
    dependencies: ['setup-dev-env']
  },
  {
    id: 'deploy-testnet',
    title: 'Deploy to Testnet',
    description: 'Deploy the smart contracts to a testnet for testing',
    status: 'pending',
    category: 'deployment',
    priority: 'medium',
    estimatedTime: '8-12',
    steps: [
      {
        title: 'Configure deployment scripts',
        description: 'Create scripts for automated deployment'
      },
      {
        title: 'Deploy to testnet',
        description: 'Deploy the contracts to a testnet environment'
      },
      {
        title: 'Verify contract code',
        description: 'Verify the contract code on the blockchain explorer'
      }
    ],
    dependencies: ['smart-contract-dev']
  },
  {
    id: 'frontend-integration',
    title: 'Frontend Integration',
    description: 'Integrate the frontend with smart contracts',
    status: 'pending',
    category: 'frontend',
    priority: 'medium',
    estimatedTime: '16-20',
    steps: [
      {
        title: 'Implement web3 connection',
        description: 'Connect the frontend to blockchain wallets'
      },
      {
        title: 'Create contract interaction layer',
        description: 'Build services to interact with the smart contracts'
      },
      {
        title: 'Develop transaction management',
        description: 'Implement transaction submission and confirmation tracking'
      }
    ],
    dependencies: ['implement-ui', 'smart-contract-dev']
  }
];

export const calculateProgress = (): { completed: number; inProgress: number; overall: number } => {
  const total = roadmapItems.length;
  const completed = roadmapItems.filter(item => item.status === 'completed').length;
  const inProgress = roadmapItems.filter(item => item.status === 'in-progress').length;
  
  return {
    completed: (completed / total) * 100,
    inProgress: (inProgress / total) * 100,
    overall: ((completed + inProgress * 0.5) / total) * 100
  };
};
