
import { supabase } from '@/integrations/supabase/client';
import { TradeParams, TradeResult } from './types';

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

export const tradingService = {
  estimateTokenAmount,
  estimateSolAmount,
  executeTrade,
  logTradeInDatabase
};
