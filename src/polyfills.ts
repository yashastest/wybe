
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
