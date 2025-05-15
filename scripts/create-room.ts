
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import fs from 'fs';
import { program } from 'commander';
import { web3 } from '@coral-xyz/anchor';
import { initMemeBattleProgram } from './utils/program';

program
  .option('-k, --keypair <path>', 'Path to admin keypair')
  .option('-r, --room-id <id>', 'Unique room ID for the battle')
  .option('-m, --max-participants <number>', 'Maximum number of participants (2-5)', '4')
  .option('-d, --duration <hours>', 'Battle duration in hours (1-24)', '24')
  .option('-c, --cluster <url>', 'Solana cluster URL', 'https://api.devnet.solana.com')
  .parse(process.argv);

const options = program.opts();

async function main() {
  try {
    // Validate options
    if (!options.keypair) {
      throw new Error('Admin keypair is required');
    }
    
    if (!options.roomId) {
      throw new Error('Room ID is required');
    }
    
    const maxParticipants = parseInt(options.maxParticipants);
    if (isNaN(maxParticipants) || maxParticipants < 2 || maxParticipants > 5) {
      throw new Error('Max participants must be between 2 and 5');
    }
    
    const duration = parseInt(options.duration);
    if (isNaN(duration) || duration < 1 || duration > 24) {
      throw new Error('Duration must be between 1 and 24 hours');
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
    
    // Generate a PDA for the battle room
    const [battleRoomPDA] = await PublicKey.findProgramAddress(
      [
        Buffer.from('battle_room'),
        Buffer.from(options.roomId),
        adminKeypair.publicKey.toBuffer()
      ],
      program.programId
    );
    
    console.log(`Creating battle room with ID: ${options.roomId}`);
    console.log(`Battle room PDA: ${battleRoomPDA.toString()}`);
    console.log(`Max participants: ${maxParticipants}`);
    console.log(`Duration: ${duration} hours`);
    
    // Create battle room
    const battleDurationSeconds = duration * 60 * 60;
    
    const tx = await program.methods
      .createBattleRoom(
        options.roomId,
        maxParticipants,
        new web3.BN(battleDurationSeconds)
      )
      .accounts({
        battleRoom: battleRoomPDA,
        admin: adminKeypair.publicKey,
        systemProgram: web3.SystemProgram.programId,
      })
      .signers([adminKeypair])
      .rpc();
    
    console.log(`Transaction signature: ${tx}`);
    console.log(`Battle room created successfully!`);
    
    // Return the battle room PDA for reference
    return battleRoomPDA.toString();
  } catch (error) {
    console.error('Error creating battle room:', error);
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
