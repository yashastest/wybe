
// Trading Service for managing coin trading and market cap functionality

export interface CoinMarketCapConfig {
  dexscreenerEnabled: boolean;
  dexscreenerThreshold: number;
  creatorFeePercentage: number;
  platformFeePercentage: number;
  rewardClaimPeriod: number; // In days
  deploymentUrl?: string; // Public URL for the deployment
  bondingCurveActive: boolean; // Whether bonding curve is active
  bondingCurveLimit: number; // Limit of the bonding curve in USD
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
  isBondingCurveActive?: boolean; // Whether this token is using bonding curve pricing
  totalSupply?: number; // Total supply of tokens
  price?: number; // Current price per token
}

export interface DeploymentEnvironment {
  frontendUrl: string;
  backendUrl: string;
  explorerUrl: string;
  networkType: 'mainnet' | 'testnet' | 'devnet';
}

export interface TokenTransaction {
  type: 'mint' | 'trade' | 'burn' | 'claim';
  timestamp: number;
  amount: number;
  price: number;
  totalValue: number;
  fromAddress?: string;
  toAddress?: string;
  creatorFee?: number;
  platformFee?: number;
  treasuryAmount?: number; // For minting (1% goes to treasury)
  isBondingCurve?: boolean;
}

class TradingService {
  private config: CoinMarketCapConfig = {
    dexscreenerEnabled: true,
    dexscreenerThreshold: 50000, // $50,000 threshold
    creatorFeePercentage: 2.5,    // 2.5% creator fee
    platformFeePercentage: 2.5,   // 2.5% platform fee
    rewardClaimPeriod: 5,        // 5 days between claims
    deploymentUrl: 'https://explorer.solana.com', // Default URL
    bondingCurveActive: true,
    bondingCurveLimit: 50000     // $50,000 bonding curve limit
  };
  
  private tokenStatuses: Record<string, TokenTradingStatus> = {};
  private tokenTransactions: Record<string, TokenTransaction[]> = {};
  
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
        creator: 'Wybe8a43b9c2',
        isBondingCurveActive: true,
        totalSupply: 1200000,
        price: 0.023
      },
      'degen': {
        symbol: 'DEGEN',
        listedOnDexscreener: true,
        marketCap: 82000,
        lastClaimDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        nextClaimAvailable: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago (eligible for claim)
        contractAddress: '3gT1c5Y1T5rRjDxmNnZQCpWQFCzE3hKqG9yMiUMxQfMJ',
        deploymentStatus: 'deployed',
        creator: 'Wybeaf925e8d',
        isBondingCurveActive: false, // Already past bonding curve
        totalSupply: 5000000,
        price: 0.0164
      },
      'moon': {
        symbol: 'MOON',
        listedOnDexscreener: false,
        marketCap: 46000,
        contractAddress: '6uJkR7UrdMSvGfCvLB5oAFDYELwGjgBFLDpwRiaaEBJX',
        deploymentStatus: 'deployed',
        creator: 'Wybe3d7f94a1',
        isBondingCurveActive: true,
        totalSupply: 3200000,
        price: 0.0144
      }
    };

    // Initialize with some example transactions
    this.tokenTransactions = {
      'pepes': [
        {
          type: 'mint',
          timestamp: Date.now() - 24 * 60 * 60 * 1000, // 1 day ago
          amount: 100000,
          price: 0.02,
          totalValue: 2000,
          toAddress: 'Wybe8a43b9c2',
          treasuryAmount: 1000, // 1% to treasury
          isBondingCurve: true
        },
        {
          type: 'trade',
          timestamp: Date.now() - 12 * 60 * 60 * 1000, // 12 hours ago
          amount: 5000,
          price: 0.021,
          totalValue: 105,
          fromAddress: 'Wybe8a43b9c2',
          toAddress: 'WybeBuyer123',
          creatorFee: 2.625, // 2.5% creator fee
          platformFee: 2.625, // 2.5% platform fee
          isBondingCurve: true
        },
        {
          type: 'trade',
          timestamp: Date.now() - 2 * 60 * 60 * 1000, // 2 hours ago
          amount: 10000,
          price: 0.023,
          totalValue: 230,
          fromAddress: 'WybeBuyer123',
          toAddress: 'WybeBuyer456',
          creatorFee: 5.75, // 2.5% creator fee
          platformFee: 5.75, // 2.5% platform fee
          isBondingCurve: true
        }
      ],
      'degen': [
        {
          type: 'mint',
          timestamp: Date.now() - 30 * 24 * 60 * 60 * 1000, // 30 days ago
          amount: 1000000,
          price: 0.01,
          totalValue: 10000,
          toAddress: 'Wybeaf925e8d',
          treasuryAmount: 10000, // 1% to treasury
          isBondingCurve: true
        },
        {
          type: 'trade',
          timestamp: Date.now() - 20 * 24 * 60 * 60 * 1000, // 20 days ago
          amount: 200000,
          price: 0.015,
          totalValue: 3000,
          fromAddress: 'Wybeaf925e8d',
          toAddress: 'WybeTrader789',
          creatorFee: 75, // 2.5% creator fee
          platformFee: 75, // 2.5% platform fee
          isBondingCurve: true
        },
        {
          type: 'claim',
          timestamp: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
          amount: 150, // Creator claimed fees
          price: 1,
          totalValue: 150,
          toAddress: 'Wybeaf925e8d',
          isBondingCurve: false
        },
        {
          type: 'trade',
          timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
          amount: 500000,
          price: 0.0164,
          totalValue: 8200,
          fromAddress: 'WybeTrader789',
          toAddress: 'WybeTrader012',
          creatorFee: 205, // 2.5% creator fee
          platformFee: 205, // 2.5% platform fee
          isBondingCurve: false // No longer using bonding curve as market cap > 50k
        }
      ]
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
  
  // Get token transactions
  public getTokenTransactions(symbol: string): TokenTransaction[] {
    const normalizedSymbol = symbol.toLowerCase();
    return this.tokenTransactions[normalizedSymbol] || [];
  }
  
  // Record a new token transaction
  public recordTokenTransaction(symbol: string, transaction: TokenTransaction): void {
    const normalizedSymbol = symbol.toLowerCase();
    
    if (!this.tokenTransactions[normalizedSymbol]) {
      this.tokenTransactions[normalizedSymbol] = [];
    }
    
    this.tokenTransactions[normalizedSymbol].push(transaction);
    
    // Update token status based on transaction
    const token = this.getTokenStatus(symbol);
    if (token) {
      // Update price if it's a trade
      if (transaction.type === 'trade') {
        this.tokenStatuses[normalizedSymbol].price = transaction.price;
      }
      
      // Update bond curve status if market cap exceeds threshold
      if (token.marketCap >= this.config.bondingCurveLimit && token.isBondingCurveActive) {
        this.tokenStatuses[normalizedSymbol].isBondingCurveActive = false;
      }
    }
  }
  
  // Calculate price using bonding curve
  public calculateTokenPrice(symbol: string, amount: number): number {
    const token = this.getTokenStatus(symbol);
    
    if (!token) return 0;
    
    // If bonding curve is not active or market cap exceeds threshold
    if (!token.isBondingCurveActive || token.marketCap >= this.config.bondingCurveLimit) {
      return token.price || 0.01; // Use current market price
    }
    
    // Simple bonding curve: price = (current_supply / 10000)^2 + 0.01
    const totalSupply = token.totalSupply || 0;
    return Math.pow((totalSupply + amount / 2) / 10000, 2) + 0.01;
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
      
      // Calculate initial market cap
      const initialPrice = 0.01; // Starting price for new tokens
      const initialMarketCap = initialPrice * initialSupply;
      
      // Register the token
      this.tokenStatuses[normalizedSymbol] = {
        symbol: symbol.toUpperCase(),
        listedOnDexscreener: false,
        marketCap: initialMarketCap,
        contractAddress,
        deploymentStatus: 'deployed',
        creator: creatorAddress,
        isBondingCurveActive: true,
        totalSupply: initialSupply,
        price: initialPrice
      };
      
      // Record initial mint transaction with 1% to treasury
      const treasuryAmount = initialSupply * 0.01; // 1% to treasury
      const holderAmount = initialSupply - treasuryAmount;
      
      const transaction: TokenTransaction = {
        type: 'mint',
        timestamp: Date.now(),
        amount: initialSupply,
        price: initialPrice,
        totalValue: initialMarketCap,
        toAddress: creatorAddress,
        treasuryAmount,
        isBondingCurve: true
      };
      
      // Initialize transactions array for this token
      this.tokenTransactions[normalizedSymbol] = [transaction];
      
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
      
      // If market cap exceeds bonding curve limit, deactivate bonding curve
      if (newMarketCap >= this.config.bondingCurveLimit && this.tokenStatuses[normalizedSymbol].isBondingCurveActive) {
        this.tokenStatuses[normalizedSymbol].isBondingCurveActive = false;
      }
      
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
      
      // Record the claim transaction
      this.recordTokenTransaction(symbol, {
        type: 'claim',
        timestamp: now.getTime(),
        amount: rewardAmount,
        price: 1,
        totalValue: rewardAmount,
        toAddress: token.creator || '',
        isBondingCurve: token.isBondingCurveActive
      });
      
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
      
      // Record the claim transaction
      this.recordTokenTransaction(symbol, {
        type: 'claim',
        timestamp: now.getTime(),
        amount: rewardAmount,
        price: 1,
        totalValue: rewardAmount,
        toAddress: token.creator || '',
        isBondingCurve: token.isBondingCurveActive
      });
      
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
  
  // Execute a trade with platform and creator fees
  public executeTokenTrade(
    symbol: string,
    amount: number,
    fromAddress: string,
    toAddress: string
  ): { success: boolean; message: string; transaction?: TokenTransaction } {
    const normalizedSymbol = symbol.toLowerCase();
    const token = this.tokenStatuses[normalizedSymbol];
    
    if (!token) {
      return { success: false, message: "Token not found" };
    }
    
    // Calculate price based on current price or bonding curve
    const price = this.calculateTokenPrice(symbol, amount);
    const tradeValue = price * amount;
    
    // Calculate fees
    const creatorFee = tradeValue * (this.config.creatorFeePercentage / 100);
    const platformFee = tradeValue * (this.config.platformFeePercentage / 100);
    const totalFees = creatorFee + platformFee;
    const sellerReceives = tradeValue - totalFees;
    
    // Record the transaction
    const transaction: TokenTransaction = {
      type: 'trade',
      timestamp: Date.now(),
      amount,
      price,
      totalValue: tradeValue,
      fromAddress,
      toAddress,
      creatorFee,
      platformFee,
      isBondingCurve: token.isBondingCurveActive
    };
    
    // Record the transaction and update token price
    this.recordTokenTransaction(symbol, transaction);
    this.tokenStatuses[normalizedSymbol].price = price;
    
    // Update market cap
    const newMarketCap = token.totalSupply! * price;
    this.updateTokenMarketCap(symbol, newMarketCap);
    
    return {
      success: true,
      message: `Trade executed successfully. Amount: ${amount} ${token.symbol} at ${price.toFixed(6)} each.`,
      transaction
    };
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
