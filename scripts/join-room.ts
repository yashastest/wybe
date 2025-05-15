
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import fs from 'fs';
import { program } from 'commander';
import { web3 } from '@coral-xyz/anchor';
import { initMemeBattleProgram } from './utils/program';

program
  .option('-k, --keypair <path>', 'Path to creator keypair')
  .option('-b, --battle-room <pubkey>', 'Battle room public key to join')
  .option('-s, --symbol <symbol>', 'Token symbol (max 8 characters)')
  .option('-n, --name <name>', 'Token name')
  .option('-i, --initial-supply <number>', 'Initial token supply', '100000')
  .option('-c, --cluster <url>', 'Solana cluster URL', 'https://api.devnet.solana.com')
  .parse(process.argv);

const options = program.opts();

async function main() {
  try {
    // Validate options
    if (!options.keypair) {
      throw new Error('Creator keypair is required');
    }
    
    if (!options.battleRoom) {
      throw new Error('Battle room public key is required');
    }
    
    if (!options.symbol) {
      throw new Error('Token symbol is required');
    }
    
    if (options.symbol.length > 8) {
      throw new Error('Token symbol must be 8 characters or less');
    }
    
    if (!options.name) {
      throw new Error('Token name is required');
    }
    
    const initialSupply = parseInt(options.initialSupply);
    if (isNaN(initialSupply) || initialSupply <= 0) {
      throw new Error('Initial supply must be a positive number');
    }
    
    // Load keypair
    const keypairBuffer = fs.readFileSync(options.keypair);
    const keypairData = JSON.parse(keypairBuffer.toString());
    const creatorKeypair = Keypair.fromSecretKey(new Uint8Array(keypairData));
    
    console.log(`Creator public key: ${creatorKeypair.publicKey.toString()}`);
    
    // Connect to Solana cluster
    const connection = new Connection(options.cluster, 'confirmed');
    
    // Initialize Anchor program
    const { program } = await initMemeBattleProgram(creatorKeypair);
    
    // Parse battle room public key
    const battleRoomPubkey = new PublicKey(options.battleRoom);
    
    // Generate a PDA for the battle token
    const [battleTokenPDA] = await PublicKey.findProgramAddress(
      [
        Buffer.from('battle_token'),
        battleRoomPubkey.toBuffer(),
        Buffer.from(options.symbol),
        creatorKeypair.publicKey.toBuffer()
      ],
      program.programId
    );
    
    console.log(`Joining battle room: ${battleRoomPubkey.toString()}`);
    console.log(`With token: ${options.symbol} (${options.name})`);
    console.log(`Initial supply: ${initialSupply}`);
    console.log(`Battle token PDA: ${battleTokenPDA.toString()}`);
    
    // Join battle room
    const tx = await program.methods
      .joinBattleRoom(
        options.symbol,
        options.name,
        new web3.BN(initialSupply)
      )
      .accounts({
        battleRoom: battleRoomPubkey,
        battleToken: battleTokenPDA,
        creator: creatorKeypair.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([creatorKeypair])
      .rpc();
    
    console.log(`Transaction signature: ${tx}`);
    console.log(`Successfully joined battle room with token ${options.symbol}!`);
    
    // Return the battle token PDA for reference
    return battleTokenPDA.toString();
  } catch (error) {
    console.error('Error joining battle room:', error);
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
