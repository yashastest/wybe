
// This file centralizes wallet imports to ensure consistency across the project
export { useWallet, WalletProvider } from '@/hooks/useWallet';

// Re-export wallet types for convenience
export type { WalletContextType } from '@/hooks/useWallet';

// Export a Wallet type alias for convenience
export type Wallet = {
  wallet: string | null;
  isConnecting: boolean;
  connected: boolean;
  address: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  connectPhantom: () => Promise<void>;
  connectHardwareWallet: () => Promise<void>;
  isSolanaAvailable: boolean;
  isHardwareWallet: boolean;
};
