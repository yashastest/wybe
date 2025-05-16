
export function formatCurrency(value: number): string {
  if (!value && value !== 0) return '0.00';
  
  if (value >= 1000000) {
    return (value / 1000000).toFixed(2) + 'M';
  }
  
  if (value >= 1000) {
    return (value / 1000).toFixed(2) + 'K';
  }
  
  if (value < 0.001) {
    return value.toFixed(6);
  }
  
  return value.toFixed(2);
}

// Format large numbers with K, M, B suffixes
export function formatNumber(value: number): string {
  return formatCurrency(value);
}

// Calculate price impact based on trade size and liquidity
export function calculatePriceImpact(tradeSize: number, liquidity: number): number {
  if (!liquidity || liquidity === 0) return 0;
  return (tradeSize / liquidity) * 100;
}

// Estimate trade output including slippage
export function estimateTradeOutput(
  inputAmount: number, 
  price: number, 
  slippage: number, 
  isBuy: boolean
): number {
  if (isBuy) {
    // When buying, you get fewer tokens due to slippage
    const baseOutput = inputAmount / price;
    return baseOutput * (1 - slippage / 100);
  } else {
    // When selling, you get less SOL due to slippage
    const baseOutput = inputAmount * price;
    return baseOutput * (1 - slippage / 100);
  }
}

// Format wallet address for display (first 4 + last 4 chars)
export function formatWalletAddress(address: string): string {
  if (!address || address.length < 10) return address || '';
  return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
}
