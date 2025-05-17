import React, { useState, useEffect, useContext, createContext, useCallback } from "react";
import { toast } from "sonner";
import { useWeb3Modal, useWeb3ModalState, useWeb3ModalAccount, useDisconnect } from '@web3modal/ethers5/react';
import { ethers } from 'ethers';
import { configureWeb3Modal, WALLETCONNECT_PROJECT_ID } from '@/config/web3modal';

// Initialize Web3Modal configuration
// This should ideally be called once, e.g., in your app's entry point or a top-level component.
// However, to ensure it's configured before useWallet might be called, we can call it here.
// A better approach might be to initialize it in main.tsx or App.tsx.
if (typeof window !== 'undefined') {
  configureWeb3Modal();
}

export interface WalletContextType {
  wallet: string | null; // This will be the connected address
  isConnecting: boolean; // Reflects modal state or connection attempt
  connected: boolean;
  address: string; // Same as wallet
  provider: ethers.providers.Web3Provider | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>; // Updated to be async due to Web3Modal's disconnect
  // EVM specific, Solana related properties removed
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { open } = useWeb3Modal();
  const { address: web3ModalAddress, chainId, isConnected } = useWeb3ModalAccount();
  const { disconnect: web3ModalDisconnect } = useDisconnect();
  const { loading: web3ModalLoading } = useWeb3ModalState();
  
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);

  // Derive wallet state from Web3Modal hooks
  const address = web3ModalAddress || "";
  const connected = isConnected && !!web3ModalAddress;
  const wallet = connected ? web3ModalAddress : null;
  const isConnecting = web3ModalLoading;

  useEffect(() => {
    if (connected && typeof window.ethereum !== 'undefined') {
      try {
        const ethersProvider = new ethers.providers.Web3Provider(window.ethereum as any);
        setProvider(ethersProvider);
      } catch (e) {
        console.error("Error creating ethers provider:", e);
        setProvider(null);
        toast.error("Could not initialize wallet provider.");
      }
    } else if (connected && web3ModalAddress) {
        // Handle case where window.ethereum might not be immediately available
        // or for other provider types from WalletConnect
        // This part might need adjustment based on how Web3ModalProvider directly gives provider
        // Let's assume for now direct interaction isn't needed if not MetaMask.
        console.warn("Connected, but window.ethereum is not standard. Web3Modal should provide the provider.");
    }
    else {
      setProvider(null);
    }
  }, [connected, chainId, web3ModalAddress]); // Re-create provider if chainId changes or address appears

  const connect = useCallback(async () => {
    if (WALLETCONNECT_PROJECT_ID === "YOUR_WALLETCONNECT_PROJECT_ID") {
      toast.error("WalletConnect Project ID is not configured. Please set VITE_WALLETCONNECT_PROJECT_ID in your .env file.");
      console.error("Attempted to connect without VITE_WALLETCONNECT_PROJECT_ID set. Create a .env file with VITE_WALLETCONNECT_PROJECT_ID='your_project_id'.");
      return;
    }
    try {
      await open(); // Opens the Web3Modal
    } catch (error) {
      console.error("Failed to open Web3Modal:", error);
      toast.error("Could not open wallet connection modal. Please try again.");
    }
  }, [open]);

  const disconnect = useCallback(async () => {
    try {
      await web3ModalDisconnect();
      setProvider(null); // Clear provider on disconnect
      toast.success("Wallet disconnected");
      sessionStorage.removeItem('lastConnectedAddress'); // Clear session item on explicit disconnect
    } catch (error) {
      console.error("Failed to disconnect wallet:", error);
      toast.error("Failed to disconnect wallet. Please try again.");
    }
  }, [web3ModalDisconnect]);
  
  // Effect to show toast messages on connection/disconnection
  useEffect(() => {
    if (connected && web3ModalAddress) {
      // Avoid duplicate toasts if already connected from a previous session
      const lastConnectedAddress = sessionStorage.getItem('lastConnectedAddress');
      if(lastConnectedAddress !== web3ModalAddress) {
        toast.success(`Wallet connected: ${web3ModalAddress.substring(0,6)}...${web3ModalAddress.substring(web3ModalAddress.length - 4)}`);
        sessionStorage.setItem('lastConnectedAddress', web3ModalAddress);
      }
    } else if (!connected) {
      // Only remove if it was previously set, to avoid issues if it was never set.
      if (sessionStorage.getItem('lastConnectedAddress')) {
         // Disconnect toast is handled by the disconnect function now.
         // We might not need this else if block or adjust its logic
         // For now, let's keep removing it to ensure clean state.
        sessionStorage.removeItem('lastConnectedAddress');
      }
    }
  }, [connected, web3ModalAddress]);


  return (
    <WalletContext.Provider value={{ 
      wallet, 
      isConnecting, 
      connected,
      address,
      provider,
      connect, 
      disconnect,
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};
