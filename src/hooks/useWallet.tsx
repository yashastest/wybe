
import React, { useState, useEffect, useContext, createContext } from "react";
import { toast } from "sonner";

// Mock wallet context
interface WalletContextType {
  wallet: string | null;
  isConnecting: boolean;
  connected: boolean;
  address: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  connectPhantom: () => Promise<void>;
  isSolanaAvailable: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSolanaAvailable, setIsSolanaAvailable] = useState(false);

  // Get address from wallet and determine connection status
  const connected = wallet !== null;
  const address = wallet || "";

  useEffect(() => {
    // Check local storage for previously connected wallet
    const savedWallet = localStorage.getItem("wybeWallet");
    if (savedWallet) {
      setWallet(savedWallet);
    }
    
    // Check if Phantom/Solana is available
    const checkSolana = () => {
      const isPhantomAvailable = window.solana && window.solana.isPhantom;
      setIsSolanaAvailable(!!isPhantomAvailable);
    };
    
    checkSolana();
    
    // In a real integration, we would listen for account changes here
    const interval = setInterval(checkSolana, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const connect = async () => {
    setIsConnecting(true);
    try {
      // In a real app, this would call the Phantom/Solflare wallet adapter
      // For now, we'll mock the connection
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Generate a mock wallet address
      const mockWallet = "Wybe" + Math.random().toString(36).substring(2, 10);
      
      setWallet(mockWallet);
      localStorage.setItem("wybeWallet", mockWallet);
      toast.success("Wallet connected successfully!");
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast.error("Failed to connect wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  const connectPhantom = async () => {
    setIsConnecting(true);
    try {
      // Check if Phantom is installed
      if (!window.solana || !window.solana.isPhantom) {
        window.open("https://phantom.app/", "_blank");
        toast.error("Phantom wallet is not installed. Please install it first.");
        setIsConnecting(false);
        return;
      }
      
      // In a real app, this would request connection to the Phantom wallet
      // For demonstration, we'll simulate it
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // In a real app, we would get the connected wallet from Phantom
      const phantomWallet = "Phantom" + Math.random().toString(36).substring(2, 10);
      
      setWallet(phantomWallet);
      localStorage.setItem("wybeWallet", phantomWallet);
      toast.success("Phantom wallet connected!");
    } catch (error) {
      console.error("Failed to connect Phantom wallet:", error);
      toast.error("Failed to connect Phantom wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setWallet(null);
    localStorage.removeItem("wybeWallet");
    toast.success("Wallet disconnected");
  };

  return (
    <WalletContext.Provider value={{ 
      wallet, 
      isConnecting, 
      connect, 
      disconnect,
      connectPhantom,
      isSolanaAvailable,
      connected,
      address
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
