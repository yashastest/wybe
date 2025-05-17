
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
  const { loading: web3ModalLoading, open: modalOpen } = useWeb3ModalState();
  
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
    } else {
      setProvider(null);
    }
  }, [connected, chainId]); // Re-create provider if chainId changes

  const connect = useCallback(async () => {
    if (WALLETCONNECT_PROJECT_ID === "YOUR_WALLETCONNECT_PROJECT_ID") {
      toast.error("WalletConnect Project ID is not configured. Please ask the developer to set it up.");
      console.error("Attempted to connect without WALLETCONNECT_PROJECT_ID set.");
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
    } else if (!connected && sessionStorage.getItem('lastConnectedAddress')) {
      // This logic might fire too often if isConnected flickers.
      // The disconnect function already shows a toast.
      sessionStorage.removeItem('lastConnectedAddress');
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

