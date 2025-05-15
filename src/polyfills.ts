
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

// Console logging with enhanced error filtering
const originalConsoleError = console.error;
console.error = (...args) => {
  // Filter out specific WebSocket errors from @solana/web3.js that we expect in browser environment
  if (
    typeof args[0] === 'string' && 
    (args[0].includes('WebSocket connection error') || 
     args[0].includes('rpc-websockets') ||
     args[0].includes('Failed to connect to websocket') ||
     args[0].includes('Cannot resolve module'))
  ) {
    console.log('[Suppressed Error]', ...args);
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
    readyState = 0;
    
    constructor(url: string, protocols?: string | string[]) {
      console.log('Mock WebSocket initialized', url);
      setTimeout(() => {
        this.readyState = 1;
        if (this.onopen) this.onopen({ target: this });
      }, 100);
    }
    
    send(data: any) {
      console.log('Mock WebSocket sending data:', data);
    }
    
    close(code?: number, reason?: string) {
      this.readyState = 3;
      if (this.onclose) {
        this.onclose({
          code: code || 1000,
          reason: reason || 'Normal closure',
          wasClean: true,
        });
      }
    }
  }
  
  (window as any).WebSocket = MockWebSocket;
}

// Make sure the RPC websockets client is correctly exposed
try {
  const mockModule = require('rpc-websockets/dist/lib/client');
  if (mockModule) {
    console.log('RPC WebSockets client module loaded successfully');
  }
} catch (err) {
  console.warn('Could not preload RPC WebSockets mock:', err);
}

// Add console.log to track polyfill initialization
console.log('Polyfills initialized for Solana Web3.js compatibility');
