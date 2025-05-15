
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
  nextTick: (fn: Function) => setTimeout(fn, 0)
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
     args[0].includes('Failed to connect to websocket'))
  ) {
    console.log('[Suppressed WebSocket Error]', ...args);
    return;
  }
  originalConsoleError(...args);
};

// Add mock implementations for node-specific modules
if (!(window as any).crypto) {
  (window as any).crypto = window.crypto || {};
}

// Ensure WebSocket is properly defined - provide a mock implementation if needed
if (typeof WebSocket === 'undefined') {
  class MockWebSocket {
    onopen: any = null;
    onclose: any = null;
    onmessage: any = null;
    onerror: any = null;
    
    constructor(url: string, protocols?: string | string[]) {
      console.log('Mock WebSocket initialized');
      setTimeout(() => {
        if (this.onopen) this.onopen({ target: this });
      }, 100);
    }
    
    send() {}
    close() {}
  }
  
  (window as any).WebSocket = MockWebSocket;
}

// Patch fetch API for potential issues with Solana Web3.js
const originalFetch = window.fetch;
window.fetch = function(...args) {
  return originalFetch.apply(this, args)
    .catch(err => {
      console.log('[Fetch Error]', err);
      throw err;
    });
};
