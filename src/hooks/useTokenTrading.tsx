
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { tokenTradingService, TradeParams } from '@/services/tokenTradingService';

interface TokenTrade {
  tokenSymbol: string;
  side: 'buy' | 'sell';
  amount: number;
  price?: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  txHash?: string;
}

export interface TradeHistoryFilters {
  tokenSymbol?: string;
  side?: 'buy' | 'sell';
  startDate?: Date;
  endDate?: Date;
}

export const useTokenTrading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [trades, setTrades] = useState<TokenTrade[]>([]);
  const [tradeHistory, setTradeHistory] = useState<TokenTrade[]>([]);

  const executeTrade = async (tradeParams: TradeParams) => {
    setIsLoading(true);
    let result;
    
    try {
      // Use the tokenTradingService to execute the trade
      result = await tokenTradingService.executeTrade(tradeParams);
      
      if (result.success) {
        // Log the trade to database via the Edge Function
        await tokenTradingService.logTradeInDatabase({
          wallet_address: tradeParams.walletAddress,
          token_symbol: tradeParams.tokenSymbol,
          side: tradeParams.action,
          amount: tradeParams.action === 'buy' 
            ? result.amountTokens || 0 
            : tradeParams.amountTokens || 0
        });
        
        // Update local state with new trade
        const newTrade: TokenTrade = {
          tokenSymbol: tradeParams.tokenSymbol,
          side: tradeParams.action,
          amount: tradeParams.action === 'buy' ? (result.amountTokens || 0) : (tradeParams.amountTokens || 0),
          price: result.price,
          timestamp: new Date().toISOString(),
          status: 'completed',
          txHash: result.txHash
        };
        
        setTrades(prevTrades => [newTrade, ...prevTrades]);
      }
    } catch (error) {
      console.error("Trade execution error:", error);
      toast.error("Failed to execute trade");
      result = {
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      setIsLoading(false);
    }
    
    return result;
  };

  const fetchTradeHistory = async (walletAddress: string, filters?: TradeHistoryFilters) => {
    setIsLoading(true);
    try {
      // This will now be implemented in tokenTradingService
      const history = await tokenTradingService.getUserTransactions(walletAddress, filters);
      setTradeHistory(history);
      return history;
    } catch (error) {
      console.error("Error fetching trade history:", error);
      toast.error("Failed to fetch trading history");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    trades,
    tradeHistory,
    executeTrade,
    fetchTradeHistory
  };
};
