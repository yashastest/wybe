
// Format currency with commas
export const formatCurrency = (value: number): string => {
  if (!value) return '0';
  
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

// Calculate price impact for a trade
export const calculatePriceImpact = (
  tokenPrice: number,
  tradeAmount: number,
  action: 'buy' | 'sell',
  slippage: number = 0.5
): number => {
  // Simple price impact calculation
  const impact = (tradeAmount / 1000) * (action === 'buy' ? 1 : -1);
  
  // Add slippage
  const withSlippage = impact * (1 + slippage / 100);
  
  return Math.min(Math.abs(withSlippage), 10); // Cap at 10% for UI
};

// Calculate token price with bonding curve
export const calculateTokenPrice = (
  totalSupply: number,
  amount: number = 1,
  curveType: 'linear' | 'quadratic' | 'exponential' = 'linear'
): number => {
  switch (curveType) {
    case 'linear':
      return (totalSupply / 10000) + 0.01;
    case 'quadratic':
      return Math.pow(totalSupply / 10000, 2) + 0.01;
    case 'exponential':
      return Math.exp(totalSupply / 1000000) / 100;
    default:
      return (totalSupply / 10000) + 0.01;
  }
};

// Generate data points for bonding curves
export const generateBondingCurvePoints = (
  initialPrice: number,
  currentSupply: number,
  numPoints: number = 10,
  curveType: 'linear' | 'quadratic' | 'exponential' = 'linear'
) => {
  const points = [];
  // Start from a bit less than current supply
  const startSupply = currentSupply * 0.5;
  // End at more than current supply
  const endSupply = currentSupply * 2;
  // Calculate step size
  const step = (endSupply - startSupply) / (numPoints - 1);
  
  for (let i = 0; i < numPoints; i++) {
    const supply = startSupply + i * step;
    let price;
    
    // Calculate price based on curve type
    switch (curveType) {
      case 'linear':
        price = (supply / 10000000) + initialPrice * 0.5;
        break;
      case 'quadratic':
        price = Math.pow(supply / 20000000, 2) + initialPrice * 0.5;
        break;
      case 'exponential':
        price = initialPrice * 0.5 + (Math.exp(supply / (currentSupply * 2)) - 1) * initialPrice * 0.1;
        break;
      default:
        price = (supply / 10000000) + initialPrice * 0.5;
    }
    
    // If this is close to the current supply point, use the actual price
    if (Math.abs(supply - currentSupply) < step / 2) {
      price = initialPrice;
    }
    
    points.push({
      supply,
      price
    });
  }
  
  return points;
};

// Calculate estimated SOL amount for token purchase
export const calculateSolAmount = (tokenAmount: number, tokenPrice: number): number => {
  return tokenAmount * tokenPrice;
};

// Calculate estimated token amount for SOL spent
export const calculateTokenAmount = (solAmount: number, tokenPrice: number): number => {
  return solAmount / tokenPrice;
};

// Format token amount based on value
export const formatTokenAmount = (amount: number): string => {
  if (amount >= 1000000000) {
    return (amount / 1000000000).toFixed(2) + 'B';
  } else if (amount >= 1000000) {
    return (amount / 1000000).toFixed(2) + 'M';
  } else if (amount >= 1000) {
    return (amount / 1000).toFixed(2) + 'K';
  } else if (amount >= 1) {
    return amount.toFixed(2);
  } else {
    return amount.toFixed(8);
  }
};

// Format percentage change with + or - sign
export const formatPercentageChange = (value: number): string => {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

// Calculate market cap from token price and supply
export const calculateMarketCap = (price: number, totalSupply: number): number => {
  return price * totalSupply;
};

// Determine if token has reached the $50K milestone
export const hasReached50kMilestone = (marketCap: number): boolean => {
  return marketCap >= 50000;
};

// Calculate time remaining for milestone based on launch time
export const calculateMilestoneTimeRemaining = (launchTime: Date): number => {
  const now = new Date();
  const fourDaysFromLaunch = new Date(launchTime.getTime() + 4 * 24 * 60 * 60 * 1000);
  const remainingMs = fourDaysFromLaunch.getTime() - now.getTime();
  return Math.max(0, Math.floor(remainingMs / (1000 * 60 * 60))); // Hours remaining
};
