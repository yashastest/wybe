
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface WalletContextProps {
  address: string | null;
  connected: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  wallet: string | null;
  connecting: boolean;
}

const WalletContext = createContext<WalletContextProps>({
  address: null,
  connected: false,
  connect: async () => {},
  disconnect: () => {},
  wallet: null,
  connecting: false,
});

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [connecting, setConnecting] = useState<boolean>(false);

  // Demo wallet connection function
  const connect = async (): Promise<void> => {
    setConnecting(true);
    
    try {
      // Simulate wallet connection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock address
      const mockAddress = '0x' + Math.random().toString(16).slice(2, 12);
      setAddress(mockAddress);
      setConnected(true);
      
      // Store in session storage for persistence
      sessionStorage.setItem('wallet', mockAddress);
      sessionStorage.setItem('connected', 'true');
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = (): void => {
    setAddress(null);
    setConnected(false);
    sessionStorage.removeItem('wallet');
    sessionStorage.removeItem('connected');
  };

  // Check for existing wallet connection on component mount
  useEffect(() => {
    const storedWallet = sessionStorage.getItem('wallet');
    const storedConnected = sessionStorage.getItem('connected');
    
    if (storedWallet && storedConnected === 'true') {
      setAddress(storedWallet);
      setConnected(true);
    }
  }, []);

  return (
    <WalletContext.Provider value={{
      address,
      connected,
      connect,
      disconnect,
      wallet: address,
      connecting,
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = (): WalletContextProps => useContext(WalletContext);
