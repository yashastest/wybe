
import { useState } from 'react';
import { tokenTradingService } from '@/services/tokenTradingService';
import { toast } from 'sonner';
import { TokenLaunchParams, TradeResult, ListedToken } from '@/services/token/types';

// LaunchedToken can extend the imported ListedToken directly
export interface LaunchedToken extends ListedToken {
  // banner is already optional in ListedToken from types.ts
  // id is already required in ListedToken from types.ts
}

export const useTokenListing = () => {
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchedTokens, setLaunchedTokens] = useState<LaunchedToken[]>([]);

  const launchToken = async (tokenParams: TokenLaunchParams) => {
    setIsLaunching(true);
    
    try {
      // tokenTradingService.launchToken should conform to (TokenLaunchParams) => Promise<TokenLaunchResult>
      const response = await tokenTradingService.launchToken(tokenParams);
      
      if (response.success) {
        toast.success('Token launched successfully', {
          description: `${tokenParams.name} (${tokenParams.symbol}) has been launched.`
        });
        
        return {
          success: true,
          tokenId: response.tokenId, // tokenId is optional in TokenLaunchResult
          contractAddress: response.contractAddress // contractAddress is optional
        };
      } else {
        toast.error('Failed to launch token', { 
          description: response.error || 'Please try again later'
        });
        return {
          success: false,
          error: response.error || 'Failed to launch token'
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
  
  const buyInitialSupply = async (tokenId: string, walletAddress: string, amountSol: number): Promise<Partial<TradeResult> & { success: boolean; error?: string }> => {
    try {
      // Fix: tokenTradingService.buyInitialSupply expects tokenSymbol, not an object
      const result = await tokenTradingService.buyInitialSupply(tokenId, amountSol);
      
      if (result.success) {
        toast.success('Initial supply purchased', {
          description: `You have purchased ${result.amountTokens || 0} tokens for ${result.amountSol || 0} SOL.`
        });
        
        return {
          success: true,
          amountSol: result.amountSol,
          amountTokens: result.amountTokens,
          txHash: result.txHash,
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
  
  const getListedTokens = async (): Promise<LaunchedToken[]> => {
    try {
      const tokens: ListedToken[] = await tokenTradingService.getListedTokens();
      
      // ListedToken from service already matches LaunchedToken structure (as banner, id are handled)
      // So direct cast or map is fine.
      const launchedTokensData: LaunchedToken[] = tokens.map(token => ({
        ...token,
        // id is already part of token
        // banner is already part of token (optional)
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
