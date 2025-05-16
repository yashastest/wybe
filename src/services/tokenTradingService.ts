
import { supabase } from '@/integrations/supabase/client';
import { TokenTransaction as ImportedTokenTransaction, TradeHistoryFilters as ImportedTradeHistoryFilters } from '@/services/token/types';

// Types
export interface HolderStats {
  whales: number;
  devs: number;
  retail: number;
}

export interface ListedToken {
  id: string;
  name?: string;
  symbol?: string;
  logo?: string;
  banner?: string;
  price?: number;
  marketCap?: number;
  volume24h?: number;
  change24h?: number;
  priceChange24h?: number;
  holders?: number;
  category?: string[];
  holderStats?: HolderStats;
  contractAddress?: string;
  isAssisted?: boolean;
  description?: string;
  totalSupply?: number;
  creatorAddress?: string;
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
  txHash?: string;
  amount?: number;
  amountTokens?: number;
  price?: number;
  error?: string;
  errorMessage?: string;
  amountSol?: number;
  fee?: number;
}

// Reexport types from token/types for compatibility
export type TokenTransaction = ImportedTokenTransaction;
export type TradeHistoryFilters = ImportedTradeHistoryFilters;

// Sample tokens for demonstration
const sampleTokens: ListedToken[] = [
  {
    id: "wybe-token",
    name: "Wybe",
    symbol: "WYBE",
    logo: "/lovable-uploads/dcb3ea81-25ba-4438-90a5-c7403026c91e.png",
    banner: "/lovable-uploads/5f8a8eb9-3963-4b1b-8ca5-2beecbb60b39.png",
    price: 0.00145,
    marketCap: 1450000,
    volume24h: 345000,
    change24h: 25.4,
    priceChange24h: 25.4,
    holders: 1200,
    category: ["Meme", "Utility"],
    holderStats: { whales: 12, devs: 8, retail: 1180 },
    description: "Wybe is a community-driven token with utility features.",
    contractAddress: "wybeX123456789abcdef",
    isAssisted: true,
    totalSupply: 1000000000
  },
  {
    id: "solana-doge",
    name: "Solana Doge",
    symbol: "SOLDOGE",
    logo: "/lovable-uploads/dcb3ea81-25ba-4438-90a5-c7403026c91e.png", 
    banner: "/lovable-uploads/5f8a8eb9-3963-4b1b-8ca5-2beecbb60b39.png",
    price: 0.0000235,
    marketCap: 2350000,
    volume24h: 789000,
    change24h: 12.8,
    priceChange24h: 12.8,
    holders: 3500,
    category: ["Meme", "Doge"],
    holderStats: { whales: 23, devs: 5, retail: 3472 },
    description: "The first Doge-themed token on Solana.",
    contractAddress: "soldogeX123456789abcdef",
    totalSupply: 10000000000
  },
  {
    id: "pepe-sol",
    name: "Pepe Solana",
    symbol: "PEPES",
    logo: "/lovable-uploads/dcb3ea81-25ba-4438-90a5-c7403026c91e.png",
    banner: "/lovable-uploads/5f8a8eb9-3963-4b1b-8ca5-2beecbb60b39.png",
    price: 0.00000812,
    marketCap: 812000,
    volume24h: 156000,
    change24h: -8.2,
    priceChange24h: -8.2,
    holders: 2100,
    category: ["Meme", "Pepe"],
    holderStats: { whales: 8, devs: 3, retail: 2089 },
    description: "Pepe goes Solana with this meme token.",
    contractAddress: "pepesolX123456789abcdef",
    isAssisted: false,
    totalSupply: 69000000000
  },
  {
    id: "solana-cat",
    name: "Solana Cat",
    symbol: "SCAT",
    logo: "/lovable-uploads/dcb3ea81-25ba-4438-90a5-c7403026c91e.png",
    banner: "/lovable-uploads/5f8a8eb9-3963-4b1b-8ca5-2beecbb60b39.png",
    price: 0.000124,
    marketCap: 1240000,
    volume24h: 234000,
    change24h: 5.6,
    priceChange24h: 5.6,
    holders: 1800,
    category: ["Meme", "Cat"],
    holderStats: { whales: 15, devs: 7, retail: 1778 },
    description: "A cat-themed token built on Solana.",
    contractAddress: "scatX123456789abcdef",
    isAssisted: false,
    totalSupply: 5000000000
  }
];

// Mock transaction data
const sampleTransactions: TokenTransaction[] = [
  {
    id: "1",
    txHash: "tx_123456789abcdef",
    tokenSymbol: "WYBE",
    tokenName: "Wybe Token",
    type: "buy",
    side: "buy",
    amount: 0.25,
    amountUsd: 75,
    price: 0.015,
    fee: 0.005,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    walletAddress: "wallet123",
    status: "confirmed",
    amountTokens: 5000,
    amountSol: 0.25
  },
  {
    id: "2",
    txHash: "tx_abcdef123456789",
    tokenSymbol: "WYBE",
    tokenName: "Wybe Token",
    type: "sell",
    side: "sell",
    amount: 0.15,
    amountUsd: 45,
    price: 0.014,
    fee: 0.003,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    walletAddress: "wallet123",
    status: "confirmed",
    amountTokens: 3000,
    amountSol: 0.15
  }
];

// Mock implementation that simulates API calls
const getListedTokens = async (): Promise<ListedToken[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return sample tokens
  return [...sampleTokens];
};

const getTokenDetails = async (symbol: string): Promise<ListedToken | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Find token by symbol (case insensitive)
  const token = sampleTokens.find(t => 
    t.symbol?.toLowerCase() === symbol.toLowerCase()
  );
  
  return token || null;
};

// Add the missing functions
const executeTrade = async (params: TradeParams): Promise<TradeResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  const { tokenSymbol, action, amountSol, amountTokens } = params;
  
  // Find the token to get current price
  const token = sampleTokens.find(t => t.symbol === tokenSymbol);
  
  if (!token) {
    return {
      success: false,
      error: `Token ${tokenSymbol} not found`
    };
  }
  
  const price = token.price || 0.001;
  
  // Calculate result based on action
  if (action === 'buy') {
    const calculatedTokens = amountSol ? amountSol / price : (amountTokens || 0);
    
    return {
      success: true,
      txHash: `tx_${Math.random().toString(36).substring(2, 15)}`,
      amount: calculatedTokens,
      amountTokens: calculatedTokens,
      amountSol: amountSol || (amountTokens ? amountTokens * price : 0),
      price: price,
      fee: 0.001
    };
  } else {
    const calculatedSol = amountTokens ? amountTokens * price : (amountSol || 0);
    
    return {
      success: true,
      txHash: `tx_${Math.random().toString(36).substring(2, 15)}`,
      amount: calculatedSol,
      amountSol: calculatedSol,
      amountTokens: amountTokens || (amountSol ? amountSol / price : 0),
      price: price,
      fee: 0.001
    };
  }
};

const getUserTransactions = async (walletAddress: string, filters?: TradeHistoryFilters): Promise<TokenTransaction[]> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Apply basic filtering (just wallet for now)
  return sampleTransactions.filter(tx => tx.walletAddress === walletAddress);
};

const launchToken = async (params: any) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    success: true,
    tokenId: `token_${Math.random().toString(36).substring(2, 10)}`,
    message: `Token ${params.name} (${params.symbol}) launched successfully`
  };
};

const buyInitialSupply = async (tokenId: string, walletAddress: string, amount: number) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  return {
    success: true,
    amountSol: amount,
    amountTokens: amount * 10000,
    txHash: `tx_${Math.random().toString(36).substring(2, 15)}`
  };
};

export const tokenTradingService = {
  getListedTokens,
  getTokenDetails,
  executeTrade,
  getUserTransactions,
  launchToken,
  buyInitialSupply
};
