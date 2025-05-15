
// Token trading related types
export interface TokenTransaction {
  id: string;
  txHash: string;
  tokenSymbol: string;
  tokenName: string;
  type: 'buy' | 'sell';
  side?: 'buy' | 'sell'; // For backward compatibility
  amount: number;  // Amount in SOL
  amountUsd: number;
  price: number;
  fee: number;
  timestamp: string;
  walletAddress: string;
  status: 'pending' | 'confirmed' | 'failed';
  amountTokens?: number;  // For backward compatibility
  amountSol?: number; // For backward compatibility
}

export interface TradeHistoryFilters {
  tokenSymbol?: string;
  side?: 'buy' | 'sell'; // Type of transaction
  startDate?: Date;
  endDate?: Date;
  status?: 'pending' | 'confirmed' | 'failed';
  walletAddress?: string;
}

export interface ListedToken {
  id: string;
  name: string;
  symbol: string;
  price: number;
  priceChange24h?: number;
  volume24h?: number;
  marketCap?: number;
  totalSupply?: number;
  status: 'active' | 'pending' | 'inactive' | string;
  description?: string;
  logo?: string;
  createdAt: string;
  contractAddress?: string;
  creatorAddress?: string;
}

export interface TradeParams {
  walletAddress: string;
  tokenSymbol: string;
  action: 'buy' | 'sell';
  gasPriority: 'low' | 'medium' | 'high';
  amountSol?: number;
  amountTokens?: number;
}

export interface TradeResult {
  success: boolean;
  txHash?: string;
  amount?: number;
  price?: number;
  fee?: number;
  error?: string;
}

// Token launch related types
export interface TokenLaunchParams {
  name: string;
  symbol: string;
  totalSupply: number;
  description: string;
  logoUrl?: string;
  initialPrice: number;
  creatorAddress: string;
  bondingCurveType: 'linear' | 'quadratic' | 'exponential';
  creatorFeePercentage: number;
  platformFeePercentage: number;
}

export interface TokenLaunchResult {
  success: boolean;
  tokenId?: string;
  contractAddress?: string;
  error?: string;
}
