
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

/**
 * Format currency value with specified decimal places
 */
export const formatCurrency = (
  value: number | string,
  decimalPlaces: number = 2,
  prefix: string = ''
): string => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return `${prefix}0.${'0'.repeat(decimalPlaces)}`;
  return `${prefix}${numValue.toFixed(decimalPlaces)}`;
};

/**
 * Calculate percentage change between two values
 */
export const calculatePercentageChange = (
  currentValue: number,
  previousValue: number
): number => {
  if (previousValue === 0) return 0;
  return ((currentValue - previousValue) / Math.abs(previousValue)) * 100;
};

/**
 * Format percentage value for display
 */
export const formatPercentage = (
  value: number,
  decimalPlaces: number = 2,
  includeSymbol: boolean = true
): string => {
  const formattedValue = value.toFixed(decimalPlaces);
  return includeSymbol ? `${value >= 0 ? '+' : ''}${formattedValue}%` : formattedValue;
};
