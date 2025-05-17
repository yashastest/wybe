
// Re-exporting the WalletProvider and useWallet from the hooks
import { WalletProvider, useWallet, WalletContextType } from '@/hooks/useWallet'; // WalletContextType might have changed

export { WalletProvider, useWallet };
export type { WalletContextType }; // Ensure this type matches the one in useWallet.tsx

