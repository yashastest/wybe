
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPercentage, formatNumber } from '@/utils/tradeUtils';
import { RefreshCw, Briefcase, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useWallet } from '@/lib/wallet';
import { useTokenTrading } from '@/hooks/useTokenTrading';
import { toast } from 'sonner';

interface PortfolioToken {
  symbol: string;
  name: string;
  amount: number;
  entryPrice: number;
  currentPrice: number;
  totalInvested: number;
}

interface SessionPortfolioProps {
  tokens: PortfolioToken[];
  onReset?: () => void;
}

const SessionPortfolio: React.FC<SessionPortfolioProps> = ({ tokens, onReset }) => {
  const { address, connected } = useWallet();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Use real trading state if available, or sample data
  const { trades } = useTokenTrading();
  
  // If no tokens provided, use sample data
  const portfolioTokens = tokens.length > 0 ? tokens : [
    {
      symbol: 'WYBE',
      name: 'Wybe Token',
      amount: 125000,
      entryPrice: 0.00032,
      currentPrice: 0.00042,
      totalInvested: 40
    },
    {
      symbol: 'DOGE',
      name: 'Dogecoin',
      amount: 1000,
      entryPrice: 0.12,
      currentPrice: 0.15,
      totalInvested: 120
    },
    {
      symbol: 'SHIB',
      name: 'Shiba Inu',
      amount: 10000000,
      entryPrice: 0.000025,
      currentPrice: 0.000022,
      totalInvested: 250
    }
  ];
  
  // Calculate total portfolio stats
  const totalInvested = portfolioTokens.reduce((sum, token) => sum + token.totalInvested, 0);
  const currentValue = portfolioTokens.reduce((sum, token) => sum + (token.amount * token.currentPrice), 0);
  const totalPnL = currentValue - totalInvested;
  const pnlPercentage = totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;
  
  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      toast.success("Portfolio reset for this session");
      // In a real app, this would clear the session portfolio data
    }
  };
  
  const refreshPortfolio = () => {
    setIsRefreshing(true);
    
    // Simulate refresh with a timeout
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Portfolio refreshed");
    }, 1000);
  };
  
  return (
    <Card className="bg-[#0F1118]/80 border border-gray-800 backdrop-blur-md rounded-xl">
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle className="text-lg flex items-center">
          <Briefcase className="text-[#8B5CF6] w-5 h-5 mr-2" />
          <span>Session Portfolio</span>
        </CardTitle>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-400 hover:text-white hover:bg-[#1A1F2C]"
            onClick={refreshPortfolio}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="outline"
            className="h-7 text-xs bg-transparent border-gray-700"
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <motion.div 
            className="bg-[#1A1F2C]/70 p-3 border border-gray-800 rounded-lg"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-xs text-gray-400">Invested</div>
            <div className="text-base font-medium mt-1">${formatCurrency(totalInvested)}</div>
          </motion.div>
          
          <motion.div 
            className="bg-[#1A1F2C]/70 p-3 border border-gray-800 rounded-lg"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="text-xs text-gray-400">Current</div>
            <div className="text-base font-medium mt-1">${formatCurrency(currentValue)}</div>
          </motion.div>
          
          <motion.div 
            className={`bg-[#1A1F2C]/70 p-3 border rounded-lg ${
              totalPnL >= 0 ? 'border-green-800/30' : 'border-red-800/30'
            }`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="text-xs text-gray-400">Session P&L</div>
            <div className={`text-base font-medium mt-1 flex items-center ${
              totalPnL >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {totalPnL >= 0 ? (
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 mr-1" />
              )}
              {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}
              <span className="ml-1 text-xs">
                ({formatPercentage(pnlPercentage)})
              </span>
            </div>
          </motion.div>
        </div>
        
        <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
          {portfolioTokens.map((token, index) => {
            const tokenValue = token.amount * token.currentPrice;
            const tokenPnL = tokenValue - token.totalInvested;
            const tokenPnLPercentage = token.totalInvested > 0 
              ? (tokenPnL / token.totalInvested) * 100 
              : 0;
              
            return (
              <motion.div 
                key={token.symbol} 
                className="bg-[#1A1F2C]/70 border border-gray-700 rounded-lg p-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="mr-2 p-1 bg-[#0F1118]/80 border border-gray-800 rounded-full">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                        {token.symbol.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">{token.symbol}</div>
                      <div className="text-xs text-gray-400">{token.name}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-medium flex items-center justify-end ${
                      tokenPnL >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {tokenPnL >= 0 ? (
                        <TrendingUp className="h-3 w-3 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 mr-1" />
                      )}
                      {tokenPnL >= 0 ? '+' : ''}{formatCurrency(tokenPnL)}
                    </div>
                    <div className={`text-xs ${
                      tokenPnLPercentage >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {formatPercentage(tokenPnLPercentage)}
                    </div>
                  </div>
                </div>
                
                <div className="mt-2 p-2 rounded-md bg-[#0F1118]/50 border border-gray-800 grid grid-cols-3 gap-2">
                  <div>
                    <div className="text-xs text-gray-400">Amount</div>
                    <div className="text-sm">{formatNumber(token.amount)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Entry</div>
                    <div className="text-sm">${token.entryPrice.toFixed(6)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Current</div>
                    <div className="text-sm">${token.currentPrice.toFixed(6)}</div>
                  </div>
                </div>
                
                {/* Progress bar showing price movement */}
                <div className="mt-2 w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${tokenPnL >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                    style={{ 
                      width: `${Math.min(Math.abs(tokenPnLPercentage) * 2, 100)}%`,
                      transition: 'width 1s ease-out' 
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
          
          {portfolioTokens.length === 0 && (
            <div className="text-center py-6 text-gray-400">
              <p>No tokens in portfolio</p>
              <p className="text-sm mt-1">Connect wallet to view your tokens</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionPortfolio;
