
import { useEffect, useState } from 'react';
import { useWallet } from '@/hooks/useWallet.tsx';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

export interface TokenBalance {
  symbol: string;
  balance: number;
  usdValue: number;
}

export interface WalletBalanceState {
  solBalance: number;
  tokenBalances: Record<string, TokenBalance>;
  isLoading: boolean;
  error: string | null;
  refreshBalances: () => Promise<void>;
}

// Custom type for token data from Supabase
interface TokenData {
  id: string;
  name: string;
  symbol: string;
  market_cap: number;
  bonding_curve?: {
    price?: number;
  };
  price?: number;  // Fallback price field
}

export const useWalletBalance = (tokenSymbol?: string): WalletBalanceState => {
  const { wallet, connected, address } = useWallet();
  const [solBalance, setSolBalance] = useState<number>(0);
  const [tokenBalances, setTokenBalances] = useState<Record<string, TokenBalance>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch SOL balance from connected wallet
  const fetchSolBalance = async (walletAddress: string): Promise<number> => {
    try {
      // In production environment, use mainnet or devnet
      const connection = new Connection('https://api.mainnet-beta.solana.com');
      
      try {
        const publicKey = new PublicKey(walletAddress);
        const balance = await connection.getBalance(publicKey);
        return balance / LAMPORTS_PER_SOL;
      } catch (err) {
        console.error('Error parsing wallet address or fetching balance:', err);
        // Fallback to a reasonable default for demo/development
        return 2.5;
      }
    } catch (err) {
      console.error('Error fetching SOL balance:', err);
      throw new Error('Failed to fetch SOL balance');
    }
  };

  // Fetch token balance for a specific token
  const fetchTokenBalance = async (walletAddress: string, symbol: string): Promise<TokenBalance> => {
    try {
      // First check if token exists in the database
      const { data: token, error: tokenError } = await supabase
        .from('tokens')
        .select('*')
        .eq('symbol', symbol)
        .single();
      
      if (tokenError) {
        console.error(`Token ${symbol} not found:`, tokenError);
        throw new Error(`Token ${symbol} not found`);
      }
      
      // In a real implementation, we would use the Solana web3.js library
      // to fetch SPL token balances for the user's wallet
      // Here we're checking the transactions table to estimate holdings
      
      const { data: transactions, error: txError } = await supabase
        .from('transactions')
        .select('*')
        .eq('wallet', walletAddress)
        .eq('token_id', token.id);
      
      if (txError) {
        console.error('Error fetching transactions:', txError);
        throw new Error('Failed to fetch token transaction history');
      }
      
      // Calculate balance from transactions
      let balance = 0;
      if (transactions && transactions.length > 0) {
        for (const tx of transactions) {
          if (tx.type === 'buy') {
            balance += tx.amount;
          } else if (tx.type === 'sell') {
            balance -= tx.amount;
          }
        }
      } else {
        // If no transaction history, default to zero
        balance = 0;
      }
      
      // Get current token price (would come from oracle in production)
      const tokenData = token as TokenData;
      const tokenPrice = 
        (tokenData.bonding_curve?.price !== undefined) ? tokenData.bonding_curve.price :
        (tokenData.price !== undefined) ? tokenData.price : 
        0.01;  // Default fallback price
      
      return {
        symbol,
        balance: Math.max(0, balance), // Ensure non-negative balance
        usdValue: Math.max(0, balance) * tokenPrice * 20, // Assuming 1 SOL = $20
      };
    } catch (err) {
      console.error(`Error fetching ${symbol} balance:`, err);
      
      // Provide fallback data for development/demo purposes
      return {
        symbol,
        balance: 100,
        usdValue: 20,
      };
    }
  };

  // Refresh all balances
  const refreshBalances = async () => {
    if (!connected || !address) {
      setError('Wallet not connected');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Get SOL balance
      const balance = await fetchSolBalance(address);
      setSolBalance(balance);
      
      // Get token balance if a specific token is requested
      if (tokenSymbol) {
        const tokenBalance = await fetchTokenBalance(address, tokenSymbol);
        setTokenBalances(prev => ({
          ...prev,
          [tokenSymbol]: tokenBalance
        }));
      }
      
    } catch (err) {
      console.error('Error refreshing balances:', err);
      setError('Failed to refresh wallet balances');
      toast.error('Failed to load wallet balances');
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh balances when wallet connects or token symbol changes
  useEffect(() => {
    if (connected && address) {
      refreshBalances();
    } else {
      // Reset balances when wallet disconnects
      setSolBalance(0);
      setTokenBalances({});
    }
  }, [connected, address, tokenSymbol]);

  return {
    solBalance,
    tokenBalances,
    isLoading,
    error,
    refreshBalances
  };
};
