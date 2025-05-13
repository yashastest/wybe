import React, { useState } from "react";
import { motion } from "framer-motion";
import { Code, Copy, Download, Check, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "sonner";

interface SmartContractStepsProps {
  className?: string;
}

const SmartContractSteps: React.FC<SmartContractStepsProps> = ({ className }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    toast.success("Code copied to clipboard");
    
    setTimeout(() => {
      setCopiedIndex(null);
    }, 2000);
  };
  
  const handleDownload = (filename: string, content: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success(`${filename} downloaded successfully`);
  };

  const staggerContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };
  
  const codeSnippets = [
    {
      title: "Basic Meme Token Contract",
      description: "A standard SPL token contract with metadata for a meme coin",
      code: `// SPDX-License-Identifier: MIT
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("your_program_id_here");

#[program]
pub mod meme_token {
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
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 4 + 32 + 4 + 32 + 4 + 32 + 1 + 8
    )]
    pub token_metadata: Account<'info, TokenMetadata>,
    pub mint: Account<'info, Mint>,
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct TokenMetadata {
    pub mint: Pubkey,
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub decimals: u8,
    pub authority: Pubkey,
}`
    },
    {
      title: "Advanced Meme Token with Bonding Curve",
      description: "A token contract that implements a bonding curve pricing mechanism",
      code: `// SPDX-License-Identifier: MIT
use anchor_lang::prelude::*;
use anchor_spl::token::{self, Mint, Token, TokenAccount};

declare_id!("your_program_id_here");

#[program]
pub mod bonding_curve_token {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>,
        name: String,
        symbol: String,
        uri: String,
        decimals: u8,
        base_price: u64,
        curve_type: u8,
    ) -> Result<()> {
        let token_data = &mut ctx.accounts.token_data;
        token_data.name = name;
        token_data.symbol = symbol;
        token_data.uri = uri;
        token_data.decimals = decimals;
        token_data.mint = ctx.accounts.mint.key();
        token_data.authority = ctx.accounts.authority.key();
        token_data.treasury = ctx.accounts.treasury.key();
        token_data.base_price = base_price;
        token_data.curve_type = curve_type;
        token_data.total_supply = 0;
        
        Ok(())
    }
    
    pub fn buy_tokens(ctx: Context<TradeTokens>, amount_in: u64) -> Result<()> {
        let token_data = &mut ctx.accounts.token_data;
        
        // Calculate token price based on bonding curve
        let amount_out = match token_data.curve_type {
            // Linear curve
            0 => {
                let price_per_token = token_data.base_price + (token_data.total_supply / 1_000_000);
                amount_in / price_per_token
            },
            // Exponential curve
            1 => {
                let current_supply = token_data.total_supply as f64 / 1_000_000_000f64;
                let price = token_data.base_price as f64 * (1.1f64.powf(current_supply));
                (amount_in as f64 / price) as u64
            },
            // Default to base price
            _ => amount_in / token_data.base_price,
        };
        
        // Transfer SOL to treasury
        // Transfer tokens to buyer
        // Update total supply
        token_data.total_supply += amount_out;
        
        Ok(())
    }
    
    // Additional trading functions here
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 4 + 32 + 4 + 32 + 4 + 32 + 1 + 32 + 8 + 1 + 8
    )]
    pub token_data: Account<'info, TokenData>,
    pub mint: Account<'info, Mint>,
    pub treasury: Account<'info, TokenAccount>,
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct TradeTokens<'info> {
    #[account(mut)]
    pub token_data: Account<'info, TokenData>,
    #[account(mut)]
    pub treasury: Account<'info, TokenAccount>,
    // Other required accounts for trading
}

#[account]
pub struct TokenData {
    pub mint: Pubkey,
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub decimals: u8,
    pub authority: Pubkey,
    pub treasury: Pubkey,
    pub base_price: u64,
    pub curve_type: u8,
    pub total_supply: u64,
}`
    },
    {
      title: "Meme Token Launch Script",
      description: "Script to deploy your meme token to Solana",
      code: `const { Connection, Keypair, PublicKey, Transaction } = require('@solana/web3.js');
const { Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const fs = require('fs');

async function deployMemeToken() {
  // Connect to cluster
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  
  // Load creator's keypair
  const creatorKey = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync('/path/to/keypair.json')))
  );
  
  console.log('Using account:', creatorKey.publicKey.toString());
  
  // Token config - update these values
  const tokenConfig = {
    name: 'MY MEME COIN',
    symbol: 'MEME',
    decimals: 9,
    initialSupply: 1_000_000_000, // 1 billion tokens
    logoUri: 'https://example.com/logo.png'
  };

  try {
    // Create mint account
    console.log('Creating token mint...');
    const mintAccount = await Token.createMint(
      connection,
      creatorKey,
      creatorKey.publicKey,
      null, // freeze authority
      tokenConfig.decimals,
      TOKEN_PROGRAM_ID
    );
    console.log('Mint created:', mintAccount.publicKey.toString());
    
    // Create an associated token account for the creator
    console.log('Creating token account for creator...');
    const creatorTokenAccount = await mintAccount.getOrCreateAssociatedAccountInfo(
      creatorKey.publicKey
    );
    console.log('Creator token account:', creatorTokenAccount.address.toString());
    
    // Mint the initial supply to the creator's account
    console.log('Minting initial supply...');
    await mintAccount.mintTo(
      creatorTokenAccount.address,
      creatorKey.publicKey,
      [],
      tokenConfig.initialSupply * Math.pow(10, tokenConfig.decimals)
    );
    console.log('Token minted successfully!');
    
    // Write token info to file
    const tokenInfo = {
      mint: mintAccount.publicKey.toString(),
      name: tokenConfig.name,
      symbol: tokenConfig.symbol,
      decimals: tokenConfig.decimals,
      initialSupply: tokenConfig.initialSupply,
      creatorTokenAccount: creatorTokenAccount.address.toString()
    };
    
    fs.writeFileSync('token_info.json', JSON.stringify(tokenInfo, null, 2));
    console.log('Token info saved to token_info.json');
    
    return tokenInfo;
  } catch (err) {
    console.error('Deployment failed:', err);
    throw err;
  }
}

deployMemeToken().then(() => {
  console.log('Deployment complete!');
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});`
    },
    {
      title: "Liquidity Pool Creation",
      description: "Script to create a liquidity pool for your token on a DEX",
      code: `const { Connection, Keypair, PublicKey } = require('@solana/web3.js');
const { Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');
const { Market } = require('@project-serum/serum');
const fs = require('fs');

// Load token info from previous deployment
const tokenInfo = JSON.parse(fs.readFileSync('token_info.json'));
const mintPubkey = new PublicKey(tokenInfo.mint);

async function createLiquidityPool() {
  // Connect to cluster
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  
  // Load creator's keypair
  const creatorKey = Keypair.fromSecretKey(
    Uint8Array.from(JSON.parse(fs.readFileSync('/path/to/keypair.json')))
  );
  
  console.log('Using account:', creatorKey.publicKey.toString());
  
  // USDC mint address on mainnet
  const usdcMint = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
  
  // Pool configuration
  const poolConfig = {
    initialTokenAmount: 500_000_000, // 50% of supply
    initialUsdcAmount: 25_000, // $25,000 in USDC
    feeBps: 30, // 0.3% fee
  };

  try {
    // Initialize the token mint from the saved info
    console.log('Initializing token mint...');
    const tokenMint = new Token(
      connection,
      mintPubkey,
      TOKEN_PROGRAM_ID,
      creatorKey
    );

    // Initialize USDC mint
    console.log('Initializing USDC mint...');
    const usdcToken = new Token(
      connection,
      usdcMint,
      TOKEN_PROGRAM_ID,
      creatorKey
    );

    // Get creator's token accounts
    const creatorTokenAccount = new PublicKey(tokenInfo.creatorTokenAccount);
    const creatorUsdcAccount = await usdcToken.getOrCreateAssociatedAccountInfo(
      creatorKey.publicKey
    );

    console.log('Creator USDC account:', creatorUsdcAccount.address.toString());
    
    // NOTE: The actual implementation for creating a liquidity pool depends on the DEX you're using
    // This is a pseudo-implementation - you would replace this with the actual code for Raydium, Orca, etc.
    
    console.log('Creating liquidity pool on DEX...');
    // DEX-specific code would go here
    
    console.log('Providing initial liquidity...');
    // DEX-specific code would go here

    console.log('Liquidity pool created successfully!');
    
    const poolInfo = {
      tokenMint: mintPubkey.toString(),
      usdcMint: usdcMint.toString(),
      initialTokenLiquidity: poolConfig.initialTokenAmount,
      initialUsdcLiquidity: poolConfig.initialUsdcAmount,
      // Additional DEX-specific pool information would go here
    };
    
    fs.writeFileSync('pool_info.json', JSON.stringify(poolInfo, null, 2));
    console.log('Pool info saved to pool_info.json');
    
    return poolInfo;
  } catch (err) {
    console.error('Liquidity pool creation failed:', err);
    throw err;
  }
}

createLiquidityPool().then(() => {
  console.log('Liquidity pool setup complete!');
}).catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});`
    }
  ];
  
  return (
    <motion.div 
      className={`p-6 ${className}`}
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="mb-6">
        <motion.h2 
          className="text-2xl font-bold text-gradient mb-2"
          variants={itemVariants}
        >
          Smart Contract Implementation Guide
        </motion.h2>
        <motion.p 
          className="text-gray-300"
          variants={itemVariants}
        >
          These code templates will help you understand how our meme coin contracts are structured.
        </motion.p>
      </div>
      
      <motion.div 
        className="glass-card p-4 mb-6"
        variants={itemVariants}
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-wybe-primary/20">
            <Code className="text-wybe-primary" size={20} />
          </div>
          <div>
            <h3 className="font-bold">Smart Contract Templates</h3>
            <p className="text-sm text-gray-300">Download or copy directly to use in your development</p>
          </div>
        </div>
        <p className="text-sm text-white/70 mb-4">
          These code examples demonstrate how Wybe's meme coins are implemented on the Solana blockchain.
          You can use these templates as a starting point for creating your own customized token.
        </p>
        <div className="bg-wybe-primary/10 border border-wybe-primary/30 rounded-md p-3 mb-2">
          <p className="text-sm text-white/90 flex items-center gap-2">
            <Check size={16} className="text-wybe-primary" />
            All templates are licensed for use with Wybe platform projects
          </p>
        </div>
      </motion.div>
      
      <Accordion type="single" collapsible className="space-y-4">
        {codeSnippets.map((snippet, index) => (
          <motion.div key={index} variants={itemVariants}>
            <AccordionItem value={`item-${index}`} className="border border-wybe-primary/20 rounded-lg overflow-hidden">
              <AccordionTrigger className="px-4 py-3 hover:bg-wybe-primary/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="bg-wybe-primary/20 w-8 h-8 rounded-full flex items-center justify-center">
                    <Code size={16} className="text-wybe-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-white">{snippet.title}</h3>
                    <p className="text-xs text-gray-400">{snippet.description}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-0">
                <div className="bg-black/50 p-4 border-t border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs text-gray-400">Source code:</p>
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 hover:bg-wybe-primary/20 text-gray-400 hover:text-white"
                        onClick={() => handleCopyCode(snippet.code, index)}
                      >
                        {copiedIndex === index ? (
                          <Check size={16} className="mr-1 text-green-400" />
                        ) : (
                          <Copy size={16} className="mr-1" />
                        )}
                        {copiedIndex === index ? "Copied" : "Copy"}
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 hover:bg-wybe-primary/20 text-gray-400 hover:text-white"
                        onClick={() => handleDownload(`${snippet.title.toLowerCase().replace(/\s+/g, '_')}.js`, snippet.code)}
                      >
                        <Download size={16} className="mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <pre className="overflow-x-auto text-xs bg-black/30 p-4 rounded-md">
                    <code className="text-white font-mono whitespace-pre">
                      {snippet.code}
                    </code>
                  </pre>
                </div>
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
      
      <motion.div 
        className="mt-6 text-center"
        variants={itemVariants}
      >
        <Button className="btn-primary animate-pulse-slow" asChild>
          <a href="https://solana.com/developers" target="_blank" rel="noopener noreferrer" className="flex items-center">
            Solana Developer Documentation
            <ExternalLink size={16} className="ml-2" />
          </a>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default SmartContractSteps;
