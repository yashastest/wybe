
// Types used by token-related services

export interface TokenLaunchParams {
  name: string;
  symbol: string;
  initialSupply: number;
  totalSupply?: number;
  creatorWallet?: string;
  creator?: { wallet: string };
}

export interface TokenLaunchResponse {
  success: boolean;
  tokenId?: string;
  error?: string;
}

export interface ListedToken {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume24h: number;
  logo: string | null;
  category?: string[];
  devWallet?: string;
  creatorWallet?: string;
  totalSupply?: number;
}

export interface TradeParams {
  walletAddress: string;
  tokenSymbol: string;
  action: 'buy' | 'sell';
  amountSol?: number;
  amountTokens?: number;
  gasPriority?: number;
}

export interface TokenTransaction {
  id: string;
  tokenSymbol: string;
  side: 'buy' | 'sell';
  amount: number;
  amountTokens?: number;
  amountSol?: number;
  price: number;
  timestamp: string;
  status: string;
  txHash?: string;
  walletAddress: string;
}
