
import { supabase } from '@/integrations/supabase/client';
import { ListedToken, TokenLaunchParams } from './types';

// Function to launch a new token
const launchToken = async (params: TokenLaunchParams) => {
  try {
    const { name, symbol, creatorWallet, initialPrice, totalSupply } = params;
    
    // Validate inputs
    if (!name || !symbol || !creatorWallet) {
      return {
        success: false,
        error: 'Missing required parameters'
      };
    }
    
    // Check if token symbol already exists
    const { data: existingTokens, error: checkError } = await supabase
      .from('tokens')
      .select('symbol')
      .eq('symbol', symbol);
    
    if (checkError) {
      console.error("Error checking existing tokens:", checkError);
      return {
        success: false,
        error: 'Failed to validate token symbol'
      };
    }
    
    if (existingTokens && existingTokens.length > 0) {
      return {
        success: false,
        error: `Token symbol '${symbol}' is already in use`
      };
    }
    
    // Create bonding curve configuration
    const bondingCurve = {
      type: 'linear',
      initialPrice,
      totalSupply,
      currentSupply: 0,
      params: {
        slope: 0.0001
      }
    };
    
    // Insert new token into database
    const { data, error } = await supabase
      .from('tokens')
      .insert([
        { 
          name, 
          symbol, 
          creator_wallet: creatorWallet, 
          bonding_curve: bondingCurve,
          launched: false,
          market_cap: 0
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error("Error launching token:", error);
      return {
        success: false,
        error: 'Failed to launch token'
      };
    }
    
    return {
      success: true,
      tokenId: data.id,
      message: `Token ${symbol} has been created and is ready for initial funding`
    };
  } catch (error) {
    console.error("Token launch error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Function to buy initial supply of tokens
const buyInitialSupply = async (tokenId: string, walletAddress: string, amount: number) => {
  try {
    // Get token details
    const { data: tokenData, error: tokenError } = await supabase
      .from('tokens')
      .select('*')
      .eq('id', tokenId)
      .single();
    
    if (tokenError || !tokenData) {
      console.error("Error fetching token details:", tokenError);
      return {
        success: false,
        error: 'Token not found'
      };
    }
    
    // Calculate token amount based on bonding curve
    const bondingCurve = tokenData.bonding_curve;
    const initialPrice = bondingCurve.initialPrice || 0.0001;
    const amountTokens = amount / initialPrice;
    
    // Update token with launch info
    const { error: updateError } = await supabase
      .from('tokens')
      .update({ 
        launched: true,
        launch_date: new Date().toISOString(),
        market_cap: amount
      })
      .eq('id', tokenId);
    
    if (updateError) {
      console.error("Error updating token launch status:", updateError);
      return {
        success: false,
        error: 'Failed to update token launch status'
      };
    }
    
    // Record the initial purchase transaction
    const { error: txError } = await supabase
      .from('transactions')
      .insert([{
        wallet: walletAddress,
        token_id: tokenId,
        type: 'initial_purchase',
        amount: amountTokens,
        price: initialPrice,
        fee: 0 // No fee on initial purchase
      }]);
    
    if (txError) {
      console.error("Error recording initial purchase:", txError);
      // Continue despite the error - the token is launched
    }
    
    return {
      success: true,
      amountSol: amount,
      amountTokens,
      tokenSymbol: tokenData.symbol,
      message: `Successfully purchased ${amountTokens.toFixed(2)} ${tokenData.symbol} tokens`
    };
  } catch (error) {
    console.error("Initial supply purchase error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Enhanced function to get listed tokens with improved error handling and sorting
const getListedTokens = async (): Promise<ListedToken[]> => {
  try {
    // Fetch tokens from database
    const { data, error } = await supabase
      .from('tokens')
      .select('*')
      .eq('launched', true)
      .order('launch_date', { ascending: false });
    
    if (error) {
      console.error("Error fetching tokens:", error);
      return [];
    }
    
    if (!data || data.length === 0) {
      // Return demo data if no tokens found
      return getDemoTokens();
    }
    
    // Fetch transaction data for volume calculation
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Map tokens to the ListedToken interface
    const listedTokens: ListedToken[] = await Promise.all(data.map(async (token) => {
      // Get transaction volume for this token in the last 24 hours
      const { data: txData, error: txError } = await supabase
        .from('trades')
        .select('amount')
        .eq('token_symbol', token.symbol)
        .gte('created_at', yesterday.toISOString());
      
      let volume24h = 0;
      if (!txError && txData) {
        volume24h = txData.reduce((sum, tx) => sum + Number(tx.amount), 0);
      }
      
      // Calculate price based on bonding curve if available
      let price = 0.0001;
      let change24h = Math.random() * 20 - 10; // Random change between -10% and +10%
      
      if (token.bonding_curve) {
        price = token.bonding_curve.initialPrice || price;
        // In a real system, this would be calculated based on supply changes
      }
      
      // Count holders (distinct wallets in transactions)
      const { data: holdersData, error: holdersError } = await supabase
        .from('trades')
        .select('wallet_address')
        .eq('token_symbol', token.symbol)
        .eq('side', 'buy');
      
      let holders = 10; // Default
      if (!holdersError && holdersData) {
        const uniqueWallets = new Set(holdersData.map(tx => tx.wallet_address));
        holders = uniqueWallets.size;
      }
      
      return {
        id: token.id,
        name: token.name,
        symbol: token.symbol,
        logo: null, // Would be fetched from storage
        banner: null,
        price,
        change24h,
        marketCap: token.market_cap || price * 1000000, // Estimate market cap
        volume24h,
        category: ['meme', 'social'],
        holders,
        devWallet: token.creator_wallet,
        holderStats: {
          whales: Math.floor(holders * 0.1), // 10% are whales
          retail: Math.floor(holders * 0.8), // 80% are retail
          devs: Math.floor(holders * 0.1) // 10% are devs
        },
        launchDate: token.launch_date || new Date().toISOString()
      };
    }));
    
    return listedTokens;
  } catch (error) {
    console.error("Error getting listed tokens:", error);
    return getDemoTokens();
  }
};

// Function to get demo tokens
const getDemoTokens = (): ListedToken[] => {
  return [
    {
      id: '1',
      name: 'Pepe Sol',
      symbol: 'PEPES',
      logo: '/lovable-uploads/11c9cd9c-16fc-462c-912b-bd90bbd2bd17.png',
      banner: null,
      price: 0.000134,
      change24h: 12.5,
      marketCap: 1450000,
      volume24h: 320000,
      category: ['meme', 'frog'],
      holders: 3500,
      devWallet: '0x1234...5678',
      holderStats: {
        whales: 35,
        retail: 3430,
        devs: 35
      },
      launchDate: '2025-05-01T12:00:00Z'
    },
    {
      id: '2',
      name: 'Moon Boys',
      symbol: 'MBOY',
      logo: '/lovable-uploads/5f8a8eb9-3963-4b1b-8ca5-2beecbb60b39.png',
      banner: null,
      price: 0.000089,
      change24h: -3.2,
      marketCap: 890000,
      volume24h: 150000,
      category: ['meme', 'astronaut'],
      holders: 2100,
      devWallet: '0x2345...6789',
      holderStats: {
        whales: 21,
        retail: 2058,
        devs: 21
      },
      launchDate: '2025-05-05T12:00:00Z'
    },
    {
      id: '3',
      name: 'Degen Warriors',
      symbol: 'DWAR',
      logo: '/lovable-uploads/a8831646-bbf0-4510-9f62-5999db7cca5d.png',
      banner: null,
      price: 0.000254,
      change24h: 8.7,
      marketCap: 2540000,
      volume24h: 420000,
      category: ['meme', 'gaming'],
      holders: 4200,
      devWallet: '0x3456...7890',
      holderStats: {
        whales: 42,
        retail: 4116,
        devs: 42
      },
      launchDate: '2025-04-28T12:00:00Z'
    }
  ];
};

export const tokenLaunchService = {
  launchToken,
  buyInitialSupply,
  getListedTokens
};
