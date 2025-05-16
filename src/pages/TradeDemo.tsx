
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import { tokenTradingService } from '@/services/tokenTradingService';
import { ListedToken } from '@/services/token/types'; // Updated import
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/hooks/useWallet.tsx';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { Loader2, Wallet as WalletIcon, CircleDollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import TradingScreen from '@/components/TradingScreen';

const TradeDemo: React.FC = () => {
  useScrollToTop();

  // Wallet and trading state
  const { connected, address, connect } = useWallet();
  const [tokens, setTokens] = useState<ListedToken[]>([]);
  const [selectedToken, setSelectedToken] = useState<ListedToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Use hooks for wallet balance
  const { solBalance } = useWalletBalance(selectedToken?.symbol);

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
          {/* Top Trading Bar */}
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
            
            <div className="flex items-center gap-2">
              {renderWalletButton()}
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-[60vh] w-full rounded-lg bg-[#0F1118]/80 border border-gray-800">
              <Loader2 className="h-10 w-10 text-[#8B5CF6] animate-spin mb-4" />
              <div className="text-xl font-medium">Loading trading terminal...</div>
            </div>
          ) : selectedToken ? (
            // Streamlined Trading Screen
            <TradingScreen
              selectedToken={selectedToken}
              tokens={tokens}
              onSelectToken={setSelectedToken}
            />
          ) : null}
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TradeDemo;
