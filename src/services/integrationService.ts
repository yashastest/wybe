
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
