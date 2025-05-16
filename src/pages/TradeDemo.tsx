
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
            // Standard trading terminal - More compact with chart preview
            <div className="grid grid-cols-1 md:grid-cols-7 gap-1 mt-1">
              <div className="md:col-span-5 bg-[#0F1118]/90 border border-gray-800/50 overflow-hidden rounded-lg">
                <TradingTerminal 
                  tokens={tokens}
                  selectedToken={selectedToken}
                  onSelectToken={(token) => setSelectedToken(token)}
                />
              </div>
              <div className="md:col-span-2 grid grid-rows-2 gap-1">
                <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2 min-h-[180px]">
                  <div className="text-sm font-medium mb-1">Price Chart</div>
                  <div className="h-[120px]">
                    <TokenPriceChart symbol={selectedToken.symbol} height="100%" compact={true} />
                  </div>
                </div>
                <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                  <SessionPortfolio tokens={[]} />
                </div>
              </div>
            </div>
          ) : selectedToken ? (
            // Enhanced trading terminal - Cockpit style with tighter spacing
            <div className="space-y-1 mt-1">
              {/* Main trading interface - tighter grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-1">
                {/* Trading terminal */}
                <div className="lg:col-span-8 bg-[#0F1118]/90 border border-gray-800/50 backdrop-blur-md rounded-lg overflow-hidden">
                  <TradingTerminal 
                    tokens={tokens}
                    selectedToken={selectedToken}
                    onSelectToken={(token) => setSelectedToken(token)}
                  />
                </div>
                
                {/* Right side enhanced panels - Stacked and compact */}
                <div className="lg:col-span-4 grid grid-cols-1 gap-1">
                  <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                    <div className="text-xs uppercase font-medium text-gray-400 mb-1">Live Price Chart</div>
                    <div className="h-[140px]">
                      <TokenPriceChart symbol={selectedToken.symbol} height="100%" />
                    </div>
                  </div>
                  <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                    <WhaleSniperPanel />
                  </div>
                  <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                    <SessionPortfolio tokens={[]} />
                  </div>
                </div>
              </div>
              
              {/* Bottom enhanced panels - Tighter grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
                <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                  <div className="text-xs uppercase font-medium text-gray-400 mb-1">Bonding Curve</div>
                  <BondingCurveVisualizer 
                    initialPrice={selectedToken.price}
                    currentSupply={selectedToken.totalSupply || 100000000}
                    curveType="quadratic"
                    estimatedImpact={2.5}
                  />
                </div>
                <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                  <div className="text-xs uppercase font-medium text-gray-400 mb-1">Market Sentiment</div>
                  <SentimentHeatmap 
                    tokens={[]}
                    onSelect={(symbol) => {
                      const token = tokens.find(t => t.symbol === symbol);
                      if (token) setSelectedToken(token);
                    }}
                  />
                </div>
                <div className="bg-[#0F1118]/90 border border-gray-800/50 rounded-lg p-2">
                  <div className="text-xs uppercase font-medium text-gray-400 mb-1">Alerts</div>
                  <AlertsPanel />
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
