
import React from 'react';
import { motion } from 'framer-motion';
import { ListedToken } from '@/services/token/types'; // Updated import
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

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
    <div className="w-full">
      {/* Token Basic Info */}
      <div className="flex items-center gap-3 mb-3">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm shadow-glow">
          {token.symbol.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{token.name}</h2>
            <Badge variant="outline" className="text-xs font-normal bg-[#1A1F2C] border-0">
              {token.symbol}
            </Badge>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge className="text-xs bg-green-600/80 hover:bg-green-700 border-0 cursor-pointer">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Live
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Launched on Solana blockchain</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium bg-gradient-to-r from-white via-gray-200 to-gray-300 bg-clip-text text-transparent">
              ${token.price.toFixed(6)}
            </span>
            <motion.span 
              className={`text-sm font-medium flex items-center ${token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'}`}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              {token.priceChange24h >= 0 ? (
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 mr-1" />
              )}
              {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h}%
            </motion.span>
          </div>
        </div>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-2">
        <div className="text-center p-1.5 rounded-md bg-[#1A1F2C]/50 border border-gray-800">
          <div className="text-xs text-gray-400 flex items-center justify-center gap-0.5">
            <Info className="h-3 w-3" />
            Market Cap
          </div>
          <div className="text-sm font-medium">{tradingStats.marketCap}</div>
        </div>
        <div className="text-center p-1.5 rounded-md bg-[#1A1F2C]/50 border border-gray-800">
          <div className="text-xs text-gray-400">24h Volume</div>
          <div className="text-sm font-medium">{tradingStats.volume24h}</div>
        </div>
        <div className="text-center p-1.5 rounded-md bg-[#1A1F2C]/50 border border-gray-800">
          <div className="text-xs text-gray-400">24h High</div>
          <div className="text-sm font-medium text-green-400">{tradingStats.high24h}</div>
        </div>
        <div className="text-center p-1.5 rounded-md bg-[#1A1F2C]/50 border border-gray-800">
          <div className="text-xs text-gray-400">24h Low</div>
          <div className="text-sm font-medium text-red-400">{tradingStats.low24h}</div>
        </div>
      </div>
    </div>
  );
};

export default TokenInfo;
