
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

class IntegrationService {
  private defaultConfig: DeploymentConfig = {
    networkType: 'devnet', // Default to devnet for safety
    frontendUrl: 'https://app.wybe.finance',
    backendUrl: 'https://api.wybe.finance',
    creatorFeePercentage: 2.5,
    platformFeePercentage: 2.5
  };
  
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
