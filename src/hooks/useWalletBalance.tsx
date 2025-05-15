
import { useEffect, useState } from 'react';
import { useWallet } from '@/hooks/useWallet.tsx';
import { toast } from 'sonner';

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

export const useWalletBalance = (tokenSymbol?: string): WalletBalanceState => {
  const { wallet, connected, address } = useWallet();
  const [solBalance, setSolBalance] = useState<number>(0);
  const [tokenBalances, setTokenBalances] = useState<Record<string, TokenBalance>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch SOL balance from connected wallet
  const fetchSolBalance = async (walletAddress: string): Promise<number> => {
    try {
      // In a real implementation, we would use the Solana web3.js library
      // to fetch the balance from the blockchain
      // For now, we simulate this with a mock implementation
      console.log(`Fetching SOL balance for ${walletAddress}`);
      
      // Mock balance for now - in production this would use:
      // const connection = new Connection(clusterApiUrl('devnet'));
      // const balance = await connection.getBalance(new PublicKey(walletAddress));
      // return balance / LAMPORTS_PER_SOL;
      
      return Math.random() * 10 + 0.5; // Random SOL balance between 0.5 and 10.5 SOL
    } catch (err) {
      console.error('Error fetching SOL balance:', err);
      throw new Error('Failed to fetch SOL balance');
    }
  };

  // Fetch token balance for a specific token
  const fetchTokenBalance = async (walletAddress: string, symbol: string): Promise<TokenBalance> => {
    try {
      // In a real implementation, we would use the Solana web3.js library
      // and the SPL token program to fetch token balances
      console.log(`Fetching ${symbol} balance for ${walletAddress}`);
      
      // Mock implementation
      const mockBalance = Math.random() * 10000 + 100; // Between 100 and 10,100 tokens
      const mockPrice = symbol === 'PEPES' ? 0.00023 : 0.0005; // Mock price in SOL
      
      return {
        symbol,
        balance: mockBalance,
        usdValue: mockBalance * mockPrice * 20, // Assume 1 SOL = $20
      };
    } catch (err) {
      console.error(`Error fetching ${symbol} balance:`, err);
      throw new Error(`Failed to fetch ${symbol} balance`);
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
