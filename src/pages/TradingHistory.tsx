
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { TrendingUp, TrendingDown, AlertCircle, Download } from 'lucide-react';
import { useWallet } from '@/hooks/useWallet.tsx';
import { useTokenTrading } from '@/hooks/useTokenTrading';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { formatCurrency } from '@/utils/tradeUtils';

interface TradeStats {
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  longestStreak: number;
  currentStreak: number;
  averageProfit: number;
  averageLoss: number;
  totalVolume: number;
}

const TradingHistory: React.FC = () => {
  const { connected, address, connect } = useWallet();
  const { isLoading, tradeHistory, fetchTradeHistory } = useTokenTrading();
  
  const [selectedPeriod, setSelectedPeriod] = useState<'all' | '7d' | '30d' | '90d'>('all');
  const [stats, setStats] = useState<TradeStats>({
    totalTrades: 0,
    winningTrades: 0,
    losingTrades: 0,
    longestStreak: 0,
    currentStreak: 0,
    averageProfit: 0,
    averageLoss: 0,
    totalVolume: 0
  });
  
  useEffect(() => {
    if (connected && address) {
      loadTradeHistory();
    }
  }, [connected, address, selectedPeriod]);
  
  const loadTradeHistory = async () => {
    if (!address) return;
    
    try {
      await fetchTradeHistory(address, { period: selectedPeriod });
      calculateStats();
    } catch (error) {
      console.error("Failed to load trade history:", error);
      toast.error("Failed to load trading history");
    }
  };
  
  // Calculate trading statistics (mock implementation)
  const calculateStats = () => {
    // In a real app, this would analyze the actual trade history
    // Here we're just generating some mock statistics
    
    const mockStats: TradeStats = {
      totalTrades: 42,
      winningTrades: 28,
      losingTrades: 14,
      longestStreak: 7,
      currentStreak: 3,
      averageProfit: 0.23,
      averageLoss: 0.12,
      totalVolume: 150.75
    };
    
    setStats(mockStats);
  };
  
  // Handle wallet connection
  const handleConnectWallet = async () => {
    try {
      await connect();
    } catch (error) {
      toast.error("Failed to connect wallet");
    }
  };
  
  // Mock trade history data
  const mockTradeHistory = [
    { id: '1', tokenSymbol: 'WYBE', side: 'buy', amount: 1000, price: 0.0015, timestamp: '2023-05-15T14:30:00Z', status: 'completed', profit: 0.05 },
    { id: '2', tokenSymbol: 'PEPE', side: 'sell', amount: 5000, price: 0.000032, timestamp: '2023-05-14T10:15:00Z', status: 'completed', profit: -0.02 },
    { id: '3', tokenSymbol: 'DOGE', side: 'buy', amount: 200, price: 0.23, timestamp: '2023-05-13T16:45:00Z', status: 'completed', profit: 0.08 },
    { id: '4', tokenSymbol: 'WYBE', side: 'buy', amount: 500, price: 0.0014, timestamp: '2023-05-12T09:20:00Z', status: 'completed', profit: 0.03 },
    { id: '5', tokenSymbol: 'PEPE', side: 'sell', amount: 2000, price: 0.000030, timestamp: '2023-05-11T13:10:00Z', status: 'completed', profit: 0.01 },
  ];

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold mb-6">Trading History</h1>
          
          {!connected ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="text-yellow-500 h-12 w-12 mb-4" />
                <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
                <p className="text-gray-400 text-center mb-6">
                  Connect your wallet to view your trading history and performance metrics.
                </p>
                <Button onClick={handleConnectWallet}>
                  Connect Wallet
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* Trading Statistics */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Trading Performance</CardTitle>
                    <Tabs value={selectedPeriod} onValueChange={(v) => setSelectedPeriod(v as any)}>
                      <TabsList>
                        <TabsTrigger value="all">All Time</TabsTrigger>
                        <TabsTrigger value="7d">7 Days</TabsTrigger>
                        <TabsTrigger value="30d">30 Days</TabsTrigger>
                        <TabsTrigger value="90d">90 Days</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                  <CardDescription>
                    Your trading performance metrics and statistics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {[...Array(8)].map((_, i) => (
                        <Skeleton key={i} className="h-24 w-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-black/20 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm">Total Trades</p>
                        <p className="text-2xl font-bold">{stats.totalTrades}</p>
                      </div>
                      
                      <div className="bg-black/20 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm">Win Rate</p>
                        <p className="text-2xl font-bold">
                          {stats.totalTrades > 0 ? `${((stats.winningTrades / stats.totalTrades) * 100).toFixed(1)}%` : '0%'}
                        </p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="bg-green-500/10 text-green-500">
                            {stats.winningTrades} wins
                          </Badge>
                          <Badge variant="outline" className="bg-red-500/10 text-red-500">
                            {stats.losingTrades} losses
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="bg-black/20 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm">Best Streak</p>
                        <p className="text-2xl font-bold">{stats.longestStreak}</p>
                        <p className="text-xs text-gray-400">Current: {stats.currentStreak}</p>
                      </div>
                      
                      <div className="bg-black/20 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm">Total Volume</p>
                        <p className="text-2xl font-bold">{stats.totalVolume} SOL</p>
                      </div>
                      
                      <div className="bg-black/20 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm">Average Profit</p>
                        <p className="text-2xl font-bold text-green-500">+{stats.averageProfit} SOL</p>
                      </div>
                      
                      <div className="bg-black/20 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm">Average Loss</p>
                        <p className="text-2xl font-bold text-red-500">-{stats.averageLoss} SOL</p>
                      </div>
                      
                      {/* Add more stats as needed */}
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {/* Trade History Table */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Trade History</CardTitle>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="space-y-2">
                      {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Token</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Value</TableHead>
                            <TableHead>Profit/Loss</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockTradeHistory.map((trade) => (
                            <TableRow key={trade.id}>
                              <TableCell>
                                {new Date(trade.timestamp).toLocaleDateString()}
                              </TableCell>
                              <TableCell>{trade.tokenSymbol}</TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  {trade.side === 'buy' ? (
                                    <Badge variant="outline" className="bg-green-900/20 text-green-500 border-green-500/30">
                                      <TrendingUp className="h-3 w-3 mr-1" /> Buy
                                    </Badge>
                                  ) : (
                                    <Badge variant="outline" className="bg-red-900/20 text-red-500 border-red-500/30">
                                      <TrendingDown className="h-3 w-3 mr-1" /> Sell
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{trade.amount}</TableCell>
                              <TableCell>{formatCurrency(trade.price)}</TableCell>
                              <TableCell>{formatCurrency(trade.amount * trade.price)}</TableCell>
                              <TableCell className={trade.profit >= 0 ? 'text-green-500' : 'text-red-500'}>
                                {trade.profit >= 0 ? '+' : ''}{trade.profit} SOL
                              </TableCell>
                            </TableRow>
                          ))}
                          
                          {mockTradeHistory.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-8 text-gray-400">
                                No trade history found
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TradingHistory;
