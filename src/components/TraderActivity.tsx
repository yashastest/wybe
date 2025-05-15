
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowDown, 
  ArrowUp, 
  CircleDollarSign, 
  Wallet, 
  Users, 
  BadgeDollarSign, 
  CircleAlert 
} from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Types for trader activities
interface TraderActivity {
  id: string;
  type: 'buy' | 'sell' | 'mint' | 'claim';
  traderType: 'whale' | 'retail' | 'developer';
  wallet: string;
  amount: number;
  timestamp: Date;
  price: number;
  tokenSymbol?: string;
}

interface TraderActivityProps {
  tokenSymbol?: string;
  maxHeight?: string;
  className?: string;
  limit?: number;
  showTitle?: boolean;
}

const TraderActivity: React.FC<TraderActivityProps> = ({ 
  tokenSymbol = 'TOKEN',
  maxHeight = '400px',
  className = '',
  limit = 20,
  showTitle = true
}) => {
  const [activities, setActivities] = useState<TraderActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Generate sample data for demo purposes
    setIsLoading(true);
    generateActivities();
    setTimeout(() => setIsLoading(false), 500);
  }, [tokenSymbol, limit]);

  const generateActivities = () => {
    const activityTypes: ('buy' | 'sell' | 'mint' | 'claim')[] = ['buy', 'sell', 'mint', 'claim'];
    const traderTypes: ('whale' | 'retail' | 'developer')[] = ['whale', 'retail', 'developer'];
    const walletPrefixes = ['Wybe', 'Sol', 'Trade', 'Degen'];
    
    const generatedActivities: TraderActivity[] = [];
    const activityCount = Math.min(limit, 50); // Limit to reasonable number
    
    for (let i = 0; i < activityCount; i++) {
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
      
      generatedActivities.push({
        id: `activity-${i}-${Date.now()}`,
        type,
        traderType,
        wallet,
        amount,
        timestamp,
        price: 0.00023 * (1 + (Math.random() * 0.1 - 0.05)), // Price with ±5% variation
        tokenSymbol
      });
    }
    
    // Sort by timestamp, most recent first
    generatedActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    setActivities(generatedActivities);
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

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center py-8 ${className}`}>
        <div className="w-8 h-8 border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {showTitle && <h3 className="text-base font-semibold mb-3">Live Activity</h3>}
      <div className="space-y-2" style={{ maxHeight, overflowY: 'auto' }}>
        {activities.map((activity, index) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-2.5 rounded-lg flex items-center gap-2 border ${
              activity.traderType === 'whale' 
                ? 'bg-blue-900/30 border-blue-500/30' 
                : activity.traderType === 'developer'
                ? 'bg-purple-900/30 border-purple-500/30'
                : 'bg-gray-800/60 border-gray-700/30'
            }`}
          >
            <div className={`p-1.5 rounded-full ${getActivityBackgroundColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between">
                <div className="text-sm font-medium truncate">
                  {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} {activity.tokenSymbol || tokenSymbol}
                </div>
                <div className="text-xs text-gray-400">
                  {formatTimeAgo(activity.timestamp)}
                </div>
              </div>
              <div className="flex justify-between mt-0.5">
                <div className="text-xs text-gray-400 flex items-center">
                  <span className="truncate max-w-[100px]">{activity.wallet}</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className={`ml-2 px-1.5 py-0.5 rounded text-[10px] flex items-center gap-0.5 ${
                          activity.traderType === 'whale'
                            ? 'bg-blue-500/30 text-blue-300'
                            : activity.traderType === 'developer'
                            ? 'bg-purple-500/30 text-purple-300'
                            : 'bg-gray-700/50 text-gray-300'
                        }`}>
                          {getTraderTypeIcon(activity.traderType)}
                          {activity.traderType}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="text-xs">
                          {activity.traderType === 'whale' && 'Large holder - Trades >$50k'}
                          {activity.traderType === 'developer' && 'Project developer or insider'}
                          {activity.traderType === 'retail' && 'Regular trader - Trades <$5k'}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className="font-mono text-sm">
                  {activity.amount.toLocaleString()} {activity.tokenSymbol || tokenSymbol}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default TraderActivity;
