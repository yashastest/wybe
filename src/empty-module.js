
// Mock implementation for node-specific libraries in browser environments

/**
 * Client class implementation for RPC WebSocket
 */
export class Client {
  constructor(options = {}) {
    this.options = options;
    this.connected = false;
    this.subscriptions = new Map();
    this._id = 0;
  }

  connect() {
    this.connected = true;
    console.log("[WebSocket Mock] Connected");
    return Promise.resolve();
  }

  disconnect() {
    this.connected = false;
    console.log("[WebSocket Mock] Disconnected");
    return Promise.resolve();
  }

  call(method, params) {
    console.log(`[WebSocket Mock] Method call: ${method}`, params);
    return Promise.resolve(null);
  }

  notify(method, params) {
    console.log(`[WebSocket Mock] Notification: ${method}`, params);
    return Promise.resolve();
  }

  subscribe(event, callback) {
    const id = ++this._id;
    this.subscriptions.set(id, { event, callback });
    console.log(`[WebSocket Mock] Subscribed to ${event} with id ${id}`);
    return Promise.resolve(id);
  }

  unsubscribe(id) {
    const removed = this.subscriptions.delete(id);
    console.log(`[WebSocket Mock] Unsubscribed from id ${id}, success: ${removed}`);
    return Promise.resolve(removed);
  }

  on(event, callback) {
    console.log(`[WebSocket Mock] Registered event listener for: ${event}`);
  }

  once(event, callback) {
    console.log(`[WebSocket Mock] Registered one-time event listener for: ${event}`);
  }
}

/**
 * WebSocket client implementation for w3c standard
 */
export class w3cwebsocket {
  constructor(url, protocols, origin, headers, requestOptions, config) {
    this.url = url;
    this.protocols = protocols;
    this.readyState = 0; // CONNECTING
    
    // Event handlers
    this.onopen = null;
    this.onclose = null;
    this.onmessage = null;
    this.onerror = null;

    // Simulate connection
    setTimeout(() => {
      this.readyState = 1; // OPEN
      if (this.onopen) this.onopen({ target: this });
    }, 50);
  }

  send(data) {
    if (this.readyState !== 1) {
      console.error("[WebSocket Mock] Cannot send: connection not open");
      return;
    }
    console.log("[WebSocket Mock] Sent data:", data);
  }

  close(code, reason) {
    this.readyState = 3; // CLOSED
    if (this.onclose) {
      this.onclose({
        code: code || 1000,
        reason: reason || "Normal closure",
        wasClean: true
      });
    }
  }
}

// Specific exports needed for Solana Web3.js
export const WebSocketClient = Client;
export const NodeWebSocketClient = Client;
export const RpcWebSocketCommonClient = Client;

// Export createRpc function that returns a new client instance
export function createRpc() {
  return new Client();
}

// Export default object with all the exports
export default {
  Client,
  w3cwebsocket,
  WebSocketClient,
  NodeWebSocketClient,
  RpcWebSocketCommonClient,
  createRpc
};
