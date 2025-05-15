
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, RefreshCw, Wallet, X, Check, Loader } from 'lucide-react';
import { tokenTradingService, TokenTransaction } from '@/services/tokenTradingService';
import { useWallet } from '@/hooks/useWallet.tsx';
import { toast } from 'sonner';

interface TransactionHistoryProps {
  tokenSymbol?: string;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ tokenSymbol }) => {
  const { connected, address } = useWallet();
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const loadTransactions = async () => {
    if (!connected || !address) {
      setTransactions([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const txs = await tokenTradingService.getUserTransactions(address, tokenSymbol);
      setTransactions(txs);
    } catch (error) {
      console.error('Failed to load transactions:', error);
      toast.error('Failed to load transaction history');
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadTransactions();
  }, [connected, address, tokenSymbol]);
  
  if (!connected) {
    return (
      <div className="bg-indigo-950/50 rounded-xl p-4 md:p-6 border border-indigo-500/20 text-center">
        <Wallet className="w-8 h-8 mx-auto mb-3 text-indigo-400 opacity-70" />
        <h3 className="text-lg font-bold text-indigo-200 mb-2">Connect Your Wallet</h3>
        <p className="text-gray-400 text-sm">
          Connect your wallet to view your transaction history for this token.
        </p>
      </div>
    );
  }
  
  return (
    <div className="bg-indigo-950/50 rounded-xl overflow-hidden border border-indigo-500/20">
      <div className="flex items-center justify-between p-4 border-b border-indigo-500/20">
        <h3 className="font-bold text-lg text-indigo-200">
          {tokenSymbol ? `${tokenSymbol} Transactions` : 'Your Transactions'}
        </h3>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={loadTransactions}
          disabled={isLoading}
          className="text-indigo-300 hover:text-indigo-100"
        >
          {isLoading ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
        </Button>
      </div>
      
      <div className="overflow-x-auto">
        {isLoading && transactions.length === 0 ? (
          <div className="text-center p-8">
            <Loader className="h-6 w-6 mx-auto mb-3 animate-spin text-indigo-400" />
            <p className="text-indigo-200">Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center p-8">
            <p className="text-gray-400">No transactions found.</p>
          </div>
        ) : (
          <table className="w-full min-w-full">
            <thead className="bg-indigo-900/40">
              <tr>
                <th className="py-2 px-4 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="py-2 px-4 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">
                  Type
                </th>
                {!tokenSymbol && (
                  <th className="py-2 px-4 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">
                    Token
                  </th>
                )}
                <th className="py-2 px-4 text-right text-xs font-medium text-indigo-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="py-2 px-4 text-right text-xs font-medium text-indigo-300 uppercase tracking-wider">
                  Value
                </th>
                <th className="py-2 px-4 text-center text-xs font-medium text-indigo-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="py-2 px-4 text-right text-xs font-medium text-indigo-300 uppercase tracking-wider">
                  Explorer
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-indigo-800/30">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-indigo-900/20 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-300 font-mono">
                    {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      tx.action === 'buy' 
                        ? 'bg-green-900/30 text-green-400 border border-green-500/30' 
                        : 'bg-red-900/30 text-red-400 border border-red-500/30'
                    }`}>
                      {tx.action}
                    </span>
                  </td>
                  {!tokenSymbol && (
                    <td className="py-3 px-4 text-sm text-white font-medium">
                      {tx.tokenSymbol}
                    </td>
                  )}
                  <td className="py-3 px-4 text-right text-sm text-white font-mono">
                    {tx.amountTokens.toLocaleString(undefined, {maximumFractionDigits: 2})} {tx.tokenSymbol}
                  </td>
                  <td className="py-3 px-4 text-right text-sm text-white font-mono">
                    {tx.amountSol.toFixed(5)} SOL
                  </td>
                  <td className="py-3 px-4 text-center">
                    {tx.status === 'confirmed' ? (
                      <Check className="h-4 w-4 text-green-400 mx-auto" />
                    ) : tx.status === 'pending' ? (
                      <Loader className="h-4 w-4 text-yellow-400 animate-spin mx-auto" />
                    ) : (
                      <X className="h-4 w-4 text-red-400 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <a 
                      href={`https://explorer.solana.com/tx/${tx.txHash}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-indigo-400 hover:text-indigo-200 inline-flex items-center"
                    >
                      <ArrowUpRight className="h-4 w-4" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;
