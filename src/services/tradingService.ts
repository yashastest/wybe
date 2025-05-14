
// Trading Service for managing coin trading and market cap functionality

export interface CoinMarketCapConfig {
  dexscreenerEnabled: boolean;
  dexscreenerThreshold: number;
  creatorFeePercentage: number;
  rewardClaimPeriod: number; // In days
  deploymentUrl?: string; // Public URL for the deployment
}

export interface TokenTradingStatus {
  symbol: string;
  listedOnDexscreener: boolean;
  marketCap: number;
  lastClaimDate?: Date;
  nextClaimAvailable?: Date;
  contractAddress?: string; // Solana contract address
  deploymentStatus?: 'pending' | 'deployed' | 'failed';
  creator?: string; // Creator wallet address
}

export interface DeploymentEnvironment {
  frontendUrl: string;
  backendUrl: string;
  explorerUrl: string;
  networkType: 'mainnet' | 'testnet' | 'devnet';
}

class TradingService {
  private config: CoinMarketCapConfig = {
    dexscreenerEnabled: true,
    dexscreenerThreshold: 50000, // $50,000 threshold
    creatorFeePercentage: 2.5,    // 2.5% creator fee
    rewardClaimPeriod: 5,        // 5 days between claims
    deploymentUrl: 'https://explorer.solana.com' // Default URL
  };
  
  private tokenStatuses: Record<string, TokenTradingStatus> = {};
  
  private deploymentEnvironment: DeploymentEnvironment = {
    frontendUrl: 'https://app.wybe.finance',
    backendUrl: 'https://api.wybe.finance',
    explorerUrl: 'https://explorer.solana.com',
    networkType: 'mainnet'
  };

  constructor() {
    // Initialize with some example tokens
    this.tokenStatuses = {
      'pepes': {
        symbol: 'PEPES',
        listedOnDexscreener: false,
        marketCap: 28000,
        contractAddress: '8xK5SG6UhgXwbsf2Vc9WyBMmRDh79JRzCPyomzPbJwN9',
        deploymentStatus: 'deployed',
        creator: 'Wybe8a43b9c2'
      },
      'degen': {
        symbol: 'DEGEN',
        listedOnDexscreener: true,
        marketCap: 82000,
        lastClaimDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        nextClaimAvailable: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (eligible for claim)
        contractAddress: '3gT1c5Y1T5rRjDxmNnZQCpWQFCzE3hKqG9yMiUMxQfMJ',
        deploymentStatus: 'deployed',
        creator: 'Wybeaf925e8d'
      },
      'moon': {
        symbol: 'MOON',
        listedOnDexscreener: false,
        marketCap: 46000,
        contractAddress: '6uJkR7UrdMSvGfCvLB5oAFDYELwGjgBFLDpwRiaaEBJX',
        deploymentStatus: 'deployed',
        creator: 'Wybe3d7f94a1'
      }
    };
  }

  // Get the current configuration
  public getConfig(): CoinMarketCapConfig {
    return this.config;
  }

  // Update the configuration
  public updateConfig(newConfig: Partial<CoinMarketCapConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }
  
  // Get deployment environment
  public getDeploymentEnvironment(): DeploymentEnvironment {
    return this.deploymentEnvironment;
  }
  
  // Update deployment environment
  public updateDeploymentEnvironment(newEnv: Partial<DeploymentEnvironment>): void {
    this.deploymentEnvironment = { ...this.deploymentEnvironment, ...newEnv };
  }
  
  // Set network type - this would change the explorer URL
  public setNetworkType(type: 'mainnet' | 'testnet' | 'devnet'): void {
    this.deploymentEnvironment.networkType = type;
    
    // Update explorer URL based on network type
    switch (type) {
      case 'mainnet':
        this.deploymentEnvironment.explorerUrl = 'https://explorer.solana.com';
        break;
      case 'testnet':
        this.deploymentEnvironment.explorerUrl = 'https://explorer.solana.com/?cluster=testnet';
        break;
      case 'devnet':
        this.deploymentEnvironment.explorerUrl = 'https://explorer.solana.com/?cluster=devnet';
        break;
    }
  }

  // Check if a token should be listed on DEXScreener based on market cap
  public checkDexscreenerEligibility(symbol: string): boolean {
    const token = this.getTokenStatus(symbol);
    
    if (!token) return false;
    
    // If market cap crosses threshold, mark as eligible for DEXScreener
    if (token.marketCap >= this.config.dexscreenerThreshold && !token.listedOnDexscreener) {
      this.tokenStatuses[symbol.toLowerCase()].listedOnDexscreener = true;
      return true;
    }
    
    return token.listedOnDexscreener;
  }

  // Get all token statuses
  public getAllTokenStatuses(): TokenTradingStatus[] {
    return Object.values(this.tokenStatuses);
  }

  // Get a specific token's status
  public getTokenStatus(symbol: string): TokenTradingStatus | null {
    const normalizedSymbol = symbol.toLowerCase();
    return this.tokenStatuses[normalizedSymbol] || null;
  }
  
  // Deploy a new token to the chain
  public async deployToken(
    symbol: string,
    name: string,
    creatorAddress: string,
    initialSupply: number = 1000000
  ): Promise<{ success: boolean; message: string; contractAddress?: string }> {
    // Simulate blockchain call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      const normalizedSymbol = symbol.toLowerCase();
      
      // Create contract address (in real implementation this would come from blockchain)
      const contractAddress = `Wybe${Math.random().toString(16).substring(2, 10)}`;
      
      // Register the token
      this.tokenStatuses[normalizedSymbol] = {
        symbol: symbol.toUpperCase(),
        listedOnDexscreener: false,
        marketCap: initialSupply * 0.01, // Simplified initial market cap
        contractAddress,
        deploymentStatus: 'deployed',
        creator: creatorAddress
      };
      
      return {
        success: true,
        message: `${name} (${symbol.toUpperCase()}) deployed successfully!`,
        contractAddress
      };
    } catch (error) {
      console.error("Error deploying token:", error);
      return {
        success: false,
        message: "Failed to deploy token. Please try again."
      };
    }
  }

  // Update a token's market cap
  public updateTokenMarketCap(symbol: string, newMarketCap: number): boolean {
    const normalizedSymbol = symbol.toLowerCase();
    
    if (!this.tokenStatuses[normalizedSymbol]) {
      return false;
    }
    
    // Update market cap
    this.tokenStatuses[normalizedSymbol].marketCap = newMarketCap;
    
    // Check if this update triggers DEXScreener listing
    if (newMarketCap >= this.config.dexscreenerThreshold && !this.tokenStatuses[normalizedSymbol].listedOnDexscreener) {
      this.tokenStatuses[normalizedSymbol].listedOnDexscreener = true;
      return true; // Return true to indicate a status change
    }
    
    return false;
  }

  // Process a claim for creator rewards
  public processCreatorRewardClaim(symbol: string): { success: boolean; message: string; amount?: number } {
    const normalizedSymbol = symbol.toLowerCase();
    const token = this.tokenStatuses[normalizedSymbol];
    
    if (!token) {
      return { success: false, message: "Token not found" };
    }
    
    const now = new Date();
    
    // If first claim (no last claim date)
    if (!token.lastClaimDate) {
      // Calculate reward amount (simplified example)
      const rewardAmount = token.marketCap * (this.config.creatorFeePercentage / 100) / 10;
      
      // Update token with claim dates
      this.tokenStatuses[normalizedSymbol].lastClaimDate = now;
      this.tokenStatuses[normalizedSymbol].nextClaimAvailable = new Date(
        now.getTime() + this.config.rewardClaimPeriod * 24 * 60 * 60 * 1000
      );
      
      return { 
        success: true, 
        message: "Initial rewards claimed successfully!",
        amount: rewardAmount
      };
    }
    
    // Check if enough time has passed since last claim
    if (token.nextClaimAvailable && now >= token.nextClaimAvailable) {
      // Calculate reward amount (simplified example)
      const rewardAmount = token.marketCap * (this.config.creatorFeePercentage / 100) / 20;
      
      // Update token with new claim dates
      this.tokenStatuses[normalizedSymbol].lastClaimDate = now;
      this.tokenStatuses[normalizedSymbol].nextClaimAvailable = new Date(
        now.getTime() + this.config.rewardClaimPeriod * 24 * 60 * 60 * 1000
      );
      
      return { 
        success: true, 
        message: "Rewards claimed successfully!",
        amount: rewardAmount
      };
    } else {
      return { 
        success: false, 
        message: `Next claim available in ${this.getTimeUntilNextClaim(token)}`
      };
    }
  }
  
  // Get contract explorer URL
  public getContractExplorerUrl(contractAddress: string): string {
    return `${this.deploymentEnvironment.explorerUrl}/address/${contractAddress}`;
  }

  // Helper to get formatted time until next claim
  private getTimeUntilNextClaim(token: TokenTradingStatus): string {
    if (!token.nextClaimAvailable) {
      return "now";
    }
    
    const now = new Date();
    const timeDiff = token.nextClaimAvailable.getTime() - now.getTime();
    
    if (timeDiff <= 0) return "now";
    
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days} day${days > 1 ? 's' : ''} and ${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours > 1 ? 's' : ''}`;
    }
  }
}

// Export singleton instance
export const tradingService = new TradingService();
export default tradingService;
