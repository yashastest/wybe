
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/tradeUtils';
import { formatDistanceToNow } from 'date-fns';
import { ArrowUpRight, ArrowDownRight, Loader2 } from 'lucide-react';
import { TokenTransaction } from '@/services/token/types';

interface TradingActivityFeedProps {
  tokenSymbol: string;
  trades?: TokenTransaction[];
  isLoading?: boolean;
}

const TradingActivityFeed: React.FC<TradingActivityFeedProps> = ({ 
  tokenSymbol, 
  trades = [],
  isLoading = false
}) => {
  // Sample data to simulate a more complete trading activity feed
  const sampleTrades = trades.length > 0 ? trades : [
    {
      id: "1",
      txHash: "tx_123456789abcdef",
      tokenSymbol: tokenSymbol,
      tokenName: "Token Name",
      type: "buy",
      side: "buy",
      amount: 0.25,
      amountUsd: 75,
      price: 0.015,
      fee: 0.005,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      walletAddress: "wallet123",
      status: "confirmed",
      amountTokens: 5000,
      amountSol: 0.25
    },
    {
      id: "2",
      txHash: "tx_abcdef123456789",
      tokenSymbol: tokenSymbol,
      tokenName: "Token Name",
      type: "sell",
      side: "sell",
      amount: 0.15,
      amountUsd: 45,
      price: 0.014,
      fee: 0.003,
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      walletAddress: "wallet456",
      status: "confirmed",
      amountTokens: 3000,
      amountSol: 0.15
    },
    {
      id: "3",
      txHash: "tx_987654321abcdef",
      tokenSymbol: tokenSymbol,
      tokenName: "Token Name",
      type: "buy",
      side: "buy",
      amount: 0.42,
      amountUsd: 126,
      price: 0.0155,
      fee: 0.008,
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      walletAddress: "wallet789",
      status: "confirmed",
      amountTokens: 8400,
      amountSol: 0.42
    },
    {
      id: "4",
      txHash: "tx_fedcba123456789",
      tokenSymbol: tokenSymbol,
      tokenName: "Token Name",
      type: "sell",
      side: "sell",
      amount: 0.18,
      amountUsd: 54,
      price: 0.0145,
      fee: 0.004,
      timestamp: new Date(Date.now() - 28800000).toISOString(),
      walletAddress: "wallet321",
      status: "confirmed",
      amountTokens: 3600,
      amountSol: 0.18
    },
    {
      id: "5",
      txHash: "tx_13579abcdef2468",
      tokenSymbol: tokenSymbol,
      tokenName: "Token Name",
      type: "buy",
      side: "buy",
      amount: 0.55,
      amountUsd: 165,
      price: 0.0158,
      fee: 0.01,
      timestamp: new Date(Date.now() - 43200000).toISOString(),
      walletAddress: "wallet654",
      status: "confirmed",
      amountTokens: 11000,
      amountSol: 0.55
    }
  ];
  
  const sortedTrades = [...sampleTrades].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-6 w-6 text-purple-500 animate-spin mb-2" />
        <p className="text-sm text-gray-400">Loading trading activity...</p>
      </div>
    );
  }
  
  if (sortedTrades.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No trading activity yet</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
      {sortedTrades.map((trade) => {
        const isBuy = trade.side === 'buy' || trade.type === 'buy';
        const formattedTime = formatDistanceToNow(new Date(trade.timestamp), { addSuffix: true });
        
        return (
          <div 
            key={trade.id} 
            className="bg-[#1A1F2C]/70 border border-gray-800 rounded-lg p-2.5"
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Badge 
                  className={`mr-2 ${isBuy ? 'bg-green-600/80' : 'bg-red-500/80'} text-white border-0`}
                >
                  {isBuy ? (
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 mr-1" />
                  )}
                  {isBuy ? 'BUY' : 'SELL'}
                </Badge>
                <div>
                  <div className="font-medium text-sm">
                    {isBuy ? 'Bought' : 'Sold'} {Math.floor(trade.amountTokens || 0).toLocaleString()} {tokenSymbol}
                  </div>
                  <div className="text-xs text-gray-400 flex items-center">
                    <span className="inline-block w-16">Price</span>
                    <span className="font-medium text-white">${trade.price.toFixed(6)}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-sm font-medium">
                  {trade.amountSol?.toFixed(3) || (trade.amount || 0).toFixed(3)} SOL
                </div>
                <div className="text-xs text-gray-400">
                  {formattedTime}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TradingActivityFeed;
