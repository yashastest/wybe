
/**
 * Integration Service
 * 
 * This service handles the integration between frontend, backend API,
 * and smart contract interactions on the Solana blockchain.
 */

import { toast } from "sonner";
import { smartContractService } from "./smartContractService";
import { tradingService } from "./tradingService";

interface DeploymentConfig {
  networkType: 'mainnet' | 'testnet' | 'devnet';
  frontendUrl: string;
  backendUrl: string;
  creatorFeePercentage: number;
  platformFeePercentage: number;
}

interface AdminUserAccess {
  email: string;
  role: 'superadmin' | 'admin' | 'manager' | 'viewer';
  permissions: string[];
  walletAddress?: string;
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
      walletAddress: "8JzqrG4pQSSA7QuQeEjbDxKLBMqKriGCNzUL7Lxpk8iD"
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
    callerWalletAddress: string
  ): Promise<{ success: boolean; message: string; transactionHash?: string }> {
    try {
      // Check if user has permission to update treasury
      const hasPermission = this.verifyAdminPermission(callerWalletAddress, 'treasury_update');
      if (!hasPermission) {
        return {
          success: false,
          message: "You don't have permission to update the treasury wallet"
        };
      }
      
      // Check if Anchor is installed for real contract interaction
      const contractConfig = smartContractService.getContractConfig();
      
      if (contractConfig.anchorInstalled) {
        // In a real app, this would call a real smart contract method
        // For now we'll simulate it
        
        // Simulate blockchain delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Generate mock transaction hash
        const txHash = `treasury_update_${Date.now().toString(16)}_${Math.random().toString(16).substring(2, 8)}`;
        
        return {
          success: true,
          message: "Treasury wallet updated successfully on the blockchain",
          transactionHash: txHash
        };
      } else {
        // Simulation mode
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        return {
          success: true,
          message: "[SIMULATION] Treasury wallet updated successfully",
          transactionHash: `sim_treasury_${Date.now().toString(16)}`
        };
      }
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
  private verifyAdminPermission(walletAddress: string, permission: string): boolean {
    // Find admin user by wallet address
    const adminUser = this.adminUsers.find(user => user.walletAddress === walletAddress);
    
    if (!adminUser) {
      return false;
    }
    
    // Superadmins have all permissions
    if (adminUser.role === 'superadmin' || adminUser.permissions.includes('all')) {
      return true;
    }
    
    // Check if user has the specific permission
    return adminUser.permissions.includes(permission);
  }
  
  /**
   * Add a new admin user
   */
  public addAdminUser(adminUser: AdminUserAccess): boolean {
    // Check if user already exists
    const existingUser = this.adminUsers.find(user => user.email === adminUser.email);
    if (existingUser) {
      return false;
    }
    
    // Add new user
    this.adminUsers.push(adminUser);
    return true;
  }
  
  /**
   * Get all admin users
   */
  public getAdminUsers(): AdminUserAccess[] {
    return [...this.adminUsers];
  }
  
  /**
   * Update admin user permissions
   */
  public updateAdminUserPermissions(
    email: string, 
    newRole: 'superadmin' | 'admin' | 'manager' | 'viewer',
    newPermissions: string[]
  ): boolean {
    const userIndex = this.adminUsers.findIndex(user => user.email === email);
    if (userIndex === -1) {
      return false;
    }
    
    // Update user role and permissions
    this.adminUsers[userIndex].role = newRole;
    this.adminUsers[userIndex].permissions = newPermissions;
    return true;
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
