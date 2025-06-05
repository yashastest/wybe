
import React, { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// Generate mock historical data for a token with valid dates
const generateTokenHistoricalData = (symbol, daysBack = 30) => {
  const data = [];
  const today = new Date();
  let price = symbol === "PEPES" ? 0.00015 : 0.00035;
  const volatility = 0.1;
  
  for (let i = daysBack; i >= 0; i--) {
    try {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Validate the date before using it
      if (isNaN(date.getTime())) {
        console.warn('Invalid date generated for day:', i);
        continue;
      }
      
      // Add some random price movement
      const change = (Math.random() - 0.45) * volatility;
      price = Math.max(0.000001, price * (1 + change));
      
      // Generate volume
      const volume = Math.random() * 10000 + 5000;
      
      data.push({
        date: date.toLocaleDateString(),
        price,
        displayPrice: price.toFixed(6),
        volume,
        timestamp: date.getTime() // Add timestamp for validation
      });
    } catch (error) {
      console.error('Error generating data point for day:', i, error);
    }
  }
  
  // Filter out any invalid data points
  return data.filter(point => point.timestamp && !isNaN(point.timestamp));
};

// Define interface for the tooltip props to fix type error
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const TokenPerformanceChart = ({ symbol }) => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    try {
      const chartData = generateTokenHistoricalData(symbol);
      setData(chartData);
    } catch (error) {
      console.error('Error setting chart data:', error);
      setData([]); // Set empty data if there's an error
    }
  }, [symbol]);

  // Format the tooltip display
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      try {
        return (
          <div className="glass-card p-3 border-0 shadow-glow-sm text-xs">
            <p className="text-gray-300">{label || 'N/A'}</p>
            <p className="font-medium">Price: {payload[0]?.payload?.displayPrice || 'N/A'} SOL</p>
            <p>Volume: ${Math.round(payload[0]?.payload?.volume || 0).toLocaleString()}</p>
          </div>
        );
      } catch (error) {
        console.error('Error rendering tooltip:', error);
        return null;
      }
    }
    return null;
  };

  // Don't render if we have no data
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-400">
        No chart data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 5,
          right: 5,
          left: 5,
          bottom: 5,
        }}
      >
        <defs>
          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.2} />
        <XAxis 
          dataKey="date" 
          stroke="#666"
          tick={{ fill: '#999', fontSize: 11 }}
          tickFormatter={(value) => {
            try {
              const date = new Date(value);
              if (isNaN(date.getTime())) {
                return 'N/A';
              }
              return `${date.getDate()}/${date.getMonth() + 1}`;
            } catch (error) {
              console.error('Error formatting X axis tick:', error);
              return 'N/A';
            }
          }}
        />
        <YAxis 
          tickFormatter={(value) => {
            try {
              return typeof value === 'number' ? value.toFixed(5) : 'N/A';
            } catch (error) {
              console.error('Error formatting Y axis tick:', error);
              return 'N/A';
            }
          }}
          stroke="#666"
          tick={{ fill: '#999', fontSize: 11 }}
          domain={['auto', 'auto']}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area 
          type="monotone" 
          dataKey="price" 
          stroke="#8B5CF6" 
          strokeWidth={2}
          fill="url(#colorPrice)" 
          animationDuration={1000}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default TokenPerformanceChart;
