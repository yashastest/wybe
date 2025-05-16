
import { supabase } from '@/integrations/supabase/client';
import { TradeParams, TradeResult, TokenLaunchParams, TokenLaunchResult, ListedToken, TokenTransaction } from '@/services/token/types';
import { apiClient } from '@/services/api/apiClient';
import { API_CONFIG } from '@/config/api';
import { transactionService } from '@/services/token/transactionService';

// Re-export types that we need from the token types file
export type { TokenTransaction };

const getListedTokens = async (): Promise<ListedToken[]> => {
  try {
    const { data: tokensData, error } = await supabase
      .from('tokens')
      .select('*');

    if (error) {
      console.error("Database error fetching tokens:", error);
      throw new Error("Failed to fetch tokens from database");
    }
    
    // Transform database tokens to ListedToken format
    const listedTokens: ListedToken[] = tokensData.map(token => ({
      id: token.id,
      symbol: token.symbol,
      name: token.name,
      price: Math.random() * 0.1, // Mock price for demo
      priceChange24h: (Math.random() * 20) - 10, // Random between -10% and +10%
      change24h: (Math.random() * 20) - 10, // For compatibility
      contractAddress: token.token_address,
      marketCap: token.market_cap || Math.random() * 1000000,
      volume24h: Math.random() * 100000, // Mock volume
      totalSupply: Math.random() * 1000000000, // Mock supply
      logo: null, // Mock logo
      description: "A trading token", // Mock description
      creatorAddress: token.creator_wallet,
      isAssisted: Math.random() > 0.5, // Random for demo
      category: ["meme", "utility"], // Mock categories
      banner: null, // Mock banner
      holderStats: { // Mock stats
        whales: Math.floor(Math.random() * 10),
        retail: Math.floor(Math.random() * 100),
        devs: Math.floor(Math.random() * 5)
      },
      liquidity: Math.random() * 500000 // Mock liquidity
    }));
    
    // If no tokens were found in the database, return some mock data
    if (listedTokens.length === 0) {
      return createMockTokenList();
    }
    
    return listedTokens;
  } catch (error) {
    console.error("Error fetching listed tokens:", error);
    // Return mock data on error for demo purposes
    return createMockTokenList();
  }
};

const createMockTokenList = (): ListedToken[] => {
  return [
    {
      id: "1",
      symbol: "WYBE",
      name: "Wybe Token",
      price: 0.05,
      priceChange24h: 12.5,
      change24h: 12.5,
      contractAddress: "0x123...abc",
      marketCap: 1250000,
      volume24h: 85000,
      totalSupply: 10000000,
      logo: null,
      description: "The primary platform token",
      creatorAddress: "0xabc...123",
      category: ["utility"],
      holderStats: { whales: 5, retail: 120, devs: 3 },
    },
    {
      id: "2",
      symbol: "PEPE",
      name: "Pepe Token",
      price: 0.00125,
      priceChange24h: -5.3,
      change24h: -5.3,
      marketCap: 750000,
      volume24h: 125000,
      totalSupply: 100000000,
      category: ["meme"],
      holderStats: { whales: 3, retail: 230, devs: 1 },
    },
    {
      id: "3",
      symbol: "SHIBA",
      name: "Shiba Inu",
      price: 0.00245,
      priceChange24h: 8.1,
      change24h: 8.1,
      marketCap: 950000,
      volume24h: 240000,
      totalSupply: 500000000,
      category: ["meme", "popular"],
      holderStats: { whales: 7, retail: 350, devs: 2 },
    }
  ];
};

const estimateTokenAmount = async (tokenSymbol: string, solAmount: number): Promise<number> => {
  try {
    const response = await apiClient.get<{ tokenAmount: number }>(API_CONFIG.ENDPOINTS.ESTIMATE_TOKEN, {
      tokenSymbol,
      solAmount
    });
    
    return response.tokenAmount;
  } catch (error) {
    console.error('Error estimating token amount:', error);
    throw new Error('Failed to estimate token amount');
  }
};

const estimateSolAmount = async (tokenSymbol: string, tokenAmount: number): Promise<number> => {
  try {
    const response = await apiClient.get<{ solAmount: number }>(API_CONFIG.ENDPOINTS.ESTIMATE_SOL, {
      tokenSymbol,
      tokenAmount
    });
    
    return response.solAmount;
  } catch (error) {
    console.error('Error estimating SOL amount:', error);
    throw new Error('Failed to estimate SOL amount');
  }
};

const executeTrade = async (params: TradeParams): Promise<TradeResult> => {
  try {
    const { tokenSymbol, action, walletAddress, amountSol, amountTokens, gasPriority } = params;
    
    // Validate required parameters
    if (action === 'buy' && !amountSol) {
      return {
        success: false,
        error: 'SOL amount is required for buy orders'
      };
    }
    
    if (action === 'sell' && !amountTokens) {
      return {
        success: false,
        error: 'Token amount is required for sell orders'
      };
    }
    
    // Call API to execute the trade
    const tradeResponse = await apiClient.post<TradeResult>(API_CONFIG.ENDPOINTS.EXECUTE_TRADE, {
      tokenSymbol,
      side: action,
      walletAddress,
      amountSol,
      amountTokens,
      gasPriority: gasPriority || 'medium' // Default to medium if not specified
    });
    
    // Log the trade in the database
    if (tradeResponse.success) {
      await logTradeInDatabase({
        tokenSymbol,
        side: action,
        amount: tradeResponse.amount || amountSol || 0,
        price: tradeResponse.price || 0,
        walletAddress,
        amountTokens: tradeResponse.amountTokens || amountTokens || 0
      });
    }
    
    return tradeResponse;
  } catch (error) {
    console.error('Error executing trade:', error);
    return {
      success: false,
      error: 'Failed to execute trade',
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

const logTradeInDatabase = async (tradeData: {
  tokenSymbol: string;
  side: 'buy' | 'sell';
  amount: number;
  price: number;
  walletAddress: string;
  amountTokens: number;
}): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('trades')
      .insert([{
        token_symbol: tradeData.tokenSymbol,
        side: tradeData.side,
        amount: tradeData.amount,
        wallet_address: tradeData.walletAddress,
        created_at: new Date().toISOString()
      }]);
      
    if (error) {
      console.error('Error logging trade:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error logging trade:', error);
    return false;
  }
};

const getCreatorMilestones = async (walletAddress: string) => {
  try {
    const { data, error } = await supabase
      .from('fee_distributions')
      .select('*')
      .eq('creator_wallet', walletAddress)
      .eq('distributed', false);
      
    if (error) {
      console.error('Error fetching creator milestones:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      tokenId: item.token_id,
      amount: item.amount,
      eligibleTimestamp: item.eligible_timestamp,
      createdAt: item.created_at
    }));
  } catch (error) {
    console.error('Error in getCreatorMilestones:', error);
    return [];
  }
};

const claimCreatorFees = async (milestoneId: string, walletAddress: string) => {
  try {
    // Update the milestone as distributed
    const { data, error } = await supabase
      .from('fee_distributions')
      .update({
        distributed: true,
        distribution_timestamp: new Date().toISOString()
      })
      .eq('id', milestoneId)
      .eq('creator_wallet', walletAddress);
    
    if (error) {
      console.error('Error claiming creator fees:', error);
      return { success: false, message: 'Failed to claim creator fees' };
    }
    
    return { 
      success: true, 
      message: 'Creator fees claimed successfully' 
    };
  } catch (error) {
    console.error('Error in claimCreatorFees:', error);
    return { 
      success: false, 
      message: 'An error occurred while claiming creator fees' 
    };
  }
};

const tokenTradingService = {
  getListedTokens,
  executeTrade,
  getUserTransactions: transactionService.getUserTransactions,
  getTransactionStats: transactionService.getTransactionStats,
  getCreatorMilestones,
  claimCreatorFees,
  
  // For backward compatibility
  buyInitialSupply: async (tokenSymbol: string, amountSol: number): Promise<TradeResult> => {
    // Implement initial token purchase logic
    return executeTrade({
      walletAddress: 'creator-wallet',
      tokenSymbol,
      action: 'buy',
      amountSol,
      gasPriority: 'medium'
    });
  },
  
  // Adding launchToken method for compatibility with useTokenListing
  launchToken: async (params: TokenLaunchParams): Promise<TokenLaunchResult> => {
    try {
      console.log("Launching token with params:", params);
      // This would normally call an API or service to perform the token launch
      return {
        success: true,
        tokenId: Math.random().toString(36).substring(2, 15),
        contractAddress: '0x' + Math.random().toString(36).substring(2, 15),
      };
    } catch (error) {
      console.error("Error launching token:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred during token launch'
      };
    }
  },
};

export { tokenTradingService };
