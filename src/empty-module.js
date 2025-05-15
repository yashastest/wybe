
// Empty module to handle imports of unsupported browser modules
export default {};

// Mock implementations of rpc-websockets classes
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

// Additional exports from rpc-websockets
export const WebSocketClient = Client;
export const NodeWebSocketClient = Client;

// Ensure we export RpcWebSocketCommonClient which is specifically being imported
export const RpcWebSocketCommonClient = Client;
// Also export createRpc for the websocket.browser import
export const createRpc = () => new Client();

