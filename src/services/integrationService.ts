
// Integration service for admin dashboard
// This service handles integration related operations for deployment and admin

// Types for deployment environment
export type DeploymentEnvironment = {
  id: string;
  name: string;
  url: string;
  programIds: string[];
  deploymentDate: number;
  network: 'mainnet' | 'testnet' | 'devnet' | 'localnet';
  status: 'active' | 'pending' | 'deprecated';
};

// Type for admin user access
export interface AdminUserAccess {
  email: string;
  role: 'superadmin' | 'admin' | 'manager' | 'viewer';
  permissions: string[];
  walletAddress?: string;
  twoFactorEnabled?: boolean;
}

// Type for deployment step
export type DeploymentStep = {
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
};

export const integrationService = {
  // Method to get deployment checklist
  getDeploymentChecklist: () => {
    // Try to get from localStorage first
    const storedChecklist = localStorage.getItem('deploymentChecklist');
    
    if (storedChecklist) {
      try {
        return JSON.parse(storedChecklist);
      } catch (error) {
        console.error("Error parsing checklist:", error);
      }
    }
    
    // Default checklist
    const defaultChecklist = [
      { id: 'contract', label: 'Smart contract built and tested', checked: false },
      { id: 'wallets', label: 'Treasury wallets configured', checked: false },
      { id: 'idl', label: 'Program IDL verified and documented', checked: false },
      { id: 'security', label: 'Security audit completed', checked: false },
      { id: 'test', label: 'Testnet deployment successful', checked: false },
      { id: 'keys', label: 'All required keys secured and backed up', checked: false },
      { id: 'frontend', label: 'Frontend integration tested', checked: false },
      { id: 'docs', label: 'Deployment documentation finalized', checked: false }
    ];
    
    // Store in localStorage for future use
    localStorage.setItem('deploymentChecklist', JSON.stringify(defaultChecklist));
    
    return defaultChecklist;
  },
  
  // Method to update checklist item
  updateChecklistItem: (id: string, checked: boolean) => {
    const storedChecklist = localStorage.getItem('deploymentChecklist');
    
    if (storedChecklist) {
      try {
        const checklist = JSON.parse(storedChecklist);
        const updatedChecklist = checklist.map((item: any) => 
          item.id === id ? { ...item, checked } : item
        );
        
        localStorage.setItem('deploymentChecklist', JSON.stringify(updatedChecklist));
        return true;
      } catch (error) {
        console.error("Error updating checklist:", error);
        return false;
      }
    }
    
    return false;
  },
  
  // Method to deploy environment
  deployFullEnvironment: async (
    name: string,
    network: 'mainnet' | 'testnet' | 'devnet' | 'localnet'
  ): Promise<DeploymentEnvironment> => {
    // Simulate deployment process with delay
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEnvironment: DeploymentEnvironment = {
          id: `env_${Date.now()}`,
          name,
          url: `https://${network}.wybe.io/${name.toLowerCase().replace(/\s+/g, '-')}`,
          programIds: [
            `Wybe${Date.now().toString(16).toUpperCase()}111111111111111111111`,
          ],
          deploymentDate: Date.now(),
          network,
          status: 'active'
        };
        
        // Store in localStorage
        const storedEnvironments = localStorage.getItem('deploymentEnvironments');
        const environments = storedEnvironments ? JSON.parse(storedEnvironments) : [];
        environments.push(newEnvironment);
        localStorage.setItem('deploymentEnvironments', JSON.stringify(environments));
        
        resolve(newEnvironment);
      }, 3000);
    });
  },
  
  // Get deployment steps for specific network
  getDeploymentSteps: (network: string): DeploymentStep[] => {
    // Try to get from localStorage first
    const key = `deploymentSteps_${network}`;
    const storedSteps = localStorage.getItem(key);
    
    if (storedSteps) {
      try {
        return JSON.parse(storedSteps);
      } catch (error) {
        console.error("Error parsing deployment steps:", error);
      }
    }
    
    // Default steps
    const defaultSteps: DeploymentStep[] = [
      {
        id: '1',
        title: 'Initialize Environment',
        description: 'Setup necessary development environment for contract deployment',
        status: 'completed',
        command: 'anchor init wybe_token_program',
        output: 'Environment initialized successfully!'
      },
      {
        id: '2',
        title: 'Build Smart Contract',
        description: 'Build the smart contract with Anchor framework',
        status: 'completed',
        command: 'anchor build',
        prerequisite: ['1'],
        output: 'Build completed successfully!'
      },
      {
        id: '3',
        title: 'Configure Program ID',
        description: 'Update Anchor.toml and lib.rs files with the program ID',
        status: 'in-progress',
        command: 'solana address -k ./target/deploy/wybe_token_program-keypair.json',
        prerequisite: ['2']
      },
      {
        id: '4',
        title: 'Deploy to Local Validator',
        description: 'Deploy the program to a local Solana validator for testing',
        status: 'pending',
        command: 'anchor deploy --provider.cluster localnet',
        prerequisite: ['2', '3']
      },
      {
        id: '5',
        title: 'Run Tests',
        description: 'Execute test suite against the deployed program',
        status: 'pending',
        command: 'anchor test',
        prerequisite: ['4']
      },
      {
        id: '6',
        title: `Deploy to ${network.charAt(0).toUpperCase() + network.slice(1)}`,
        description: `Deploy the program to ${network}`,
        status: 'pending',
        command: `anchor deploy --provider.cluster ${network}`,
        prerequisite: ['5']
      },
      {
        id: '7',
        title: 'Verify Deployment',
        description: 'Confirm deployment status and program functionality',
        status: 'pending',
        command: 'npm run verify-deployment',
        prerequisite: ['6']
      }
    ];
    
    // Store in localStorage for future use
    localStorage.setItem(key, JSON.stringify(defaultSteps));
    
    return defaultSteps;
  },
  
  // Methods for admin user management
  getAdminUsers: (adminWallet: string): AdminUserAccess[] => {
    const storedUsers = localStorage.getItem('adminUsers');
    
    if (storedUsers) {
      try {
        return JSON.parse(storedUsers);
      } catch (error) {
        console.error("Error parsing admin users:", error);
      }
    }
    
    // Default admin users
    const defaultUsers: AdminUserAccess[] = [
      {
        email: 'admin@wybe.com',
        role: 'superadmin',
        permissions: ['all'],
        walletAddress: adminWallet,
        twoFactorEnabled: true
      },
      {
        email: 'manager@wybe.com',
        role: 'manager',
        permissions: ['analytics_view', 'token_creation'],
        twoFactorEnabled: false
      },
      {
        email: 'support@wybe.com',
        role: 'viewer',
        permissions: ['analytics_view'],
        twoFactorEnabled: false
      }
    ];
    
    // Store in localStorage for future use
    localStorage.setItem('adminUsers', JSON.stringify(defaultUsers));
    
    return defaultUsers;
  },
  
  // Add admin user
  addAdminUser: (user: AdminUserAccess, adminWallet: string): boolean => {
    const storedUsers = localStorage.getItem('adminUsers');
    
    if (storedUsers) {
      try {
        const users: AdminUserAccess[] = JSON.parse(storedUsers);
        
        // Check if email already exists
        if (users.some(u => u.email === user.email)) {
          return false;
        }
        
        users.push(user);
        localStorage.setItem('adminUsers', JSON.stringify(users));
        return true;
      } catch (error) {
        console.error("Error adding admin user:", error);
        return false;
      }
    }
    
    return false;
  },
  
  // Update admin user permissions
  updateAdminUserPermissions: (
    email: string,
    role: AdminUserAccess['role'],
    permissions: string[],
    adminWallet: string
  ): boolean => {
    const storedUsers = localStorage.getItem('adminUsers');
    
    if (storedUsers) {
      try {
        const users: AdminUserAccess[] = JSON.parse(storedUsers);
        
        const updatedUsers = users.map(user => 
          user.email === email 
            ? { ...user, role, permissions } 
            : user
        );
        
        localStorage.setItem('adminUsers', JSON.stringify(updatedUsers));
        return true;
      } catch (error) {
        console.error("Error updating admin user:", error);
        return false;
      }
    }
    
    return false;
  },
  
  // Remove admin user
  removeAdminUser: (email: string, adminWallet: string): boolean => {
    const storedUsers = localStorage.getItem('adminUsers');
    
    if (storedUsers) {
      try {
        const users: AdminUserAccess[] = JSON.parse(storedUsers);
        
        // Prevent removing the last superadmin
        const superadmins = users.filter(u => u.role === 'superadmin');
        if (superadmins.length === 1 && superadmins[0].email === email) {
          return false;
        }
        
        const filteredUsers = users.filter(user => user.email !== email);
        localStorage.setItem('adminUsers', JSON.stringify(filteredUsers));
        return true;
      } catch (error) {
        console.error("Error removing admin user:", error);
        return false;
      }
    }
    
    return false;
  }
};

export default integrationService;
