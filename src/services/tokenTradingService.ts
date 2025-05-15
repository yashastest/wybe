
import { supabase } from '@/integrations/supabase/client';
import { TokenData } from '@/types/supabase';

class TokenTradingService {
  async getListedTokens() {
    try {
      // Fetch tokens from the database
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
            
        // Generate some random statistics for demo purposes
        const change24h = token.bonding_curve?.change_24h !== undefined 
          ? token.bonding_curve.change_24h 
          : (Math.random() * 30) - 15; // -15% to +15%
        
        const volume24h = token.bonding_curve?.volume_24h !== undefined
          ? token.bonding_curve.volume_24h
          : token.market_cap * (Math.random() * 0.2 + 0.1); // 10-30% of market cap
        
        return {
          id: token.id,
          name: token.name,
          symbol: token.symbol,
          price,
          change24h,
          marketCap: token.market_cap,
          volume24h,
          logo: null // Will be populated in the future with real logos
        };
      });
    } catch (error) {
      console.error('Error fetching token listings:', error);
      
      // Return demo data if production data is unavailable
      return [
        {
          id: 'bonk',
          name: 'Bonk',
          symbol: 'BONK',
          price: 0.00000123,
          change24h: 15.2,
          marketCap: 725000000,
          volume24h: 142000000,
          logo: null
        },
        {
          id: 'samo',
          name: 'Samoyedcoin',
          symbol: 'SAMO',
          price: 0.0095,
          change24h: 7.8,
          marketCap: 38000000,
          volume24h: 9800000,
          logo: null
        }
      ];
    }
  }
}

export const tokenTradingService = new TokenTradingService();
