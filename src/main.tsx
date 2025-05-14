
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { tradingService } from './services/tradingService';
import { smartContractService } from './services/smartContractService';

// Sync configurations between services on startup
const initializeServices = () => {
  const tradingConfig = tradingService.getConfig();
  const contractConfig = smartContractService.getContractConfig();
  
  // Ensure trading service and smart contract service have consistent settings
  smartContractService.updateContractConfig({
    creatorFeePercentage: tradingConfig.creatorFeePercentage,
    rewardClaimPeriodDays: tradingConfig.rewardClaimPeriod,
    dexScreenerThreshold: tradingConfig.dexscreenerThreshold
  });
  
  console.log("Services initialized with the following configuration:");
  console.log("- Creator fee:", tradingConfig.creatorFeePercentage + "%");
  console.log("- Reward claim period:", tradingConfig.rewardClaimPeriod + " days");
  console.log("- DEXScreener threshold: $" + tradingConfig.dexscreenerThreshold);
};

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

// Initialize services
initializeServices();

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
