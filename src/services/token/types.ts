
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
