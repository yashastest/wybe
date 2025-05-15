
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/tradeUtils';

type TokenLeaderboard = {
  id: string;
  token_symbol: string;
  token_name: string;
  creator_wallet: string;
  current_market_cap: number;
  total_fees: number;
  battle_room_id: string;
  room_id: string;
  room_status: string;
  battle_status: string;
  is_winner: boolean;
};

const BattleLeaderboard = () => {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState<TokenLeaderboard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();

    // Subscribe to real-time updates
    const tokensSubscription = supabase
      .channel('public:battle_tokens')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'battle_tokens' 
      }, () => {
        fetchLeaderboard();
      })
      .subscribe();

    // Refresh every 10 seconds to keep leaderboard updated
    const intervalId = setInterval(fetchLeaderboard, 10000);

    return () => {
      supabase.removeChannel(tokensSubscription);
      clearInterval(intervalId);
    };
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('view_token_leaderboard')
        .select('*')
        .order('current_market_cap', { ascending: false })
        .limit(20);

      if (error) throw error;
      
      // Type cast the data as we know the structure matches our TokenLeaderboard type
      setTokens(data as TokenLeaderboard[] || []);
    } catch (error) {
      console.error('Error fetching token leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (battleRoomId: string) => {
    navigate(`/meme-battle-royale/${battleRoomId}`);
  };

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center p-8">
            <h3 className="text-lg font-semibold mb-2">No Tokens to Display</h3>
            <p className="text-gray-500 dark:text-gray-400">
              There are currently no tokens in active battles.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Meme Battle Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rank</TableHead>
                <TableHead>Token</TableHead>
                <TableHead>Creator</TableHead>
                <TableHead>Market Cap</TableHead>
                <TableHead>Total Fees</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokens.map((token, index) => (
                <TableRow 
                  key={token.id} 
                  className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => handleRowClick(token.battle_room_id)}
                >
                  <TableCell className="font-medium">{index + 1}</TableCell>
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
                    {token.is_winner ? (
                      <Badge className="bg-gold text-black">Winner 🏆</Badge>
                    ) : token.battle_status === 'active' ? (
                      <Badge className="bg-green-500">Active</Badge>
                    ) : token.battle_status === 'waiting' ? (
                      <Badge className="bg-yellow-500">Waiting</Badge>
                    ) : (
                      <Badge className="bg-gray-500">Ended</Badge>
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

export default BattleLeaderboard;
