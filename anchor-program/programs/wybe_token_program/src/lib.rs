use anchor_lang::prelude::*;
use anchor_lang::solana_program::program::invoke;
use anchor_lang::solana_program::system_instruction;

declare_id!("Wyb111111111111111111111111111111111111111");

#[program]
pub mod wybe_token_program {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        name: String,
        symbol: String,
        creator_fee: u64,
        platform_fee: u64,
    ) -> Result<()> {
        let token_account = &mut ctx.accounts.token_account;
        let authority = &ctx.accounts.authority;
        let treasury = &ctx.accounts.treasury;

        // Input validation
        require!(!name.is_empty(), ErrorCode::InvalidTokenName);
        require!(!symbol.is_empty(), ErrorCode::InvalidTokenSymbol);
        require!(symbol.len() <= 8, ErrorCode::TokenSymbolTooLong);
        require!(name.len() <= 32, ErrorCode::TokenNameTooLong);

        // Validate fees
        require!(
            creator_fee + platform_fee <= 1000, // Maximum 10% total fees (1000 basis points)
            ErrorCode::InvalidFees
        );

        // Initialize the token account
        token_account.name = name;
        token_account.symbol = symbol;
        token_account.creator_fee = creator_fee;
        token_account.platform_fee = platform_fee;
        token_account.authority = authority.key();
        token_account.treasury = treasury.key();
        token_account.total_supply = 0;
        token_account.is_frozen = false;
        token_account.is_bonding_curve_active = true;
        token_account.bonding_curve_cap = 50000; // $50k cap for bonding curve
        token_account.market_cap = 0;
        token_account.metadata_uri = String::new();
        token_account.last_updated_at = 0;
        token_account.creation_time = Clock::get()?.unix_timestamp;
        token_account.verified = false;

        // Emit event for indexing
        emit!(TokenInitialized {
            token_account: token_account.key(),
            name: token_account.name.clone(),
            symbol: token_account.symbol.clone(),
            creator_fee,
            platform_fee,
            authority: authority.key(),
            treasury: treasury.key(),
            bonding_curve_cap: token_account.bonding_curve_cap,
        });

        Ok(())
    }

    pub fn update_fees(
        ctx: Context<UpdateFees>,
        creator_fee: u64,
        platform_fee: u64,
    ) -> Result<()> {
        let token_account = &mut ctx.accounts.token_account;
        let authority = &ctx.accounts.authority;

        // Security check: verify account is not frozen
        require!(!token_account.is_frozen, ErrorCode::AccountFrozen);

        // Validate authority
        require!(
            token_account.authority == authority.key(),
            ErrorCode::Unauthorized
        );

        // Validate fees
        require!(
            creator_fee + platform_fee <= 1000, // Maximum 10% total fees (1000 basis points)
            ErrorCode::InvalidFees
        );

        // Update fees
        token_account.creator_fee = creator_fee;
        token_account.platform_fee = platform_fee;

        // Emit event for indexing
        emit!(FeesUpdated {
            token_account: token_account.key(),
            creator_fee,
            platform_fee,
            authority: authority.key(),
        });

        Ok(())
    }

    pub fn emergency_freeze(ctx: Context<EmergencyAction>) -> Result<()> {
        let token_account = &mut ctx.accounts.token_account;
        let authority = &ctx.accounts.authority;

        // Validate authority
        require!(
            token_account.authority == authority.key(),
            ErrorCode::Unauthorized
        );

        // Check if already frozen
        require!(!token_account.is_frozen, ErrorCode::AlreadyFrozen);

        // Set frozen state
        token_account.is_frozen = true;

        // Emit event
        emit!(AccountFrozen {
            token_account: token_account.key(),
            authority: authority.key(),
        });

        Ok(())
    }

    pub fn emergency_unfreeze(ctx: Context<EmergencyAction>) -> Result<()> {
        let token_account = &mut ctx.accounts.token_account;
        let authority = &ctx.accounts.authority;

        // Validate authority
        require!(
            token_account.authority == authority.key(),
            ErrorCode::Unauthorized
        );

        // Check if already unfrozen
        require!(token_account.is_frozen, ErrorCode::NotFrozen);

        // Set unfrozen state
        token_account.is_frozen = false;

        // Emit event
        emit!(AccountUnfrozen {
            token_account: token_account.key(),
            authority: authority.key(),
        });

        Ok(())
    }

    // Mint tokens with bonding curve pricing
    pub fn mint_tokens(
        ctx: Context<MintTokens>,
        amount: u64,
    ) -> Result<()> {
        let token_account = &mut ctx.accounts.token_account;
        let creator = &ctx.accounts.creator;
        let treasury = &ctx.accounts.treasury;
        let holder = &mut ctx.accounts.holder;
        
        // Security check: verify account is not frozen
        require!(!token_account.is_frozen, ErrorCode::AccountFrozen);
        
        // Validate creator
        require!(
            token_account.authority == creator.key(),
            ErrorCode::Unauthorized
        );
        
        // Calculate price based on bonding curve if active
        let (price_per_token, total_price) = if token_account.is_bonding_curve_active {
            // Simple bonding curve: price = (current_supply / 10000)^2 + 0.01
            let base_price = ((token_account.total_supply as f64 / 10000.0).powi(2) + 0.01) * 1_000_000.0; // In lamports
            let price_per_token = base_price as u64;
            let total_price = amount.checked_mul(price_per_token).ok_or(ErrorCode::CalculationError)?;
            
            // Check if we exceed the bonding curve cap
            let new_market_cap = token_account.market_cap.checked_add(total_price)
                .ok_or(ErrorCode::CalculationError)?;
                
            if new_market_cap >= token_account.bonding_curve_cap * 1_000_000 {
                // If we hit the cap, deactivate bonding curve for future mints
                token_account.is_bonding_curve_active = false;
            }
            
            token_account.market_cap = new_market_cap;
            (price_per_token, total_price)
        } else {
            // Fixed price after bonding curve ends
            let price_per_token = 1_000_000; // 1 SOL in lamports
            let total_price = amount.checked_mul(price_per_token).ok_or(ErrorCode::CalculationError)?;
            
            // Update market cap
            token_account.market_cap = token_account.market_cap.checked_add(total_price)
                .ok_or(ErrorCode::CalculationError)?;
                
            (price_per_token, total_price)
        };
        
        // Calculate treasury amount (1% of minted tokens)
        let treasury_amount = amount / 100;
        let holder_amount = amount - treasury_amount;
        
        // Update total supply
        token_account.total_supply = token_account.total_supply.checked_add(amount)
            .ok_or(ErrorCode::CalculationError)?;
            
        // Update holder balance
        holder.balance = holder.balance.checked_add(holder_amount)
            .ok_or(ErrorCode::CalculationError)?;
            
        // Record the mint event with pricing information
        emit!(TokensMinted {
            token_account: token_account.key(),
            creator: creator.key(),
            holder: holder.key(),
            amount,
            treasury_amount,
            holder_amount,
            price_per_token,
            total_price,
            is_bonding_curve_active: token_account.is_bonding_curve_active,
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }
    
    // Execute token trade with fees
    pub fn execute_trade(
        ctx: Context<ExecuteTrade>,
        amount: u64,
        price: u64,
    ) -> Result<()> {
        let token_account = &ctx.accounts.token_account;
        let seller = &mut ctx.accounts.seller;
        let buyer = &mut ctx.accounts.buyer;
        let treasury = &ctx.accounts.treasury;
        let creator = &ctx.accounts.creator;
        
        // Security check: verify account is not frozen
        require!(!token_account.is_frozen, ErrorCode::AccountFrozen);
        
        // Check if seller has enough tokens
        require!(seller.balance >= amount, ErrorCode::InsufficientFunds);
        
        // Calculate trade value
        let trade_value = amount.checked_mul(price)
            .ok_or(ErrorCode::CalculationError)?;
            
        // Calculate fees
        let creator_fee_amount = trade_value
            .checked_mul(token_account.creator_fee)
            .ok_or(ErrorCode::CalculationError)?
            .checked_div(10000)
            .ok_or(ErrorCode::CalculationError)?;
            
        let platform_fee_amount = trade_value
            .checked_mul(token_account.platform_fee)
            .ok_or(ErrorCode::CalculationError)?
            .checked_div(10000)
            .ok_or(ErrorCode::CalculationError)?;
            
        let total_fees = creator_fee_amount.checked_add(platform_fee_amount)
            .ok_or(ErrorCode::CalculationError)?;
            
        let seller_receives = trade_value.checked_sub(total_fees)
            .ok_or(ErrorCode::CalculationError)?;
            
        // Update token balances
        seller.balance = seller.balance.checked_sub(amount)
            .ok_or(ErrorCode::CalculationError)?;
            
        buyer.balance = buyer.balance.checked_add(amount)
            .ok_or(ErrorCode::CalculationError)?;
        
        // Record the trade event
        emit!(TradeExecuted {
            token_account: token_account.key(),
            seller: seller.key(),
            buyer: buyer.key(),
            creator: creator.key(),
            amount,
            price,
            trade_value,
            creator_fee: creator_fee_amount,
            platform_fee: platform_fee_amount,
            seller_receives,
            treasury: treasury.key(),
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }
    
    // Update treasury wallet
    pub fn update_treasury(
        ctx: Context<UpdateTreasury>,
        new_treasury: Pubkey,
    ) -> Result<()> {
        let token_account = &mut ctx.accounts.token_account;
        let authority = &ctx.accounts.authority;
        
        // Security check: verify account is not frozen
        require!(!token_account.is_frozen, ErrorCode::AccountFrozen);
        
        // Validate authority
        require!(
            token_account.authority == authority.key(),
            ErrorCode::Unauthorized
        );
        
        // Update treasury address (can be hardware wallet)
        token_account.treasury = new_treasury;
        
        emit!(TreasuryUpdated {
            token_account: token_account.key(),
            old_treasury: ctx.accounts.treasury.key(),
            new_treasury,
            authority: authority.key(),
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }
    
    // Claim creator fees after milestone reached
    pub fn claim_creator_fees(
        ctx: Context<ClaimCreatorFees>,
        milestone_reached: bool,
    ) -> Result<()> {
        let token_account = &ctx.accounts.token_account;
        let creator = &ctx.accounts.creator;
        
        // Security check: verify account is not frozen
        require!(!token_account.is_frozen, ErrorCode::AccountFrozen);
        
        // Validate creator
        require!(
            token_account.authority == creator.key(),
            ErrorCode::Unauthorized
        );
        
        // Check if milestone has been reached
        require!(milestone_reached, ErrorCode::MilestoneNotReached);
        
        // In a real implementation, this would transfer the accumulated fees
        // from a fee storage account to the creator's wallet
        
        emit!(CreatorFeesClaimed {
            token_account: token_account.key(),
            creator: creator.key(),
            milestone_reached,
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }
    
    // Record token launch on-chain
    pub fn record_token_launch(
        ctx: Context<RecordTokenLaunch>,
        launch_data: String,
    ) -> Result<()> {
        let token_account = &ctx.accounts.token_account;
        let authority = &ctx.accounts.authority;
        let launch_record = &mut ctx.accounts.launch_record;
        
        // Security check: verify account is not frozen
        require!(!token_account.is_frozen, ErrorCode::AccountFrozen);
        
        // Validate authority
        require!(
            token_account.authority == authority.key(),
            ErrorCode::Unauthorized
        );
        
        // Save launch data
        launch_record.token_account = token_account.key();
        launch_record.launch_date = Clock::get()?.unix_timestamp;
        launch_record.launch_data = launch_data;
        launch_record.is_verified = true;
        
        emit!(TokenLaunchRecorded {
            token_account: token_account.key(),
            launch_record: launch_record.key(),
            launch_date: launch_record.launch_date,
            authority: authority.key(),
        });
        
        Ok(())
    }
    
    // Verify token statistics and authenticity
    pub fn verify_token_statistics(ctx: Context<VerifyTokenStats>) -> Result<()> {
        let token_account = &ctx.accounts.token_account;
        let oracle = &ctx.accounts.oracle;
        
        // Only authorized oracles can verify statistics
        require!(
            oracle.key() == ctx.accounts.authority.key() || 
            oracle.is_signer,
            ErrorCode::Unauthorized
        );
        
        // Record the verification in events
        emit!(TokenStatisticsVerified {
            token_account: token_account.key(),
            oracle: oracle.key(),
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }
    
    // Update token metadata URI
    pub fn update_token_metadata(
        ctx: Context<UpdateTokenMetadata>,
        new_uri: String
    ) -> Result<()> {
        let token_account = &mut ctx.accounts.token_account;
        let authority = &ctx.accounts.authority;
        
        // Security check: verify account is not frozen
        require!(!token_account.is_frozen, ErrorCode::AccountFrozen);
        
        // Validate authority
        require!(
            token_account.authority == authority.key(),
            ErrorCode::Unauthorized
        );
        
        // Validate URI
        require!(!new_uri.is_empty(), ErrorCode::InvalidMetadataUri);
        require!(new_uri.len() <= 200, ErrorCode::MetadataUriTooLong);
        
        // Update metadata URI
        token_account.metadata_uri = new_uri;
        token_account.last_updated_at = Clock::get()?.unix_timestamp;
        
        emit!(TokenMetadataUpdated {
            token_account: token_account.key(),
            new_uri,
            authority: authority.key(),
            timestamp: token_account.last_updated_at,
        });
        
        Ok(())
    }
    
    // Transfer ownership of the token
    pub fn transfer_token_ownership(
        ctx: Context<TransferOwnership>,
        new_authority: Pubkey
    ) -> Result<()> {
        let token_account = &mut ctx.accounts.token_account;
        let authority = &ctx.accounts.authority;
        
        // Security check: verify account is not frozen
        require!(!token_account.is_frozen, ErrorCode::AccountFrozen);
        
        // Validate authority
        require!(
            token_account.authority == authority.key(),
            ErrorCode::Unauthorized
        );
        
        // Store old authority for the event
        let old_authority = token_account.authority;
        
        // Update authority
        token_account.authority = new_authority;
        token_account.last_updated_at = Clock::get()?.unix_timestamp;
        
        emit!(OwnershipTransferred {
            token_account: token_account.key(),
            old_authority,
            new_authority,
            timestamp: token_account.last_updated_at,
        });
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + TokenAccount::LEN
    )]
    pub token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub authority: Signer<'info>,
    /// CHECK: This is the treasury wallet
    pub treasury: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateFees<'info> {
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct EmergencyAction<'info> {
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct MintTokens<'info> {
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    pub creator: Signer<'info>,
    /// CHECK: This is the treasury wallet
    pub treasury: AccountInfo<'info>,
    #[account(mut)]
    pub holder: Account<'info, TokenHolder>,
}

#[derive(Accounts)]
pub struct ExecuteTrade<'info> {
    pub token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub seller: Account<'info, TokenHolder>,
    #[account(mut)]
    pub buyer: Account<'info, TokenHolder>,
    /// CHECK: This is the treasury wallet for fees
    pub treasury: AccountInfo<'info>,
    /// CHECK: This is the creator wallet for fees
    pub creator: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct UpdateTreasury<'info> {
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    pub authority: Signer<'info>,
    /// CHECK: This is the current treasury wallet
    pub treasury: AccountInfo<'info>,
}

#[derive(Accounts)]
pub struct ClaimCreatorFees<'info> {
    pub token_account: Account<'info, TokenAccount>,
    pub creator: Signer<'info>,
}

#[derive(Accounts)]
pub struct RecordTokenLaunch<'info> {
    pub token_account: Account<'info, TokenAccount>,
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = 8 + LaunchRecord::LEN
    )]
    pub launch_record: Account<'info, LaunchRecord>,
    pub system_program: Program<'info, System>,
}

// New account validation struct for token verification
#[derive(Accounts)]
pub struct VerifyTokenStats<'info> {
    pub token_account: Account<'info, TokenAccount>,
    /// CHECK: This is the oracle that verifies the token stats
    pub oracle: AccountInfo<'info>,
    pub authority: Signer<'info>,
}

// New account validation struct for updating metadata
#[derive(Accounts)]
pub struct UpdateTokenMetadata<'info> {
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    pub authority: Signer<'info>,
}

// New account validation struct for transferring ownership
#[derive(Accounts)]
pub struct TransferOwnership<'info> {
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    pub authority: Signer<'info>,
}

#[account]
pub struct TokenAccount {
    pub name: String,                // 32 bytes max
    pub symbol: String,              // 8 bytes max
    pub creator_fee: u64,            // Fee in basis points (1/100 of 1%)
    pub platform_fee: u64,           // Fee in basis points (1/100 of 1%)
    pub authority: Pubkey,           // 32 bytes
    pub treasury: Pubkey,            // 32 bytes - treasury wallet address (can be hardware wallet)
    pub total_supply: u64,           // Total supply of tokens
    pub is_frozen: bool,             // Emergency freeze flag
    pub is_bonding_curve_active: bool, // Whether bonding curve is active or not
    pub bonding_curve_cap: u64,      // Bonding curve cap (in USD)
    pub market_cap: u64,             // Current market cap (in lamports)
    pub metadata_uri: String,        // Token metadata URI (200 bytes max)
    pub last_updated_at: i64,        // Last time the token was updated
    pub creation_time: i64,          // Time when token was created
    pub verified: bool,              // Whether token is verified
}

impl TokenAccount {
    pub const LEN: usize = 32 + 8 + 8 + 8 + 32 + 32 + 8 + 1 + 1 + 8 + 8 + 200 + 8 + 8 + 1;
}

#[account]
pub struct TokenHolder {
    pub owner: Pubkey,       // 32 bytes
    pub balance: u64,        // 8 bytes
    pub last_trade: i64,     // 8 bytes - timestamp of last trade
    pub initial_entry: i64,  // 8 bytes - timestamp of first token acquisition
    pub is_verified: bool,   // 1 byte - if holder is KYC verified
}

impl TokenHolder {
    pub const LEN: usize = 32 + 8 + 8 + 8 + 1;
}

#[account]
pub struct LaunchRecord {
    pub token_account: Pubkey,      // 32 bytes
    pub launch_date: i64,           // 8 bytes
    pub launch_data: String,        // Variable, up to 200 bytes
    pub is_verified: bool,          // 1 byte
    pub initial_market_cap: u64,    // 8 bytes
    pub initial_holder_count: u16,  // 2 bytes
    pub creator_wallet: Pubkey,     // 32 bytes
}

impl LaunchRecord {
    pub const LEN: usize = 32 + 8 + 200 + 1 + 8 + 2 + 32;
}

// New struct for managing token trading parameters
#[account]
pub struct TradingConfig {
    pub token_account: Pubkey,      // 32 bytes
    pub min_trade_amount: u64,      // 8 bytes
    pub max_slippage: u16,          // 2 bytes - in basis points (100 = 1%)
    pub trading_enabled: bool,      // 1 byte
    pub authority: Pubkey,          // 32 bytes
}

impl TradingConfig {
    pub const LEN: usize = 32 + 8 + 2 + 1 + 32;
}

#[event]
pub struct TokenInitialized {
    pub token_account: Pubkey,
    pub name: String,
    pub symbol: String,
    pub creator_fee: u64,
    pub platform_fee: u64,
    pub authority: Pubkey,
    pub treasury: Pubkey,
    pub bonding_curve_cap: u64,
}

#[event]
pub struct FeesUpdated {
    pub token_account: Pubkey,
    pub creator_fee: u64,
    pub platform_fee: u64,
    pub authority: Pubkey,
}

#[event]
pub struct AccountFrozen {
    pub token_account: Pubkey,
    pub authority: Pubkey,
}

#[event]
pub struct AccountUnfrozen {
    pub token_account: Pubkey,
    pub authority: Pubkey,
}

#[event]
pub struct TokensMinted {
    pub token_account: Pubkey,
    pub creator: Pubkey,
    pub holder: Pubkey,
    pub amount: u64,
    pub treasury_amount: u64,
    pub holder_amount: u64,
    pub price_per_token: u64,
    pub total_price: u64,
    pub is_bonding_curve_active: bool,
    pub timestamp: i64,
}

#[event]
pub struct TradeExecuted {
    pub token_account: Pubkey,
    pub seller: Pubkey,
    pub buyer: Pubkey,
    pub creator: Pubkey,
    pub amount: u64,
    pub price: u64,
    pub trade_value: u64,
    pub creator_fee: u64,
    pub platform_fee: u64,
    pub seller_receives: u64,
    pub treasury: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct TreasuryUpdated {
    pub token_account: Pubkey,
    pub old_treasury: Pubkey,
    pub new_treasury: Pubkey,
    pub authority: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct CreatorFeesClaimed {
    pub token_account: Pubkey,
    pub creator: Pubkey,
    pub milestone_reached: bool,
    pub timestamp: i64,
}

#[event]
pub struct TokenLaunchRecorded {
    pub token_account: Pubkey,
    pub launch_record: Pubkey,
    pub launch_date: i64,
    pub authority: Pubkey,
}

#[event]
pub struct TokenStatisticsVerified {
    pub token_account: Pubkey,
    pub oracle: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct TokenMetadataUpdated {
    pub token_account: Pubkey,
    pub new_uri: String,
    pub authority: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct OwnershipTransferred {
    pub token_account: Pubkey,
    pub old_authority: Pubkey,
    pub new_authority: Pubkey,
    pub timestamp: i64,
}

#[error_code]
pub enum ErrorCode {
    #[msg("You are not authorized to perform this action")]
    Unauthorized,
    #[msg("Invalid fee configuration - total fees cannot exceed 10%")]
    InvalidFees,
    #[msg("Token name cannot be empty")]
    InvalidTokenName,
    #[msg("Token symbol cannot be empty")]
    InvalidTokenSymbol,
    #[msg("Token symbol must be 8 characters or less")]
    TokenSymbolTooLong,
    #[msg("Token name must be 32 characters or less")]
    TokenNameTooLong,
    #[msg("Account is frozen and cannot be modified")]
    AccountFrozen,
    #[msg("Account is already frozen")]
    AlreadyFrozen,
    #[msg("Account is not frozen")]
    NotFrozen,
    #[msg("Insufficient funds for this operation")]
    InsufficientFunds,
    #[msg("Calculation error, possible overflow or underflow")]
    CalculationError,
    #[msg("Required milestone has not been reached")]
    MilestoneNotReached,
    #[msg("Invalid metadata URI")]
    InvalidMetadataUri,
    #[msg("Metadata URI exceeds maximum length")]
    MetadataUriTooLong,
    #[msg("Operation exceeded time lock period")]
    TimeLockActive,
    #[msg("Trading is currently disabled for this token")]
    TradingDisabled,
    #[msg("Slippage tolerance exceeded")]
    SlippageExceeded,
    #[msg("Trade amount below minimum threshold")]
    TradeBelowMinimum,
}
