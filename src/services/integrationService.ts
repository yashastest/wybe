
// Integration service to handle all third-party integrations
import { toast } from "sonner";
import { setMockAnchorStatus } from "@/scripts/anchorBuild";

// Types for environment deployment
export interface EnvironmentConfig {
  networkType: 'mainnet' | 'testnet' | 'devnet';
  frontendUrl?: string;
  backendUrl?: string;
  creatorFeePercentage?: number;
  platformFeePercentage?: number;
}

// Treasury wallet type
export interface TreasuryWallet {
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

// Admin user access type
export interface AdminUserAccess {
  email: string;
  role: 'superadmin' | 'admin' | 'manager' | 'viewer';
  permissions: string[];
  walletAddress?: string;
  twoFactorEnabled?: boolean;
}

class IntegrationService {
  /**
   * Set mock Anchor status for testing
   */
  public setMockAnchorStatus(enabled: boolean, version?: string): void {
    setMockAnchorStatus(enabled, version);
    
    // Update local storage
    localStorage.setItem('anchorInstalled', enabled.toString());
    if (version) {
      localStorage.setItem('anchorVersion', version);
    } else if (!enabled) {
      localStorage.removeItem('anchorVersion');
    }
    
    console.log(`Mock Anchor CLI ${enabled ? 'enabled' : 'disabled'}, version: ${version || 'none'}`);
  }
  
  /**
   * Deploy full environment (frontend, backend, contracts)
   */
  public async deployFullEnvironment(
    config: EnvironmentConfig,
    walletAddress: string
  ): Promise<{ success: boolean; message: string; txHash?: string }> {
    console.log("Deploying full environment with config:", config);
    console.log("Using wallet:", walletAddress);
    
    try {
      // Simulate environment deployment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock txHash
      const txHash = `env_${Date.now().toString(16)}_${Math.random().toString(16).substring(2, 8)}`;
      
      // Store deployment info
      localStorage.setItem('environmentDeployed', 'true');
      localStorage.setItem('environmentNetwork', config.networkType);
      localStorage.setItem('environmentWallet', walletAddress);
      localStorage.setItem('environmentFrontendUrl', config.frontendUrl || 'https://app.wybe.finance');
      localStorage.setItem('environmentBackendUrl', config.backendUrl || 'https://api.wybe.finance');
      
      // Update deployment checklist
      this.updateChecklistItem('anchor', true);
      this.updateChecklistItem('wallet', true);
      this.updateChecklistItem('security', true);
      
      return {
        success: true,
        message: `Environment successfully deployed to ${config.networkType}`,
        txHash
      };
    } catch (error) {
      console.error("Environment deployment error:", error);
      return {
        success: false,
        message: `Failed to deploy environment: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
  
  /**
   * Update a deployment checklist item
   */
  public updateChecklistItem(id: string, checked: boolean): void {
    try {
      const checklistString = localStorage.getItem('deploymentChecklist');
      const checklist = checklistString ? JSON.parse(checklistString) : [
        { id: 'anchor', label: 'Anchor CLI is installed and configured', checked: false },
        { id: 'wallet', label: 'Wallet is connected and has sufficient SOL', checked: false },
        { id: 'contract', label: 'Smart contract code is finalized', checked: false },
        { id: 'treasury', label: 'Treasury wallet is configured', checked: false },
        { id: 'fees', label: 'Creator and platform fees are set', checked: true },
        { id: 'security', label: 'Security audit is complete', checked: false }
      ];
      
      const updatedChecklist = checklist.map((item: any) => 
        item.id === id ? {...item, checked} : item
      );
      
      localStorage.setItem('deploymentChecklist', JSON.stringify(updatedChecklist));
    } catch (error) {
      console.error("Error updating checklist item:", error);
    }
  }
  
  /**
   * Get the deployment checklist
   */
  public getDeploymentChecklist(): any[] {
    try {
      const checklistString = localStorage.getItem('deploymentChecklist');
      if (checklistString) {
        return JSON.parse(checklistString);
      }
      
      // Default checklist
      const defaultChecklist = [
        { id: 'anchor', label: 'Anchor CLI is installed and configured', checked: false },
        { id: 'wallet', label: 'Wallet is connected and has sufficient SOL', checked: false },
        { id: 'contract', label: 'Smart contract code is finalized', checked: false },
        { id: 'treasury', label: 'Treasury wallet is configured', checked: false },
        { id: 'fees', label: 'Creator and platform fees are set', checked: true },
        { id: 'security', label: 'Security audit is complete', checked: false }
      ];
      
      localStorage.setItem('deploymentChecklist', JSON.stringify(defaultChecklist));
      return defaultChecklist;
    } catch (error) {
      console.error("Error getting checklist:", error);
      return [];
    }
  }

  /**
   * Get admin users for a given wallet
   */
  public getAdminUsers(walletAddress: string): AdminUserAccess[] {
    try {
      const usersString = localStorage.getItem(`adminUsers_${walletAddress}`);
      if (usersString) {
        return JSON.parse(usersString);
      }
      
      // Create default admin user if none exist
      const defaultUsers = [
        {
          email: 'admin@wybe.finance',
          role: 'superadmin',
          permissions: ['all'],
          walletAddress: walletAddress,
          twoFactorEnabled: false
        }
      ] as AdminUserAccess[];
      
      localStorage.setItem(`adminUsers_${walletAddress}`, JSON.stringify(defaultUsers));
      return defaultUsers;
    } catch (error) {
      console.error("Error getting admin users:", error);
      return [];
    }
  }

  /**
   * Add a new admin user
   */
  public addAdminUser(user: AdminUserAccess, walletAddress: string): boolean {
    try {
      const users = this.getAdminUsers(walletAddress);
      
      // Check if email already exists
      if (users.some(u => u.email === user.email)) {
        return false;
      }
      
      users.push(user);
      localStorage.setItem(`adminUsers_${walletAddress}`, JSON.stringify(users));
      return true;
    } catch (error) {
      console.error("Error adding admin user:", error);
      return false;
    }
  }

  /**
   * Update admin user permissions
   */
  public updateAdminUserPermissions(
    email: string,
    role: AdminUserAccess['role'],
    permissions: string[],
    walletAddress: string
  ): boolean {
    try {
      const users = this.getAdminUsers(walletAddress);
      const updatedUsers = users.map(user => 
        user.email === email ? { ...user, role, permissions } : user
      );
      
      localStorage.setItem(`adminUsers_${walletAddress}`, JSON.stringify(updatedUsers));
      return true;
    } catch (error) {
      console.error("Error updating admin user permissions:", error);
      return false;
    }
  }

  /**
   * Remove an admin user
   */
  public removeAdminUser(email: string, walletAddress: string): boolean {
    try {
      const users = this.getAdminUsers(walletAddress);
      
      // Don't remove the last superadmin
      const remainingSuperadmins = users.filter(u => u.role === 'superadmin' && u.email !== email);
      if (users.find(u => u.email === email)?.role === 'superadmin' && remainingSuperadmins.length === 0) {
        toast.error("Cannot remove the last superadmin");
        return false;
      }
      
      const filteredUsers = users.filter(user => user.email !== email);
      localStorage.setItem(`adminUsers_${walletAddress}`, JSON.stringify(filteredUsers));
      return true;
    } catch (error) {
      console.error("Error removing admin user:", error);
      return false;
    }
  }

  /**
   * Get treasury wallets
   */
  public async getTreasuryWallets(walletAddress: string): Promise<TreasuryWallet[]> {
    try {
      const walletsString = localStorage.getItem(`treasuryWallets_${walletAddress}`);
      if (walletsString) {
        return JSON.parse(walletsString);
      }
      
      // Create default treasury wallet if none exist
      const defaultWallets = [
        {
          id: 'wallet-default',
          name: 'Main Treasury',
          address: walletAddress,
          balance: 100,
          tokenBalance: [
            { symbol: 'WYBE', amount: 1000000 },
            { symbol: 'USDC', amount: 5000 }
          ],
          isMultisig: false
        },
        {
          id: 'wallet-multisig',
          name: 'Security Reserve',
          address: 'Wyb222222222222222222222222222222222222222',
          balance: 250,
          tokenBalance: [
            { symbol: 'WYBE', amount: 5000000 }
          ],
          isMultisig: true,
          signers: [
            walletAddress,
            'FkGFCvYkW13Nfx42UcCgJhfRSRuJD2rQHBKgKBhZMJcb',
            'CGZQ9JhweWJ6RprQUQgVoPe8mWM1YJzUcGrqpvZT6i8c'
          ],
          threshold: 2
        }
      ] as TreasuryWallet[];
      
      localStorage.setItem(`treasuryWallets_${walletAddress}`, JSON.stringify(defaultWallets));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return defaultWallets;
    } catch (error) {
      console.error("Error getting treasury wallets:", error);
      return [];
    }
  }

  /**
   * Add a new treasury wallet
   */
  public async addTreasuryWallet(wallet: TreasuryWallet, walletAddress: string): Promise<boolean> {
    try {
      const wallets = await this.getTreasuryWallets(walletAddress);
      
      // Check if address already exists
      if (wallets.some(w => w.address === wallet.address)) {
        return false;
      }
      
      wallets.push(wallet);
      localStorage.setItem(`treasuryWallets_${walletAddress}`, JSON.stringify(wallets));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return true;
    } catch (error) {
      console.error("Error adding treasury wallet:", error);
      return false;
    }
  }

  /**
   * Remove a treasury wallet
   */
  public async removeTreasuryWallet(id: string, walletAddress: string): Promise<boolean> {
    try {
      const wallets = await this.getTreasuryWallets(walletAddress);
      const filteredWallets = wallets.filter(wallet => wallet.id !== id);
      
      localStorage.setItem(`treasuryWallets_${walletAddress}`, JSON.stringify(filteredWallets));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      return true;
    } catch (error) {
      console.error("Error removing treasury wallet:", error);
      return false;
    }
  }

  /**
   * Transfer funds between treasury wallets
   */
  public async transferBetweenTreasuryWallets(
    fromWalletId: string,
    toWalletId: string,
    amount: number,
    token: string,
    walletAddress: string
  ): Promise<boolean> {
    try {
      const wallets = await this.getTreasuryWallets(walletAddress);
      
      const fromIndex = wallets.findIndex(w => w.id === fromWalletId);
      const toIndex = wallets.findIndex(w => w.id === toWalletId);
      
      if (fromIndex === -1 || toIndex === -1) {
        return false;
      }
      
      if (token === 'SOL') {
        // Ensure there are sufficient funds
        if (wallets[fromIndex].balance < amount) {
          toast.error("Insufficient SOL balance for transfer");
          return false;
        }
        
        // Update SOL balances
        wallets[fromIndex].balance -= amount;
        wallets[toIndex].balance += amount;
      } else {
        // Find token in from wallet
        const fromTokenIndex = wallets[fromIndex].tokenBalance?.findIndex(t => t.symbol === token) ?? -1;
        
        if (fromTokenIndex === -1 || !wallets[fromIndex].tokenBalance) {
          toast.error(`No ${token} tokens in source wallet`);
          return false;
        }
        
        // Ensure there are sufficient tokens
        if (wallets[fromIndex].tokenBalance[fromTokenIndex].amount < amount) {
          toast.error(`Insufficient ${token} balance for transfer`);
          return false;
        }
        
        // Update token balances
        wallets[fromIndex].tokenBalance[fromTokenIndex].amount -= amount;
        
        // Find or create token in to wallet
        if (!wallets[toIndex].tokenBalance) {
          wallets[toIndex].tokenBalance = [];
        }
        
        const toTokenIndex = wallets[toIndex].tokenBalance.findIndex(t => t.symbol === token);
        
        if (toTokenIndex === -1) {
          wallets[toIndex].tokenBalance.push({ symbol: token, amount });
        } else {
          wallets[toIndex].tokenBalance[toTokenIndex].amount += amount;
        }
      }
      
      localStorage.setItem(`treasuryWallets_${walletAddress}`, JSON.stringify(wallets));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      return true;
    } catch (error) {
      console.error("Error transferring between treasury wallets:", error);
      return false;
    }
  }
}

// Export a singleton instance
export const integrationService = new IntegrationService();
export default integrationService;
