
import { API_CONFIG } from '@/config/api';
import { apiClient } from '../api/apiClient';
import { TokenTransaction, TradeHistoryFilters } from './types';
import { supabase } from '@/integrations/supabase/client';

// Mock transaction response with proper structure
const getMockTransactionData = (filters?: TradeHistoryFilters): TokenTransaction[] => {
  const history: TokenTransaction[] = [
    {
      id: '1',
      txHash: 'tx_123456789abcdef',
      tokenSymbol: 'WYBE',
      tokenName: 'Wybe Token',
      userId: 'user1', // Added userId property
      type: 'buy',
      side: 'buy', // For backwards compatibility 
      amount: 0.25,
      amountUsd: 75,
      price: 0.015,
      fee: 0.005,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      walletAddress: 'wallet123',
      status: 'confirmed',
      amountTokens: 5000, // For backwards compatibility
      amountSol: 0.25 // For backwards compatibility
    },
    {
      id: '2',
      txHash: 'tx_abcdef123456789',
      tokenSymbol: 'WYBE',
      tokenName: 'Wybe Token',
      userId: 'user1', // Added userId property
      type: 'sell',
      side: 'sell', // For backwards compatibility
      amount: 0.15,
      amountUsd: 45,
      price: 0.014,
      fee: 0.003,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      walletAddress: 'wallet123',
      status: 'confirmed',
      amountTokens: 3000, // For backwards compatibility
      amountSol: 0.15 // For backwards compatibility
    }
  ];

  if (filters) {
    return history.filter(tx => {
      if (filters.tokenSymbol && tx.tokenSymbol !== filters.tokenSymbol) {
        return false;
      }
      
      if (filters.side && tx.side !== filters.side) {
        return false;
      }
      
      if (filters.startDate) {
        const txDate = new Date(tx.timestamp);
        const startDate = filters.startDate instanceof Date ? filters.startDate : new Date(filters.startDate);
        if (txDate < startDate) {
          return false;
        }
      }
      
      if (filters.endDate) {
        const txDate = new Date(tx.timestamp);
        const endDate = filters.endDate instanceof Date ? filters.endDate : new Date(filters.endDate);
        if (txDate > endDate) {
          return false;
        }
      }
      
      return true;
    });
  }
  
  return history;
};

const getUserTransactions = async (walletAddress: string, filters?: TradeHistoryFilters): Promise<TokenTransaction[]> => {
  // Use mock data for now, will integrate real API later
  return getMockTransactionData(filters);
};

const getTransactionStats = async (tokenSymbol?: string) => {
  try {
    const response = await apiClient.get(API_CONFIG.ENDPOINTS.TRANSACTION_STATS, { tokenSymbol });
    return response;
  } catch (error) {
    console.error("Error fetching transaction stats:", error);
    
    // Return mock stats if API fails
    return {
      volume24h: 125000,
      trades24h: 456,
      avgTradeSize: 274.12,
      topBuyer: "wallet456",
      topSeller: "wallet789"
    };
  }
};

export const transactionService = {
  getUserTransactions,
  getTransactionStats
};
