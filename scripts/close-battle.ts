
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import fs from 'fs';
import { program } from 'commander';
import { web3 } from '@coral-xyz/anchor';
import { initMemeBattleProgram } from './utils/program';

program
  .option('-k, --keypair <path>', 'Path to admin keypair')
  .option('-b, --battle-room <pubkey>', 'Battle room public key to close')
  .option('-t, --treasury <pubkey>', 'Treasury wallet to receive platform fees')
  .option('-c, --cluster <url>', 'Solana cluster URL', 'https://api.devnet.solana.com')
  .parse(process.argv);

const options = program.opts();

async function main() {
  try {
    // Validate options
    if (!options.keypair) {
      throw new Error('Admin keypair is required');
    }
    
    if (!options.battleRoom) {
      throw new Error('Battle room public key is required');
    }
    
    if (!options.treasury) {
      throw new Error('Treasury wallet public key is required');
    }
    
    // Load keypair
    const keypairBuffer = fs.readFileSync(options.keypair);
    const keypairData = JSON.parse(keypairBuffer.toString());
    const adminKeypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
    
    console.log(`Admin public key: ${adminKeypair.publicKey.toString()}`);
    
    // Connect to Solana cluster
    const connection = new Connection(options.cluster, 'confirmed');
    
    // Initialize Anchor program
    const { program } = await initMemeBattleProgram(adminKeypair);
    
    // Parse battle room and treasury public keys
    const battleRoomPubkey = new PublicKey(options.battleRoom);
    const treasuryPubkey = new PublicKey(options.treasury);
    
    console.log(`Closing battle room: ${battleRoomPubkey.toString()}`);
    console.log(`Treasury wallet: ${treasuryPubkey.toString()}`);
    
    // Close the battle
    const tx = await program.methods
      .closeBattle()
      .accounts({
        battleRoom: battleRoomPubkey,
        admin: adminKeypair.publicKey,
        treasury: treasuryPubkey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([adminKeypair])
      .rpc();
    
    console.log(`Transaction signature: ${tx}`);
    console.log(`Battle closed successfully!`);
  } catch (error) {
    console.error('Error closing battle:', error);
    process.exit(1);
  }
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
