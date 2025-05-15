
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import fs from 'fs';
import { program as commanderProgram } from 'commander';
import { initMemeBattleProgram } from './utils/program';
import { web3 } from '@coral-xyz/anchor';

commanderProgram
  .option('-k, --keypair <path>', 'Path to admin keypair')
  .option('-b, --battle-room <pubkey>', 'Battle room public key to start')
  .option('-c, --cluster <url>', 'Solana cluster URL', 'https://api.devnet.solana.com')
  .parse(process.argv);

const options = commanderProgram.opts();

async function main() {
  try {
    // Validate options
    if (!options.keypair) {
      throw new Error('Admin keypair is required');
    }
    
    if (!options.battleRoom) {
      throw new Error('Battle room public key is required');
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
    
    // Parse battle room public key
    const battleRoomPubkey = new PublicKey(options.battleRoom);
    
    console.log(`Starting battle room: ${battleRoomPubkey.toString()}`);
    
    // Start the battle
    const tx = await program.methods
      .startBattle()
      .accounts({
        battleRoom: battleRoomPubkey,
        admin: adminKeypair.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([adminKeypair])
      .rpc();
    
    console.log(`Transaction signature: ${tx}`);
    console.log(`Battle started successfully!`);
  } catch (error) {
    console.error('Error starting battle:', error);
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
