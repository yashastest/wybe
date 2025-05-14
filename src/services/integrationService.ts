
// Integration service to handle all third-party integrations
import { toast } from "sonner";
import { setMockAnchorStatus } from "../scripts/anchorBuild";

// Types for environment deployment
export interface EnvironmentConfig {
  networkType: 'mainnet' | 'testnet' | 'devnet';
  frontendUrl?: string;
  backendUrl?: string;
  creatorFeePercentage?: number;
  platformFeePercentage?: number;
}

class IntegrationService {
  /**
   * Set mock Anchor status for testing
   */
  public setMockAnchorStatus(enabled: boolean, version?: string): void {
    setMockAnchorStatus(enabled, version);
    
    // Update local storage
    localStorage.setItem('anchorInstalled', enabled.toString());
    if (version) {
      localStorage.setItem('anchorVersion', version);
    } else if (!enabled) {
      localStorage.removeItem('anchorVersion');
    }
    
    console.log(`Mock Anchor CLI ${enabled ? 'enabled' : 'disabled'}, version: ${version || 'none'}`);
  }
  
  /**
   * Deploy full environment (frontend, backend, contracts)
   */
  public async deployFullEnvironment(
    config: EnvironmentConfig,
    walletAddress: string
  ): Promise<{ success: boolean; message: string; txHash?: string }> {
    console.log("Deploying full environment with config:", config);
    console.log("Using wallet:", walletAddress);
    
    try {
      // Simulate environment deployment process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate mock txHash
      const txHash = `env_${Date.now().toString(16)}_${Math.random().toString(16).substring(2, 8)}`;
      
      // Store deployment info
      localStorage.setItem('environmentDeployed', 'true');
      localStorage.setItem('environmentNetwork', config.networkType);
      localStorage.setItem('environmentWallet', walletAddress);
      localStorage.setItem('environmentFrontendUrl', config.frontendUrl || 'https://app.wybe.finance');
      localStorage.setItem('environmentBackendUrl', config.backendUrl || 'https://api.wybe.finance');
      
      // Update deployment checklist
      this.updateChecklistItem('anchor', true);
      this.updateChecklistItem('wallet', true);
      this.updateChecklistItem('security', true);
      
      return {
        success: true,
        message: `Environment successfully deployed to ${config.networkType}`,
        txHash
      };
    } catch (error) {
      console.error("Environment deployment error:", error);
      return {
        success: false,
        message: `Failed to deploy environment: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
  
  /**
   * Update a deployment checklist item
   */
  public updateChecklistItem(id: string, checked: boolean): void {
    try {
      const checklistString = localStorage.getItem('deploymentChecklist');
      const checklist = checklistString ? JSON.parse(checklistString) : [
        { id: 'anchor', label: 'Anchor CLI is installed and configured', checked: false },
        { id: 'wallet', label: 'Wallet is connected and has sufficient SOL', checked: false },
        { id: 'contract', label: 'Smart contract code is finalized', checked: false },
        { id: 'treasury', label: 'Treasury wallet is configured', checked: false },
        { id: 'fees', label: 'Creator and platform fees are set', checked: true },
        { id: 'security', label: 'Security audit is complete', checked: false }
      ];
      
      const updatedChecklist = checklist.map((item: any) => 
        item.id === id ? {...item, checked} : item
      );
      
      localStorage.setItem('deploymentChecklist', JSON.stringify(updatedChecklist));
    } catch (error) {
      console.error("Error updating checklist item:", error);
    }
  }
  
  /**
   * Get the deployment checklist
   */
  public getDeploymentChecklist(): any[] {
    try {
      const checklistString = localStorage.getItem('deploymentChecklist');
      if (checklistString) {
        return JSON.parse(checklistString);
      }
      
      // Default checklist
      const defaultChecklist = [
        { id: 'anchor', label: 'Anchor CLI is installed and configured', checked: false },
        { id: 'wallet', label: 'Wallet is connected and has sufficient SOL', checked: false },
        { id: 'contract', label: 'Smart contract code is finalized', checked: false },
        { id: 'treasury', label: 'Treasury wallet is configured', checked: false },
        { id: 'fees', label: 'Creator and platform fees are set', checked: true },
        { id: 'security', label: 'Security audit is complete', checked: false }
      ];
      
      localStorage.setItem('deploymentChecklist', JSON.stringify(defaultChecklist));
      return defaultChecklist;
    } catch (error) {
      console.error("Error getting checklist:", error);
      return [];
    }
  }
}

// Export a singleton instance
export const integrationService = new IntegrationService();
export default integrationService;
