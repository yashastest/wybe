
// Integration service for admin dashboard
// This service handles integration between different parts of the app

// Types for admin user access
export interface AdminUserAccess {
  email: string;
  role: 'superadmin' | 'admin' | 'manager' | 'viewer';
  permissions: string[];
  walletAddress?: string;
  twoFactorEnabled?: boolean;
  active?: boolean;
  name?: string;
  lastLogin?: string;
}

// Export DeploymentStep type that was missing
export interface DeploymentStep {
  id: string;
  title: string; // Changed from 'name' to 'title' to match usage in components
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  command?: string;
  output?: string;
  prerequisite?: string[]; // Changed from 'dependencies' to 'prerequisite' to match usage
  verificationSteps?: {
    id: string;
    title: string;
    status: 'pending' | 'success' | 'error';
    message?: string;
  }[];
}

// Export DeploymentEnvironment type
export interface DeploymentEnvironment {
  id: string;
  label: string;
  checked: boolean;
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
    email: 'admin@wybe.io',
    role: 'superadmin',
    permissions: ['all'],
    active: true,
    walletAddress: 'WybeAdmin123456789',
    name: 'Main Admin',
    lastLogin: new Date().toISOString()
  },
  {
    email: 'viewer@wybe.io',
    role: 'viewer',
    permissions: ['analytics_view'],
    active: true,
    walletAddress: 'WybeViewer987654321',
    name: 'Viewer Account',
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
    console.log("Getting admin users for wallet:", adminWallet);
    // Return mock admin users
    return [...adminUsers];
  },

  // Add new admin user
  addAdminUser: (user: AdminUserAccess, adminWallet: string) => {
    // Simulate check if admin has permission to add users
    console.log("Adding admin user:", user, "by wallet:", adminWallet);
    adminUsers.push(user);
    return true;
  },

  // Update admin user permissions
  updateAdminUserPermissions: (
    email: string, 
    role: AdminUserAccess['role'], 
    permissions: string[], 
    adminWallet: string
  ) => {
    console.log("Updating permissions for user:", email, "by wallet:", adminWallet);
    const index = adminUsers.findIndex(user => user.email === email);
    if (index !== -1) {
      adminUsers[index].role = role;
      adminUsers[index].permissions = permissions;
      return true;
    }
    return false;
  },

  // Remove admin user
  removeAdminUser: (email: string, adminWallet: string) => {
    console.log("Removing admin user:", email, "by wallet:", adminWallet);
    const index = adminUsers.findIndex(user => user.email === email);
    if (index !== -1) {
      adminUsers.splice(index, 1);
      return true;
    }
    return false;
  },
  
  // Get deployment steps for deployment guide
  getDeploymentSteps: (network?: string): DeploymentStep[] => {
    console.log("Getting deployment steps for network:", network || "default");
    // Return mock deployment steps
    return [
      {
        id: '1',
        title: 'Set up development environment',
        description: 'Install Node.js, Solana CLI, and Anchor framework',
        status: 'completed',
        command: 'npm install -g @project-serum/anchor'
      },
      {
        id: '2',
        title: 'Initialize project',
        description: 'Create a new Anchor project',
        status: 'completed',
        command: 'anchor init wybe_token_program',
        prerequisite: ['1']
      },
      {
        id: '3',
        title: 'Configure project',
        description: 'Update Anchor.toml and program files',
        status: 'completed',
        prerequisite: ['2']
      },
      {
        id: '4',
        title: 'Build project',
        description: 'Compile the Rust program',
        status: 'in-progress',
        command: 'anchor build',
        prerequisite: ['3']
      },
      {
        id: '5',
        title: 'Deploy to localnet',
        description: 'Test deployment on local Solana validator',
        status: 'pending',
        command: 'anchor deploy --provider.cluster localnet',
        prerequisite: ['4']
      },
      {
        id: '6',
        title: 'Run tests',
        description: 'Execute test suite',
        status: 'pending',
        command: 'anchor test',
        prerequisite: ['5']
      },
      {
        id: '7',
        title: 'Deploy to testnet',
        description: 'Deploy to Solana testnet',
        status: 'pending',
        command: 'anchor deploy --provider.cluster testnet',
        prerequisite: ['6']
      },
      {
        id: '8',
        title: 'Deploy to mainnet',
        description: 'Deploy to Solana mainnet',
        status: 'pending',
        command: 'anchor deploy --provider.cluster mainnet-beta',
        prerequisite: ['7']
      }
    ];
  },

  // Get deployment environments
  getDeploymentEnvironments: (): DeploymentEnvironment[] => {
    return [
      { id: '1', label: 'Local Development', checked: true },
      { id: '2', label: 'Test Environment', checked: false },
      { id: '3', label: 'Staging', checked: false },
      { id: '4', label: 'Production', checked: false }
    ];
  }
};

export default integrationService;
