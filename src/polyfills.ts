
// Browser polyfills for Solana Web3.js
import { Buffer } from 'buffer';

console.log('Loading polyfills...');

// Make Buffer available in the window object
window.Buffer = Buffer;

// Polyfill global if it doesn't exist
if (typeof global === 'undefined') {
  console.log('Polyfilling global object');
  (window as any).global = window;
}

// Additional polyfills for browser compatibility
(window as any).process = {
  env: { 
    NODE_ENV: import.meta.env.MODE || 'production',
    // Add additional environment variables that might be needed
    BROWSER: true,
  },
  version: '',
  nextTick: (fn: Function) => setTimeout(fn, 0),
  browser: true, // Explicitly indicate browser environment
};

// WebSocket polyfill for @solana/web3.js
if (typeof WebSocket !== 'undefined') {
  (window as any).WebSocket = WebSocket;
  console.log('WebSocket is available');
} else {
  console.warn('WebSocket is not available in this environment');
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
  console.log(`[Fetch Request]`, args[0]);
  return originalFetch.apply(this, args)
    .then(response => {
      if (!response.ok) {
        console.warn(`[Fetch Error] Status: ${response.status} for ${args[0]}`);
      }
      return response;
    })
    .catch(err => {
      console.warn('[Fetch Error]', err);
      throw err;
    });
};

// Inject additional global mocks that might be needed
(window as any).crypto = window.crypto || {};

// Required for some BN.js operations which are used by @solana/web3.js
if (!(window as any).crypto.getRandomValues) {
  console.warn('Polyfilling crypto.getRandomValues');
  (window as any).crypto.getRandomValues = function(buffer: Uint8Array) {
    for (let i = 0; i < buffer.length; i++) {
      buffer[i] = Math.floor(Math.random() * 256);
    }
    return buffer;
  };
}

// Add XMLHttpRequest if needed (some versions might use this instead of fetch)
if (typeof XMLHttpRequest === 'undefined') {
  console.warn('Polyfilling XMLHttpRequest');
  (window as any).XMLHttpRequest = class {
    open() {}
    send() {}
  };
}

// Ensure Vite HMR is properly setup
if (import.meta.hot) {
  import.meta.hot.accept(() => {
    console.log('Hot module replacement accepted');
  });
}

// Mock websockets implementation for compatibility
if (!(window as any).WebSocketImpl) {
  (window as any).WebSocketImpl = class MockWebSocket {
    constructor() {
      console.log('Using mock WebSocket implementation');
    }
    addEventListener() {}
    removeEventListener() {}
    send() {}
    close() {}
  };
}

console.log('Polyfills loaded successfully');
