
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

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
  const [amount, setAmount] = useState<string>('100');
  const [slippage, setSlippage] = useState<number>(1);
  const [gasPriority, setGasPriority] = useState<string>('medium');
  
  // Calculate estimated token amount based on SOL input
  const estimatedTokens = parseFloat(amount) / tokenPrice;
  
  const handleTradeSubmit = () => {
    if (onTrade) {
      onTrade(action, parseFloat(amount), slippage, gasPriority);
    }
  };
  
  return (
    <div className="bg-[#0F1118] border border-gray-800 rounded-xl p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-1">
          <Button
            variant={action === 'buy' ? "default" : "outline"}
            className={`${
              action === 'buy'
                ? 'bg-green-500 hover:bg-green-600 text-white'
                : 'text-gray-300 border-gray-700'
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
                : 'text-gray-300 border-gray-700'
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
          <label className="text-xs text-gray-400 mb-1 block">Amount (SOL)</label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="bg-[#1A1F2C] border-gray-700"
          />
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-gray-400">Estimated {tokenSymbol}</label>
            <span className="text-sm">{estimatedTokens.toFixed(2)}</span>
          </div>
          <div className="p-2 rounded-md bg-[#1A1F2C]/50 text-center text-xs">
            {action === 'buy' 
              ? `You will receive approximately ${estimatedTokens.toFixed(2)} ${tokenSymbol}`
              : `You will sell ${estimatedTokens.toFixed(2)} ${tokenSymbol} for ${amount} SOL`
            }
          </div>
        </div>
        
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-gray-400">Slippage Tolerance</label>
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
          <label className="text-xs text-gray-400 mb-1 block">Gas Priority</label>
          <div className="grid grid-cols-3 gap-1 mt-1">
            {['low', 'medium', 'high'].map((priority) => (
              <Badge 
                key={priority}
                variant="outline"
                className={`cursor-pointer text-center py-1 ${
                  gasPriority === priority 
                    ? 'bg-[#1A1F2C] border-blue-500' 
                    : 'bg-transparent border-gray-700'
                }`}
                onClick={() => setGasPriority(priority)}
              >
                {priority.charAt(0).toUpperCase() + priority.slice(1)}
              </Badge>
            ))}
          </div>
        </div>
        
        <Button 
          className={`w-full ${
            action === 'buy' 
              ? 'bg-green-500 hover:bg-green-600' 
              : 'bg-red-500 hover:bg-red-600'
          } mt-2`}
          onClick={handleTradeSubmit}
        >
          {action === 'buy' ? 'Buy' : 'Sell'} {tokenSymbol}
        </Button>
      </div>
    </div>
  );
};

export default TradeEntryPanel;
