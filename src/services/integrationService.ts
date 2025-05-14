
import { setMockAnchorStatus } from "@/scripts/anchorBuild";

// Types for admin user access
export type AdminUserAccess = {
  id?: string;
  email: string;
  name?: string;
  role: 'superadmin' | 'admin' | 'manager' | 'viewer';
  accessLevel?: 'admin' | 'manager' | 'viewer';
  permissions: string[];
  lastLogin?: string;
  isActive?: boolean;
  walletAddress?: string;
  twoFactorEnabled?: boolean;
};

// Types for treasury wallets
export interface TreasuryWallet {
  id: string;
  name: string;
  address: string;
  balance: number;
  network?: string;
  purpose?: string;
  isActive?: boolean;
  createdAt?: string;
  isMultisig?: boolean;
  signers?: string[];
  threshold?: number;
  tokenBalance?: {
    symbol: string;
    amount: number;
  }[];
}

// Interface for deployment checklist items
interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

// Interface for environment deployment options
interface DeploymentOptions {
  networkType: 'mainnet' | 'testnet' | 'devnet';
  frontendUrl?: string;
  backendUrl?: string;
  creatorFeePercentage?: number;
  platformFeePercentage?: number;
}

class IntegrationService {
  // Method to set mock Anchor status
  public setMockAnchorStatus(installed: boolean, version?: string): void {
    setMockAnchorStatus(installed, version);
  }

  // Method to get deployment checklist
  public getDeploymentChecklist(): ChecklistItem[] {
    try {
      const checklistString = localStorage.getItem('deploymentChecklist');
      return checklistString ? JSON.parse(checklistString) : [];
    } catch (error) {
      console.error('Error getting checklist:', error);
      return [];
    }
  }

  // Method to update a checklist item
  public updateChecklistItem(itemId: string, checked: boolean): void {
    try {
      const checklistString = localStorage.getItem('deploymentChecklist');
      const checklist = checklistString ? JSON.parse(checklistString) : [];
      
      const updatedChecklist = checklist.map((item: any) => 
        item.id === itemId ? { ...item, checked } : item
      );
      
      localStorage.setItem('deploymentChecklist', JSON.stringify(updatedChecklist));
    } catch (error) {
      console.error('Error updating checklist item:', error);
    }
  }

  // Deploy full environment with options
  public deployFullEnvironment(options: DeploymentOptions, walletAddress: string): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Store the deployment information
        localStorage.setItem('deploymentOptions', JSON.stringify(options));
        localStorage.setItem('deploymentWallet', walletAddress);
        localStorage.setItem('environmentDeployed', 'true');
        
        resolve({ 
          success: true, 
          message: "Environment deployed successfully" 
        });
      }, 2000);
    });
  }

  // Methods for admin user management
  public getAdminUsers(walletAddress?: string): AdminUserAccess[] {
    try {
      const savedUsers = localStorage.getItem('adminUsers');
      const users = savedUsers ? JSON.parse(savedUsers) : [
        {
          id: '1',
          email: 'admin@wybe.finance',
          name: 'Admin User',
          role: 'superadmin',
          permissions: ['all'],
          lastLogin: new Date().toISOString(),
          isActive: true,
          walletAddress: walletAddress || ''
        },
        {
          id: '2',
          email: 'manager@wybe.finance',
          name: 'Manager User',
          role: 'manager',
          permissions: ['analytics_view', 'token_creation'],
          lastLogin: new Date().toISOString(),
          isActive: true
        }
      ];
      
      return users;
    } catch (error) {
      console.error("Error getting admin users:", error);
      return [];
    }
  }
  
  public addAdminUser(user: AdminUserAccess, walletAddress?: string): boolean {
    try {
      // Get existing users
      const users = this.getAdminUsers();
      
      // Check if user with this email already exists
      if (users.some(u => u.email === user.email)) {
        return false;
      }
      
      // Create new user with ID
      const newUser = {
        ...user,
        id: `user_${Date.now()}`,
        lastLogin: new Date().toISOString(),
        isActive: true,
      };
      
      // Add to storage
      const updatedUsers = [...users, newUser];
      localStorage.setItem('adminUsers', JSON.stringify(updatedUsers));
      
      return true;
    } catch (error) {
      console.error("Error adding admin user:", error);
      return false;
    }
  }
  
  public updateAdminUserPermissions(
    email: string, 
    role: string,
    permissions: string[],
    walletAddress?: string
  ): boolean {
    try {
      // Get existing users
      const users = this.getAdminUsers();
      
      // Find and update user
      const userIndex = users.findIndex(u => u.email === email);
      
      if (userIndex === -1) {
        return false;
      }
      
      // Update user properties
      users[userIndex].role = role as AdminUserAccess['role'];
      users[userIndex].permissions = permissions;
      
      // Save updated users
      localStorage.setItem('adminUsers', JSON.stringify(users));
      
      return true;
    } catch (error) {
      console.error("Error updating admin user:", error);
      return false;
    }
  }
  
  public removeAdminUser(email: string, walletAddress?: string): boolean {
    try {
      // Get existing users
      const users = this.getAdminUsers();
      
      // Check if removing the last superadmin
      if (users.length <= 1) {
        return false;
      }
      
      // Filter out the user
      const updatedUsers = users.filter(u => u.email !== email);
      
      // Save updated users
      localStorage.setItem('adminUsers', JSON.stringify(updatedUsers));
      
      return true;
    } catch (error) {
      console.error("Error removing admin user:", error);
      return false;
    }
  }

  // Methods for treasury wallet management
  public getTreasuryWallets(walletAddress?: string): TreasuryWallet[] {
    try {
      const savedWallets = localStorage.getItem('treasuryWallets');
      const wallets = savedWallets ? JSON.parse(savedWallets) : [
        {
          id: '1',
          name: 'Main Treasury',
          address: '8JzqrG4pQSSA7QuQeEjbDxKLBMqKriGCNzUL7Lxpk8iD',
          balance: 145.75,
          network: 'mainnet',
          purpose: 'Platform fees',
          isActive: true,
          createdAt: new Date().toISOString(),
          isMultisig: true,
          signers: [
            '8JzqrG4pQSSA7QuQeEjbDxKLBMqKriGCNzUL7Lxpk8iD',
            '6Ks2e5vLt8bj9X3sBnMuKVnGWFxh5SbZuKeRYzKVtEGk'
          ],
          threshold: 2,
          tokenBalance: [
            { symbol: 'USDC', amount: 12500 },
            { symbol: 'WYBE', amount: 25000 }
          ]
        },
        {
          id: '2',
          name: 'Development Fund',
          address: 'Devh8H4L3sGjFNuaEDrH3JE6Uuy9ZdnHUEW9Pgjh4NM',
          balance: 58.42,
          network: 'mainnet',
          purpose: 'Development expenses',
          isActive: true,
          createdAt: new Date().toISOString(),
          isMultisig: false,
          tokenBalance: [
            { symbol: 'USDC', amount: 4200 }
          ]
        }
      ];
      
      return wallets;
    } catch (error) {
      console.error("Error getting treasury wallets:", error);
      return [];
    }
  }
  
  public addTreasuryWallet(wallet: TreasuryWallet, walletAddress?: string): boolean {
    try {
      // Get existing wallets
      const wallets = this.getTreasuryWallets();
      
      // Check if wallet with this address already exists
      if (wallets.some(w => w.address === wallet.address)) {
        return false;
      }
      
      // Add to storage
      const updatedWallets = [...wallets, wallet];
      localStorage.setItem('treasuryWallets', JSON.stringify(updatedWallets));
      
      return true;
    } catch (error) {
      console.error("Error adding treasury wallet:", error);
      return false;
    }
  }
  
  public removeTreasuryWallet(walletId: string, walletAddress?: string): boolean {
    try {
      // Get existing wallets
      const wallets = this.getTreasuryWallets();
      
      // Filter out the wallet
      const updatedWallets = wallets.filter(w => w.id !== walletId);
      
      // Save updated wallets
      localStorage.setItem('treasuryWallets', JSON.stringify(updatedWallets));
      
      return true;
    } catch (error) {
      console.error("Error removing treasury wallet:", error);
      return false;
    }
  }
  
  public transferBetweenTreasuryWallets(
    fromId: string,
    toId: string,
    amount: number,
    token: string = 'SOL',
    walletAddress?: string
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          // Get existing wallets
          const wallets = this.getTreasuryWallets();
          
          // Find source and destination wallets
          const sourceIdx = wallets.findIndex(w => w.id === fromId);
          const destIdx = wallets.findIndex(w => w.id === toId);
          
          if (sourceIdx === -1 || destIdx === -1) {
            resolve(false);
            return;
          }
          
          // Handle different token types
          if (token === 'SOL') {
            // Check if source has enough balance
            if (wallets[sourceIdx].balance < amount) {
              resolve(false);
              return;
            }
            
            // Update balances
            wallets[sourceIdx].balance -= amount;
            wallets[destIdx].balance += amount;
          } else {
            // Handle token transfers (USDC, WYBE, etc.)
            const sourceTokenIdx = wallets[sourceIdx].tokenBalance?.findIndex(t => t.symbol === token) ?? -1;
            
            if (sourceTokenIdx === -1 || 
               !wallets[sourceIdx].tokenBalance || 
               wallets[sourceIdx].tokenBalance[sourceTokenIdx].amount < amount) {
              resolve(false);
              return;
            }
            
            // Reduce source token amount
            wallets[sourceIdx].tokenBalance![sourceTokenIdx].amount -= amount;
            
            // Add to destination token balance
            const destTokenIdx = wallets[destIdx].tokenBalance?.findIndex(t => t.symbol === token) ?? -1;
            
            if (destTokenIdx !== -1 && wallets[destIdx].tokenBalance) {
              wallets[destIdx].tokenBalance[destTokenIdx].amount += amount;
            } else {
              // Create token balance if it doesn't exist
              if (!wallets[destIdx].tokenBalance) {
                wallets[destIdx].tokenBalance = [];
              }
              wallets[destIdx].tokenBalance.push({ symbol: token, amount });
            }
          }
          
          // Save updated wallets
          localStorage.setItem('treasuryWallets', JSON.stringify(wallets));
          
          resolve(true);
        } catch (error) {
          console.error("Error during transfer:", error);
          resolve(false);
        }
      }, 1000);
    });
  }
}

// Export singleton instance
export const integrationService = new IntegrationService();
export default integrationService;
