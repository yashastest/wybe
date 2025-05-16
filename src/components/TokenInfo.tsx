
import React from 'react';
import { ListedToken } from '@/services/tokenTradingService';
import { Badge } from '@/components/ui/badge';

interface TokenInfoProps {
  token: ListedToken;
  tradingStats: {
    marketCap: string;
    volume24h: string;
    high24h: string;
    low24h: string;
    priceChange: number;
  };
}

const TokenInfo: React.FC<TokenInfoProps> = ({ token, tradingStats }) => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
      {/* Token Basic Info */}
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
          {token.symbol.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{token.name}</h2>
            <Badge variant="outline" className="text-xs font-normal bg-[#1A1F2C] border-0">
              {token.symbol}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
              ${token.price.toFixed(6)}
            </span>
            <span className={`text-sm font-medium ${token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h}%
            </span>
          </div>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
        <div className="text-center p-1.5 rounded-md bg-[#1A1F2C]/30">
          <div className="text-xs text-gray-400">Market Cap</div>
          <div className="text-sm font-medium">{tradingStats.marketCap}</div>
        </div>
        <div className="text-center p-1.5 rounded-md bg-[#1A1F2C]/30">
          <div className="text-xs text-gray-400">24h Volume</div>
          <div className="text-sm font-medium">{tradingStats.volume24h}</div>
        </div>
        <div className="text-center p-1.5 rounded-md bg-[#1A1F2C]/30">
          <div className="text-xs text-gray-400">24h High</div>
          <div className="text-sm font-medium">{tradingStats.high24h}</div>
        </div>
        <div className="text-center p-1.5 rounded-md bg-[#1A1F2C]/30">
          <div className="text-xs text-gray-400">24h Low</div>
          <div className="text-sm font-medium">{tradingStats.low24h}</div>
        </div>
      </div>
    </div>
  );
};

export default TokenInfo;
