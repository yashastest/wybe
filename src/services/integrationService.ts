// Integration service file
// This service handles integration with external systems and services

type AdminRole = "admin" | "manager" | "viewer" | "superadmin";

export interface AdminUserAccess {
  email: string;
  role: AdminRole;
  permissions: string[];
  walletAddress?: string;
  twoFactorEnabled?: boolean;
}

// Fix for the type comparison error on line 274
export function checkAdminAccess(role: AdminRole): boolean {
  return role === "admin" || role === "superadmin"; 
}

// Mock admin user data
const mockAdminUsers: AdminUserAccess[] = [
  {
    email: "admin@wybe.io",
    role: "superadmin",
    permissions: ["all"],
    walletAddress: "WYBE123456789abcdef",
    twoFactorEnabled: true
  },
  {
    email: "manager@wybe.io",
    role: "manager",
    permissions: ["analytics_view", "token_creation"],
    walletAddress: "",
    twoFactorEnabled: false
  },
  {
    email: "viewer@wybe.io",
    role: "viewer",
    permissions: ["analytics_view"],
    walletAddress: "",
    twoFactorEnabled: false
  }
];

// Mock treasury wallet data types
interface TreasuryWallet {
  id: string;
  name: string;
  address: string;
  balance: number;
  tokenBalance?: {
    symbol: string;
    amount: number;
  }[];
  isMultisig: boolean;
  signers?: string[];
  threshold?: number;
}

// Mock treasury wallet data
const mockTreasuryWallets: TreasuryWallet[] = [
  {
    id: "wallet-1",
    name: "Main Treasury",
    address: "8JzqrG4pQSSA7QuQeEjbDxKLBMqKriGCNzUL7Lxpk8iD",
    balance: 156.78,
    tokenBalance: [
      { symbol: "USDC", amount: 25000 },
      { symbol: "WYBE", amount: 1000000 }
    ],
    isMultisig: true,
    signers: [
      "8JzqrG4pQSSA7QuQeEjbDxKLBMqKriGCNzUL7Lxpk8iD",
      "5dNRAkbeYxy5j6zBeCpkEHxYXZXGE7LyGrDebZMx5BR"
    ],
    threshold: 2
  },
  {
    id: "wallet-2",
    name: "Operational Wallet",
    address: "5dNRAkbeYxy5j6zBeCpkEHxYXZXGE7LyGrDebZMx5BR",
    balance: 42.45,
    isMultisig: false
  }
];

// Environment deployment options
export interface EnvironmentDeploymentOptions {
  networkType: 'mainnet' | 'testnet' | 'devnet';
  frontendUrl: string;
  backendUrl: string;
  creatorFeePercentage: number;
  platformFeePercentage: number;
}

// Integration service implementation
export const integrationService = {
  // Admin user methods
  getAdminUsers: (walletAddress: string): AdminUserAccess[] => {
    console.log(`Getting admin users with wallet: ${walletAddress}`);
    return mockAdminUsers;
  },
  
  addAdminUser: (user: AdminUserAccess, walletAddress: string): boolean => {
    console.log(`Adding admin user: ${user.email} with role: ${user.role}`);
    if (mockAdminUsers.find(u => u.email === user.email)) {
      return false; // User already exists
    }
    mockAdminUsers.push(user);
    return true;
  },
  
  updateAdminUserPermissions: (
    email: string, 
    role: AdminRole, 
    permissions: string[], 
    walletAddress: string
  ): boolean => {
    console.log(`Updating permissions for user: ${email}`);
    const userIndex = mockAdminUsers.findIndex(u => u.email === email);
    if (userIndex === -1) return false;
    
    mockAdminUsers[userIndex].role = role;
    mockAdminUsers[userIndex].permissions = permissions;
    return true;
  },
  
  removeAdminUser: (email: string, walletAddress: string): boolean => {
    console.log(`Removing admin user: ${email}`);
    const initialLength = mockAdminUsers.length;
    const filtered = mockAdminUsers.filter(u => u.email !== email);
    
    if (filtered.length === initialLength) {
      return false; // User not found
    }
    
    // Update the reference keeping the same array
    mockAdminUsers.length = 0;
    mockAdminUsers.push(...filtered);
    return true;
  },

  // Treasury wallet methods
  getTreasuryWallets: (walletAddress: string): TreasuryWallet[] => {
    console.log(`Getting treasury wallets for: ${walletAddress}`);
    return mockTreasuryWallets;
  },
  
  addTreasuryWallet: (wallet: TreasuryWallet, walletAddress: string): boolean => {
    console.log(`Adding treasury wallet: ${wallet.name}`);
    if (mockTreasuryWallets.find(w => w.id === wallet.id)) {
      return false; // Wallet already exists
    }
    mockTreasuryWallets.push(wallet);
    return true;
  },
  
  removeTreasuryWallet: (walletId: string, walletAddress: string): boolean => {
    console.log(`Removing treasury wallet: ${walletId}`);
    const initialLength = mockTreasuryWallets.length;
    const filtered = mockTreasuryWallets.filter(w => w.id !== walletId);
    
    if (filtered.length === initialLength) {
      return false; // Wallet not found
    }
    
    // Update the reference keeping the same array
    mockTreasuryWallets.length = 0;
    mockTreasuryWallets.push(...filtered);
    return true;
  },
  
  transferBetweenTreasuryWallets: (
    fromWalletId: string,
    toWalletId: string,
    amount: number,
    token: string,
    walletAddress: string
  ): Promise<boolean> => {
    console.log(`Transferring ${amount} ${token} from wallet ${fromWalletId} to wallet ${toWalletId}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const fromWallet = mockTreasuryWallets.find(w => w.id === fromWalletId);
        const toWallet = mockTreasuryWallets.find(w => w.id === toWalletId);
        
        if (!fromWallet || !toWallet) {
          resolve(false);
          return;
        }
        
        if (token === 'SOL') {
          if (fromWallet.balance < amount) {
            resolve(false);
            return;
          }
          
          fromWallet.balance -= amount;
          toWallet.balance += amount;
          resolve(true);
        } else {
          // Handle token transfers
          const fromTokenBalance = fromWallet.tokenBalance?.find(t => t.symbol === token);
          
          if (!fromTokenBalance || fromTokenBalance.amount < amount) {
            resolve(false);
            return;
          }
          
          fromTokenBalance.amount -= amount;
          
          if (!toWallet.tokenBalance) {
            toWallet.tokenBalance = [];
          }
          
          const toTokenBalance = toWallet.tokenBalance.find(t => t.symbol === token);
          
          if (toTokenBalance) {
            toTokenBalance.amount += amount;
          } else {
            toWallet.tokenBalance.push({
              symbol: token,
              amount: amount
            });
          }
          
          resolve(true);
        }
      }, 1500); // Simulate network delay
    });
  },
  
  // Environment deployment method
  deployFullEnvironment: (
    options: EnvironmentDeploymentOptions,
    walletAddress: string
  ): Promise<{ success: boolean; message: string }> => {
    console.log(`Deploying full environment with options:`, options);
    console.log(`Using wallet address: ${walletAddress}`);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simulate successful deployment
        resolve({
          success: true,
          message: "Environment deployed successfully to " + options.networkType
        });
      }, 3000); // Simulate network delay
    });
  },

  // Anchor CLI mock status methods
  setMockAnchorStatus: (enabled: boolean, version?: string): void => {
    console.log(`Setting mock anchor status: ${enabled}, version: ${version || 'N/A'}`);
    localStorage.setItem("mockAnchorEnabled", String(enabled));
    if (version) {
      localStorage.setItem("mockAnchorVersion", version);
    }
  },
  
  getMockAnchorStatus: (): { enabled: boolean; version?: string } => {
    const enabled = localStorage.getItem("mockAnchorEnabled") === "true";
    const version = localStorage.getItem("mockAnchorVersion") || undefined;
    return { enabled, version };
  },
};

export default integrationService;
