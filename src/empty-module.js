
// Mock implementation for node-specific libraries in browser environments

// Base WebSocket client class
class BaseWebSocketClient {
  constructor(address, options) {
    this._address = address;
    this._options = options || {};
    this._listeners = new Map();
    this.connected = false;
    
    // Simulate successful connection after a short delay
    setTimeout(() => {
      if (this.listenerCount('open') > 0) {
        this.emit('open');
      }
    }, 10);
  }

  // Event emitter methods
  on(event, cb) {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, []);
    }
    this._listeners.get(event).push(cb);
    return this;
  }

  once(event, cb) {
    const onceWrapper = (...args) => {
      this.removeListener(event, onceWrapper);
      cb.apply(this, args);
    };
    return this.on(event, onceWrapper);
  }

  removeListener(event, cb) {
    if (this._listeners.has(event)) {
      const callbacks = this._listeners.get(event);
      const index = callbacks.indexOf(cb);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
    return this;
  }

  removeAllListeners(event) {
    if (event) {
      this._listeners.delete(event);
    } else {
      this._listeners.clear();
    }
    return this;
  }

  listenerCount(event) {
    if (!this._listeners.has(event)) {
      return 0;
    }
    return this._listeners.get(event).length;
  }

  emit(event, ...args) {
    if (this._listeners.has(event)) {
      const callbacks = this._listeners.get(event);
      callbacks.forEach(cb => cb.apply(this, args));
    }
    return this;
  }
}

/**
 * Client class implementation for RPC WebSocket
 */
export class Client extends BaseWebSocketClient {
  constructor(address, options) {
    super(address, options);
    this.subscriptions = new Map();
    this._id = 0;
    console.log("[WebSocket Mock] Created new client instance");
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

    console.log("[WebSocket Mock] Created w3cwebsocket:", url);
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

// Export specific named exports needed by @solana/web3.js
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
