
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    fs: {
      strict: false, // Allow serving files from outside of the project root
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Node.js module aliases for browser compatibility
      "rpc-websockets/dist/lib/client": path.resolve(__dirname, "src/empty-module.js"),
      "rpc-websockets/dist/lib/client/websocket.browser": path.resolve(__dirname, "src/empty-module.js"),
      "stream": "stream-browserify",
      "crypto": "crypto-browserify",
      "ws": path.resolve(__dirname, "src/empty-module.js"),
      "net": path.resolve(__dirname, "src/empty-module.js"),
      "tls": path.resolve(__dirname, "src/empty-module.js"),
      "fs": path.resolve(__dirname, "src/empty-module.js"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  optimizeDeps: {
    exclude: ["@project-serum/anchor", "@solana/web3.js"], // Don't optimize these packages
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
  },
  define: {
    // For Buffer global
    'process.env': {},
    'global': 'window',
  }
}));
