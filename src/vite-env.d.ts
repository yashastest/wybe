
/// <reference types="vite/client" />

interface Window {
  solana?: {
    isPhantom?: boolean;
    connect?: () => Promise<{ publicKey: { toString: () => string } }>;
    disconnect?: () => Promise<void>;
    signTransaction?: (transaction: any) => Promise<any>;
    signAllTransactions?: (transactions: any[]) => Promise<any[]>;
    request?: (request: { method: string; params?: any }) => Promise<any>;
    on?: (event: string, listener: (...args: any[]) => void) => void;
    off?: (event: string, listener: (...args: any[]) => void) => void;
    publicKey?: { toString: () => string };
  };
}
