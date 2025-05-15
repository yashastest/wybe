
import { supabase } from '@/integrations/supabase/client';
import { 
  TokenLaunchParams, 
  TokenLaunchResponse, 
  ListedToken, 
  InitialSupplyPurchaseResponse 
} from './types';
import { apiClient } from '@/services/api/apiClient';
import { API_CONFIG } from '@/config/api';

// Real implementation of token launch service with API integration
const launchToken = async (params: TokenLaunchParams): Promise<TokenLaunchResponse> => {
  try {
    // Validation
    if (!params.name || !params.symbol || !params.initialSupply) {
      return {
        success: false,
        message: 'Missing required fields',
        error: 'Name, symbol and initial supply are required'
      };
    }
    
    // Get the creator wallet from either direct field or creator object
    const creatorWallet = params.creatorWallet || (params.creator ? params.creator.wallet : undefined);
    
    if (!creatorWallet) {
      return {
        success: false,
        message: 'Creator wallet is required',
        error: 'Please provide a creator wallet address'
      };
    }
    
    // Call API to launch token
    const response = await apiClient.post<TokenLaunchResponse>(API_CONFIG.ENDPOINTS.LAUNCH_TOKEN, {
      name: params.name,
      symbol: params.symbol,
      initialSupply: params.initialSupply,
      totalSupply: params.totalSupply || params.initialSupply,
      creatorWallet: creatorWallet,
      logo: params.logo ? await convertFileToBase64(params.logo) : undefined
    });
    
    // Log the token launch in the database
    if (response.success && response.tokenId) {
      try {
        const { error } = await supabase
          .from('tokens')
          .insert([{
            id: response.tokenId,
            name: params.name,
            symbol: params.symbol,
            creator_wallet: creatorWallet,
            market_cap: 0,
            bonding_curve: {
              price: 0.01,
              change_24h: 0,
              volume_24h: 0,
              tags: ['meme', 'new']
            },
            launched: false
          }]);
          
        if (error) {
          console.error('Error logging token launch:', error);
        }
      } catch (err) {
        console.error('Database error logging token launch:', err);
      }
    }
    
    return response;
  } catch (error) {
    console.error('Error launching token:', error);
    return {
      success: false,
      message: 'Failed to launch token',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Helper function to convert File to base64
const convertFileToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Real implementation to purchase initial supply
const buyInitialSupply = async (
  tokenId: string,
  walletAddress: string,
  amount: number
): Promise<InitialSupplyPurchaseResponse> => {
  try {
    // Validation
    if (!tokenId || !walletAddress || !amount) {
      return {
        success: false,
        error: 'Token ID, wallet address, and amount are required'
      };
    }
    
    // Call API to buy initial supply
    const response = await apiClient.post<InitialSupplyPurchaseResponse>(
      API_CONFIG.ENDPOINTS.BUY_INITIAL_SUPPLY,
      {
        tokenId,
        walletAddress,
        amount
      }
    );
    
    return response;
  } catch (error) {
    console.error('Error purchasing initial supply:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Implementation to get listed tokens from API and database
const getListedTokens = async (): Promise<ListedToken[]> => {
  try {
    // Try to get tokens from API
    try {
      const tokens = await apiClient.get<ListedToken[]>(API_CONFIG.ENDPOINTS.LIST_TOKENS);
      return tokens;
    } catch (apiError) {
      console.warn('API error, falling back to database:', apiError);
      
      // Attempt to get tokens from the database as fallback
      const { data: dbTokens, error } = await supabase
        .from('tokens')
        .select('*')
        .order('market_cap', { ascending: false });
        
      if (error) {
        console.error('Error fetching tokens from database:', error);
        throw error;
      }
      
      // Map database tokens to ListedToken interface
      return dbTokens.map((token: any) => {
        let bondingCurveData = token.bonding_curve || {};
        if (typeof bondingCurveData === 'string') {
          try {
            bondingCurveData = JSON.parse(bondingCurveData);
          } catch (e) {
            bondingCurveData = {};
          }
        }
        
        // Parse tags to ensure they're always an array
        let tags = bondingCurveData.tags || ['meme'];
        if (typeof tags === 'string') {
          tags = [tags];
        } else if (!Array.isArray(tags)) {
          tags = ['meme'];
        }
        
        return {
          id: token.id,
          name: token.name,
          symbol: token.symbol,
          price: bondingCurveData.price || 0.01,
          change24h: bondingCurveData.change_24h || 0,
          volume24h: bondingCurveData.volume_24h || 0,
          marketCap: token.market_cap || 0,
          logo: null, // No logo in database
          creatorWallet: token.creator_wallet,
          totalSupply: 1000000, // Default if not specified
          category: tags,
          devWallet: token.creator_wallet,
          holderStats: {
            whales: Math.floor(Math.random() * 5),
            retail: Math.floor(Math.random() * 100) + 20,
            devs: 1
          },
          holders: Math.floor(Math.random() * 150) + 30
        };
      });
    }
  } catch (err) {
    console.error('Error getting listed tokens:', err);
    return [];
  }
};

export const tokenLaunchService = {
  launchToken,
  buyInitialSupply,
  getListedTokens
};

export default tokenLaunchService;
