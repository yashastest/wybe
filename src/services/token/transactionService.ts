
import { supabase } from '@/integrations/supabase/client';
import { TokenTransaction, TradeHistoryFilters } from './types';
import { apiClient } from '@/services/api/apiClient';
import { API_CONFIG } from '@/config/api';

// Real implementation to get user transactions with API integration
const getUserTransactions = async (
  walletAddress: string, 
  filters?: TradeHistoryFilters
): Promise<TokenTransaction[]> => {
  try {
    // Define query parameters
    const queryParams: Record<string, any> = { walletAddress };
    
    // Add filters if provided
    if (filters) {
      if (filters.tokenSymbol) queryParams.tokenSymbol = filters.tokenSymbol;
      if (filters.side) queryParams.side = filters.side;
      if (filters.startDate) queryParams.startDate = filters.startDate.toISOString();
      if (filters.endDate) queryParams.endDate = filters.endDate.toISOString();
    }
    
    // Call API to get transactions
    const transactions = await apiClient.get<TokenTransaction[]>(
      API_CONFIG.ENDPOINTS.USER_TRANSACTIONS,
      queryParams
    );
    
    return transactions;
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    
    // Fallback to database if API fails
    try {
      const { data, error: dbError } = await supabase
        .from('trades')
        .select('*')
        .eq('wallet_address', walletAddress)
        .order('created_at', { ascending: false });
      
      if (dbError) {
        console.error("Database error:", dbError);
        return [];
      }
      
      // Transform database records to match TokenTransaction interface
      return (data || []).map(record => ({
        id: record.id,
        tokenSymbol: record.token_symbol,
        type: record.side as 'buy' | 'sell', // Map side to type
        side: record.side as 'buy' | 'sell', // Keep side for backwards compatibility
        amount: record.amount,
        price: 0.0001, // Default price since it's not in the database
        timestamp: record.created_at,
        walletAddress: record.wallet_address,
        status: 'confirmed', // Default status
        txHash: record.tx_hash || '',
        amountTokens: record.amount,
        amountSol: Number(record.amount) * 0.0001
      }));
    } catch (dbError) {
      console.error("Error in database fallback:", dbError);
      return [];
    }
  }
};

// Enhanced function to get transaction statistics with API integration
const getTransactionStats = async (tokenSymbol?: string): Promise<{
  totalVolume: number;
  count24h: number;
  volumeChange: number;
}> => {
  try {
    // Call API to get transaction stats
    const stats = await apiClient.get<{
      totalVolume: number;
      count24h: number;
      volumeChange: number;
    }>(API_CONFIG.ENDPOINTS.TRANSACTION_STATS, { tokenSymbol });
    
    return stats;
  } catch (error) {
    console.error("Error fetching transaction stats from API:", error);
    
    // Fallback to database calculation if API fails
    try {
      // Create a date object for 24 hours ago
      const date24hAgo = new Date();
      date24hAgo.setHours(date24hAgo.getHours() - 24);
      
      // Create a date object for 48 hours ago
      const date48hAgo = new Date();
      date48hAgo.setHours(date48hAgo.getHours() - 48);
      
      let query = supabase
        .from('trades')
        .select('*');
      
      // Filter by token if specified
      if (tokenSymbol) {
        query = query.eq('token_symbol', tokenSymbol);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error("Error fetching transaction stats:", error);
        return { totalVolume: 0, count24h: 0, volumeChange: 0 };
      }
      
      // Calculate total volume
      const totalVolume = data.reduce((sum, tx) => sum + Number(tx.amount), 0);
      
      // Calculate 24h volume
      const transactions24h = data.filter(tx => 
        new Date(tx.created_at) >= date24hAgo
      );
      const count24h = transactions24h.length;
      
      // Calculate volume change (24h vs previous 24h)
      const transactions48hTo24h = data.filter(tx => 
        new Date(tx.created_at) >= date48hAgo && 
        new Date(tx.created_at) < date24hAgo
      );
      
      const volume24h = transactions24h.reduce((sum, tx) => sum + Number(tx.amount), 0);
      const volumePrevious24h = transactions48hTo24h.reduce((sum, tx) => sum + Number(tx.amount), 0);
      
      // Calculate percentage change
      const volumeChange = volumePrevious24h === 0 
        ? 100 // If previous volume was 0, consider it 100% increase
        : ((volume24h - volumePrevious24h) / volumePrevious24h) * 100;
      
      return {
        totalVolume,
        count24h,
        volumeChange
      };
    } catch (dbError) {
      console.error("Error in database fallback:", dbError);
      return { totalVolume: 0, count24h: 0, volumeChange: 0 };
    }
  }
};

export const transactionService = {
  getUserTransactions,
  getTransactionStats
};
