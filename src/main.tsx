
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Mock the solana object for testing
if (typeof window !== 'undefined' && !window.solana) {
  window.solana = {
    isPhantom: false,
    connect: async () => ({ 
      publicKey: { 
        toString: () => "PhantomMockWallet123456789" 
      } 
    }),
    disconnect: async () => {}
  };
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(<App />);
