
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
  category?: string[];
  devWallet?: string;
  holderStats?: {
    whales: number;
    retail: number;
    devs: number;
  };
  holders?: number;
}

export interface TokenLaunchParams {
  name: string;
  symbol: string;
  initialSupply: number;
  creatorWallet?: string; // Make optional to allow either creatorWallet or creator.wallet
  logo?: File;
  totalSupply?: number;
  creator?: {
    wallet: string;
    email?: string;
  };
}

export interface TokenLaunchResponse {
  success: boolean;
  message: string; // Required field for all responses
  tokenId?: string;
  symbol?: string;
  name?: string;
  contractAddress?: string;
  error?: string;
}

// Interface for InitialSupplyPurchaseResponse
export interface InitialSupplyPurchaseResponse {
  success: boolean;
  amountSol?: number;
  amountTokens?: number;
  error?: string;
}
