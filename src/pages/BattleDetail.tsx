
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useWallet } from '@/hooks/useWallet';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CountdownTimer from '@/components/meme-battle/CountdownTimer';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TradingInterface } from '@/components/TradingInterface';
import { formatCurrency } from '@/utils/tradeUtils';

type BattleRoom = {
  id: string;
  room_id: string;
  status: 'open' | 'full' | 'active' | 'closed';
  waiting_time_end: string;
  battle_end_time: string;
  max_participants: number;
  participant_count: number;
  total_fees_collected: number;
  winner_token_id: string | null;
};

type BattleToken = {
  id: string;
  token_symbol: string;
  token_name: string;
  creator_wallet: string;
  current_market_cap: number;
  total_fees: number;
  is_winner: boolean;
};

const BattleDetail = () => {
  const { battleId } = useParams<{ battleId: string }>();
  const { connected, address } = useWallet();
  
  const [battleRoom, setBattleRoom] = useState<BattleRoom | null>(null);
  const [tokens, setTokens] = useState<BattleToken[]>([]);
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (battleId) {
      fetchBattleRoom();
    }
  }, [battleId]);

  useEffect(() => {
    if (battleRoom) {
      fetchBattleTokens();
    }
  }, [battleRoom]);

  useEffect(() => {
    // Auto-select first token if none selected and tokens are available
    if (tokens.length > 0 && !selectedTokenId) {
      setSelectedTokenId(tokens[0].id);
    }
  }, [tokens, selectedTokenId]);

  // Subscribe to real-time updates
  useEffect(() => {
    if (!battleId) return;

    // Subscribe to battle room updates
    const roomSubscription = supabase
      .channel(`battle_room_${battleId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'battle_rooms',
        filter: `id=eq.${battleId}` 
      }, () => {
        fetchBattleRoom();
      })
      .subscribe();

    // Subscribe to battle tokens updates
    const tokensSubscription = supabase
      .channel(`battle_tokens_${battleId}`)
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'battle_tokens',
        filter: `battle_room_id=eq.${battleId}`
      }, () => {
        fetchBattleTokens();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(roomSubscription);
      supabase.removeChannel(tokensSubscription);
    };
  }, [battleId]);

  const fetchBattleRoom = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('battle_rooms')
        .select('*')
        .eq('id', battleId)
        .single();

      if (error) throw error;
      setBattleRoom(data);
    } catch (error) {
      console.error('Error fetching battle room:', error);
      toast.error('Failed to load battle room details');
    } finally {
      setLoading(false);
    }
  };

  const fetchBattleTokens = async () => {
    try {
      const { data, error } = await supabase
        .from('battle_tokens')
        .select('*')
        .eq('battle_room_id', battleId)
        .order('current_market_cap', { ascending: false });

      if (error) throw error;
      setTokens(data || []);
    } catch (error) {
      console.error('Error fetching battle tokens:', error);
      toast.error('Failed to load battle tokens');
    }
  };

  const getBattleStatus = () => {
    if (!battleRoom) return 'unknown';
    
    const now = new Date();
    const waitingTimeEnd = new Date(battleRoom.waiting_time_end);
    const battleEndTime = new Date(battleRoom.battle_end_time);
    
    if (now < waitingTimeEnd) {
      return 'waiting';
    } else if (now < battleEndTime) {
      return 'active';
    } else {
      return 'ended';
    }
  };

  const handleSelectToken = (tokenId: string) => {
    setSelectedTokenId(tokenId);
    setActiveTab('trade');
  };

  const getSelectedToken = () => {
    return tokens.find(token => token.id === selectedTokenId);
  };

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };

  if (loading && !battleRoom) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  if (!battleRoom) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center p-8">
              <h3 className="text-lg font-semibold mb-2">Battle Not Found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                The battle room you're looking for doesn't exist or has been removed.
              </p>
              <Link to="/meme-battle-royale">
                <Button>Return to Meme Battle Royale</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const battleStatus = getBattleStatus();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/meme-battle-royale" className="text-blue-500 hover:underline mb-4 inline-block">
          &larr; Back to Meme Battle Royale
        </Link>
        <div className="flex flex-col md:flex-row items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold">{battleRoom.room_id}</h1>
              {battleStatus === 'waiting' && (
                <Badge className="bg-yellow-500">Waiting to Start</Badge>
              )}
              {battleStatus === 'active' && (
                <Badge className="bg-green-500">Battle Active</Badge>
              )}
              {battleStatus === 'ended' && (
                <Badge className="bg-gray-500">Battle Ended</Badge>
              )}
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Participants: {battleRoom.participant_count} / {battleRoom.max_participants}
            </p>
          </div>
          
          <div className="mt-4 md:mt-0">
            {battleStatus === 'waiting' && (
              <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                    Battle starts in:
                  </p>
                  <CountdownTimer 
                    targetDate={new Date(battleRoom.waiting_time_end)} 
                    className="text-2xl font-bold text-yellow-600 dark:text-yellow-400"
                    onComplete={fetchBattleRoom}
                  />
                </CardContent>
              </Card>
            )}
            
            {battleStatus === 'active' && (
              <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-green-800 dark:text-green-200 mb-1">
                    Battle ends in:
                  </p>
                  <CountdownTimer 
                    targetDate={new Date(battleRoom.battle_end_time)} 
                    className="text-2xl font-bold text-green-600 dark:text-green-400"
                    onComplete={fetchBattleRoom}
                  />
                </CardContent>
              </Card>
            )}
            
            {battleStatus === 'ended' && (
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                  <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                    Total fees collected:
                  </p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatCurrency(battleRoom.total_fees_collected, 4, '◎ ')}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-8">
          <TabsTrigger value="overview">Battle Overview</TabsTrigger>
          <TabsTrigger value="trade" disabled={!selectedTokenId}>Trade Selected Token</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Battle Participants</CardTitle>
              <CardDescription>
                {battleStatus === 'ended' 
                  ? 'The battle has ended. View the results below.' 
                  : 'Tokens competing in this battle. Select one to trade.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Token</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead>Market Cap</TableHead>
                    <TableHead>Trading Fees</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tokens.map(token => (
                    <TableRow key={token.id} className={token.is_winner ? 'bg-amber-50 dark:bg-amber-900/20' : ''}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{token.token_symbol}</span>
                          <span className="text-xs text-gray-500">{token.token_name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{truncateAddress(token.creator_wallet)}</TableCell>
                      <TableCell>{formatCurrency(token.current_market_cap, 2, '◎ ')}</TableCell>
                      <TableCell>{formatCurrency(token.total_fees, 2, '◎ ')}</TableCell>
                      <TableCell>
                        {token.is_winner && (
                          <Badge className="bg-amber-500 text-amber-950">Winner 🏆</Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          onClick={() => handleSelectToken(token.id)}
                          variant={selectedTokenId === token.id ? "default" : "outline"}
                        >
                          {selectedTokenId === token.id ? 'Selected' : 'Select'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {tokens.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No tokens have joined this battle yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Battle Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Status:</span>
                  <span className="font-medium capitalize">{battleRoom.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Created:</span>
                  <span className="font-medium">{new Date(battleRoom.waiting_time_end).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reward Pool:</span>
                  <span className="font-medium">{formatCurrency(battleRoom.total_fees_collected * 0.9, 4, '◎ ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Platform Fee:</span>
                  <span className="font-medium">{formatCurrency(battleRoom.total_fees_collected * 0.1, 4, '◎ ')}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Trading Rules</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Each trade has a 0.5% fee that goes to the reward pool</li>
                  <li>90% of fees go to traders of the winning token</li>
                  <li>10% of fees go to the platform treasury</li>
                  <li>The token with the highest market cap after 24 hours wins</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Your Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {!connected ? (
                  <div className="text-center py-4">
                    <p className="text-gray-500 mb-2">Connect your wallet to view your activity</p>
                  </div>
                ) : (
                  <p className="text-center py-4 text-gray-500">
                    Trading activity will appear here
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trade">
          {selectedTokenId && getSelectedToken() ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{getSelectedToken()?.token_symbol}</CardTitle>
                      <CardDescription>{getSelectedToken()?.token_name}</CardDescription>
                    </div>
                    <Badge className={getSelectedToken()?.is_winner ? 'bg-amber-500 text-amber-950' : ''}>
                      {getSelectedToken()?.is_winner ? 'Winner 🏆' : 'Market Cap: ' + formatCurrency(getSelectedToken()?.current_market_cap || 0, 2, '◎ ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {connected ? (
                    <TradingInterface tokenSymbol={getSelectedToken()?.token_symbol || ''} />
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Please connect your wallet to trade this token.
                      </p>
                      <Button>Connect Wallet</Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center p-8">
                  <h3 className="text-lg font-semibold mb-2">No Token Selected</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Please select a token from the Battle Overview tab to start trading.
                  </p>
                  <Button onClick={() => setActiveTab('overview')}>
                    View Battle Overview
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BattleDetail;
