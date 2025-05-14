
/**
 * Integration Service
 * 
 * This service handles the integration between frontend, backend API,
 * and smart contract interactions on the Solana blockchain.
 */

import { toast } from "sonner";
import { smartContractService } from "./smartContractService";
import { tradingService } from "./tradingService";
import { treasuryService } from "./treasuryService";

interface DeploymentConfig {
  networkType: 'mainnet' | 'testnet' | 'devnet';
  frontendUrl: string;
  backendUrl: string;
  creatorFeePercentage: number;
  platformFeePercentage: number;
}

export interface AdminUserAccess {
  email: string;
  role: 'superadmin' | 'admin' | 'manager' | 'viewer';
  permissions: string[];
  walletAddress?: string;
  lastLogin?: Date;
  twoFactorEnabled: boolean;
}

class IntegrationService {
  private defaultConfig: DeploymentConfig = {
    networkType: 'devnet', // Default to devnet for safety
    frontendUrl: 'https://app.wybe.finance',
    backendUrl: 'https://api.wybe.finance',
    creatorFeePercentage: 2.5,
    platformFeePercentage: 2.5
  };

  private adminUsers: AdminUserAccess[] = [
    {
      email: "wybefun@gmail.com",
      role: 'superadmin',
      permissions: ['all'],
      walletAddress: "8JzqrG4pQSSA7QuQeEjbDxKLBMqKriGCNzUL7Lxpk8iD",
      lastLogin: new Date(),
      twoFactorEnabled: true
    }
  ];
  
  /**
   * Deploy a complete environment including frontend, backend, and smart contract
   */
  public async deployFullEnvironment(
    config: Partial<DeploymentConfig> = {},
    walletAddress: string
  ): Promise<{ success: boolean; message: string; urls?: { frontend: string, backend: string, explorer: string } }> {
    
    // Merge with default config
    const deploymentConfig = { ...this.defaultConfig, ...config };
    
    try {
      // First, verify that the caller has permission
      if (!this.isAuthorizedForAction(walletAddress, 'deploy_environment')) {
        return {
          success: false,
          message: "You don't have permission to deploy the full environment"
        };
      }
      
      // 1. Set network type in trading service
      tradingService.setNetworkType(deploymentConfig.networkType);
      
      // 2. Update deployment environment URLs
      tradingService.updateDeploymentEnvironment({
        frontendUrl: deploymentConfig.frontendUrl,
        backendUrl: deploymentConfig.backendUrl,
      });
      
      // 3. Update contract config
      smartContractService.updateContractConfig({
        creatorFeePercentage: deploymentConfig.creatorFeePercentage,
        platformFeePercentage: deploymentConfig.platformFeePercentage,
        networkType: deploymentConfig.networkType
      });
      
      // 4. Log deployment (in real app, this would trigger actual deployment processes)
      console.log("Deploying environment with config:", deploymentConfig);
      console.log("Deploying for wallet:", walletAddress);
      
      // Check if Anchor is installed before proceeding
      const contractConfig = smartContractService.getContractConfig();
      if (!contractConfig.anchorInstalled) {
        toast.warning("Anchor CLI not detected. Smart contracts will be simulated.");
      } else {
        toast.info(`Using Anchor ${contractConfig.anchorVersion} for real contract deployment`);
      }
      
      // Simulate deployment process
      toast.info("Starting deployment process...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.info("Configuring smart contracts...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.info("Setting up backend services...");
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.info("Deploying frontend application...");
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get the deployment environment details
      const env = tradingService.getDeploymentEnvironment();
      
      return {
        success: true,
        message: "Environment deployed successfully!",
        urls: {
          frontend: env.frontendUrl,
          backend: env.backendUrl,
          explorer: env.explorerUrl
        }
      };
    } catch (error) {
      console.error("Error deploying environment:", error);
      return {
        success: false,
        message: "Failed to deploy environment. Please check the console for details."
      };
    }
  }
  
  /**
   * Deploy a new token and register it with both the backend and smart contract
   */
  public async deployToken(
    name: string,
    symbol: string,
    initialSupply: number,
    creatorAddress: string
  ): Promise<{ success: boolean; message: string; contractAddress?: string; programId?: string }> {
    try {
      // Verify the user has permission to deploy tokens
      if (!this.isAuthorizedForAction(creatorAddress, 'deploy_token')) {
        return {
          success: false,
          message: "You don't have permission to deploy tokens"
        };
      }
      
      // Check if Anchor is installed
      const contractConfig = smartContractService.getContractConfig();
      let contractResult;
      
      if (contractConfig.anchorInstalled) {
        // 1. Deploy the token via real smart contract service
        contractResult = await smartContractService.deployTokenContract(
          name,
          symbol,
          initialSupply,
          creatorAddress
        );
      } else {
        // Fallback to simulation if Anchor is not installed
        toast.warning("Anchor not detected. Using simulation mode.");
        contractResult = await smartContractService.simulateTokenDeployment(
          name,
          symbol,
          initialSupply,
          creatorAddress
        );
      }
      
      if (!contractResult.success) {
        return contractResult;
      }
      
      // 2. Register the token with the trading service
      const tradingResult = await tradingService.deployToken(
        symbol,
        name,
        creatorAddress,
        initialSupply
      );
      
      return {
        success: true,
        message: `${name} (${symbol}) deployed successfully!`,
        contractAddress: tradingResult.contractAddress || contractResult.txHash,
        programId: contractResult.programId
      };
    } catch (error) {
      console.error("Error deploying token:", error);
      return {
        success: false,
        message: "Failed to deploy token. Please try again."
      };
    }
  }
  
  /**
   * Update treasury wallet address in smart contracts
   */
  public async updateTreasuryWallet(
    newTreasuryWallet: string,
    callerWalletAddress: string,
    otpVerified: boolean = false
  ): Promise<{ success: boolean; message: string; transactionHash?: string }> {
    try {
      // Check if user has permission to update treasury
      const hasPermission = this.isAuthorizedForAction(callerWalletAddress, 'treasury_update');
      if (!hasPermission) {
        return {
          success: false,
          message: "You don't have permission to update the treasury wallet"
        };
      }
      
      // Verify OTP for high-security operations
      if (!otpVerified) {
        return {
          success: false,
          message: "OTP verification required for this operation"
        };
      }
      
      // Update treasury using the treasury service
      const treasuryResult = await treasuryService.updateTreasuryWallet(
        newTreasuryWallet, 
        callerWalletAddress,
        otpVerified
      );
      
      // If successful, also update in the smart contract service
      if (treasuryResult.success) {
        smartContractService.updateContractConfig({
          treasuryAddress: newTreasuryWallet
        });
      }
      
      return treasuryResult;
    } catch (error) {
      console.error("Error updating treasury wallet:", error);
      return {
        success: false,
        message: `Failed to update treasury wallet: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
  
  /**
   * Verify if a user has specific admin permission
   */
  public isAuthorizedForAction(walletAddress: string, permission: string): boolean {
    if (!walletAddress) return false;
    
    // Find admin user by wallet address
    const adminUser = this.adminUsers.find(user => user.walletAddress === walletAddress);
    
    if (!adminUser) {
      return false;
    }
    
    // Superadmins have all permissions
    if (adminUser.role === 'superadmin' || adminUser.permissions.includes('all')) {
      return true;
    }
    
    // Role-based authorization
    if (permission === 'treasury_update') {
      // Only superadmin and admin can update treasury
      return ['superadmin', 'admin'].includes(adminUser.role);
    }
    
    if (permission === 'deploy_environment') {
      // Only superadmin can deploy the full environment
      return adminUser.role === 'superadmin';
    }
    
    if (permission === 'deploy_token') {
      // Superadmin, admin and manager can deploy tokens
      return ['superadmin', 'admin', 'manager'].includes(adminUser.role);
    }
    
    if (permission === 'view_analytics') {
      // All roles can view analytics
      return true;
    }
    
    // Check if user has the specific permission
    return adminUser.permissions.includes(permission);
  }
  
  /**
   * Add a new admin user
   */
  public addAdminUser(adminUser: AdminUserAccess, callerWalletAddress: string): boolean {
    // Check if caller has permission to manage users
    if (!this.isAuthorizedForAction(callerWalletAddress, 'manage_users')) {
      toast.error("You don't have permission to manage users");
      return false;
    }
    
    // Check if user already exists
    const existingUser = this.adminUsers.find(user => user.email === adminUser.email);
    if (existingUser) {
      toast.error("User with this email already exists");
      return false;
    }
    
    // Add new user
    this.adminUsers.push(adminUser);
    toast.success(`User ${adminUser.email} added successfully`);
    return true;
  }
  
  /**
   * Get all admin users
   */
  public getAdminUsers(callerWalletAddress: string): AdminUserAccess[] | null {
    // Check if caller has permission to view users
    if (!this.isAuthorizedForAction(callerWalletAddress, 'view_users')) {
      return null;
    }
    
    return [...this.adminUsers];
  }
  
  /**
   * Update admin user permissions
   */
  public updateAdminUserPermissions(
    email: string,
    newRole: 'superadmin' | 'admin' | 'manager' | 'viewer',
    newPermissions: string[],
    callerWalletAddress: string
  ): boolean {
    // Check if caller has permission to manage users
    if (!this.isAuthorizedForAction(callerWalletAddress, 'manage_users')) {
      toast.error("You don't have permission to manage users");
      return false;
    }
    
    // Find the caller's role
    const caller = this.adminUsers.find(user => user.walletAddress === callerWalletAddress);
    if (!caller) {
      toast.error("Caller not found in admin users");
      return false;
    }
    
    // Only superadmins can create other superadmins
    if (newRole === 'superadmin' && caller.role !== 'superadmin') {
      toast.error("Only superadmins can assign the superadmin role");
      return false;
    }
    
    const userIndex = this.adminUsers.findIndex(user => user.email === email);
    if (userIndex === -1) {
      toast.error("User not found");
      return false;
    }
    
    // Update user role and permissions
    this.adminUsers[userIndex].role = newRole;
    this.adminUsers[userIndex].permissions = newPermissions;
    toast.success(`User ${email} role updated to ${newRole}`);
    return true;
  }
  
  /**
   * Remove an admin user
   */
  public removeAdminUser(email: string, callerWalletAddress: string): boolean {
    // Check if caller has permission to manage users
    if (!this.isAuthorizedForAction(callerWalletAddress, 'manage_users')) {
      toast.error("You don't have permission to manage users");
      return false;
    }
    
    // Can't remove yourself
    const caller = this.adminUsers.find(user => user.walletAddress === callerWalletAddress);
    if (caller?.email === email) {
      toast.error("You cannot remove yourself");
      return false;
    }
    
    const initialLength = this.adminUsers.length;
    this.adminUsers = this.adminUsers.filter(user => user.email !== email);
    
    if (this.adminUsers.length < initialLength) {
      toast.success(`User ${email} removed successfully`);
      return true;
    } else {
      toast.error(`User ${email} not found`);
      return false;
    }
  }
  
  /**
   * Check if the browser has a compatible wallet provider installed
   */
  public isWalletAvailable(): boolean {
    return !!window.solana;
  }
  
  /**
   * Get the deployment documentation URL
   */
  public getDeploymentDocsUrl(): string {
    return "https://docs.wybe.finance/deployment-guide";
  }
  
  /**
   * Check if Anchor CLI is installed
   */
  public isAnchorInstalled(): boolean {
    const contractConfig = smartContractService.getContractConfig();
    return contractConfig.anchorInstalled;
  }
  
  /**
   * Get Anchor version if installed
   */
  public getAnchorVersion(): string | undefined {
    const contractConfig = smartContractService.getContractConfig();
    return contractConfig.anchorVersion;
  }
  
  /**
   * Set mock Anchor installation status (for development testing in browser)
   */
  public setMockAnchorStatus(isInstalled: boolean, version?: string): void {
    localStorage.setItem('anchorInstalled', isInstalled.toString());
    if (version) {
      localStorage.setItem('anchorVersion', version);
    }
    
    // Refresh the service's status
    smartContractService.updateContractConfig({
      anchorInstalled: isInstalled,
      anchorVersion: version
    });
  }
}

// Export singleton instance
export const integrationService = new IntegrationService();
export default integrationService;
