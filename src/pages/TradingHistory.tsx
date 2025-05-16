import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useWallet } from '@/hooks/useWallet.tsx';
import { tokenTradingService, TokenTransaction } from '@/services/tokenTradingService';
import { TradeHistoryFilters } from '@/services/token/types';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useScrollToTop } from '@/hooks/useScrollToTop';
import TransactionHistory from '@/components/TransactionHistory';
import { toast } from 'sonner';

const TradingHistory: React.FC = () => {
  const { connected, address } = useWallet();
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filter, setFilter] = useState<TradeHistoryFilters>({});
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [searchToken, setSearchToken] = useState<string>('');

  useEffect(() => {
    if (connected && address) {
      fetchTransactions();
    }
  }, [connected, address, filter]);

  const fetchTransactions = async () => {
    if (!address) return;
    
    setIsLoading(true);
    try {
      const updatedFilter: TradeHistoryFilters = { 
        ...filter,
        // walletAddress is now part of TradeHistoryFilters
      };
      
      if (fromDate) {
        updatedFilter.startDate = fromDate;
      }
      
      if (toDate) {
        updatedFilter.endDate = toDate;
      }
      
      if (searchToken) {
        updatedFilter.tokenSymbol = searchToken;
      }
      
      const txHistory = await tokenTradingService.getUserTransactions(address, updatedFilter);
      setTransactions(txHistory);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (key: keyof TradeHistoryFilters, value: any) => {
    setFilter(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    fetchTransactions();
  };

  const clearFilters = () => {
    setFilter({});
    setFromDate(undefined);
    setToDate(undefined);
    setSearchToken('');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 pt-24 pb-12">
        <h1 className="text-3xl font-bold mb-8">Trading History</h1>
        
        {!connected ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-xl mb-4">Connect your wallet to view your trading history</p>
              <Button size="lg">Connect Wallet</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Filter Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Token Symbol</label>
                    <div className="flex space-x-2">
                      <Input 
                        placeholder="Enter token symbol" 
                        value={searchToken}
                        onChange={(e) => setSearchToken(e.target.value)}
                        className="flex-grow"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Transaction Type</label>
                    <Select 
                      value={filter.side || ''} 
                      onValueChange={(value) => handleFilterChange('side', value || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All types" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All types</SelectItem>
                        <SelectItem value="buy">Buy</SelectItem>
                        <SelectItem value="sell">Sell</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Status</label>
                    <Select 
                      value={filter.status || ''} 
                      onValueChange={(value) => handleFilterChange('status', value || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All statuses" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All statuses</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="failed">Failed</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">From Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {fromDate ? format(fromDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={fromDate}
                          onSelect={setFromDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">To Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {toDate ? format(toDate, "PPP") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={toDate}
                          onSelect={setToDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="flex items-end space-x-2">
                    <Button onClick={handleSearch} className="flex-grow">
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                    <Button variant="outline" onClick={clearFilters}>
                      Clear
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">Loading transactions...</div>
                ) : transactions.length === 0 ? (
                  <div className="text-center py-8">No transactions found</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left">
                          <th className="px-4 py-2">Date</th>
                          <th className="px-4 py-2">Token</th>
                          <th className="px-4 py-2">Type</th>
                          <th className="px-4 py-2">Amount</th>
                          <th className="px-4 py-2">Price</th>
                          <th className="px-4 py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((tx) => (
                          <tr key={tx.id} className="border-t border-gray-700">
                            <td className="px-4 py-3">
                              {new Date(tx.timestamp).toLocaleDateString()}
                              <div className="text-xs text-gray-400">
                                {new Date(tx.timestamp).toLocaleTimeString()}
                              </div>
                            </td>
                            <td className="px-4 py-3">{tx.tokenSymbol}</td>
                            <td className="px-4 py-3">
                              <span className={tx.type === 'buy' ? 'text-green-500' : 'text-red-500'}>
                                {tx.type.toUpperCase()}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              {tx.amountTokens ? tx.amountTokens.toLocaleString() : tx.amount.toLocaleString()} {tx.tokenSymbol}
                            </td>
                            <td className="px-4 py-3">{tx.price} SOL</td>
                            <td className="px-4 py-3">
                              <span 
                                className={`px-2 py-1 rounded text-xs ${
                                  tx.status === 'confirmed' ? 'bg-green-900/30 text-green-500' :
                                  tx.status === 'pending' ? 'bg-yellow-900/30 text-yellow-500' :
                                  'bg-red-900/30 text-red-500'
                                }`}
                              >
                                {tx.status.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default TradingHistory;
