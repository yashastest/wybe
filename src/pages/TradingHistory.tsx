
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useWallet } from '@/hooks/useWallet.tsx';
import { tokenTradingService } from '@/services/tokenTradingService';
import { Card } from '@/components/ui/card';
import TransactionHistory from '@/components/TransactionHistory';
import { Button } from '@/components/ui/button';
import { TokenTransaction } from '@/services/token/types';

const TradingHistory = () => {
  useScrollToTop();
  const { address, connected } = useWallet();
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { tokenSymbol } = useParams();
  
  useEffect(() => {
    const loadTransactions = async () => {
      if (connected && address) {
        setIsLoading(true);
        try {
          // Fix the API call to pass the correct parameters
          const data = await tokenTradingService.getUserTransactions(address);
          setTransactions(data);
        } catch (error) {
          console.error('Error loading transactions:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setTransactions([]);
        setIsLoading(false);
      }
    };
    
    loadTransactions();
  }, [address, connected, tokenSymbol]);
  
  return (
    <div className="min-h-screen bg-[#0A0C12] text-white flex flex-col">
      <Header />
      
      <main className="flex-grow px-4 pt-24 pb-16">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-3xl font-bold mb-6">Transaction History</h1>
            
            {!connected ? (
              <Card className="bg-[#0F1118]/80 border border-gray-800 p-8 text-center">
                <p className="text-gray-400 mb-4">Connect your wallet to view your transaction history</p>
                <Button onClick={() => {}}>Connect Wallet</Button>
              </Card>
            ) : (
              <TransactionHistory 
                transactions={transactions}
                isLoading={isLoading}
              />
            )}
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TradingHistory;
