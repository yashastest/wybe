
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
import { Loader2, Wallet as WalletIcon, CircleDollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import TokenPriceChart from '@/components/TokenPriceChart';
import DexScreenerListingProgress from '@/components/DexScreenerListingProgress';
import TradingActivityFeed from '@/components/TradingActivityFeed';
import { Card, CardContent } from '@/components/ui/card';

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
          {/* Top Trading Bar - Minimal and compact */}
          <div className="flex items-center justify-between gap-1 px-2 py-1 bg-[#0F1118]/90 border-b border-gray-800/50">
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
            
            <div className="flex items-center gap-2">
              {renderWalletButton()}
              
              <div className="flex items-center">
                {isEnhancedMode && (
                  <Badge 
                    variant="secondary" 
                    className="mr-1 px-1.5 py-0 text-xs bg-[#8B5CF6] text-white animate-pulse"
                  >
                    Pro
                  </Badge>
                )}
                <EnhancedModeToggle 
                  isEnhanced={isEnhancedMode} 
                  onToggle={() => setIsEnhancedMode(!isEnhancedMode)} 
                />
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[60vh] w-full rounded-lg bg-[#0F1118]/80 border border-gray-800">
              <Loader2 className="h-10 w-10 text-[#8B5CF6] animate-spin mb-4" />
              <div className="text-xl font-medium">Loading trading terminal...</div>
            </div>
          ) : selectedToken && !isEnhancedMode ? (
            // Standard trading terminal - More compact layout
            <div className="grid grid-cols-1 md:grid-cols-7 gap-1 mt-1">
              <div className="md:col-span-5 bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                {/* DexScreener Listing Progress - Small bar at top */}
                <div className="mb-2">
                  <DexScreenerListingProgress 
                    tokenSymbol={selectedToken.symbol}
                    progress={calculateListingProgress()}
                    status={Math.random() > 0.5 ? 'in_progress' : 'pending'}
                  />
                </div>
                
                {/* Main Trading Chart */}
                <div className="h-[250px] mb-2">
                  <TokenPriceChart symbol={selectedToken.symbol} height="100%" />
                </div>
                
                {/* Trading Activity Feed */}
                <div className="mb-2 bg-[#1A1F2C]/40 border border-gray-800/50 p-2 rounded-lg">
                  <div className="text-xs uppercase font-medium text-gray-400 mb-1">Trading Activity</div>
                  <div className="h-[120px]">
                    <TradingActivityFeed tokenSymbol={selectedToken.symbol} />
                  </div>
                </div>
                
                {/* Bonding Curve */}
                <div className="mb-2">
                  <div className="text-xs uppercase font-medium text-gray-400 mb-1">Bonding Curve</div>
                  <div className="h-[120px] bg-[#1A1F2C]/40 border border-gray-800/50 p-2 rounded-lg">
                    <BondingCurveVisualizer
                      initialPrice={selectedToken.price}
                      currentSupply={selectedToken.totalSupply || 100000000}
                      curveType="quadratic"
                      estimatedImpact={2.5}
                    />
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2 space-y-1">
                {/* Trading Form */}
                <Card className="border-white/10 bg-[#0F1118]/90 shadow-md">
                  <CardContent className="p-3">
                    <div className="text-sm font-medium mb-2">Trade {selectedToken.symbol}</div>
                    {/* Buy/Sell Form would go here */}
                    <div className="grid gap-2">
                      <div className="grid grid-cols-2 gap-1">
                        <Button variant="default" className="w-full bg-green-600 hover:bg-green-700">Buy</Button>
                        <Button variant="default" className="w-full bg-red-600 hover:bg-red-700">Sell</Button>
                      </div>
                      {/* Additional trading form fields would go here */}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Session Portfolio */}
                <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-3">
                  <div className="text-sm font-medium mb-2">Session Portfolio</div>
                  <SessionPortfolio tokens={[]} />
                </div>
              </div>
            </div>
          ) : selectedToken ? (
            // Enhanced trading terminal - Cockpit style with tighter spacing
            <div className="space-y-1 mt-1">
              {/* Top Section - DEX Screener Listing Progress */}
              <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2 mb-1">
                <DexScreenerListingProgress 
                  tokenSymbol={selectedToken.symbol}
                  progress={calculateListingProgress()}
                  status={Math.random() > 0.5 ? 'in_progress' : 'pending'}
                />
              </div>
              
              {/* Main trading interface - Tighter grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-1">
                {/* Left Side - Chart and Data Panels */}
                <div className="lg:col-span-8 grid grid-cols-1 gap-1">
                  {/* Trading Chart */}
                  <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                    <div className="text-xs uppercase font-medium text-gray-400 mb-1">Live Price Chart</div>
                    <div className="h-[250px]">
                      <TokenPriceChart symbol={selectedToken.symbol} height="100%" />
                    </div>
                  </div>
                  
                  {/* Trading Activity Feed */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                    <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                      <div className="text-xs uppercase font-medium text-gray-400 mb-1">Trading Activity</div>
                      <div className="h-[120px]">
                        <TradingActivityFeed tokenSymbol={selectedToken.symbol} />
                      </div>
                    </div>
                    
                    {/* Bonding Curve */}
                    <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                      <div className="text-xs uppercase font-medium text-gray-400 mb-1">Bonding Curve</div>
                      <BondingCurveVisualizer
                        initialPrice={selectedToken.price}
                        currentSupply={selectedToken.totalSupply || 100000000}
                        curveType="quadratic"
                        estimatedImpact={2.5}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Right Side - Trading Form and Additional Data */}
                <div className="lg:col-span-4 grid grid-cols-1 gap-1">
                  {/* Trading Form */}
                  <Card className="border-white/10 bg-[#0F1118]/90 shadow-md">
                    <CardContent className="p-3">
                      <div className="text-sm font-medium mb-2">Trade {selectedToken.symbol}</div>
                      <div className="grid gap-2">
                        <div className="grid grid-cols-2 gap-1">
                          <Button variant="default" className="w-full bg-green-600 hover:bg-green-700">Buy</Button>
                          <Button variant="default" className="w-full bg-red-600 hover:bg-red-700">Sell</Button>
                        </div>
                        {/* Additional trading form fields would go here */}
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Additional Data Panels */}
                  <div className="grid grid-cols-1 gap-1">
                    <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                      <WhaleSniperPanel />
                    </div>
                    <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                      <SessionPortfolio tokens={[]} />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Bottom enhanced panels - Tighter grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                  <SentimentHeatmap 
                    tokens={[]}
                    onSelect={(symbol) => {
                      const token = tokens.find(t => t.symbol === symbol);
                      if (token) setSelectedToken(token);
                    }}
                  />
                </div>
                <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                  <AlertsPanel />
                </div>
                <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                  <div className="text-xs uppercase font-medium text-gray-400 mb-1">Market Summary</div>
                  <div className="grid grid-cols-2 gap-1">
                    <div className="bg-[#1A1F2C]/40 border border-gray-800/50 p-1.5 rounded-md">
                      <div className="text-xs text-gray-400">Market Cap</div>
                      <div className="font-medium text-sm">${(selectedToken.marketCap || 48000).toLocaleString()}</div>
                    </div>
                    <div className="bg-[#1A1F2C]/40 border border-gray-800/50 p-1.5 rounded-md">
                      <div className="text-xs text-gray-400">24h Volume</div>
                      <div className="font-medium text-sm">${(selectedToken.volume24h || 12000).toLocaleString()}</div>
                    </div>
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
