
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DexScreenerListingProgressProps {
  tokenSymbol: string;
  progress: number; // 0-100
  status?: 'pending' | 'in_progress' | 'listed' | 'rejected';
  estimated_time?: string;
}

const DexScreenerListingProgress: React.FC<DexScreenerListingProgressProps> = ({
  tokenSymbol,
  progress,
  status = 'in_progress',
  estimated_time = '24-48 hours'
}) => {
  const getStatusColor = () => {
    switch(status) {
      case 'listed': return 'text-green-500';
      case 'rejected': return 'text-red-500';
      case 'in_progress': return 'text-yellow-500';
      default: return 'text-gray-500';
    }
  };
  
  const getStatusText = () => {
    switch(status) {
      case 'listed': return 'Listed';
      case 'rejected': return 'Rejected';
      case 'in_progress': return 'In Progress';
      default: return 'Pending';
    }
  };

  // Safety check for progress value
  const safeProgress = typeof progress === 'number' && !isNaN(progress) ? 
    Math.min(Math.max(0, progress), 100) : 0;
  
  return (
    <Card className="bg-black/30 border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center justify-between">
          <span>DEX Screener Listing</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  DEX Screener listing typically takes 24-48 hours after reaching minimum requirements of trading volume and liquidity.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xs">
              <span className={getStatusColor()}>•</span> {getStatusText()}
            </div>
            <div className="text-xs text-gray-400">
              Est. time: {estimated_time || '24-48 hours'}
            </div>
          </div>
          
          <Progress value={safeProgress} className="h-2" />
          
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Submitted</span>
            <span>Requirements Check</span>
            <span>Listed</span>
          </div>
          
          <div className="bg-black/30 p-2 rounded-md text-xs">
            <div className="font-medium mb-1">Requirements for {tokenSymbol || 'Token'}:</div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-gray-300">
              <div>• Min. 24h Volume: $10,000</div>
              <div className="text-yellow-500">In Progress (47%)</div>
              <div>• Min. Liquidity: $5,000</div>
              <div className="text-green-500">Complete (100%)</div>
              <div>• Contract Verified</div>
              <div className="text-green-500">Complete (100%)</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DexScreenerListingProgress;
