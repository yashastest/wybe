
import { useState } from 'react';
import { tokenTradingService } from '@/services/tokenTradingService';
import { toast } from 'sonner';
import { ListedToken, TokenLaunchParams } from '@/services/token/types';

export interface LaunchedToken extends ListedToken {
  banner?: string;
}

export const useTokenListing = () => {
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchedTokens, setLaunchedTokens] = useState<LaunchedToken[]>([]);

  const launchToken = async (params: TokenLaunchParams) => {
    setIsLaunching(true);
    try {
      // Convert from UI params to service params
      const serviceParams: TokenLaunchParams = {
        name: params.name,
        symbol: params.symbol,
        initialSupply: params.initialSupply,
        totalSupply: params.totalSupply || params.initialSupply, // Use initialSupply as fallback
        creatorWallet: params.creatorWallet || params.creator?.wallet // Support both formats
      };
      
      const result = await tokenTradingService.launchToken(serviceParams);
      
      if (result.success) {
        return {
          success: true,
          tokenId: result.tokenId
        };
      } else {
        toast.error('Failed to launch token', { 
          description: 'Please try again later' 
        });
        return {
          success: false,
          error: result.error || 'Failed to launch token'
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
      
      // Convert ListedToken[] to LaunchedToken[]
      const launchedTokensData: LaunchedToken[] = tokens.map(token => ({
        ...token,
        banner: undefined // Add banner property to match LaunchedToken interface
      }));
      
      setLaunchedTokens(launchedTokensData);
      return launchedTokensData;
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
