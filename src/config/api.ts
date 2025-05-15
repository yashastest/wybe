
// API endpoint configuration
export const API_CONFIG = {
  BASE_URL: 'https://api.wybe-token.com', // Replace with your actual API domain
  ENDPOINTS: {
    // Token trading endpoints
    ESTIMATE_TOKEN: '/v1/trading/estimate-token',
    ESTIMATE_SOL: '/v1/trading/estimate-sol',
    EXECUTE_TRADE: '/v1/trading/execute',
    
    // Token launch endpoints
    LAUNCH_TOKEN: '/v1/tokens/launch',
    BUY_INITIAL_SUPPLY: '/v1/tokens/buy-initial',
    LIST_TOKENS: '/v1/tokens/list',
    
    // Transaction endpoints
    USER_TRANSACTIONS: '/v1/transactions/user',
    TRANSACTION_STATS: '/v1/transactions/stats',
  },
  // Default request timeout in milliseconds
  TIMEOUT: 30000,
};

// Blockchain configuration
export const BLOCKCHAIN_CONFIG = {
  NETWORK: 'mainnet-beta', // 'devnet', 'testnet', or 'mainnet-beta'
  RPC_URL: 'https://api.mainnet-beta.solana.com',
  COMMITMENT: 'confirmed',
};

