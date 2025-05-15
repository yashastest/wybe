
export interface TradeParams {
  walletAddress: string;
  tokenSymbol: string;
  action: 'buy' | 'sell';
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

export interface TokenTransaction {
  id: string;
  tokenSymbol: string;
  side: 'buy' | 'sell';  
  amount: number;
  price: number;
  timestamp: string;
  walletAddress: string;
  status: 'confirmed' | 'pending' | 'failed';
  txHash?: string;
  amountTokens: number;
  amountSol: number;
}

export interface ListedToken {
  id: string;
  name: string;
  symbol: string;
  logo: string | null;
  banner: string | null;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  category: string[];
  holders: number;
  devWallet: string;
  holderStats: {
    whales: number;
    retail: number;
    devs: number;
  };
  launchDate: string;
}

export interface TokenLaunchParams {
  name: string;
  symbol: string;
  creatorWallet: string;
  initialPrice: number;
  totalSupply: number;
}

export type TradeHistoryFilters = {
  tokenSymbol?: string;
  side?: 'buy' | 'sell';
  startDate?: Date;
  endDate?: Date;
} | string;
