
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

// Generate mock historical data for a token
const generateTokenHistoricalData = (symbol, daysBack = 30) => {
  const data = [];
  const today = new Date();
  let price = symbol === "PEPES" ? 0.00015 : 0.00035;
  const volatility = 0.1;
  
  for (let i = daysBack; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Add some random price movement
    const change = (Math.random() - 0.45) * volatility;
    price = Math.max(0.000001, price * (1 + change));
    
    // Generate volume
    const volume = Math.random() * 10000 + 5000;
    
    data.push({
      date: date.toLocaleDateString(),
      price,
      displayPrice: price.toFixed(6),
      volume
    });
  }
  
  return data;
};

const TokenPerformanceChart = ({ symbol }) => {
  const [data, setData] = useState([]);
  
  useEffect(() => {
    setData(generateTokenHistoricalData(symbol));
  }, [symbol]);

  // Format the tooltip display
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border-0 shadow-glow-sm text-xs">
          <p className="text-gray-300">{label}</p>
          <p className="font-medium">Price: {payload[0].payload.displayPrice} SOL</p>
          <p>Volume: ${Math.round(payload[0].payload.volume).toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

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
            const date = new Date(value);
            return `${date.getDate()}/${date.getMonth() + 1}`;
          }}
        />
        <YAxis 
          tickFormatter={(value) => value.toFixed(5)}
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
