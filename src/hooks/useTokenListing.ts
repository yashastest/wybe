
import { useState } from 'react';
import { tokenTradingService, ListedToken } from '@/services/tokenTradingService';
import { toast } from 'sonner';
import { TokenLaunchParams } from '@/services/token/types';

export interface LaunchedToken extends Omit<ListedToken, 'id'> {
  id: string;
  banner?: string;
}

export const useTokenListing = () => {
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchedTokens, setLaunchedTokens] = useState<LaunchedToken[]>([]);

  const launchToken = async (tokenParams: TokenLaunchParams) => {
    setIsLaunching(true);
    
    try {
      // Make sure we use the correct properties based on the updated type
      const response = await tokenTradingService.launchToken({
        ...tokenParams,
        initialSupply: tokenParams.initialSupply || tokenParams.totalSupply,
        creatorWallet: tokenParams.creatorWallet || tokenParams.creatorAddress || 
          (tokenParams.creator?.wallet || ''),
      });
      
      if (response.success) {
        toast.success('Token launched successfully', {
          description: `${tokenParams.name} (${tokenParams.symbol}) has been launched.`
        });
        
        return {
          success: true,
          tokenId: response.tokenId
        };
      } else {
        toast.error('Failed to launch token', { 
          description: response.error || response.message || 'Please try again later'
        });
        return {
          success: false,
          error: response.error || response.message || 'Failed to launch token'
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
        toast.success('Initial supply purchased', {
          description: `You have purchased ${result.amountTokens} tokens for ${result.amountSol} SOL.`
        });
        
        return {
          success: true,
          amountSol: result.amountSol,
          amountTokens: result.amountTokens,
        };
      } else {
        toast.error('Failed to purchase initial supply', {
          description: result.error || 'Please try again later'
        });
        
        return {
          success: false,
          error: result.error || 'Failed to purchase initial supply'
        };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error('Purchase error', { description: errorMessage });
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
        id: token.id,  // id is now required in both types
        banner: token.banner || undefined
      }));
      
      setLaunchedTokens(launchedTokensData);
      return launchedTokensData;
    } catch (error) {
      console.error('Error fetching listed tokens:', error);
      toast.error('Failed to fetch tokens', {
        description: 'Please try again later'
      });
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
