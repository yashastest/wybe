
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { WalletProvider } from './hooks/useWallet.tsx';
import { Toaster } from './components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { smartContractService } from './services/smartContractService.ts';

// Initialize contract configuration with defaults
smartContractService.updateContractConfig({
  creatorFeePercentage: 2.5,
  platformFeePercentage: 2.5
});

// Initialize query client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WalletProvider>
        <App />
        <Toaster position="top-right" />
      </WalletProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
