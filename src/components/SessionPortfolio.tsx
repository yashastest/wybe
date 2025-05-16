
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatPercentage } from '@/utils/tradeUtils';

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
  // If no tokens provided, use sample data
  const portfolioTokens = tokens.length > 0 ? tokens : [
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
    }
  };
  
  return (
    <Card className="bg-[#0F1118] border border-gray-800">
      <CardHeader className="pb-2 flex flex-row justify-between items-center">
        <CardTitle className="text-lg flex items-center">
          <span className="text-[#8B5CF6] mr-2">💼</span> Session Portfolio
        </CardTitle>
        <Button
          variant="outline"
          className="h-7 text-xs"
          onClick={handleReset}
        >
          Reset
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-sm text-gray-400">Total Invested</div>
            <div className="text-xl font-semibold">${formatCurrency(totalInvested)}</div>
          </div>
          
          <div>
            <div className="text-sm text-gray-400">Current Value</div>
            <div className="text-xl font-semibold">${formatCurrency(currentValue)}</div>
          </div>
          
          <div>
            <div className="text-sm text-gray-400">Session P&L</div>
            <div className={`text-xl font-semibold ${
              totalPnL >= 0 ? 'text-green-500' : 'text-red-500'
            }`}>
              {totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)} ({formatPercentage(pnlPercentage)})
            </div>
          </div>
        </div>
        
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {portfolioTokens.map(token => {
            const tokenValue = token.amount * token.currentPrice;
            const tokenPnL = tokenValue - token.totalInvested;
            const tokenPnLPercentage = token.totalInvested > 0 
              ? (tokenPnL / token.totalInvested) * 100 
              : 0;
              
            return (
              <div 
                key={token.symbol} 
                className="bg-[#1A1F2C] border border-gray-700 rounded-lg p-3"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <div className="mr-2 p-1 bg-[#0F1118] rounded-full">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white text-xs font-bold">
                        {token.symbol.charAt(0)}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold">{token.symbol}</div>
                      <div className="text-xs text-gray-400">{token.name}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`font-semibold ${
                      tokenPnL >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {tokenPnL >= 0 ? '+' : ''}{formatCurrency(tokenPnL)}
                    </div>
                    <div className={`text-xs ${
                      tokenPnLPercentage >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {formatPercentage(tokenPnLPercentage)}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 mt-1 gap-2">
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
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionPortfolio;
