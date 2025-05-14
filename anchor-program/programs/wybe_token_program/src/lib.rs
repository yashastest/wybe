
use anchor_lang::prelude::*;

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

        // Validate fees
        if creator_fee + platform_fee > 1000 {
            // Maximum 10% total fees (1000 basis points)
            return err!(ErrorCode::InvalidFees);
        }

        // Initialize the token account
        token_account.name = name;
        token_account.symbol = symbol;
        token_account.creator_fee = creator_fee;
        token_account.platform_fee = platform_fee;
        token_account.authority = authority.key();

        // Emit event for indexing
        emit!(TokenInitialized {
            token_account: token_account.key(),
            name: token_account.name.clone(),
            symbol: token_account.symbol.clone(),
            creator_fee,
            platform_fee,
            authority: authority.key(),
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

        // Validate authority
        if token_account.authority != authority.key() {
            return err!(ErrorCode::Unauthorized);
        }

        // Validate fees
        if creator_fee + platform_fee > 1000 {
            // Maximum 10% total fees (1000 basis points)
            return err!(ErrorCode::InvalidFees);
        }

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
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateFees<'info> {
    #[account(mut)]
    pub token_account: Account<'info, TokenAccount>,
    pub authority: Signer<'info>,
}

#[account]
pub struct TokenAccount {
    pub name: String,        // 32 bytes max
    pub symbol: String,      // 8 bytes max
    pub creator_fee: u64,    // Fee in basis points (1/100 of 1%)
    pub platform_fee: u64,   // Fee in basis points (1/100 of 1%)
    pub authority: Pubkey,   // 32 bytes
}

impl TokenAccount {
    pub const LEN: usize = 32 + 8 + 8 + 8 + 32; // Name + Symbol + creator_fee + platform_fee + authority
}

#[event]
pub struct TokenInitialized {
    pub token_account: Pubkey,
    pub name: String,
    pub symbol: String,
    pub creator_fee: u64,
    pub platform_fee: u64,
    pub authority: Pubkey,
}

#[event]
pub struct FeesUpdated {
    pub token_account: Pubkey,
    pub creator_fee: u64,
    pub platform_fee: u64,
    pub authority: Pubkey,
}

#[error_code]
pub enum ErrorCode {
    #[msg("You are not authorized to perform this action")]
    Unauthorized,
    #[msg("Invalid fee configuration - total fees cannot exceed 10%")]
    InvalidFees,
}
