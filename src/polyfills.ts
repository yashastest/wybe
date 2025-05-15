
// Browser polyfills for Solana Web3.js
import { Buffer } from 'buffer';

// Make Buffer available in the window object
window.Buffer = Buffer;

// Polyfill global if it doesn't exist
if (typeof global === 'undefined') {
  (window as any).global = window;
}
