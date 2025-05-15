
import { supabase } from '@/integrations/supabase/client';
import { TokenTransaction, TradeHistoryFilters } from './types';

// Function to get user transactions
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
          // Fix for the TypeScript error - ensure token_symbol is a string before calling toLowerCase
          return typeof txTokenSymbol === 'string' && txTokenSymbol.toLowerCase() === tokenSymbolFilter;
        });
      } else if (filters && typeof filters === 'object') {
        // Apply object-based filters
        if (filters.tokenSymbol && typeof filters.tokenSymbol === 'string') {
          const tokenSymbolFilter = filters.tokenSymbol.toLowerCase();
          filteredData = filteredData.filter(tx => {
            const txTokenSymbol = tx.token_symbol;
            // Fix for the TypeScript error - ensure token_symbol is a string before calling toLowerCase
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
      side: record.side as 'buy' | 'sell', // Type assertion to ensure it's 'buy' or 'sell'
      amount: record.amount,
      price: 0.0001, // Should be retrieved from the database or calculated
      timestamp: record.created_at,
      walletAddress: record.wallet_address,
      status: 'confirmed',
      txHash: record.tx_hash,
      amountTokens: record.amount,
      amountSol: Number(record.amount) * 0.0001 // Calculate based on price
    }));
    
    return transactions;
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    return [];
  }
};

export const transactionService = {
  getUserTransactions
};
