
import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useWallet } from '@/hooks/useWallet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PieChart, LineChart, BarChart3, TrendingUp, TrendingDown, Wallet, History, ArrowUpDown } from 'lucide-react';
import { tokenTradingService } from '@/services/tokenTradingService';
import TransactionHistory from '@/components/TransactionHistory';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

// Mock data generator for performance statistics
const generatePerformanceData = () => {
  // Last 30 days performance
  const dailyPerformance = [];
  let cumulativeValue = 100; // Start with 100 SOL
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const change = (Math.random() * 0.1) - 0.03; // -3% to +7%
    cumulativeValue = cumulativeValue * (1 + change);
    
    dailyPerformance.push({
      date: date.toISOString().split('T')[0],
      value: cumulativeValue,
      change: change * 100
    });
  }
  
  // Trading performance by token
  const tokenPerformance = [
    { name: 'PEPE', profit: 45.2, trades: 12 },
    { name: 'DOGE', profit: -12.8, trades: 5 },
    { name: 'BONK', profit: 67.3, trades: 8 },
    { name: 'SAMO', profit: 23.1, trades: 3 },
    { name: 'SOL', profit: 8.9, trades: 15 }
  ];
  
  // Distribution by trade type
  const tradeDistribution = [
    { name: 'Buy', value: 35 },
    { name: 'Sell', value: 30 },
    { name: 'Quick Buy', value: 20 },
    { name: 'Quick Sell', value: 15 }
  ];
  
  // Win/loss statistics
  const winLossStats = {
    totalTrades: 43,
    winningTrades: 28,
    losingTrades: 15,
    winRate: 65.1,
    avgWin: 18.7,
    avgLoss: 9.3,
    largestWin: 67.3,
    largestLoss: 24.1,
    profitFactor: 2.3,
    currentStreak: 4,
    longestWinStreak: 7,
    longestLossStreak: 3
  };
  
  return {
    dailyPerformance,
    tokenPerformance,
    tradeDistribution,
    winLossStats
  };
};

const COLORS = ['#8B5CF6', '#EF4444', '#22C55E', '#F59E0B', '#64748B'];

const TradingHistory = () => {
  const { connected, address, connect } = useWallet();
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      if (connected && address) {
        try {
          // In a real application, we would fetch actual data from the service
          // const data = await tokenTradingService.getUserPerformance(address);
          
          // Using mock data for demonstration
          const data = generatePerformanceData();
          setPerformanceData(data);
        } catch (error) {
          console.error('Error fetching trading performance:', error);
          // Fallback to mock data
          setPerformanceData(generatePerformanceData());
        }
      } else {
        // Set demo data for logged out state
        setPerformanceData(generatePerformanceData());
      }
      
      setTimeout(() => setIsLoading(false), 800);
    };
    
    fetchData();
  }, [connected, address]);

  // Format value as SOL with 2 decimal places
  const formatSOL = (value: number) => {
    return `${value.toFixed(2)} SOL`;
  };
  
  // Format percentage with sign
  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 p-3 border border-indigo-500/30 rounded-lg shadow-lg">
          <p className="text-gray-300 mb-1">{label}</p>
          <p className="font-medium text-white">{formatSOL(payload[0].value)}</p>
          <p className={`text-sm ${payload[0].payload.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatPercent(payload[0].payload.change)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-indigo-950/40 to-black bg-fixed">
        <Header />
        <main className="flex-grow w-full px-4 pt-20 md:pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl text-indigo-200">Loading trading history...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-indigo-950/40 to-black bg-fixed">
        <Header />
        <main className="flex-grow w-full px-4 pt-20 md:pt-24 flex items-center justify-center">
          <div className="max-w-md w-full p-6 md:p-8 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-lg rounded-xl border border-indigo-500/30 shadow-glow-md text-center">
            <Wallet className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-300 bg-clip-text text-transparent">
              Connect Your Wallet
            </h2>
            <p className="text-gray-300 mb-6">
              Connect your wallet to see your complete trading history, performance statistics, and trading insights.
            </p>
            <Button 
              size="lg" 
              onClick={connect}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white"
            >
              Connect Wallet
            </Button>
            <div className="mt-6 pt-6 border-t border-indigo-500/20 text-sm text-gray-400">
              <p>Want to see a demo of the trading history features?</p>
              <Button 
                variant="link"
                className="text-indigo-300 hover:text-indigo-200"
                onClick={() => setPerformanceData(generatePerformanceData())}
              >
                View Demo Data
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-indigo-950/40 to-black bg-fixed">
      <Header />
      <main className="flex-grow w-full px-4 pt-20 md:pt-24 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-300 bg-clip-text text-transparent">
                Trading History & Analytics
              </h1>
              <p className="text-gray-400 mt-1">Track your performance, analyze your trades, and improve your strategy</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button 
                variant="outline"
                onClick={() => navigate('/trade')}
                className="border-indigo-500/40 text-indigo-300 hover:bg-indigo-950/50"
              >
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Back to Trading
              </Button>
            </div>
          </div>
          
          {/* Performance Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/30 border-indigo-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Total Profit/Loss</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {formatSOL(performanceData.dailyPerformance[performanceData.dailyPerformance.length - 1].value - 100)}
                </div>
                <div className={`text-sm font-medium flex items-center ${
                  performanceData.dailyPerformance[performanceData.dailyPerformance.length - 1].value > 100 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {performanceData.dailyPerformance[performanceData.dailyPerformance.length - 1].value > 100 ? (
                    <TrendingUp className="mr-1 h-4 w-4" />
                  ) : (
                    <TrendingDown className="mr-1 h-4 w-4" />
                  )}
                  {formatPercent((performanceData.dailyPerformance[performanceData.dailyPerformance.length - 1].value / 100 - 1) * 100)}
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/30 border-indigo-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Win Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {performanceData.winLossStats.winRate}%
                </div>
                <div className="mt-2">
                  <Progress value={performanceData.winLossStats.winRate} className="h-2" />
                </div>
                <div className="text-xs mt-1 text-gray-400">
                  {performanceData.winLossStats.winningTrades} wins / {performanceData.winLossStats.totalTrades} trades
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/30 border-indigo-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Current Streak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {performanceData.winLossStats.currentStreak} wins
                </div>
                <div className="text-sm font-medium text-indigo-300">
                  Best streak: {performanceData.winLossStats.longestWinStreak} wins
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/30 border-indigo-500/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-400">Profit Factor</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">
                  {performanceData.winLossStats.profitFactor.toFixed(1)}
                </div>
                <div className="text-sm font-medium text-gray-300">
                  Avg win: {performanceData.winLossStats.avgWin.toFixed(1)}%
                </div>
                <div className="text-sm font-medium text-gray-300">
                  Avg loss: {performanceData.winLossStats.avgLoss.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="performance" className="mb-6">
            <TabsList className="mb-6 bg-black/40 backdrop-blur">
              <TabsTrigger value="performance" className="data-[state=active]:bg-indigo-900/50">
                <LineChart className="w-4 h-4 mr-2" />
                Performance
              </TabsTrigger>
              <TabsTrigger value="tokens" className="data-[state=active]:bg-indigo-900/50">
                <BarChart3 className="w-4 h-4 mr-2" />
                Token Performance
              </TabsTrigger>
              <TabsTrigger value="stats" className="data-[state=active]:bg-indigo-900/50">
                <PieChart className="w-4 h-4 mr-2" />
                Statistics
              </TabsTrigger>
              <TabsTrigger value="history" className="data-[state=active]:bg-indigo-900/50">
                <History className="w-4 h-4 mr-2" />
                Transaction History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="performance">
              <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/30 border-indigo-500/20">
                <CardHeader>
                  <CardTitle>Portfolio Performance</CardTitle>
                  <CardDescription>Your trading performance over time</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={performanceData.dailyPerformance}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fill: '#999', fontSize: 11 }}
                        tickFormatter={(value) => {
                          const date = new Date(value);
                          return `${date.getDate()}/${date.getMonth() + 1}`;
                        }}
                      />
                      <YAxis 
                        tick={{ fill: '#999', fontSize: 11 }} 
                        domain={['dataMin - 10', 'dataMax + 10']}
                        tickFormatter={(value) => `${value.toFixed(0)} SOL`}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#8B5CF6" 
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="tokens">
              <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/30 border-indigo-500/20">
                <CardHeader>
                  <CardTitle>Performance by Token</CardTitle>
                  <CardDescription>Profit/Loss breakdown by token</CardDescription>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData.tokenPerformance}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#999', fontSize: 11 }}
                      />
                      <YAxis 
                        tick={{ fill: '#999', fontSize: 11 }}
                        tickFormatter={(value) => `${value}%`}
                      />
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Profit/Loss']}
                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }}
                        labelStyle={{ color: '#fff' }}
                      />
                      <Legend />
                      <Bar dataKey="profit" name="Profit/Loss %" fill="#8B5CF6" radius={[4, 4, 0, 0]}>
                        {performanceData.tokenPerformance.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.profit >= 0 ? '#22C55E' : '#EF4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="stats">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="col-span-1 bg-gradient-to-br from-indigo-900/40 to-purple-900/30 border-indigo-500/20">
                  <CardHeader>
                    <CardTitle>Trade Distribution</CardTitle>
                    <CardDescription>Breakdown by trade type</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={performanceData.tradeDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {performanceData.tradeDistribution.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                
                <Card className="col-span-1 lg:col-span-2 bg-gradient-to-br from-indigo-900/40 to-purple-900/30 border-indigo-500/20">
                  <CardHeader>
                    <CardTitle>Trading Statistics</CardTitle>
                    <CardDescription>Key performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="p-3 bg-indigo-900/20 rounded-lg border border-indigo-500/10">
                        <div className="text-sm text-gray-400">Total Trades</div>
                        <div className="text-xl font-bold">{performanceData.winLossStats.totalTrades}</div>
                      </div>
                      
                      <div className="p-3 bg-green-900/20 rounded-lg border border-green-500/10">
                        <div className="text-sm text-gray-400">Winning Trades</div>
                        <div className="text-xl font-bold text-green-400">
                          {performanceData.winLossStats.winningTrades}
                        </div>
                      </div>
                      
                      <div className="p-3 bg-red-900/20 rounded-lg border border-red-500/10">
                        <div className="text-sm text-gray-400">Losing Trades</div>
                        <div className="text-xl font-bold text-red-400">
                          {performanceData.winLossStats.losingTrades}
                        </div>
                      </div>
                      
                      <div className="p-3 bg-indigo-900/20 rounded-lg border border-indigo-500/10">
                        <div className="text-sm text-gray-400">Largest Win</div>
                        <div className="text-xl font-bold text-green-400">
                          {performanceData.winLossStats.largestWin}%
                        </div>
                      </div>
                      
                      <div className="p-3 bg-indigo-900/20 rounded-lg border border-indigo-500/10">
                        <div className="text-sm text-gray-400">Largest Loss</div>
                        <div className="text-xl font-bold text-red-400">
                          {performanceData.winLossStats.largestLoss}%
                        </div>
                      </div>
                      
                      <div className="p-3 bg-indigo-900/20 rounded-lg border border-indigo-500/10">
                        <div className="text-sm text-gray-400">Win/Loss Ratio</div>
                        <div className="text-xl font-bold">
                          {(performanceData.winLossStats.winningTrades / Math.max(1, performanceData.winLossStats.losingTrades)).toFixed(1)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <h3 className="text-lg font-medium mb-3">Streaks</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="p-3 bg-indigo-900/20 rounded-lg border border-indigo-500/10">
                          <div className="text-sm text-gray-400">Current Streak</div>
                          <div className="text-xl font-bold text-green-400">
                            {performanceData.winLossStats.currentStreak} wins
                          </div>
                        </div>
                        
                        <div className="p-3 bg-indigo-900/20 rounded-lg border border-indigo-500/10">
                          <div className="text-sm text-gray-400">Longest Win Streak</div>
                          <div className="text-xl font-bold text-green-400">
                            {performanceData.winLossStats.longestWinStreak} wins
                          </div>
                        </div>
                        
                        <div className="p-3 bg-indigo-900/20 rounded-lg border border-indigo-500/10">
                          <div className="text-sm text-gray-400">Longest Loss Streak</div>
                          <div className="text-xl font-bold text-red-400">
                            {performanceData.winLossStats.longestLossStreak} losses
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="history">
              <Card className="bg-gradient-to-br from-indigo-900/40 to-purple-900/30 border-indigo-500/20">
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>Your complete trading history</CardDescription>
                </CardHeader>
                <CardContent className="max-h-[600px] overflow-y-auto p-0">
                  <TransactionHistory />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TradingHistory;
