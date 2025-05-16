import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { WybeTokenProgram } from "../target/types/wybe_token_program";
import { assert, expect } from "chai";
import { PublicKey } from "@solana/web3.js";

describe("wybe-token-program", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.WybeTokenProgram as Program<WybeTokenProgram>;
  const wallet = provider.wallet;

  // Test variables
  let mintKeypair: anchor.web3.Keypair;
  let metadataKeypair: anchor.web3.Keypair;
  let bondingCurveKeypair: anchor.web3.Keypair;
  let treasuryKeypair: anchor.web3.Keypair;
  let tokenHolderKeypair: anchor.web3.Keypair;
  let launchRecordKeypair: anchor.web3.Keypair;
  let tradingConfigKeypair: anchor.web3.Keypair;

  beforeEach(async () => {
    // Create new keypairs for each test
    mintKeypair = anchor.web3.Keypair.generate();
    metadataKeypair = anchor.web3.Keypair.generate();
    bondingCurveKeypair = anchor.web3.Keypair.generate();
    treasuryKeypair = anchor.web3.Keypair.generate();
    tokenHolderKeypair = anchor.web3.Keypair.generate();
    launchRecordKeypair = anchor.web3.Keypair.generate();
    tradingConfigKeypair = anchor.web3.Keypair.generate();
  });

  it("Initializes a token with metadata", async () => {
    // Initialize token metadata
    await program.methods
      .initialize(
        "Test Token",
        "TEST",
        "https://example.com/token.json",
        9
      )
      .accounts({
        tokenMetadata: metadataKeypair.publicKey,
        mint: mintKeypair.publicKey,
        authority: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([metadataKeypair])
      .rpc();

    // Fetch the token metadata account and verify
    const metadata = await program.account.tokenMetadata.fetch(metadataKeypair.publicKey);
    assert.equal(metadata.name, "Test Token");
    assert.equal(metadata.symbol, "TEST");
    assert.equal(metadata.uri, "https://example.com/token.json");
    assert.equal(metadata.decimals, 9);
    assert.ok(metadata.mint.equals(mintKeypair.publicKey));
    assert.ok(metadata.authority.equals(wallet.publicKey));
    assert.equal(metadata.creatorFeePercentage, 250);
    assert.equal(metadata.platformFeePercentage, 250);
    assert.equal(metadata.isFrozen, false);
    assert.equal(metadata.version, 1);
    assert.notEqual(metadata.createdAt, 0);
  });

  it("Creates a bonding curve", async () => {
    // First initialize token metadata
    await program.methods
      .initialize(
        "Curve Token",
        "CURVE",
        "https://example.com/curve-token.json",
        9
      )
      .accounts({
        tokenMetadata: metadataKeypair.publicKey,
        mint: mintKeypair.publicKey,
        authority: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([metadataKeypair])
      .rpc();

    // Then create bonding curve
    await program.methods
      .createBondingCurve(
        1, // Exponential curve
        1000000 // 0.001 SOL in lamports
      )
      .accounts({
        bondingCurve: bondingCurveKeypair.publicKey,
        mint: mintKeypair.publicKey,
        tokenMetadata: metadataKeypair.publicKey,
        authority: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([bondingCurveKeypair])
      .rpc();

    // Verify bonding curve data
    const curve = await program.account.bondingCurve.fetch(bondingCurveKeypair.publicKey);
    assert.ok(curve.mint.equals(mintKeypair.publicKey));
    assert.ok(curve.authority.equals(wallet.publicKey));
    assert.equal(curve.curveType, 1);
    assert.equal(curve.basePrice.toNumber(), 1000000);
    assert.notEqual(curve.createdAt, 0);
  });

  it("Updates fees", async () => {
    // First initialize token metadata
    await program.methods
      .initialize(
        "Fee Token",
        "FEE",
        "https://example.com/fee-token.json",
        9
      )
      .accounts({
        tokenMetadata: metadataKeypair.publicKey,
        mint: mintKeypair.publicKey,
        authority: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([metadataKeypair])
      .rpc();

    // Update fees
    const newCreatorFee = 300; // 3%
    const newPlatformFee = 200; // 2%

    await program.methods
      .updateFees(
        newCreatorFee,
        newPlatformFee
      )
      .accounts({
        tokenMetadata: metadataKeypair.publicKey,
        authority: wallet.publicKey,
      })
      .rpc();

    // Verify updated fees
    const metadata = await program.account.tokenMetadata.fetch(metadataKeypair.publicKey);
    assert.equal(metadata.creatorFeePercentage, newCreatorFee);
    assert.equal(metadata.platformFeePercentage, newPlatformFee);
    assert.notEqual(metadata.lastUpdatedAt, 0);
  });

  it("Updates treasury wallet", async () => {
    // First initialize token metadata
    await program.methods
      .initialize(
        "Treasury Token",
        "TRES",
        "https://example.com/treasury-token.json",
        9
      )
      .accounts({
        tokenMetadata: metadataKeypair.publicKey,
        mint: mintKeypair.publicKey,
        authority: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([metadataKeypair])
      .rpc();

    // Create a new treasury address
    const newTreasury = anchor.web3.Keypair.generate().publicKey;

    // Update treasury
    await program.methods
      .updateTreasury(
        newTreasury
      )
      .accounts({
        treasuryConfig: treasuryKeypair.publicKey,
        mint: mintKeypair.publicKey,
        authority: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([treasuryKeypair])
      .rpc();

    // Verify treasury config
    const treasuryConfig = await program.account.treasuryConfig.fetch(treasuryKeypair.publicKey);
    assert.ok(treasuryConfig.mint.equals(mintKeypair.publicKey));
    assert.ok(treasuryConfig.authority.equals(wallet.publicKey));
    assert.ok(treasuryConfig.treasury.equals(newTreasury));
  });

  it("Handles emergency freeze and unfreeze", async () => {
    // First initialize token metadata
    await program.methods
      .initialize(
        "Emergency Token",
        "EMRG",
        "https://example.com/emergency-token.json",
        9
      )
      .accounts({
        tokenMetadata: metadataKeypair.publicKey,
        mint: mintKeypair.publicKey,
        authority: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([metadataKeypair])
      .rpc();

    // Test emergency freeze
    await program.methods
      .emergencyFreeze()
      .accounts({
        tokenMetadata: metadataKeypair.publicKey,
        authority: wallet.publicKey,
      })
      .rpc();

    // Verify token is frozen
    let metadata = await program.account.tokenMetadata.fetch(metadataKeypair.publicKey);
    assert.equal(metadata.isFrozen, true);

    // Test emergency unfreeze
    await program.methods
      .emergencyUnfreeze()
      .accounts({
        tokenMetadata: metadataKeypair.publicKey,
        authority: wallet.publicKey,
      })
      .rpc();

    // Verify token is unfrozen
    metadata = await program.account.tokenMetadata.fetch(metadataKeypair.publicKey);
    assert.equal(metadata.isFrozen, false);
  });

  it("Prevents unauthorized fee updates", async () => {
    // First initialize token metadata
    await program.methods
      .initialize(
        "Auth Token",
        "AUTH",
        "https://example.com/auth-token.json",
        9
      )
      .accounts({
        tokenMetadata: metadataKeypair.publicKey,
        mint: mintKeypair.publicKey,
        authority: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([metadataKeypair])
      .rpc();
    
    // Create unauthorized wallet
    const unauthorizedWallet = anchor.web3.Keypair.generate();
    
    // Fund the unauthorized wallet
    const signature = await provider.connection.requestAirdrop(
      unauthorizedWallet.publicKey,
      1000000000 // 1 SOL
    );
    await provider.connection.confirmTransaction(signature);
    
    try {
      // Attempt unauthorized fee update
      await program.methods
        .updateFees(300, 200)
        .accounts({
          tokenMetadata: metadataKeypair.publicKey,
          authority: unauthorizedWallet.publicKey,
        })
        .signers([unauthorizedWallet])
        .rpc();
      
      assert.fail("Expected transaction to fail due to unauthorized access");
    } catch (error) {
      // Ensure the error is due to constraint violation
      assert.include(error.toString(), "Error Code: Unauthorized");
    }
  });

  it("Validates fee percentage limits", async () => {
    // First initialize token metadata
    await program.methods
      .initialize(
        "Fee Limit Test",
        "LIMIT",
        "https://example.com/fee-limit-token.json",
        9
      )
      .accounts({
        tokenMetadata: metadataKeypair.publicKey,
        mint: mintKeypair.publicKey,
        authority: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([metadataKeypair])
      .rpc();
    
    try {
      // Attempt to set fees too high
      await program.methods
        .updateFees(1200, 900) // 12% + 9% = 21%, exceeds 20% limit
        .accounts({
          tokenMetadata: metadataKeypair.publicKey,
          authority: wallet.publicKey,
        })
        .rpc();
      
      assert.fail("Expected transaction to fail due to fee limits");
    } catch (error) {
      // Ensure the error is due to fee limits
      assert.include(error.toString(), "Error Code: CombinedFeeTooHigh");
    }
  });

  it("Mints tokens with bonding curve pricing", async () => {
    // Setup: Initialize token metadata
    await program.methods
      .initialize(
        "Mint Test",
        "MINT",
        "https://example.com/mint-token.json",
        9
      )
      .accounts({
        tokenMetadata: metadataKeypair.publicKey,
        mint: mintKeypair.publicKey,
        authority: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([metadataKeypair])
      .rpc();
      
    // Create token holder account
    await program.methods
      .createTokenHolder()
      .accounts({
        holder: tokenHolderKeypair.publicKey,
        owner: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([tokenHolderKeypair])
      .rpc();
      
    // Test minting with bonding curve
    const mintAmount = new anchor.BN(1000);
    
    // We're mocking the actual transfer of SOL here since this is a test
    await program.methods
      .mintTokens(mintAmount)
      .accounts({
        tokenAccount: metadataKeypair.publicKey,
        creator: wallet.publicKey,
        treasury: treasuryKeypair.publicKey,
        holder: tokenHolderKeypair.publicKey,
      })
      .rpc();
      
    // Verify holder received tokens
    const holderAccount = await program.account.tokenHolder.fetch(tokenHolderKeypair.publicKey);
    assert.isAbove(holderAccount.balance.toNumber(), 0);
    
    // Verify token supply increased
    const tokenAccount = await program.account.tokenMetadata.fetch(metadataKeypair.publicKey);
    assert.equal(tokenAccount.totalSupply.toNumber(), mintAmount.toNumber());
  });
  
  it("Executes token trades with fee distribution", async () => {
    // Setup: Initialize token and mint some tokens first
    await program.methods
      .initialize(
        "Trade Test",
        "TRADE",
        "https://example.com/trade-token.json",
        9
      )
      .accounts({
        tokenMetadata: metadataKeypair.publicKey,
        mint: mintKeypair.publicKey,
        authority: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([metadataKeypair])
      .rpc();
      
    // Create seller and buyer accounts
    const sellerKeypair = anchor.web3.Keypair.generate();
    const buyerKeypair = anchor.web3.Keypair.generate();
    
    await program.methods
      .createTokenHolder()
      .accounts({
        holder: sellerKeypair.publicKey,
        owner: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([sellerKeypair])
      .rpc();
      
    await program.methods
      .createTokenHolder()
      .accounts({
        holder: buyerKeypair.publicKey,
        owner: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([buyerKeypair])
      .rpc();
      
    // Mint tokens to seller
    const initialAmount = new anchor.BN(10000);
    await program.methods
      .mintTokens(initialAmount)
      .accounts({
        tokenAccount: metadataKeypair.publicKey,
        creator: wallet.publicKey,
        treasury: treasuryKeypair.publicKey,
        holder: sellerKeypair.publicKey,
      })
      .rpc();
      
    // Execute trade
    const tradeAmount = new anchor.BN(500);
    const price = new anchor.BN(1000000); // 1 SOL in lamports
    
    await program.methods
      .executeTrade(tradeAmount, price)
      .accounts({
        tokenAccount: metadataKeypair.publicKey,
        seller: sellerKeypair.publicKey,
        buyer: buyerKeypair.publicKey,
        treasury: treasuryKeypair.publicKey,
        creator: wallet.publicKey,
      })
      .rpc();
      
    // Verify seller and buyer balances
    const sellerAccount = await program.account.tokenHolder.fetch(sellerKeypair.publicKey);
    const buyerAccount = await program.account.tokenHolder.fetch(buyerKeypair.publicKey);
    
    assert.equal(sellerAccount.balance.toNumber(), initialAmount.toNumber() - tradeAmount.toNumber());
    assert.equal(buyerAccount.balance.toNumber(), tradeAmount.toNumber());
  });
  
  it("Updates token metadata URI", async () => {
    // Initialize token
    await program.methods
      .initialize(
        "Metadata Test",
        "META",
        "https://example.com/old-metadata.json",
        9
      )
      .accounts({
        tokenMetadata: metadataKeypair.publicKey,
        mint: mintKeypair.publicKey,
        authority: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([metadataKeypair])
      .rpc();
      
    // Update metadata URI
    const newUri = "https://example.com/new-metadata.json";
    await program.methods
      .updateTokenMetadata(newUri)
      .accounts({
        tokenAccount: metadataKeypair.publicKey,
        authority: wallet.publicKey,
      })
      .rpc();
      
    // Verify updated URI
    const tokenAccount = await program.account.tokenMetadata.fetch(metadataKeypair.publicKey);
    assert.equal(tokenAccount.metadataUri, newUri);
  });
  
  it("Records token launch data", async () => {
    // Initialize token
    await program.methods
      .initialize(
        "Launch Test",
        "LAUNCH",
        "https://example.com/launch-token.json",
        9
      )
      .accounts({
        tokenMetadata: metadataKeypair.publicKey,
        mint: mintKeypair.publicKey,
        authority: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([metadataKeypair])
      .rpc();
      
    // Record token launch
    const launchData = JSON.stringify({
      initialPrice: 0.001,
      initialMarketCap: 10000,
      launchTime: Date.now(),
      launchPlatform: "Wybe",
      launchPool: "SOL-LAUNCH"
    });
    
    await program.methods
      .recordTokenLaunch(launchData)
      .accounts({
        tokenAccount: metadataKeypair.publicKey,
        authority: wallet.publicKey,
        launchRecord: launchRecordKeypair.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([launchRecordKeypair])
      .rpc();
      
    // Verify launch record
    const launchRecord = await program.account.launchRecord.fetch(launchRecordKeypair.publicKey);
    assert.equal(launchRecord.launchData, launchData);
    assert.ok(launchRecord.tokenAccount.equals(metadataKeypair.publicKey));
  });
  
  it("Transfers token ownership", async () => {
    // Initialize token
    await program.methods
      .initialize(
        "Transfer Test",
        "XFER",
        "https://example.com/transfer-token.json",
        9
      )
      .accounts({
        tokenMetadata: metadataKeypair.publicKey,
        mint: mintKeypair.publicKey,
        authority: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([metadataKeypair])
      .rpc();
      
    // Create a new owner
    const newOwnerKeypair = anchor.web3.Keypair.generate();
    
    // Transfer ownership
    await program.methods
      .transferTokenOwnership(newOwnerKeypair.publicKey)
      .accounts({
        tokenAccount: metadataKeypair.publicKey,
        authority: wallet.publicKey,
      })
      .rpc();
      
    // Verify new owner
    const tokenAccount = await program.account.tokenMetadata.fetch(metadataKeypair.publicKey);
    assert.ok(tokenAccount.authority.equals(newOwnerKeypair.publicKey));
  });
  
  it("Performs security checks for token transfers", async () => {
    // Initialize token
    await program.methods
      .initialize(
        "Security Test",
        "SEC",
        "https://example.com/security-token.json",
        9
      )
      .accounts({
        tokenMetadata: metadataKeypair.publicKey,
        mint: mintKeypair.publicKey,
        authority: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([metadataKeypair])
      .rpc();
      
    // Freeze the token
    await program.methods
      .emergencyFreeze()
      .accounts({
        tokenMetadata: metadataKeypair.publicKey,
        authority: wallet.publicKey,
      })
      .rpc();
      
    // Create token holders
    const holderKeypair = anchor.web3.Keypair.generate();
    
    await program.methods
      .createTokenHolder()
      .accounts({
        holder: holderKeypair.publicKey,
        owner: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([holderKeypair])
      .rpc();
      
    // Attempt to mint tokens while frozen
    try {
      await program.methods
        .mintTokens(new anchor.BN(1000))
        .accounts({
          tokenAccount: metadataKeypair.publicKey,
          creator: wallet.publicKey,
          treasury: treasuryKeypair.publicKey,
          holder: holderKeypair.publicKey,
        })
        .rpc();
        
      assert.fail("Should not be able to mint tokens when frozen");
    } catch (error) {
      assert.include(error.toString(), "AccountFrozen");
    }
    
    // Unfreeze the token
    await program.methods
      .emergencyUnfreeze()
      .accounts({
        tokenMetadata: metadataKeypair.publicKey,
        authority: wallet.publicKey,
      })
      .rpc();
      
    // Verify we can mint after unfreezing
    await program.methods
      .mintTokens(new anchor.BN(1000))
      .accounts({
        tokenAccount: metadataKeypair.publicKey,
        creator: wallet.publicKey,
        treasury: treasuryKeypair.publicKey,
        holder: holderKeypair.publicKey,
      })
      .rpc();
      
    // Verify minting worked
    const holderAccount = await program.account.tokenHolder.fetch(holderKeypair.publicKey);
    assert.isAbove(holderAccount.balance.toNumber(), 0);
  });
  
  it("Verifies token statistics", async () => {
    // Initialize token
    await program.methods
      .initialize(
        "Verify Test",
        "VFY",
        "https://example.com/verify-token.json",
        9
      )
      .accounts({
        tokenMetadata: metadataKeypair.publicKey,
        mint: mintKeypair.publicKey,
        authority: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([metadataKeypair])
      .rpc();
      
    // Create oracle keypair
    const oracleKeypair = anchor.web3.Keypair.generate();
    
    // Fund the oracle
    const signature = await provider.connection.requestAirdrop(
      oracleKeypair.publicKey,
      1000000000 // 1 SOL
    );
    await provider.connection.confirmTransaction(signature);
    
    // Verify token statistics
    await program.methods
      .verifyTokenStatistics()
      .accounts({
        tokenAccount: metadataKeypair.publicKey,
        oracle: oracleKeypair.publicKey,
        authority: wallet.publicKey,
      })
      .signers([oracleKeypair])
      .rpc();
      
    // There's no state change to verify, but we can check that it executed without errors
  });

  it("Tests large scale minting and trading operations", async () => {
    // Initialize token
    await program.methods
      .initialize(
        "Scale Test",
        "SCALE",
        "https://example.com/scale-token.json",
        9
      )
      .accounts({
        tokenMetadata: metadataKeypair.publicKey,
        mint: mintKeypair.publicKey,
        authority: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([metadataKeypair])
      .rpc();
      
    // Create multiple token holders
    const holders: anchor.web3.Keypair[] = [];
    for (let i = 0; i < 5; i++) {
      const holderKeypair = anchor.web3.Keypair.generate();
      holders.push(holderKeypair);
      
      await program.methods
        .createTokenHolder()
        .accounts({
          holder: holderKeypair.publicKey,
          owner: wallet.publicKey,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .signers([holderKeypair])
        .rpc();
    }
    
    // Mint tokens to first holder (who will be a seller)
    await program.methods
      .mintTokens(new anchor.BN(10000))
      .accounts({
        tokenAccount: metadataKeypair.publicKey,
        creator: wallet.publicKey,
        treasury: treasuryKeypair.publicKey,
        holder: holders[0].publicKey,
      })
      .rpc();
    
    // Execute a series of trades between the holders
    for (let i = 1; i < holders.length; i++) {
      const tradeAmount = new anchor.BN(500 * i);
      const price = new anchor.BN(1000000); // 1 SOL in lamports
      
      await program.methods
        .executeTrade(tradeAmount, price)
        .accounts({
          tokenAccount: metadataKeypair.publicKey,
          seller: holders[0].publicKey,
          buyer: holders[i].publicKey,
          treasury: treasuryKeypair.publicKey,
          creator: wallet.publicKey,
        })
        .rpc();
    }
    
    // Verify final balances
    for (let i = 1; i < holders.length; i++) {
      const holderAccount = await program.account.tokenHolder.fetch(holders[i].publicKey);
      assert.isAbove(holderAccount.balance.toNumber(), 0);
    }
    
    // Verify seller's final balance
    const sellerAccount = await program.account.tokenHolder.fetch(holders[0].publicKey);
    assert.isBelow(sellerAccount.balance.toNumber(), 10000);
  });
});
