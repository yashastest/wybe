
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WalletProvider } from "./hooks/useWallet";

// Pages
import Index from "./pages/Index";
import Launch from "./pages/Launch";
import Trade from "./pages/Trade";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import NotFound from "./pages/NotFound";
import LaunchPackage from "./pages/LaunchPackage";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Add Phantom window type declaration
declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      connect?: () => Promise<{ publicKey: { toString: () => string } }>;
      disconnect?: () => Promise<void>;
    };
  }
}

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <WalletProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/launch" element={<Launch />} />
                <Route path="/trade" element={<Trade />} />
                <Route path="/trade/:symbol" element={<Trade />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/package" element={<LaunchPackage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </WalletProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
