
export interface TokenHolderStats {
  whales: number;
  retail: number;
  devs: number;
}

export interface ListedToken {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  logo?: string | null;
  creatorWallet: string;
  totalSupply?: number;
  category?: string[];
  devWallet?: string;
  holderStats?: TokenHolderStats;
  holders?: number;
}

export interface TokenLaunchParams {
  name: string;
  symbol: string;
  initialSupply: number;
  totalSupply?: number;
  creatorWallet?: string;
  creator?: {
    wallet: string;
  };
  logo?: File;
}

export interface TokenLaunchResponse {
  success: boolean;
  message?: string;
  error?: string;
  tokenId?: string;
}

export interface InitialSupplyPurchaseResponse {
  success: boolean;
  message?: string;
  error?: string;
  amountSol?: number;
  amountTokens?: number;
  tx?: string;
}

export interface TradeParams {
  tokenSymbol: string;
  action: 'buy' | 'sell';
  walletAddress: string;
  amountSol?: number;
  amountTokens?: number;
  gasPriority?: 'low' | 'medium' | 'high';
}

export interface TradeResult {
  success: boolean;
  message?: string;
  error?: string;
  errorMessage?: string;
  txHash?: string;
  amountSol?: number;
  amountTokens?: number;
  price?: number;
  fee?: number;
}

export interface TokenTransaction {
  id: string;
  txHash: string;
  tokenSymbol: string;
  tokenName?: string;
  type: 'buy' | 'sell' | 'transfer' | 'mint';
  side?: 'buy' | 'sell'; // Adding side for compatibility with existing code
  amount: number;
  amountUsd?: number;
  price?: number;
  fee?: number;
  timestamp: string;
  walletAddress: string;
  status: 'pending' | 'confirmed' | 'failed';
  amountTokens?: number; // Adding for compatibility with existing code
  amountSol?: number; // Adding for compatibility with existing code
}

export interface DeploymentOptions {
  network: 'devnet' | 'testnet' | 'mainnet';
  bondingCurveType: 'linear' | 'exponential' | 'logarithmic';
  initialPrice: number;
  platformFee: number;
  creatorFee: number;
  mintAuthority: string;
}

export interface SmartContractStatus {
  deployed: boolean;
  verified: boolean;
  programId?: string;
  deploymentDate?: string;
  lastAuditDate?: string;
  auditScore?: number;
}

// Add the trade history filters interface
export interface TradeHistoryFilters {
  tokenSymbol?: string;
  side?: 'buy' | 'sell';
  startDate?: Date;
  endDate?: Date;
}
