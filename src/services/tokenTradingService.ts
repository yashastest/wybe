import { supabase } from '@/integrations/supabase/client';
import {
  ListedToken,
  TradeParams,
  TradeResult,
  TradeHistoryFilters,
  TokenTransaction,
  TokenLaunchParams,
  TokenLaunchResult,
  InitialSupplyPurchaseResponse
} from '@/services/token/types';

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
    
    // Format tokens to match the ListedToken interface from types.ts
    return tokens.map(token => ({
      id: token.id,
      symbol: token.symbol,
      name: token.name,
      price: calculateTokenPrice(token.market_cap, token.symbol),
      priceChange24h: token.price_change_24h || (Math.random() > 0.5 ? 2.5 : -1.3), // Use actual if available
      change24h: token.change_24h || token.price_change_24h || (Math.random() > 0.5 ? 2.5 : -1.3), // Added for backward compatibility
      marketCap: token.market_cap,
      volume24h: token.volume_24h || token.market_cap * 0.1, // Use actual if available
      totalSupply: token.total_supply || token.market_cap / calculateTokenPrice(token.market_cap, token.symbol), // Use actual
      logo: token.logo_url || null, // Use actual if available
      description: token.description || `${token.name} token`,
      contractAddress: token.token_address,
      creatorAddress: token.creator_wallet,
      isAssisted: token.is_assisted || false, // Added for admin views
      category: token.category || ['meme'], // Added for MemeCoins component
      banner: token.banner_url || undefined, // Added for useTokenListing
      holderStats: token.holder_stats || { // Added for TrendingCoins component
        whales: Math.floor(Math.random() * 5),
        retail: Math.floor(Math.random() * 100) + 20,
        devs: 1
      },
      liquidity: token.liquidity || undefined,
    }));
  } catch (error) {
    console.error('Error in getListedTokens:', error);
    return getMockTokens(); // Fallback to mock data
  }
};

// Calculate price based on market cap using bonding curve
const calculateTokenPrice = (marketCap: number, symbol: string): number => {
  // Basic bonding curve formula: price = (market_cap / 10000)^2 + 0.01
  // Ensure marketCap is not null or undefined before calculation
  const mc = marketCap || 0;
  return Math.pow(mc / 10000, 2) + 0.01;
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
      // Assuming creatorFee and platformFee are not standard in TradeResult from types.ts
      // If they are, ensure they are part of the imported TradeResult type.
      // For now, let's assume they are custom additions here.
      // creatorFee: data.transaction?.fees?.creator || 0, 
      // platformFee: data.transaction?.fees?.platform || 0
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
    
    if (filters?.status) {
      // Assuming 'trades' table has a 'status' column that maps to TokenTransactionStatus
      // If not, this filter might need adjustment or be handled client-side post-fetch.
      // For now, let's assume it does for the sake of Supabase query.
      // query = query.eq('status', filters.status); 
      // If 'trades' table doesn't have status, we might need to filter post-fetch or mock status.
      // For now, we'll map all fetched trades to 'completed' or 'confirmed' as in previous code.
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
      return getMockTransactions(filters); // Pass filters to mock
    }
    
    return data.map((trade): TokenTransaction => {
      const price = calculateTokenPrice(1000, trade.token_symbol); // Mock price calculation
      const status = trade.status || 'confirmed'; // Use actual status if available, else default

      return {
        id: trade.id,
        txHash: trade.tx_hash,
        tokenSymbol: trade.token_symbol,
        tokenName: trade.token_symbol, // Use symbol as name until we have a proper mapping
        type: trade.side as 'buy' | 'sell', // Ensure this matches the type
        side: trade.side as 'buy' | 'sell', // For backward compatibility
        amount: trade.amount, // This is SOL amount for buys, token amount for sells based on original logic
        amountUsd: trade.amount * price, // Simplistic USD amount
        price: price,
        fee: trade.fee || trade.amount * 0.05, // Use actual fee if available, else mock 5%
        timestamp: trade.created_at,
        walletAddress: trade.wallet_address,
        status: status as 'pending' | 'confirmed' | 'failed' | 'completed',
        amountTokens: trade.side === 'buy' ? trade.amount / price : trade.amount,
        amountSol: trade.side === 'buy' ? trade.amount : trade.amount * price,
      };
    });
  } catch (error) {
    console.error('Error in getUserTransactions:', error);
    return getMockTransactions(filters); // Pass filters to mock
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
const getMockTokens = (): ListedToken[] => {
  return [
    {
      id: "1",
      symbol: "PEPES",
      name: "Pepe's Token",
      price: 0.023,
      priceChange24h: 5.2,
      change24h: 5.2,
      marketCap: 28000,
      volume24h: 3200,
      totalSupply: 1200000,
      contractAddress: "8xK5SG6UhgXwbsf2Vc9WyBMmRDh79JRzCPyomzPbJwN9",
      creatorAddress: "Wybe8a43b9c2",
      logo: "/placeholder.svg",
      description: "A mock token for Pepe.",
      isAssisted: false,
      category: ["meme", "community"],
      banner: "/placeholder.svg",
      holderStats: { whales: 2, retail: 50, devs: 1 },
      liquidity: 10000,
    },
    {
      id: "2",
      symbol: "DEGEN",
      name: "Degen Finance",
      price: 0.0164,
      priceChange24h: -2.1,
      change24h: -2.1,
      marketCap: 82000,
      volume24h: 12000,
      totalSupply: 5000000,
      contractAddress: "3gT1c5Y1T5rRjDxmNnZQCpWQFCzE3hKqG9yMiUMxQfMJ",
      creatorAddress: "Wybeaf925e8d",
      logo: "/placeholder.svg",
      description: "A mock token for Degen Finance.",
      isAssisted: true,
      category: ["defi", "finance"],
      banner: "/placeholder.svg",
      holderStats: { whales: 5, retail: 200, devs: 2 },
      liquidity: 50000,
    },
    // ... more mock tokens if needed
  ];
};

const getMockTransactions = (filters?: TradeHistoryFilters): TokenTransaction[] => {
  const allMockTransactions: TokenTransaction[] = [
    {
      id: "tx1",
      txHash: "tx_123456789abcdef",
      tokenSymbol: "PEPES",
      tokenName: "Pepe's Token",
      type: "buy", // Correctly typed
      side: "buy", // Correctly typed
      amount: 0.25, // SOL amount
      amountUsd: 75,
      price: 0.015, // Price per token in SOL
      fee: 0.005, // Fee in SOL
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      walletAddress: "wallet123",
      status: "completed", // Correctly typed
      amountTokens: 5000, // Amount of tokens
      amountSol: 0.25, // Amount of SOL
    },
    {
      id: "tx2",
      txHash: "tx_abcdef123456789",
      tokenSymbol: "PEPES",
      tokenName: "Pepe's Token",
      type: "sell", // Correctly typed
      side: "sell", // Correctly typed
      amount: 3000, // Token amount
      amountUsd: 45,
      price: 0.014, // Price per token in SOL
      fee: 0.003, // Fee in SOL
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      walletAddress: "wallet123",
      status: "confirmed", // Correctly typed
      amountTokens: 3000, // Amount of tokens
      amountSol: 0.15, // Amount of SOL (equivalent value)
    }
  ];

  if (!filters) return allMockTransactions;

  return allMockTransactions.filter(tx => {
    if (filters.tokenSymbol && tx.tokenSymbol !== filters.tokenSymbol) return false;
    if (filters.side && tx.side !== filters.side) return false;
    if (filters.status && tx.status !== filters.status) return false;
    if (filters.startDate && new Date(tx.timestamp) < filters.startDate) return false;
    if (filters.endDate && new Date(tx.timestamp) > filters.endDate) return false;
    // walletAddress filter is applied at query time in getUserTransactions if using DB
    // if using mock, and walletAddress is part of filters, it should be applied here too
    // but typically getUserTransactions is already for a specific walletAddress.
    return true;
  });
};

// Token Launch related functions
const launchToken = async (tokenParams: TokenLaunchParams): Promise<TokenLaunchResult> => {
  try {
    console.log("Launching token with params:", tokenParams);
    // Simulate API call or Supabase function
    // In a real scenario, this would interact with a backend service or smart contract
    
    // Mock response:
    const mockTokenId = `tok_${Date.now()}`;
    const mockContractAddress = `addr_${Date.now()}`;
    
    // Optionally, add to Supabase 'tokens' table here if not done by an edge function
    // const { error: dbError } = await supabase.from('tokens').insert([
    //   { name: tokenParams.name, symbol: tokenParams.symbol, /* ...other fields */ }
    // ]);
    // if (dbError) throw dbError;

    return {
      success: true,
      tokenId: mockTokenId,
      contractAddress: mockContractAddress,
      message: "Token launched successfully (mock)"
    };
  } catch (error) {
    console.error("Error launching token:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: `Failed to launch token: ${errorMessage}`
    };
  }
};

const buyInitialSupply = async (params: { tokenId: string, walletAddress: string, amountSol: number }): Promise<TradeResult> => {
  try {
    console.log(`Buying initial supply for token ${params.tokenId}, wallet ${params.walletAddress}, amount ${params.amountSol} SOL`);
    // Simulate API call or Supabase function
    
    // Mock response:
    const mockPrice = 0.01; // SOL per token
    const mockAmountTokens = params.amountSol / mockPrice;
    const mockTxHash = `tx_init_${Date.now()}`;

    return {
      success: true,
      txHash: mockTxHash,
      amountSol: params.amountSol,
      amountTokens: mockAmountTokens,
      price: mockPrice,
      fee: params.amountSol * 0.01, // Mock 1% fee
      // No error or errorMessage on success
    };
  } catch (error) {
    console.error("Error buying initial supply:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: `Failed to buy initial supply: ${errorMessage}`,
      // errorMessage: `Failed to buy initial supply: ${errorMessage}` // if type expects it
    };
  }
};

export const tokenTradingService = {
  getListedTokens,
  executeTrade,
  logTradeInDatabase,
  getUserTransactions,
  getCreatorMilestones,
  claimCreatorFees,
  launchToken,
  buyInitialSupply
};
