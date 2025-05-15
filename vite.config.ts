
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { nodePolyfills } from "vite-plugin-node-polyfills";

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
    nodePolyfills({
      // Whether to polyfill specific nodejs globals and modules
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Whether to polyfill `node:` protocol imports
      protocolImports: true,
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Comprehensive aliases for all possible import paths used by Solana web3.js
      "rpc-websockets": path.resolve(__dirname, "src/empty-module.js"),
      "rpc-websockets/dist/lib/client": path.resolve(__dirname, "src/empty-module.js"),
      "rpc-websockets/dist/lib/client/websocket": path.resolve(__dirname, "src/empty-module.js"),
      "rpc-websockets/dist/lib/client/websocket.browser": path.resolve(__dirname, "src/empty-module.js"),
      "rpc-websockets/dist/lib/client/index": path.resolve(__dirname, "src/empty-module.js"),
      "rpc-websockets/dist/lib/client/index.browser": path.resolve(__dirname, "src/empty-module.js"),
      "jayson/lib/client/browser": path.resolve(__dirname, "src/empty-module.js"),
      "ws": path.resolve(__dirname, "src/empty-module.js"),
      "net": path.resolve(__dirname, "src/empty-module.js"),
      "tls": path.resolve(__dirname, "src/empty-module.js"),
      "dgram": path.resolve(__dirname, "src/empty-module.js"),
      "fs": path.resolve(__dirname, "src/empty-module.js"),
      "crypto": path.resolve(__dirname, "src/empty-module.js"),
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  },
  optimizeDeps: {
    exclude: ["@solana/web3.js"], // Don't optimize these packages
    include: ["buffer", "events", "assert", "stream"], // Include these to be pre-bundled
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
  }
}));
