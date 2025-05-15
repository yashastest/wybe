
import { supabase } from '@/integrations/supabase/client';
import { ListedToken } from './types';

// Adding functions for token launching
const launchToken = async ({
  name,
  symbol,
  creatorWallet,
  initialPrice,
  totalSupply
}: {
  name: string;
  symbol: string;
  creatorWallet: string;
  initialPrice: number;
  totalSupply: number;
}) => {
  try {
    // Actual implementation would create a token on the blockchain
    // For now, we'll just insert a record in the tokens table
    const { data, error } = await supabase
      .from('tokens')
      .insert([
        {
          name,
          symbol: symbol.toUpperCase(),
          creator_wallet: creatorWallet,
          bonding_curve: { type: 'linear', initial_price: initialPrice },
          market_cap: initialPrice * totalSupply,
          created_at: new Date().toISOString(),
          launch_date: null,
          launched: false
        }
      ])
      .select()
      .single();
    
    if (error) {
      console.error("Error launching token:", error);
      return {
        success: false,
        error: error.message
      };
    }
    
    return {
      success: true,
      tokenId: data.id,
      tokenAddress: `sol_${Math.random().toString(36).substring(2, 15)}`,
      txHash: `tx_${Math.random().toString(36).substring(2, 15)}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

const buyInitialSupply = async (
  tokenId: string,
  walletAddress: string,
  amountSol: number
) => {
  try {
    // In a real implementation, this would interact with the blockchain
    // For now, we'll update the token record in the database
    
    // First, get the token details
    const { data: token, error: tokenError } = await supabase
      .from('tokens')
      .select('*')
      .eq('id', tokenId)
      .single();
    
    if (tokenError || !token) {
      console.error("Error fetching token:", tokenError);
      return {
        success: false,
        error: tokenError?.message || 'Token not found'
      };
    }
    
    // Get the initial price from the bonding curve
    const initialPrice = token.bonding_curve && 
                         typeof token.bonding_curve === 'object' && 
                         'initial_price' in token.bonding_curve ? 
                         (token.bonding_curve as any).initial_price : 0.0001;
    
    // Calculate token amount based on initial price
    const tokensReceived = amountSol / initialPrice;
    
    // Update token record
    const { error: updateError } = await supabase
      .from('tokens')
      .update({ 
        launched: true,
        launch_date: new Date().toISOString(),
      })
      .eq('id', tokenId);
    
    if (updateError) {
      console.error("Error updating token:", updateError);
      return {
        success: false,
        error: updateError.message
      };
    }
    
    // Log the initial buy transaction
    const { error: transactionError } = await supabase
      .from('transactions')
      .insert([
        {
          wallet: walletAddress,
          token_id: tokenId,
          type: 'buy',
          amount: tokensReceived,
          price: initialPrice,
          fee: amountSol * 0.02, // 2% fee
        }
      ]);
    
    if (transactionError) {
      console.error("Error logging transaction:", transactionError);
      // Continue anyway as the token is launched
    }
    
    return {
      success: true,
      amountSol,
      amountTokens: tokensReceived,
      txHash: `tx_${Math.random().toString(36).substring(2, 15)}`,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

const getListedTokens = async (): Promise<ListedToken[]> => {
  try {
    // Get launched tokens from the database
    const { data, error } = await supabase
      .from('tokens')
      .select('*')
      .eq('launched', true)
      .order('launch_date', { ascending: false });
    
    if (error) {
      console.error("Error fetching tokens:", error);
      return [];
    }
    
    // Get transaction counts for each token to determine holder stats
    const tokens: ListedToken[] = await Promise.all(data.map(async (token) => {
      // Get transaction counts (in a real implementation, this would be more sophisticated)
      const { count: transactionCount, error: countError } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('token_id', token.id);
      
      // Default holder metrics based on transaction count
      const holderCount = transactionCount || 10;
      const whalesCount = Math.max(1, Math.floor(holderCount * 0.05)); // 5% are whales
      const devsCount = Math.max(1, Math.floor(holderCount * 0.01)); // 1% are devs
      const retailCount = holderCount - whalesCount - devsCount;
      
      // Calculate market metrics based on transactions
      const bondingCurve = token.bonding_curve && typeof token.bonding_curve === 'object' ? 
                          token.bonding_curve as Record<string, any> : 
                          { initial_price: 0.0001 };
                          
      const initialPrice = bondingCurve.initial_price || 0.0001;
      const currentPrice = initialPrice * 1.1; // Assume 10% increase from initial price
      const marketCap = currentPrice * 1000000; // Assuming total supply
      const volume24h = marketCap * 0.05; // Assume 5% of market cap traded daily
      
      return {
        id: token.id,
        name: token.name,
        symbol: token.symbol,
        logo: null, // Add logo handling in the future
        banner: null, // Add banner handling in the future
        price: currentPrice,
        change24h: Math.random() * 20 - 5, // Random change between -5% and 15%
        marketCap,
        volume24h,
        category: ['Token'], // Add category handling in the future
        holders: holderCount,
        devWallet: token.creator_wallet,
        holderStats: {
          whales: whalesCount,
          retail: retailCount,
          devs: devsCount,
        },
        launchDate: token.launch_date
      };
    }));
    
    return tokens;
  } catch (error) {
    console.error("Error fetching listed tokens:", error);
    return [];
  }
};

export const tokenLaunchService = {
  launchToken,
  buyInitialSupply,
  getListedTokens
};
