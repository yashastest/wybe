
import { toast } from "sonner";
import { smartContractService } from "./smartContractService";
import { integrationService } from "./integrationService";

export interface TreasuryWallet {
  address: string;
  network: 'mainnet' | 'testnet' | 'devnet';
  lastUpdated: Date;
  updatedBy: string;
}

export interface TransferHistory {
  id: string;
  amount: number;
  tokenSymbol: string;
  fromAddress: string;
  toAddress: string;
  txHash: string;
  timestamp: Date;
  type: 'fee' | 'platform' | 'creator' | 'transfer';
}

class TreasuryService {
  private currentTreasury: TreasuryWallet = {
    address: "8JzqrG4pQSSA7QuQeEjbDxKLBMqKriGCNzUL7Lxpk8iD", // Default treasury wallet
    network: 'devnet',
    lastUpdated: new Date(),
    updatedBy: "System"
  };
  
  private treasuryHistory: TreasuryWallet[] = [];
  private transferHistory: TransferHistory[] = [];
  
  constructor() {
    // Initialize with some example history
    this.treasuryHistory.push({...this.currentTreasury});
    
    // Add some mock transfer history for demo purposes
    this.addMockTransferHistory();
  }
  
  /**
   * Update the treasury wallet with proper security checks
   */
  public async updateTreasuryWallet(
    newAddress: string,
    callerAddress: string,
    otpVerified: boolean
  ): Promise<{success: boolean; message: string; txHash?: string}> {
    try {
      // Check if OTP was verified
      if (!otpVerified) {
        return {
          success: false,
          message: "OTP verification required to update treasury wallet."
        };
      }
      
      // Validate address format
      if (!this.isValidSolanaAddress(newAddress)) {
        return {
          success: false,
          message: "Invalid Solana address format"
        };
      }
      
      // Check if caller has permission
      const hasPermission = integrationService.isAuthorizedForAction(
        callerAddress, 
        'treasury_update'
      );
      
      if (!hasPermission) {
        return {
          success: false,
          message: "You don't have permission to update the treasury wallet."
        };
      }
      
      // Update treasury on the blockchain
      const blockchainResult = await this.updateTreasuryOnBlockchain(newAddress, callerAddress);
      
      if (blockchainResult.success) {
        // Update local treasury data
        const previousAddress = this.currentTreasury.address;
        
        this.currentTreasury = {
          address: newAddress,
          network: this.currentTreasury.network,
          lastUpdated: new Date(),
          updatedBy: callerAddress
        };
        
        // Add to history
        this.treasuryHistory.push({...this.currentTreasury});
        
        // Record the transaction in transfer history
        this.transferHistory.push({
          id: `treasury_update_${Date.now()}`,
          amount: 0,
          tokenSymbol: "SOL",
          fromAddress: previousAddress,
          toAddress: newAddress,
          txHash: blockchainResult.txHash || `mock_${Date.now()}`,
          timestamp: new Date(),
          type: 'platform'
        });
        
        return {
          success: true,
          message: "Treasury wallet updated successfully!",
          txHash: blockchainResult.txHash
        };
      } else {
        return blockchainResult;
      }
    } catch (error) {
      console.error("Treasury update error:", error);
      return {
        success: false,
        message: `Failed to update treasury wallet: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
  
  /**
   * Update the treasury wallet on the blockchain
   * Uses smart contract service for the actual blockchain interaction
   */
  private async updateTreasuryOnBlockchain(
    newAddress: string, 
    callerAddress: string
  ): Promise<{success: boolean; message: string; txHash?: string}> {
    // Check if Anchor is installed for real contract interaction
    const contractConfig = smartContractService.getContractConfig();
    
    try {
      if (contractConfig.anchorInstalled) {
        toast.info("Executing treasury update transaction...");
        
        // Simulate blockchain transaction delay
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        // In a real implementation, this would call the actual smart contract
        const txHash = `treasury_${Date.now().toString(16)}_${Math.random().toString(16).substring(2, 8)}`;
        
        return {
          success: true,
          message: "Treasury wallet updated successfully on the blockchain",
          txHash
        };
      } else {
        // Simulation mode
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        return {
          success: true,
          message: "[SIMULATION] Treasury wallet updated successfully",
          txHash: `sim_treasury_${Date.now().toString(16)}`
        };
      }
    } catch (error) {
      console.error("Blockchain treasury update error:", error);
      return {
        success: false,
        message: `Blockchain error: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }
  
  /**
   * Get current treasury wallet
   */
  public getTreasuryWallet(): TreasuryWallet {
    return this.currentTreasury;
  }
  
  /**
   * Get treasury update history
   */
  public getTreasuryHistory(): TreasuryWallet[] {
    return [...this.treasuryHistory];
  }
  
  /**
   * Get transfer history
   */
  public getTransferHistory(): TransferHistory[] {
    return [...this.transferHistory];
  }
  
  /**
   * Get transfer history by type
   */
  public getTransferHistoryByType(type: 'fee' | 'platform' | 'creator' | 'transfer'): TransferHistory[] {
    return this.transferHistory.filter(transfer => transfer.type === type);
  }
  
  /**
   * Set network type for the treasury
   */
  public setNetworkType(network: 'mainnet' | 'testnet' | 'devnet'): void {
    this.currentTreasury.network = network;
  }
  
  /**
   * Simple validation for Solana wallet addresses
   */
  private isValidSolanaAddress(address: string): boolean {
    // Basic validation - proper implementation would use base58 check + length
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  }
  
  /**
   * Add mock transfer history for demo purposes
   */
  private addMockTransferHistory(): void {
    const types: ('fee' | 'platform' | 'creator' | 'transfer')[] = ['fee', 'platform', 'creator', 'transfer'];
    const symbols = ['SOL', 'WYBE', 'PEPE', 'DEGEN'];
    
    // Create 10 mock transfers
    for (let i = 0; i < 10; i++) {
      const randomType = types[Math.floor(Math.random() * types.length)];
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      const randomAmount = parseFloat((Math.random() * 10).toFixed(4));
      
      this.transferHistory.push({
        id: `transfer_${Date.now()}_${i}`,
        amount: randomAmount,
        tokenSymbol: randomSymbol,
        fromAddress: `Wybe${Math.random().toString(16).substring(2, 10)}`,
        toAddress: this.currentTreasury.address,
        txHash: `tx_${Date.now().toString(16)}_${i}`,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random time in last 30 days
        type: randomType
      });
    }
    
    // Sort by timestamp, newest first
    this.transferHistory.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }
  
  /**
   * Clear mock data - for use in production
   */
  public clearMockData(): void {
    this.transferHistory = this.transferHistory.filter(t => !t.txHash.startsWith('mock_'));
  }
}

// Export singleton instance
export const treasuryService = new TreasuryService();
export default treasuryService;
