
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

// Initialization status tracking
console.log('Application initialization starting...');

// Improved error handling
window.addEventListener('error', (event) => {
  console.error('Runtime error:', event.error);
  document.getElementById('root')?.setAttribute('data-error', 'true');
});

// Add connection status monitoring
if (import.meta.hot) {
  import.meta.hot.on('vite:beforeUpdate', () => {
    console.log('Hot update applied');
  });
}

// Enhanced initialization to provide better feedback
const initializeApp = () => {
  try {
    console.log('Mounting React application...');
    const rootElement = document.getElementById("root");
    
    if (!rootElement) {
      throw new Error('Root element not found in DOM');
    }
    
    // Set initialization status for debugging
    rootElement.setAttribute('data-initializing', 'true');
    
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <QueryClientProvider client={queryClient}>
          <App />
          <Toaster />
        </QueryClientProvider>
      </React.StrictMode>
    );
    
    // Mark initialization as complete
    rootElement.setAttribute('data-initializing', 'false');
    console.log('Application mounted successfully');
  } catch (error) {
    console.error('Failed to render application:', error);
    // Display a minimal error message to the user
    document.body.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h2>Something went wrong</h2>
        <p>Application initialization failed. Please refresh the page to try again.</p>
        <p style="color: gray; font-size: 12px;">Error: ${error instanceof Error ? error.message : 'Unknown error'}</p>
      </div>
    `;
  }
};

// Attempt initialization with a small delay to ensure DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => setTimeout(initializeApp, 100));
} else {
  setTimeout(initializeApp, 100);
}
