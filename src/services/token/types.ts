
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
}

export interface TokenLaunchParams {
  name: string;
  symbol: string;
  initialSupply: number;
  creator: {
    wallet: string;
    email?: string;
  };
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
