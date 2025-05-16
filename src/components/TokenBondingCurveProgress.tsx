
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TokenBondingCurveProgressProps {
  tokenSymbol: string;
  progress: number; // Progress as a percentage (0-100)
  currentPrice: number;
  targetPrice: number;
}

const TokenBondingCurveProgress: React.FC<TokenBondingCurveProgressProps> = ({
  tokenSymbol,
  progress,
  currentPrice,
  targetPrice
}) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium">{tokenSymbol} Bonding Curve</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  The bonding curve shows how token price increases as more tokens are bought.
                  Current progress: {progress}% towards next price milestone.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <span className="text-xs text-gray-400">{progress}%</span>
      </div>
      
      <Progress value={progress} className="h-2 bg-gray-800" />
      
      <div className="flex justify-between text-xs">
        <div>
          <div className="text-gray-400">Current Price</div>
          <div className="font-medium">${currentPrice.toFixed(6)}</div>
        </div>
        <div className="text-right">
          <div className="text-gray-400">Target Price</div>
          <div className="font-medium">${targetPrice.toFixed(6)}</div>
        </div>
      </div>
      
      <div className="pt-2 border-t border-gray-800">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Curve Type</span>
          <span>Linear</span>
        </div>
      </div>
    </div>
  );
};

export default TokenBondingCurveProgress;
