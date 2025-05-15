
import "./polyfills"; // Import polyfills first
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

// Create a client with custom retry logic for better stability
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Handle any runtime errors
window.addEventListener('error', (event) => {
  console.error('Runtime error:', event.error);
});

// Add connection status monitoring
if (import.meta.hot) {
  import.meta.hot.on('vite:beforeUpdate', () => {
    console.log('Hot update applied');
  });
}

// Enhanced error boundary for the root component
try {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster />
      </QueryClientProvider>
    </React.StrictMode>
  );
} catch (error) {
  console.error('Failed to render application:', error);
  // Display a minimal error message to the user
  document.body.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h2>Something went wrong</h2>
      <p>Please refresh the page to try again.</p>
    </div>
  `;
}
