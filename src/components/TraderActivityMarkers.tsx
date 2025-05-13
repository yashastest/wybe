
import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Define types for trader activity
export type ActivityType = 'developer' | 'retail' | 'whale';

export interface TraderActivity {
  type: ActivityType;
  price: number;
  timestamp: string;
  action: 'buy' | 'sell';
  quantity: number;
  percentage?: number; // For developer holdings
}

const getEmojiByType = (type: ActivityType, action?: 'buy' | 'sell') => {
  switch(type) {
    case 'developer':
      return '👨‍💻';
    case 'retail':
      return action === 'sell' ? '🐑' : '👤';
    case 'whale':
      return action === 'sell' ? '🐳' : '🐋';
    default:
      return '👤';
  }
};

interface TraderActivityMarkersProps {
  activities: TraderActivity[];
  showDetail?: boolean;
}

const TraderActivityMarkers: React.FC<TraderActivityMarkersProps> = ({ 
  activities,
  showDetail = true
}) => {
  if (!activities || activities.length === 0) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap gap-2 p-2">
      <TooltipProvider>
        {activities.map((activity, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <div 
                className={`cursor-pointer text-xl ${
                  activity.action === 'buy' ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {getEmojiByType(activity.type, activity.action)}
              </div>
            </TooltipTrigger>
            {showDetail && (
              <TooltipContent 
                side="top"
                className="bg-wybe-background-light border-wybe-primary/20 p-3"
              >
                <div className="text-sm">
                  <p className="font-bold mb-1">
                    {activity.type === 'developer' ? 'Developer' : 
                      activity.type === 'whale' ? 'Whale' : 'Retail'} 
                    {' '}{activity.action === 'buy' ? 'Bought' : 'Sold'}
                  </p>
                  <p><span className="text-gray-400">Price:</span> {activity.price} SOL</p>
                  <p><span className="text-gray-400">Quantity:</span> {activity.quantity.toLocaleString()}</p>
                  <p><span className="text-gray-400">Date:</span> {new Date(activity.timestamp).toLocaleDateString()}</p>
                  {activity.type === 'developer' && activity.percentage !== undefined && (
                    <p><span className="text-gray-400">Holdings:</span> {activity.percentage}%</p>
                  )}
                </div>
              </TooltipContent>
            )}
          </Tooltip>
        ))}
      </TooltipProvider>
    </div>
  );
};

export default TraderActivityMarkers;
