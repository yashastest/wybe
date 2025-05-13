
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import { Loader } from "lucide-react";

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

interface BondingCurveChartProps {
  curveType?: "linear" | "exponential" | "sigmoid";
  height?: number;
  animated?: boolean;
}

const BondingCurveChart = ({ 
  curveType = "linear", 
  height = 300,
  animated = true 
}: BondingCurveChartProps) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsRendered(false);
    
    // Simulate loading delay for better UX with animations
    const timer = setTimeout(() => {
      setData(generateBondingCurveData(curveType));
      setIsLoading(false);
      
      // Add a delay before showing the chart for animation
      setTimeout(() => setIsRendered(true), 300);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [curveType]);

  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass-card p-3 border-0 shadow-glow-sm text-xs">
          <p className="mb-1 font-medium text-wybe-primary">Supply Details:</p>
          <p>Supply: {payload[0].payload.supplySold} tokens</p>
          <p>Supply %: {payload[0].payload.supplyPercentage}%</p>
          <p>Price: {payload[0].payload.displayPrice} SOL</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ height: `${height}px` }}>
        <div className="flex flex-col items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader size={24} className="text-wybe-primary" />
          </motion.div>
          <p className="text-sm text-wybe-primary">Loading bonding curve data...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="w-full"
      style={{ height: `${height}px` }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isRendered ? 1 : 0 }}
      transition={{ duration: 0.5 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 10,
            right: 10,
            left: 10,
            bottom: 10,
          }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
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
          {animated ? (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                fill="url(#colorPrice)" 
                filter="url(#glow)"
                activeDot={{ 
                  r: 6, 
                  fill: '#C4B5FD', 
                  stroke: '#8B5CF6', 
                  strokeWidth: 2,
                  className: "animate-pulse-glow"
                }}
              />
            </motion.g>
          ) : (
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#8B5CF6" 
              strokeWidth={3}
              fill="url(#colorPrice)" 
              activeDot={{ 
                r: 6, 
                fill: '#C4B5FD', 
                stroke: '#8B5CF6', 
                strokeWidth: 2 
              }}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default BondingCurveChart;
