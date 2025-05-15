
import { useState } from 'react';
import { toast } from 'sonner';
import { tokenTradingService, TradeParams } from '@/services/tokenTradingService';
import { useWalletBalance } from './useWalletBalance';
import { useWallet } from './useWallet.tsx';

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

export const useTokenTrading = (tokenSymbol?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [trades, setTrades] = useState<TokenTrade[]>([]);
  const [tradeHistory, setTradeHistory] = useState<TokenTrade[]>([]);
  const { address } = useWallet();
  const { solBalance: walletSolBalance, tokenBalances } = useWalletBalance(tokenSymbol);
  
  // Calculate token balance from wallet
  const tokenBalance = tokenSymbol && tokenBalances[tokenSymbol] 
    ? tokenBalances[tokenSymbol].balance 
    : 0;
  
  // Use the wallet sol balance from useWalletBalance
  const solBalance = walletSolBalance || 0;

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
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    } finally {
      setIsLoading(false);
    }
    
    return result;
  };

  const fetchTradeHistory = async (walletAddress: string, filters?: TradeHistoryFilters) => {
    setIsLoading(true);
    try {
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
  
  // Add missing methods required by EnhancedTradingInterface
  const buyTokens = async (amountSol: number, gasPriority: number = 1) => {
    if (!address) {
      toast.error("Wallet not connected");
      return { success: false, error: "Wallet not connected" };
    }
    
    return executeTrade({
      walletAddress: address,
      tokenSymbol: tokenSymbol || '',
      action: 'buy',
      amountSol: amountSol,
      gasPriority
    });
  };
  
  const sellTokens = async (amountTokens: number, gasPriority: number = 1) => {
    if (!address) {
      toast.error("Wallet not connected");
      return { success: false, error: "Wallet not connected" };
    }
    
    return executeTrade({
      walletAddress: address,
      tokenSymbol: tokenSymbol || '',
      action: 'sell',
      amountTokens: amountTokens,
      gasPriority
    });
  };
  
  const sellAllTokens = async (gasPriority: number = 1) => {
    if (!address || !tokenSymbol) {
      toast.error("Wallet not connected or token not specified");
      return { success: false, error: "Wallet not connected or token not specified" };
    }
    
    // Get current token balance
    const currentBalance = tokenBalance;
    
    if (currentBalance <= 0) {
      toast.error("No tokens to sell");
      return { success: false, error: "No tokens to sell" };
    }
    
    return sellTokens(currentBalance, gasPriority);
  };

  return {
    isLoading,
    trades,
    tradeHistory,
    executeTrade,
    fetchTradeHistory,
    // Add these properties needed by EnhancedTradingInterface
    buyTokens,
    sellTokens,
    sellAllTokens,
    solBalance,
    tokenBalance
  };
};
