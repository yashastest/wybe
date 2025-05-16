
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { tokenTradingService } from '@/services/tokenTradingService';

interface FeeMilestone {
  id: string;
  tokenId: string;
  amount: number;
  eligibleTimestamp: string;
  createdAt: string;
}

interface ClaimResult {
  success: boolean;
  message: string;
  amount?: number;
}

export const useCreatorFees = (creatorWallet?: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [milestones, setMilestones] = useState<FeeMilestone[]>([]);
  const [totalUnclaimed, setTotalUnclaimed] = useState(0);
  
  // Fetch all available milestones for the creator
  const fetchMilestones = async (wallet?: string) => {
    if (!wallet && !creatorWallet) {
      console.error('No wallet address provided for fetching milestones');
      return [];
    }
    
    const walletToUse = wallet || creatorWallet;
    setIsLoading(true);
    
    try {
      // Get all milestones
      const milestonesData = await tokenTradingService.getCreatorMilestones(walletToUse!);
      
      // Format and update state
      const formattedMilestones = milestonesData.map(milestone => ({
        id: milestone.id,
        tokenId: milestone.tokenId,
        amount: milestone.amount,
        eligibleTimestamp: milestone.eligibleTimestamp,
        createdAt: milestone.createdAt
      }));
      
      setMilestones(formattedMilestones);
      
      // Calculate total unclaimed amount
      const total = formattedMilestones.reduce((sum, milestone) => sum + milestone.amount, 0);
      setTotalUnclaimed(total);
      
      return formattedMilestones;
    } catch (error) {
      console.error('Error fetching milestones:', error);
      toast.error('Failed to load creator fee milestones');
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  // Claim a specific milestone
  const claimMilestone = async (milestoneId: string, wallet?: string) => {
    if (!wallet && !creatorWallet) {
      toast.error('No wallet address provided for claiming');
      return { success: false, message: 'No wallet address provided' };
    }
    
    const walletToUse = wallet || creatorWallet;
    setIsLoading(true);
    
    try {
      // Process claim
      const result = await tokenTradingService.claimCreatorFees(milestoneId, walletToUse!);
      
      if (result.success) {
        // Refresh milestones after successful claim
        await fetchMilestones(walletToUse);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      
      return result;
    } catch (error) {
      console.error('Error claiming milestone:', error);
      toast.error('Failed to claim creator fees');
      return { success: false, message: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Claim all available milestones
  const claimAllMilestones = async (wallet?: string) => {
    if (!wallet && !creatorWallet) {
      toast.error('No wallet address provided for claiming');
      return { success: false, message: 'No wallet address provided' };
    }
    
    const walletToUse = wallet || creatorWallet;
    setIsLoading(true);
    
    try {
      // Process claim for all eligible distributions
      const { data, error } = await supabase.functions.invoke('process-fee-distribution', {
        body: JSON.stringify({
          creator_wallet: walletToUse
        })
      });
      
      if (error || !data.success) {
        toast.error(data?.message || 'Failed to claim creator fees');
        return {
          success: false,
          message: data?.message || 'Failed to claim creator fees'
        };
      }
      
      // Refresh milestones after successful claim
      await fetchMilestones(walletToUse);
      
      toast.success(data.message);
      return {
        success: true,
        message: data.message,
        amount: data.totalAmount
      };
    } catch (error) {
      console.error('Error claiming all milestones:', error);
      toast.error('Failed to claim creator fees');
      return { success: false, message: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };
  
  // Check milestone eligibility
  const checkMilestoneEligibility = (timestamp: string): boolean => {
    const eligibleDate = new Date(timestamp);
    const now = new Date();
    return now >= eligibleDate;
  };
  
  // Get time until next milestone
  const getTimeUntilNextMilestone = (): { days: number; hours: number } | null => {
    if (milestones.length === 0) return null;
    
    // Find the earliest non-eligible milestone
    const sortedMilestones = [...milestones].sort((a, b) => 
      new Date(a.eligibleTimestamp).getTime() - new Date(b.eligibleTimestamp).getTime()
    );
    
    const nextMilestone = sortedMilestones.find(
      milestone => !checkMilestoneEligibility(milestone.eligibleTimestamp)
    );
    
    if (!nextMilestone) return null;
    
    const now = new Date();
    const eligibleDate = new Date(nextMilestone.eligibleTimestamp);
    const diffTime = eligibleDate.getTime() - now.getTime();
    
    // Convert to days and hours
    const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    return { days, hours };
  };
  
  return {
    isLoading,
    milestones,
    totalUnclaimed,
    fetchMilestones,
    claimMilestone,
    claimAllMilestones,
    checkMilestoneEligibility,
    getTimeUntilNextMilestone
  };
};
