
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
  TokenTransaction,
  TradeHistoryFilters
} from './token/types';
import { tokenLaunchService } from './token/tokenLaunchService';
import { tradingService } from './token/tradingService';
import { transactionService } from './token/transactionService';

// Export types for other components to use
export type {
  TradeParams,
  TradeResult,
  ListedToken,
  TokenTransaction,
  TokenLaunchParams,
  TokenLaunchResponse,
  InitialSupplyPurchaseResponse,
  TradeHistoryFilters
};

// Wrapper service to combine both token and trading functionality
export const tokenTradingService = {
  // Trade execution methods
  estimateTokenAmount: tradingService.estimateTokenAmount,
  estimateSolAmount: tradingService.estimateSolAmount,
  executeTrade: tradingService.executeTrade,
  logTradeInDatabase: tradingService.logTradeInDatabase,
  
  // Token launch methods
  launchToken: tokenLaunchService.launchToken,
  buyInitialSupply: tokenLaunchService.buyInitialSupply,
  getListedTokens: tokenLaunchService.getListedTokens,
  
  // Transaction history methods
  getUserTransactions: transactionService.getUserTransactions,
  getTransactionStats: transactionService.getTransactionStats
};
