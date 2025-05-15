
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@/hooks/useWallet.tsx';
import { Badge } from '@/components/ui/badge';
import { tokenTradingService, TokenTransaction } from '@/services/tokenTradingService';
import { ArrowDown, ArrowUp, History, Wallet, BarChart3, StopCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface TransactionHistoryProps {
  tokenSymbol?: string;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ tokenSymbol }) => {
  const { connected, address } = useWallet();
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!connected || !address) {
        return;
      }

      setIsLoading(true);
      setIsError(false);

      try {
        // Fetch transactions for the current user and token
        const userTransactions = await tokenTradingService.getUserTransactions(address);
        
        // Filter by token if needed
        const filteredTransactions = tokenSymbol 
          ? userTransactions.filter(tx => tx.tokenSymbol.toLowerCase() === tokenSymbol.toLowerCase())
          : userTransactions;
          
        setTransactions(filteredTransactions);
      } catch (error) {
        console.error('Error fetching transaction history:', error);
        setIsError(true);
        
        // Use demo data in case of error
        generateDemoTransactions();
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [connected, address, tokenSymbol]);

  // Generate demo transactions if none are available or for testing
  const generateDemoTransactions = () => {
    const demoTransactions: TokenTransaction[] = [];
    const types: ('buy' | 'sell')[] = ['buy', 'sell'];
    const currentSymbol = tokenSymbol || 'TOKEN';
    
    // Generate 10 random transactions in the past week
    for (let i = 0; i < 10; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const amount = Math.floor(Math.random() * 10000) + 100;
      const price = 0.00023 * (1 + (Math.random() * 0.1 - 0.05)); // Price with some variation
      const daysAgo = Math.floor(Math.random() * 7) + 1;
      const timestamp = new Date();
      timestamp.setDate(timestamp.getDate() - daysAgo);
      
      demoTransactions.push({
        id: `tx-${i}`,
        tokenSymbol: currentSymbol,
        type: type,
        side: type, // Adding side for compatibility
        amount,
        amountTokens: type === 'buy' ? amount : undefined,
        amountSol: type === 'sell' ? amount * price : undefined,
        price,
        timestamp: timestamp.toISOString(),
        status: 'confirmed',
        txHash: `TX${Math.random().toString(36).substring(2, 10)}`,
        walletAddress: address || 'demo-wallet'
      });
    }
    
    // Sort by timestamp, most recent first
    demoTransactions.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    
    setTransactions(demoTransactions);
  };

  // Show connect wallet prompt if not connected
  if (!connected) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-full p-4 bg-black/20 rounded-xl border border-indigo-500/20"
      >
        <Wallet className="w-10 h-10 text-indigo-400 mb-3 opacity-70" />
        <h3 className="text-lg font-medium mb-2">Connect Wallet</h3>
        <p className="text-sm text-gray-400 text-center">
          Connect your wallet to view your transaction history
        </p>
      </motion.div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px]">
        <div className="w-10 h-10 border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-gray-400">Loading transaction history...</p>
      </div>
    );
  }

  // Show empty state if no transactions
  if (transactions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-full p-6"
      >
        <History className="w-10 h-10 text-gray-500 mb-3" />
        <h3 className="text-lg font-medium mb-1">No Transactions</h3>
        <p className="text-sm text-gray-400 text-center">
          You haven't made any {tokenSymbol ? `${tokenSymbol} ` : ''}transactions yet
        </p>
        <button
          onClick={generateDemoTransactions}
          className="mt-4 px-4 py-2 bg-indigo-700/50 hover:bg-indigo-600/50 text-indigo-200 text-sm rounded-lg"
        >
          Show Demo Transactions
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3 p-1">
      {transactions.map((tx, index) => {
        // Use side if available, otherwise fall back to type
        const transactionType = tx.side || tx.type;
        
        return (
          <motion.div
            key={tx.id || index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`p-3 rounded-lg border ${
              transactionType === 'buy' 
                ? 'bg-green-900/20 border-green-500/30' 
                : 'bg-red-900/20 border-red-500/30'
            }`}
          >
            <div className="flex justify-between mb-1">
              <div className="flex items-center">
                <div className={`p-1.5 rounded-full mr-2 ${
                  transactionType === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'
                }`}>
                  {transactionType === 'buy' ? (
                    <ArrowDown className="h-3.5 w-3.5 text-green-400" />
                  ) : (
                    <ArrowUp className="h-3.5 w-3.5 text-red-400" />
                  )}
                </div>
                <span className="font-medium text-sm">
                  {transactionType === 'buy' ? 'Buy' : 'Sell'} {tx.tokenSymbol}
                </span>
              </div>
              <Badge variant={tx.status === 'confirmed' ? 'green' : 'secondary'} className="text-xs font-medium">
                {tx.status === 'confirmed' ? 'Confirmed' : tx.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-1 mt-2 text-xs">
              <div className="text-gray-400">Amount:</div>
              <div className="text-right font-mono">
                {transactionType === 'buy' ? (tx.amountTokens || tx.amount) : tx.amount} {tx.tokenSymbol}
              </div>
              
              <div className="text-gray-400">Price:</div>
              <div className="text-right font-mono">
                {typeof tx.price === 'number' ? tx.price.toFixed(6) : 'N/A'} SOL
              </div>
              
              <div className="text-gray-400">Total Value:</div>
              <div className="text-right font-mono">
                {transactionType === 'sell' ? (tx.amountSol || (tx.price ? tx.amount * tx.price : 'N/A')) : (tx.price && tx.amount ? (tx.price * tx.amount).toFixed(4) : 'N/A')} SOL
              </div>
            </div>
            
            <div className="mt-2 flex justify-between items-center border-t border-white/10 pt-2 text-[11px] text-gray-500">
              <div className="truncate max-w-[150px]">
                {tx.txHash ? `Tx: ${tx.txHash.substring(0, 8)}...` : 'No hash'}
              </div>
              <div>
                {tx.timestamp && formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default TransactionHistory;
