
import React, { useState, useEffect, useContext, createContext } from "react";
import { toast } from "sonner";

// Wallet context type - Now exported
export interface WalletContextType {
  wallet: string | null;
  isConnecting: boolean;
  connected: boolean;
  address: string;
  connect: () => Promise<void>;
  disconnect: () => void;
  connectPhantom: () => Promise<void>;
  connectHardwareWallet: () => Promise<void>;
  isSolanaAvailable: boolean;
  isHardwareWallet: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSolanaAvailable, setIsSolanaAvailable] = useState(false);
  const [isHardwareWallet, setIsHardwareWallet] = useState(false);

  // Get address from wallet and determine connection status
  const connected = wallet !== null;
  const address = wallet || "";

  useEffect(() => {
    // Check local storage for previously connected wallet
    const savedWallet = localStorage.getItem("wybeWallet");
    const isHardwareWalletConnected = localStorage.getItem("wybeHardwareWallet") === "true";
    
    if (savedWallet) {
      setWallet(savedWallet);
      setIsHardwareWallet(isHardwareWalletConnected);
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
      setIsHardwareWallet(false);
      localStorage.setItem("wybeWallet", mockWallet);
      localStorage.setItem("wybeHardwareWallet", "false");
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
        setIsHardwareWallet(false);
        localStorage.setItem("wybeWallet", address);
        localStorage.setItem("wybeHardwareWallet", "false");
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

  const connectHardwareWallet = async () => {
    setIsConnecting(true);
    try {
      // Check if Phantom is installed
      if (!window.solana || !window.solana.isPhantom) {
        window.open("https://phantom.app/", "_blank");
        toast.error("Phantom wallet is not installed. Please install it first.");
        setIsConnecting(false);
        return;
      }
      
      console.log("Connecting hardware wallet through Phantom...");
      
      try {
        // In a real implementation, we would use Phantom's hardware wallet connection flow
        // For this demo, we simulate the hardware wallet connection
        toast.info("Please connect your hardware wallet and approve on the device...");
        
        // Simulate hardware wallet connection delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Generate a mock hardware wallet address (in reality, this would come from the hardware wallet)
        const hardwareWalletAddress = "Wyb" + "Hardware" + Math.random().toString(36).substring(2, 8);
        
        // Save the hardware wallet address
        setWallet(hardwareWalletAddress);
        setIsHardwareWallet(true);
        localStorage.setItem("wybeWallet", hardwareWalletAddress);
        localStorage.setItem("wybeHardwareWallet", "true");
        toast.success("Hardware wallet connected successfully!");
      } catch (err) {
        console.error("Hardware wallet connection failed", err);
        toast.error("Hardware wallet connection failed. Please try again.");
      }
    } catch (error) {
      console.error("Failed to connect hardware wallet:", error);
      toast.error("Failed to connect hardware wallet. Please try again.");
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
    setIsHardwareWallet(false);
    localStorage.removeItem("wybeWallet");
    localStorage.removeItem("wybeHardwareWallet");
    toast.success("Wallet disconnected");
  };

  return (
    <WalletContext.Provider value={{ 
      wallet, 
      isConnecting, 
      connect, 
      disconnect,
      connectPhantom,
      connectHardwareWallet,
      isSolanaAvailable,
      isHardwareWallet,
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
