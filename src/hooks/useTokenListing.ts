
import { useState } from 'react';
import { tokenTradingService } from '@/services/tokenTradingService';
import { toast } from 'sonner';

export interface TokenLaunchParams {
  name: string;
  symbol: string;
  creatorWallet: string;
  initialPrice: number;
  totalSupply: number;
}

export interface LaunchedToken {
  id: string;
  name: string;
  symbol: string;
  logo?: string;
  banner?: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  category: string[];
  holders: number;
  devWallet: string;
  holderStats: {
    whales: number;
    retail: number;
    devs: number;
  };
}

export const useTokenListing = () => {
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchedTokens, setLaunchedTokens] = useState<LaunchedToken[]>([]);

  const launchToken = async (params: TokenLaunchParams) => {
    setIsLaunching(true);
    try {
      // Convert TokenLaunchParams to format expected by the service
      const serviceParams = {
        name: params.name,
        symbol: params.symbol,
        initialSupply: params.totalSupply,
        creator: { wallet: params.creatorWallet }
      };
      
      const tokenId = await tokenTradingService.launchToken(serviceParams);
      
      if (tokenId) {
        return {
          success: true,
          tokenId: tokenId
        };
      } else {
        toast.error('Failed to launch token', { 
          description: 'Please try again later' 
        });
        return {
          success: false,
          error: 'Failed to launch token'
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error('Token launch error', { description: errorMessage });
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsLaunching(false);
    }
  };
  
  const buyInitialSupply = async (tokenId: string, walletAddress: string, amount: number) => {
    try {
      const result = await tokenTradingService.buyInitialSupply(tokenId, walletAddress, amount);
      
      if (result.success) {
        return {
          success: true,
          amountSol: result.amountSol,
          amountTokens: result.amountTokens,
        };
      } else {
        return {
          success: false,
          error: result.error || 'Failed to purchase initial supply'
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      return {
        success: false,
        error: errorMessage
      };
    }
  };
  
  const getListedTokens = async () => {
    try {
      const tokens = await tokenTradingService.getListedTokens();
      setLaunchedTokens(tokens);
      return tokens;
    } catch (error) {
      console.error('Error fetching listed tokens:', error);
      return [];
    }
  };

  return {
    launchToken,
    buyInitialSupply,
    getListedTokens,
    launchedTokens,
    isLaunching
  };
};
