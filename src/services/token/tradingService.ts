
import { supabase } from '@/integrations/supabase/client';
import { TradeParams, TradeResult } from './types';
import { apiClient } from '@/services/api/apiClient';
import { API_CONFIG } from '@/config/api';

// Real implementation of trading service using API
const estimateTokenAmount = async (tokenSymbol: string, solAmount: number): Promise<number> => {
  try {
    const response = await apiClient.get<{ tokenAmount: number }>(API_CONFIG.ENDPOINTS.ESTIMATE_TOKEN, {
      tokenSymbol,
      solAmount
    });
    
    return response.tokenAmount;
  } catch (error) {
    console.error('Error estimating token amount:', error);
    throw new Error('Failed to estimate token amount');
  }
};

const estimateSolAmount = async (tokenSymbol: string, tokenAmount: number): Promise<number> => {
  try {
    const response = await apiClient.get<{ solAmount: number }>(API_CONFIG.ENDPOINTS.ESTIMATE_SOL, {
      tokenSymbol,
      tokenAmount
    });
    
    return response.solAmount;
  } catch (error) {
    console.error('Error estimating SOL amount:', error);
    throw new Error('Failed to estimate SOL amount');
  }
};

const executeTrade = async (params: TradeParams): Promise<TradeResult> => {
  try {
    const { tokenSymbol, action, walletAddress, amountSol, amountTokens, gasPriority } = params;
    
    // Validate required parameters
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
    
    // Call API to execute the trade
    const tradeResponse = await apiClient.post<TradeResult>(API_CONFIG.ENDPOINTS.EXECUTE_TRADE, {
      tokenSymbol,
      side: action,
      walletAddress,
      amountSol,
      amountTokens,
      gasPriority: gasPriority || 'medium' // Default to medium if not specified
    });
    
    // Log the trade in the database
    if (tradeResponse.success) {
      await logTradeInDatabase({
        tokenSymbol,
        side: action,
        amount: tradeResponse.amount || amountSol || 0,
        price: tradeResponse.price || 0,
        walletAddress,
        amountTokens: tradeResponse.amountTokens || amountTokens || 0
      });
    }
    
    return tradeResponse;
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
