
import React, { useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const BondingCurveChart: React.FC = () => {
  // Generate curve data points
  const generateCurveData = () => {
    const data = [];
    // Bonding curve formula: y = (x/10000)^2 + 0.01
    for (let i = 0; i <= 100; i += 5) {
      const supply = i * 5000;
      const price = Math.pow(supply / 10000, 2) + 0.01;
      data.push({
        supply,
        price: price,
        marketCap: supply * price
      });
    }
    return data;
  };

  const curveData = generateCurveData();
  const animationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (animationRef.current) {
      // Add animation effect
      const element = animationRef.current;
      element.classList.add('animate-pulse');
      
      return () => {
        element.classList.remove('animate-pulse');
      };
    }
  }, []);

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-indigo-950/80 border border-indigo-400/30 rounded p-2 text-xs backdrop-blur-md">
          <p className="font-medium text-indigo-200">
            Supply: {payload[0].payload.supply.toLocaleString()} tokens
          </p>
          <p className="text-gray-300">
            Price: {payload[0].payload.price.toFixed(5)} SOL
          </p>
          <p className="text-gray-300">
            Market Cap: ${(payload[0].payload.marketCap).toLocaleString()}
          </p>
        </div>
      );
    }
    
    return null;
  };

  return (
    <motion.div
      ref={animationRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={curveData}
          margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
        >
          <defs>
            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="supply"
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            tickFormatter={(value) => `${value/1000}k`}
            axisLine={{ stroke: '#374151' }}
            tickLine={{ stroke: '#374151' }}
          />
          <YAxis 
            tick={{ fill: '#9ca3af', fontSize: 10 }}
            axisLine={{ stroke: '#374151' }}
            tickLine={{ stroke: '#374151' }}
            tickFormatter={(value) => `${value.toFixed(3)}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="price" 
            stroke="#9b87f5"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#7e69ab', stroke: '#9b87f5' }}
          />
        </LineChart>
      </ResponsiveContainer>
      
      <div className="flex justify-around mt-1 text-xs">
        <div className="text-center">
          <div className="text-gray-400">Start</div>
          <div className="font-medium">0.01 SOL</div>
        </div>
        <div className="text-center">
          <div className="text-gray-400">$50k Cap</div>
          <div className="font-medium">{Math.pow(500000 / 10000, 2) + 0.01} SOL</div>
        </div>
      </div>
    </motion.div>
  );
};

export default BondingCurveChart;
