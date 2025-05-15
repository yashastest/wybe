import { Connection, PublicKey, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { supabase } from '@/integrations/supabase/client';
import { TradeHistoryFilters } from '@/hooks/useTokenTrading';

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
  errorMessage?: string;
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

export interface ListedToken {
  id: string;
  name: string;
  symbol: string;
  logo: string | null;
  banner: string | null;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  category: string[];
  holders: number;
  devWallet: string;
  holderStats: {
    whales: number;
    retail: number;
    devs: number;
  };
  launchDate: string;
}

// Function to estimate token amount from SOL amount
const estimateTokenAmount = (tokenSymbol: string, solAmount: number, action: 'buy' | 'sell'): number => {
  // Get token price from database or calculate based on bonding curve
  // For now, using a default price of 0.0001 SOL per token
  const tokenPrice = 0.0001;
  
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
  // Get token price from database or calculate based on bonding curve
  // For now, using a default price of 0.0001 SOL per token
  const tokenPrice = 0.0001;
  
  if (action === 'sell') {
    // Apply a 2% fee when selling
    const solAmountBeforeFee = tokenAmount * tokenPrice;
    return solAmountBeforeFee * 0.98; // 2% fee
  } else {
    // When buying, return direct conversion (fee applied elsewhere)
    return tokenAmount * tokenPrice;
  }
};

// Execute trade function
const executeTrade = async (tradeParams: TradeParams): Promise<TradeResult> => {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const { tokenSymbol, action, amountSol, amountTokens, gasPriority = 1 } = tradeParams;
    
    // Get token price from database based on bonding curve
    const tokenPrice = 0.0001; // Default price, should be calculated based on token supply
    
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
      errorMessage: error instanceof Error ? error.message : 'Unknown error occurred'
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
          // Check if token_symbol exists and is a string before using toLowerCase
          const txTokenSymbol = tx.token_symbol;
          return typeof txTokenSymbol === 'string' && 
                 txTokenSymbol.toLowerCase() === tokenSymbolFilter;
        });
      } else if (filters && typeof filters === 'object') {
        // Apply object-based filters
        if (filters.tokenSymbol && typeof filters.tokenSymbol === 'string') {
          const tokenSymbolFilter = filters.tokenSymbol.toLowerCase();
          filteredData = filteredData.filter(tx => {
            // Check if token_symbol exists and is a string before using toLowerCase
            const txTokenSymbol = tx.token_symbol;
            return typeof txTokenSymbol === 'string' && 
                   txTokenSymbol.toLowerCase() === tokenSymbolFilter;
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

// Adding functions for token launching
const launchToken = async ({
  name,
  symbol,
  creatorWallet,
  initialPrice,
  totalSupply
}: {
  name: string;
  symbol: string;
  creatorWallet: string;
  initialPrice: number;
  totalSupply: number;
}) => {
  try {
    // Actual implementation would create a token on the blockchain
    // For now, we'll just insert a record in the tokens table
    const { data, error } = await supabase
      .from('tokens')
      .insert([
        {
          name,
          symbol: symbol.toUpperCase(),
          creator_wallet: creatorWallet,
          bonding_curve: { type: 'linear', initial_price: initialPrice },
          market_cap: initialPrice * totalSupply,
          created_at: new Date().toISOString(),
          launch_date: null,
          launched: false
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error("Error launching token:", error);
      return {
        success: false,
        error: error.message
      };
    }
    
    return {
      success: true,
      tokenId: data.id,
      tokenAddress: `sol_${Math.random().toString(36).substring(2, 15)}`,
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
  try {
    // In a real implementation, this would interact with the blockchain
    // For now, we'll update the token record in the database
    
    // First, get the token details
    const { data: token, error: tokenError } = await supabase
      .from('tokens')
      .select('*')
      .eq('id', tokenId)
      .single();
    
    if (tokenError || !token) {
      console.error("Error fetching token:", tokenError);
      return {
        success: false,
        error: tokenError?.message || 'Token not found'
      };
    }
    
    // Get the initial price from the bonding curve
    const initialPrice = token.bonding_curve && 
                         typeof token.bonding_curve === 'object' && 
                         'initial_price' in token.bonding_curve ? 
                         (token.bonding_curve as any).initial_price : 0.0001;
    
    // Calculate token amount based on initial price
    const tokensReceived = amountSol / initialPrice;
    
    // Update token record
    const { error: updateError } = await supabase
      .from('tokens')
      .update({ 
        launched: true,
        launch_date: new Date().toISOString(),
      })
      .eq('id', tokenId);
    
    if (updateError) {
      console.error("Error updating token:", updateError);
      return {
        success: false,
        error: updateError.message
      };
    }
    
    // Log the initial buy transaction
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert([
        {
          wallet: walletAddress,
          token_id: tokenId,
          type: 'buy',
          amount: tokensReceived,
          price: initialPrice,
          fee: amountSol * 0.02, // 2% fee
        }
      ]);
    
    if (transactionError) {
      console.error("Error logging transaction:", transactionError);
      // Continue anyway as the token is launched
    }
    
    return {
      success: true,
      amountSol,
      amountTokens: tokensReceived,
      txHash: `tx_${Math.random().toString(36).substring(2, 15)}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

const getListedTokens = async (): Promise<ListedToken[]> => {
  try {
    // Get launched tokens from the database
    const { data, error } = await supabase
      .from('tokens')
      .select('*')
      .eq('launched', true)
      .order('launch_date', { ascending: false });
    
    if (error) {
      console.error("Error fetching tokens:", error);
      return [];
    }
    
    // Get transaction counts for each token to determine holder stats
    const tokens: ListedToken[] = await Promise.all(data.map(async (token) => {
      // Get transaction counts (in a real implementation, this would be more sophisticated)
      const { count: transactionCount, error: countError } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('token_id', token.id);
      
      // Default holder metrics based on transaction count
      const holderCount = transactionCount || 10;
      const whalesCount = Math.max(1, Math.floor(holderCount * 0.05)); // 5% are whales
      const devsCount = Math.max(1, Math.floor(holderCount * 0.01)); // 1% are devs
      const retailCount = holderCount - whalesCount - devsCount;
      
      // Calculate market metrics based on transactions
      const bondingCurve = token.bonding_curve && typeof token.bonding_curve === 'object' ? 
                          token.bonding_curve as Record<string, any> : 
                          { initial_price: 0.0001 };
                          
      const initialPrice = bondingCurve.initial_price || 0.0001;
      const currentPrice = initialPrice * 1.1; // Assume 10% increase from initial price
      const marketCap = currentPrice * 1000000; // Assuming total supply
      const volume24h = marketCap * 0.05; // Assume 5% of market cap traded daily
      
      return {
        id: token.id,
        name: token.name,
        symbol: token.symbol,
        logo: null, // Add logo handling in the future
        banner: null, // Add banner handling in the future
        price: currentPrice,
        change24h: Math.random() * 20 - 5, // Random change between -5% and 15%
        marketCap,
        volume24h,
        category: ['Token'], // Add category handling in the future
        holders: holderCount,
        devWallet: token.creator_wallet,
        holderStats: {
          whales: whalesCount,
          retail: retailCount,
          devs: devsCount,
        },
        launchDate: token.launch_date
      };
    }));
    
    return tokens;
  } catch (error) {
    console.error("Error fetching listed tokens:", error);
    return [];
  }
};

export const tokenTradingService = {
  estimateTokenAmount,
  estimateSolAmount,
  executeTrade,
  logTradeInDatabase,
  getUserTransactions,
  launchToken,
  buyInitialSupply,
  getListedTokens
};
