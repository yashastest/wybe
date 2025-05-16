
import React, { useState } from 'react';
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
import { Button } from './ui/button';
import { TrendingUp, BarChart2 } from 'lucide-react';

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
  const [chartType, setChartType] = useState<'price' | 'marketCap'>('price');
  
  // Mock data - In a real app, this would be fetched from an API
  const generateMockData = () => {
    const data = [];
    const startPrice = Math.random() * 0.1;
    let lastPrice = startPrice;
    const startMarketCap = startPrice * 1000000; // Mock market cap based on price
    let lastMarketCap = startMarketCap;
    
    const pointCount = timeframe === '24h' ? 24 : 
                       timeframe === '7d' ? 7 * 24 : 
                       timeframe === '30d' ? 30 : 90;
                       
    for (let i = 0; i < pointCount; i++) {
      const priceChange = (Math.random() - 0.48) * 0.01;
      lastPrice = Math.max(0.0001, lastPrice + priceChange);
      
      // Market cap tends to follow price but can have its own variations
      const mcVariation = (Math.random() - 0.5) * 0.005;
      lastMarketCap = lastPrice * (1000000 + (i * 1000)) * (1 + mcVariation);
      
      data.push({
        time: i,
        price: lastPrice,
        marketCap: lastMarketCap
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
  
  // Get min and max for better chart scaling based on chart type
  const dataKey = chartType === 'price' ? 'price' : 'marketCap';
  const minValue = Math.min(...chartData.map(d => d[dataKey]));
  const maxValue = Math.max(...chartData.map(d => d[dataKey]));
  const domain = [minValue - (minValue * 0.05), maxValue + (maxValue * 0.05)];
  
  // Determine color based on trend
  const startValue = chartData[0]?.[dataKey] || 0;
  const endValue = chartData[chartData.length - 1]?.[dataKey] || 0;
  const strokeColor = endValue >= startValue ? "#22c55e" : "#ef4444";

  if (isLoading) {
    return <Skeleton className="w-full h-full" />;
  }

  return (
    <div className="w-full h-full">
      {!compact && (
        <div className="flex justify-end mb-1">
          <div className="bg-[#1A1F2C]/80 border border-gray-700/30 rounded-md flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className={`h-6 px-2 py-0 rounded-l-md ${chartType === 'price' ? 
                'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setChartType('price')}
            >
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Price</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-6 px-2 py-0 rounded-r-md ${chartType === 'marketCap' ? 
                'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
              onClick={() => setChartType('marketCap')}
            >
              <BarChart2 className="h-3.5 w-3.5 mr-1" />
              <span className="text-xs">Market Cap</span>
            </Button>
          </div>
        </div>
      )}
      
      <ResponsiveContainer width="100%" height={compact ? height : "calc(100% - 24px)"}>
        <AreaChart 
          data={chartData} 
          margin={compact ? { top: 0, right: 0, left: 0, bottom: 0 } : { top: 2, right: 2, left: 2, bottom: 2 }}
        >
          <defs>
            <linearGradient id="colorChart" x1="0" y1="0" x2="0" y2="1">
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
              tickFormatter={(value) => chartType === 'price' ? 
                value.toFixed(5) : 
                (value / 1000000).toFixed(2) + 'M'}
              width={38}
              stroke="#666"
              opacity={0.6}
            />
          )}
          <Tooltip 
            formatter={(value: number) => {
              if (chartType === 'price') {
                return [`$${value.toFixed(6)}`, "Price"];
              } else {
                return [`$${(value / 1000000).toFixed(2)}M`, "Market Cap"];
              }
            }}
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
            dataKey={dataKey} 
            stroke={strokeColor} 
            strokeWidth={compact ? 1 : 2}
            fillOpacity={1} 
            fill="url(#colorChart)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TokenPriceChart;
