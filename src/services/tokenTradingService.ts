
import { TokenTransaction, ListedToken, TokenLaunchParams, TradeResult, TradeParams } from './token/types';

// Sample mock data for transactions
const mockTransactions: TokenTransaction[] = [
  {
    id: '1',
    tokenSymbol: 'WYBE',
    userId: 'user1',
    amount: 100,
    amountUsd: 150,
    price: 1.5,
    side: 'buy',
    status: 'completed',
    timestamp: new Date().toISOString(),
    txHash: '0x123456789abcdef'
  },
  {
    id: '2',
    tokenSymbol: 'WYBE',
    userId: 'user1',
    amount: 50,
    amountUsd: 75,
    price: 1.5,
    side: 'sell',
    status: 'completed',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    txHash: '0x123456789abcdef'
  },
  {
    id: '3',
    tokenSymbol: 'ETH',
    userId: 'user1',
    amount: 0.5,
    amountUsd: 1000,
    price: 2000,
    side: 'buy',
    status: 'completed',
    timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    txHash: '0x123456789abcdef'
  }
];

// Sample mock data for listed tokens
const mockListedTokens: ListedToken[] = [
  {
    id: '1',
    name: 'Wybe Token',
    symbol: 'WYBE',
    price: 1.5,
    marketCap: 150000,
    volume24h: 25000,
    change24h: 5.2,
    logo: '/lovable-uploads/dcb3ea81-25ba-4438-90a5-c7403026c91e.png',
    category: ['utility', 'platform'],
    holderStats: {
      whales: 3,
      retail: 120,
      devs: 2
    },
    holders: 125
  },
  {
    id: '2',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 2000,
    marketCap: 200000000,
    volume24h: 5000000,
    change24h: -1.2,
    logo: null,
    category: ['platform'],
    holderStats: {
      whales: 10,
      retail: 500,
      devs: 50
    },
    holders: 560
  }
];

// Sample creator milestones
const mockCreatorMilestones = [
  {
    id: 'milestone1',
    tokenId: '1',
    amount: 500,
    eligibleTimestamp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'milestone2',
    tokenId: '1',
    amount: 1000,
    eligibleTimestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  }
];

export const tokenTradingService = {
  // Get all transactions for a specific token
  getTokenTransactions: async (tokenId: string): Promise<TokenTransaction[]> => {
    // In a real app, this would fetch from an API or blockchain
    return mockTransactions.filter(tx => tx.tokenSymbol === tokenId);
  },

  // Get all transactions for a specific user
  getUserTransactions: async (userId: string): Promise<TokenTransaction[]> => {
    // In a real app, this would fetch from an API or blockchain
    console.log(`Fetching transactions for user: ${userId}`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockTransactions;
  },

  // Execute a trade
  executeTrade: async (params: TradeParams): Promise<TradeResult> => {
    const { tokenSymbol, action, walletAddress, amountSol, amountTokens } = params;
    
    // In a real app, this would call a blockchain transaction
    console.log(`Executing ${action} trade for ${tokenSymbol}`);
    
    // Simulate successful trade
    const newTransaction: TokenTransaction = {
      id: Math.random().toString(36).substring(2, 15),
      tokenSymbol,
      userId: walletAddress,
      amount: action === 'buy' ? (amountTokens || 0) : (amountTokens || 0),
      amountUsd: (amountSol || 0) * 1.5, // Mock price calculation
      price: 1.5,
      side: action,
      status: 'completed',
      timestamp: new Date().toISOString(),
      txHash: '0x' + Math.random().toString(36).substring(2, 15)
    };

    mockTransactions.push(newTransaction);
    
    // Return trade result
    return {
      success: true,
      amount: action === 'buy' ? amountSol : amountTokens,
      amountTokens: action === 'buy' ? amountTokens : undefined,
      amountSol: action === 'sell' ? amountSol : undefined,
      price: 1.5,
      txHash: newTransaction.txHash
    };
  },
  
  // Get listed tokens
  getListedTokens: async (): Promise<ListedToken[]> => {
    // In a real app, this would fetch from an API
    await new Promise(resolve => setTimeout(resolve, 300));
    return mockListedTokens;
  },
  
  // Launch a new token
  launchToken: async (params: TokenLaunchParams) => {
    console.log('Launching token:', params);
    
    // Simulate token launch
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const tokenId = Math.random().toString(36).substring(2, 10);
    const contractAddress = '0x' + Math.random().toString(36).substring(2, 42);
    
    // Add to mock listed tokens
    mockListedTokens.push({
      id: tokenId,
      name: params.name,
      symbol: params.symbol,
      price: 0.01,
      marketCap: 10000,
      volume24h: 0,
      change24h: 0,
      logo: params.logo || null,
      category: params.categories || ['new'],
      holderStats: {
        whales: 0,
        retail: 1,
        devs: 1
      },
      holders: 1
    });
    
    return {
      success: true,
      tokenId,
      contractAddress
    };
  },
  
  // Buy initial supply
  buyInitialSupply: async (tokenId: string, amountSol: number) => {
    console.log(`Buying initial supply for token ${tokenId}`);
    
    // Simulate purchase
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      amountSol,
      amountTokens: amountSol * 100, // Mock conversion rate
      txHash: '0x' + Math.random().toString(36).substring(2, 42)
    };
  },
  
  // Get creator milestones
  getCreatorMilestones: async (walletAddress: string) => {
    console.log(`Fetching creator milestones for wallet: ${walletAddress}`);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockCreatorMilestones;
  },
  
  // Claim creator fees
  claimCreatorFees: async (milestoneId: string, walletAddress: string) => {
    console.log(`Claiming creator fees for milestone: ${milestoneId}`);
    
    // Find the milestone
    const milestone = mockCreatorMilestones.find(m => m.id === milestoneId);
    
    if (!milestone) {
      return { success: false, message: 'Milestone not found' };
    }
    
    // Check if eligible
    const eligibleDate = new Date(milestone.eligibleTimestamp);
    if (eligibleDate > new Date()) {
      return { success: false, message: 'Milestone not yet eligible for claiming' };
    }
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true, amount: milestone.amount };
  }
};
