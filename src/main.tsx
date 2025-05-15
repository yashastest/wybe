
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { smartContractService } from './services/smartContractService.ts'
import { BrowserRouter } from 'react-router-dom'

// Initialize default config values for services
function initializeServices() {
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
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)

// Initialize services with default values
initializeServices();
