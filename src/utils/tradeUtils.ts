
/**
 * Format a currency value with a specified number of decimal places
 * and optional prefix or suffix.
 * 
 * @param value - The number to format
 * @param decimals - Number of decimal places (default: 2)
 * @param prefix - Optional prefix string (default: '$')
 * @param suffix - Optional suffix string
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number | undefined | null, 
  decimals: number = 2, 
  prefix: string = '$', 
  suffix: string = ''
): string => {
  if (value === undefined || value === null) {
    return `${prefix}0${suffix}`;
  }

  // Handle negative values
  const isNegative = value < 0;
  const absoluteValue = Math.abs(value);
  
  // Format the number with the specified decimal places
  const formattedValue = absoluteValue.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
  
  // Assemble the final string with the prefix, sign, and suffix
  return `${isNegative ? '-' : ''}${prefix}${formattedValue}${suffix}`;
};

/**
 * Resolves a promise and formats the result as currency
 * 
 * @param promiseOrValue - Promise that resolves to a number or the number itself
 * @param decimals - Number of decimal places
 * @param prefix - Optional prefix string
 * @param suffix - Optional suffix string
 * @returns Formatted currency string
 */
export const resolveAndFormat = async (
  promiseOrValue: Promise<number> | number,
  decimals: number = 2,
  prefix: string = '$',
  suffix: string = ''
): Promise<string> => {
  try {
    const value = promiseOrValue instanceof Promise ? await promiseOrValue : promiseOrValue;
    return formatCurrency(value, decimals, prefix, suffix);
  } catch (error) {
    console.error('Error formatting value:', error);
    return formatCurrency(0, decimals, prefix, suffix);
  }
};

/**
 * Estimate token amount from SOL amount
 * 
 * @param tradingService - Trading service to use for estimation
 * @param tokenSymbol - Symbol of the token
 * @param solAmount - Amount of SOL
 * @returns Formatted token amount string
 */
export const estimateTokensFromSol = async (
  tradingService: any, 
  tokenSymbol: string, 
  solAmount: number
): Promise<string> => {
  try {
    const tokenAmount = await tradingService.estimateTokenAmount(tokenSymbol, solAmount);
    return tokenAmount.toFixed(4);
  } catch (error) {
    console.error('Error estimating token amount:', error);
    return '0.0000';
  }
};

/**
 * Estimate SOL amount from token amount
 * 
 * @param tradingService - Trading service to use for estimation
 * @param tokenSymbol - Symbol of the token
 * @param tokenAmount - Amount of tokens
 * @returns Formatted SOL amount string
 */
export const estimateSolFromTokens = async (
  tradingService: any, 
  tokenSymbol: string, 
  tokenAmount: number
): Promise<string> => {
  try {
    const solAmount = await tradingService.estimateSolAmount(tokenSymbol, tokenAmount);
    return solAmount.toFixed(4);
  } catch (error) {
    console.error('Error estimating SOL amount:', error);
    return '0.0000';
  }
};
