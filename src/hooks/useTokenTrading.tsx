
import { useState } from 'react';
import { toast } from 'sonner';
import { tokenTradingService } from '@/services/tokenTradingService';
import { TradeParams, TradeResult, TokenTransaction, TradeHistoryFilters } from '@/services/token/types'; // Updated import
import { useWalletBalance } from './useWalletBalance';
import { useWallet } from './useWallet.tsx';

export interface TokenTrade {
  id?: string;               // Added to match TokenTransaction
  txHash?: string;
  tokenSymbol: string;
  tokenName?: string;        // Added to match TokenTransaction
  side: 'buy' | 'sell';
  type?: 'buy' | 'sell';     // Added to match TokenTransaction
  amount: number;
  amountUsd?: number;        // Added to match TokenTransaction
  price?: number;
  fee?: number;              // Added to match TokenTransaction
  timestamp: string;
  walletAddress?: string;    // Added to match TokenTransaction
  status: 'pending' | 'completed' | 'failed' | 'confirmed';
  amountTokens?: number;
  amountSol?: number;
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
          id: result.txHash || new Date().toISOString(), // Ensure there's always an ID
          tokenSymbol: tradeParams.tokenSymbol,
          tokenName: tradeParams.tokenSymbol, // Use symbol as name if needed
          type: tradeParams.action,
          side: tradeParams.action,
          amount: tradeParams.action === 'buy' 
            ? (result.amountTokens || result.amount || 0) 
            : (tradeParams.amountTokens || 0),
          amountUsd: (result.amount || 0) * (result.price || 0),
          price: result.price,
          fee: result.fee || 0,
          timestamp: new Date().toISOString(),
          status: 'completed',
          txHash: result.txHash,
          walletAddress: tradeParams.walletAddress,
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
      
      // Convert TokenTransaction[] to TokenTrade[] with all required fields
      const tradeHistory: TokenTrade[] = history.map(tx => ({
        id: tx.id,
        tokenSymbol: tx.tokenSymbol,
        tokenName: tx.tokenName,
        side: tx.side || (tx.type as 'buy' | 'sell'),
        type: tx.type,
        amount: tx.amount,
        amountUsd: tx.amountUsd,
        price: tx.price,
        fee: tx.fee,
        timestamp: tx.timestamp,
        status: tx.status === 'confirmed' ? tx.status : (tx.status === 'pending' ? tx.status : (tx.status === 'failed' ? tx.status : 'completed')),
        txHash: tx.txHash,
        walletAddress: tx.walletAddress,
        amountTokens: tx.amountTokens || tx.amount,
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
    tokenBalance: typeof tokenBalance === 'number' ? tokenBalance : 0
  };
};
