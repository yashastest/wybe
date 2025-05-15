
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { Info } from 'lucide-react';
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TokenBondingCurveProps {
  tokenSymbol: string;
  curveType?: 'linear' | 'exponential' | 'logarithmic';
  currentPrice?: number;
  currentSupply?: number;
}

const TokenBondingCurve: React.FC<TokenBondingCurveProps> = ({
  tokenSymbol,
  curveType = 'linear',
  currentPrice = 0.0015,
  currentSupply = 1000000
}) => {
  // Generate data for the bonding curve based on the curve type
  const generateCurveData = () => {
    const data = [];
    const maxSupply = currentSupply * 2; // Show curve up to double the current supply
    const step = maxSupply / 20; // 20 data points
    
    for (let supply = 0; supply <= maxSupply; supply += step) {
      let price;
      
      switch (curveType) {
        case 'exponential':
          price = (Math.pow(supply / 10000, 2) + 0.01) * 0.1;
          break;
        case 'logarithmic':
          price = (Math.log(Math.max(supply, 1) / 1000) + 0.01) * 0.3;
          break;
        case 'linear':
        default:
          price = (supply / 10000 + 0.01) * 0.2;
          break;
      }
      
      data.push({
        supply,
        price: Math.max(0, price) // Ensure price is not negative
      });
    }
    
    return data;
  };
  
  const curveData = generateCurveData();
  
  // Find the closest data point to the current supply
  const currentPoint = curveData.find(point => 
    Math.abs(point.supply - currentSupply) < currentSupply / 20
  ) || { supply: currentSupply, price: currentPrice };
  
  return (
    <Card className="bg-black/30 border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span>{tokenSymbol} Bonding Curve</span>
          <TooltipProvider>
            <UITooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  The bonding curve shows the relationship between token supply and price.
                  As more tokens are bought, the price increases according to the curve.
                </p>
              </TooltipContent>
            </UITooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs mb-2">
          <span className="font-medium">Curve Type: </span>
          <span className="text-gray-300 capitalize">{curveType}</span>
        </div>
        
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={curveData}
              margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="supply" 
                tickFormatter={value => `${(value / 1000000).toFixed(1)}M`}
                stroke="#71717a"
                fontSize={10}
              />
              <YAxis 
                tickFormatter={value => `$${value.toFixed(4)}`}
                stroke="#71717a"
                fontSize={10}
                width={60}
              />
              <Tooltip
                formatter={(value: number) => [`$${value.toFixed(6)}`, 'Price']}
                labelFormatter={(supply) => `Supply: ${(supply / 1000).toFixed(1)}K tokens`}
                contentStyle={{ backgroundColor: '#1e1e2d', borderColor: '#383854' }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
                animationDuration={1000}
                fill="url(#colorPrice)"
              />
              <ReferenceDot
                x={currentPoint.supply}
                y={currentPoint.price}
                r={4}
                fill="#16a34a"
                stroke="#22c55e"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
          <div className="bg-black/30 p-2 rounded-md">
            <div className="text-gray-400">Current Supply</div>
            <div className="font-medium">{(currentSupply / 1000).toFixed(2)}K tokens</div>
          </div>
          <div className="bg-black/30 p-2 rounded-md">
            <div className="text-gray-400">Current Price</div>
            <div className="font-medium">${currentPrice.toFixed(6)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TokenBondingCurve;
