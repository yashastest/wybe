
// Mock implementation for Node.js modules in the browser
// This file provides lightweight mocks for modules that are not available in the browser

console.log('Loading empty module mocks');

// Basic event emitter implementation for compatibility
class EventEmitter {
  constructor() {
    this._events = {};
  }
  
  on(event, listener) {
    if (!this._events[event]) this._events[event] = [];
    this._events[event].push(listener);
    return this;
  }
  
  off(event, listener) {
    if (!this._events[event]) return this;
    this._events[event] = this._events[event].filter(l => l !== listener);
    return this;
  }
  
  emit(event, ...args) {
    if (!this._events[event]) return false;
    this._events[event].forEach(listener => listener.apply(this, args));
    return true;
  }
}

// Mock WebSocket implementation
class MockWebSocket extends EventEmitter {
  constructor(url, protocols) {
    super();
    this.url = url;
    this.protocols = protocols;
    this.readyState = 0; // CONNECTING
    
    // Simulate connection
    setTimeout(() => {
      this.readyState = 1; // OPEN
      this.emit('open');
    }, 100);
  }
  
  send(data) {
    console.log('[Mock WebSocket] Send:', data);
    return true;
  }
  
  close(code, reason) {
    this.readyState = 3; // CLOSED
    this.emit('close', { code, reason });
  }
}

// Mock RPC client
const createRpcClient = () => {
  return {
    call: (method, params) => {
      console.log('[Mock RPC] Call:', method, params);
      return Promise.resolve({ result: null, error: null });
    },
    connect: () => Promise.resolve(),
    disconnect: () => Promise.resolve(),
    on: () => {},
    once: () => {},
    removeListener: () => {}
  };
};

// Export all required mocks
export const w3cwebsocket = MockWebSocket;
export const client = createRpcClient;
export default {
  w3cwebsocket: MockWebSocket,
  client: createRpcClient
};

// Mock exports for various specific imports
export const WebSocketClient = MockWebSocket;
export const NodeWebSocketClient = MockWebSocket;
export const BrowserWebSocketClient = MockWebSocket;
