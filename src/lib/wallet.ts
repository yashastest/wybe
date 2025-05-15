
// This file centralizes wallet imports to ensure consistency across the project
export { useWallet, WalletProvider, WalletContextType } from '@/hooks/useWallet.tsx';

// Re-export wallet types for convenience
export type { WalletContextType as Wallet } from '@/hooks/useWallet.tsx';
