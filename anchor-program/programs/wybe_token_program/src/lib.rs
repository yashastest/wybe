use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};
use std::convert::TryFrom;

declare_id!("Wyb111111111111111111111111111111111111111");

#[program]
pub mod wybe_token_program {
    use super::*;

    /// Initialize a new token with metadata
    /// This is the entry point for creating a new token
    pub fn initialize(
        ctx: Context<Initialize>,
        name: String,
        symbol: String,
        uri: String,
        decimals: u8,
    ) -> Result<()> {
        // Validate input parameters
        require!(!name.is_empty(), WybeTokenError::InvalidName);
        require!(!symbol.is_empty(), WybeTokenError::InvalidSymbol);
        require!(symbol.len() <= 10, WybeTokenError::SymbolTooLong);
        require!(decimals <= 9, WybeTokenError::DecimalsTooLarge);
        
        let token_metadata = &mut ctx.accounts.token_metadata;
        token_metadata.name = name.clone();
        token_metadata.symbol = symbol.clone();
        token_metadata.uri = uri;
        token_metadata.decimals = decimals;
        token_metadata.mint = ctx.accounts.mint.key();
        token_metadata.authority = ctx.accounts.authority.key();
        token_metadata.creator_fee_percentage = 250; // 2.5% as basis points
        token_metadata.platform_fee_percentage = 250; // 2.5% as basis points
        token_metadata.is_frozen = false;
        token_metadata.version = 1;
        token_metadata.created_at = Clock::get()?.unix_timestamp;
        
        // Emit event
        emit!(TokenInitializedEvent {
            mint: token_metadata.mint,
            authority: token_metadata.authority,
            name,
            symbol,
            decimals,
            creator_fee_percentage: token_metadata.creator_fee_percentage,
            platform_fee_percentage: token_metadata.platform_fee_percentage,
            timestamp: token_metadata.created_at
        });

        msg!("Token {} ({}) initialized with decimals {}", name, symbol, decimals);
        Ok(())
    }

    /// Create a bonding curve for a token
    /// Bonding curves determine the price dynamics of the token
    pub fn create_bonding_curve(
        ctx: Context<CreateBondingCurve>,
        curve_type: u8,
        base_price: u64,
    ) -> Result<()> {
        // Validate inputs
        require!(curve_type <= 3, WybeTokenError::InvalidCurveType);
        require!(base_price > 0, WybeTokenError::InvalidBasePrice);
        
        // Verify the token metadata exists and authority matches
        require!(
            ctx.accounts.token_metadata.authority == ctx.accounts.authority.key(),
            WybeTokenError::Unauthorized
        );
        
        require!(
            ctx.accounts.token_metadata.mint == ctx.accounts.mint.key(),
            WybeTokenError::MintMismatch
        );
        
        // Check token isn't frozen
        require!(
            !ctx.accounts.token_metadata.is_frozen,
            WybeTokenError::TokenFrozen
        );
        
        let bonding_curve = &mut ctx.accounts.bonding_curve;
        bonding_curve.mint = ctx.accounts.mint.key();
        bonding_curve.authority = ctx.accounts.authority.key();
        bonding_curve.curve_type = curve_type;
        bonding_curve.base_price = base_price;
        bonding_curve.created_at = Clock::get()?.unix_timestamp;
        bonding_curve.last_updated_at = bonding_curve.created_at;
        
        // Emit event
        emit!(BondingCurveCreatedEvent {
            mint: bonding_curve.mint,
            authority: bonding_curve.authority,
            curve_type,
            base_price,
            timestamp: bonding_curve.created_at
        });
        
        msg!("Bonding curve created for token {}", ctx.accounts.token_metadata.symbol);
        Ok(())
    }

    /// Update the fee structure for a token
    /// Only the original authority can update fees
    pub fn update_fees(
        ctx: Context<UpdateFees>,
        creator_fee_percentage: u16,
        platform_fee_percentage: u16,
    ) -> Result<()> {
        let token_metadata = &mut ctx.accounts.token_metadata;
        
        // Verify authority
        require!(
            token_metadata.authority == ctx.accounts.authority.key(),
            WybeTokenError::Unauthorized
        );
        
        // Check token isn't frozen
        require!(
            !token_metadata.is_frozen,
            WybeTokenError::TokenFrozen
        );
        
        // Validate fee percentages
        require!(
            creator_fee_percentage <= 1000 && platform_fee_percentage <= 1000,
            WybeTokenError::FeeTooHigh
        );
        
        // Ensure combined fees don't exceed 20%
        require!(
            creator_fee_percentage + platform_fee_percentage <= 2000,
            WybeTokenError::CombinedFeeTooHigh
        );
        
        let previous_creator_fee = token_metadata.creator_fee_percentage;
        let previous_platform_fee = token_metadata.platform_fee_percentage;
        
        token_metadata.creator_fee_percentage = creator_fee_percentage;
        token_metadata.platform_fee_percentage = platform_fee_percentage;
        token_metadata.last_updated_at = Clock::get()?.unix_timestamp;
        
        // Emit event
        emit!(FeesUpdatedEvent {
            mint: token_metadata.mint,
            authority: token_metadata.authority,
            previous_creator_fee,
            previous_platform_fee,
            new_creator_fee: creator_fee_percentage,
            new_platform_fee: platform_fee_percentage,
            timestamp: token_metadata.last_updated_at
        });
        
        msg!("Updated fees: creator={}bp, platform={}bp", creator_fee_percentage, platform_fee_percentage);
        Ok(())
    }

    /// Update the treasury wallet address
    /// Only the original authority can update the treasury
    pub fn update_treasury(
        ctx: Context<UpdateTreasury>,
        new_treasury: Pubkey,
    ) -> Result<()> {
        let treasury_config = &mut ctx.accounts.treasury_config;
        
        // If this is initialization, set up the treasury
        if treasury_config.treasury.equals(&Pubkey::default()) {
            treasury_config.mint = ctx.accounts.mint.key();
            treasury_config.authority = ctx.accounts.authority.key();
            treasury_config.created_at = Clock::get()?.unix_timestamp;
        } else {
            // Otherwise verify authority
            require!(
                treasury_config.authority == ctx.accounts.authority.key(),
                WybeTokenError::Unauthorized
            );
        }
        
        // Ensure new_treasury is not the zero address
        require!(
            !new_treasury.equals(&Pubkey::default()),
            WybeTokenError::InvalidTreasuryAddress
        );
        
        let previous_treasury = treasury_config.treasury;
        treasury_config.treasury = new_treasury;
        treasury_config.last_updated_at = Clock::get()?.unix_timestamp;
        
        // Emit event
        emit!(TreasuryUpdatedEvent {
            mint: treasury_config.mint,
            authority: treasury_config.authority,
            previous_treasury,
            new_treasury,
            timestamp: treasury_config.last_updated_at
        });
        
        msg!("Treasury updated to: {}", new_treasury);
        Ok(())
    }

    /// Emergency freeze mechanism
    /// Allows the authority to freeze all operations on a token
    pub fn emergency_freeze(ctx: Context<EmergencyAction>) -> Result<()> {
        let token_metadata = &mut ctx.accounts.token_metadata;
        
        // Verify authority
        require!(
            token_metadata.authority == ctx.accounts.authority.key(),
            WybeTokenError::Unauthorized
        );
        
        // Ensure token isn't already frozen
        require!(
            !token_metadata.is_frozen,
            WybeTokenError::AlreadyFrozen
        );
        
        token_metadata.is_frozen = true;
        token_metadata.last_updated_at = Clock::get()?.unix_timestamp;
        
        // Emit event
        emit!(EmergencyFreezeEvent {
            mint: token_metadata.mint,
            authority: token_metadata.authority,
            timestamp: token_metadata.last_updated_at
        });
        
        msg!("EMERGENCY: Token {} has been frozen", token_metadata.symbol);
        Ok(())
    }
    
    /// Emergency unfreeze
    /// Allows the authority to unfreeze operations on a token
    pub fn emergency_unfreeze(ctx: Context<EmergencyAction>) -> Result<()> {
        let token_metadata = &mut ctx.accounts.token_metadata;
        
        // Verify authority
        require!(
            token_metadata.authority == ctx.accounts.authority.key(),
            WybeTokenError::Unauthorized
        );
        
        // Ensure token is currently frozen
        require!(
            token_metadata.is_frozen,
            WybeTokenError::NotFrozen
        );
        
        token_metadata.is_frozen = false;
        token_metadata.last_updated_at = Clock::get()?.unix_timestamp;
        
        // Emit event
        emit!(EmergencyUnfreezeEvent {
            mint: token_metadata.mint,
            authority: token_metadata.authority,
            timestamp: token_metadata.last_updated_at
        });
        
        msg!("Token {} has been unfrozen", token_metadata.symbol);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + TokenMetadata::SPACE
    )]
    pub token_metadata: Account<'info, TokenMetadata>,
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateBondingCurve<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + BondingCurve::SPACE
    )]
    pub bonding_curve: Account<'info, BondingCurve>,
    pub mint: Account<'info, Mint>,
    pub token_metadata: Account<'info, TokenMetadata>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateFees<'info> {
    #[account(
        mut,
        constraint = token_metadata.authority == authority.key() @ WybeTokenError::Unauthorized,
    )]
    pub token_metadata: Account<'info, TokenMetadata>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct UpdateTreasury<'info> {
    #[account(
        init_if_needed,
        payer = authority,
        space = 8 + TreasuryConfig::SPACE
    )]
    pub treasury_config: Account<'info, TreasuryConfig>,
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct EmergencyAction<'info> {
    #[account(
        mut,
        constraint = token_metadata.authority == authority.key() @ WybeTokenError::Unauthorized,
    )]
    pub token_metadata: Account<'info, TokenMetadata>,
    pub authority: Signer<'info>,
}

#[account]
pub struct TokenMetadata {
    pub mint: Pubkey,
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub decimals: u8,
    pub authority: Pubkey,
    pub creator_fee_percentage: u16, // Basis points (e.g., 250 = 2.5%)
    pub platform_fee_percentage: u16, // Basis points (e.g., 250 = 2.5%)
    pub is_frozen: bool,              // Emergency freeze flag
    pub version: u8,                  // For future upgrades
    pub created_at: i64,              // Unix timestamp
    pub last_updated_at: i64,         // Unix timestamp for last update
}

#[account]
pub struct BondingCurve {
    pub mint: Pubkey,
    pub authority: Pubkey,
    pub curve_type: u8,      // 0: Linear, 1: Exponential, 2: Logarithmic, 3: S-curve
    pub base_price: u64,     // Base price in lamports
    pub created_at: i64,     // Unix timestamp
    pub last_updated_at: i64, // Unix timestamp for last update
}

#[account]
pub struct TreasuryConfig {
    pub mint: Pubkey,
    pub authority: Pubkey,
    pub treasury: Pubkey,    // Treasury wallet address
    pub created_at: i64,     // Unix timestamp
    pub last_updated_at: i64, // Unix timestamp for last update
}

impl TokenMetadata {
    pub const SPACE: usize = 32 +  // mint
                            (4 + 32) +  // name string
                            (4 + 10) +  // symbol string (max 10 chars)
                            (4 + 128) + // uri string (max 128 chars)
                            1 +         // decimals
                            32 +        // authority
                            2 +         // creator_fee_percentage
                            2 +         // platform_fee_percentage
                            1 +         // is_frozen
                            1 +         // version
                            8 +         // created_at
                            8;          // last_updated_at
}

impl BondingCurve {
    pub const SPACE: usize = 32 +  // mint
                            32 +   // authority
                            1 +    // curve_type
                            8 +    // base_price
                            8 +    // created_at
                            8;     // last_updated_at
}

impl TreasuryConfig {
    pub const SPACE: usize = 32 +  // mint
                            32 +   // authority
                            32 +   // treasury
                            8 +    // created_at
                            8;     // last_updated_at
}

// Events for on-chain tracking
#[event]
pub struct TokenInitializedEvent {
    pub mint: Pubkey,
    pub authority: Pubkey,
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
    pub creator_fee_percentage: u16,
    pub platform_fee_percentage: u16,
    pub timestamp: i64,
}

#[event]
pub struct BondingCurveCreatedEvent {
    pub mint: Pubkey,
    pub authority: Pubkey,
    pub curve_type: u8,
    pub base_price: u64,
    pub timestamp: i64,
}

#[event]
pub struct FeesUpdatedEvent {
    pub mint: Pubkey,
    pub authority: Pubkey,
    pub previous_creator_fee: u16,
    pub previous_platform_fee: u16,
    pub new_creator_fee: u16,
    pub new_platform_fee: u16,
    pub timestamp: i64,
}

#[event]
pub struct TreasuryUpdatedEvent {
    pub mint: Pubkey,
    pub authority: Pubkey,
    pub previous_treasury: Pubkey,
    pub new_treasury: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct EmergencyFreezeEvent {
    pub mint: Pubkey,
    pub authority: Pubkey,
    pub timestamp: i64,
}

#[event]
pub struct EmergencyUnfreezeEvent {
    pub mint: Pubkey,
    pub authority: Pubkey,
    pub timestamp: i64,
}

#[error_code]
pub enum WybeTokenError {
    #[msg("Fee percentage cannot exceed 10%")]
    FeeTooHigh,
    
    #[msg("Combined fees cannot exceed 20%")]
    CombinedFeeTooHigh,
    
    #[msg("Not authorized to perform this action")]
    Unauthorized,
    
    #[msg("Invalid curve type")]
    InvalidCurveType,
    
    #[msg("Base price must be greater than zero")]
    InvalidBasePrice,
    
    #[msg("Token name cannot be empty")]
    InvalidName,
    
    #[msg("Token symbol cannot be empty")]
    InvalidSymbol,
    
    #[msg("Token symbol is too long (max 10 characters)")]
    SymbolTooLong,
    
    #[msg("Mint address does not match token metadata")]
    MintMismatch,
    
    #[msg("Decimals value is too large (max 9)")]
    DecimalsTooLarge,
    
    #[msg("Token is currently frozen")]
    TokenFrozen,
    
    #[msg("Token is already frozen")]
    AlreadyFrozen,
    
    #[msg("Token is not frozen")]
    NotFrozen,
    
    #[msg("Invalid treasury address")]
    InvalidTreasuryAddress,
}
