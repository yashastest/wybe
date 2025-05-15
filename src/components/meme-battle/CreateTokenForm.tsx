
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '@/hooks/useWallet';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { tokenTradingService } from '@/services/tokenTradingService';

type BattleRoom = {
  id: string;
  room_id: string;
  status: string;
  participant_count: number;
  max_participants: number;
};

const CreateTokenForm = () => {
  const navigate = useNavigate();
  const { address, connected } = useWallet();
  
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [initialSupply, setInitialSupply] = useState(100000);
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [availableRooms, setAvailableRooms] = useState<BattleRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingRooms, setLoadingRooms] = useState(true);

  useEffect(() => {
    fetchAvailableRooms();

    const roomsSubscription = supabase
      .channel('public:battle_rooms')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'battle_rooms' 
      }, () => {
        fetchAvailableRooms();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(roomsSubscription);
    };
  }, []);

  const fetchAvailableRooms = async () => {
    try {
      setLoadingRooms(true);
      const { data, error } = await supabase
        .from('battle_rooms')
        .select('*')
        .eq('status', 'open')
        .order('waiting_time_end', { ascending: true });

      if (error) throw error;
      
      // Type cast the data as we know the structure matches our BattleRoom type
      setAvailableRooms(data as BattleRoom[] || []);
      
      // Auto-select the first room if available and none selected
      if (data && data.length > 0 && !selectedRoom) {
        setSelectedRoom(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching available battle rooms:', error);
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected || !address) {
      toast.error('Please connect your wallet first');
      return;
    }
    
    if (!selectedRoom) {
      toast.error('Please select a battle room to join');
      return;
    }
    
    if (!name || !symbol) {
      toast.error('Please enter a name and symbol for your token');
      return;
    }
    
    if (symbol.length > 8) {
      toast.error('Token symbol must be 8 characters or less');
      return;
    }
    
    try {
      setLoading(true);
      toast.info('Creating your token and joining battle...');
      
      // Join the battle room with the new token
      const response = await fetch('/api/join-battle-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          battleRoomId: selectedRoom,
          tokenName: name,
          tokenSymbol: symbol.toUpperCase(),
          initialSupply: initialSupply,
          creatorWallet: address
        }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to join battle room');
      }
      
      // Launch the token using the token service
      const launchResult = await tokenTradingService.launchToken({
        name,
        symbol: symbol.toUpperCase(),
        initialSupply,
        creatorWallet: address,
      });
      
      if (!launchResult.success) {
        throw new Error(launchResult.error || 'Failed to launch token');
      }
      
      toast.success('Token created and joined battle successfully!');
      
      // Navigate to the battle detail page
      navigate(`/meme-battle-royale/${selectedRoom}`);
    } catch (error: any) {
      console.error('Error creating token:', error);
      toast.error(error.message || 'Failed to create token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="battle-room">Select a Battle Room</Label>
        <Select 
          value={selectedRoom} 
          onValueChange={setSelectedRoom}
          disabled={loadingRooms || availableRooms.length === 0}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={loadingRooms ? "Loading rooms..." : "Select a battle room"} />
          </SelectTrigger>
          <SelectContent>
            {availableRooms.map(room => (
              <SelectItem key={room.id} value={room.id}>
                {room.room_id} ({room.participant_count}/{room.max_participants} participants)
              </SelectItem>
            ))}
            {availableRooms.length === 0 && !loadingRooms && (
              <SelectItem value="none" disabled>No available battle rooms</SelectItem>
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="token-name">Token Name</Label>
          <Input
            id="token-name"
            placeholder="My Awesome Meme Token"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={32}
            required
          />
        </div>
        
        <div>
          <Label htmlFor="token-symbol">Token Symbol</Label>
          <Input
            id="token-symbol"
            placeholder="MEME"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            maxLength={8}
            required
          />
          <p className="text-xs text-gray-500 mt-1">Max 8 characters, uppercase letters only</p>
        </div>
        
        <div>
          <Label>Initial Supply: {initialSupply.toLocaleString()}</Label>
          <Slider
            defaultValue={[100000]}
            min={10000}
            max={1000000}
            step={10000}
            onValueChange={(values) => setInitialSupply(values[0])}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>10,000</span>
            <span>1,000,000</span>
          </div>
        </div>

        <div className="pt-4">
          <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
            <CardContent className="pt-4 pb-4">
              <p className="text-amber-800 dark:text-amber-200 text-sm">
                <strong>Note:</strong> After creating your token, you'll have 1 minute to market it and attract buyers
                before the battle begins. The token with the highest market cap after 24 hours wins 90% of all trading fees!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        disabled={loading || loadingRooms || !connected || availableRooms.length === 0}
      >
        {loading ? 'Creating...' : 'Create Token & Join Battle'}
      </Button>
      
      {!connected && (
        <p className="text-center text-sm text-red-500">Please connect your wallet first</p>
      )}
      
      {availableRooms.length === 0 && !loadingRooms && (
        <p className="text-center text-sm text-amber-500">
          No battle rooms currently available. Please check back later.
        </p>
      )}
    </form>
  );
};

export default CreateTokenForm;
