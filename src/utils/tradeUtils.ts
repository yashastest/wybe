
/**
 * Format a number as a currency with appropriate precision
 * @param value - Number to format
 * @param precision - Number of decimal places (default: 6 for small numbers, 2 for larger numbers)
 */
export const formatCurrency = (value: number, precision?: number): string => {
  if (value === undefined || value === null || isNaN(value)) return '0';
  
  // Determine precision based on value size if not specified
  if (precision === undefined) {
    precision = value < 0.01 ? 6 : value < 1 ? 4 : 2;
  }
  
  // Format the value with the appropriate precision
  return value.toFixed(precision);
};

/**
 * Format a large number with appropriate abbreviations (K, M, B)
 * @param value - Number to format
 */
export const formatLargeNumber = (value: number): string => {
  if (value === undefined || value === null || isNaN(value)) return '0';
  
  if (value >= 1000000000) {
    return (value / 1000000000).toFixed(2) + 'B';
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(2) + 'M';
  } else if (value >= 1000) {
    return (value / 1000).toFixed(2) + 'K';
  } else {
    return value.toFixed(2);
  }
};

/**
 * Format a wallet address for display (truncate middle)
 * @param address - Wallet address to format
 */
export const formatWalletAddress = (address: string): string => {
  if (!address || address.length < 10) return address || '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};
