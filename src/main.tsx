
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Toaster } from './components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { smartContractService } from './services/smartContractService.ts';
import { WalletProvider } from '@/lib/wallet';

// Initialize query client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
    },
  },
});

// Initialize contract configuration with defaults (using proper method)
try {
  const config = {
    creatorFeePercentage: 2.5,
    platformFeePercentage: 2.5
  };
  smartContractService.setContractConfig(config);
} catch (error) {
  console.error("Failed to initialize contract configuration:", error);
}

// Create root and render app
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
