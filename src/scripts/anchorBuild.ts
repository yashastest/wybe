
// Mock implementations of Anchor CLI functions for browser development

// State for mock Anchor installation status
let anchorInstalled = false;
let anchorVersion = '0.26.0';
let buildSuccess = true;
let deploySuccess = true;
let verifyResult = { success: false, message: 'Anchor not installed', version: '' };

// Set mock Anchor CLI status for testing
export function setMockAnchorStatus(installed: boolean, version: string = '0.26.0'): void {
  anchorInstalled = installed;
  anchorVersion = version;
  verifyResult = installed 
    ? { success: true, message: 'Anchor CLI is installed', version } 
    : { success: false, message: 'Anchor CLI is not installed', version: '' };
}

// Verify if Anchor CLI is installed
export function verifyAnchorInstallation(): boolean {
  // For browser compatibility, return a simple boolean instead of a Promise
  return anchorInstalled;
}

// Install Anchor CLI
export async function installAnchorCLI(): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      anchorInstalled = true;
      anchorVersion = '0.29.0';
      resolve(true);
    }, 2000);
  });
}

// Build Anchor program
export function buildAnchorProgram(options?: { verbose?: boolean }): { success: boolean; message: string; logs: string[] } {
  const logs: string[] = [];
  
  // Simulate build process with logs
  const steps = [
    'Compiling program...',
    'Building Rust program...',
    'Checking dependencies...',
    'Running cargo build...',
    buildSuccess ? 'Build completed successfully!' : 'Build failed with errors.'
  ];
  
  for (const step of steps) {
    logs.push(step);
  }
  
  return {
    success: buildSuccess,
    message: buildSuccess ? 'Program built successfully' : 'Build failed',
    logs
  };
}

// Deploy Anchor program
export function deployAnchorProgram(network: string = 'devnet'): { success: boolean; message: string; programId?: string; logs: string[] } {
  const logs: string[] = [];
  
  // Simulate deployment process with logs
  const steps = [
    `Deploying to ${network}...`,
    'Preparing program for deployment...',
    'Connecting to Solana cluster...',
    'Submitting transaction...',
    'Confirming transaction...',
    deploySuccess ? 'Program deployed successfully!' : 'Deployment failed with errors.'
  ];
  
  for (const step of steps) {
    logs.push(step);
  }
  
  return {
    success: deploySuccess,
    message: deploySuccess ? 'Program deployed successfully' : 'Deployment failed',
    programId: deploySuccess ? 'Wyb111111111111111111111111111111111111111' : undefined,
    logs
  };
}

// Set build success/failure for testing
export function setMockBuildResult(success: boolean): void {
  buildSuccess = success;
}

// Set deploy success/failure for testing
export function setMockDeployResult(success: boolean): void {
  deploySuccess = success;
}

// Get program size for verification
export function getProgramSize(): { size: number; sizeLimit: number } {
  return {
    size: 287423,  // Sample program size in bytes
    sizeLimit: 400000  // Solana program size limit
  };
}

// Validate program code for security issues
export function validateProgramSecurity(): {
  issues: { severity: 'high' | 'medium' | 'low'; description: string; location?: string }[];
  score: number;
} {
  return {
    issues: [
      {
        severity: 'low',
        description: 'Recommend adding explicit checks for account ownership',
        location: 'programs/wybe_token_program/src/lib.rs:42'
      },
      {
        severity: 'low',
        description: 'Consider adding rate limiting for token creation',
        location: 'programs/wybe_token_program/src/lib.rs:78'
      }
    ],
    score: 85 // Security score out of 100
  };
}
