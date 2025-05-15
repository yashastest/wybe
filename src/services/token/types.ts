
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
  // Add the missing properties that are being used in the code
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
  creatorWallet: string;
  logo?: File;
  // Add missing properties that are being used in the code
  totalSupply?: number;
  creator?: {
    wallet: string;
    email?: string;
  };
}

export interface TokenLaunchResponse {
  success: boolean;
  message: string;
  tokenId?: string;
  symbol?: string;
  name?: string;
  contractAddress?: string;
  // Add the missing property that is being used in the code
  error?: string;
}

// Add missing interface for InitialSupplyPurchaseResponse
export interface InitialSupplyPurchaseResponse {
  success: boolean;
  amountSol?: number;
  amountTokens?: number;
  error?: string;
}
