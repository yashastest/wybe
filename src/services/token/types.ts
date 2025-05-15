
// Service types

export interface TradeParams {
  tokenSymbol: string;
  walletAddress: string;
  action: 'buy' | 'sell';
  amountSol?: number;
  amountTokens?: number;
  gasPriority?: number;
}

export interface TradeResult {
  success: boolean;
  txHash?: string;
  price?: number;
  amountSol?: number;
  amountTokens?: number;
  error?: string;
  errorMessage?: string;
}

export type TradeHistoryFilters = string | {
  tokenSymbol?: string;
  side?: 'buy' | 'sell';
  startDate?: Date;
  endDate?: Date;
};

export interface TokenTransaction {
  id: string;
  tokenSymbol: string;
  side: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: string;
  status: 'confirmed' | 'pending' | 'failed';
  txHash?: string;
  walletAddress: string;
  amountSol?: number;
  amountTokens?: number;
}

export interface ListedToken {
  id: string;
  symbol: string;
  name: string;
  logo: string | null;
  price: number;
  marketCap: number;
  creatorWallet: string;
  change24h: number;
  volume24h: number;
  totalSupply: number;
}

export interface TokenLaunchParams {
  name: string;
  symbol: string;
  creatorWallet: string;
  initialSupply: number;
  logo?: File;
}

export interface TokenLaunchResponse {
  success: boolean;
  message: string;
  tokenId?: string;
  symbol?: string;
  name?: string;
  contractAddress?: string;
}
