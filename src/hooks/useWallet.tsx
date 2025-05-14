
import React, { useState, useEffect, useContext, createContext } from "react";
import { toast } from "sonner";

// Wallet context type
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
    // If Phantom is available, use it as default; otherwise use mock
    if (window.solana && window.solana.isPhantom) {
      return connectPhantom();
    }
    
    // Fallback to mock connection if Phantom isn't available
    setIsConnecting(true);
    try {
      // Mock the connection
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
      
      console.log("Connecting to Phantom wallet...");
      
      try {
        // Actually connect to the wallet
        const response = await window.solana.connect();
        const address = response.publicKey.toString();
        console.log("Connected to Phantom wallet:", address);
        
        // Save the wallet address
        setWallet(address);
        localStorage.setItem("wybeWallet", address);
        toast.success("Phantom wallet connected!");
      } catch (err) {
        console.error("User rejected the connection", err);
        toast.error("Connection rejected. Please try again.");
      }
    } catch (error) {
      console.error("Failed to connect Phantom wallet:", error);
      toast.error("Failed to connect Phantom wallet. Please try again.");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    // If we have a Phantom connection, disconnect it
    if (window.solana && window.solana.isPhantom) {
      try {
        window.solana.disconnect();
      } catch (error) {
        console.error("Error disconnecting from Phantom:", error);
      }
    }
    
    // Clear local state
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
