
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

// Calculate potential profit/loss from trade
export function calculatePnL(entryPrice: number, currentPrice: number, amount: number): number {
  return (currentPrice - entryPrice) * amount;
}

// Format percentage with + or - sign
export function formatPercentage(value: number): string {
  const prefix = value > 0 ? '+' : '';
  return `${prefix}${value.toFixed(2)}%`;
}

// Calculate estimated gas fees based on priority
export function estimateGasFee(priority: 'low' | 'medium' | 'high' | 'urgent'): number {
  const baseFee = 0.000005; // Base fee in SOL
  const multipliers = {
    low: 1,
    medium: 2,
    high: 3,
    urgent: 5
  };
  return baseFee * multipliers[priority];
}

// Get sentiment color based on score (-100 to 100)
export function getSentimentColor(score: number): string {
  if (score > 50) return 'bg-green-500';
  if (score > 20) return 'bg-green-400';
  if (score > 0) return 'bg-green-300';
  if (score === 0) return 'bg-gray-400';
  if (score > -20) return 'bg-red-300';
  if (score > -50) return 'bg-red-400';
  return 'bg-red-500';
}

// Determine if a wallet is a whale based on transaction size
export function isWhale(amount: number): boolean {
  // Define a whale as someone who trades more than 5 SOL in one transaction
  return amount >= 5;
}

// Calculate price after slippage for display
export function getPriceAfterSlippage(price: number, slippage: number, isBuy: boolean): number {
  return isBuy ? 
    price * (1 + slippage / 100) : // Buy price is higher with slippage
    price * (1 - slippage / 100);  // Sell price is lower with slippage
}

// For bonding curve visualization
export function generateBondingCurvePoints(
  initialPrice: number,
  currentSupply: number,
  maxPoints: number = 20,
  curveType: 'linear' | 'quadratic' | 'exponential' = 'linear'
): { supply: number, price: number }[] {
  const points: { supply: number, price: number }[] = [];
  
  for (let i = 0; i < maxPoints; i++) {
    const supplyFraction = currentSupply * (1 + i / (maxPoints - 1));
    let price: number;
    
    switch (curveType) {
      case 'quadratic':
        price = initialPrice * Math.pow(supplyFraction / currentSupply, 2);
        break;
      case 'exponential':
        price = initialPrice * Math.exp(0.1 * (supplyFraction / currentSupply - 1));
        break;
      case 'linear':
      default:
        price = initialPrice * (supplyFraction / currentSupply);
    }
    
    points.push({ supply: supplyFraction, price });
  }
  
  return points;
}
