
import { TokenTransaction } from './token/types';

// Sample mock data for transactions
const mockTransactions: TokenTransaction[] = [
  {
    id: '1',
    tokenId: '1',
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
    tokenId: '1',
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
    tokenId: '2',
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

export const tokenTradingService = {
  // Get all transactions for a specific token
  getTokenTransactions: async (tokenId: string): Promise<TokenTransaction[]> => {
    // In a real app, this would fetch from an API or blockchain
    return mockTransactions.filter(tx => tx.tokenId === tokenId);
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
  executeTrade: async (
    tokenId: string,
    side: 'buy' | 'sell',
    amount: number,
    userId: string
  ): Promise<TokenTransaction> => {
    // In a real app, this would call a blockchain transaction
    const token = mockTransactions.find(tx => tx.tokenId === tokenId);
    if (!token) throw new Error('Token not found');

    const newTransaction: TokenTransaction = {
      id: Math.random().toString(36).substring(2, 15),
      tokenId,
      tokenSymbol: token.tokenSymbol,
      userId,
      amount,
      amountUsd: amount * token.price,
      price: token.price,
      side,
      status: 'completed',
      timestamp: new Date().toISOString(),
      txHash: '0x' + Math.random().toString(36).substring(2, 15)
    };

    mockTransactions.push(newTransaction);
    return newTransaction;
  }
};
