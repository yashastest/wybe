
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import CountdownTimer from './CountdownTimer';

type BattleRoom = {
  id: string;
  room_id: string;
  status: 'open' | 'full' | 'active' | 'closed';
  waiting_time_end: string;
  battle_end_time: string;
  max_participants: number;
  participant_count: number;
  battle_status: 'waiting' | 'active' | 'ended';
  seconds_to_start: number;
  seconds_remaining: number;
};

const LiveBattleRooms = () => {
  const navigate = useNavigate();
  const [battleRooms, setBattleRooms] = useState<BattleRoom[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBattleRooms();

    // Subscribe to real-time updates
    const battleRoomsSubscription = supabase
      .channel('public:view_active_battles')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'battle_rooms' 
      }, () => {
        fetchBattleRooms();
      })
      .subscribe();

    const intervalId = setInterval(fetchBattleRooms, 10000);

    return () => {
      supabase.removeChannel(battleRoomsSubscription);
      clearInterval(intervalId);
    };
  }, []);

  const fetchBattleRooms = async () => {
    try {
      const { data, error } = await supabase
        .from('view_active_battles')
        .select('*')
        .order('waiting_time_end', { ascending: true });

      if (error) throw error;
      
      // Type cast the data as we know the structure matches our BattleRoom type
      setBattleRooms(data as BattleRoom[] || []);
    } catch (error) {
      console.error('Error fetching battle rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewBattle = (battleId: string) => {
    navigate(`/meme-battle-royale/${battleId}`);
  };

  const renderStatusBadge = (status: string, battleStatus: string) => {
    switch (battleStatus) {
      case 'waiting':
        return <Badge className="bg-yellow-500">Waiting to Start</Badge>;
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'ended':
        return <Badge className="bg-gray-500">Ended</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (battleRooms.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center p-8">
            <h3 className="text-lg font-semibold mb-2">No Active Battle Rooms</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              There are currently no active battle rooms. Create a new token to start a battle!
            </p>
            <Button 
              onClick={() => navigate('/meme-battle-royale?tab=create')}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Create Token
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">Live Battle Rooms</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {battleRooms.map((room) => (
          <Card key={room.id} className="overflow-hidden border-2 hover:border-orange-300 transition-all">
            <CardHeader className="bg-gray-50 dark:bg-gray-800/50">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{room.room_id}</CardTitle>
                {renderStatusBadge(room.status, room.battle_status)}
              </div>
            </CardHeader>
            
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-500">Participants:</span>
                  <span className="font-medium">{room.participant_count} / {room.max_participants}</span>
                </div>
                
                {room.battle_status === 'waiting' ? (
                  <div className="text-center py-2">
                    <p className="text-sm text-gray-500 mb-1">Battle starts in:</p>
                    <CountdownTimer 
                      targetDate={new Date(room.waiting_time_end)} 
                      className="text-xl font-bold text-orange-500"
                    />
                  </div>
                ) : room.battle_status === 'active' ? (
                  <div className="text-center py-2">
                    <p className="text-sm text-gray-500 mb-1">Battle ends in:</p>
                    <CountdownTimer 
                      targetDate={new Date(room.battle_end_time)} 
                      className="text-xl font-bold text-green-500"
                    />
                  </div>
                ) : null}
              </div>
            </CardContent>
            
            <CardFooter className="bg-gray-50 dark:bg-gray-800/50">
              <Button 
                className="w-full" 
                onClick={() => handleViewBattle(room.id)}
              >
                {room.status === 'open' ? 'Join Battle' : 'View Battle'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default LiveBattleRooms;
