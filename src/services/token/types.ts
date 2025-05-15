
export interface TokenTransaction {
  id: string;
  tokenSymbol: string;
  side: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: string;
  walletAddress: string;
  status: 'pending' | 'confirmed' | 'failed';
  txHash: string;
  amountTokens: number;
  amountSol: number;
}

export type TradeHistoryFilters = string | {
  tokenSymbol?: string;
  side?: 'buy' | 'sell';
  startDate?: Date;
  endDate?: Date;
};

export interface TokenPriceHistory {
  timestamp: string;
  price: number;
  volume?: number;
}

export interface TokenMetrics {
  price: number;
  priceChange24h: number;
  priceChangePercentage24h: number;
  volume24h: number;
  marketCap: number;
  totalSupply: number;
  holders: number;
}

export interface TradeParams {
  tokenSymbol: string;
  action: 'buy' | 'sell';
  walletAddress: string;
  amountSol?: number;
  amountTokens?: number;
  gasPriority?: number;
}

export interface TradeResult {
  success: boolean;
  amountSol?: number;
  amountTokens?: number;
  txHash?: string;
  price?: number;
  error?: string;
  errorMessage?: string;
}

export interface ListedToken {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  logo?: string;
  category?: string[];
  holders?: number;
  devWallet?: string;
  holderStats: {
    whales: number;
    retail: number;
    devs: number;
  };
  initialSupply?: number;
  currentSupply?: number;
}

export interface TokenLaunchParams {
  name: string;
  symbol: string;
  initialSupply: number;
  totalSupply: number;
  creator: {
    wallet: string;
    email?: string;
  };
  creatorWallet?: string; // Added for backwards compatibility
  initialPrice?: number;
}

export interface TokenLaunchResponse {
  success: boolean;
  tokenId?: string;
  error?: string;
}

export interface InitialSupplyPurchaseResponse {
  success: boolean;
  amountSol?: number;
  amountTokens?: number;
  error?: string;
}

// Database schema representation - for better type safety when interfacing with the database
export interface TokenDatabaseSchema {
  id: string;
  name: string;
  symbol: string;
  creator_wallet: string;
  token_address?: string;
  market_cap: number;
  launched: boolean;
  launch_date?: string;
  created_at: string;
  bonding_curve?: any;
  initial_supply?: number;
  current_supply?: number;
}
