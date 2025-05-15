
/**
 * Helper to handle async operations in trading functions
 * Resolves a Promise and formats the result with the specified number of decimal places
 */
export const resolveAndFormat = async (
  promiseFn: () => Promise<number>,
  defaultValue: number = 0,
  decimalPlaces: number = 4
): Promise<string> => {
  try {
    const result = await promiseFn();
    return result.toFixed(decimalPlaces);
  } catch (error) {
    console.error('Error in calculation:', error);
    return defaultValue.toFixed(decimalPlaces);
  }
};

/**
 * Estimate tokens that will be received for a given SOL amount
 */
export const estimateTokensFromSol = async (
  tokenTradingService: any, 
  tokenSymbol: string, 
  solAmount: number
): Promise<string> => {
  if (!solAmount || solAmount <= 0 || !tokenSymbol) return '0.0000';
  
  return resolveAndFormat(
    async () => await tokenTradingService.estimateTokenAmount(tokenSymbol, solAmount)
  );
};

/**
 * Estimate SOL amount required for a given token amount
 */
export const estimateSolFromTokens = async (
  tokenTradingService: any,
  tokenSymbol: string,
  tokenAmount: number
): Promise<string> => {
  if (!tokenAmount || tokenAmount <= 0 || !tokenSymbol) return '0.0000';
  
  return resolveAndFormat(
    async () => await tokenTradingService.estimateSolAmount(tokenSymbol, tokenAmount)
  );
};
