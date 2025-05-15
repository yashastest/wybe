
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
