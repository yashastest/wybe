
// Browser polyfills for Solana Web3.js
import { Buffer } from 'buffer';

// Make Buffer available in the window object
window.Buffer = Buffer;

// Polyfill global if it doesn't exist
if (typeof global === 'undefined') {
  (window as any).global = window;
}

// Additional polyfills for browser compatibility
(window as any).process = {
  env: { NODE_ENV: 'production' },
  version: '',
  nextTick: (fn: Function) => setTimeout(fn, 0),
  browser: true, // Explicitly indicate browser environment
};

// WebSocket polyfill for @solana/web3.js
if (typeof WebSocket !== 'undefined') {
  (window as any).WebSocket = WebSocket;
}

// Console logging helpers for debugging
const originalConsoleError = console.error;
console.error = (...args) => {
  // Filter out specific WebSocket errors from @solana/web3.js that we expect in browser environment
  if (
    typeof args[0] === 'string' && 
    (args[0].includes('WebSocket connection error') || 
     args[0].includes('rpc-websockets') ||
     args[0].includes('Failed to connect to websocket') ||
     args[0].includes('Invalid response format'))
  ) {
    console.log('[Suppressed WebSocket Error]', ...args);
    return;
  }
  originalConsoleError(...args);
};

// Patch fetch API for potential issues with Solana Web3.js
const originalFetch = window.fetch;
window.fetch = function(...args) {
  return originalFetch.apply(this, args)
    .catch(err => {
      console.log('[Fetch Error]', err);
      throw err;
    });
};

// Inject additional global mocks that might be needed
(window as any).crypto = window.crypto || {};

// Required for some BN.js operations which are used by @solana/web3.js
if (!(window as any).crypto.getRandomValues) {
  (window as any).crypto.getRandomValues = function(buffer: Uint8Array) {
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = Math.floor(Math.random() * 256);
    }
    return buffer;
  };
}

// Add XMLHttpRequest if needed (some versions might use this instead of fetch)
if (typeof XMLHttpRequest === 'undefined') {
  (window as any).XMLHttpRequest = class {
    open() {}
    send() {}
  };
}

// Explicitly expose the module.exports and require functions 
// which might be used by some CommonJS modules
(window as any).module = (window as any).module || {};
(window as any).module.exports = (window as any).module.exports || {};
(window as any).require = (window as any).require || function(module: string) {
  if (module === 'rpc-websockets/dist/lib/client') {
    return { Client: class {} };
  }
  if (module === 'rpc-websockets/dist/lib/client/websocket.browser') {
    return () => ({ Client: class {} });
  }
  if (module === 'ws') {
    return class {};
  }
  return {};
};
