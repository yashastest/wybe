
import { supabase } from '@/integrations/supabase/client';

export interface ListedToken {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange24h?: number;
  marketCap?: number;
  volume24h?: number;
  totalSupply?: number;
  logo?: string;
  description?: string;
  contractAddress?: string;
  creatorAddress?: string;
}

export interface TradeParams {
  walletAddress: string;
  tokenSymbol: string;
  action: 'buy' | 'sell';
  amountSol?: number;
  amountTokens?: number;
  gasPriority?: 'low' | 'medium' | 'high' | number;
}

export interface TradeResult {
  success: boolean;
  error?: string;
  errorMessage?: string;
  txHash?: string;
  amount?: number;
  amountSol?: number;
  amountTokens?: number;
  price?: number;
  fee?: number;
  creatorFee?: number;
  platformFee?: number;
}

export interface TradeHistoryFilters {
  tokenSymbol?: string;
  side?: 'buy' | 'sell';
  startDate?: Date;
  endDate?: Date;
}

export interface TokenTransaction {
  id: string;
  txHash?: string;
  tokenSymbol: string;
  tokenName?: string;
  type: 'buy' | 'sell';
  side?: 'buy' | 'sell';
  amount: number;
  amountUsd?: number;
  price?: number;
  fee?: number;
  timestamp: string;
  walletAddress?: string;
  status: 'pending' | 'completed' | 'failed' | 'confirmed';
  amountTokens?: number;
  amountSol?: number;
}

// Get listed tokens
const getListedTokens = async (): Promise<ListedToken[]> => {
  try {
    // Get tokens from supabase
    const { data: tokens, error } = await supabase
      .from('tokens')
      .select('*')
      .order('market_cap', { ascending: false });
      
    if (error) {
      console.error('Error fetching tokens:', error);
      return getMockTokens(); // Fallback to mock data
    }
    
    // Format tokens to match the ListedToken interface
    return tokens.map(token => ({
      id: token.id,
      symbol: token.symbol,
      name: token.name,
      price: calculateTokenPrice(token.market_cap, token.symbol),
      priceChange24h: Math.random() > 0.5 ? 2.5 : -1.3, // Mock price change
      marketCap: token.market_cap,
      volume24h: token.market_cap * 0.1, // Mock volume
      totalSupply: token.market_cap / calculateTokenPrice(token.market_cap, token.symbol),
      contractAddress: token.token_address,
      creatorAddress: token.creator_wallet
    }));
  } catch (error) {
    console.error('Error in getListedTokens:', error);
    return getMockTokens(); // Fallback to mock data
  }
};

// Calculate price based on market cap using bonding curve
const calculateTokenPrice = (marketCap: number, symbol: string): number => {
  // Basic bonding curve formula: price = (market_cap / 10000)^2 + 0.01
  return Math.pow(marketCap / 10000, 2) + 0.01;
};

// Execute a trade
const executeTrade = async (params: TradeParams): Promise<TradeResult> => {
  try {
    console.log('Executing trade with params:', params);
    
    // Call Supabase edge function to execute trade
    const { data, error } = await supabase.functions.invoke('token-transactions', {
      body: JSON.stringify({
        wallet_address: params.walletAddress,
        token_symbol: params.tokenSymbol,
        side: params.action,
        amount: params.amountTokens || 0,
        sol_amount: params.amountSol || 0,
        gas_priority: typeof params.gasPriority === 'string' ? params.gasPriority : 'medium'
      })
    });
    
    if (error) {
      console.error('Error executing trade:', error);
      return {
        success: false,
        error: 'Failed to execute trade',
        errorMessage: error.message
      };
    }
    
    // Log successful trade to local database
    await logTradeInDatabase({
      txHash: data.transaction?.txHash || 'local_' + Date.now(),
      tokenSymbol: params.tokenSymbol,
      side: params.action,
      amount: params.amountSol || 0,
      walletAddress: params.walletAddress
    });
    
    // Record fee distribution for creator if buying tokens
    if (params.action === 'buy' && data.transaction?.fees?.creator) {
      await recordFeeDistribution({
        tokenSymbol: params.tokenSymbol,
        creatorWallet: data.transaction.creatorWallet || getCreatorWalletForToken(params.tokenSymbol),
        amount: data.transaction.fees.creator
      });
    }
    
    return {
      success: true,
      txHash: data.transaction?.txHash,
      amount: params.amountSol || data.transaction?.solAmount,
      amountTokens: data.transaction?.amount || params.amountTokens,
      amountSol: data.transaction?.solAmount || params.amountSol,
      price: data.transaction?.price,
      fee: data.transaction?.fees?.total || 0,
      creatorFee: data.transaction?.fees?.creator || 0,
      platformFee: data.transaction?.fees?.platform || 0
    };
  } catch (error) {
    console.error('Error in executeTrade:', error);
    return {
      success: false,
      error: 'Failed to execute trade',
      errorMessage: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Log a trade to the database
const logTradeInDatabase = async (tradeData: {
  txHash?: string;
  tokenSymbol: string;
  side: 'buy' | 'sell';
  amount: number;
  walletAddress: string;
}): Promise<boolean> => {
  try {
    // Use Supabase function to log trade
    const { error } = await supabase.functions.invoke('log-trade', {
      body: JSON.stringify({
        wallet_address: tradeData.walletAddress,
        token_symbol: tradeData.tokenSymbol,
        side: tradeData.side,
        amount: tradeData.amount,
        tx_hash: tradeData.txHash || undefined
      })
    });
    
    if (error) {
      console.error('Error invoking log-trade function:', error);
      
      // Fallback to direct database insert
      const { error: insertError } = await supabase
        .from('trades')
        .insert([{
          tx_hash: tradeData.txHash,
          token_symbol: tradeData.tokenSymbol,
          side: tradeData.side,
          amount: tradeData.amount,
          wallet_address: tradeData.walletAddress
        }]);
      
      if (insertError) {
        console.error('Error logging trade to database:', insertError);
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error in logTradeInDatabase:', error);
    return false;
  }
};

// Record fee distribution for creator
const recordFeeDistribution = async (data: {
  tokenSymbol: string;
  creatorWallet: string;
  amount: number;
}): Promise<boolean> => {
  try {
    // Get token ID
    const { data: token, error: tokenError } = await supabase
      .from('tokens')
      .select('id')
      .eq('symbol', data.tokenSymbol)
      .single();
    
    if (tokenError || !token) {
      console.error('Error getting token ID for fee distribution:', tokenError);
      return false;
    }
    
    // Record fee distribution
    const { error } = await supabase
      .from('fee_distributions')
      .insert([{
        token_id: token.id,
        amount: data.amount,
        creator_wallet: data.creatorWallet,
        eligible_timestamp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
      }]);
    
    if (error) {
      console.error('Error recording fee distribution:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error in recordFeeDistribution:', error);
    return false;
  }
};

// Get creator wallet for a token
const getCreatorWalletForToken = (tokenSymbol: string): string => {
  // In a real implementation, you would fetch this from the database
  // For now, return a placeholder
  return 'CREATOR_WALLET_' + tokenSymbol;
};

// Get user transactions
const getUserTransactions = async (walletAddress: string, filters?: TradeHistoryFilters): Promise<TokenTransaction[]> => {
  try {
    let query = supabase
      .from('trades')
      .select('*')
      .eq('wallet_address', walletAddress)
      .order('created_at', { ascending: false });
    
    if (filters?.tokenSymbol) {
      query = query.eq('token_symbol', filters.tokenSymbol);
    }
    
    if (filters?.side) {
      query = query.eq('side', filters.side);
    }
    
    // Apply date filters if provided
    if (filters?.startDate) {
      query = query.gte('created_at', filters.startDate.toISOString());
    }
    
    if (filters?.endDate) {
      query = query.lte('created_at', filters.endDate.toISOString());
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching user transactions:', error);
      return getMockTransactions();
    }
    
    return data.map(trade => {
      // Get a random price based on tokenSymbol for demonstration
      const price = calculateTokenPrice(1000, trade.token_symbol);
      
      return {
        id: trade.id,
        txHash: trade.tx_hash,
        tokenSymbol: trade.token_symbol,
        tokenName: trade.token_symbol, // Use symbol as name until we have a proper mapping
        type: trade.side,
        side: trade.side,
        amount: trade.amount,
        amountUsd: trade.amount * price,
        price: price,
        fee: trade.amount * 0.05, // Assuming 5% fee
        timestamp: trade.created_at,
        walletAddress: trade.wallet_address,
        status: 'completed',
        amountTokens: trade.side === 'buy' ? trade.amount / price : trade.amount,
        amountSol: trade.side === 'buy' ? trade.amount : trade.amount * price
      };
    });
  } catch (error) {
    console.error('Error in getUserTransactions:', error);
    return getMockTransactions();
  }
};

// Get milestones for creator fee claims
const getCreatorMilestones = async (creatorWallet: string): Promise<any[]> => {
  try {
    // Get distributions that are eligible for claiming
    const { data, error } = await supabase
      .from('fee_distributions')
      .select('*')
      .eq('creator_wallet', creatorWallet)
      .eq('distributed', false)
      .lte('eligible_timestamp', new Date().toISOString())
      .order('eligible_timestamp', { ascending: true });
    
    if (error) {
      console.error('Error fetching creator milestones:', error);
      return [];
    }
    
    return data.map(distribution => ({
      id: distribution.id,
      tokenId: distribution.token_id,
      amount: distribution.amount,
      eligibleTimestamp: distribution.eligible_timestamp,
      createdAt: distribution.created_at
    }));
  } catch (error) {
    console.error('Error in getCreatorMilestones:', error);
    return [];
  }
};

// Claim creator fees after milestone
const claimCreatorFees = async (distributionId: string, creatorWallet: string): Promise<{success: boolean; message: string; amount?: number}> => {
  try {
    // Check if the distribution exists and is claimable
    const { data: distribution, error: fetchError } = await supabase
      .from('fee_distributions')
      .select('*')
      .eq('id', distributionId)
      .eq('creator_wallet', creatorWallet)
      .eq('distributed', false)
      .lte('eligible_timestamp', new Date().toISOString())
      .single();
    
    if (fetchError || !distribution) {
      return { 
        success: false, 
        message: 'Distribution not found or not eligible for claiming'
      };
    }
    
    // Update the distribution status
    const { error: updateError } = await supabase
      .from('fee_distributions')
      .update({
        distributed: true,
        distribution_timestamp: new Date().toISOString()
      })
      .eq('id', distributionId);
    
    if (updateError) {
      return { 
        success: false, 
        message: 'Failed to process claim'
      };
    }
    
    // In a real implementation, trigger blockchain transaction to send tokens to creator
    
    return { 
      success: true, 
      message: 'Successfully claimed creator fees',
      amount: distribution.amount
    };
  } catch (error) {
    console.error('Error claiming creator fees:', error);
    return { 
      success: false, 
      message: 'An unexpected error occurred'
    };
  }
};

// Mock data

// Get mock tokens for testing
const getMockTokens = (): ListedToken[] => {
  return [
    {
      id: "1",
      symbol: "PEPES",
      name: "Pepe's Token",
      price: 0.023,
      priceChange24h: 5.2,
      marketCap: 28000,
      volume24h: 3200,
      totalSupply: 1200000,
      contractAddress: "8xK5SG6UhgXwbsf2Vc9WyBMmRDh79JRzCPyomzPbJwN9",
      creatorAddress: "Wybe8a43b9c2"
    },
    {
      id: "2",
      symbol: "DEGEN",
      name: "Degen Finance",
      price: 0.0164,
      priceChange24h: -2.1,
      marketCap: 82000,
      volume24h: 12000,
      totalSupply: 5000000,
      contractAddress: "3gT1c5Y1T5rRjDxmNnZQCpWQFCzE3hKqG9yMiUMxQfMJ",
      creatorAddress: "Wybeaf925e8d"
    },
    {
      id: "3",
      symbol: "MOON",
      name: "Moon Rocket",
      price: 0.0144,
      priceChange24h: 8.7,
      marketCap: 46000,
      volume24h: 7800,
      totalSupply: 3200000,
      contractAddress: "6uJkR7UrdMSvGfCvLB5oAFDYELwGjgBFLDpwRiaaEBJX",
      creatorAddress: "Wybe3d7f94a1"
    }
  ];
};

// Get mock transactions for testing
const getMockTransactions = (): TokenTransaction[] => {
  return [
    {
      id: "tx1",
      txHash: "tx_123456789abcdef",
      tokenSymbol: "PEPES",
      tokenName: "Pepe's Token",
      type: "buy",
      side: "buy",
      amount: 0.25,
      amountUsd: 75,
      price: 0.015,
      fee: 0.005,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      walletAddress: "wallet123",
      status: "completed",
      amountTokens: 5000,
      amountSol: 0.25
    },
    {
      id: "tx2",
      txHash: "tx_abcdef123456789",
      tokenSymbol: "PEPES",
      tokenName: "Pepe's Token",
      type: "sell",
      side: "sell",
      amount: 0.15,
      amountUsd: 45,
      price: 0.014,
      fee: 0.003,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      walletAddress: "wallet123",
      status: "completed",
      amountTokens: 3000,
      amountSol: 0.15
    }
  ];
};

export const tokenTradingService = {
  getListedTokens,
  executeTrade,
  logTradeInDatabase,
  getUserTransactions,
  getCreatorMilestones,
  claimCreatorFees
};
