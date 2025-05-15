
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { Program, AnchorProvider, Wallet, web3, setProvider } from '@coral-xyz/anchor';
import { IDL } from '../target/types/meme_battle_royale';

// Program ID for the Meme Battle Royale program
const PROGRAM_ID = 'Wyb222222222222222222222222222222222222222';

export async function initMemeBattleProgram(payer: Keypair, url = 'https://api.devnet.solana.com') {
  // Create a connection to the specified cluster
  const connection = new Connection(url, 'confirmed');
  
  // Create a wallet from the payer keypair
  const wallet = new Wallet(payer);
  
  // Create a provider
  const provider = new AnchorProvider(
    connection,
    wallet,
    { commitment: 'confirmed' }
  );
  
  // Set the provider globally
  setProvider(provider);
  
  // Initialize the program
  const program = new Program(
    IDL,
    new PublicKey(PROGRAM_ID),
    provider
  );
  
  return { 
    connection, 
    wallet, 
    program,
    provider 
  };
}

// Utility function to derive Battle Room address
export async function deriveBattleRoomAddress(
  roomId: string,
  adminPublicKey: PublicKey,
  programId: PublicKey
) {
  return PublicKey.findProgramAddress(
    [
      Buffer.from('battle_room'),
      Buffer.from(roomId),
      adminPublicKey.toBuffer()
    ],
    programId
  );
}

// Utility function to derive Battle Token address
export async function deriveBattleTokenAddress(
  battleRoomPubkey: PublicKey,
  tokenSymbol: string,
  creatorPublicKey: PublicKey,
  programId: PublicKey
) {
  return PublicKey.findProgramAddress(
    [
      Buffer.from('battle_token'),
      battleRoomPubkey.toBuffer(),
      Buffer.from(tokenSymbol),
      creatorPublicKey.toBuffer()
    ],
    programId
  );
}
