
import { useState, useEffect } from 'react';
import { useWallet } from './useWallet.tsx';
import { tokenTradingService } from '@/services/tokenTradingService';
import { toast } from 'sonner';

export interface CreatorMilestone {
  id: string;
  tokenId: string;
  amount: number;
  eligibleTimestamp: string;
  createdAt: string;
}

export const useCreatorFees = () => {
  const { address, connected } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [milestones, setMilestones] = useState<CreatorMilestone[]>([]);
  const [totalEarned, setTotalEarned] = useState(0);
  const [availableToClaim, setAvailableToClaim] = useState(0);
  
  // Load creator fees data
  const loadCreatorFees = async (walletAddress: string) => {
    setIsLoading(true);
    try {
      // Make sure the getCreatorMilestones method exists on tokenTradingService
      const milestonesData = await tokenTradingService.getCreatorMilestones(walletAddress);
      
      // Process milestones data
      setMilestones(milestonesData || []);
      
      // Calculate totals
      if (milestonesData && milestonesData.length > 0) {
        let total = 0;
        let available = 0;
        
        milestonesData.forEach(milestone => {
          total += milestone.amount;
          
          // Check if milestone is eligible for claiming
          const eligibleDate = new Date(milestone.eligibleTimestamp);
          if (eligibleDate <= new Date()) {
            available += milestone.amount;
          }
        });
        
        setTotalEarned(total);
        setAvailableToClaim(available);
      }
    } catch (error) {
      console.error("Error loading creator fees:", error);
      toast.error("Failed to load creator fees data");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Load when wallet is connected
  useEffect(() => {
    if (connected && address) {
      loadCreatorFees(address);
    }
  }, [connected, address]);
  
  // Claim fees function
  const claimFees = async (milestoneId: string) => {
    if (!connected || !address) {
      toast.error("Please connect your wallet to claim fees");
      return { success: false };
    }
    
    try {
      // Make sure the claimCreatorFees method exists on tokenTradingService
      const result = await tokenTradingService.claimCreatorFees(milestoneId, address);
      
      if (result.success) {
        toast.success("Fees claimed successfully!");
        
        // Refresh milestones after claiming
        await loadCreatorFees(address);
        return { success: true };
      } else {
        toast.error(result.message || "Failed to claim fees");
        return { success: false };
      }
    } catch (error) {
      console.error("Error claiming fees:", error);
      toast.error("Error processing your claim");
      return { success: false };
    }
  };
  
  return {
    milestones,
    totalEarned,
    availableToClaim,
    isLoading,
    loadCreatorFees,
    claimFees
  };
};
