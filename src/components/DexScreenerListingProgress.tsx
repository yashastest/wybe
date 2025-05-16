
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Check, Clock, AlertCircle, InfoIcon } from 'lucide-react';

interface DexScreenerListingProgressProps {
  tokenSymbol: string;
  progress: number;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  marketCap?: number;
}

const DexScreenerListingProgress: React.FC<DexScreenerListingProgressProps> = ({
  tokenSymbol,
  progress,
  status,
  marketCap
}) => {
  // Status messages and icons
  const statusConfig = {
    pending: {
      icon: <Clock className="h-4 w-4 text-orange-500" />,
      message: "Awaiting $50K market cap",
      tooltip: `${tokenSymbol} needs to reach $50K market cap before it can be listed on DexScreener.`
    },
    in_progress: {
      icon: <Clock className="h-4 w-4 text-green-500 animate-pulse" />,
      message: `${progress}% complete`,
      tooltip: "Listing in progress. This process typically takes 24-48 hours once requirements are met."
    },
    completed: {
      icon: <Check className="h-4 w-4 text-green-500" />,
      message: "Listed on DexScreener",
      tooltip: `${tokenSymbol} is now visible on DexScreener trading charts and data feeds.`
    },
    failed: {
      icon: <AlertCircle className="h-4 w-4 text-red-500" />,
      message: "Listing requirements not met",
      tooltip: "Token needs to maintain sufficient liquidity and market cap for listing."
    }
  };
  
  const { icon, message, tooltip } = statusConfig[status];
  
  // Calculate progress percentage
  const progressValue = status === 'completed' ? 100 : progress;
  
  // Calculate market cap progress towards $50K if available
  const marketCapText = marketCap 
    ? `$${marketCap.toLocaleString()} / $50,000` 
    : status === 'completed' 
      ? 'Requirements met'
      : '$50K required';
  
  return (
    <Card className="border-white/10 bg-wybe-background/80 backdrop-blur-sm shadow-md overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <span className="text-sm font-medium">DexScreener Listing</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon size={14} className="ml-1.5 text-gray-500 cursor-help" />
                </TooltipTrigger>
                <TooltipContent className="bg-wybe-background-light border-gray-700">
                  {tooltip}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-1.5">
            {icon}
            <span className={`text-xs ${
              status === 'completed' ? 'text-green-500' :
              status === 'failed' ? 'text-red-500' :
              status === 'in_progress' ? 'text-green-400' :
              'text-gray-400'
            }`}>
              {message}
            </span>
          </div>
        </div>
        
        <Progress value={progressValue} className="h-1.5 mb-2 bg-gray-800">
          <div 
            className={`h-full transition-all ${
              status === 'completed' ? 'bg-green-500' :
              status === 'in_progress' ? 'bg-green-500' :
              'bg-orange-500'
            }`} 
            style={{ width: `${progressValue}%` }}
          />
        </Progress>
        
        <div className="text-xs text-gray-400 flex justify-between">
          <span>{tokenSymbol}</span>
          <span>{marketCapText}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default DexScreenerListingProgress;
