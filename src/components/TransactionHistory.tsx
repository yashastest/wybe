
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TokenTransaction } from '@/services/token/types';
import { ArrowUpRight, ArrowDownLeft, ChevronRight, Loader2, Ban } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface TransactionHistoryProps {
  transactions: TokenTransaction[];
  isLoading: boolean;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions, isLoading }) => {
  const transactionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: 'easeInOut' } },
  };

  const formatDate = (dateString: string): string => {
    try {
      // Handle various date formats and ensure we have a valid date
      if (!dateString) {
        return 'Invalid date';
      }
      
      const date = new Date(dateString);
      
      // Check if the date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date string:', dateString);
        return 'Invalid date';
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZoneName: 'short',
      });
    } catch (error) {
      console.error('Error formatting date:', error, 'Date string:', dateString);
      return 'Invalid date';
    }
  };

  const formatCurrency = (amount: number): string => {
    try {
      // Ensure amount is a valid number
      if (typeof amount !== 'number' || isNaN(amount)) {
        return '$0.00';
      }
      
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    } catch (error) {
      console.error('Error formatting currency:', error);
      return '$0.00';
    }
  };

  return (
    <Card className="bg-wybe-background-light border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Transaction History</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-none">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <div>
                    <Skeleton className="h-4 w-32 mb-1" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <Ban className="mx-auto h-6 w-6 mb-2" />
            No transactions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <motion.div className="min-w-[700px]">
              {transactions.map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  variants={transactionVariants}
                  initial="hidden"
                  animate="visible"
                  className={`flex items-center justify-between py-3 px-4 border-b border-gray-800 last:border-none hover:bg-gray-900/30 transition-colors duration-200`}
                >
                  <div className="flex items-center gap-4">
                    {transaction.side === 'buy' ? (
                      <ArrowUpRight className="text-green-500 h-5 w-5" />
                    ) : (
                      <ArrowDownLeft className="text-red-500 h-5 w-5" />
                    )}
                    <div>
                      <div className="font-medium">{transaction.tokenSymbol}</div>
                      <div className="text-xs text-gray-400">{formatDate(transaction.timestamp)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">
                      {transaction.side === 'buy' ? '+' : '-'} {(transaction.amount || 0).toFixed(6)}
                    </div>
                    <div className="text-xs text-gray-400">{formatCurrency(transaction.amountUsd || 0)}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
