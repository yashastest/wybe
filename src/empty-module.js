
// Empty module to handle imports of unsupported browser modules

/**
 * Mock implementation for rpc-websockets/dist/lib/client
 * This is a comprehensive mock to support Solana Web3.js in browser environments
 */
export class Client {
  constructor() {
    this.connected = false;
    this._events = {};
  }
  connect() {
    this.connected = true;
    return Promise.resolve();
  }
  disconnect() {
    this.connected = false;
    return Promise.resolve();
  }
  call() {
    return Promise.resolve(null);
  }
  notify() {
    return Promise.resolve();
  }
  on(event, callback) {
    if (!this._events[event]) {
      this._events[event] = [];
    }
    this._events[event].push(callback);
  }
  once(event, callback) {
    const onceCallback = (...args) => {
      this.off(event, onceCallback);
      callback(...args);
    };
    this.on(event, onceCallback);
  }
  off(event, callback) {
    if (this._events[event]) {
      this._events[event] = this._events[event].filter(cb => cb !== callback);
    }
  }
  subscribe() {
    return Promise.resolve(1); // Subscription ID
  }
  unsubscribe() {
    return Promise.resolve(true);
  }
  emit(event, ...args) {
    if (this._events[event]) {
      this._events[event].forEach(callback => callback(...args));
    }
  }
}

// Provide a WebSocket implementation for browser environments
export class w3cwebsocket {
  constructor() {
    this.onopen = null;
    this.onclose = null;
    this.onmessage = null;
    this.onerror = null;
    
    // Mock implementation that simulates a successful connection
    setTimeout(() => {
      if (this.onopen) this.onopen({ type: 'open' });
    }, 0);
  }
  send() {}
  close() {
    if (this.onclose) this.onclose({ type: 'close' });
  }
}

// Additional exports from rpc-websockets
export const WebSocketClient = Client;
export const NodeWebSocketClient = Client;

// Export RpcWebSocketCommonClient which is specifically imported by @solana/web3.js
export const RpcWebSocketCommonClient = Client;

// Export createRpc for the websocket.browser import
export const createRpc = () => new Client();

// Mock WS module used by Solana's web socket connection
export class WebSocketImpl extends w3cwebsocket {
  constructor() {
    super();
    this.readyState = 1; // WebSocket.OPEN
  }
}

// Make sure the implementation is available as both default and named export
export { Client as default };

// Mock implementation for jayson/lib/client/browser
export const jaysonClient = {
  Client: class {
    constructor() {}
    request() {
      return Promise.resolve({ result: null, error: null });
    }
  }
};

export default Client;
