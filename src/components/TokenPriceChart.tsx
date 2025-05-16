
import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

interface TokenPriceChartProps {
  symbol: string;
  timeframe?: '24h' | '7d' | '30d' | '90d';
  height?: number | string;
  compact?: boolean;
}

const TokenPriceChart: React.FC<TokenPriceChartProps> = ({ 
  symbol,
  timeframe = '24h',
  height = "100%",
  compact = false
}) => {
  // Mock data - In a real app, this would be fetched from an API
  const generateMockData = () => {
    const data = [];
    const startPrice = Math.random() * 0.1;
    let lastPrice = startPrice;
    
    const pointCount = timeframe === '24h' ? 24 : 
                       timeframe === '7d' ? 7 * 24 : 
                       timeframe === '30d' ? 30 : 90;
                       
    for (let i = 0; i < pointCount; i++) {
      const change = (Math.random() - 0.48) * 0.01;
      lastPrice = Math.max(0.0001, lastPrice + change);
      
      data.push({
        time: i,
        price: lastPrice
      });
    }
    return data;
  };

  const [chartData, setChartData] = React.useState(generateMockData());
  const [isLoading, setIsLoading] = React.useState(false);
  
  // On symbol or timeframe change, refresh data
  React.useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call
    const timer = setTimeout(() => {
      setChartData(generateMockData());
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [symbol, timeframe]);
  
  // Get min and max for better chart scaling
  const minPrice = Math.min(...chartData.map(d => d.price));
  const maxPrice = Math.max(...chartData.map(d => d.price));
  const domain = [minPrice - (minPrice * 0.05), maxPrice + (maxPrice * 0.05)];
  
  // Determine color based on price trend
  const startPrice = chartData[0]?.price || 0;
  const endPrice = chartData[chartData.length - 1]?.price || 0;
  const strokeColor = endPrice >= startPrice ? "#22c55e" : "#ef4444";

  if (isLoading) {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart 
        data={chartData} 
        margin={compact ? { top: 0, right: 0, left: 0, bottom: 0 } : { top: 2, right: 2, left: 2, bottom: 2 }}
      >
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3}/>
            <stop offset="95%" stopColor={strokeColor} stopOpacity={0}/>
          </linearGradient>
        </defs>
        {!compact && <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />}
        {!compact && (
          <XAxis 
            dataKey="time" 
            tick={{fontSize: 10}} 
            tickFormatter={(value) => {
              if (timeframe === '24h') return `${value}h`;
              return value.toString();
            }} 
            stroke="#666"
            opacity={0.6}
            height={12}
          />
        )}
        {!compact && (
          <YAxis 
            domain={domain} 
            tick={{fontSize: 10}} 
            tickFormatter={(value) => value.toFixed(5)}
            width={38}
            stroke="#666"
            opacity={0.6}
          />
        )}
        <Tooltip 
          formatter={(value: number) => [`$${value.toFixed(6)}`, "Price"]}
          labelFormatter={(label) => {
            // Convert index to time representation based on timeframe
            let time = "";
            if (timeframe === '24h') {
              time = `${label}:00`;
            } else if (timeframe === '7d') {
              time = `Day ${Math.floor(label/24) + 1}, ${label % 24}:00`;
            } else {
              time = `Day ${label + 1}`;
            }
            return time;
          }}
          contentStyle={{
            backgroundColor: '#1A1F2C',
            borderColor: '#374151',
            borderRadius: '4px',
            fontSize: '12px'
          }}
        />
        <Area 
          type="monotone" 
          dataKey="price" 
          stroke={strokeColor} 
          strokeWidth={compact ? 1 : 2}
          fillOpacity={1} 
          fill="url(#colorPrice)" 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TokenPriceChart;
