import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ListedToken, TokenLaunchParams, TokenLaunchResponse, InitialSupplyPurchaseResponse } from './types';

export interface TokenLaunchOptions {
  name: string;
  symbol: string;
  initialSupply: number;
  bondingCurve?: {
    type: 'linear' | 'exponential' | 'logarithmic';
    initialPrice?: number;
    params?: Record<string, number>;
  };
  creator: {
    wallet: string;
    email?: string;
  };
}

export interface TokenDetails {
  id: string;
  name: string;
  symbol: string;
  initialSupply?: number;
  currentSupply?: number;
  marketCap?: number;
  launchDate?: string;
  creatorWallet: string;
  tokenAddress?: string;
  bondingCurve?: {
    type: 'linear' | 'exponential' | 'logarithmic';
    initialPrice?: number;
    params?: Record<string, number>;
  };
  launched?: boolean;
}

// Get token by ID
const getTokenById = async (id: string): Promise<TokenDetails | null> => {
  try {
    const { data, error } = await supabase
      .from('tokens')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) {
      throw error;
    }
    
    if (!data) {
      return null;
    }

    // Type assertion to handle expected database fields
    const tokenData = data as any;
    
    const tokenDetails: TokenDetails = {
      id: tokenData.id,
      name: tokenData.name,
      symbol: tokenData.symbol,
      initialSupply: tokenData.initial_supply || 0,
      currentSupply: tokenData.current_supply || 0,
      marketCap: tokenData.market_cap,
      launchDate: tokenData.launch_date,
      creatorWallet: tokenData.creator_wallet,
      tokenAddress: tokenData.token_address,
      launched: tokenData.launched,
      bondingCurve: tokenData.bonding_curve ? tokenData.bonding_curve as TokenDetails['bondingCurve'] : undefined,
    };
    
    return tokenDetails;
  } catch (error) {
    console.error('Error fetching token:', error);
    return null;
  }
};

// Create a new token
const createToken = async (options: TokenLaunchOptions): Promise<string | null> => {
  try {
    // Create bonding curve data
    const bondingCurveData = options.bondingCurve || {
      type: 'linear',
      initialPrice: 0.001,
      params: { slope: 0.0001 }
    };
    
    // Construct token data
    const tokenData = {
      name: options.name,
      symbol: options.symbol.toUpperCase(),
      creator_wallet: options.creator.wallet,
      initial_supply: options.initialSupply,
      current_supply: options.initialSupply,
      market_cap: 0,
      launched: false,
      bonding_curve: bondingCurveData
    };
    
    // Insert into database
    const { data, error } = await supabase
      .from('tokens')
      .insert([tokenData])
      .select();
      
    if (error) {
      throw error;
    }
    
    return data[0].id;
  } catch (error) {
    console.error('Error creating token:', error);
    toast.error('Failed to create token');
    return null;
  }
};

// Get token price
const getTokenPrice = (token: TokenDetails): number => {
  if (!token.bondingCurve) {
    return 0.001; // Default price
  }
  
  const bondingCurve = token.bondingCurve;
  let initialPrice = 0.001; // Default initial price
  
  // Check if bondingCurve is an object and has initialPrice property
  if (typeof bondingCurve === 'object' && bondingCurve !== null && 'initialPrice' in bondingCurve) {
    initialPrice = Number(bondingCurve.initialPrice) || initialPrice;
  }
  
  // Calculate price based on bonding curve type
  if (!token.currentSupply) {
    return initialPrice;
  }
  
  const currentSupply = token.currentSupply;
  
  if (typeof bondingCurve === 'object' && bondingCurve !== null && bondingCurve.type) {
    switch (bondingCurve.type) {
      case 'linear':
        return initialPrice + (currentSupply * 0.0001);
      case 'exponential':
        return initialPrice * Math.pow(1.0001, currentSupply);
      case 'logarithmic':
        return initialPrice + (Math.log(currentSupply + 1) * 0.01);
      default:
        return initialPrice;
    }
  }
  
  return initialPrice;
};

// Launch token
const launchToken = async (params: TokenLaunchParams): Promise<TokenLaunchResponse> => {
  try {
    // Create token options from params
    const tokenOptions: TokenLaunchOptions = {
      name: params.name,
      symbol: params.symbol,
      initialSupply: params.initialSupply,
      creator: {
        wallet: params.creatorWallet || (params.creator ? params.creator.wallet : ''),
        email: params.creator?.email
      }
    };

    // Create token first
    const tokenId = await createToken(tokenOptions);

    if (!tokenId) {
      return { 
        success: false,
        message: 'Failed to create token',
        error: 'Failed to create token'
      };
    }

    // Update token as launched
    const { error } = await supabase
      .from('tokens')
      .update({
        launched: true,
        launch_date: new Date().toISOString(),
        token_address: `TOKEN${Math.floor(Math.random() * 1000000000)}` // Mock token address
      })
      .eq('id', tokenId);
      
    if (error) {
      throw error;
    }
    
    return { 
      success: true,
      message: 'Token launched successfully',
      tokenId
    };
  } catch (error) {
    console.error('Error launching token:', error);
    toast.error('Failed to launch token');
    return {
      success: false,
      message: 'Failed to launch token',
      error: error instanceof Error ? error.message : 'Failed to launch token'
    };
  }
};

// Buy initial supply
const buyInitialSupply = async (tokenId: string, walletAddress: string, amount: number): Promise<InitialSupplyPurchaseResponse> => {
  try {
    const token = await getTokenById(tokenId);
    
    if (!token) {
      return {
        success: false,
        error: "Token not found"
      };
    }
    
    // Calculate price based on bonding curve
    const tokenPrice = getTokenPrice(token);
    
    // Calculate token amount
    const amountTokens = amount / tokenPrice;
    
    // Simulate transaction
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Insert transaction record
    const { error } = await supabase
      .from('transactions')
      .insert({
        wallet: walletAddress,
        token_id: tokenId,
        type: 'buy',
        amount: amountTokens,
        price: tokenPrice,
        fee: amount * 0.01 // 1% fee
      });
      
    if (error) {
      throw error;
    }
    
    return {
      success: true,
      amountSol: amount,
      amountTokens
    };
  } catch (error) {
    console.error('Error buying initial supply:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Get token listing
const getTokenListing = async (limit: number = 10): Promise<TokenDetails[]> => {
  try {
    const { data, error } = await supabase
      .from('tokens')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);
      
    if (error) {
      throw error;
    }
    
    return data.map((token: any) => {
      // Handle bondingCurve conversion
      let bondingCurveData = null;
      
      if (token.bonding_curve) {
        // Convert from various possible formats to our expected format
        if (typeof token.bonding_curve === 'string') {
          try {
            bondingCurveData = JSON.parse(token.bonding_curve);
          } catch (e) {
            bondingCurveData = { type: 'linear', initialPrice: 0.001 };
          }
        } else if (typeof token.bonding_curve === 'object') {
          bondingCurveData = token.bonding_curve;
        }
      } else {
        bondingCurveData = { type: 'linear', initialPrice: 0.001 };
      }
      
      return {
        id: token.id,
        name: token.name,
        symbol: token.symbol,
        initialSupply: token.initial_supply,
        currentSupply: token.current_supply,
        marketCap: token.market_cap,
        launchDate: token.launch_date,
        creatorWallet: token.creator_wallet,
        tokenAddress: token.token_address,
        launched: token.launched,
        bondingCurve: bondingCurveData
      };
    });
  } catch (error) {
    console.error('Error fetching token listing:', error);
    return [];
  }
};

// Get listed tokens for trading interface
const getListedTokens = async (): Promise<ListedToken[]> => {
  try {
    const { data, error } = await supabase
      .from('tokens')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);
      
    if (error) {
      throw error;
    }
    
    return data.map((token: any) => {
      // Create mock holder stats for demonstration
      const mockHolderStats = {
        whales: Math.floor(Math.random() * 10) + 1,
        retail: Math.floor(Math.random() * 90) + 10,
        devs: Math.floor(Math.random() * 5) + 1
      };

      // Convert to a ListedToken with all required properties
      const tokenDetails: ListedToken = {
        id: token.id,
        name: token.name,
        symbol: token.symbol,
        price: 0.001,
        change24h: Math.random() * 10 - 5, // Mock data
        marketCap: token.market_cap || 0,
        volume24h: Math.random() * 1000, // Mock data
        logo: null,
        creatorWallet: token.creator_wallet,
        totalSupply: token.initial_supply || 1000000, // Default value if not provided
        holders: Math.floor(Math.random() * 100) + 10, // Mock data
        holderStats: mockHolderStats,
        category: ['memecoin', 'trending'], // Default categories
        devWallet: token.creator_wallet // Use creator_wallet as devWallet as a fallback
      };
      
      // Calculate price if we have a bonding curve
      if (token.current_supply && token.bonding_curve) {
        const tokenObj: TokenDetails = {
          id: token.id,
          name: token.name,
          symbol: token.symbol,
          initialSupply: token.initial_supply || 0,
          currentSupply: token.current_supply || 0,
          creatorWallet: token.creator_wallet,
          bondingCurve: token.bonding_curve as TokenDetails['bondingCurve']
        };
        tokenDetails.price = getTokenPrice(tokenObj);
      }
      
      return tokenDetails;
    });
  } catch (error) {
    console.error('Error fetching listed tokens:', error);
    return [];
  }
};

export const tokenLaunchService = {
  getTokenById,
  createToken,
  getTokenPrice,
  launchToken,
  getTokenListing,
  buyInitialSupply,
  getListedTokens
};

export default tokenLaunchService;
