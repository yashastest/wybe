import { Connection, PublicKey, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { supabase } from '@/integrations/supabase/client';
import { TradeHistoryFilters } from '@/hooks/useTokenTrading';

// Mock token price data
const tokenPrices = {
  'PEPE': 0.00001234,
  'DOGE': 0.12345,
  'SHIB': 0.00002345,
  'FLOKI': 0.0001234,
  'BONK': 0.00000234,
  'WOJAK': 0.0000789,
  'PEPES': 0.00023,
  'DSOL': 0.00056,
  'SHIBSOL': 0.00012,
  'FLOKISUN': 0.00034,
};

export interface TradeParams {
  walletAddress: string;
  tokenSymbol: string;
  action: 'buy' | 'sell';
  amountSol?: number;
  amountTokens?: number;
  gasPriority?: number;
}

export interface TradeResult {
  success: boolean;
  amountSol?: number;
  amountTokens?: number;
  txHash?: string;
  price?: number;
  error?: string;
  errorMessage?: string; // Added to fix the error in TradingInterface.tsx
}

export interface TokenTransaction {
  id: string;
  tokenSymbol: string;
  side: 'buy' | 'sell';  
  amount: number;
  price: number;
  timestamp: string;
  walletAddress: string;
  status: 'confirmed' | 'pending' | 'failed';
  txHash?: string;
  amountTokens: number;
  amountSol: number;
}

// Function to estimate token amount from SOL amount
const estimateTokenAmount = (tokenSymbol: string, solAmount: number, action: 'buy' | 'sell'): number => {
  const tokenPrice = tokenPrices[tokenSymbol as keyof typeof tokenPrices] || 0.0001;
  
  if (action === 'buy') {
    // Apply a 2% fee when buying
    const solAmountAfterFee = solAmount * 0.98;
    return solAmountAfterFee / tokenPrice;
  } else {
    // When selling, return direct conversion (fee will be applied later)
    return solAmount / tokenPrice;
  }
};

// Function to estimate SOL amount from token amount
const estimateSolAmount = (tokenSymbol: string, tokenAmount: number, action: 'buy' | 'sell'): number => {
  const tokenPrice = tokenPrices[tokenSymbol as keyof typeof tokenPrices] || 0.0001;
  
  if (action === 'sell') {
    // Apply a 2% fee when selling
    const solAmountBeforeFee = tokenAmount * tokenPrice;
    return solAmountBeforeFee * 0.98; // 2% fee
  } else {
    // When buying, return direct conversion (fee applied elsewhere)
    return tokenAmount * tokenPrice;
  }
};

// Execute trade function (mock implementation for now)
const executeTrade = async (tradeParams: TradeParams): Promise<TradeResult> => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const { tokenSymbol, action, amountSol, amountTokens, gasPriority = 1 } = tradeParams;
    const tokenPrice = tokenPrices[tokenSymbol as keyof typeof tokenPrices] || 0.0001;
    
    // Simulate transaction hash
    const txHash = `tx_${Math.random().toString(36).substring(2, 15)}`;
    
    if (action === 'buy') {
      // Calculate token amount from SOL amount
      if (!amountSol) {
        throw new Error("SOL amount is required for buy orders");
      }
      const solAmountAfterFee = amountSol * 0.98; // 2% fee
      const tokensReceived = solAmountAfterFee / tokenPrice;
      
      return {
        success: true,
        amountSol,
        amountTokens: tokensReceived,
        txHash,
        price: tokenPrice
      };
    } else {
      // Calculate SOL amount from token amount
      if (!amountTokens) {
        throw new Error("Token amount is required for sell orders");
      }
      const solAmountBeforeFee = amountTokens * tokenPrice;
      const solReceived = solAmountBeforeFee * 0.98; // 2% fee
      
      return {
        success: true,
        amountSol: solReceived,
        amountTokens,
        txHash,
        price: tokenPrice
      };
    }
  } catch (error) {
    console.error("Trade execution error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      errorMessage: error instanceof Error ? error.message : 'Unknown error occurred' // Added to match usage in TradingInterface
    };
  }
};

// Log trade to database via Edge Function
const logTradeInDatabase = async (tradeData: {
  wallet_address: string;
  token_symbol: string;
  side: 'buy' | 'sell';
  amount: number;
  tx_hash?: string;
}) => {
  try {
    const { data, error } = await supabase.functions.invoke('log-trade', {
      body: tradeData
    });
    
    if (error) {
      console.error("Error logging trade:", error);
      return { success: false, error };
    }
    
    return { success: true, data };
  } catch (error) {
    console.error("Error calling log-trade function:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
};

// Function to get user transactions
const getUserTransactions = async (
  walletAddress: string, 
  filters?: TradeHistoryFilters | string  // Allow string for backward compatibility
): Promise<TokenTransaction[]> => {
  try {
    // Simulate API call to fetch transactions
    // In a real implementation, this would be a call to your API or database
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Convert string filter to TradeHistoryFilters object if needed
    const tokenSymbolFilter = typeof filters === 'string' ? filters : filters?.tokenSymbol;
    
    // Mock data for demonstration
    const mockTransactions: TokenTransaction[] = [
      {
        id: '1',
        tokenSymbol: 'PEPE',
        side: 'buy',
        amount: 1000000,
        price: 0.00001234,
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        walletAddress,
        status: 'confirmed',
        txHash: 'tx_mock_hash_1',
        amountTokens: 1000000,
        amountSol: 12.34
      },
      {
        id: '2',
        tokenSymbol: 'DOGE',
        side: 'sell',
        amount: 500,
        price: 0.12345,
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        walletAddress,
        status: 'confirmed',
        txHash: 'tx_mock_hash_2',
        amountTokens: 500,
        amountSol: 61.73
      },
      {
        id: '3',
        tokenSymbol: 'SHIB',
        side: 'buy',
        amount: 2000000,
        price: 0.00002345,
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        walletAddress,
        status: 'confirmed',
        txHash: 'tx_mock_hash_3',
        amountTokens: 2000000,
        amountSol: 46.90
      }
    ];
    
    // Apply filters if provided
    let filteredTransactions = [...mockTransactions];
    
    if (tokenSymbolFilter) {
      filteredTransactions = filteredTransactions.filter(tx => 
        tx.tokenSymbol.toLowerCase() === tokenSymbolFilter.toLowerCase()
      );
    } else if (filters && typeof filters !== 'string') {
      if (filters.side) {
        filteredTransactions = filteredTransactions.filter(tx => 
          tx.side === filters.side
        );
      }
      
      if (filters.startDate) {
        filteredTransactions = filteredTransactions.filter(tx => 
          new Date(tx.timestamp) >= filters.startDate!
        );
      }
      
      if (filters.endDate) {
        filteredTransactions = filteredTransactions.filter(tx => 
          new Date(tx.timestamp) <= filters.endDate!
        );
      }
    }
    
    return filteredTransactions;
  } catch (error) {
    console.error("Error fetching user transactions:", error);
    return [];
  }
};

// Adding functions for token launching
const launchToken = async ({
  name,
  symbol,
  creatorWallet,
  initialPrice,
}: {
  name: string;
  symbol: string;
  creatorWallet: string;
  initialPrice: number;
}) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  try {
    // Generate token ID for reference in later steps
    const tokenId = `token_${Math.random().toString(36).substring(2, 15)}`;
    
    // This would connect to blockchain and deploy the token
    return {
      success: true,
      tokenId, // Add tokenId to match what LaunchTokenForm expects
      tokenAddress: `addr_${Math.random().toString(36).substring(2, 15)}`,
      txHash: `tx_${Math.random().toString(36).substring(2, 15)}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

const buyInitialSupply = async (
  tokenId: string,
  walletAddress: string,
  amountSol: number
) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  try {
    const tokenPrice = 0.0001; // Initial token price
    const tokensReceived = amountSol / tokenPrice;
    
    return {
      success: true,
      amountSol: amountSol,
      amountTokens: tokensReceived,
      txHash: `tx_${Math.random().toString(36).substring(2, 15)}`,
      error: undefined // Adding error property with undefined value for type safety
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const tokenTradingService = {
  estimateTokenAmount,
  estimateSolAmount,
  executeTrade,
  logTradeInDatabase,
  getUserTransactions,
  launchToken,
  buyInitialSupply
};
