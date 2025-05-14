// Integration service file to connect frontend with smart contracts

// Import any required dependencies
import { toast } from "sonner";
import { setMockAnchorStatus as setMockAnchor } from "@/scripts/anchorBuild";

// Type definitions for treasury wallets
export interface TreasuryWallet {
  id: string;
  name: string;
  address: string;
  balance: number;
  network: string;
  isPrimary: boolean;
  createdAt: number;
  isMultisig?: boolean;
  signers?: string[];
  threshold?: number;
  tokenBalance?: {
    symbol: string;
    amount: number;
  }[];
}

// Type definitions for transaction history
export interface TransactionHistory {
  id: string;
  type: 'mint' | 'burn' | 'transfer' | 'swap' | 'claim' | 'fee' | 'fee_claim' | 'deposit' | 'withdraw' | 'unknown';
  from: string;
  to: string;
  amount: number;
  tokenSymbol?: string;
  timestamp: number;
  hash?: string;
  status: 'pending' | 'confirmed' | 'failed';
  details?: any;
}

// Type definition for token trade details
export interface TokenTradeDetails {
  symbol: string;
  name: string;
  tradingVolume: number;
  marketCap: number;
  holders: number;
  creator: string;
  programId: string;
  lastClaimDate?: number;
  nextClaimAvailable?: number;
}

// Type definition for deployment environment
export interface DeploymentEnvironment {
  name: string;
  url: string;
  programIds?: string[];
  deploymentDate?: number;
  network: 'mainnet' | 'testnet' | 'devnet' | 'localnet';
  status: 'active' | 'inactive' | 'deprecated';
}

// Admin user access control interface
export interface AdminUserAccess {
  email: string;
  role: 'superadmin' | 'admin' | 'manager' | 'viewer';
  permissions: string[];
  walletAddress?: string;
  twoFactorEnabled?: boolean;
}

class IntegrationService {
  // Store treasury wallets
  private treasuryWallets: TreasuryWallet[] = [];
  
  // Store transaction history
  private transactionHistory: TransactionHistory[] = [];
  
  // Admin users list
  private adminUsers: AdminUserAccess[] = [];
  
  // Token trade details
  private tokenTradeDetails: Record<string, TokenTradeDetails> = {};
  
  // Deployment checklist
  private deploymentChecklist: { id: string; label: string; checked: boolean }[] = [];
  
  constructor() {
    this.initializeData();
    
    // Initialize sample tokens for testing
    this.initializeTestTokens();
  }
  
  // Initialize data from localStorage or set defaults
  private initializeData(): void {
    // Check for existing treasury wallets
    const storedWallets = localStorage.getItem('treasuryWallets');
    if (storedWallets) {
      this.treasuryWallets = JSON.parse(storedWallets);
    } else {
      // Initialize with some sample wallets
      this.treasuryWallets = [
        {
          id: 'primary-treasury',
          name: 'Primary Treasury',
          address: '8JzqrG4pQSSA7QuQeEjbDxKLBMqKriGCNzUL7Lxpk8iD',
          balance: 45.32,
          network: 'mainnet',
          isPrimary: true,
          createdAt: Date.now()
        },
        {
          id: 'dev-treasury',
          name: 'Development Fund',
          address: '9YmLrwRiYQBJiruKjtLzGMC5KPBgCVCL3MxEMVLZi2xU',
          balance: 12.75,
          network: 'mainnet',
          isPrimary: false,
          createdAt: Date.now() - 86400000
        },
        {
          id: 'marketing-treasury',
          name: 'Marketing Fund',
          address: 'Fq9zJLs8N8yTLAh8KNkRFGrTX2vgbs3kkGZtHzR4e7WS',
          balance: 8.45,
          network: 'mainnet',
          isPrimary: false,
          createdAt: Date.now() - 172800000
        },
        {
          id: 'testnet-treasury',
          name: 'Testnet Treasury',
          address: 'EBawT33d6ug1nRpTxGnYYzbUXh6UEaUXW9CxQnRtHZJL',
          balance: 32.18,
          network: 'testnet',
          isPrimary: false,
          createdAt: Date.now() - 259200000
        }
      ];
      localStorage.setItem('treasuryWallets', JSON.stringify(this.treasuryWallets));
    }
    
    // Check for transaction history
    const storedHistory = localStorage.getItem('transactionHistory');
    if (storedHistory) {
      this.transactionHistory = JSON.parse(storedHistory);
    } else {
      // Initialize with some sample transactions
      this.transactionHistory = [
        {
          id: `tx-${Date.now() - 3600000}`,
          type: 'mint',
          from: 'Token Creator',
          to: 'Primary Treasury',
          amount: 1000000,
          tokenSymbol: 'WYBE',
          timestamp: Date.now() - 3600000,
          hash: `tx_${(Date.now() - 3600000).toString(16)}`,
          status: 'confirmed'
        },
        {
          id: `tx-${Date.now() - 7200000}`,
          type: 'transfer',
          from: 'Primary Treasury',
          to: 'Marketing Fund',
          amount: 50000,
          tokenSymbol: 'WYBE',
          timestamp: Date.now() - 7200000,
          hash: `tx_${(Date.now() - 7200000).toString(16)}`,
          status: 'confirmed'
        },
        {
          id: `tx-${Date.now() - 10800000}`,
          type: 'fee',
          from: 'Trading Pool',
          to: 'Primary Treasury',
          amount: 2.5,
          tokenSymbol: 'SOL',
          timestamp: Date.now() - 10800000,
          hash: `tx_${(Date.now() - 10800000).toString(16)}`,
          status: 'confirmed'
        }
      ];
      localStorage.setItem('transactionHistory', JSON.stringify(this.transactionHistory));
    }
    
    // Check for token trade details
    const storedTokenDetails = localStorage.getItem('tokenTradeDetails');
    if (storedTokenDetails) {
      this.tokenTradeDetails = JSON.parse(storedTokenDetails);
    }
    
    // Check for admin users
    const storedAdminUsers = localStorage.getItem('adminUsers');
    if (storedAdminUsers) {
      this.adminUsers = JSON.parse(storedAdminUsers);
    } else {
      // Initialize with a default admin user
      this.adminUsers = [
        {
          email: 'admin@wybe.io',
          role: 'superadmin',
          permissions: ['all'],
          walletAddress: '',
          twoFactorEnabled: false
        }
      ];
      localStorage.setItem('adminUsers', JSON.stringify(this.adminUsers));
    }
    
    // Initialize checklist if not already done
    const storedChecklist = localStorage.getItem('deploymentChecklist');
    if (storedChecklist) {
      this.deploymentChecklist = JSON.parse(storedChecklist);
    } else {
      // Default deployment checklist
      this.deploymentChecklist = [
        { id: '1', label: 'Repository setup and configuration', checked: true },
        { id: '2', label: 'Anchor CLI installation', checked: true },
        { id: '3', label: 'Contract builds without errors', checked: false },
        { id: '4', label: 'Contract passes test suite', checked: false },
        { id: '5', label: 'Security audit completed', checked: false },
        { id: '6', label: 'Gas optimization review completed', checked: false },
        { id: '7', label: 'Treasury wallet configured', checked: false },
        { id: '8', label: 'Fee parameters confirmed', checked: false },
        { id: '9', label: 'Testnet deployment successful', checked: false },
        { id: '10', label: 'Testnet functionality verified', checked: false },
        { id: '11', label: 'Deployment keys generated', checked: false },
        { id: '12', label: 'Deployment keys secured', checked: false },
        { id: '13', label: 'Final review by team', checked: false }
      ];
      localStorage.setItem('deploymentChecklist', JSON.stringify(this.deploymentChecklist));
    }
  }
  
  // Initialize test tokens
  private initializeTestTokens(): void {
    // Only initialize if not already present
    if (Object.keys(this.tokenTradeDetails).length === 0) {
      this.tokenTradeDetails = {
        'wybe': {
          symbol: 'WYBE',
          name: 'Wybe Token',
          tradingVolume: 25000,
          marketCap: 500000,
          holders: 120,
          creator: '8JzqrG4pQSSA7QuQeEjbDxKLBMqKriGCNzUL7Lxpk8iD',
          programId: 'Wyb1111111111111111111111111111111111111111',
          lastClaimDate: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
          nextClaimAvailable: Date.now() - 2 * 24 * 60 * 60 * 1000 // 2 days ago (eligible to claim)
        },
        'pepe': {
          symbol: 'PEPE',
          name: 'Pepe Token',
          tradingVolume: 15000,
          marketCap: 250000,
          holders: 85,
          creator: '9YmLrwRiYQBJiruKjtLzGMC5KPBgCVCL3MxEMVLZi2xU',
          programId: 'Wyb222222222222222222222222222222222222222'
        },
        'degen': {
          symbol: 'DEGEN',
          name: 'Degen Token',
          tradingVolume: 35000,
          marketCap: 750000,
          holders: 210,
          creator: '8JzqrG4pQSSA7QuQeEjbDxKLBMqKriGCNzUL7Lxpk8iD',
          programId: 'Wyb333333333333333333333333333333333333333'
        }
      };
      localStorage.setItem('tokenTradeDetails', JSON.stringify(this.tokenTradeDetails));
    }
  }
  
  // Get all treasury wallets
  public getTreasuryWallets(): TreasuryWallet[] {
    return this.treasuryWallets;
  }
  
  // Get a specific treasury wallet
  public getTreasuryWallet(id: string): TreasuryWallet | undefined {
    return this.treasuryWallets.find(wallet => wallet.id === id);
  }
  
  // Get primary treasury wallet
  public getPrimaryTreasuryWallet(): TreasuryWallet | undefined {
    return this.treasuryWallets.find(wallet => wallet.isPrimary);
  }
  
  // Add a new treasury wallet
  public addTreasuryWallet(wallet: Omit<TreasuryWallet, 'id' | 'createdAt'>): TreasuryWallet {
    const newWallet: TreasuryWallet = {
      ...wallet,
      id: `wallet-${Date.now()}`,
      createdAt: Date.now()
    };
    
    // If this is the first wallet, make it primary
    if (this.treasuryWallets.length === 0) {
      newWallet.isPrimary = true;
    }
    
    // If adding a new primary wallet, update others
    if (newWallet.isPrimary) {
      this.treasuryWallets.forEach(w => {
        w.isPrimary = false;
      });
    }
    
    // Add to array
    this.treasuryWallets.push(newWallet);
    
    // Save to localStorage
    localStorage.setItem('treasuryWallets', JSON.stringify(this.treasuryWallets));
    
    return newWallet;
  }
  
  // Set mock Anchor status for testing
  public setMockAnchorStatus(installed: boolean, version: string = '0.26.0'): void {
    // Use the function from the script
    setMockAnchor(installed, version);
  }
  
  // Transfer between treasury wallets
  public transferBetweenTreasuryWallets(
    fromWalletId: string,
    toWalletId: string,
    amount: number,
    token: string = 'SOL'
  ): boolean {
    // Find wallets
    const fromIndex = this.treasuryWallets.findIndex(w => w.id === fromWalletId);
    const toIndex = this.treasuryWallets.findIndex(w => w.id === toWalletId);
    
    // Validate wallets exist
    if (fromIndex === -1 || toIndex === -1) {
      return false;
    }
    
    // Validate sufficient funds
    if (this.treasuryWallets[fromIndex].balance < amount) {
      return false;
    }
    
    // Execute transfer
    this.treasuryWallets[fromIndex].balance -= amount;
    this.treasuryWallets[toIndex].balance += amount;
    
    // Save to localStorage
    localStorage.setItem('treasuryWallets', JSON.stringify(this.treasuryWallets));
    
    // Record transaction
    const txId = `transfer-${Date.now()}`;
    this.recordTransaction({
      id: txId,
      type: 'transfer',
      from: this.treasuryWallets[fromIndex].name,
      to: this.treasuryWallets[toIndex].name,
      amount,
      tokenSymbol: token,
      timestamp: Date.now(),
      status: 'confirmed',
      hash: `tx_${Date.now().toString(16)}`
    });
    
    return true;
  }
  
  // Update treasury wallet settings
  public updateTreasuryWallet(
    walletId: string,
    updates: Partial<Omit<TreasuryWallet, 'id' | 'createdAt'>>
  ): boolean {
    // Find wallet
    const walletIndex = this.treasuryWallets.findIndex(w => w.id === walletId);
    
    // Validate wallet exists
    if (walletIndex === -1) {
      return false;
    }
    
    // If setting as primary, update other wallets
    if (updates.isPrimary) {
      this.treasuryWallets.forEach((w, i) => {
        if (i !== walletIndex) {
          w.isPrimary = false;
        }
      });
    }
    
    // Update wallet
    this.treasuryWallets[walletIndex] = {
      ...this.treasuryWallets[walletIndex],
      ...updates
    };
    
    // Save to localStorage
    localStorage.setItem('treasuryWallets', JSON.stringify(this.treasuryWallets));
    
    return true;
  }
  
  // Get transaction history
  public getTransactionHistory(): TransactionHistory[] {
    return this.transactionHistory;
  }
  
  // Record a new transaction
  public recordTransaction(transaction: TransactionHistory): string {
    const txId = transaction.id || transaction.hash || `tx-${Date.now()}`;
    
    // If id is not provided in transaction, add it
    if (!transaction.id) {
      transaction.id = txId;
    }
    
    // Add to array
    this.transactionHistory.unshift(transaction);
    
    // Save to localStorage
    localStorage.setItem('transactionHistory', JSON.stringify(this.transactionHistory));
    
    return txId;
  }
  
  // Get transaction by ID
  public getTransaction(id: string): TransactionHistory | undefined {
    return this.transactionHistory.find(tx => tx.id === id || tx.hash === id);
  }
  
  // Get admin users
  public getAdminUsers(requesterWalletAddress: string): AdminUserAccess[] {
    // In a real implementation, you would validate if the requester has permission
    // For demo purposes, just return the list
    return this.adminUsers;
  }
  
  // Add a new admin user
  public addAdminUser(user: AdminUserAccess, requesterWalletAddress: string): boolean {
    // Check if user already exists
    const existingUserIndex = this.adminUsers.findIndex(u => u.email === user.email);
    if (existingUserIndex >= 0) {
      return false;
    }
    
    // In a real implementation, validate requester permissions
    
    // Add the new user
    this.adminUsers.push(user);
    
    // Save to localStorage
    localStorage.setItem('adminUsers', JSON.stringify(this.adminUsers));
    
    return true;
  }
  
  // Update admin user permissions
  public updateAdminUserPermissions(
    email: string,
    role: AdminUserAccess['role'],
    permissions: string[],
    requesterWalletAddress: string
  ): boolean {
    // Find user
    const userIndex = this.adminUsers.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
      return false;
    }
    
    // In a real implementation, validate requester permissions
    
    // Update user
    this.adminUsers[userIndex].role = role;
    this.adminUsers[userIndex].permissions = permissions;
    
    // Save to localStorage
    localStorage.setItem('adminUsers', JSON.stringify(this.adminUsers));
    
    return true;
  }
  
  // Remove an admin user
  public removeAdminUser(email: string, requesterWalletAddress: string): boolean {
    // Find user
    const userIndex = this.adminUsers.findIndex(u => u.email === email);
    
    if (userIndex === -1) {
      return false;
    }
    
    // In a real implementation, validate requester permissions
    
    // Remove user
    this.adminUsers.splice(userIndex, 1);
    
    // Save to localStorage
    localStorage.setItem('adminUsers', JSON.stringify(this.adminUsers));
    
    return true;
  }

  // Remove a treasury wallet
  public removeTreasuryWallet(walletId: string): boolean {
    const walletIndex = this.treasuryWallets.findIndex(w => w.id === walletId);
    if (walletIndex === -1) {
      return false;
    }

    // Remove the wallet
    this.treasuryWallets.splice(walletIndex, 1);
    
    // Save to localStorage
    localStorage.setItem('treasuryWallets', JSON.stringify(this.treasuryWallets));
    
    return true;
  }

  // Update checklist item
  public updateChecklistItem(id: string, checked: boolean): boolean {
    const itemIndex = this.deploymentChecklist.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return false;
    }
    
    this.deploymentChecklist[itemIndex].checked = checked;
    
    // Save to localStorage
    localStorage.setItem('deploymentChecklist', JSON.stringify(this.deploymentChecklist));
    
    return true;
  }

  // Deploy full environment
  public deployFullEnvironment(
    name: string, 
    network: 'mainnet' | 'testnet' | 'devnet' | 'localnet'
  ): Promise<DeploymentEnvironment> {
    return new Promise((resolve) => {
      // Simulate deployment delay
      setTimeout(() => {
        const newEnvironment: DeploymentEnvironment = {
          name,
          url: `https://${network}.wybe.io/${name.toLowerCase().replace(/\s+/g, '-')}`,
          programIds: [
            `Wyb${Math.random().toString(16).substring(2, 10)}111111111111111111111111111`,
            `Wyb${Math.random().toString(16).substring(2, 10)}222222222222222222222222222`
          ],
          deploymentDate: Date.now(),
          network,
          status: 'active'
        };
        
        // In a real implementation, would save to backend
        // For demo, resolve with the new environment
        resolve(newEnvironment);
      }, 2000);
    });
  }
  
  // Get token trade details
  public getTokenTradeDetails(symbol: string): TokenTradeDetails | undefined {
    const normalizedSymbol = symbol.toLowerCase();
    return this.tokenTradeDetails[normalizedSymbol];
  }
  
  // Get all token trade details
  public getAllTokenTradeDetails(): TokenTradeDetails[] {
    return Object.values(this.tokenTradeDetails);
  }
  
  // Update token claim date
  public updateTokenClaimDate(symbol: string, creatorAddress: string): boolean {
    const normalizedSymbol = symbol.toLowerCase();
    if (!this.tokenTradeDetails[normalizedSymbol]) {
      return false;
    }
    
    // Verify the creator address
    if (this.tokenTradeDetails[normalizedSymbol].creator !== creatorAddress) {
      return false;
    }
    
    // Update claim dates
    const now = Date.now();
    this.tokenTradeDetails[normalizedSymbol].lastClaimDate = now;
    // Next claim in 5 days
    this.tokenTradeDetails[normalizedSymbol].nextClaimAvailable = now + 5 * 24 * 60 * 60 * 1000;
    
    // Save to localStorage
    localStorage.setItem('tokenTradeDetails', JSON.stringify(this.tokenTradeDetails));
    
    return true;
  }
  
  // Check if creator can claim fees
  public canCreatorClaimFees(symbol: string, creatorAddress: string): {
    canClaim: boolean;
    nextClaimTime?: number;
    reason?: string;
  } {
    const normalizedSymbol = symbol.toLowerCase();
    const token = this.tokenTradeDetails[normalizedSymbol];
    
    if (!token) {
      return { canClaim: false, reason: "Token not found" };
    }
    
    // Verify the creator address
    if (token.creator !== creatorAddress) {
      return { canClaim: false, reason: "Not the token creator" };
    }
    
    // If never claimed before, can claim immediately
    if (!token.lastClaimDate) {
      return { canClaim: true };
    }
    
    const now = Date.now();
    // If next claim time is set and it's in the future
    if (token.nextClaimAvailable && token.nextClaimAvailable > now) {
      return {
        canClaim: false,
        nextClaimTime: token.nextClaimAvailable,
        reason: `Next claim available in ${Math.ceil((token.nextClaimAvailable - now) / (24 * 60 * 60 * 1000))} days`
      };
    }
    
    // Can claim
    return { canClaim: true };
  }
  
  // Execute a token trade
  public async executeTokenTrade(
    tokenSymbol: string,
    sellerAddress: string,
    buyerAddress: string,
    amount: number,
    price: number
  ): Promise<{ success: boolean; txHash?: string }> {
    try {
      // Calculate trade value
      const tradeValue = amount * price;
      
      // Get token
      const normalizedSymbol = tokenSymbol.toLowerCase();
      let token = this.tokenTradeDetails[normalizedSymbol];
      
      // If token doesn't exist, create a placeholder
      if (!token) {
        token = {
          symbol: tokenSymbol.toUpperCase(),
          name: `${tokenSymbol.toUpperCase()} Token`,
          tradingVolume: 0,
          marketCap: amount * price,
          holders: 2, // Seller and buyer
          creator: sellerAddress,
          programId: `Wyb${Math.random().toString(16).substring(2, 10)}111111111111111111111111111`
        };
        this.tokenTradeDetails[normalizedSymbol] = token;
      }
      
      // Update trading volume
      token.tradingVolume += tradeValue;
      
      // Generate tx hash
      const txHash = `trade_${Date.now().toString(16)}_${tokenSymbol.toLowerCase()}`;
      
      // Record the transaction
      this.recordTransaction({
        type: 'transfer',
        from: sellerAddress,
        to: buyerAddress,
        amount: amount,
        tokenSymbol: tokenSymbol.toUpperCase(),
        timestamp: Date.now(),
        hash: txHash,
        status: 'confirmed',
        details: {
          price: price,
          tradeValue: tradeValue
        }
      });
      
      // Save updated token data
      localStorage.setItem('tokenTradeDetails', JSON.stringify(this.tokenTradeDetails));
      
      return {
        success: true,
        txHash
      };
    } catch (error) {
      console.error("Error executing token trade:", error);
      return {
        success: false
      };
    }
  }
  
  // Mint tokens
  public mintTokens(
    tokenSymbol: string,
    creatorAddress: string,
    recipientAddress: string,
    amount: number
  ): { success: boolean; txHash?: string } {
    try {
      // Calculate treasury amount (1% of minted tokens)
      const treasuryAmount = Math.floor(amount * 0.01);
      const recipientAmount = amount - treasuryAmount;
      
      const primaryTreasury = this.getPrimaryTreasuryWallet();
      
      if (!primaryTreasury) {
        return { success: false };
      }
      
      // Generate tx hash
      const txHash = `mint_${Date.now().toString(16)}_${tokenSymbol.toLowerCase()}`;
      
      // Record transaction to recipient
      this.recordTransaction({
        type: 'mint',
        from: creatorAddress,
        to: recipientAddress,
        amount: recipientAmount,
        tokenSymbol: tokenSymbol.toUpperCase(),
        timestamp: Date.now(),
        hash: txHash,
        status: 'confirmed',
        details: {
          mint_type: 'recipient_allocation'
        }
      });
      
      // Record transaction to treasury
      this.recordTransaction({
        type: 'mint',
        from: creatorAddress,
        to: primaryTreasury.name,
        amount: treasuryAmount,
        tokenSymbol: tokenSymbol.toUpperCase(),
        timestamp: Date.now(),
        hash: `${txHash}_treasury`,
        status: 'confirmed',
        details: {
          mint_type: 'treasury_allocation'
        }
      });
      
      // Get or initialize token
      const normalizedSymbol = tokenSymbol.toLowerCase();
      let token = this.tokenTradeDetails[normalizedSymbol];
      
      if (!token) {
        token = {
          symbol: tokenSymbol.toUpperCase(),
          name: `${tokenSymbol.toUpperCase()} Token`,
          tradingVolume: 0,
          marketCap: amount * 0.01, // Initial price estimation
          holders: 2, // Creator and treasury
          creator: creatorAddress,
          programId: `Wyb${Math.random().toString(16).substring(2, 10)}111111111111111111111111111`
        };
        this.tokenTradeDetails[normalizedSymbol] = token;
        
        // Save updated token data
        localStorage.setItem('tokenTradeDetails', JSON.stringify(this.tokenTradeDetails));
      }
      
      return {
        success: true,
        txHash
      };
    } catch (error) {
      console.error("Error minting tokens:", error);
      return {
        success: false
      };
    }
  }
  
  // Get deployment checklist
  public getDeploymentChecklist(): { id: string; label: string; checked: boolean }[] {
    return this.deploymentChecklist;
  }
  
  // Update deployment checklist item
  public updateDeploymentChecklistItem(id: string, checked: boolean): boolean {
    const itemIndex = this.deploymentChecklist.findIndex(item => item.id === id);
    
    if (itemIndex === -1) {
      return false;
    }
    
    this.deploymentChecklist[itemIndex].checked = checked;
    
    // Save to localStorage
    localStorage.setItem('deploymentChecklist', JSON.stringify(this.deploymentChecklist));
    
    return true;
  }
}

// Export singleton instance
export const integrationService = new IntegrationService();
export default integrationService;
