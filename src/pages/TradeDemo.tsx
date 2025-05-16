
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

const TradeDemo = () => {
  // Add scroll to top hook
  useScrollToTop();

  const [tokens, setTokens] = useState<ListedToken[]>([]);
  const [selectedToken, setSelectedToken] = useState<ListedToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnhancedMode, setIsEnhancedMode] = useState(false);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const listedTokens = await tokenTradingService.getListedTokens();
        // Ensure tokens have calculated high24h and low24h properties
        const enhancedTokens = listedTokens.map(token => ({
          ...token,
        }));
        setTokens(enhancedTokens);
        setSelectedToken(enhancedTokens[0]); // Set the first token as default
      } catch (error) {
        console.error("Failed to fetch tokens:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();
  }, []);

  return (
    <div className={`min-h-screen ${isEnhancedMode ? 'bg-[#0F172A]' : 'bg-[#0F1118]'} text-white flex flex-col`}>
      <Header />
      
      <main className="flex-grow container mx-auto px-2 sm:px-4 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
              Trading Terminal
            </h1>
            
            <div className="flex items-center">
              {isEnhancedMode && (
                <Badge 
                  variant="secondary" 
                  className="mr-3 bg-[#8B5CF6] text-white animate-pulse"
                >
                  Enhanced Mode
                </Badge>
              )}
              <EnhancedModeToggle 
                isEnhanced={isEnhancedMode} 
                onToggle={() => setIsEnhancedMode(!isEnhancedMode)} 
              />
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-pulse text-xl">Loading trading terminal...</div>
            </div>
          ) : selectedToken && !isEnhancedMode ? (
            // Standard trading terminal
            <TradingTerminal 
              tokens={tokens}
              selectedToken={selectedToken}
              onSelectToken={(token) => setSelectedToken(token)}
            />
          ) : selectedToken && isEnhancedMode ? (
            // Enhanced trading terminal
            <>
              {/* Main trading interface */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                <div className="lg:col-span-2">
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
            </>
          )}
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TradeDemo;
