
// This file provides browser-compatible versions of Anchor build functions

export interface AnchorBuildResult {
  success: boolean;
  message: string;
  programId?: string;
  buildOutput?: string;
}

// Browser-compatible version that simulates Anchor build
export function buildAnchorProgram(programDir = './anchor-program'): AnchorBuildResult {
  console.log('Simulating Anchor build in browser environment...');
  
  // In browser environments, we simulate the build with a mock result
  return {
    success: true,
    message: 'Anchor program build simulated in browser environment',
    programId: 'Wyb111111111111111111111111111111111111111',
    buildOutput: 'Build simulation completed successfully'
  };
}

// Browser-compatible version that simulates Anchor deploy
export function deployAnchorProgram(network = 'devnet', programDir = './anchor-program'): AnchorBuildResult {
  console.log(`Simulating Anchor deploy to ${network} in browser environment...`);
  
  // In browser environments, we simulate the deployment with a mock result
  return {
    success: true,
    message: `Anchor program deployment to ${network} simulated in browser environment`,
    programId: 'Wyb111111111111111111111111111111111111111',
    buildOutput: 'Deployment simulation completed successfully'
  };
}

// Browser-compatible version that checks Anchor installation
export function verifyAnchorInstallation(): boolean {
  // In browser environments, we can't directly check for Anchor CLI
  // so we return a default value or check localStorage if you've stored this info
  const storedAnchorStatus = localStorage.getItem('anchorInstalled');
  if (storedAnchorStatus) {
    return storedAnchorStatus === 'true';
  }
  
  // Default to false in browser environment
  return false;
}

// Browser-compatible version that gets Anchor version
export function getAnchorVersion(): string | null {
  // In browser environments, we can't directly check Anchor version
  // so we return a default value or check localStorage if you've stored this info
  return localStorage.getItem('anchorVersion') || 'Simulated 0.29.0';
}
