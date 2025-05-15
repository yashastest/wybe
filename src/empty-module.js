
// Mock for Node.js modules needed by Solana web3.js in browser

// Mock implementation for rpc-websockets/dist/lib/client
class Client {
  constructor() {
    this.callbacks = new Map();
    console.log("[RPC-WebSockets Mock] Created client instance");
  }

  connect() { return Promise.resolve(); }
  close() { return Promise.resolve(); }
  on(event, callback) { 
    this.callbacks.set(event, callback);
    return this;
  }
  call() { return Promise.resolve(null); }
  notify() { return Promise.resolve(); }
  subscribe() { return Promise.resolve(1); }
  unsubscribe() { return Promise.resolve(true); }
}

// Required export for rpc-websockets/dist/lib/client
export default Client;

// Required export for rpc-websockets/dist/lib/client/websocket.browser
export function createRpc() {
  return new Client();
}

// Export other components that might be needed
export const RpcWebSocketCommonClient = Client;
export const w3cwebsocket = function() {};
