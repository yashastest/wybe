
import React, { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/tradeUtils';

type Reward = {
  id: string;
  battle_room_id: string;
  battle_token_id: string;
  wallet_address: string;
  reward_amount: number;
  claimed: boolean;
  claimed_at: string | null;
};

type BattleToken = {
  id: string;
  token_symbol: string;
  token_name: string;
};

type BattleRoom = {
  id: string;
  room_id: string;
};

const RewardsSection = () => {
  const { connected, address } = useWallet();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [tokenMap, setTokenMap] = useState<{[key: string]: BattleToken}>({});
  const [roomMap, setRoomMap] = useState<{[key: string]: BattleRoom}>({});
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  useEffect(() => {
    if (connected && address) {
      fetchRewards();
    } else {
      setRewards([]);
      setLoading(false);
    }
  }, [connected, address]);

  const fetchRewards = async () => {
    try {
      setLoading(true);
      
      // Fetch user's rewards
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('battle_rewards')
        .select('*')
        .eq('wallet_address', address)
        .order('claimed', { ascending: true })
        .order('reward_amount', { ascending: false });
      
      if (rewardsError) throw rewardsError;
      
      if (!rewardsData || rewardsData.length === 0) {
        setRewards([]);
        setLoading(false);
        return;
      }
      
      // Get unique token and room IDs from rewards
      const tokenIds = Array.from(new Set(rewardsData.map(r => r.battle_token_id)));
      const roomIds = Array.from(new Set(rewardsData.map(r => r.battle_room_id)));
      
      // Fetch token details
      const { data: tokensData, error: tokensError } = await supabase
        .from('battle_tokens')
        .select('id, token_symbol, token_name')
        .in('id', tokenIds);
      
      if (tokensError) throw tokensError;
      
      // Fetch room details
      const { data: roomsData, error: roomsError } = await supabase
        .from('battle_rooms')
        .select('id, room_id')
        .in('id', roomIds);
      
      if (roomsError) throw roomsError;
      
      // Create maps for tokens and rooms
      const newTokenMap: {[key: string]: BattleToken} = {};
      const newRoomMap: {[key: string]: BattleRoom} = {};
      
      if (tokensData) {
        tokensData.forEach((token: BattleToken) => {
          newTokenMap[token.id] = token;
        });
      }
      
      if (roomsData) {
        roomsData.forEach((room: BattleRoom) => {
          newRoomMap[room.id] = room;
        });
      }
      
      setTokenMap(newTokenMap);
      setRoomMap(newRoomMap);
      setRewards(rewardsData as Reward[]);
    } catch (error) {
      console.error('Error fetching rewards:', error);
      toast.error('Failed to fetch rewards');
    } finally {
      setLoading(false);
    }
  };

  const handleClaimReward = async (reward: Reward) => {
    if (!connected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    try {
      setClaimingId(reward.id);
      toast.info('Processing your reward claim...');
      
      // Mock API call for claiming reward
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the reward status in the database
      const { error } = await supabase
        .from('battle_rewards')
        .update({
          claimed: true,
          claimed_at: new Date().toISOString()
        })
        .eq('id', reward.id);
      
      if (error) throw error;
      
      toast.success(`Successfully claimed ${formatCurrency(reward.reward_amount, 4, '◎ ')} in rewards!`);
      
      // Refresh rewards list
      fetchRewards();
    } catch (error) {
      console.error('Error claiming reward:', error);
      toast.error('Failed to claim reward');
    } finally {
      setClaimingId(null);
    }
  };

  const getTotalRewards = () => {
    return rewards.reduce((sum, reward) => sum + reward.reward_amount, 0);
  };

  const getUnclaimedRewards = () => {
    return rewards
      .filter(reward => !reward.claimed)
      .reduce((sum, reward) => sum + reward.reward_amount, 0);
  };

  if (!connected) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center p-8">
            <h3 className="text-lg font-semibold mb-2">Connect Your Wallet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              Please connect your wallet to view your battle rewards.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (rewards.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center p-8">
            <h3 className="text-lg font-semibold mb-2">No Rewards Found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              You don't have any battle rewards yet. Join a battle and trade winning tokens to earn rewards!
            </p>
            <Button 
              onClick={() => window.location.href = '/meme-battle-royale?tab=battles'}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Join Battles
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">
              {formatCurrency(getTotalRewards(), 4, '◎ ')}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Unclaimed Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-500">
              {formatCurrency(getUnclaimedRewards(), 4, '◎ ')}
            </div>
            {getUnclaimedRewards() > 0 && (
              <Button 
                className="mt-4 bg-green-500 hover:bg-green-600"
                onClick={() => {
                  const firstUnclaimed = rewards.find(r => !r.claimed);
                  if (firstUnclaimed) {
                    handleClaimReward(firstUnclaimed);
                  }
                }}
                disabled={claimingId !== null}
              >
                Claim All Rewards
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Battle Rewards</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Battle Room</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Reward Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rewards.map((reward) => (
                <TableRow key={reward.id}>
                  <TableCell>{roomMap[reward.battle_room_id]?.room_id || 'Unknown'}</TableCell>
                  <TableCell>
                    {tokenMap[reward.battle_token_id]?.token_symbol || 'Unknown'}
                  </TableCell>
                  <TableCell>{formatCurrency(reward.reward_amount, 4, '◎ ')}</TableCell>
                  <TableCell>
                    {reward.claimed ? 
                      <span className="text-gray-500">
                        Claimed {reward.claimed_at && new Date(reward.claimed_at).toLocaleDateString()}
                      </span> : 
                      <span className="text-green-500 font-medium">Unclaimed</span>
                    }
                  </TableCell>
                  <TableCell>
                    {!reward.claimed && (
                      <Button
                        size="sm"
                        onClick={() => handleClaimReward(reward)}
                        disabled={claimingId !== null}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        {claimingId === reward.id ? 'Claiming...' : 'Claim'}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RewardsSection;
