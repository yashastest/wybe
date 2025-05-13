
import React, { useState, useEffect, useContext, createContext } from "react";
import { toast } from "sonner";

// Mock wallet context
interface WalletContextType {
  wallet: string | null;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Check local storage for previously connected wallet
    const savedWallet = localStorage.getItem("wybeWallet");
    if (savedWallet) {
      setWallet(savedWallet);
    }
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

  const disconnect = () => {
    setWallet(null);
    localStorage.removeItem("wybeWallet");
    toast.success("Wallet disconnected");
  };

  return (
    <WalletContext.Provider value={{ wallet, isConnecting, connect, disconnect }}>
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
