
// Import polyfills first
import "./polyfills";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Add error handling for React rendering
const renderApp = () => {
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
    console.error("Failed to render application:", error);
    // Display a fallback UI for catastrophic errors
    document.body.innerHTML = '<div style="padding: 20px; text-align: center;"><h2>Application Error</h2><p>Please refresh the page to try again.</p></div>';
  }
};

// Add enhanced error handling for module loading
renderApp();

// Enable hot module replacement for better development experience
if (import.meta.hot) {
  import.meta.hot.accept();
}
