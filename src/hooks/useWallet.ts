
import { useState, useEffect } from 'react';

interface PhantomProvider {
  connect: () => Promise<{ publicKey: { toString: () => string } }>;
  disconnect: () => Promise<void>;
  on: (event: string, callback: (args: any) => void) => void;
  isPhantom: boolean;
  isConnected: boolean;
  publicKey?: { toString: () => string };
}

declare global {
  interface Window {
    phantom?: {
      solana?: PhantomProvider;
    };
  }
}

export interface Wallet {
  address: string;
  balance: number;
  isConnected: boolean;
}

export const useWallet = () => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [provider, setProvider] = useState<PhantomProvider | null>(null);

  useEffect(() => {
    const checkProvider = async () => {
      if ("phantom" in window) {
        const provider = window.phantom?.solana;
        
        if (provider?.isPhantom) {
          setProvider(provider);
          
          // Check if already connected
          if (provider.isConnected && provider.publicKey) {
            try {
              const publicKey = provider.publicKey.toString();
              setWallet({
                address: publicKey,
                balance: 0, // Would fetch from Solana in real implementation
                isConnected: true
              });
            } catch (err) {
              console.error("Error setting initial wallet state:", err);
            }
          }
          
          // Listen for connection events
          provider.on('connect', (publicKey: { toString: () => string }) => {
            setWallet({
              address: publicKey.toString(),
              balance: 0,
              isConnected: true
            });
          });
          
          // Listen for disconnect events
          provider.on('disconnect', () => {
            setWallet(null);
          });
        }
      }
    };
    
    checkProvider();
    
    return () => {
      // Cleanup would happen here if needed
    };
  }, []);
  
  const connect = async () => {
    if (!provider) {
      throw new Error("Phantom wallet not installed");
    }
    
    setIsLoading(true);
    
    try {
      const response = await provider.connect();
      
      setWallet({
        address: response.publicKey.toString(),
        balance: 0, // Would fetch from Solana
        isConnected: true
      });
      
      return response;
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const disconnect = async () => {
    if (provider && wallet?.isConnected) {
      try {
        await provider.disconnect();
        setWallet(null);
      } catch (error) {
        console.error("Error disconnecting wallet:", error);
      }
    }
  };
  
  return {
    wallet,
    isLoading,
    connect,
    disconnect,
    hasProvider: !!provider
  };
};
