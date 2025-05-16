
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
          className="flex items-center gap-2 bg-[#2A1F3D] border-purple-800 hover:bg-[#3D2B52] text-white"
          onClick={connect}
        >
          <WalletIcon className="h-4 w-4" />
          Connect Wallet
        </Button>
      );
    }
    
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#2A1F3D] border border-purple-800 rounded-lg">
          <CircleDollarSign className="h-4 w-4 text-purple-400" />
          <span className="font-medium">{solBalance.toFixed(4)} SOL</span>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          className="h-8 px-3 bg-transparent border-gray-700 hover:bg-[#1A1F2C]"
        >
          {address.substring(0, 4)}...{address.substring(address.length - 4)}
        </Button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0C12] text-white flex flex-col">
      <Header />
      
      <main className="flex-grow px-2 sm:px-4 pt-20 pb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="max-w-[1920px] mx-auto"
        >
          {/* Top Trading Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent hidden md:block">
                Trading Terminal
              </h1>
              {selectedToken && (
                <Badge 
                  variant="outline" 
                  className="px-3 py-1 border-purple-800 bg-[#2A1F3D] text-white text-sm"
                >
                  {selectedToken.name} ({selectedToken.symbol})
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              {renderWalletButton()}
              
              <div className="flex items-center">
                {isEnhancedMode && (
                  <Badge 
                    variant="secondary" 
                    className="mr-2 bg-[#8B5CF6] text-white animate-pulse"
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
            <div className="flex flex-col items-center justify-center h-[70vh] w-full rounded-xl bg-[#0F1118]/80 border border-gray-800">
              <Loader2 className="h-10 w-10 text-[#8B5CF6] animate-spin mb-4" />
              <div className="text-xl font-medium">Loading trading terminal...</div>
            </div>
          ) : selectedToken && !isEnhancedMode ? (
            // Standard trading terminal
            <div className="w-full bg-[#0F1118]/80 border border-gray-800 backdrop-blur-md rounded-xl overflow-hidden">
              <TradingTerminal 
                tokens={tokens}
                selectedToken={selectedToken}
                onSelectToken={(token) => setSelectedToken(token)}
              />
            </div>
          ) : selectedToken ? (
            // Enhanced trading terminal
            <div className="space-y-4">
              {/* Main trading interface */}
              <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div className="lg:col-span-2 xl:col-span-3 bg-[#0F1118]/80 border border-gray-800 backdrop-blur-md rounded-xl overflow-hidden">
                  <TradingTerminal 
                    tokens={tokens}
                    selectedToken={selectedToken}
                    onSelectToken={(token) => setSelectedToken(token)}
                  />
                </div>
                
                {/* Right side enhanced panels */}
                <div className="space-y-4">
                  <WhaleSniperPanel />
                  <SessionPortfolio tokens={[]} />
                </div>
              </div>
              
              {/* Bottom enhanced panels */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <BondingCurveVisualizer 
                  initialPrice={selectedToken.price}
                  currentSupply={selectedToken.totalSupply || 100000000}
                  curveType="quadratic"
                  estimatedImpact={2.5}
                />
                <SentimentHeatmap 
                  tokens={[]}
                  onSelect={(symbol) => {
                    const token = tokens.find(t => t.symbol === symbol);
                    if (token) setSelectedToken(token);
                  }}
                />
                <AlertsPanel />
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
