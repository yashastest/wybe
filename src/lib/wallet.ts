
// This file centralizes wallet imports to ensure consistency across the project
export { useWallet, WalletProvider } from '@/hooks/useWallet.tsx';

// Re-export wallet types for convenience
export type { WalletContextType } from '@/hooks/useWallet.tsx';

// Export a Wallet type alias for convenience
export type Wallet = WalletContextType;
