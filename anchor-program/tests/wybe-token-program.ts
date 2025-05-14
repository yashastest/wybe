
import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { WybeTokenProgram } from "../target/types/wybe_token_program";
import { assert } from "chai";

describe("wybe-token-program", () => {
  // Configure the client to use the local cluster
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.WybeTokenProgram as Program<WybeTokenProgram>;
  const wallet = provider.wallet;

  it("Initializes a token with metadata", async () => {
    // Create a new keypair for the mint
    const mintKeypair = anchor.web3.Keypair.generate();
    const metadataKeypair = anchor.web3.Keypair.generate();
    
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
  });
});
