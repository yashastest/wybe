
import { setMockAnchorStatus } from "@/scripts/anchorBuild";

// Types for admin user access
export type AdminAccessLevel = 'admin' | 'manager' | 'viewer';

export interface AdminUserAccess {
  id: string;
  email: string;
  name: string;
  role: string;
  accessLevel: AdminAccessLevel;
  permissions: string[];
  lastLogin?: string;
  isActive: boolean;
}

// Types for treasury wallets
export interface TreasuryWallet {
  id: string;
  name: string;
  address: string;
  balance: number;
  network: string;
  purpose: string;
  isActive: boolean;
  createdAt: string;
}

class IntegrationService {
  // Method to set mock Anchor status
  public setMockAnchorStatus(installed: boolean, version?: string): void {
    setMockAnchorStatus(installed, version);
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

  // Methods for admin user management
  public getAdminUsers(): Promise<AdminUserAccess[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const savedUsers = localStorage.getItem('adminUsers');
        const users = savedUsers ? JSON.parse(savedUsers) : [
          {
            id: '1',
            email: 'admin@wybe.finance',
            name: 'Admin User',
            role: 'Administrator',
            accessLevel: 'admin',
            permissions: ['read', 'write', 'deploy', 'manage_users'],
            lastLogin: new Date().toISOString(),
            isActive: true
          },
          {
            id: '2',
            email: 'manager@wybe.finance',
            name: 'Manager User',
            role: 'Manager',
            accessLevel: 'manager',
            permissions: ['read', 'write'],
            lastLogin: new Date().toISOString(),
            isActive: true
          }
        ];
        
        resolve(users);
      }, 500);
    });
  }
  
  public addAdminUser(user: Omit<AdminUserAccess, 'id'>): Promise<AdminUserAccess> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Get existing users
        const savedUsers = localStorage.getItem('adminUsers');
        const users = savedUsers ? JSON.parse(savedUsers) : [];
        
        // Create new user with ID
        const newUser = {
          ...user,
          id: `user_${Date.now()}`,
          lastLogin: new Date().toISOString(),
        };
        
        // Add to storage
        const updatedUsers = [...users, newUser];
        localStorage.setItem('adminUsers', JSON.stringify(updatedUsers));
        
        resolve(newUser);
      }, 800);
    });
  }
  
  public updateAdminUserPermissions(
    userId: string, 
    updates: Partial<AdminUserAccess>
  ): Promise<AdminUserAccess> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Get existing users
        const savedUsers = localStorage.getItem('adminUsers');
        const users = savedUsers ? JSON.parse(savedUsers) : [];
        
        // Find and update user
        const userIndex = users.findIndex((u: AdminUserAccess) => u.id === userId);
        
        if (userIndex === -1) {
          return reject(new Error('User not found'));
        }
        
        const updatedUser = { ...users[userIndex], ...updates };
        users[userIndex] = updatedUser;
        
        // Save updated users
        localStorage.setItem('adminUsers', JSON.stringify(users));
        
        resolve(updatedUser);
      }, 600);
    });
  }
  
  public removeAdminUser(userId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Get existing users
        const savedUsers = localStorage.getItem('adminUsers');
        const users = savedUsers ? JSON.parse(savedUsers) : [];
        
        // Filter out the user
        const updatedUsers = users.filter((u: AdminUserAccess) => u.id !== userId);
        
        // Save updated users
        localStorage.setItem('adminUsers', JSON.stringify(updatedUsers));
        
        resolve(true);
      }, 600);
    });
  }

  // Methods for treasury wallet management
  public getTreasuryWallets(): Promise<TreasuryWallet[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
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
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            name: 'Development Fund',
            address: 'Devh8H4L3sGjFNuaEDrH3JE6Uuy9ZdnHUEW9Pgjh4NM',
            balance: 58.42,
            network: 'mainnet',
            purpose: 'Development expenses',
            isActive: true,
            createdAt: new Date().toISOString()
          }
        ];
        
        resolve(wallets);
      }, 500);
    });
  }
  
  public addTreasuryWallet(wallet: Omit<TreasuryWallet, 'id' | 'createdAt'>): Promise<TreasuryWallet> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Get existing wallets
        const savedWallets = localStorage.getItem('treasuryWallets');
        const wallets = savedWallets ? JSON.parse(savedWallets) : [];
        
        // Create new wallet with ID
        const newWallet = {
          ...wallet,
          id: `wallet_${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        
        // Add to storage
        const updatedWallets = [...wallets, newWallet];
        localStorage.setItem('treasuryWallets', JSON.stringify(updatedWallets));
        
        resolve(newWallet);
      }, 800);
    });
  }
  
  public removeTreasuryWallet(walletId: string): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Get existing wallets
        const savedWallets = localStorage.getItem('treasuryWallets');
        const wallets = savedWallets ? JSON.parse(savedWallets) : [];
        
        // Filter out the wallet
        const updatedWallets = wallets.filter((w: TreasuryWallet) => w.id !== walletId);
        
        // Save updated wallets
        localStorage.setItem('treasuryWallets', JSON.stringify(updatedWallets));
        
        resolve(true);
      }, 600);
    });
  }
  
  public transferBetweenTreasuryWallets(
    fromId: string,
    toId: string,
    amount: number
  ): Promise<{ success: boolean; newBalances: { fromBalance: number; toBalance: number } }> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Get existing wallets
        const savedWallets = localStorage.getItem('treasuryWallets');
        const wallets = savedWallets ? JSON.parse(savedWallets) : [];
        
        // Find source and destination wallets
        const sourceIdx = wallets.findIndex((w: TreasuryWallet) => w.id === fromId);
        const destIdx = wallets.findIndex((w: TreasuryWallet) => w.id === toId);
        
        if (sourceIdx === -1 || destIdx === -1) {
          return reject(new Error('Wallet not found'));
        }
        
        const sourceWallet = wallets[sourceIdx];
        
        // Check if source has enough balance
        if (sourceWallet.balance < amount) {
          return reject(new Error('Insufficient balance'));
        }
        
        // Update balances
        wallets[sourceIdx].balance -= amount;
        wallets[destIdx].balance += amount;
        
        // Save updated wallets
        localStorage.setItem('treasuryWallets', JSON.stringify(wallets));
        
        resolve({ 
          success: true, 
          newBalances: {
            fromBalance: wallets[sourceIdx].balance,
            toBalance: wallets[destIdx].balance
          }
        });
      }, 1000);
    });
  }
}

// Export singleton instance
export const integrationService = new IntegrationService();
export default integrationService;
