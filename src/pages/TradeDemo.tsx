
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TradingTerminal from '@/components/TradingTerminal';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { tokenTradingService, ListedToken } from '@/services/tokenTradingService';
import EnhancedModeToggle from '@/components/EnhancedModeToggle';
import WhaleSniperPanel from '@/components/WhaleSniperPanel';
import SentimentHeatmap from '@/components/SentimentHeatmap';
import AlertsPanel from '@/components/AlertsPanel';
import SessionPortfolio from '@/components/SessionPortfolio';
import BondingCurveVisualizer from '@/components/BondingCurveVisualizer';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/hooks/useWallet.tsx';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { useTokenTrading } from '@/hooks/useTokenTrading';
import { Loader2, Wallet as WalletIcon, CircleDollarSign, Sparkles, TrendingUp, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import TokenPriceChart from '@/components/TokenPriceChart';
import DexScreenerListingProgress from '@/components/DexScreenerListingProgress';
import TradingActivityFeed from '@/components/TradingActivityFeed';
import { Card, CardContent } from '@/components/ui/card';
import TradingInterface from '@/components/TradingInterface';

// Utility function to define features available in each mode
const FEATURES = {
  standard: {
    tradingChart: true,
    dexScreener: true,
    tradingActivity: true,
    bondingCurve: true,
    sessionPortfolio: true,
    basicTrading: true,
  },
  pro: {
    tradingChart: true,
    dexScreener: true,
    tradingActivity: true,
    bondingCurve: true,
    sessionPortfolio: true,
    basicTrading: true,
    // Pro-only features
    whaleSniper: true,
    sentimentHeatmap: true,
    alertsPanel: true,
    marketSummary: true,
    advancedTrading: true,
  }
};

const TradeDemo: React.FC = () => {
  useScrollToTop();

  // Wallet and trading state
  const { connected, address, connect } = useWallet();
  const [tokens, setTokens] = useState<ListedToken[]>([]);
  const [selectedToken, setSelectedToken] = useState<ListedToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnhancedMode, setIsEnhancedMode] = useState(true);
  
  // Use hooks for wallet balance and trading functionality
  const { solBalance, tokenBalances, refreshBalances } = useWalletBalance(selectedToken?.symbol);
  const { trades, executeTrade, isLoading: tradeLoading } = useTokenTrading(selectedToken?.symbol);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const listedTokens = await tokenTradingService.getListedTokens();
        const enhancedTokens = listedTokens.map(token => ({
          ...token,
        }));
        setTokens(enhancedTokens);
        setSelectedToken(enhancedTokens[0]);
      } catch (error) {
        console.error("Failed to fetch tokens:", error);
        toast.error("Failed to load trading tokens");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();
  }, []);

  // Refresh balances when selected token changes
  useEffect(() => {
    if (connected && address && selectedToken) {
      refreshBalances();
    }
  }, [connected, address, selectedToken, refreshBalances]);
  
  // Toggle enhanced mode with visual feedback
  const handleToggleMode = () => {
    setIsEnhancedMode(prev => !prev);
    toast.success(`Switched to ${!isEnhancedMode ? 'Standard' : 'Pro'} Mode`);
  };

  // Display a connect wallet button if not connected
  const renderWalletButton = () => {
    if (!connected) {
      return (
        <Button 
          variant="outline" 
          className="flex items-center gap-2 bg-[#1A1F2C]/80 border-purple-800 hover:bg-[#3D2B52] text-white"
          onClick={connect}
        >
          <WalletIcon className="h-4 w-4" />
          Connect Wallet
        </Button>
      );
    }
    
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#1A1F2C]/80 border border-purple-800 rounded-lg">
          <CircleDollarSign className="h-3.5 w-3.5 text-purple-400" />
          <span className="font-medium text-sm">{solBalance.toFixed(4)} SOL</span>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="h-7 px-2.5 py-0 bg-[#1A1F2C]/80 border-gray-700 hover:bg-[#1A1F2C] text-xs"
        >
          {address.substring(0, 4)}...{address.substring(address.length - 4)}
        </Button>
      </div>
    );
  };

  // Calculate mock progress for DexScreener listing
  const calculateListingProgress = () => {
    return Math.round(Math.random() * 100);
  };

  return (
    <div className="min-h-screen bg-[#0A0C12] text-white flex flex-col">
      <Header />
      
      <main className="flex-grow px-0 sm:px-1 pt-14 pb-1">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-[1920px] mx-auto"
        >
          {/* Top Trading Bar with Prominent Toggle */}
          <div className="relative flex items-center justify-between gap-2 px-3 py-2 bg-gradient-to-r from-[#0F1118]/95 via-[#131726]/95 to-[#0F1118]/95 border-b border-gray-800/50 shadow-md mb-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent hidden md:block">
                Trading Terminal
              </h1>
              {selectedToken && (
                <Badge 
                  variant="outline" 
                  className="px-2 py-0.5 border-purple-800 bg-[#1A1F2C]/80 text-white text-xs"
                >
                  {selectedToken.name} ({selectedToken.symbol})
                </Badge>
              )}
            </div>
            
            {/* Prominent Mode Toggle in center */}
            <motion.div
              className="absolute left-1/2 transform -translate-x-1/2 top-2"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            >
              <EnhancedModeToggle 
                isEnhanced={isEnhancedMode} 
                onToggle={handleToggleMode}
              />
            </motion.div>
            
            <div className="flex items-center gap-2">
              {renderWalletButton()}
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[60vh] w-full rounded-lg bg-[#0F1118]/80 border border-gray-800">
              <Loader2 className="h-10 w-10 text-[#8B5CF6] animate-spin mb-4" />
              <div className="text-xl font-medium">Loading trading terminal...</div>
            </div>
          ) : selectedToken && !isEnhancedMode ? (
            // STANDARD MODE - More compact layout with essential features
            <div className="grid grid-cols-1 gap-1">
              {/* DexScreener Listing Progress (Compact) */}
              <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                <DexScreenerListingProgress 
                  tokenSymbol={selectedToken.symbol}
                  progress={calculateListingProgress()}
                  status={Math.random() > 0.5 ? 'in_progress' : 'pending'}
                />
              </div>
              
              {/* Main Trading Area */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-1">
                {/* Left Column - Chart */}
                <div className="md:col-span-8 bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                  <div className="text-xs uppercase font-medium text-gray-400 mb-1">Price Chart</div>
                  <div className="h-[250px]">
                    <TokenPriceChart symbol={selectedToken.symbol} height="100%" />
                  </div>
                </div>
                
                {/* Right Column - Trading Interface */}
                <div className="md:col-span-4 bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                  <TradingInterface 
                    tokens={tokens.map(t => ({ symbol: t.symbol, name: t.name, price: t.price }))}
                    selectedToken={{ symbol: selectedToken.symbol, name: selectedToken.name, price: selectedToken.price }}
                    onSelectToken={(token) => {
                      const selected = tokens.find(t => t.symbol === token.symbol);
                      if (selected) setSelectedToken(selected);
                    }}
                  />
                </div>
              </div>
              
              {/* Trading Activity + Bonding Curve */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                {/* Trading Activity */}
                <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                  <div className="text-xs uppercase font-medium text-gray-400 mb-1">Trading Activity</div>
                  <div className="h-[150px]">
                    <TradingActivityFeed tokenSymbol={selectedToken.symbol} />
                  </div>
                </div>
                
                {/* Bonding Curve */}
                <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                  <div className="text-xs uppercase font-medium text-gray-400 mb-1">Bonding Curve</div>
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
              
              {/* Session Portfolio */}
              <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                <div className="text-xs uppercase font-medium text-gray-400 mb-1">Session Portfolio</div>
                <div className="h-[100px]">
                  <SessionPortfolio tokens={[]} />
                </div>
              </div>
            </div>
          ) : selectedToken ? (
            // PRO MODE - Advanced cockpit with additional features
            <div className="space-y-1">
              {/* DexScreener Listing Progress */}
              <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                <DexScreenerListingProgress 
                  tokenSymbol={selectedToken.symbol}
                  progress={calculateListingProgress()}
                  status={Math.random() > 0.5 ? 'in_progress' : 'pending'}
                />
              </div>
              
              {/* Main Trading Area - 3 column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-16 gap-1">
                {/* Left Column - Chart */}
                <div className="lg:col-span-8 bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                  <div className="text-xs uppercase font-medium text-gray-400 mb-1">Advanced Price Chart</div>
                  <div className="h-[280px]">
                    <TokenPriceChart symbol={selectedToken.symbol} height="100%" />
                  </div>
                </div>
                
                {/* Middle Column - Trading Activity + Bonding Curve */}
                <div className="lg:col-span-4 space-y-1">
                  <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                    <div className="text-xs uppercase font-medium text-gray-400 mb-1">Trading Activity</div>
                    <div className="h-[136px]">
                      <TradingActivityFeed tokenSymbol={selectedToken.symbol} />
                    </div>
                  </div>
                  <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                    <div className="text-xs uppercase font-medium text-gray-400 mb-1">Bonding Curve</div>
                    <div className="h-[136px]">
                      <BondingCurveVisualizer
                        initialPrice={selectedToken.price}
                        currentSupply={selectedToken.totalSupply || 100000000}
                        curveType="quadratic"
                        estimatedImpact={2.5}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Trading Interface */}
                <div className="lg:col-span-4 bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                  <TradingInterface 
                    tokens={tokens.map(t => ({ symbol: t.symbol, name: t.name, price: t.price }))}
                    selectedToken={{ symbol: selectedToken.symbol, name: selectedToken.name, price: selectedToken.price }}
                    onSelectToken={(token) => {
                      const selected = tokens.find(t => t.symbol === token.symbol);
                      if (selected) setSelectedToken(selected);
                    }}
                  />
                </div>
              </div>
              
              {/* PRO features - Bottom panels */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                {/* Whale Sniper Panel - PRO FEATURE */}
                <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-xs uppercase font-medium text-gray-400">Whale Sniper</div>
                    <Badge variant="outline" className="bg-purple-600/40 border-purple-500 text-[10px] flex items-center gap-0.5">
                      <Sparkles className="h-3 w-3" />
                      PRO
                    </Badge>
                  </div>
                  <div className="h-[120px]">
                    <WhaleSniperPanel />
                  </div>
                </div>
                
                {/* Sentiment Heatmap - PRO FEATURE */}
                <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-xs uppercase font-medium text-gray-400">Sentiment Analysis</div>
                    <Badge variant="outline" className="bg-purple-600/40 border-purple-500 text-[10px] flex items-center gap-0.5">
                      <Sparkles className="h-3 w-3" />
                      PRO
                    </Badge>
                  </div>
                  <div className="h-[120px]">
                    <SentimentHeatmap
                      tokens={[]}
                      onSelect={(symbol) => {
                        const token = tokens.find(t => t.symbol === symbol);
                        if (token) setSelectedToken(token);
                      }}
                    />
                  </div>
                </div>
                
                {/* Market Summary - PRO FEATURE */}
                <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-xs uppercase font-medium text-gray-400">Market Summary</div>
                    <Badge variant="outline" className="bg-purple-600/40 border-purple-500 text-[10px] flex items-center gap-0.5">
                      <Sparkles className="h-3 w-3" />
                      PRO
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
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
                      <div className="font-medium text-sm text-green-500">+{(selectedToken.priceChange24h || 5.2).toFixed(2)}%</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Session Portfolio + Alerts (Side by side) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                {/* Session Portfolio */}
                <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                  <div className="text-xs uppercase font-medium text-gray-400 mb-1">Session Portfolio</div>
                  <div className="h-[100px]">
                    <SessionPortfolio tokens={[]} />
                  </div>
                </div>
                
                {/* Alerts Panel - PRO FEATURE */}
                <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                  <div className="flex justify-between items-center mb-1">
                    <div className="text-xs uppercase font-medium text-gray-400">Price Alerts</div>
                    <Badge variant="outline" className="bg-purple-600/40 border-purple-500 text-[10px] flex items-center gap-0.5">
                      <Sparkles className="h-3 w-3" />
                      PRO
                    </Badge>
                  </div>
                  <div className="h-[100px]">
                    <AlertsPanel />
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TradeDemo;
