
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import fs from 'fs';
import { program } from 'commander';
import { initMemeBattleProgram } from './utils/program';

program
  .option('-k, --keypair <path>', 'Path to admin keypair')
  .option('-b, --battle-room <pubkey>', 'Battle room public key')
  .option('-t, --token <pubkey>', 'Winning token public key')
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
    
    if (!options.token) {
      throw new Error('Winning token public key is required');
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
    
    // Parse public keys
    const battleRoomPubkey = new PublicKey(options.battleRoom);
    const winningTokenPubkey = new PublicKey(options.token);
    
    console.log(`Battle room: ${battleRoomPubkey.toString()}`);
    console.log(`Setting winning token: ${winningTokenPubkey.toString()}`);
    
    // Set the winner
    const tx = await program.methods
      .setWinner()
      .accounts({
        battleRoom: battleRoomPubkey,
        battleToken: winningTokenPubkey,
        admin: adminKeypair.publicKey,
      })
      .signers([adminKeypair])
      .rpc();
    
    console.log(`Transaction signature: ${tx}`);
    console.log(`Winner set successfully!`);
  } catch (error) {
    console.error('Error setting winner:', error);
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
