
import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import { CircleDollarSign } from 'lucide-react';

interface BondingCurveVisualizerProps {
  initialPrice: number;
  currentSupply: number;
  curveType?: 'linear' | 'quadratic' | 'exponential';
  estimatedImpact?: number;
}

const BondingCurveVisualizer: React.FC<BondingCurveVisualizerProps> = ({ 
  initialPrice,
  curveType = 'linear',
  estimatedImpact
}) => {
  // Create simplified data for a loading line
  const lineData = Array(20).fill(0).map((_, i) => ({
    x: i,
    y: i % 3 === 0 ? 10 + Math.random() * 5 : 10 - Math.random() * 5
  }));
  
  return (
    <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2 h-full">
      <div className="text-xs uppercase font-medium text-gray-400 mb-2">Bonding Curve</div>
      <div className="flex items-center mb-2">
        <div className="text-xs text-gray-400">
          <span className="font-medium">Type: </span>
          <span className="capitalize">{curveType}</span>
          {estimatedImpact && (
            <span className="ml-3 text-orange-400">Est. Price Impact: {estimatedImpact.toFixed(2)}%</span>
          )}
        </div>
      </div>
      
      <div className="relative h-[120px]">
        <motion.div 
          className="w-full h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
              <Line 
                type="monotone" 
                dataKey="y" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
        
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex items-center text-purple-500 bg-[#0F1118]/80 px-3 py-1 rounded-full border border-purple-500/30">
            <CircleDollarSign className="h-4 w-4 mr-1" />
            <span className="text-sm font-medium">Dynamic Pricing</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between mt-2 text-xs text-gray-400">
        <div>Low Supply</div>
        <div>High Supply</div>
      </div>
    </div>
  );
};

export default BondingCurveVisualizer;
