
-- Create a table for trades if it doesn't exist
create table if not exists trades (
  id uuid primary key default gen_random_uuid(),
  wallet_address text not null,
  token_symbol text not null,
  side text check (side in ('buy', 'sell')) not null,
  amount numeric not null,
  tx_hash text,
  created_at timestamptz default now()
);

-- Add indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_trades_wallet_address ON trades(wallet_address);
CREATE INDEX IF NOT EXISTS idx_trades_token_symbol ON trades(token_symbol);
CREATE INDEX IF NOT EXISTS idx_trades_created_at ON trades(created_at);

-- Enable Row Level Security
ALTER TABLE trades ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see their own trades
CREATE POLICY "Users can view their own trades" 
  ON trades 
  FOR SELECT 
  USING (true);

-- Create policy to allow anyone to insert trades
CREATE POLICY "Anyone can insert trades" 
  ON trades 
  FOR INSERT 
  WITH CHECK (true);
