
export interface TokenTransaction {
  id: string;
  tokenSymbol: string;
  tokenName?: string;
  userId: string;
  walletAddress?: string;
  amount: number;
  amountUsd?: number;
  amountTokens?: number;
  amountSol?: number;
  price: number;
  fee?: number;
  side: 'buy' | 'sell';
  type?: 'buy' | 'sell';
  status: 'pending' | 'completed' | 'failed' | 'confirmed';
  timestamp: string;
  txHash: string;
}

export interface ListedToken {
  id: string;
  name: string;
  symbol: string;
  price: number;
  marketCap?: number;
  volume24h?: number;
  change24h?: number;
  priceChange24h?: number;
  logo: string | null;
  description?: string;
  website?: string;
  twitter?: string;
  telegram?: string;
  contractAddress?: string;
  launchDate?: string;
  isAssisted?: boolean;
  devWallet?: string;
  category: string[];
  totalSupply?: number;
  creatorAddress?: string;
  creatorWallet?: string;
  holderStats: {
    whales: number;
    retail: number;
    devs: number;
  };
  holders: number;
}

export interface TokenLaunchParams {
  name: string;
  symbol: string;
  logo?: string | null | File;
  description?: string;
  initialSupply: number;
  totalSupply?: number;
  creatorWallet: string;
  creatorAddress?: string;
  creator?: {
    wallet: string;
  };
  categories?: string[];
}

export interface TradeResult {
  success: boolean;
  error?: string;
  errorMessage?: string;
  amount?: number;
  price?: number;
  fee?: number;
  txHash?: string;
  amountTokens?: number;
  amountSol?: number;
}

export interface TradeParams {
  tokenSymbol: string;
  walletAddress: string;
  action: 'buy' | 'sell';
  amountSol?: number;
  amountTokens?: number;
  gasPriority?: string | number;
}

export interface TradeHistoryFilters {
  tokenSymbol?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  side?: 'buy' | 'sell';
}

export interface TokenLaunchResponse {
  success: boolean;
  error?: string;
  tokenId?: string;
  contractAddress?: string;
}

export interface TokenLaunchResult {
  success: boolean;
  tokenId?: string;
  contractAddress?: string;
  error?: string;
}

export interface InitialSupplyPurchaseResponse {
  success: boolean;
  error?: string;
  amountSol?: number;
  amountTokens?: number;
  txHash?: string;
}

export interface TestnetContract {
  id: string;
  name: string;
  symbol: string;
  address: string;
  status: 'pending' | 'deployed' | 'verified';
  network: string;
  createdAt: string;
}
