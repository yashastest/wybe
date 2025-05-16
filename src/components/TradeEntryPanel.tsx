
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, Flame, Zap, Info } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/utils/tradeUtils';
import { useWalletBalance } from '@/hooks/useWalletBalance';
import { useWallet } from '@/lib/wallet';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

interface TradeEntryPanelProps {
  tokenSymbol: string;
  tokenPrice: number;
  onTrade?: (action: 'buy' | 'sell', amount: number, slippage: number, gasPriority: string) => void;
}

const TradeEntryPanel: React.FC<TradeEntryPanelProps> = ({ 
  tokenSymbol,
  tokenPrice,
  onTrade 
}) => {
  const [action, setAction] = useState<'buy' | 'sell'>('buy');
  const [amount, setAmount] = useState<string>('0.5');
  const [slippage, setSlippage] = useState<number>(1);
  const [gasPriority, setGasPriority] = useState<string>('medium');
  
  const { connected } = useWallet();
  const { solBalance, tokenBalances } = useWalletBalance(tokenSymbol);
  
  // Get token balance for the selected token
  const tokenBalance = tokenBalances?.[tokenSymbol] || 0;
  
  // Calculate estimated token amount based on SOL input
  const estimatedTokens = parseFloat(amount || '0') / tokenPrice;
  
  // Calculate max amount based on available balance
  const maxAmount = action === 'buy' ? solBalance : tokenBalance;
  
  // Handle "Max" button click
  const handleSetMax = () => {
    if (action === 'buy') {
      // Leave a small amount for gas fees
      setAmount(Math.max(0, solBalance - 0.01).toFixed(2));
    } else {
      setAmount(tokenBalance.toString());
    }
  };
  
  const handleTradeSubmit = () => {
    if (onTrade) {
      onTrade(action, parseFloat(amount), slippage, gasPriority);
    }
  };

  // Set a reasonable default amount based on balance when switching action
  useEffect(() => {
    if (action === 'buy' && solBalance > 0) {
      setAmount((solBalance / 4).toFixed(2));
    } else if (action === 'sell' && tokenBalance > 0) {
      setAmount((tokenBalance / 2).toFixed(0));
    }
  }, [action, solBalance, tokenBalance]);
  
  return (
    <TooltipProvider>
      <Card className="bg-[#0F1118]/80 border border-gray-800 backdrop-blur-md rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-1">
            <Button
              variant={action === 'buy' ? "default" : "outline"}
              className={`${
                action === 'buy'
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'text-gray-300 border-gray-700 bg-transparent'
              } rounded-l-lg rounded-r-none px-4 py-2`}
              onClick={() => setAction('buy')}
            >
              <ArrowUp className="h-4 w-4 mr-1" />
              Buy
            </Button>
            <Button
              variant={action === 'sell' ? "default" : "outline"}
              className={`${
                action === 'sell'
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'text-gray-300 border-gray-700 bg-transparent'
              } rounded-l-none rounded-r-lg px-4 py-2`}
              onClick={() => setAction('sell')}
            >
              <ArrowDown className="h-4 w-4 mr-1" />
              Sell
            </Button>
          </div>
          <div>
            <span className="text-xs text-gray-400">1 {tokenSymbol} = ${tokenPrice.toFixed(6)}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs text-gray-400">
                Amount {action === 'buy' ? '(SOL)' : `(${tokenSymbol})`}
              </label>
              <div className="flex items-center gap-1">
                <span className="text-xs text-gray-400">Balance: {action === 'buy' ? 
                  solBalance.toFixed(4) + ' SOL' : 
                  Math.floor(tokenBalance).toLocaleString() + ` ${tokenSymbol}`}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSetMax}
                  disabled={!connected || maxAmount <= 0}
                  className="h-5 text-xs py-0 px-1.5 text-purple-400 hover:text-purple-300"
                >
                  Max
                </Button>
              </div>
            </div>
            <div className="relative">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-[#1A1F2C] border-gray-700 pr-16"
                min={0}
                step={action === 'buy' ? 0.01 : 1}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <span className="text-sm text-gray-400">
                  {action === 'buy' ? 'SOL' : tokenSymbol}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1A1F2C]/50 border border-gray-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-gray-400">You will {action === 'buy' ? 'receive' : 'sell'}</label>
              <span className="text-sm font-medium">
                {action === 'buy' 
                  ? Math.floor(estimatedTokens).toLocaleString()
                  : parseFloat(amount) || 0}
                <span className="ml-1 text-xs text-gray-400">{tokenSymbol}</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs text-gray-400">Estimated value</label>
              <span className="text-sm font-medium">
                ${formatCurrency((parseFloat(amount) || 0) * (action === 'buy' ? 1 : tokenPrice))}
              </span>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <label className="text-xs text-gray-400">Slippage Tolerance</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-gray-500 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Maximum price movement you're willing to accept</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-sm">{slippage}%</span>
            </div>
            <Slider
              defaultValue={[slippage]}
              max={5}
              step={0.1}
              min={0.1}
              onValueChange={(values) => setSlippage(values[0])}
              className="my-2"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0.1%</span>
              <span>5%</span>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-1">
                <label className="text-xs text-gray-400">Gas Priority</label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-3 w-3 text-gray-500 cursor-pointer" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Higher priority = faster confirmation, but costs more</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1 mt-1">
              {[
                { key: 'low', icon: <Flame className="h-3 w-3 mr-1 opacity-50" />, label: 'Low' },
                { key: 'medium', icon: <Flame className="h-3 w-3 mr-1" />, label: 'Medium' },
                { key: 'high', icon: <Zap className="h-3 w-3 mr-1 text-yellow-400" />, label: 'High' }
              ].map((priority) => (
                <Badge 
                  key={priority.key}
                  variant="outline"
                  className={`cursor-pointer text-center py-1.5 flex items-center justify-center ${
                    gasPriority === priority.key 
                      ? 'bg-[#1A1F2C] border-purple-600' 
                      : 'bg-transparent border-gray-700'
                  }`}
                  onClick={() => setGasPriority(priority.key)}
                >
                  {priority.icon}
                  {priority.label}
                </Badge>
              ))}
            </div>
          </div>
          
          <Button 
            className={`w-full ${
              action === 'buy' 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-red-500 hover:bg-red-600'
            } mt-2`}
            onClick={handleTradeSubmit}
            disabled={!connected || parseFloat(amount) <= 0 || (action === 'buy' && parseFloat(amount) > solBalance)}
          >
            {!connected ? 'Connect Wallet' : 
              action === 'buy' ? `Buy ${tokenSymbol}` : `Sell ${tokenSymbol}`}
          </Button>
        </div>
      </Card>
    </TooltipProvider>
  );
};

export default TradeEntryPanel;
