
use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke, system_instruction};

declare_id!("Wyb222222222222222222222222222222222222222");

#[program]
pub mod meme_battle_royale {
    use super::*;

    // Create a new battle room
    pub fn create_battle_room(
        ctx: Context<CreateBattleRoom>,
        room_id: String,
        max_participants: u8,
        battle_duration_seconds: i64,
    ) -> Result<()> {
        require!(max_participants >= 2 && max_participants <= 5, ErrorCode::InvalidMaxParticipants);
        require!(battle_duration_seconds >= 3600 && battle_duration_seconds <= 86400, ErrorCode::InvalidBattleDuration);

        let battle_room = &mut ctx.accounts.battle_room;
        let clock = Clock::get()?;

        battle_room.room_id = room_id;
        battle_room.admin = ctx.accounts.admin.key();
        battle_room.max_participants = max_participants;
        battle_room.status = BattleRoomStatus::Open;
        battle_room.created_at = clock.unix_timestamp;
        battle_room.waiting_time_end = clock.unix_timestamp + 60; // 1 minute waiting time
        battle_room.battle_end_time = battle_room.waiting_time_end + battle_duration_seconds;
        battle_room.platform_fee_percentage = 10; // 10% to platform treasury
        battle_room.participant_count = 0;
        battle_room.total_fees_collected = 0;
        battle_room.winner_token = None;

        emit!(BattleRoomCreated {
            room_id: battle_room.room_id.clone(),
            admin: battle_room.admin,
            max_participants: battle_room.max_participants,
            created_at: battle_room.created_at,
            battle_start: battle_room.waiting_time_end,
            battle_end: battle_room.battle_end_time,
        });

        Ok(())
    }

    // Join a battle room with a token
    pub fn join_battle_room(
        ctx: Context<JoinBattleRoom>,
        token_symbol: String,
        token_name: String,
        initial_supply: u64,
    ) -> Result<()> {
        let battle_room = &mut ctx.accounts.battle_room;
        let battle_token = &mut ctx.accounts.battle_token;
        let creator = &ctx.accounts.creator;
        let clock = Clock::get()?;

        // Validate room is open and accepting participants
        require!(battle_room.status == BattleRoomStatus::Open, ErrorCode::RoomNotOpen);
        require!(battle_room.participant_count < battle_room.max_participants, ErrorCode::RoomFull);
        require!(clock.unix_timestamp < battle_room.waiting_time_end, ErrorCode::WaitingTimePassed);

        // Initialize the token
        battle_token.token_symbol = token_symbol;
        battle_token.token_name = token_name;
        battle_token.creator = creator.key();
        battle_token.battle_room = battle_room.key();
        battle_token.initial_supply = initial_supply;
        battle_token.current_market_cap = 0;
        battle_token.total_fees = 0;
        battle_token.created_at = clock.unix_timestamp;
        battle_token.is_winner = false;

        // Update battle room
        battle_room.participant_count += 1;
        
        // Check if room is now full
        if battle_room.participant_count == battle_room.max_participants {
            battle_room.status = BattleRoomStatus::Full;
        }

        emit!(TokenJoinedBattle {
            room_id: battle_room.room_id.clone(),
            token_symbol: battle_token.token_symbol.clone(),
            creator: creator.key(),
            created_at: clock.unix_timestamp,
        });

        Ok(())
    }

    // Start the battle (automatically called when waiting time is over)
    pub fn start_battle(ctx: Context<StartBattle>) -> Result<()> {
        let battle_room = &mut ctx.accounts.battle_room;
        let clock = Clock::get()?;

        // Verify status and timing
        require!(
            battle_room.status == BattleRoomStatus::Open || battle_room.status == BattleRoomStatus::Full, 
            ErrorCode::InvalidRoomStatus
        );
        require!(clock.unix_timestamp >= battle_room.waiting_time_end, ErrorCode::WaitingTimeNotPassed);
        require!(battle_room.participant_count >= 2, ErrorCode::NotEnoughParticipants);

        battle_room.status = BattleRoomStatus::Active;
        
        emit!(BattleStarted {
            room_id: battle_room.room_id.clone(),
            start_time: clock.unix_timestamp,
            end_time: battle_room.battle_end_time,
            participant_count: battle_room.participant_count,
        });

        Ok(())
    }

    // Record trade and collect fees
    pub fn record_trade(
        ctx: Context<RecordTrade>,
        trade_amount: u64,
        fee_amount: u64,
        trade_type: TradeType,
        market_cap_update: u64,
    ) -> Result<()> {
        let battle_room = &mut ctx.accounts.battle_room;
        let battle_token = &mut ctx.accounts.battle_token;
        let trader = &ctx.accounts.trader;
        let trade_record = &mut ctx.accounts.trade_record;
        let clock = Clock::get()?;

        // Validate battle is active
        require!(battle_room.status == BattleRoomStatus::Active, ErrorCode::BattleNotActive);
        require!(clock.unix_timestamp <= battle_room.battle_end_time, ErrorCode::BattleEnded);

        // Record the trade
        trade_record.battle_token = battle_token.key();
        trade_record.trader = trader.key();
        trade_record.amount = trade_amount;
        trade_record.fee = fee_amount;
        trade_record.trade_type = trade_type;
        trade_record.timestamp = clock.unix_timestamp;

        // Update token info
        battle_token.current_market_cap = market_cap_update;
        battle_token.total_fees = battle_token.total_fees.checked_add(fee_amount)
            .ok_or(ErrorCode::ArithmeticOverflow)?;
        
        // Update battle room
        battle_room.total_fees_collected = battle_room.total_fees_collected.checked_add(fee_amount)
            .ok_or(ErrorCode::ArithmeticOverflow)?;

        emit!(TradeRecorded {
            battle_token: battle_token.key(),
            trader: trader.key(),
            amount: trade_amount,
            fee: fee_amount,
            trade_type,
            market_cap: market_cap_update,
            timestamp: clock.unix_timestamp,
        });

        Ok(())
    }

    // Close battle and distribute rewards
    pub fn close_battle(ctx: Context<CloseBattle>) -> Result<()> {
        let battle_room = &mut ctx.accounts.battle_room;
        let treasury = &ctx.accounts.treasury;
        let clock = Clock::get()?;

        // Validate timing and status
        require!(battle_room.status == BattleRoomStatus::Active, ErrorCode::InvalidRoomStatus);
        require!(clock.unix_timestamp >= battle_room.battle_end_time, ErrorCode::BattleNotEnded);

        battle_room.status = BattleRoomStatus::Closed;

        // Calculate platform fee (10%)
        let platform_fee = battle_room.total_fees_collected
            .checked_mul(battle_room.platform_fee_percentage as u64)
            .ok_or(ErrorCode::ArithmeticOverflow)?
            .checked_div(100)
            .ok_or(ErrorCode::ArithmeticOverflow)?;

        // In real implementation: Transfer platform fee to treasury
        // For now, just log it
        msg!("Platform fee of {} would be transferred to treasury", platform_fee);

        emit!(BattleClosed {
            room_id: battle_room.room_id.clone(),
            total_fees: battle_room.total_fees_collected,
            platform_fee,
            closed_at: clock.unix_timestamp,
        });

        Ok(())
    }

    // Set a token as the winner (admin only)
    pub fn set_winner(ctx: Context<SetWinner>) -> Result<()> {
        let battle_room = &mut ctx.accounts.battle_room;
        let battle_token = &mut ctx.accounts.battle_token;
        let admin = &ctx.accounts.admin;

        // Validate admin
        require!(battle_room.admin == admin.key(), ErrorCode::Unauthorized);
        
        // Validate battle status
        require!(battle_room.status == BattleRoomStatus::Closed, ErrorCode::BattleNotClosed);
        
        // Set winner info
        battle_room.winner_token = Some(battle_token.key());
        battle_token.is_winner = true;

        emit!(WinnerSet {
            room_id: battle_room.room_id.clone(),
            winner_token: battle_token.key(),
            token_symbol: battle_token.token_symbol.clone(),
        });

        Ok(())
    }

    // Claim rewards for traders
    pub fn claim_reward(ctx: Context<ClaimReward>, amount: u64) -> Result<()> {
        let battle_room = &ctx.accounts.battle_room;
        let battle_token = &ctx.accounts.battle_token;
        let trader = &ctx.accounts.trader;
        let reward_claim = &mut ctx.accounts.reward_claim;
        let clock = Clock::get()?;

        // Validate token is winner
        require!(battle_token.is_winner, ErrorCode::TokenNotWinner);
        
        // Validate battle is closed
        require!(battle_room.status == BattleRoomStatus::Closed, ErrorCode::BattleNotClosed);
        
        // In real implementation: Verify trader's reward amount
        // For now, just record the claim
        reward_claim.battle_room = battle_room.key();
        reward_claim.battle_token = battle_token.key();
        reward_claim.trader = trader.key();
        reward_claim.amount = amount;
        reward_claim.claimed_at = clock.unix_timestamp;

        emit!(RewardClaimed {
            room_id: battle_room.room_id.clone(),
            token_symbol: battle_token.token_symbol.clone(),
            trader: trader.key(),
            amount,
            claimed_at: clock.unix_timestamp,
        });

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(room_id: String, max_participants: u8, battle_duration_seconds: i64)]
pub struct CreateBattleRoom<'info> {
    #[account(
        init,
        payer = admin,
        space = 8 + BattleRoom::LEN
    )]
    pub battle_room: Account<'info, BattleRoom>,
    
    #[account(mut)]
    pub admin: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(token_symbol: String, token_name: String, initial_supply: u64)]
pub struct JoinBattleRoom<'info> {
    #[account(mut)]
    pub battle_room: Account<'info, BattleRoom>,
    
    #[account(
        init,
        payer = creator,
        space = 8 + BattleToken::LEN
    )]
    pub battle_token: Account<'info, BattleToken>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct StartBattle<'info> {
    #[account(mut)]
    pub battle_room: Account<'info, BattleRoom>,
    
    #[account(mut)]
    pub admin: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RecordTrade<'info> {
    #[account(mut)]
    pub battle_room: Account<'info, BattleRoom>,
    
    #[account(mut)]
    pub battle_token: Account<'info, BattleToken>,
    
    #[account(mut)]
    pub trader: Signer<'info>,
    
    #[account(
        init,
        payer = trader,
        space = 8 + TradeRecord::LEN
    )]
    pub trade_record: Account<'info, TradeRecord>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CloseBattle<'info> {
    #[account(mut)]
    pub battle_room: Account<'info, BattleRoom>,
    
    #[account(mut)]
    pub admin: Signer<'info>,
    
    /// CHECK: This is the treasury wallet for platform fees
    pub treasury: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct SetWinner<'info> {
    #[account(mut)]
    pub battle_room: Account<'info, BattleRoom>,
    
    #[account(mut)]
    pub battle_token: Account<'info, BattleToken>,
    
    #[account(mut)]
    pub admin: Signer<'info>,
}

#[derive(Accounts)]
pub struct ClaimReward<'info> {
    pub battle_room: Account<'info, BattleRoom>,
    
    pub battle_token: Account<'info, BattleToken>,
    
    #[account(mut)]
    pub trader: Signer<'info>,
    
    #[account(
        init,
        payer = trader,
        space = 8 + RewardClaim::LEN
    )]
    pub reward_claim: Account<'info, RewardClaim>,
    
    pub system_program: Program<'info, System>,
}

#[account]
pub struct BattleRoom {
    pub room_id: String,                  // Unique identifier for the room
    pub admin: Pubkey,                    // Admin/creator of the battle room
    pub max_participants: u8,             // Maximum number of tokens allowed (3-5)
    pub status: BattleRoomStatus,         // Current status of the battle
    pub created_at: i64,                  // When the room was created
    pub waiting_time_end: i64,            // When the 1-minute waiting period ends
    pub battle_end_time: i64,             // When the 24-hour battle ends
    pub platform_fee_percentage: u8,      // Percentage of fees going to platform (10%)
    pub participant_count: u8,            // Number of tokens currently in the battle
    pub total_fees_collected: u64,        // Total fees collected across all tokens
    pub winner_token: Option<Pubkey>,     // Address of the winning token
}

impl BattleRoom {
    pub const LEN: usize = 32 + // room_id (String)
                          32 + // admin (Pubkey)
                          1 +  // max_participants (u8)
                          1 +  // status (enum)
                          8 +  // created_at (i64)
                          8 +  // waiting_time_end (i64)
                          8 +  // battle_end_time (i64)
                          1 +  // platform_fee_percentage (u8)
                          1 +  // participant_count (u8)
                          8 +  // total_fees_collected (u64)
                          33;  // winner_token (Option<Pubkey>)
}

#[account]
pub struct BattleToken {
    pub token_symbol: String,         // Symbol of the token
    pub token_name: String,           // Name of the token
    pub creator: Pubkey,              // Creator's wallet address
    pub battle_room: Pubkey,          // Battle room this token belongs to
    pub initial_supply: u64,          // Initial token supply
    pub current_market_cap: u64,      // Current market cap
    pub total_fees: u64,              // Total fees collected from trading this token
    pub created_at: i64,              // When the token was created
    pub is_winner: bool,              // Whether this token won the battle
}

impl BattleToken {
    pub const LEN: usize = 16 +  // token_symbol (String)
                          32 +  // token_name (String)
                          32 +  // creator (Pubkey)
                          32 +  // battle_room (Pubkey) 
                          8 +   // initial_supply (u64)
                          8 +   // current_market_cap (u64)
                          8 +   // total_fees (u64)
                          8 +   // created_at (i64) 
                          1;    // is_winner (bool)
}

#[account]
pub struct TradeRecord {
    pub battle_token: Pubkey,     // Token that was traded
    pub trader: Pubkey,           // Wallet address of the trader
    pub amount: u64,              // Amount traded
    pub fee: u64,                 // Fee collected
    pub trade_type: TradeType,    // Buy or sell
    pub timestamp: i64,           // When the trade happened
}

impl TradeRecord {
    pub const LEN: usize = 32 +  // battle_token (Pubkey)
                          32 +  // trader (Pubkey)
                          8 +   // amount (u64)
                          8 +   // fee (u64) 
                          1 +   // trade_type (enum)
                          8;    // timestamp (i64)
}

#[account]
pub struct RewardClaim {
    pub battle_room: Pubkey,      // Battle room
    pub battle_token: Pubkey,     // Token (must be the winner)
    pub trader: Pubkey,           // Trader claiming rewards
    pub amount: u64,              // Reward amount
    pub claimed_at: i64,          // When the reward was claimed
}

impl RewardClaim {
    pub const LEN: usize = 32 +  // battle_room (Pubkey)
                          32 +  // battle_token (Pubkey)
                          32 +  // trader (Pubkey)
                          8 +   // amount (u64)
                          8;    // claimed_at (i64)
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum BattleRoomStatus {
    Open,       // Room is open for tokens to join
    Full,       // Room is full but battle hasn't started
    Active,     // Battle is ongoing
    Closed      // Battle has ended
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum TradeType {
    Buy,
    Sell
}

#[event]
pub struct BattleRoomCreated {
    pub room_id: String,
    pub admin: Pubkey,
    pub max_participants: u8,
    pub created_at: i64,
    pub battle_start: i64,
    pub battle_end: i64,
}

#[event]
pub struct TokenJoinedBattle {
    pub room_id: String,
    pub token_symbol: String,
    pub creator: Pubkey,
    pub created_at: i64,
}

#[event]
pub struct BattleStarted {
    pub room_id: String,
    pub start_time: i64,
    pub end_time: i64,
    pub participant_count: u8,
}

#[event]
pub struct TradeRecorded {
    pub battle_token: Pubkey,
    pub trader: Pubkey,
    pub amount: u64,
    pub fee: u64,
    pub trade_type: TradeType,
    pub market_cap: u64,
    pub timestamp: i64,
}

#[event]
pub struct BattleClosed {
    pub room_id: String,
    pub total_fees: u64,
    pub platform_fee: u64,
    pub closed_at: i64,
}

#[event]
pub struct WinnerSet {
    pub room_id: String,
    pub winner_token: Pubkey,
    pub token_symbol: String,
}

#[event]
pub struct RewardClaimed {
    pub room_id: String,
    pub token_symbol: String,
    pub trader: Pubkey,
    pub amount: u64,
    pub claimed_at: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid maximum participants (must be between 2 and 5)")]
    InvalidMaxParticipants,
    #[msg("Invalid battle duration (must be between 1 hour and 24 hours)")]
    InvalidBattleDuration,
    #[msg("Room is not open for registration")]
    RoomNotOpen,
    #[msg("Room is already full")]
    RoomFull,
    #[msg("Waiting time has already passed")]
    WaitingTimePassed,
    #[msg("Waiting time has not passed yet")]
    WaitingTimeNotPassed,
    #[msg("Not enough participants (minimum 2 required)")]
    NotEnoughParticipants,
    #[msg("Invalid room status for this operation")]
    InvalidRoomStatus,
    #[msg("Battle is not active")]
    BattleNotActive,
    #[msg("Battle has already ended")]
    BattleEnded,
    #[msg("Battle has not ended yet")]
    BattleNotEnded,
    #[msg("Arithmetic overflow")]
    ArithmeticOverflow,
    #[msg("Unauthorized operation")]
    Unauthorized,
    #[msg("Battle is not closed")]
    BattleNotClosed,
    #[msg("Token is not the winner")]
    TokenNotWinner,
}
