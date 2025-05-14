
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

  beforeEach(async () => {
    // Create new keypairs for each test
    mintKeypair = anchor.web3.Keypair.generate();
    metadataKeypair = anchor.web3.Keypair.generate();
    bondingCurveKeypair = anchor.web3.Keypair.generate();
    treasuryKeypair = anchor.web3.Keypair.generate();
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
});
