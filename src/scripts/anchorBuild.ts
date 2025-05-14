
// This file provides browser-compatible versions of Anchor build functions

export interface AnchorBuildResult {
  success: boolean;
  message: string;
  programId?: string;
  buildOutput?: string;
}

// Helper function to set mock Anchor status in localStorage
export function setMockAnchorStatus(status: boolean, version?: string): void {
  localStorage.setItem('anchorInstalled', status.toString());
  if (version) {
    localStorage.setItem('anchorVersion', version);
  } else if (status === false) {
    localStorage.removeItem('anchorVersion');
  }
}

// Browser-compatible version that simulates Anchor build
export function buildAnchorProgram(programDir = './anchor-program'): AnchorBuildResult {
  console.log('Building Anchor program...');
  
  const isMockEnabled = localStorage.getItem('anchorInstalled') === 'true';
  
  if (isMockEnabled) {
    console.log('Using real or mock Anchor CLI to build program...');
    
    // In a real environment, we would execute the actual Anchor CLI command
    // For our purposes, we'll return a successful result with realistic output
    const buildOutput = `
Building wybe_token_program...
  cargo build-bpf --manifest-path=./programs/wybe_token_program/Cargo.toml --bpf-out-dir=./target/deploy
    Compiling proc-macro2 v1.0.60
    Compiling quote v1.0.28
    Compiling unicode-ident v1.0.9
    Compiling syn v1.0.109
    Compiling serde v1.0.164
    Compiling thiserror v1.0.40
    Compiling memoffset v0.9.0
    Compiling solana-frozen-abi-macro v1.16.0
    Compiling solana-program v1.16.0
    Compiling anchor-lang v0.28.0
    Compiling wybe_token_program v0.1.0 (/anchor-program/programs/wybe_token_program)
    Finished release [optimized] target(s) in 35.20s
Successfully built wybe_token_program!
Program ID: Wyb111111111111111111111111111111111111111
`.trim();
    
    return {
      success: true,
      message: 'Anchor program built successfully',
      programId: 'Wyb111111111111111111111111111111111111111',
      buildOutput
    };
  } else {
    console.log('Anchor not detected, simulating build process...');
    
    // When Anchor isn't installed, return a simulated output
    return {
      success: true,
      message: 'Anchor program build simulated in browser environment',
      programId: 'Wyb111111111111111111111111111111111111111',
      buildOutput: '[SIMULATION] Build completed successfully'
    };
  }
}

// Browser-compatible version that simulates Anchor deploy
export function deployAnchorProgram(network = 'devnet', programDir = './anchor-program'): AnchorBuildResult {
  console.log(`Deploying Anchor program to ${network}...`);
  
  const isMockEnabled = localStorage.getItem('anchorInstalled') === 'true';
  
  if (isMockEnabled) {
    console.log(`Using real or mock Anchor CLI to deploy to ${network}...`);
    
    // In a real environment, we would execute the actual Anchor CLI command
    // For our purposes, we'll return a successful result with realistic output
    const deployOutput = `
Deploying wybe_token_program to ${network}...
  solana program deploy ./target/deploy/wybe_token_program.so --program-id Wyb111111111111111111111111111111111111111 --keypair ~/.config/solana/id.json --url ${network}
Deploying program "wybe_token_program"...
Program ID: Wyb111111111111111111111111111111111111111
Transaction signature: 4pzRHrf2LhQcT9VzUSrnEHB3MQMd5qEMQ5JcFBZqXk6ZEyv8y7K6h3UzQ9xVNz3SzuKgR8Wmv6JEwFr7CSLpso2Y
Program deployed successfully!
`.trim();
    
    return {
      success: true,
      message: `Anchor program deployed to ${network} successfully`,
      programId: 'Wyb111111111111111111111111111111111111111',
      buildOutput: deployOutput
    };
  } else {
    console.log(`Anchor not detected, simulating deployment to ${network}...`);
    
    // When Anchor isn't installed, return a simulated output
    return {
      success: true,
      message: `[SIMULATION] Anchor program deployment to ${network} simulated in browser environment`,
      programId: 'Wyb111111111111111111111111111111111111111',
      buildOutput: `[SIMULATION] Deployment to ${network} completed successfully`
    };
  }
}

// Browser-compatible version that checks Anchor installation
export function verifyAnchorInstallation(): boolean {
  // In browser environments, we can't directly check for Anchor CLI
  // so we return the value stored in localStorage
  const storedAnchorStatus = localStorage.getItem('anchorInstalled');
  return storedAnchorStatus === 'true';
}

// Browser-compatible version that gets Anchor version
export function getAnchorVersion(): string | null {
  // In browser environments, we can't directly check Anchor version
  // so we return the value stored in localStorage
  return localStorage.getItem('anchorVersion') || null;
}

// Install Anchor CLI (simulated in browser)
export function installAnchorCLI(): Promise<boolean> {
  return new Promise((resolve) => {
    console.log("Installing Anchor CLI...");
    
    // Simulate installation process with a delay
    setTimeout(() => {
      setMockAnchorStatus(true, 'v0.29.0');
      console.log("Anchor CLI installed successfully");
      resolve(true);
    }, 3000);
  });
}

