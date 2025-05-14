
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

export interface AnchorBuildResult {
  success: boolean;
  message: string;
  programId?: string;
  buildOutput?: string;
}

/**
 * Builds the Anchor program
 */
export function buildAnchorProgram(programDir = './anchor-program'): AnchorBuildResult {
  try {
    console.log('Building Anchor program...');
    
    // Check if the Anchor program exists
    if (!fs.existsSync(programDir)) {
      return {
        success: false,
        message: `Anchor program directory not found at ${programDir}`
      };
    }
    
    // Execute the anchor build command
    const buildOutput = execSync('anchor build', {
      cwd: programDir,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe']
    });
    
    console.log('Build output:', buildOutput);
    
    // Extract program ID from the build output
    const programIdMatch = buildOutput.match(/Program ID: ([a-zA-Z0-9]+)/);
    const programId = programIdMatch ? programIdMatch[1] : undefined;
    
    return {
      success: true,
      message: 'Anchor program built successfully',
      programId,
      buildOutput
    };
  } catch (error) {
    console.error('Error building Anchor program:', error);
    return {
      success: false,
      message: `Error building Anchor program: ${error instanceof Error ? error.message : String(error)}`,
      buildOutput: error instanceof Error ? error.toString() : String(error)
    };
  }
}

/**
 * Deploys the Anchor program
 */
export function deployAnchorProgram(network = 'devnet', programDir = './anchor-program'): AnchorBuildResult {
  try {
    console.log(`Deploying Anchor program to ${network}...`);
    
    // First, update the Anchor.toml to use the specified network
    const anchorTomlPath = path.join(programDir, 'Anchor.toml');
    let anchorToml = fs.readFileSync(anchorTomlPath, 'utf-8');
    anchorToml = anchorToml.replace(/cluster = "[^"]+"/g, `cluster = "${network}"`);
    fs.writeFileSync(anchorTomlPath, anchorToml);
    
    // Execute the anchor deploy command
    const deployOutput = execSync(`anchor deploy --provider.cluster ${network}`, {
      cwd: programDir,
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe']
    });
    
    console.log('Deploy output:', deployOutput);
    
    // Extract program ID from the deploy output
    const programIdMatch = deployOutput.match(/Program ID: ([a-zA-Z0-9]+)/);
    const programId = programIdMatch ? programIdMatch[1] : undefined;
    
    return {
      success: true,
      message: `Anchor program deployed to ${network} successfully`,
      programId,
      buildOutput: deployOutput
    };
  } catch (error) {
    console.error('Error deploying Anchor program:', error);
    return {
      success: false,
      message: `Error deploying Anchor program: ${error instanceof Error ? error.message : String(error)}`,
      buildOutput: error instanceof Error ? error.toString() : String(error)
    };
  }
}

/**
 * Verifies if Anchor CLI is installed
 */
export function verifyAnchorInstallation(): boolean {
  try {
    execSync('anchor --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Gets installed Anchor version
 */
export function getAnchorVersion(): string | null {
  try {
    const version = execSync('anchor --version', { encoding: 'utf-8' }).trim();
    return version;
  } catch {
    return null;
  }
}
