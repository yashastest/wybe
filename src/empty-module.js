
// Empty module to handle imports of unsupported browser modules

// Export the Client class properly to ensure it's recognized by RPC imports
export class Client {
  constructor() {
    this.connected = false;
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
  on() {}
  once() {}
  subscribe() {
    return Promise.resolve(1); // Subscription ID
  }
  unsubscribe() {
    return Promise.resolve(true);
  }
}

// Create a WebSocket client implementation
export class w3cwebsocket {
  constructor() {
    this.onopen = null;
    this.onclose = null;
    this.onmessage = null;
    this.onerror = null;
  }
  send() {}
  close() {}
}

// Exports needed for specific imports in Solana Web3.js
export const WebSocketClient = Client;
export const NodeWebSocketClient = Client;

// Specifically export RpcWebSocketCommonClient for direct import 
export const RpcWebSocketCommonClient = Client;

// Export createRpc function for websocket.browser import
export function createRpc() {
  return new Client();
}

// Default export for basic module imports
export default {
  Client,
  w3cwebsocket,
  WebSocketClient,
  NodeWebSocketClient,
  RpcWebSocketCommonClient,
  createRpc
};
