
import { useState } from 'react';
import { useWallet } from './useWallet.tsx';
import { useWalletBalance } from './useWalletBalance';
import { tokenTradingService } from '@/services/tokenTradingService';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export interface TradeParams {
  tokenSymbol: string;
  action: 'buy' | 'sell';
  amountSol?: number;
  amountTokens?: number;
  gasPriority?: number;
}

export const useTokenTrading = (tokenSymbol: string) => {
  const { connected, address } = useWallet();
  const { solBalance, tokenBalances, refreshBalances } = useWalletBalance(tokenSymbol);
  const [isLoading, setIsLoading] = useState(false);
  const [lastTxHash, setLastTxHash] = useState<string | null>(null);

  // Get token balance if available
  const tokenBalance = tokenBalances[tokenSymbol]?.balance || 0;

  // Execute buy transaction
  const buyTokens = async (amountSol: number, gasPriority: number = 1) => {
    if (!connected || !address) {
      toast.error('Wallet not connected');
      return null;
    }

    if (!amountSol || amountSol <= 0) {
      toast.error('Please enter a valid amount');
      return null;
    }

    if (amountSol > solBalance) {
      toast.error('Insufficient SOL balance');
      return null;
    }

    setIsLoading(true);
    const toastId = toast.loading(`Buying ${tokenSymbol}...`);

    try {
      // Execute trade
      const result = await tokenTradingService.executeTrade({
        walletAddress: address,
        tokenSymbol,
        action: 'buy',
        amountSol,
        gasPriority
      });

      if (result.success) {
        // Log transaction to Supabase
        await supabase.from('trades').insert({
          wallet_address: address,
          token_symbol: tokenSymbol,
          side: 'buy',
          amount: result.amountTokens || 0,
          tx_hash: result.txHash
        });

        toast.success(
          `Bought ${tokenSymbol}`, 
          { 
            id: toastId,
            description: `Purchased ${result.amountTokens?.toFixed(2)} ${tokenSymbol} for ${amountSol.toFixed(5)} SOL` 
          }
        );
        
        setLastTxHash(result.txHash || null);
        
        // Refresh balances
        setTimeout(() => refreshBalances(), 1000);
        
        return result;
      } else {
        toast.error(
          `Failed to buy ${tokenSymbol}`, 
          { id: toastId, description: result.errorMessage }
        );
        return null;
      }
    } catch (error) {
      console.error('Error buying tokens:', error);
      toast.error(
        `Failed to buy ${tokenSymbol}`, 
        { id: toastId, description: error instanceof Error ? error.message : 'Unknown error occurred' }
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Execute sell transaction
  const sellTokens = async (amountTokens: number, gasPriority: number = 1) => {
    if (!connected || !address) {
      toast.error('Wallet not connected');
      return null;
    }

    if (!amountTokens || amountTokens <= 0) {
      toast.error('Please enter a valid amount');
      return null;
    }

    if (amountTokens > tokenBalance) {
      toast.error(`Insufficient ${tokenSymbol} balance`);
      return null;
    }

    setIsLoading(true);
    const toastId = toast.loading(`Selling ${tokenSymbol}...`);

    try {
      // Execute trade
      const result = await tokenTradingService.executeTrade({
        walletAddress: address,
        tokenSymbol,
        action: 'sell',
        amountTokens,
        gasPriority
      });

      if (result.success) {
        // Log transaction to Supabase
        await supabase.from('trades').insert({
          wallet_address: address,
          token_symbol: tokenSymbol,
          side: 'sell',
          amount: amountTokens,
          tx_hash: result.txHash
        });

        toast.success(
          `Sold ${tokenSymbol}`, 
          { 
            id: toastId,
            description: `Sold ${amountTokens.toFixed(2)} ${tokenSymbol} for ${result.amountSol?.toFixed(5)} SOL` 
          }
        );
        
        setLastTxHash(result.txHash || null);
        
        // Refresh balances
        setTimeout(() => refreshBalances(), 1000);
        
        return result;
      } else {
        toast.error(
          `Failed to sell ${tokenSymbol}`, 
          { id: toastId, description: result.errorMessage }
        );
        return null;
      }
    } catch (error) {
      console.error('Error selling tokens:', error);
      toast.error(
        `Failed to sell ${tokenSymbol}`, 
        { id: toastId, description: error instanceof Error ? error.message : 'Unknown error occurred' }
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Sell all tokens
  const sellAllTokens = async (gasPriority: number = 1) => {
    if (tokenBalance <= 0) {
      toast.error(`No ${tokenSymbol} tokens to sell`);
      return null;
    }
    
    return sellTokens(tokenBalance, gasPriority);
  };

  return {
    buyTokens,
    sellTokens,
    sellAllTokens,
    isLoading,
    lastTxHash,
    solBalance,
    tokenBalance
  };
};
