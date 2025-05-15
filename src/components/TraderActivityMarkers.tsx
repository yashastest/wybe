
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowUp, 
  ArrowDown, 
  CircleDollarSign, 
  Wallet, 
  Users, 
  CircleAlert, 
  BadgeDollarSign 
} from 'lucide-react';

// Types for trader activities
interface TraderActivity {
  id: string;
  type: 'buy' | 'sell' | 'mint' | 'claim';
  traderType: 'whale' | 'retail' | 'developer';
  wallet: string;
  amount: number;
  timestamp: Date;
  price: number;
}

interface TraderActivityMarkersProps {
  activities?: TraderActivity[];
  tokenSymbol?: string;
}

const TraderActivityMarkers: React.FC<TraderActivityMarkersProps> = ({ 
  activities = [], 
  tokenSymbol = 'TOKEN' 
}) => {
  const [sortedActivities, setSortedActivities] = useState<TraderActivity[]>([]);
  
  // If no activities are provided, generate demo data
  useEffect(() => {
    if (activities && activities.length > 0) {
      // Sort by timestamp, most recent first
      const sorted = [...activities].sort((a, b) => 
        b.timestamp.getTime() - a.timestamp.getTime()
      );
      setSortedActivities(sorted);
    } else {
      // Generate demo data
      generateDemoActivities();
    }
  }, [activities]);
  
  const generateDemoActivities = () => {
    const activityTypes: ('buy' | 'sell' | 'mint' | 'claim')[] = ['buy', 'sell', 'mint', 'claim'];
    const traderTypes: ('whale' | 'retail' | 'developer')[] = ['whale', 'retail', 'developer'];
    const walletPrefixes = ['Wybe', 'Sol', 'Trade', 'Degen'];
    
    const demoActivities: TraderActivity[] = [];
    
    for (let i = 0; i < 20; i++) {
      const type = activityTypes[Math.floor(Math.random() * activityTypes.length)];
      const traderType = traderTypes[Math.floor(Math.random() * traderTypes.length)];
      const walletPrefix = walletPrefixes[Math.floor(Math.random() * walletPrefixes.length)];
      const wallet = `${walletPrefix}${Math.random().toString(16).substring(2, 8)}`;
      
      // Generate an amount based on trader type
      let amount;
      switch(traderType) {
        case 'whale':
          amount = Math.floor(Math.random() * 100000) + 50000; // 50k-150k
          break;
        case 'developer':
          amount = Math.floor(Math.random() * 10000) + 5000; // 5k-15k
          break;
        default: // retail
          amount = Math.floor(Math.random() * 5000) + 100; // 100-5100
      }
      
      // Calculate time in the past (from 1 minute to 24 hours ago)
      const minutesAgo = Math.floor(Math.random() * 1440) + 1;
      const timestamp = new Date(Date.now() - (minutesAgo * 60 * 1000));
      
      demoActivities.push({
        id: `tx-${i}`,
        type,
        traderType,
        wallet,
        amount,
        timestamp,
        price: 0.00023 * (1 + (Math.random() * 0.1 - 0.05)) // Price with ±5% variation
      });
    }
    
    // Sort by timestamp, most recent first
    demoActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    setSortedActivities(demoActivities);
  };

  // Get the icon for a transaction type
  const getActivityIcon = (type: 'buy' | 'sell' | 'mint' | 'claim') => {
    switch (type) {
      case 'buy':
        return <ArrowUp size={16} />;
      case 'sell':
        return <ArrowDown size={16} />;
      case 'mint':
        return <CircleDollarSign size={16} />;
      case 'claim':
        return <Wallet size={16} />;
      default:
        return null;
    }
  };
  
  // Get the trader type icon
  const getTraderTypeIcon = (type: 'whale' | 'retail' | 'developer') => {
    switch (type) {
      case 'whale':
        return <BadgeDollarSign size={14} className="text-blue-300" />;
      case 'developer':
        return <CircleAlert size={14} className="text-purple-300" />;
      case 'retail':
        return <Users size={14} className="text-gray-300" />;
      default:
        return null;
    }
  };
  
  // Get background color for transaction type
  const getActivityBackgroundColor = (type: 'buy' | 'sell' | 'mint' | 'claim') => {
    switch (type) {
      case 'buy':
        return 'bg-green-500/20 text-green-400';
      case 'sell':
        return 'bg-red-500/20 text-red-400';
      case 'mint':
        return 'bg-blue-500/20 text-blue-400';
      case 'claim':
        return 'bg-yellow-500/20 text-yellow-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };
  
  // Format time relative to now
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSecs = Math.floor(diffMs / 1000);
    
    if (diffSecs < 60) return `${diffSecs}s ago`;
    
    const diffMins = Math.floor(diffSecs / 60);
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="py-2">
      {sortedActivities.length === 0 ? (
        <div className="flex items-center justify-center h-[300px]">
          <div className="text-center">
            <motion.div
              animate={{
                opacity: [0.7, 1, 0.7],
                scale: [1, 1.05, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Users size={48} className="mx-auto text-indigo-400 mb-2" />
            </motion.div>
            <h3 className="text-lg font-poppins font-bold mb-1">No Activity</h3>
            <p className="text-gray-400">There is no recent trading activity to display</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          {sortedActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`p-3 rounded-lg flex items-center gap-3 border ${
                activity.traderType === 'whale' 
                  ? 'bg-blue-900/30 border-blue-500/30' 
                  : activity.traderType === 'developer'
                  ? 'bg-purple-900/30 border-purple-500/30'
                  : 'bg-gray-800/60 border-gray-700/30'
              }`}
            >
              <div className={`p-2 rounded-full ${getActivityBackgroundColor(activity.type)}`}>
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <div className="text-sm font-medium">
                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} {tokenSymbol}
                  </div>
                  <div className="text-xs text-gray-400">
                    {formatTimeAgo(activity.timestamp)}
                  </div>
                </div>
                <div className="flex justify-between mt-1">
                  <div className="text-xs text-gray-400 flex items-center gap-1">
                    <span className="truncate max-w-[120px]">{activity.wallet}</span>
                    <span className={`ml-1 px-1.5 py-0.5 rounded text-[10px] flex items-center gap-1 ${
                      activity.traderType === 'whale'
                        ? 'bg-blue-500/20 text-blue-300'
                        : activity.traderType === 'developer'
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'bg-gray-700/50 text-gray-300'
                    }`}>
                      {getTraderTypeIcon(activity.traderType)}
                      {activity.traderType}
                    </span>
                  </div>
                  <div className="font-mono text-sm">
                    {activity.amount.toLocaleString()} {tokenSymbol}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TraderActivityMarkers;
