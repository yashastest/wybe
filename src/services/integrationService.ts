
// Integration service for admin dashboard
// This service handles integration between different parts of the app

// Types for admin user access
export interface AdminUserAccess {
  wallet: string;
  permissions: string[];
  active: boolean;
  name: string;
  role: string;
  lastLogin?: string;
}

// Export DeploymentStep type that was missing
export interface DeploymentStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  command?: string;
  output?: string;
  dependencies?: string[];
}

// Mock deployment checklist data
const deploymentChecklist = [
  {
    id: '1',
    name: 'Install Dependencies',
    checked: true,
    description: 'Install all required dependencies for the project'
  },
  {
    id: '2',
    name: 'Configure Environment',
    checked: false,
    description: 'Set up environment variables and configuration files'
  },
  {
    id: '3',
    name: 'Build Smart Contracts',
    checked: false,
    description: 'Compile and build smart contracts using Anchor'
  },
  {
    id: '4',
    name: 'Deploy to Test Network',
    checked: false,
    description: 'Deploy contracts to Solana testnet for testing'
  },
  {
    id: '5',
    name: 'Run Integration Tests',
    checked: false,
    description: 'Execute integration tests against deployed contracts'
  },
  {
    id: '6',
    name: 'Security Audit',
    checked: false,
    description: 'Perform security audit on deployed contracts'
  },
  {
    id: '7',
    name: 'Deploy to Mainnet',
    checked: false,
    description: 'Deploy finalized contracts to Solana mainnet'
  }
];

// Mock admin users
const adminUsers: AdminUserAccess[] = [
  {
    wallet: 'WybeAdmin123456789',
    permissions: ['all'],
    active: true,
    name: 'Main Admin',
    role: 'Super Admin',
    lastLogin: new Date().toISOString()
  },
  {
    wallet: 'WybeViewer987654321',
    permissions: ['view'],
    active: true,
    name: 'Viewer Account',
    role: 'Viewer',
    lastLogin: new Date(Date.now() - 86400000).toISOString() // 1 day ago
  }
];

// Export integration service object
export const integrationService = {
  // Get deployment checklist
  getDeploymentChecklist: () => {
    return [...deploymentChecklist];
  },

  // Update checklist item
  updateChecklistItem: (id: string, checked: boolean) => {
    const index = deploymentChecklist.findIndex(item => item.id === id);
    if (index !== -1) {
      deploymentChecklist[index].checked = checked;
      return true;
    }
    return false;
  },

  // Deploy full environment mock function
  deployFullEnvironment: async (name: string, network: 'testnet' | 'mainnet' | 'devnet' | 'localnet') => {
    console.log(`Deploying ${name} to ${network}...`);
    
    // Simulate deployment
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          message: `Deployment of ${name} to ${network} completed successfully.`,
          timestamp: new Date().toISOString(),
          environment: {
            name,
            network,
            status: 'active'
          }
        });
      }, 2000);
    });
  },

  // Get admin users
  getAdminUsers: (adminWallet: string) => {
    // Simulate check if admin has permission to view users
    const admin = adminUsers.find(user => user.wallet === adminWallet);
    if (admin && (admin.permissions.includes('all') || admin.permissions.includes('manage_users'))) {
      return [...adminUsers];
    }
    return [];
  },

  // Add new admin user
  addAdminUser: (user: AdminUserAccess, adminWallet: string) => {
    // Simulate check if admin has permission to add users
    const admin = adminUsers.find(userItem => userItem.wallet === adminWallet);
    if (admin && (admin.permissions.includes('all') || admin.permissions.includes('manage_users'))) {
      adminUsers.push(user);
      return true;
    }
    return false;
  },

  // Update admin user
  updateAdminUser: (user: AdminUserAccess, adminWallet: string) => {
    // Simulate check if admin has permission to update users
    const admin = adminUsers.find(userItem => userItem.wallet === adminWallet);
    if (admin && (admin.permissions.includes('all') || admin.permissions.includes('manage_users'))) {
      const index = adminUsers.findIndex(userItem => userItem.wallet === user.wallet);
      if (index !== -1) {
        adminUsers[index] = user;
        return true;
      }
    }
    return false;
  },
  
  // Get deployment steps for deployment guide
  getDeploymentSteps: (): DeploymentStep[] => {
    return [
      {
        id: '1',
        name: 'Set up development environment',
        description: 'Install Node.js, Solana CLI, and Anchor framework',
        status: 'completed',
        command: 'npm install -g @project-serum/anchor'
      },
      {
        id: '2',
        name: 'Initialize project',
        description: 'Create a new Anchor project',
        status: 'completed',
        command: 'anchor init wybe_token_program',
        dependencies: ['1']
      },
      {
        id: '3',
        name: 'Configure project',
        description: 'Update Anchor.toml and program files',
        status: 'completed',
        dependencies: ['2']
      },
      {
        id: '4',
        name: 'Build project',
        description: 'Compile the Rust program',
        status: 'in-progress',
        command: 'anchor build',
        dependencies: ['3']
      },
      {
        id: '5',
        name: 'Deploy to localnet',
        description: 'Test deployment on local Solana validator',
        status: 'pending',
        command: 'anchor deploy --provider.cluster localnet',
        dependencies: ['4']
      },
      {
        id: '6',
        name: 'Run tests',
        description: 'Execute test suite',
        status: 'pending',
        command: 'anchor test',
        dependencies: ['5']
      },
      {
        id: '7',
        name: 'Deploy to testnet',
        description: 'Deploy to Solana testnet',
        status: 'pending',
        command: 'anchor deploy --provider.cluster testnet',
        dependencies: ['6']
      },
      {
        id: '8',
        name: 'Deploy to mainnet',
        description: 'Deploy to Solana mainnet',
        status: 'pending',
        command: 'anchor deploy --provider.cluster mainnet-beta',
        dependencies: ['7']
      }
    ];
  }
};

export default integrationService;
