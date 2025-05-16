
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TradingTerminal from '@/components/TradingTerminal';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { tokenTradingService, ListedToken } from '@/services/tokenTradingService';

const TradeDemo = () => {
  // Add scroll to top hook
  useScrollToTop();

  const [tokens, setTokens] = useState<ListedToken[]>([]);
  const [selectedToken, setSelectedToken] = useState<ListedToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const listedTokens = await tokenTradingService.getListedTokens();
        setTokens(listedTokens);
        setSelectedToken(listedTokens[0]); // Set the first token as default
      } catch (error) {
        console.error("Failed to fetch tokens:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();
  }, []);

  return (
    <div className="min-h-screen bg-[#0F1118] text-white flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-2 sm:px-4 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
            Trading Terminal
          </h1>
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-pulse text-xl">Loading trading terminal...</div>
            </div>
          ) : selectedToken && (
            <TradingTerminal 
              tokens={tokens}
              selectedToken={selectedToken}
              onSelectToken={(token) => setSelectedToken(token)}
            />
          )}
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TradeDemo;
