
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ListedToken } from '@/services/tokenTradingService';
import TokenInfo from './TokenInfo';
import TokenSelector from './TokenSelector';
import TradingChart from './TradingChart';
import TradingActivityFeed from './TradingActivityFeed';
import TradeEntryPanel from './TradeEntryPanel';
import { tradingService } from '@/services/token/tradingService';
import { formatCurrency } from '@/utils/tradeUtils';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useIsMobile } from '@/hooks/use-mobile';
import { ChartCandlestick, ChartLine, Eye, Signal, Star } from 'lucide-react';

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
  const [timeframe, setTimeframe] = useState('1D');
  const [chartType, setChartType] = useState('candles');
  const [showTokenSelector, setShowTokenSelector] = useState(false);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [tradeHistory, setTradeHistory] = useState<any[]>([]);

  const fetchTradeHistory = async (symbol: string) => {
    try {
      // Fetch trade history from API
      console.log(`Fetching trade history for ${symbol}...`);
      // This would be replaced with real API call
      setTradeHistory([]);
    } catch (error) {
      console.error("Failed to fetch trade history:", error);
    }
  };

  useEffect(() => {
    // Simulate checking wallet connection
    const checkWalletConnection = () => {
      const isConnected = localStorage.getItem('walletConnected') === 'true';
      const walletAddress = localStorage.getItem('walletAddress');
      
      setConnected(isConnected);
      setAddress(walletAddress);
    };
    
    checkWalletConnection();
  }, []);

  useEffect(() => {
    if (connected && address && selectedToken) {
      fetchTradeHistory(selectedToken.symbol);
    }
  }, [connected, address, selectedToken.symbol, fetchTradeHistory]);

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

  const handleTrade = (action: 'buy' | 'sell', amount: number, slippage: number, gasPriority: string) => {
    console.log(`${action} ${amount} SOL of ${selectedToken.symbol} with ${slippage}% slippage and ${gasPriority} gas`);
    // Here you would call your trading service
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Left Panel - Token Selector (Mobile: Hidden, Desktop: Shown) */}
      <motion.div 
        className={`fixed inset-0 z-50 bg-black/80 backdrop-blur-sm overflow-hidden transition-all ${
          showTokenSelector && isMobile ? 'block' : 'hidden'
        } lg:static lg:block lg:bg-transparent lg:backdrop-blur-none lg:z-0 lg:col-span-1`}
        initial={false}
        animate={showTokenSelector && isMobile ? { opacity: 1 } : { opacity: 0 }}
      >
        <div className={`absolute inset-y-0 left-0 w-full max-w-xs p-4 bg-[#0F1118] border-r border-gray-800 overflow-y-auto ${
          !isMobile && 'static w-full h-[calc(100vh-12rem)] rounded-xl border'
        }`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Select Token</h3>
            {isMobile && (
              <button 
                className="text-gray-400 hover:text-white"
                onClick={() => setShowTokenSelector(false)}
              >
                ✕
              </button>
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
        <div className="flex items-center justify-between mb-2 lg:mb-4">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-grow"
          >
            <TokenInfo token={selectedToken} tradingStats={tradingStats} />
          </motion.div>

          {isMobile && (
            <button
              onClick={() => setShowTokenSelector(true)}
              className="ml-2 p-2 rounded-lg bg-[#1A1F2C] border border-gray-800"
            >
              <span className="sr-only">Select Token</span>
              Change
            </button>
          )}
        </div>

        {/* Chart Controls */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <div className="flex p-1 bg-[#1A1F2C]/60 rounded-lg">
            <button
              onClick={() => setChartType('candles')}
              className={`p-1.5 rounded-md ${
                chartType === 'candles' ? 'bg-[#232734]' : 'hover:bg-[#1A1F2C]'
              }`}
              aria-label="Candlestick chart"
            >
              <ChartCandlestick className="h-4 w-4" />
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`p-1.5 rounded-md ${
                chartType === 'line' ? 'bg-[#232734]' : 'hover:bg-[#1A1F2C]'
              }`}
              aria-label="Line chart"
            >
              <ChartLine className="h-4 w-4" />
            </button>
          </div>
          
          <div className="flex bg-[#1A1F2C]/60 rounded-lg overflow-hidden">
            {timeframes.map(tf => (
              <button
                key={tf.value}
                onClick={() => setTimeframe(tf.value)}
                className={`px-2.5 py-1.5 text-xs ${
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
          
          <div className="flex gap-1.5">
            <button className="p-1.5 rounded-md bg-[#1A1F2C]/60 hover:bg-[#1A1F2C]">
              <Eye className="h-4 w-4" />
            </button>
            <button className="p-1.5 rounded-md bg-[#1A1F2C]/60 hover:bg-[#1A1F2C]">
              <Star className="h-4 w-4" />
            </button>
            <button className="p-1.5 rounded-md bg-[#1A1F2C]/60 hover:bg-[#1A1F2C]">
              <Signal className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Trading Chart */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl overflow-hidden border border-gray-800 bg-[#0F1118]"
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
              <div className="border border-gray-800 rounded-xl p-4 bg-[#0F1118]">
                <h3 className="text-sm font-medium mb-3 flex items-center">
                  <Signal className="h-4 w-4 mr-1.5" />
                  Trading Activity
                </h3>
                <TradingActivityFeed tokenSymbol={selectedToken.symbol} />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Right Panel - Trade Entry Form & Activity Feed (Desktop Only) */}
      <div className="hidden lg:block space-y-4">
        {/* Trade Entry Panel */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
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
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="border border-gray-800 rounded-xl p-4 bg-[#0F1118]"
        >
          <h3 className="text-sm font-medium mb-3 flex items-center">
            <Signal className="h-4 w-4 mr-1.5" />
            Trading Activity
          </h3>
          <TradingActivityFeed tokenSymbol={selectedToken.symbol} />
        </motion.div>
      </div>
    </div>
  );
};

export default TradingTerminal;
