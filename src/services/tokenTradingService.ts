import { supabase } from '@/integrations/supabase/client';
import { TradeParams, TradeResult, TokenLaunchParams, TokenLaunchResult } from './types';
import { apiClient } from '@/services/api/apiClient';
import { API_CONFIG } from '@/config/api';
import { ListedToken } from './types';
import { transactionService } from './transactionService';

const getListedTokens = async (): Promise<ListedToken[]> => {
  try {
    const response = await apiClient.get<ListedToken[]>(API_CONFIG.ENDPOINTS.LIST_TOKENS);
    return response;
  } catch (error) {
    console.error("Error fetching listed tokens:", error);
    throw new Error("Failed to fetch listed tokens");
  }
};

// Real implementation of trading service using API
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

const tokenTradingService = {
  getListedTokens,
  executeTrade,
  getUserTransactions: transactionService.getUserTransactions,
  getTransactionStats: transactionService.getTransactionStats,
  
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
