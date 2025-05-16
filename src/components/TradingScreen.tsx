
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import TokenPriceChart from '@/components/TokenPriceChart';
import DexScreenerListingProgress from '@/components/DexScreenerListingProgress';
import BondingCurveVisualizer from '@/components/BondingCurveVisualizer';
import TradingActivityFeed from '@/components/TradingActivityFeed';
import { ChartCandlestick, ChartLine, Circle, CircleDollarSign, Wallet as WalletIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListedToken } from '@/services/token/types';
import { TokenTransaction } from '@/services/token/types';
import TradeEntryPanel from './TradeEntryPanel';
import { useWallet } from '@/hooks/useWallet.tsx';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { formatCurrency } from '@/utils/tradeUtils';
import TradingViewChart from './TradingViewChart';

interface TradingScreenProps {
  selectedToken: ListedToken | null;
  tokens: ListedToken[];
  onSelectToken: (token: ListedToken) => void;
}

const TradingScreen: React.FC<TradingScreenProps> = ({
  selectedToken,
  tokens,
  onSelectToken,
}) => {
  const [chartType, setChartType] = useState<'price' | 'marketCap'>('price');
  const [timeframe, setTimeframe] = useState<'24h' | '7d' | '30d'>('24h');
  const { connected, address, connect } = useWallet();
  const { solBalance } = useWalletBalance(selectedToken?.symbol);

  if (!selectedToken) return null;

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
    if (selectedToken.marketCap && selectedToken.marketCap >= 50000) {
      return 'completed';
    } else if (selectedToken.marketCap && selectedToken.marketCap >= 25000) {
      return 'in_progress';
    } else {
      return 'pending';
    }
  };

  // Mock trading activity data
  const mockTradeActivity: TokenTransaction[] = [
    {
      id: "1",
      txHash: "0x123abc...",
      tokenSymbol: selectedToken.symbol,
      tokenName: selectedToken.name,
      type: 'buy',
      side: 'buy',
      amount: 0.5,
      amountUsd: 0.5 * selectedToken.price,
      price: selectedToken.price,
      fee: 0.01,
      timestamp: new Date().toISOString(),
      walletAddress: "0xf45...abc",
      status: 'confirmed',
    },
    {
      id: "2",
      txHash: "0x456def...",
      tokenSymbol: selectedToken.symbol,
      tokenName: selectedToken.name,
      type: 'sell',
      side: 'sell',
      amount: 0.3,
      amountUsd: 0.3 * selectedToken.price,
      price: selectedToken.price,
      fee: 0.008,
      timestamp: new Date(Date.now() - 300000).toISOString(),
      walletAddress: "0xabc...123",
      status: 'confirmed',
    },
  ];

  // Mock whale tracking data (recent large transactions)
  const whaleTransactions = [
    {
      id: "w1",
      txHash: "0xwhale1...",
      tokenSymbol: selectedToken.symbol,
      tokenName: selectedToken.name,
      type: 'buy',
      side: 'buy',
      amount: 50,
      amountUsd: 50 * selectedToken.price,
      price: selectedToken.price,
      fee: 0.1,
      timestamp: new Date(Date.now() - 1800000).toISOString(),
      walletAddress: "0xWhale1...abc",
      status: 'confirmed',
    },
    {
      id: "w2",
      txHash: "0xwhale2...",
      tokenSymbol: selectedToken.symbol,
      tokenName: selectedToken.name,
      type: 'buy',
      side: 'buy',
      amount: 35.5,
      amountUsd: 35.5 * selectedToken.price,
      price: selectedToken.price,
      fee: 0.08,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      walletAddress: "0xWhale2...def",
      status: 'confirmed',
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
      {/* Trading Chart Panel */}
      <div className="lg:col-span-2 space-y-1">
        {/* TradingView Chart */}
        <TradingViewChart
          symbol={selectedToken.symbol}
          timeframe="1D"
          chartType={chartType}
          onChartTypeChange={setChartType}
        />

        {/* DEXScreener Listing Progress */}
        <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
          <DexScreenerListingProgress 
            tokenSymbol={selectedToken.symbol}
            progress={calculateListingProgress()}
            status={getDexScreenerStatus()}
            marketCap={selectedToken.marketCap}
          />
        </div>
        
        {/* Lower panels - Token Details & Bonding Curve */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
          {/* Token Details Panel */}
          <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
            <div className="text-xs uppercase font-medium text-gray-400 mb-2">Token Details</div>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#1A1F2C]/40 border border-gray-800/50 p-2 rounded-md">
                <div className="text-xs text-gray-400">Market Cap</div>
                <div className="font-medium text-sm">${(selectedToken.marketCap || 48000).toLocaleString()}</div>
              </div>
              <div className="bg-[#1A1F2C]/40 border border-gray-800/50 p-2 rounded-md">
                <div className="text-xs text-gray-400">24h Volume</div>
                <div className="font-medium text-sm">${(selectedToken.volume24h || 12000).toLocaleString()}</div>
              </div>
              <div className="bg-[#1A1F2C]/40 border border-gray-800/50 p-2 rounded-md">
                <div className="text-xs text-gray-400">Liquidity</div>
                <div className="font-medium text-sm">${(selectedToken.liquidity || 6400).toLocaleString()}</div>
              </div>
              <div className="bg-[#1A1F2C]/40 border border-gray-800/50 p-2 rounded-md">
                <div className="text-xs text-gray-400">24h Change</div>
                <div className={`font-medium text-sm ${
                  (selectedToken.priceChange24h || 0) >= 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {(selectedToken.priceChange24h || 5.2) >= 0 ? '+' : ''}
                  {(selectedToken.priceChange24h || 5.2).toFixed(2)}%
                </div>
              </div>
            </div>
            <div className="mt-2 bg-[#1A1F2C]/40 border border-gray-800/50 p-2 rounded-md">
              <div className="text-xs text-gray-400">Contract Address</div>
              <div className="text-xs font-mono text-gray-300 truncate">
                {selectedToken.contractAddress || '0x7Ef23...a38F'}
              </div>
            </div>
          </div>
          
          {/* Bonding Curve Panel */}
          <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
            <div className="text-xs uppercase font-medium text-gray-400 mb-2">Bonding Curve</div>
            <div className="h-[150px]">
              <BondingCurveVisualizer
                initialPrice={selectedToken.price}
                currentSupply={selectedToken.totalSupply || 100000000}
                curveType="quadratic"
                estimatedImpact={2.5}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Column - Trading Interface & Activity Feeds */}
      <div className="space-y-1">
        {/* Trading Interface */}
        <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
          <div className="text-xs uppercase font-medium text-gray-400 mb-2">Trade {selectedToken.symbol}</div>
          {!connected ? (
            <div className="flex flex-col items-center justify-center py-6 px-4">
              <CircleDollarSign className="h-10 w-10 text-gray-500 mb-4" />
              <p className="text-center text-gray-400 mb-4">Connect your wallet to start trading</p>
              <Button onClick={connect} className="bg-purple-600 hover:bg-purple-700">
                <WalletIcon className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            </div>
          ) : (
            <TradeEntryPanel
              tokenSymbol={selectedToken.symbol}
              tokenPrice={selectedToken.price}
              onTrade={(action, amount, slippage, gasPriority) => {
                console.log('Trade executed:', { action, amount, slippage, gasPriority });
              }}
            />
          )}
        </div>
        
        {/* Trading Activity & Whale Tracking Tabs */}
        <Tabs defaultValue="activity" className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
          <TabsList className="border border-gray-800/50 bg-[#1A1F2C]/40 mb-2">
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="whales">Whale Tracking</TabsTrigger>
          </TabsList>
          <TabsContent value="activity" className="m-0">
            <div className="h-[250px] overflow-y-auto pr-1">
              <TradingActivityFeed
                tokenSymbol={selectedToken.symbol}
                trades={mockTradeActivity}
                isLoading={false}
              />
            </div>
          </TabsContent>
          <TabsContent value="whales" className="m-0">
            <div className="h-[250px] overflow-y-auto pr-1">
              <div className="space-y-3">
                {whaleTransactions.map((tx) => (
                  <motion.div 
                    key={tx.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#1A1F2C]/40 border border-gray-700/30 rounded-md p-2"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-1">
                          <Circle className={`h-2 w-2 ${tx.type === 'buy' ? 'text-green-500' : 'text-red-500'} fill-current`} />
                          <span className="text-xs font-medium text-gray-200">
                            Whale {tx.walletAddress.substring(0, 6)}...
                          </span>
                        </div>
                        <div className="flex items-center mt-1">
                          <span className={`text-sm font-medium ${tx.type === 'buy' ? 'text-green-500' : 'text-red-500'}`}>
                            {tx.type === 'buy' ? 'Bought' : 'Sold'} {formatCurrency(tx.amount)} SOL
                          </span>
                          <span className="text-xs text-gray-400 ml-1">
                            (${formatCurrency(tx.amountUsd)})
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400">
                          {new Date(tx.timestamp).toLocaleTimeString()}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="h-6 mt-1 text-xs bg-[#232734]/60 border-gray-700/50"
                        >
                          Copy Trade
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TradingScreen;
