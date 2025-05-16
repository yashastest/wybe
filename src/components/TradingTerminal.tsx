import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ListedToken } from '@/services/tokenTradingService';
import TokenInfo from './TokenInfo';
import TokenSelector from './TokenSelector';
import TradingChart from './TradingChart';
import TradingActivityFeed from './TradingActivityFeed';
import TradeEntryPanel from './TradeEntryPanel';
import DexScreenerListingProgress from './DexScreenerListingProgress';
import { tradingService } from '@/services/token/tradingService';
import { formatCurrency } from '@/utils/tradeUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  ChartCandlestick, 
  ChartLine, 
  Eye, 
  Signal, 
  Star, 
  History, 
  RefreshCw, 
  TrendingUp,
  ChevronsUpDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useTokenTrading, TokenTrade } from '@/hooks/useTokenTrading';
import { useWallet } from '@/lib/wallet';
import { TokenTransaction } from '@/services/token/types';

interface TradingTerminalProps {
  tokens: ListedToken[];
  selectedToken: ListedToken;
  onSelectToken: (token: ListedToken) => void;
}

const TradingTerminal: React.FC<TradingTerminalProps> = ({ 
  tokens, 
  selectedToken, 
  onSelectToken 
}) => {
  const isMobile = useIsMobile();
  const { address, connected } = useWallet();
  const [timeframe, setTimeframe] = useState('1D');
  const [chartType, setChartType] = useState('candles');
  const [showTokenSelector, setShowTokenSelector] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Use the token trading hook for real functionality
  const { 
    trades, 
    tradeHistory, 
    fetchTradeHistory, 
    isLoading 
  } = useTokenTrading(selectedToken?.symbol);

  const fetchTradeData = async () => {
    if (connected && address && selectedToken) {
      setIsRefreshing(true);
      try {
        await fetchTradeHistory(address);
        toast.success("Trade data refreshed");
      } catch (error) {
        console.error("Failed to fetch trade history:", error);
        toast.error("Failed to refresh trade data");
      } finally {
        setIsRefreshing(false);
      }
    } else {
      toast.error("Connect wallet to view your trade history");
    }
  };

  useEffect(() => {
    if (connected && address && selectedToken) {
      fetchTradeHistory(address);
    }
  }, [connected, address, selectedToken, fetchTradeHistory]);

  // Calculate derived trading stats
  const high24h = selectedToken.price * 1.05; // Default calculation if high24h is not available
  const low24h = selectedToken.price * 0.95; // Default calculation if low24h is not available
  
  // Calculate trading stats
  const tradingStats = {
    marketCap: `$${formatCurrency(selectedToken.marketCap || 0)}`,
    volume24h: `$${formatCurrency(selectedToken.volume24h || 0)}`,
    high24h: `$${high24h.toFixed(6)}`,
    low24h: `$${low24h.toFixed(6)}`,
    priceChange: selectedToken.priceChange24h || 0
  };

  // Timeframe options
  const timeframes = [
    { value: '15m', label: '15m' },
    { value: '1H', label: '1H' },
    { value: '4H', label: '4H' },
    { value: '1D', label: '1D' },
    { value: '1W', label: '1W' },
  ];

  // Handler for trade execution
  const handleTrade = async (action: 'buy' | 'sell', amount: number, slippage: number, gasPriority: string) => {
    if (!connected || !address) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    try {
      const result = await tradingService.executeTrade({
        tokenSymbol: selectedToken.symbol,
        action,
        walletAddress: address,
        amountSol: action === 'buy' ? amount : undefined,
        amountTokens: action === 'sell' ? amount : undefined,
        gasPriority: gasPriority as any
      });
      
      if (result.success) {
        toast.success(
          `${action === 'buy' ? 'Bought' : 'Sold'} ${selectedToken.symbol} successfully`, 
          { description: `Transaction hash: ${result.txHash?.substring(0, 8)}...` }
        );
        
        // Refresh trade history after successful trade
        fetchTradeHistory(address);
      } else {
        toast.error(`Failed to ${action} ${selectedToken.symbol}`, { description: result.error });
      }
    } catch (error) {
      console.error(`Error during ${action} transaction:`, error);
      toast.error(`Error during ${action} transaction`);
    }
  };

  // Ensure tradeHistory is compatible with TokenTransaction[] type by mapping properties
  const convertedTradeHistory: TokenTransaction[] = tradeHistory ? 
    tradeHistory.map(trade => ({
      id: trade.id || String(Date.now()),
      txHash: trade.txHash || "",
      tokenSymbol: trade.tokenSymbol,
      tokenName: trade.tokenName || selectedToken.name,
      type: trade.type || trade.side || 'buy',
      side: trade.side || 'buy',
      amount: trade.amount,
      amountUsd: trade.amountUsd || trade.amount * selectedToken.price || 0,
      price: trade.price || selectedToken.price,
      fee: trade.fee || 0.001,
      timestamp: trade.timestamp,
      walletAddress: trade.walletAddress || address || "",
      status: trade.status === 'completed' ? 'confirmed' : trade.status || 'pending',
      amountTokens: trade.amountTokens,
      amountSol: trade.amountSol,
    })) : [];

  // Calculate DexScreener listing progress based on market cap
  const calculateListingProgress = () => {
    // Market cap requirements for listing
    const requiredMarketCap = 50000; // $50K
    
    if (!selectedToken.marketCap) return 0;
    
    const progress = Math.min(100, (selectedToken.marketCap / requiredMarketCap) * 100);
    return Math.round(progress);
  };

  // Determine DexScreener listing status
  const getDexScreenerStatus = () => {
    if (selectedToken.marketCap >= 50000) {
      return 'completed';
    } else if (selectedToken.marketCap >= 25000) {
      return 'in_progress';
    } else {
      return 'pending';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
      {/* Left Panel - Token Selector (Mobile: Hidden, Desktop: Shown) */}
      <motion.div 
        className={`fixed inset-0 z-50 bg-black/90 backdrop-blur-lg overflow-hidden transition-all ${
          showTokenSelector && isMobile ? 'block' : 'hidden'
        } lg:static lg:block lg:bg-transparent lg:backdrop-blur-none lg:z-0 lg:col-span-1`}
        initial={false}
        animate={showTokenSelector && isMobile ? { opacity: 1 } : { opacity: 0 }}
      >
        <div className={`absolute inset-y-0 left-0 w-full max-w-xs p-4 bg-[#0F1118] border-r border-gray-800 overflow-y-auto ${
          !isMobile && 'static w-full h-[calc(100vh-14rem)] max-h-[650px] rounded-xl border border-gray-800 bg-[#0F1118]/90 backdrop-blur-md'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium flex items-center">
              <ChevronsUpDown className="mr-2 h-4 w-4 text-purple-400" />
              Select Token
            </h3>
            {isMobile && (
              <Button 
                variant="ghost"
                size="icon"
                className="text-gray-400 hover:text-white"
                onClick={() => setShowTokenSelector(false)}
              >
                ✕
              </Button>
            )}
          </div>
          <TokenSelector 
            tokens={tokens}
            selectedToken={selectedToken}
            onSelectToken={(token) => {
              onSelectToken(token);
              if (isMobile) {
                setShowTokenSelector(false);
              }
            }}
          />
        </div>
      </motion.div>

      {/* Middle Panel - Trading Chart & Info */}
      <div className="lg:col-span-2 space-y-4">
        {/* Token Info Bar */}
        <div className="flex items-center justify-between mb-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex-grow"
          >
            <TokenInfo token={selectedToken} tradingStats={tradingStats} />
          </motion.div>

          {isMobile && (
            <Button
              variant="outline"
              onClick={() => setShowTokenSelector(true)}
              className="ml-2 p-2 rounded-lg bg-[#1A1F2C] border-gray-700"
            >
              <span className="sr-only">Select Token</span>
              Select
            </Button>
          )}
        </div>

        {/* Chart Controls */}
        <div className="flex flex-wrap items-center gap-2 mb-2 bg-[#0F1118]/60 border border-gray-800 rounded-lg p-1.5">
          <div className="flex p-0.5 bg-[#1A1F2C]/60 rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setChartType('candles')}
              className={`h-7 w-7 rounded-md ${
                chartType === 'candles' ? 'bg-[#232734]' : 'hover:bg-[#1A1F2C]'
              }`}
              aria-label="Candlestick chart"
            >
              <ChartCandlestick className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setChartType('line')}
              className={`h-7 w-7 rounded-md ${
                chartType === 'line' ? 'bg-[#232734]' : 'hover:bg-[#1A1F2C]'
              }`}
              aria-label="Line chart"
            >
              <ChartLine className="h-3.5 w-3.5" />
            </Button>
          </div>
          
          <div className="flex bg-[#1A1F2C]/60 rounded-lg overflow-hidden">
            {timeframes.map(tf => (
              <button
                key={tf.value}
                onClick={() => setTimeframe(tf.value)}
                className={`px-2 py-1 text-xs ${
                  timeframe === tf.value 
                    ? 'bg-[#232734] text-white' 
                    : 'text-gray-400 hover:bg-[#1A1F2C]'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
          
          <div className="flex-grow"></div>
          
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md bg-[#1A1F2C]/60 hover:bg-[#1A1F2C]">
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md bg-[#1A1F2C]/60 hover:bg-[#1A1F2C]">
              <Star className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md bg-[#1A1F2C]/60 hover:bg-[#1A1F2C]">
              <Signal className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Live Price Badge */}
        <div className="absolute top-4 right-4 z-10 bg-[#0F1118]/80 border border-gray-800 rounded-lg px-3 py-1.5 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-3.5 w-3.5 text-green-400" />
            <span className="text-sm font-medium">${selectedToken.price.toFixed(6)}</span>
          </div>
        </div>

        {/* Trading Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="relative rounded-xl overflow-hidden border border-gray-800 bg-[#0F1118]/80 h-[350px] sm:h-[400px]"
        >
          <TradingChart symbol={selectedToken.symbol} timeframe={timeframe} />
        </motion.div>

        {/* Trading Tabs (Mobile View - Tabs for Trade/Activity) */}
        <div className="lg:hidden mt-4">
          <Tabs defaultValue="trade">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="trade">Trade</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            <TabsContent value="trade" className="mt-4">
              <TradeEntryPanel 
                tokenSymbol={selectedToken.symbol}
                tokenPrice={selectedToken.price}
                onTrade={handleTrade}
              />
            </TabsContent>
            <TabsContent value="activity" className="mt-4">
              <div className="border border-gray-800 rounded-xl p-4 bg-[#0F1118]/80 backdrop-blur-md">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium flex items-center">
                    <Signal className="h-4 w-4 mr-1.5" />
                    Trading Activity
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={fetchTradeData}
                    disabled={isRefreshing}
                    className="h-7 text-xs bg-transparent border-gray-700"
                  >
                    {isRefreshing ? (
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <History className="h-3 w-3 mr-1" />
                    )}
                    Refresh
                  </Button>
                </div>
                <TradingActivityFeed 
                  tokenSymbol={selectedToken.symbol} 
                  trades={convertedTradeHistory}
                  isLoading={isLoading}
                />
              </div>
              
              {/* Add DexScreener Listing Progress for Mobile View */}
              <div className="mt-4">
                <DexScreenerListingProgress 
                  tokenSymbol={selectedToken.symbol}
                  progress={calculateListingProgress()}
                  status={getDexScreenerStatus()}
                  marketCap={selectedToken.marketCap}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Panel - Trade Entry Form & Activity Feed (Desktop Only) */}
      <div className="hidden lg:block space-y-4">
        {/* Trade Entry Panel */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <TradeEntryPanel 
            tokenSymbol={selectedToken.symbol}
            tokenPrice={selectedToken.price}
            onTrade={handleTrade}
          />
        </motion.div>

        {/* Activity Feed */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="border border-gray-800 rounded-xl p-4 bg-[#0F1118]/80 backdrop-blur-md"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium flex items-center">
              <Signal className="h-4 w-4 mr-1.5" />
              Trading Activity
            </h3>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchTradeData}
              disabled={isRefreshing}
              className="h-7 text-xs bg-transparent border-gray-700"
            >
              {isRefreshing ? (
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <History className="h-3 w-3 mr-1" />
              )}
              Refresh
            </Button>
          </div>
          <TradingActivityFeed 
            tokenSymbol={selectedToken.symbol} 
            trades={convertedTradeHistory}
            isLoading={isLoading}
          />
        </motion.div>
        
        {/* Add DexScreener Listing Progress for Desktop View */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <DexScreenerListingProgress 
            tokenSymbol={selectedToken.symbol}
            progress={calculateListingProgress()}
            status={getDexScreenerStatus()}
            marketCap={selectedToken.marketCap}
          />
        </motion.div>
      </div>
    </div>
  );
};

export default TradingTerminal;
