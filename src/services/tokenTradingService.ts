import { supabase } from '@/integrations/supabase/client';

// Token trading related types
export interface TokenTransaction {
  id: string;
  txHash: string;
  tokenSymbol: string;
  tokenName?: string;
  type: 'buy' | 'sell';
  side?: 'buy' | 'sell'; // For backward compatibility
  amount: number;  // Amount in SOL
  amountUsd?: number;
  price: number;
  fee?: number;
  timestamp: string;
  walletAddress?: string;
  status: 'pending' | 'confirmed' | 'failed';
  amountTokens?: number;  // For backward compatibility
  amountSol?: number; // For backward compatibility
}

export interface TradeHistoryFilters {
  tokenSymbol?: string;
  side?: 'buy' | 'sell'; // Type of transaction
  startDate?: Date;
  endDate?: Date;
  status?: 'pending' | 'confirmed' | 'failed';
  walletAddress?: string;
}

export interface ListedToken {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange24h?: number;
  logo?: string | null;
  contractAddress?: string;
  marketCap?: number;
  volume24h?: number;
  totalSupply?: number;
  description?: string;
  isAssisted?: boolean;
  creatorAddress?: string;
  // Add missing properties used in components
  change24h?: number;
  category?: string[];
  holderStats?: {
    whales: number;
    retail: number;
    devs: number;
  };
}

export interface TradeParams {
  walletAddress: string;
  tokenSymbol: string;
  action: 'buy' | 'sell';
  gasPriority: 'low' | 'medium' | 'high';
  amountSol?: number;
  amountTokens?: number;
}

export interface TradeResult {
  success: boolean;
  txHash?: string;
  amount?: number;
  price?: number;
  fee?: number;
  error?: string;
  // Adding backward compatibility properties
  amountSol?: number;
  amountTokens?: number;
  errorMessage?: string;
}

// Interface for calculating token price
interface PriceCalcParams {
  tokenSymbol: string;
  amount?: number;
  isBuy: boolean;
}

class TokenTradingService {
  /**
   * Get list of all available tokens for trading
   */
  async getListedTokens(): Promise<ListedToken[]> {
    // In a real implementation, this would fetch from Supabase
    // For now, we'll return mock data
    return Promise.resolve([
      {
        id: "wybe-1", 
        symbol: "WYBE", 
        name: "Wybe Token", 
        price: 0.0015, 
        priceChange24h: 12.5,
        description: "The native token of the Wybe platform",
        contractAddress: "wybeHg9sbUYEFSj6SXZ5yzERF8WjT6zyXJDj1YCnx",
        marketCap: 1500000,
        volume24h: 125000,
        totalSupply: 1000000000,
        isAssisted: false,
        creatorAddress: "8zjX6U4CnCo8W2Nqf5TzjNADVhKBTwXCVVMEmM3e1BhR",
        logo: null,
        change24h: 12.5,
        category: ['defi', 'utility'],
        holderStats: {
          whales: 2,
          retail: 85,
          devs: 3
        }
      },
      {
        id: "pepe-2", 
        symbol: "PEPE", 
        name: "Pepe Token", 
        price: 0.000032, 
        priceChange24h: 5.7,
        description: "A popular meme token in the crypto space",
        contractAddress: "pepeHg9sbHJYEFSj6SXZ5yzERF8WjT6zyXJDj1YC5x",
        marketCap: 2500000,
        volume24h: 350000,
        totalSupply: 100000000000,
        isAssisted: false,
        creatorAddress: "9ajX6U4CnCo8W2Nqf5TzjNADVhKBTwXCVVMEmM3e1CyZ",
        logo: null,
        change24h: 5.7,
        category: ['meme'],
        holderStats: {
          whales: 4,
          retail: 128,
          devs: 1
        }
      },
      {
        id: "doge-3", 
        symbol: "DOGE", 
        name: "Dogecoin", 
        price: 0.23, 
        priceChange24h: -3.2,
        description: "The original meme token that started it all",
        contractAddress: null, // Assisted launch, no contract yet
        marketCap: 30000000,
        volume24h: 1250000,
        totalSupply: 132500000000,
        isAssisted: true,
        creatorAddress: "7wpX6U4CnCo8W2Nqf5TzjNADVhKBTwXCVVMEmM3e1AiJ",
        logo: null,
        change24h: -3.2,
        category: ['meme'],
        holderStats: {
          whales: 8,
          retail: 340,
          devs: 2
        }
      }
    ]);
  }
  
  /**
   * Get details for a specific token
   */
  async getTokenDetails(tokenSymbol: string): Promise<ListedToken | null> {
    const tokens = await this.getListedTokens();
    return tokens.find(token => token.symbol === tokenSymbol) || null;
  }

  /**
   * Calculate token price based on amount and token symbol
   */
  private async calculatePrice({ tokenSymbol, amount = 0, isBuy }: PriceCalcParams): Promise<number> {
    try {
      // Mock implementation - in production, this would use a more complex calculation
      // based on the bonding curve of the token
      const tokenDetails = await this.getTokenDetails(tokenSymbol);
      if (!tokenDetails) return 0;
      
      const basePrice = tokenDetails.price;
      const priceImpact = amount * 0.0001;
      
      // Apply slippage based on direction (buy/sell)
      return isBuy ? basePrice * (1 + priceImpact) : basePrice * (1 - priceImpact);
    } catch (error) {
      console.error("Failed to calculate price:", error);
      return 0;
    }
  }

  /**
   * Estimate the amount of tokens received for a given SOL amount
   */
  async estimateTokenAmount(tokenSymbol: string, solAmount: number): Promise<number> {
    try {
      const price = await this.calculatePrice({ tokenSymbol, amount: solAmount, isBuy: true });
      return price > 0 ? solAmount / price : 0;
    } catch (error) {
      console.error("Failed to estimate token amount:", error);
      return 0;
    }
  }

  /**
   * Estimate the amount of SOL received for a given token amount
   */
  async estimateSolAmount(tokenSymbol: string, tokenAmount: number): Promise<number> {
    try {
      const price = await this.calculatePrice({ tokenSymbol, amount: tokenAmount, isBuy: false });
      return tokenAmount * price;
    } catch (error) {
      console.error("Failed to estimate SOL amount:", error);
      return 0;
    }
  }

  /**
   * Execute a trade (buy or sell)
   */
  async executeTrade(params: TradeParams): Promise<TradeResult> {
    try {
      const { tokenSymbol, action, walletAddress, amountSol, amountTokens, gasPriority = 'medium' } = params;
      
      // Mock implementation - in a real application, this would interact with the blockchain
      // For now, we'll just return a successful result with mock data
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      let price: number;
      let amount: number;
      
      if (action === 'buy' && amountSol) {
        // Buy tokens with SOL
        price = await this.calculatePrice({ tokenSymbol, amount: amountSol, isBuy: true });
        amount = amountSol / price;
        
        return {
          success: true,
          txHash: `tx_${Date.now().toString(36)}`,
          amountSol,
          amountTokens: amount,
          price
        };
      } else if (action === 'sell' && amountTokens) {
        // Sell tokens for SOL
        price = await this.calculatePrice({ tokenSymbol, amount: amountTokens, isBuy: false });
        amount = amountTokens * price;
        
        return {
          success: true,
          txHash: `tx_${Date.now().toString(36)}`,
          amountSol: amount,
          amountTokens,
          price
        };
      }
      
      throw new Error("Invalid trade parameters");
    } catch (error: any) {
      console.error("Trade execution failed:", error);
      return {
        success: false,
        error: error.message || "Trade execution failed",
        errorMessage: "Failed to execute trade. Please try again."
      };
    }
  }

  /**
   * Get transaction history for a user
   */
  async getUserTransactions(walletAddress: string, filters?: TradeHistoryFilters): Promise<TokenTransaction[]> {
    try {
      // Mock implementation - in a real application, this would fetch from the database
      // For now we'll return mock data
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      return [
        {
          id: 'tx1',
          tokenSymbol: 'WYBE',
          side: 'buy',
          type: 'buy',
          amount: 1000,
          price: 0.0015,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          status: 'confirmed',
          txHash: `tx_${Math.random().toString(36).substring(2, 10)}`,
        },
        {
          id: 'tx2',
          tokenSymbol: 'PEPE',
          side: 'sell',
          type: 'sell',
          amount: 5000,
          price: 0.000032,
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          status: 'confirmed',
          txHash: `tx_${Math.random().toString(36).substring(2, 10)}`,
        },
        {
          id: 'tx3',
          tokenSymbol: 'DOGE',
          side: 'buy',
          type: 'buy',
          amount: 200,
          price: 0.23,
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          status: 'confirmed',
          txHash: `tx_${Math.random().toString(36).substring(2, 10)}`,
        }
      ];
    } catch (error) {
      console.error("Failed to get user transactions:", error);
      return [];
    }
  }

  /**
   * Launch a new token
   */
  async launchToken(params: any): Promise<any> {
    // Mock implementation
    console.log('Launching token:', params);
    return Promise.resolve({
      success: true,
      tokenId: `token_${Date.now().toString(36)}`,
      message: 'Token launched successfully'
    });
  }
  
  /**
   * Buy initial supply of a token
   */
  async buyInitialSupply(tokenId: string, walletAddress: string, amount: number): Promise<any> {
    // Mock implementation
    console.log('Buying initial supply:', { tokenId, walletAddress, amount });
    return Promise.resolve({
      success: true,
      amountSol: amount,
      amountTokens: amount * 1000,
      message: 'Initial supply purchased'
    });
  }
}

export const tokenTradingService = new TokenTradingService();
