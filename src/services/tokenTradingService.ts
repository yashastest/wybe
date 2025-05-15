
import { TradeHistoryFilters } from './token/types';
import { tradingService } from './token/tradingService';
import { transactionService } from './token/transactionService';
import { tokenLaunchService } from './token/tokenLaunchService';

// Re-export all types
export type {
  TradeParams,
  TradeResult,
  TokenTransaction,
  ListedToken,
  TokenLaunchParams,
  TokenLaunchResponse
} from './token/types';

// Re-export all services as a single service
export const tokenTradingService = {
  // Trading functionality
  estimateTokenAmount: tradingService.estimateTokenAmount,
  estimateSolAmount: tradingService.estimateSolAmount,
  executeTrade: tradingService.executeTrade,
  logTradeInDatabase: tradingService.logTradeInDatabase,
  
  // Transaction functionality
  getUserTransactions: transactionService.getUserTransactions,
  
  // Token launch functionality
  launchToken: tokenLaunchService.launchToken,
  buyInitialSupply: tokenLaunchService.buyInitialSupply,
  getListedTokens: tokenLaunchService.getListedTokens
};
