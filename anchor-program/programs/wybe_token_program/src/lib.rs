
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

        // Emit event for indexing
        emit!(TokenInitialized {
            token_account: token_account.key(),
            name: token_account.name.clone(),
            symbol: token_account.symbol.clone(),
            creator_fee,
            platform_fee,
            authority: authority.key(),
            treasury: treasury.key(),
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

    // New function: Mint tokens
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
        
        // Calculate treasury amount (1% of minted tokens)
        let treasury_amount = amount / 100;
        let holder_amount = amount - treasury_amount;
        
        // Update total supply
        token_account.total_supply = token_account.total_supply.checked_add(amount)
            .ok_or(ErrorCode::CalculationError)?;
            
        // Update holder balance
        holder.balance = holder.balance.checked_add(holder_amount)
            .ok_or(ErrorCode::CalculationError)?;
            
        // Send 1% to treasury (in a real implementation, this would transfer the tokens)
        // For now, we're just recording the event
        
        emit!(TokensMinted {
            token_account: token_account.key(),
            creator: creator.key(),
            holder: holder.key(),
            amount,
            treasury_amount,
            holder_amount,
            timestamp: Clock::get()?.unix_timestamp,
        });
        
        Ok(())
    }
    
    // New function: Execute token trade
    pub fn execute_trade(
        ctx: Context<ExecuteTrade>,
        amount: u64,
        price: u64,
    ) -> Result<()> {
        let token_account = &ctx.accounts.token_account;
        let seller = &ctx.accounts.seller;
        let buyer = &mut ctx.accounts.buyer;
        let treasury = &ctx.accounts.treasury;
        
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
            
        // Update balances
        // In a real implementation, this would involve SPL token transfers and SOL transfers
        // For this demo, we're just recording the intent
        
        emit!(TradeExecuted {
            token_account: token_account.key(),
            seller: seller.key(),
            buyer: buyer.key(),
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
    
    // New function: Update treasury wallet
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
        
        // Update treasury address
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
    
    // New function: Claim creator fees
    pub fn claim_creator_fees(
        ctx: Context<ClaimCreatorFees>,
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
        
        // In a real implementation, this would transfer the accumulated fees
        // For this demo, we're just recording the claim event
        
        emit!(CreatorFeesClaimed {
            token_account: token_account.key(),
            creator: creator.key(),
            timestamp: Clock::get()?.unix_timestamp,
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

#[account]
pub struct TokenAccount {
    pub name: String,        // 32 bytes max
    pub symbol: String,      // 8 bytes max
    pub creator_fee: u64,    // Fee in basis points (1/100 of 1%)
    pub platform_fee: u64,   // Fee in basis points (1/100 of 1%)
    pub authority: Pubkey,   // 32 bytes
    pub treasury: Pubkey,    // 32 bytes - treasury wallet address
    pub total_supply: u64,   // Total supply of tokens
    pub is_frozen: bool,     // Emergency freeze flag
}

impl TokenAccount {
    pub const LEN: usize = 32 + 8 + 8 + 8 + 32 + 32 + 8 + 1; // Name + Symbol + creator_fee + platform_fee + authority + treasury + total_supply + is_frozen
}

#[account]
pub struct TokenHolder {
    pub owner: Pubkey,       // 32 bytes
    pub balance: u64,        // 8 bytes
}

impl TokenHolder {
    pub const LEN: usize = 32 + 8; // owner + balance
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
    pub timestamp: i64,
}

#[event]
pub struct TradeExecuted {
    pub token_account: Pubkey,
    pub seller: Pubkey,
    pub buyer: Pubkey,
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
}
