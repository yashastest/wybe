
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface TraderActivityProps {
  symbol?: string;
  tokenSymbol?: string;
}

const TraderActivity: React.FC<TraderActivityProps> = ({ symbol, tokenSymbol }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-base font-medium">Recent Trading Activity</h3>
      
      <div className="space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex justify-between items-center p-2 text-sm bg-black/20 rounded-md">
            <div>
              <span className={i % 2 === 0 ? "text-green-500" : "text-red-500"}>
                {i % 2 === 0 ? "Buy" : "Sell"}
              </span>
              <span className="text-gray-400 ml-2">
                {new Date(Date.now() - i * 15 * 60000).toLocaleTimeString()}
              </span>
            </div>
            <div>
              <span className="font-medium">{(Math.random() * 1000).toFixed(2)} {tokenSymbol || symbol || "WYBE"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TraderActivity;
