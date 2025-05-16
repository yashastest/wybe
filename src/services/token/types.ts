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
  status: 'pending' | 'confirmed' | 'failed' | 'completed'; // Added 'completed' status
  amountTokens?: number;  // For backward compatibility
  amountSol?: number; // For backward compatibility
}

export interface TradeHistoryFilters {
  tokenSymbol?: string;
  side?: 'buy' | 'sell'; // Type of transaction
  startDate?: Date;
  endDate?: Date;
  status?: 'pending' | 'confirmed' | 'failed' | 'completed'; // Added status filter
  walletAddress?: string; // Added wallet address filter
}

export interface ListedToken {
  id: string;
  symbol: string;
  name: string;
  price: number;
  priceChange24h?: number;
  change24h?: number; // Added for backward compatibility
  logo?: string | null;
  contractAddress?: string;
  marketCap?: number;
  volume24h?: number;
  liquidity?: number;
  totalSupply?: number;
  description?: string;
  isAssisted?: boolean; // Added for admin views
  creatorAddress?: string;
  category?: string[]; // Added for MemeCoins component
  banner?: string; // Added for useTokenListing
  holderStats?: { // Added for TrendingCoins component
    whales: number;
    retail: number;
    devs: number;
  };
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
  // Adding backward compatibility properties
  amountSol?: number;
  amountTokens?: number;
  errorMessage?: string;
}

// Token launch related types
export interface TokenLaunchParams {
  name: string;
  symbol: string;
  totalSupply: number;
  description?: string;
  logoUrl?: string;
  initialPrice?: number;
  creatorAddress?: string;
  bondingCurveType?: 'linear' | 'quadratic' | 'exponential';
  creatorFeePercentage?: number;
  platformFeePercentage?: number;
  // Adding backward compatibility properties
  initialSupply?: number;
  creatorWallet?: string;
  logo?: File;
  creator?: {
    wallet: string;
  };
}

export interface TokenLaunchResult {
  success: boolean;
  tokenId?: string;
  contractAddress?: string;
  error?: string;
  message?: string; // Added for backward compatibility
}

// Aliases for backward compatibility
export type TokenLaunchResponse = TokenLaunchResult;
export type InitialSupplyPurchaseResponse = TradeResult;

// Smart contract service related types
export interface DeploymentResult {
  success: boolean;
  programId?: string;
  error?: string;
  // Backward compatibility
  message?: string;
  transactionId?: string;
}

export interface TestnetContract {
  id: string;
  name: string;
  address: string;
  deployedAt: string;
  status: 'active' | 'testing' | 'failed' | 'inactive';
  programId: string;
  network: string;
  deploymentDate: string;
  testTxCount: number;
}

export interface SecurityAuditResult {
  finding: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  recommendation: string;
}

export interface GasUsageResult {
  functionName: string;
  estimatedGas: number;
  suggestions: string[];
}
