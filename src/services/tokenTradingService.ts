
import { supabase } from '@/integrations/supabase/client';

// Types
export interface HolderStats {
  whales: number;
  devs: number;
  retail: number;
}

export interface ListedToken {
  id?: string;
  name?: string;
  symbol?: string;
  logo?: string;
  banner?: string;
  price?: number;
  marketCap?: number;
  volume24h?: number;
  change24h?: number;
  holders?: number;
  category?: string[];
  holderStats?: HolderStats;
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
}

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
    holders: 1200,
    category: ["Meme", "Utility"],
    holderStats: { whales: 12, devs: 8, retail: 1180 }
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
    holders: 3500,
    category: ["Meme", "Doge"],
    holderStats: { whales: 23, devs: 5, retail: 3472 }
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
    holders: 2100,
    category: ["Meme", "Pepe"],
    holderStats: { whales: 8, devs: 3, retail: 2089 }
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
    holders: 1800,
    category: ["Meme", "Cat"],
    holderStats: { whales: 15, devs: 7, retail: 1778 }
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

export const tokenTradingService = {
  getListedTokens,
  getTokenDetails
};
