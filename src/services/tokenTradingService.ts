
import { supabase } from '@/integrations/supabase/client';
import { apiClient } from './api/apiClient';
import { API_CONFIG } from '@/config/api';
import { 
  TradeParams, 
  TradeResult, 
  TokenLaunchParams, 
  TokenLaunchResponse, 
  InitialSupplyPurchaseResponse,
  ListedToken,
  TokenTransaction
} from './token/types';
import { tokenLaunchService } from './token/tokenLaunchService';
import { tradingService } from './token/tradingService';

// Wrapper service to combine both token and trading functionality
export const tokenTradingService = {
  // Trade execution methods
  estimateTokenAmount: tradingService.estimateTokenAmount,
  estimateSolAmount: tradingService.estimateSolAmount,
  executeTrade: tradingService.executeTrade,
  
  // Token launch methods
  launchToken: tokenLaunchService.launchToken,
  buyInitialSupply: tokenLaunchService.buyInitialSupply,
  getListedTokens: tokenLaunchService.getListedTokens,
  
  // Transaction history methods
  getUserTransactions: async (walletAddress: string): Promise<TokenTransaction[]> => {
    try {
      const response = await apiClient.get<TokenTransaction[]>(API_CONFIG.ENDPOINTS.USER_TRANSACTIONS, {
        walletAddress
      });
      
      return response;
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      return [];
    }
  },
  
  getTransactionStats: async (tokenSymbol?: string): Promise<any> => {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.TRANSACTION_STATS, {
        tokenSymbol
      });
      
      return response;
    } catch (error) {
      console.error('Error fetching transaction stats:', error);
      return {
        volume24h: 0,
        trades24h: 0,
        uniqueTraders24h: 0
      };
    }
  }
};
