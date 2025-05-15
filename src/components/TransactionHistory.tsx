
import React, { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet.tsx';
import { useTokenTrading, TradeHistoryFilters } from '@/hooks/useTokenTrading';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface TransactionHistoryProps {
  tokenSymbol?: string;
  fullSize?: boolean;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ tokenSymbol, fullSize = false }) => {
  const { connected, address } = useWallet();
  const { fetchTradeHistory } = useTokenTrading();
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTokenFilter, setSelectedTokenFilter] = useState('');
  const [selectedActionFilter, setSelectedActionFilter] = useState('');
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  const tradeApi = useTokenTrading();
  
  // Fetch transaction history when wallet is connected or filter changes
  useEffect(() => {
    if (connected && address) {
      fetchTransactions();
    }
  }, [connected, address, selectedTokenFilter, selectedActionFilter, startDate, endDate]);
  
  const fetchTransactions = async () => {
    if (!address) return;
    
    setIsLoading(true);
    
    try {
      // Create filter object
      const filters: TradeHistoryFilters = {};
      
      if (selectedTokenFilter) {
        filters.tokenSymbol = selectedTokenFilter;
      } else if (tokenSymbol) {
        // If component has a tokenSymbol prop, use it as default filter
        filters.tokenSymbol = tokenSymbol;
      }
      
      if (selectedActionFilter) {
        filters.side = selectedActionFilter as 'buy' | 'sell';
      }
      
      if (startDate) {
        filters.startDate = startDate;
      }
      
      if (endDate) {
        filters.endDate = endDate;
      }
      
      // Fetch transactions with filters
      const transactions = await tradeApi.fetchTradeHistory(address, filters);
      setTransactions(transactions || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to load transaction history");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to clear filters
  const clearFilters = () => {
    setSelectedTokenFilter('');
    setSelectedActionFilter('');
    setStartDate(undefined);
    setEndDate(undefined);
  };
  
  // Function to format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  // Sorting transactions
  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
  
  return (
    <div className={`w-full ${fullSize ? 'h-full' : 'max-h-[400px]'} overflow-y-auto rounded-md`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Transaction History</h3>
        <div className="flex items-center space-x-2">
          <select
            value={selectedTokenFilter}
            onChange={(e) => setSelectedTokenFilter(e.target.value)}
            className="bg-black/40 border border-gray-700 text-white rounded-md p-2 text-sm"
          >
            <option value="">All Tokens</option>
            <option value="PEPE">PEPE</option>
            <option value="DOGE">DOGE</option>
            <option value="SHIB">SHIB</option>
            {/* Add more tokens as needed */}
          </select>
          <select
            value={selectedActionFilter}
            onChange={(e) => setSelectedActionFilter(e.target.value)}
            className="bg-black/40 border border-gray-700 text-white rounded-md p-2 text-sm"
          >
            <option value="">All Actions</option>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
          <input
            type="date"
            onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : undefined)}
            className="bg-black/40 border border-gray-700 text-white rounded-md p-2 text-sm"
          />
          <input
            type="date"
            onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : undefined)}
            className="bg-black/40 border border-gray-700 text-white rounded-md p-2 text-sm"
          />
          <button
            onClick={clearFilters}
            className="bg-gray-700 hover:bg-gray-600 text-white rounded-md p-2 text-sm"
          >
            Clear Filters
          </button>
        </div>
      </div>
      {isLoading ? (
        <div className="text-center py-4">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-4">No transactions found.</div>
      ) : (
        <table className="min-w-full divide-y divide-gray-800">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-gray-400">Date</th>
              <th className="px-4 py-2 text-left text-gray-400">Type</th>
              <th className="px-4 py-2 text-left text-gray-400">Token</th>
              <th className="px-4 py-2 text-left text-gray-400">Amount</th>
              <th className="px-4 py-2 text-left text-gray-400">Value</th>
              <th className="px-4 py-2 text-left text-gray-400">Status</th>
              <th className="px-4 py-2 text-left text-gray-400">TX Hash</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
          {sortedTransactions.map((tx) => (
            <tr key={tx.txHash || tx.id} className="border-b border-gray-800">
              <td className="py-3 px-4">
                {formatDate(tx.timestamp)}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center">
                  <span className={`font-mono ${
                    tx.side === 'buy' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {tx.side === 'buy' ? 'BUY' : 'SELL'}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4 font-mono">
                {tx.tokenSymbol}
              </td>
              <td className="py-3 px-4 font-mono">
                {(tx.amountTokens || tx.amount).toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </td>
              <td className="py-3 px-4 font-mono">
                {(tx.amountSol || (tx.amount * (tx.price || 0))).toFixed(5)} SOL
              </td>
              <td className="py-3 px-4">
                <Badge variant={
                  tx.status === 'completed' || tx.status === 'confirmed' ? 'green' : 
                  tx.status === 'pending' ? 'outline' : 'destructive'
                }>
                  {tx.status === 'confirmed' ? 'Completed' : 
                   tx.status === 'completed' ? 'Completed' : 
                   tx.status === 'pending' ? 'Pending' : 'Failed'}
                </Badge>
              </td>
              <td className="py-3 px-4">
                {tx.txHash && (
                  <a 
                    href={`https://explorer.solana.com/tx/${tx.txHash}?cluster=devnet`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-indigo-400 hover:text-indigo-300"
                  >
                    {tx.txHash.substring(0, 8)}...
                  </a>
                )}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionHistory;
