import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  TooltipProps,
} from "recharts";

// Generate data for a bonding curve (price increases as supply sold increases)
const generateBondingCurveData = (curveType = "linear") => {
  const data = [];
  const maxSupply = 1000000000; // 1B total supply
  const initialPrice = 0.0001; // Initial token price in SOL
  
  for (let i = 0; i <= 20; i++) {
    const supplyPercentage = i * 5; // 0%, 5%, 10%... 100%
    const supplySold = (supplyPercentage / 100) * maxSupply;
    
    let price;
    if (curveType === "linear") {
      // Linear curve: price = initialPrice * (1 + supplyPercentage/100)
      price = initialPrice * (1 + supplyPercentage / 100);
    } else if (curveType === "exponential") {
      // Exponential curve: price = initialPrice * e^(supplyPercentage/100)
      price = initialPrice * Math.exp(supplyPercentage / 100);
    } else if (curveType === "sigmoid") {
      // Sigmoid curve
      price = initialPrice * (1 + 3 / (1 + Math.exp(-0.1 * (supplyPercentage - 50))));
    }
    
    data.push({
      supplyPercentage,
      supplySold: Math.round(supplySold).toLocaleString(),
      price,
      displayPrice: price.toFixed(6),
    });
  }
  
  return data;
};

// Define interface for the tooltip props to fix type error
interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const BondingCurveChart = ({ curveType = "linear" }) => {
  const [data] = useState(generateBondingCurveData(curveType));

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border-0 shadow-glow-sm text-xs">
          <p>Supply: {payload[0].payload.supplySold} tokens</p>
          <p>Supply %: {payload[0].payload.supplyPercentage}%</p>
          <p>Price: {payload[0].payload.displayPrice} SOL</p>
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
          dataKey="supplyPercentage" 
          tickFormatter={(value) => `${value}%`}
          stroke="#666"
          tick={{ fill: '#999', fontSize: 12 }}
          label={{ 
            value: 'Supply Sold (%)', 
            position: 'insideBottom', 
            offset: -5,
            fill: '#999',
            fontSize: 12
          }}
        />
        <YAxis 
          tickFormatter={(value) => value.toFixed(6)} 
          stroke="#666"
          tick={{ fill: '#999', fontSize: 12 }}
          label={{
            value: 'Price (SOL)',
            angle: -90,
            position: 'insideLeft',
            fill: '#999',
            fontSize: 12
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area 
          type="monotone" 
          dataKey="price" 
          stroke="#8B5CF6" 
          strokeWidth={3}
          fill="url(#colorPrice)" 
          activeDot={{ r: 6, fill: '#C4B5FD', stroke: '#8B5CF6', strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default BondingCurveChart;
