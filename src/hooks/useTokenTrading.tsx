
import { useState } from 'react';
import { toast } from 'sonner';
import { tokenTradingService, TradeParams, TradeResult, TokenTransaction, TradeHistoryFilters } from '@/services/tokenTradingService';
import { useWalletBalance } from './useWalletBalance';
import { useWallet } from './useWallet.tsx';

export interface TokenTrade {
  tokenSymbol: string;
  side: 'buy' | 'sell';
  amount: number;
  price?: number;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed' | 'confirmed'; // Added 'confirmed' to make compatible with TokenTransaction
  txHash?: string;
  amountTokens?: number; // Added to align with TokenTransaction
  amountSol?: number;    // Added to align with TokenTransaction
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
    let result: TradeResult;
    
    try {
      // Use the tokenTradingService to execute the trade
      result = await tokenTradingService.executeTrade({
        ...tradeParams,
        // Convert numeric gasPriority to string format expected by the API
        gasPriority: tradeParams.gasPriority ? 
          (typeof tradeParams.gasPriority === 'number' ? 
            (tradeParams.gasPriority <= 1 ? 'low' : 
             tradeParams.gasPriority >= 3 ? 'high' : 'medium') : 
            tradeParams.gasPriority) : 
          'medium'
      });
      
      if (result.success) {
        // Create transaction record and update local state with new trade
        const newTrade: TokenTrade = {
          tokenSymbol: tradeParams.tokenSymbol,
          side: tradeParams.action,
          amount: tradeParams.action === 'buy' 
            ? (result.amountTokens || result.amount || 0) 
            : (tradeParams.amountTokens || 0),
          price: result.price,
          timestamp: new Date().toISOString(),
          status: 'completed',
          txHash: result.txHash,
          amountTokens: result.amountTokens || (tradeParams.action === 'buy' ? result.amount : undefined),
          amountSol: result.amountSol || result.amount
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
      const history = await tokenTradingService.getUserTransactions(walletAddress);
      
      // Convert TokenTransaction[] to TokenTrade[]
      const tradeHistory: TokenTrade[] = history.map(tx => ({
        tokenSymbol: tx.tokenSymbol,
        side: tx.side || (tx.type as 'buy' | 'sell'), // Use side if available, fall back to type
        amount: tx.amount,
        price: tx.price,
        timestamp: tx.timestamp,
        status: tx.status as 'completed' | 'pending' | 'failed' | 'confirmed',
        txHash: tx.txHash,
        amountTokens: tx.amountTokens || tx.amount, // Fall back to amount if amountTokens isn't available
        amountSol: tx.amountSol || (tx.price ? tx.amount * tx.price : undefined)
      }));
      
      setTradeHistory(tradeHistory);
      return tradeHistory;
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
      gasPriority: gasPriority <= 1 ? 'low' : gasPriority >= 3 ? 'high' : 'medium'
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
      gasPriority: gasPriority <= 1 ? 'low' : gasPriority >= 3 ? 'high' : 'medium'
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
