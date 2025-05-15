
export interface TokenData {
  id: string;
  name: string;
  symbol: string;
  token_address?: string;
  creator_wallet: string;
  created_at?: string;
  launch_date?: string;
  launched?: boolean;
  market_cap: number;
  bonding_curve?: {
    price?: number;
    change_24h?: number;
    volume_24h?: number;
    tags?: string[] | string;
  };
  price?: number;  // Direct price field as fallback
}

export interface Transaction {
  id: string;
  token_id: string;
  wallet: string;
  type: 'buy' | 'sell' | 'mint' | 'claim';
  amount: number;
  price: number;
  fee: number;
  created_at: string;
}
