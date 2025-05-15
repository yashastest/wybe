
import { supabase } from '@/integrations/supabase/client';
import { TokenData } from '@/types/supabase';

class TradingService {
  // Get token information by symbol
  async getTokenBySymbol(symbol: string) {
    try {
      const { data, error } = await supabase
        .from('tokens')
        .select('*')
        .eq('symbol', symbol.toUpperCase())
        .single();

      if (error) throw error;
      
      // Cast to our TokenData type and add price if missing
      const token = data as TokenData;
      
      // Get price from bonding curve or fallback to direct price
      const price = token.bonding_curve?.price !== undefined
        ? token.bonding_curve.price
        : token.price !== undefined
          ? token.price
          : 0.01; // Default fallback price

      return {
        ...token,
        price: price
      };
    } catch (error) {
      console.error('Error fetching token:', error);
      throw new Error(`Failed to get token with symbol ${symbol}`);
    }
  }

  // Execute a trade
  async executeTrade(wallet: string, tokenId: string, type: 'buy' | 'sell', amount: number) {
    try {
      // Get token for price information
      const { data: tokenData, error: tokenError } = await supabase
        .from('tokens')
        .select('*')
        .eq('id', tokenId)
        .single();

      if (tokenError) throw tokenError;
      
      const token = tokenData as TokenData;
      
      // Get price from bonding curve or fallback
      const price = token.bonding_curve?.price !== undefined
        ? token.bonding_curve.price
        : token.price !== undefined
          ? token.price
          : 0.01; // Default fallback price
      
      // Calculate fee (1% of transaction value)
      const fee = amount * price * 0.01;

      // Record the transaction
      const { data, error } = await supabase
        .from('transactions')
        .insert([
          {
            token_id: tokenId,
            wallet,
            type,
            amount,
            price,
            fee
          }
        ])
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error executing trade:', error);
      throw new Error(`Failed to execute ${type} trade`);
    }
  }

  // Get trade history for a token
  async getTradeHistory(tokenId: string, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('token_id', tokenId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching trade history:', error);
      throw new Error('Failed to get trade history');
    }
  }

  // Get list of traded tokens with their latest price
  async getListedTokens() {
    try {
      const { data, error } = await supabase
        .from('tokens')
        .select('*')
        .order('market_cap', { ascending: false });

      if (error) throw error;
      
      // Process tokens to ensure they have price information
      return data.map((token: TokenData) => {
        const price = token.bonding_curve?.price !== undefined
          ? token.bonding_curve.price
          : token.price !== undefined
            ? token.price
            : 0.01; // Default fallback price
            
        return {
          ...token,
          price
        };
      });
    } catch (error) {
      console.error('Error fetching listed tokens:', error);
      throw new Error('Failed to get listed tokens');
    }
  }
}

export const tradingService = new TradingService();
