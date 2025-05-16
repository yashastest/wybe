
// Utility functions for trading-related operations

export const formatCurrency = (value: number): string => {
  // Format currency values neatly
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(2) + 'M';
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(2) + 'K';
  }
  
  // Format based on value size
  if (value < 0.01) {
    return value.toFixed(6);
  }
  
  if (value < 1) {
    return value.toFixed(4);
  }
  
  return value.toFixed(2);
};

export const formatPercentage = (value: number): string => {
  // Format percentage with sign and proper decimal places
  return (value >= 0 ? '+' : '') + value.toFixed(2) + '%';
};

export const formatNumber = (value: number): string => {
  // Format large numbers with K, M suffixes
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(2) + 'M';
  }
  if (value >= 1_000) {
    return (value / 1_000).toFixed(2) + 'K';
  }
  return value.toLocaleString();
};

export const formatWalletAddress = (address: string, chars: number = 4): string => {
  if (!address || address.length <= chars * 2) return address;
  return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
};

export const calculateImpact = (orderSize: number, liquidity: number): number => {
  // Simple price impact calculation as an example
  // In real applications, this would be based on the bonding curve or orderbook
  return Math.min(100, (orderSize / liquidity) * 100);
};

export const getSentimentColor = (score: number): string => {
  // Return appropriate color based on sentiment score (-100 to +100)
  if (score >= 75) return 'bg-green-500';
  if (score >= 50) return 'bg-green-400/80';
  if (score >= 25) return 'bg-green-300/70';
  if (score >= 0) return 'bg-blue-400/70';
  if (score >= -25) return 'bg-orange-300/70';
  if (score >= -50) return 'bg-orange-400/80';
  if (score >= -75) return 'bg-red-400/80';
  return 'bg-red-500';
};

export const simulateBondingCurve = (
  supply: number,
  amount: number,
  curveType: 'linear' | 'quadratic' | 'exponential' = 'quadratic'
): { price: number; newSupply: number; newPrice: number } => {
  let price = 0;
  
  // Base price calculation based on curve type
  switch (curveType) {
    case 'linear':
      price = supply / 1000000;
      break;
    case 'quadratic':
      price = Math.pow(supply / 1000000, 2) + 0.0001;
      break;
    case 'exponential':
      price = Math.exp(supply / 10000000) / 100;
      break;
    default:
      price = Math.pow(supply / 1000000, 2) + 0.0001;
  }
  
  // Calculate new supply and resulting price
  const newSupply = supply + amount;
  let newPrice = 0;
  
  // Calc new price based on curve type
  switch (curveType) {
    case 'linear':
      newPrice = newSupply / 1000000;
      break;
    case 'quadratic':
      newPrice = Math.pow(newSupply / 1000000, 2) + 0.0001;
      break;
    case 'exponential':
      newPrice = Math.exp(newSupply / 10000000) / 100;
      break;
    default:
      newPrice = Math.pow(newSupply / 1000000, 2) + 0.0001;
  }
  
  return {
    price,
    newSupply,
    newPrice
  };
};

// Generates realistic trading data for chart visualization
export const generateChartData = (
  basePrice: number,
  volatility: number = 0.05,
  periods: number = 100,
  timeframe: string = '1D'
): { time: string; open: number; high: number; low: number; close: number; volume: number }[] => {
  const data = [];
  let lastClose = basePrice;
  const now = Date.now();
  
  // Determine time interval based on timeframe
  let interval: number;
  switch (timeframe) {
    case '15m': interval = 15 * 60 * 1000; break;
    case '1H': interval = 60 * 60 * 1000; break;
    case '4H': interval = 4 * 60 * 60 * 1000; break;
    case '1D': interval = 24 * 60 * 60 * 1000; break; 
    case '1W': interval = 7 * 24 * 60 * 60 * 1000; break;
    default: interval = 24 * 60 * 60 * 1000;
  }
  
  for (let i = periods; i >= 0; i--) {
    // Calculate time for this candle
    const time = new Date(now - i * interval).toISOString();
    
    // Random change with momentum
    const changePercent = (Math.random() - 0.5) * volatility * 2;
    const close = Math.max(lastClose * (1 + changePercent), 0.000001);
    
    // Calculate high, low, and open with some randomness
    const range = close * volatility;
    const randomFactor = Math.random() * 0.8 + 0.2; // between 0.2 and 1
    const high = close * (1 + volatility * randomFactor);
    const low = close * (1 - volatility * randomFactor);
    
    // Open is previous close with some intraperiod variation
    const open = lastClose * (1 + (Math.random() - 0.5) * volatility * 0.3);
    
    // Generate realistic volume
    const volume = Math.floor(basePrice * (10000 + Math.random() * 90000));
    
    data.push({
      time,
      open,
      high: Math.max(high, open, close),
      low: Math.min(low, open, close),
      close,
      volume
    });
    
    lastClose = close;
  }
  
  return data;
};
