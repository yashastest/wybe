
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
