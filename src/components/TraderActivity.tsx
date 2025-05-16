import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface TraderActivityProps {
  symbol?: string;
  tokenSymbol?: string;
  updateInterval?: number; // in milliseconds
}

interface ActivityItem {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  timestamp: Date;
  price: number;
  walletAddress?: string;
}

const TraderActivity: React.FC<TraderActivityProps> = ({ 
  symbol, 
  tokenSymbol,
  updateInterval = 1000 // Default to 1 second for more frequent updates
}) => {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Helper function to generate random activity
  const generateRandomActivity = (): ActivityItem => {
    const types: ('buy' | 'sell')[] = ['buy', 'sell'];
    const type = types[Math.floor(Math.random() * types.length)];
    const now = new Date();
    
    return {
      id: Math.random().toString(36).substring(2, 9),
      type,
      amount: Math.floor(Math.random() * 5000) + 100,
      timestamp: new Date(now.getTime() - Math.floor(Math.random() * 900000)), // Random time within last 15 minutes
      price: parseFloat((Math.random() * 0.002 + 0.001).toFixed(6)),
      walletAddress: `${Math.random().toString(36).substring(2, 6)}...${Math.random().toString(36).substring(2, 6)}`
    };
  };

  // Initialize with some activities
  useEffect(() => {
    const initialActivities: ActivityItem[] = [];
    for (let i = 0; i < 7; i++) {
      initialActivities.push(generateRandomActivity());
    }
    
    // Sort by most recent
    initialActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setActivities(initialActivities);
  }, [symbol, tokenSymbol]);

  // Update activities periodically
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        // Generate new activity
        const newActivity = generateRandomActivity();
        
        setActivities(prev => {
          const updated = [newActivity, ...prev];
          // Keep only the most recent 7 activities
          return updated.slice(0, 7).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        });
        
        setLastUpdate(new Date());
      } catch (error) {
        console.error("Error updating trader activity:", error);
      }
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval, symbol, tokenSymbol]);

  // Format time as "X minutes ago" with safety check
  const formatTime = (timestamp: Date) => {
    try {
      return formatDistanceToNow(timestamp, { addSuffix: true });
    } catch (error) {
      console.error("Error formatting time:", error);
      return "recently";
    }
  };

  // Format amount with proper separators and safety check
  const formatAmount = (amount: number) => {
    if (amount === undefined || amount === null) return "0";
    try {
      return amount.toLocaleString();
    } catch (error) {
      console.error("Error formatting amount:", error);
      return amount.toString();
    }
  };

  return (
    <Card className="bg-black/30 border-gray-800">
      <CardContent className="space-y-3 p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-medium">Recent Trading Activity</h3>
          <span className="text-xs text-gray-400">
            Updated {lastUpdate ? formatTime(lastUpdate) : 'just now'}
          </span>
        </div>
        
        <div className="space-y-2 mt-2">
          {activities.map((activity) => (
            <div key={activity.id} className="flex justify-between items-center p-2 rounded-md bg-black/40 hover:bg-black/50 transition-colors">
              <div className="flex items-center">
                <div className={`rounded-full p-1 mr-2 ${activity.type === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                  {activity.type === 'buy' ? (
                    <TrendingUp className="h-3 w-3 text-green-500" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500" />
                  )}
                </div>
                <div>
                  <div className="flex items-center">
                    <span className={activity.type === 'buy' ? "text-green-500" : "text-red-500"}>
                      {activity.type === 'buy' ? "Buy" : "Sell"}
                    </span>
                    <span className="text-gray-400 mx-2">•</span>
                    <span className="text-gray-400 text-xs">
                      {activity.timestamp ? formatTime(activity.timestamp) : 'recently'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">{activity.walletAddress || 'Unknown'}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium">{formatAmount(activity.amount)} <span className="text-sm">{tokenSymbol || symbol || "WYBE"}</span></div>
                <div className="text-xs text-gray-400">@ {activity.price?.toFixed(6) || '0.000000'} SOL</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TraderActivity;
