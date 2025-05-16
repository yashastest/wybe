
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trophy, Clock, InfoIcon, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface CreatorRewardCardProps {
  tokenSymbol: string;
  launchTime: Date;
  currentMarketCap: number;
  first50kTime?: Date;
  milestoneAchievedTime?: Date;
  rewardType?: 'Premium' | 'Standard' | null;
  lastFeeClaim?: Date;
  accumulatedFees?: number;
  onClaim?: () => void;
}

const CreatorRewardCard: React.FC<CreatorRewardCardProps> = ({
  tokenSymbol,
  launchTime,
  currentMarketCap,
  first50kTime,
  milestoneAchievedTime,
  rewardType,
  lastFeeClaim,
  accumulatedFees = 0,
  onClaim
}) => {
  // Calculate time remaining for different milestones
  const now = new Date();
  
  // 4-day deadline from launch
  const fourDayDeadline = new Date(launchTime.getTime() + 4 * 24 * 60 * 60 * 1000);
  const fourDayDeadlinePassed = now > fourDayDeadline;
  
  // Time remaining in 4-day window (in hours)
  const hoursRemainingIn4Day = Math.max(0, Math.floor((fourDayDeadline.getTime() - now.getTime()) / (1000 * 60 * 60)));
  
  // If we've hit $50K but haven't completed the 48-hour period
  const sustainPeriodActive = first50kTime && !milestoneAchievedTime;
  
  // 48-hour sustain deadline if we've hit $50K
  const sustainDeadline = first50kTime ? new Date(first50kTime.getTime() + 48 * 60 * 60 * 1000) : null;
  
  // Hours remaining in 48-hour sustain period
  const hoursRemainingInSustain = sustainDeadline ? 
    Math.max(0, Math.floor((sustainDeadline.getTime() - now.getTime()) / (1000 * 60 * 60))) : 0;
  
  // Time until next claim (7 days from last claim or milestone achievement)
  const nextClaimDate = lastFeeClaim || milestoneAchievedTime ? 
    new Date((lastFeeClaim || milestoneAchievedTime).getTime() + 7 * 24 * 60 * 60 * 1000) : null;
  
  // Hours until next claim
  const hoursUntilNextClaim = nextClaimDate ? 
    Math.max(0, Math.floor((nextClaimDate.getTime() - now.getTime()) / (1000 * 60 * 60))) : 0;
  
  // Can claim if premium and above $50K and 7 days have passed
  const canClaim = rewardType === 'Premium' && 
                   currentMarketCap >= 50000 && 
                   nextClaimDate && 
                   now >= nextClaimDate;

  // One-time claim for Standard reward type
  const canClaimStandard = rewardType === 'Standard' && !lastFeeClaim;

  // Calculate market cap progress towards $50k
  const marketCapProgress = Math.min(100, (currentMarketCap / 50000) * 100);
  
  // Calculate 48-hour sustain progress
  const sustainProgress = sustainPeriodActive ? 
    Math.min(100, 100 - (hoursRemainingInSustain / 48) * 100) : 0;

  const handleClaim = () => {
    if (onClaim) {
      onClaim();
    } else {
      toast.success(`Claimed ${rewardType === 'Premium' ? '40%' : '20%'} trading fee rewards!`);
    }
  };

  return (
    <Card className="border-white/10 bg-wybe-background-light shadow-xl overflow-hidden relative">
      <div className={`absolute inset-0 bg-gradient-to-br opacity-10 z-0 ${
        rewardType === 'Premium' ? 'from-orange-500/30 to-purple-500/30' :
        rewardType === 'Standard' ? 'from-blue-500/30 to-teal-500/30' :
        'from-white/5 to-white/10'
      }`} />
      
      <CardHeader className="relative z-10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold flex items-center">
            <Trophy className="mr-2 text-orange-500" size={20} />
            Creator Rewards
          </CardTitle>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon size={16} className="text-gray-400 cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-wybe-background-light border border-white/10 p-4">
                <div className="space-y-2 text-sm">
                  <p className="font-medium">🎯 Premium status requirements:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Hit $50K market cap within 4 days of launch</li>
                    <li>Stay above $50K for 48 continuous hours</li>
                  </ul>
                  <p className="border-t border-white/10 pt-2 mt-2">
                    Premium creators earn 40% of trading fees weekly, as long as market cap stays above $50K.
                    Standard creators get a one-time 20% fee share.
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="flex items-center mt-1">
          <Badge 
            variant={rewardType === 'Premium' ? 'secondary' : 'outline'} 
            className={`
              ${rewardType === 'Premium' ? 'bg-orange-500 hover:bg-orange-600' : 
                rewardType === 'Standard' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-700'}
              text-xs
            `}
          >
            {rewardType === 'Premium' ? 'Premium' : 
             rewardType === 'Standard' ? 'Standard' : 'Pending'}
          </Badge>
          <span className="text-sm text-gray-400 ml-2">{tokenSymbol}</span>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 relative z-10">
        {/* Market Cap Milestone */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-1 text-orange-500" />
              Market Cap
            </div>
            <div className="text-sm">
              ${currentMarketCap.toLocaleString()} / $50,000
            </div>
          </div>
          
          <Progress value={marketCapProgress} className="h-2 bg-gray-700">
            <div 
              className="h-full bg-orange-500 transition-all" 
              style={{ width: `${marketCapProgress}%` }}
            />
          </Progress>
          
          {!milestoneAchievedTime && !fourDayDeadlinePassed && (
            <div className="flex items-center text-xs text-gray-400">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>{hoursRemainingIn4Day}h remaining to hit $50K market cap</span>
            </div>
          )}
        </div>
        
        {/* 48-hour Sustain Milestone (only show if we've hit $50K but not completed the 48h period) */}
        {sustainPeriodActive && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-sm font-medium flex items-center">
                <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                48-hour Milestone
              </div>
              <div className="text-sm">
                {hoursRemainingInSustain}h remaining
              </div>
            </div>
            
            <Progress value={sustainProgress} className="h-2 bg-gray-700">
              <div 
                className="h-full bg-green-500 transition-all" 
                style={{ width: `${sustainProgress}%` }}
              />
            </Progress>
            
            <div className="flex items-center text-xs text-green-400">
              <CheckCircle className="h-3.5 w-3.5 mr-1" />
              <span>Stay above $50K for {hoursRemainingInSustain} more hours</span>
            </div>
          </div>
        )}
        
        {/* Status Message */}
        <Alert className="py-2 border-white/5 bg-wybe-background/60">
          <AlertDescription className="text-sm flex items-center">
            {rewardType === 'Premium' && currentMarketCap >= 50000 ? (
              <>
                <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                <span>Premium status active! Earning 40% weekly rewards.</span>
              </>
            ) : rewardType === 'Premium' && currentMarketCap < 50000 ? (
              <>
                <AlertTriangle className="h-4 w-4 mr-2 text-amber-500" />
                <span>Market cap below $50K! Rewards paused until recovery.</span>
              </>
            ) : rewardType === 'Standard' ? (
              <>
                <InfoIcon className="h-4 w-4 mr-2 text-blue-500" />
                <span>Standard status: 20% one-time reward available.</span>
              </>
            ) : fourDayDeadlinePassed ? (
              <>
                <AlertTriangle className="h-4 w-4 mr-2 text-orange-500" />
                <span>4-day window has passed. Standard status assigned.</span>
              </>
            ) : first50kTime ? (
              <>
                <Clock className="h-4 w-4 mr-2 text-green-500" />
                <span>$50K hit! Maintain for {hoursRemainingInSustain}h more for Premium.</span>
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 mr-2 text-orange-500" />
                <span>Reach $50K in {hoursRemainingIn4Day}h to qualify for Premium.</span>
              </>
            )}
          </AlertDescription>
        </Alert>
        
        {/* Reward Info */}
        {(rewardType === 'Premium' || rewardType === 'Standard') && (
          <div className="p-3 rounded-lg bg-wybe-background/60 border border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Available Rewards:</span>
              <span className="font-medium">{accumulatedFees.toFixed(2)} SOL</span>
            </div>
            
            {rewardType === 'Premium' && nextClaimDate && !canClaim && (
              <div className="mt-1 text-xs text-gray-500 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>Next claim in {hoursUntilNextClaim}h</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
      
      <CardFooter className="relative z-10">
        <Button 
          onClick={handleClaim}
          disabled={!(canClaim || canClaimStandard)} 
          className={`w-full ${
            canClaim || canClaimStandard 
              ? 'bg-orange-600 hover:bg-orange-700 text-white' 
              : 'bg-gray-700 text-gray-300'
          }`}
        >
          {rewardType === 'Premium' 
            ? `Claim Weekly Reward${canClaim ? '' : ' (Locked)'}` 
            : `Claim One-time Reward${canClaimStandard ? '' : ' (Claimed)'}`}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreatorRewardCard;
