
// Browser polyfills for Solana web3.js compatibility
import { Buffer } from 'buffer';

// Make buffer available globally for Solana web3.js
window.Buffer = Buffer;

// Browser-compatible WebSocket client mock for rpc-websockets
class RpcWebSocketClient {
  constructor(address, options) {
    this.address = address;
    this.options = options || {};
    this.callbacks = new Map();
    console.log(`[WebSocket Mock] Created client for ${address}`);
  }

  connect() {
    console.log(`[WebSocket Mock] Connected to ${this.address}`);
    return Promise.resolve();
  }

  close() {
    console.log(`[WebSocket Mock] Closed connection to ${this.address}`);
    return Promise.resolve();
  }

  on(event, callback) {
    this.callbacks.set(event, callback);
    console.log(`[WebSocket Mock] Registered handler for ${event}`);
    return this;
  }

  call(method, params) {
    console.log(`[WebSocket Mock] Call ${method}`, params);
    return Promise.resolve({ result: null });
  }

  // Additional methods that might be used
  notify() { return Promise.resolve(); }
  subscribe() { return Promise.resolve(1); }
  unsubscribe() { return Promise.resolve(true); }
}

// Export for direct use
window.RpcWebSocketCommonClient = RpcWebSocketClient;

// Additional global polyfills
window.global = window;
window.process = {
  env: { NODE_ENV: process.env.NODE_ENV || 'production' },
  browser: true
};

// Console log to confirm initialization
console.log('Solana web3.js browser polyfills initialized');

export { RpcWebSocketClient };
