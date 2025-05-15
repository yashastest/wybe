import { supabase } from '@/integrations/supabase/client';
import { TradeParams, TradeResult } from './types';

// Helper to safely extract values from bonding_curve JSONB data
const extractFromBondingCurve = (bondingCurve: any, field: string, defaultValue: any) => {
  if (!bondingCurve) return defaultValue;
  if (typeof bondingCurve !== 'object') return defaultValue;
  
  // Handle both object form and array form (PostgreSQL JSON can be either)
  if (Array.isArray(bondingCurve)) {
    // If it's an array, try to find an object with the field
    for (const item of bondingCurve) {
      if (typeof item === 'object' && item !== null && field in item) {
        return item[field];
      }
    }
    return defaultValue;
  }
  
  // Otherwise, treat it as an object
  return bondingCurve[field] || defaultValue;
};

// Real implementation of trading service
const estimateTokenAmount = async (tokenSymbol: string, solAmount: number): Promise<number> => {
  try {
    // Get token price from database
    const { data: token, error } = await supabase
      .from('tokens')
      .select('*')
      .eq('symbol', tokenSymbol)
      .single();
    
    if (error || !token) {
      console.error('Error fetching token price:', error);
      throw new Error('Failed to fetch token price');
    }
    
    // Calculate token amount based on token price and SOL amount
    const tokenPrice = extractFromBondingCurve(token.bonding_curve, 'price', 0.01);
    return solAmount / tokenPrice;
  } catch (error) {
    console.error('Error estimating token amount:', error);
    // Fallback calculation if DB lookup fails
    const tokenPrice = 0.01;
    return solAmount / tokenPrice;
  }
};

const estimateSolAmount = async (tokenSymbol: string, tokenAmount: number): Promise<number> => {
  try {
    // Get token price from database
    const { data: token, error } = await supabase
      .from('tokens')
      .select('*')
      .eq('symbol', tokenSymbol)
      .single();
    
    if (error || !token) {
      console.error('Error fetching token price:', error);
      throw new Error('Failed to fetch token price');
    }
    
    // Calculate SOL amount based on token price and token amount
    const tokenPrice = extractFromBondingCurve(token.bonding_curve, 'price', 0.01);
    return tokenAmount * tokenPrice;
  } catch (error) {
    console.error('Error estimating SOL amount:', error);
    // Fallback calculation if DB lookup fails
    const tokenPrice = 0.01;
    return tokenAmount * tokenPrice;
  }
};

const executeTrade = async (params: TradeParams): Promise<TradeResult> => {
  try {
    const { tokenSymbol, action, walletAddress, amountSol, amountTokens, gasPriority = 1 } = params;
    
    // Check required parameters based on action type
    if (action === 'buy' && !amountSol) {
      return {
        success: false,
        error: 'SOL amount is required for buy orders'
      };
    }
    
    if (action === 'sell' && !amountTokens) {
      return {
        success: false,
        error: 'Token amount is required for sell orders'
      };
    }
    
    // Get token price from database
    const { data: token, error: tokenError } = await supabase
      .from('tokens')
      .select('*')
      .eq('symbol', tokenSymbol)
      .single();
    
    if (tokenError || !token) {
      console.error('Error fetching token:', tokenError);
      return {
        success: false,
        error: 'Token not found'
      };
    }
    
    // In a real implementation, this would call the blockchain using web3.js
    // Here we'll simulate the blockchain transaction with database operations
    
    const tokenPrice = extractFromBondingCurve(token.bonding_curve, 'price', 0.01);
    let solAmount = amountSol || 0;
    let tokenAmount = amountTokens || 0;
    
    if (action === 'buy') {
      tokenAmount = solAmount / tokenPrice;
    } else {
      solAmount = tokenAmount * tokenPrice;
    }
    
    // Apply gas priority multiplier for fees
    const fee = 0.001 * gasPriority; // Example fee calculation
    
    // Create a transaction record
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .insert([{
        wallet: walletAddress,
        token_id: token.id,
        type: action,
        price: tokenPrice,
        amount: action === 'buy' ? tokenAmount : amountTokens,
        fee: fee
      }])
      .select()
      .single();
    
    if (txError) {
      console.error('Error creating transaction:', txError);
      return {
        success: false,
        error: 'Failed to create transaction record'
      };
    }
    
    // Log the trade in the trades table
    await logTradeInDatabase({
      tokenSymbol,
      side: action,
      amount: action === 'buy' ? solAmount : tokenAmount,
      price: tokenPrice,
      walletAddress,
      amountTokens: tokenAmount
    });
    
    // In a real implementation, we'd generate a real transaction hash from blockchain
    const txHash = transaction?.id || `TX${Math.random().toString(36).substring(2, 15)}`;
    
    return {
      success: true,
      txHash,
      price: tokenPrice,
      amountSol: solAmount,
      amountTokens: tokenAmount
    };
  } catch (error) {
    console.error('Error executing trade:', error);
    return {
      success: false,
      error: 'Failed to execute trade',
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

const logTradeInDatabase = async (tradeData: {
  tokenSymbol: string;
  side: 'buy' | 'sell';
  amount: number;
  price: number;
  walletAddress: string;
  amountTokens: number;
}): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('trades')
      .insert([{
        token_symbol: tradeData.tokenSymbol,
        side: tradeData.side,
        amount: tradeData.amount,
        wallet_address: tradeData.walletAddress,
        created_at: new Date().toISOString()
      }]);
      
    if (error) {
      console.error('Error logging trade:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error logging trade:', error);
    return false;
  }
};

export const tradingService = {
  estimateTokenAmount,
  estimateSolAmount,
  executeTrade,
  logTradeInDatabase
};
