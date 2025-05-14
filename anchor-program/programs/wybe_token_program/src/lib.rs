
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("Wyb111111111111111111111111111111111111111");

#[program]
pub mod wybe_token_program {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        name: String,
        symbol: String,
        uri: String,
        decimals: u8,
    ) -> Result<()> {
        let token_metadata = &mut ctx.accounts.token_metadata;
        token_metadata.name = name;
        token_metadata.symbol = symbol;
        token_metadata.uri = uri;
        token_metadata.decimals = decimals;
        token_metadata.mint = ctx.accounts.mint.key();
        token_metadata.authority = ctx.accounts.authority.key();
        token_metadata.creator_fee_percentage = 250; // 2.5% as basis points
        token_metadata.platform_fee_percentage = 250; // 2.5% as basis points

        msg!("Token {} ({}) initialized with decimals {}", name, symbol, decimals);
        Ok(())
    }

    pub fn create_bonding_curve(
        ctx: Context<CreateBondingCurve>,
        curve_type: u8,
        base_price: u64,
    ) -> Result<()> {
        let bonding_curve = &mut ctx.accounts.bonding_curve;
        bonding_curve.mint = ctx.accounts.mint.key();
        bonding_curve.authority = ctx.accounts.authority.key();
        bonding_curve.curve_type = curve_type;
        bonding_curve.base_price = base_price;
        
        msg!("Bonding curve created for token {}", ctx.accounts.token_metadata.symbol);
        Ok(())
    }

    pub fn update_fees(
        ctx: Context<UpdateFees>,
        creator_fee_percentage: u16,
        platform_fee_percentage: u16,
    ) -> Result<()> {
        let token_metadata = &mut ctx.accounts.token_metadata;
        
        require!(
            creator_fee_percentage <= 1000 && platform_fee_percentage <= 1000,
            WybeTokenError::FeeTooHigh
        );
        
        token_metadata.creator_fee_percentage = creator_fee_percentage;
        token_metadata.platform_fee_percentage = platform_fee_percentage;
        
        msg!("Updated fees: creator={}bp, platform={}bp", creator_fee_percentage, platform_fee_percentage);
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
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateFees<'info> {
    #[account(
        mut,
        constraint = token_metadata.authority == authority.key(),
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
}

#[account]
pub struct BondingCurve {
    pub mint: Pubkey,
    pub authority: Pubkey,
    pub curve_type: u8,
    pub base_price: u64,
}

impl TokenMetadata {
    pub const SPACE: usize = 32 + // mint
                            (4 + 32) + // name string
                            (4 + 8) + // symbol string
                            (4 + 64) + // uri string
                            1 + // decimals
                            32 + // authority
                            2 + // creator_fee_percentage
                            2; // platform_fee_percentage
}

impl BondingCurve {
    pub const SPACE: usize = 32 + // mint
                            32 + // authority
                            1 + // curve_type
                            8; // base_price
}

#[error_code]
pub enum WybeTokenError {
    #[msg("Fee percentage cannot exceed 10%")]
    FeeTooHigh,
}
