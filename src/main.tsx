
// Import polyfills first to ensure they're loaded
import "./polyfills.js";

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { smartContractService } from './services/smartContractService.ts'
import { Toaster } from 'sonner';

// Initialize default config values for services
function initializeServices() {
  try {
    // Set up default contract configuration
    smartContractService.updateContractConfig({
      creatorFeePercentage: 2,
      rewardClaimPeriodDays: 7,
      dexScreenerThreshold: 1000,
      bondingCurveEnabled: true,
      bondingCurveLimit: 10000,
      platformFeePercentage: 1
    });
    
    console.log('Services initialized with default configuration');
  } catch (error) {
    console.error('Error initializing services:', error);
  }
}

// Wrap render in a try-catch to prevent silent failures
try {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
      <Toaster position="top-right" richColors />
    </React.StrictMode>,
  )

  // Initialize services with default values
  initializeServices();
} catch (error) {
  console.error('Failed to render application:', error);
}
