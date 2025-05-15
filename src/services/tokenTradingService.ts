
import { supabase } from '@/integrations/supabase/client';
import { TokenData } from '@/types/supabase';

// Define missing types used by other components
export interface TradeResult {
  success: boolean;
  error?: string;
  amountSol?: number;
  amountTokens?: number;
  price?: number;
  txHash?: string;
}

export interface ListedToken {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  logo: string | null;
  category?: string[];
  devWallet?: string;
  creatorWallet?: string;
  totalSupply?: number;
}

export interface TokenTransaction {
  id: string;
  tokenSymbol: string;
  side: 'buy' | 'sell';
  amount: number;
  amountTokens?: number;
  amountSol?: number;
  price: number;
  timestamp: string;
  status: 'confirmed' | 'pending' | 'failed' | 'completed';
  txHash?: string;
  walletAddress: string;
}

export interface TokenLaunchParams {
  name: string;
  symbol: string;
  initialSupply: number;
  totalSupply?: number;
  creatorWallet?: string;
  creator?: { wallet: string };
}

export interface TokenLaunchResponse {
  success: boolean;
  tokenId?: string;
  error?: string;
}

export interface TradeParams {
  walletAddress: string;
  tokenSymbol: string;
  action: 'buy' | 'sell';
  amountSol?: number;
  amountTokens?: number;
  gasPriority?: number;
}

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

        // Extract category from tags if available
        const bondingCurve = token.bonding_curve || {};
        const tags = bondingCurve.tags || ['Meme'];
        const category = Array.isArray(tags) ? tags : [tags];
        
        return {
          id: token.id,
          name: token.name,
          symbol: token.symbol,
          price,
          change24h,
          marketCap: token.market_cap,
          volume24h,
          logo: null, // Will be populated in the future with real logos
          category,
          creatorWallet: token.creator_wallet,
          devWallet: token.creator_wallet, // For backward compatibility
          totalSupply: 1000000000 // Default value
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
          logo: null,
          category: ['Meme'],
          creatorWallet: 'demo-wallet',
          devWallet: 'demo-wallet',
          totalSupply: 1000000000000
        },
        {
          id: 'samo',
          name: 'Samoyedcoin',
          symbol: 'SAMO',
          price: 0.0095,
          change24h: 7.8,
          marketCap: 38000000,
          volume24h: 9800000,
          logo: null,
          category: ['Meme'],
          creatorWallet: 'demo-wallet',
          devWallet: 'demo-wallet',
          totalSupply: 10000000000
        }
      ];
    }
  }

  // Add missing methods referenced by components
  async executeTrade(params: TradeParams): Promise<TradeResult> {
    try {
      const { walletAddress, tokenSymbol, action, amountSol, amountTokens, gasPriority = 1 } = params;
      
      // Get token price for calculation
      const tokens = await this.getListedTokens();
      const token = tokens.find(t => t.symbol === tokenSymbol);
      
      if (!token) {
        throw new Error(`Token ${tokenSymbol} not found`);
      }
      
      const price = token.price;
      let result: TradeResult;
      
      if (action === 'buy' && amountSol !== undefined) {
        // Buy calculation
        const tokensReceived = amountSol / price;
        const fee = amountSol * 0.01; // 1% fee
        
        // Record transaction in database (if possible)
        try {
          await supabase
            .from('trades')
            .insert([{
              token_symbol: tokenSymbol,
              side: 'buy',
              amount: tokensReceived,
              wallet_address: walletAddress,
              tx_hash: `sim-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
            }]);
        } catch (err) {
          console.error('Failed to record trade in database:', err);
        }
        
        result = {
          success: true,
          amountSol,
          amountTokens: tokensReceived,
          price,
          txHash: `sim-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
        };
      } else if (action === 'sell' && amountTokens !== undefined) {
        // Sell calculation
        const solReceived = amountTokens * price;
        const fee = solReceived * 0.01; // 1% fee
        
        // Record transaction in database (if possible)
        try {
          await supabase
            .from('trades')
            .insert([{
              token_symbol: tokenSymbol,
              side: 'sell',
              amount: amountTokens,
              wallet_address: walletAddress,
              tx_hash: `sim-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
            }]);
        } catch (err) {
          console.error('Failed to record trade in database:', err);
        }
        
        result = {
          success: true,
          amountSol: solReceived,
          amountTokens,
          price,
          txHash: `sim-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
        };
      } else {
        throw new Error('Invalid trade parameters');
      }
      
      return result;
    } catch (error) {
      console.error('Trade execution error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }
  
  async estimateTokenAmount(tokenSymbol: string, amountSol: number): Promise<number> {
    try {
      const tokens = await this.getListedTokens();
      const token = tokens.find(t => t.symbol === tokenSymbol);
      
      if (!token) {
        throw new Error(`Token ${tokenSymbol} not found`);
      }
      
      return amountSol / token.price;
    } catch (error) {
      console.error('Error estimating token amount:', error);
      return 0;
    }
  }
  
  async estimateSolAmount(tokenSymbol: string, amountTokens: number): Promise<number> {
    try {
      const tokens = await this.getListedTokens();
      const token = tokens.find(t => t.symbol === tokenSymbol);
      
      if (!token) {
        throw new Error(`Token ${tokenSymbol} not found`);
      }
      
      return amountTokens * token.price;
    } catch (error) {
      console.error('Error estimating SOL amount:', error);
      return 0;
    }
  }
  
  async logTradeInDatabase(tradeData: {
    tokenSymbol: string;
    side: 'buy' | 'sell';
    amount: number;
    price: number;
    walletAddress: string;
    amountTokens: number;
  }): Promise<void> {
    try {
      await supabase
        .from('trades')
        .insert([{
          token_symbol: tradeData.tokenSymbol,
          side: tradeData.side,
          amount: tradeData.amount,
          wallet_address: tradeData.walletAddress
        }]);
    } catch (error) {
      console.error('Error logging trade in database:', error);
    }
  }
  
  async getUserTransactions(walletAddress: string, filters?: any): Promise<TokenTransaction[]> {
    try {
      let query = supabase
        .from('trades')
        .select('*')
        .eq('wallet_address', walletAddress);
      
      // Apply filters if provided
      if (filters?.tokenSymbol) {
        query = query.eq('token_symbol', filters.tokenSymbol);
      }
      if (filters?.side) {
        query = query.eq('side', filters.side);
      }
      if (filters?.startDate) {
        query = query.gte('created_at', new Date(filters.startDate).toISOString());
      }
      if (filters?.endDate) {
        query = query.lte('created_at', new Date(filters.endDate).toISOString());
      }
      
      // Order by timestamp descending (newest first)
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Map database results to TokenTransaction type
      return (data || []).map(item => ({
        id: item.id,
        tokenSymbol: item.token_symbol,
        side: item.side,
        amount: item.amount,
        price: 0.01, // Default price if not available
        timestamp: item.created_at,
        status: 'confirmed',
        txHash: item.tx_hash,
        walletAddress: item.wallet_address,
        amountTokens: item.side === 'buy' ? item.amount : undefined,
        amountSol: item.side === 'sell' ? item.amount * 0.01 : undefined // Rough estimation
      }));
    } catch (error) {
      console.error('Error fetching user transactions:', error);
      
      // Return empty array in case of error
      return [];
    }
  }
  
  async launchToken(params: TokenLaunchParams): Promise<TokenLaunchResponse> {
    try {
      const { name, symbol, initialSupply, totalSupply, creatorWallet, creator } = params;
      const wallet = creatorWallet || creator?.wallet || 'demo-wallet';
      
      // Validate required parameters
      if (!name || !symbol || !initialSupply) {
        throw new Error('Missing required parameters for token launch');
      }
      
      // Insert new token into database
      const { data, error } = await supabase
        .from('tokens')
        .insert([{
          name,
          symbol: symbol.toUpperCase(),
          creator_wallet: wallet,
          market_cap: initialSupply * 0.01, // Initial market cap based on initial supply and default price
          bonding_curve: {
            price: 0.01,
            change_24h: 0,
            volume_24h: 0,
            tags: ['Meme']
          },
          launched: true
        }])
        .select()
        .single();
      
      if (error) throw error;
      
      return {
        success: true,
        tokenId: data.id
      };
    } catch (error) {
      console.error('Token launch error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to launch token'
      };
    }
  }
  
  async buyInitialSupply(tokenId: string, walletAddress: string, amount: number): Promise<TradeResult> {
    try {
      // Get token information
      const { data: token, error: tokenError } = await supabase
        .from('tokens')
        .select('*')
        .eq('id', tokenId)
        .single();
      
      if (tokenError) throw tokenError;
      if (!token) throw new Error('Token not found');
      
      const price = token.bonding_curve?.price || 0.01;
      const amountSol = amount;
      const amountTokens = amountSol / price;
      
      // Record the transaction
      try {
        const { error } = await supabase
          .from('trades')
          .insert([{
            token_symbol: token.symbol,
            side: 'buy',
            amount: amountTokens,
            wallet_address: walletAddress,
            tx_hash: `init-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
          }]);
        
        if (error) throw error;
      } catch (err) {
        console.error('Failed to record initial buy:', err);
      }
      
      return {
        success: true,
        amountSol,
        amountTokens,
        price,
        txHash: `init-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`
      };
    } catch (error) {
      console.error('Initial supply purchase error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to purchase initial supply'
      };
    }
  }
}

export const tokenTradingService = new TokenTradingService();
