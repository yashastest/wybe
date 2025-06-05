
import { API_CONFIG } from '@/config/api';
import { apiClient } from '../api/apiClient';
import { TokenTransaction, TradeHistoryFilters } from './types';
import { supabase } from '@/integrations/supabase/client';

// Mock transaction response with proper structure and valid dates
const getMockTransactionData = (filters?: TradeHistoryFilters): TokenTransaction[] => {
  const history: TokenTransaction[] = [
    {
      id: '1',
      txHash: 'tx_123456789abcdef',
      tokenSymbol: 'WYBE',
      tokenName: 'Wybe Token',
      userId: 'user1',
      type: 'buy',
      side: 'buy',
      amount: 0.25,
      amountUsd: 75,
      price: 0.015,
      fee: 0.005,
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      walletAddress: 'wallet123',
      status: 'confirmed',
      amountTokens: 5000,
      amountSol: 0.25
    },
    {
      id: '2',
      txHash: 'tx_abcdef123456789',
      tokenSymbol: 'WYBE',
      tokenName: 'Wybe Token',
      userId: 'user1',
      type: 'sell',
      side: 'sell',
      amount: 0.15,
      amountUsd: 45,
      price: 0.014,
      fee: 0.003,
      timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
      walletAddress: 'wallet123',
      status: 'confirmed',
      amountTokens: 3000,
      amountSol: 0.15
    },
    {
      id: '3',
      txHash: 'tx_def123456789abc',
      tokenSymbol: 'WYBE',
      tokenName: 'Wybe Token',
      userId: 'user1',
      type: 'buy',
      side: 'buy',
      amount: 0.35,
      amountUsd: 105,
      price: 0.016,
      fee: 0.007,
      timestamp: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
      walletAddress: 'wallet123',
      status: 'confirmed',
      amountTokens: 6500,
      amountSol: 0.35
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
        try {
          const txDate = new Date(tx.timestamp);
          const startDate = filters.startDate instanceof Date ? filters.startDate : new Date(filters.startDate);
          
          // Validate both dates before comparing
          if (isNaN(txDate.getTime()) || isNaN(startDate.getTime())) {
            console.warn('Invalid date in filter comparison:', { txDate: tx.timestamp, startDate: filters.startDate });
            return false;
          }
          
          if (txDate < startDate) {
            return false;
          }
        } catch (error) {
          console.error('Error comparing start date:', error);
          return false;
        }
      }
      
      if (filters.endDate) {
        try {
          const txDate = new Date(tx.timestamp);
          const endDate = filters.endDate instanceof Date ? filters.endDate : new Date(filters.endDate);
          
          // Validate both dates before comparing
          if (isNaN(txDate.getTime()) || isNaN(endDate.getTime())) {
            console.warn('Invalid date in filter comparison:', { txDate: tx.timestamp, endDate: filters.endDate });
            return false;
          }
          
          if (txDate > endDate) {
            return false;
          }
        } catch (error) {
          console.error('Error comparing end date:', error);
          return false;
        }
      }
      
      return true;
    });
  }
  
  return history;
};

const getUserTransactions = async (walletAddress: string, filters?: TradeHistoryFilters): Promise<TokenTransaction[]> => {
  try {
    // Use mock data for now, will integrate real API later
    const transactions = getMockTransactionData(filters);
    
    // Validate that all returned transactions have valid timestamps
    return transactions.filter(tx => {
      if (!tx.timestamp) {
        console.warn('Transaction missing timestamp:', tx.id);
        return false;
      }
      
      const date = new Date(tx.timestamp);
      if (isNaN(date.getTime())) {
        console.warn('Transaction has invalid timestamp:', tx.id, tx.timestamp);
        return false;
      }
      
      return true;
    });
  } catch (error) {
    console.error('Error in getUserTransactions:', error);
    return [];
  }
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
