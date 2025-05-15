
import { supabase } from '@/integrations/supabase/client';
import { TokenTransaction, TradeHistoryFilters } from './types';

// Enhanced function to get user transactions with better error handling and filtering
const getUserTransactions = async (
  walletAddress: string, 
  filters?: TradeHistoryFilters
): Promise<TokenTransaction[]> => {
  try {
    // Make a real API call to get transactions from database
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('wallet_address', walletAddress)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
    
    // Apply filters
    let filteredData = data || [];
    
    if (filters) {
      if (typeof filters === 'string') {
        // Filter by token symbol as string
        const tokenSymbolFilter = filters.toLowerCase();
        filteredData = filteredData.filter(tx => {
          const txTokenSymbol = tx.token_symbol;
          // Ensure token_symbol is a string before calling toLowerCase
          return typeof txTokenSymbol === 'string' && txTokenSymbol.toLowerCase() === tokenSymbolFilter;
        });
      } else if (filters && typeof filters === 'object') {
        // Apply object-based filters
        if (filters.tokenSymbol && typeof filters.tokenSymbol === 'string') {
          const tokenSymbolFilter = filters.tokenSymbol.toLowerCase();
          filteredData = filteredData.filter(tx => {
            const txTokenSymbol = tx.token_symbol;
            // Ensure token_symbol is a string before calling toLowerCase
            return typeof txTokenSymbol === 'string' && txTokenSymbol.toLowerCase() === tokenSymbolFilter;
          });
        }
        
        if (filters.side) {
          filteredData = filteredData.filter(tx => 
            tx.side === filters.side
          );
        }
        
        if (filters.startDate) {
          filteredData = filteredData.filter(tx => 
            new Date(tx.created_at) >= filters.startDate!
          );
        }
        
        if (filters.endDate) {
          filteredData = filteredData.filter(tx => 
            new Date(tx.created_at) <= filters.endDate!
          );
        }
      }
    }
    
    // Transform database records to match TokenTransaction interface
    const transactions: TokenTransaction[] = filteredData.map(record => ({
      id: record.id,
      tokenSymbol: record.token_symbol,
      side: record.side as 'buy' | 'sell',
      amount: record.amount,
      price: 0.0001, // Default price since it's not in the database
      timestamp: record.created_at,
      walletAddress: record.wallet_address,
      status: 'confirmed', // Default status since it's not in the database
      txHash: record.tx_hash || '',
      amountTokens: record.amount, // Use amount as default for amountTokens
      amountSol: Number(record.amount) * 0.0001 // Calculate default amountSol
    }));
    
    return transactions;
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    return [];
  }
};

// Enhanced function to get transaction statistics
const getTransactionStats = async (tokenSymbol?: string): Promise<{
  totalVolume: number;
  count24h: number;
  volumeChange: number;
}> => {
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
  } catch (error) {
    console.error("Error calculating transaction stats:", error);
    return { totalVolume: 0, count24h: 0, volumeChange: 0 };
  }
};

export const transactionService = {
  getUserTransactions,
  getTransactionStats
};
