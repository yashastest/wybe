
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateBondingCurvePoints } from '@/utils/tradeUtils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface BondingCurveVisualizerProps {
  initialPrice: number;
  currentSupply: number;
  curveType?: 'linear' | 'quadratic' | 'exponential';
  estimatedImpact?: number;
}

const BondingCurveVisualizer: React.FC<BondingCurveVisualizerProps> = ({ 
  initialPrice,
  currentSupply,
  curveType = 'linear',
  estimatedImpact
}) => {
  // Generate data points for the bonding curve
  const curvePoints = generateBondingCurvePoints(initialPrice, currentSupply, 20, curveType);
  
  // Format for recharts
  const data = curvePoints.map(point => ({
    supply: point.supply,
    price: point.price
  }));
  
  // Add current position marker
  const currentPoint = {
    supply: currentSupply,
    price: initialPrice
  };
  
  // Add estimated impact position if provided
  const impactPoint = estimatedImpact ? {
    supply: currentSupply * (1 + estimatedImpact / 100),
    price: initialPrice * (1 + estimatedImpact / 50) // Simplified impact calculation
  } : null;
  
  return (
    <Card className="bg-[#0F1118] border border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <span className="text-[#8B5CF6] mr-2">📊</span> Bonding Curve
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-gray-400 mb-2 flex justify-between">
          <div>Curve Type: {curveType.charAt(0).toUpperCase() + curveType.slice(1)}</div>
          {estimatedImpact && (
            <div className="text-orange-400">Est. Price Impact: {estimatedImpact.toFixed(2)}%</div>
          )}
        </div>
        
        <motion.div 
          className="w-full h-48"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <XAxis 
                dataKey="supply" 
                tick={{ fontSize: 10 }} 
                tickFormatter={(value) => Math.round(value).toLocaleString()}
                stroke="#4B5563"
                axisLine={{ stroke: '#4B5563' }}
                tickLine={{ stroke: '#4B5563' }}
              />
              <YAxis 
                tick={{ fontSize: 10 }} 
                tickFormatter={(value) => `$${value.toFixed(4)}`}
                width={60}
                stroke="#4B5563"
                axisLine={{ stroke: '#4B5563' }}
                tickLine={{ stroke: '#4B5563' }}
              />
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#1A1F2C] border border-gray-700 rounded p-2 text-xs">
                        <p>Supply: {Number(payload[0].payload.supply).toLocaleString()}</p>
                        <p>Price: ${Number(payload[0].payload.price).toFixed(6)}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
              
              {/* Current position dot */}
              <Line 
                data={[currentPoint]} 
                type="monotone" 
                dataKey="price" 
                stroke="none"
                strokeWidth={0}
                dot={{ 
                  r: 4, 
                  fill: '#10B981',
                  stroke: '#10B981',
                  strokeWidth: 2
                }}
              />
              
              {/* Impact point if available */}
              {impactPoint && (
                <Line 
                  data={[impactPoint]} 
                  type="monotone" 
                  dataKey="price" 
                  stroke="none"
                  strokeWidth={0}
                  dot={{ 
                    r: 4, 
                    fill: '#EF4444',
                    stroke: '#EF4444',
                    strokeWidth: 2
                  }}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
        
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <div>Current Supply</div>
          <div>Increasing Supply →</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BondingCurveVisualizer;
