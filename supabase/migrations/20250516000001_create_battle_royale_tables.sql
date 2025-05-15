
-- Create battle rooms table
CREATE TABLE public.battle_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('open', 'full', 'active', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  waiting_time_end TIMESTAMP WITH TIME ZONE NOT NULL,
  battle_end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  max_participants SMALLINT NOT NULL CHECK (max_participants BETWEEN 2 AND 5),
  participant_count SMALLINT DEFAULT 0,
  total_fees_collected NUMERIC DEFAULT 0,
  winner_token_id UUID,
  platform_fee_percentage SMALLINT NOT NULL DEFAULT 10
);

-- Create battle tokens table
CREATE TABLE public.battle_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  battle_room_id UUID REFERENCES public.battle_rooms(id),
  token_symbol TEXT NOT NULL,
  token_name TEXT NOT NULL,
  token_address TEXT,
  creator_wallet TEXT NOT NULL,
  initial_supply NUMERIC NOT NULL,
  current_market_cap NUMERIC DEFAULT 0,
  total_fees NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_winner BOOLEAN DEFAULT FALSE
);

-- Create trades table for battle tokens
CREATE TABLE public.battle_trades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  battle_token_id UUID REFERENCES public.battle_tokens(id),
  wallet_address TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  fee_amount NUMERIC NOT NULL,
  trade_type TEXT NOT NULL CHECK (trade_type IN ('buy', 'sell')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  tx_hash TEXT
);

-- Create rewards table
CREATE TABLE public.battle_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  battle_room_id UUID REFERENCES public.battle_rooms(id),
  battle_token_id UUID REFERENCES public.battle_tokens(id),
  wallet_address TEXT NOT NULL,
  reward_amount NUMERIC NOT NULL,
  claimed BOOLEAN DEFAULT FALSE,
  claimed_at TIMESTAMP WITH TIME ZONE,
  tx_hash TEXT
);

-- Add foreign key to winner_token_id in battle_rooms
ALTER TABLE public.battle_rooms
ADD CONSTRAINT fk_winner_token
FOREIGN KEY (winner_token_id)
REFERENCES public.battle_tokens(id)
DEFERRABLE INITIALLY DEFERRED;

-- Add indexes for performance
CREATE INDEX idx_battle_rooms_status ON public.battle_rooms(status);
CREATE INDEX idx_battle_tokens_room_id ON public.battle_tokens(battle_room_id);
CREATE INDEX idx_battle_trades_token_id ON public.battle_trades(battle_token_id);
CREATE INDEX idx_battle_rewards_wallet ON public.battle_rewards(wallet_address);

-- Create view for active battles
CREATE VIEW public.view_active_battles AS
SELECT 
  br.id,
  br.room_id,
  br.status,
  br.waiting_time_end,
  br.battle_end_time,
  br.max_participants,
  br.participant_count,
  CASE 
    WHEN NOW() < br.waiting_time_end THEN 'waiting'
    WHEN NOW() < br.battle_end_time THEN 'active'
    ELSE 'ended'
  END AS battle_status,
  EXTRACT(EPOCH FROM (br.waiting_time_end - NOW())) AS seconds_to_start,
  EXTRACT(EPOCH FROM (br.battle_end_time - NOW())) AS seconds_remaining
FROM 
  public.battle_rooms br
WHERE 
  br.status IN ('open', 'full', 'active')
  AND br.battle_end_time > NOW();

-- Create view for token leaderboard
CREATE VIEW public.view_token_leaderboard AS
SELECT 
  bt.id,
  bt.token_symbol,
  bt.token_name,
  bt.creator_wallet,
  bt.initial_supply,
  bt.current_market_cap,
  bt.total_fees,
  br.id AS battle_room_id,
  br.room_id,
  br.status AS room_status,
  CASE 
    WHEN NOW() < br.waiting_time_end THEN 'waiting'
    WHEN NOW() < br.battle_end_time THEN 'active'
    ELSE 'ended'
  END AS battle_status,
  bt.is_winner
FROM 
  public.battle_tokens bt
JOIN 
  public.battle_rooms br ON bt.battle_room_id = br.id
ORDER BY 
  bt.current_market_cap DESC;

-- Create view for user rewards
CREATE VIEW public.view_user_rewards AS
SELECT 
  br.wallet_address,
  SUM(br.reward_amount) AS total_rewards,
  COUNT(*) FILTER (WHERE br.claimed = TRUE) AS claimed_count,
  COUNT(*) FILTER (WHERE br.claimed = FALSE) AS unclaimed_count,
  SUM(br.reward_amount) FILTER (WHERE br.claimed = TRUE) AS claimed_amount,
  SUM(br.reward_amount) FILTER (WHERE br.claimed = FALSE) AS unclaimed_amount
FROM 
  public.battle_rewards br
GROUP BY 
  br.wallet_address;

-- Row Level Security Policies
ALTER TABLE public.battle_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battle_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battle_trades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.battle_rewards ENABLE ROW LEVEL SECURITY;

-- Everyone can view battle rooms
CREATE POLICY "Anyone can view battle rooms" 
  ON public.battle_rooms FOR SELECT 
  USING (true);

-- Everyone can view battle tokens
CREATE POLICY "Anyone can view battle tokens" 
  ON public.battle_tokens FOR SELECT 
  USING (true);

-- Everyone can view trades
CREATE POLICY "Anyone can view trades" 
  ON public.battle_trades FOR SELECT 
  USING (true);

-- Users can only view their own rewards
CREATE POLICY "Users can view their own rewards" 
  ON public.battle_rewards FOR SELECT 
  USING (wallet_address = auth.uid()::text);

-- Create functions to update battle room status
CREATE OR REPLACE FUNCTION update_battle_room_status()
RETURNS TRIGGER AS $$
BEGIN
  -- Update room to 'full' if participant_count = max_participants
  UPDATE public.battle_rooms
  SET status = 'full'
  WHERE id IN (
    SELECT id FROM public.battle_rooms
    WHERE status = 'open'
    AND participant_count >= max_participants
  );
  
  -- Update room to 'active' if waiting time has passed
  UPDATE public.battle_rooms
  SET status = 'active'
  WHERE id IN (
    SELECT id FROM public.battle_rooms
    WHERE status IN ('open', 'full')
    AND waiting_time_end <= NOW()
    AND participant_count >= 2
  );
  
  -- Update room to 'closed' if battle time has ended
  UPDATE public.battle_rooms
  SET status = 'closed'
  WHERE id IN (
    SELECT id FROM public.battle_rooms
    WHERE status = 'active'
    AND battle_end_time <= NOW()
  );
  
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to run the function periodically
CREATE OR REPLACE FUNCTION create_battle_status_trigger()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_battle_room_status();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_battle_status
AFTER INSERT OR UPDATE ON public.battle_rooms
FOR EACH STATEMENT
EXECUTE FUNCTION create_battle_status_trigger();
