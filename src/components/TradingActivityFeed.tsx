
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface TradingActivityFeedProps {
  tokenSymbol: string;
}

interface TradeActivity {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: string;
}

const TradingActivityFeed: React.FC<TradingActivityFeedProps> = ({ tokenSymbol }) => {
  const [tradeActivities, setTradeActivities] = useState<TradeActivity[]>([
    { id: "1", type: 'buy', amount: 500, price: 0.0015, timestamp: '10:23 AM' },
    { id: "2", type: 'sell', amount: 200, price: 0.00148, timestamp: '10:19 AM' },
    { id: "3", type: 'buy', amount: 1000, price: 0.00145, timestamp: '10:15 AM' },
    { id: "4", type: 'sell', amount: 150, price: 0.00151, timestamp: '10:10 AM' },
    { id: "5", type: 'buy', amount: 750, price: 0.00147, timestamp: '10:05 AM' },
  ]);
  
  // Simulate new trades coming in
  useEffect(() => {
    const interval = setInterval(() => {
      // Generate random trade
      const newTrade = {
        id: Date.now().toString(),
        type: Math.random() > 0.5 ? 'buy' : 'sell',
        amount: Math.floor(Math.random() * 1000) + 100,
        price: 0.0015 + (Math.random() * 0.0001 - 0.00005),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setTradeActivities(prev => [newTrade, ...prev.slice(0, 9)]);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="space-y-1">
      {tradeActivities.map(activity => (
        <div 
          key={activity.id} 
          className="flex justify-between items-center p-1.5 rounded-md hover:bg-[#1A1F2C]/60 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded-full ${activity.type === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
              {activity.type === 'buy' ? (
                <ArrowUp className="h-3 w-3 text-green-400" />
              ) : (
                <ArrowDown className="h-3 w-3 text-red-400" />
              )}
            </div>
            <div className="flex flex-col">
              <div className="text-xs font-medium">
                {activity.amount} {tokenSymbol}
              </div>
              <div className="text-xs text-gray-400">Price: ${activity.price.toFixed(6)}</div>
            </div>
          </div>
          <div className="flex items-center">
            <Badge 
              variant="outline" 
              className={`text-xs border-0 ${
                activity.type === 'buy' 
                ? 'bg-green-500/10 text-green-400' 
                : 'bg-red-500/10 text-red-400'
              }`}
            >
              {activity.type.toUpperCase()}
            </Badge>
            <span className="text-xs text-gray-400 ml-2">{activity.timestamp}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TradingActivityFeed;
