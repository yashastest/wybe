
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@/hooks/useWallet';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LiveBattleRooms from '@/components/meme-battle/LiveBattleRooms';
import BattleLeaderboard from '@/components/meme-battle/BattleLeaderboard';
import CreateTokenForm from '@/components/meme-battle/CreateTokenForm';
import RewardsSection from '@/components/meme-battle/RewardsSection';
import BattleRules from '@/components/meme-battle/BattleRules';

const MemeBattleRoyale = () => {
  const navigate = useNavigate();
  const { connected } = useWallet();
  const [activeTab, setActiveTab] = useState('battles');

  useEffect(() => {
    // Subscribe to real-time updates for battle rooms
    const battleRoomsSubscription = supabase
      .channel('public:battle_rooms')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'battle_rooms' 
      }, (payload) => {
        console.log('Battle room update:', payload);
        // Toast notification for new battle rooms
        if (payload.eventType === 'INSERT') {
          toast.info(`New battle room created: ${payload.new.room_id}`);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(battleRoomsSubscription);
    };
  }, []);

  const handleCreateToken = () => {
    if (!connected) {
      toast.error('Please connect your wallet to create a token');
      return;
    }
    setActiveTab('create');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">🐸 Meme Battle Royale</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            Join the ultimate meme coin competition. Create, battle, and win trading fees!
          </p>
        </div>
        <Button 
          className="bg-orange-500 hover:bg-orange-600 text-white"
          size="lg"
          onClick={handleCreateToken}
        >
          Create Token & Join Battle
        </Button>
      </div>

      <div className="mb-8 p-4 bg-orange-100 dark:bg-orange-900/30 rounded-lg border border-orange-200 dark:border-orange-800">
        <p className="text-orange-800 dark:text-orange-200 font-medium">
          🔥 Meme Wars: Win Trading Fees in 24 Hours! Join a battle room, create your token, and compete for the highest market cap.
        </p>
      </div>

      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="battles">Live Battles</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          <TabsTrigger value="create">Create & Join</TabsTrigger>
          <TabsTrigger value="rewards">Your Rewards</TabsTrigger>
        </TabsList>

        <TabsContent value="battles" className="space-y-8">
          <LiveBattleRooms />
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-8">
          <BattleLeaderboard />
        </TabsContent>

        <TabsContent value="create" className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Create Your Meme Token</CardTitle>
              <CardDescription>
                Launch your meme token and join a battle room to compete for rewards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CreateTokenForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rewards" className="space-y-8">
          <RewardsSection />
        </TabsContent>
      </Tabs>

      <div className="mt-12">
        <BattleRules />
      </div>
    </div>
  );
};

export default MemeBattleRoyale;
