
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import TokenInfo from './TokenInfo';
import TokenSelector from './TokenSelector';
import TokenPriceChart from './TokenPriceChart';
import TransactionHistory from './TransactionHistory';
import TradingTerminal from './TradingTerminal';
import { useTokenTrading } from '@/hooks/useTokenTrading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListedToken, TokenTransaction } from '@/services/token/types';
import { useWallet } from '@/hooks/useWallet.tsx';
import { transactionService } from '@/services/token/transactionService';

interface TradingScreenProps {
  selectedToken: ListedToken;
  tokens: ListedToken[];
  onSelectToken: (token: ListedToken) => void;
}

const TradingScreen: React.FC<TradingScreenProps> = ({ selectedToken, tokens, onSelectToken }) => {
  const { address } = useWallet();
  const { solBalance, tokenBalance, isLoading: tradingLoading } = useTokenTrading(selectedToken?.symbol);
  const [activeTab, setActiveTab] = useState('trading');
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch transaction history
  useEffect(() => {
    const fetchTransactions = async () => {
      if (address) {
        setIsLoading(true);
        try {
          const transactions = await transactionService.getUserTransactions(address);
          setTransactions(transactions);
        } catch (error) {
          console.error('Error fetching transactions:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchTransactions();
  }, [address, selectedToken]);
  
  // Trading stats (could be fetched from an API or calculated)
  const tradingStats = {
    marketCap: selectedToken?.marketCap ? `$${selectedToken.marketCap.toLocaleString()}` : 'N/A',
    volume24h: selectedToken?.volume24h ? `$${selectedToken.volume24h.toLocaleString()}` : 'N/A',
    high24h: `$${(selectedToken?.price * 1.05).toFixed(6)}`,
    low24h: `$${(selectedToken?.price * 0.95).toFixed(6)}`,
    priceChange: selectedToken?.priceChange24h || selectedToken?.change24h || 0,
  };
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Left column - Token selector and info */}
      <div className="lg:col-span-1 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="bg-[#0F1118]/80 border border-gray-800">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Select Token</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 pt-0">
              <TokenSelector 
                tokens={tokens} 
                selectedToken={selectedToken} 
                onSelectToken={onSelectToken} 
              />
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
        >
          <Card className="bg-[#0F1118]/80 border border-gray-800">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Token Info</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <TokenInfo token={selectedToken} tradingStats={tradingStats} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Right column - Trading interface and transactions */}
      <div className="lg:col-span-2 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
        >
          <Card className="bg-[#0F1118]/80 border border-gray-800">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">Price Chart</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2">
              <TokenPriceChart tokenSymbol={selectedToken?.symbol} />
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.3 }}
        >
          <Tabs defaultValue="trading" className="w-full">
            <TabsList className="w-full bg-[#1A1F2C]/50 p-0.5">
              <TabsTrigger 
                value="trading" 
                className="flex-1 data-[state=active]:bg-[#1A1F2C]"
                onClick={() => setActiveTab('trading')}
              >
                Trading
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="flex-1 data-[state=active]:bg-[#1A1F2C]"
                onClick={() => setActiveTab('history')}
              >
                History
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="trading" className="mt-4">
              <Card className="bg-[#0F1118]/80 border border-gray-800">
                <CardContent className="p-4">
                  <TradingTerminal 
                    token={selectedToken}
                    solBalance={solBalance}
                    tokenBalance={tokenBalance}
                    isLoading={tradingLoading}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="history" className="mt-4">
              <TransactionHistory 
                transactions={transactions}
                isLoading={isLoading}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default TradingScreen;
