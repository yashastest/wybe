
import React, { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet.tsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowDown, ArrowUp } from 'lucide-react';
import BondingCurveChart from '@/components/BondingCurveChart';

interface TradingInterfaceProps {
  tokenSymbol?: string;
  tokenId?: string;
  tokenName?: string;
  tokenImage?: string;
}

interface TradeHistoryItem {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: string;
}

const TradingInterface: React.FC<TradingInterfaceProps> = ({ tokenSymbol = "WYBE", tokenId, tokenName = "Wybe Token", tokenImage }) => {
  const { connected, address } = useWallet();
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [tradeAmount, setTradeAmount] = useState<number>(0);
  const [tokenPrice, setTokenPrice] = useState<number>(0.0015);
  const [tradeHistory, setTradeHistory] = useState<TradeHistoryItem[]>([
    { id: "1", type: 'buy', amount: 500, price: 0.0015, timestamp: new Date().toLocaleTimeString() },
    { id: "2", type: 'sell', amount: 200, price: 0.00148, timestamp: new Date(Date.now() - 120000).toLocaleTimeString() },
    { id: "3", type: 'buy', amount: 1000, price: 0.00145, timestamp: new Date(Date.now() - 300000).toLocaleTimeString() }
  ]);
  const [loading, setLoading] = useState<boolean>(false);

  // Simulate price estimation when trade amount changes
  useEffect(() => {
    if (tradeAmount > 0) {
      // Mock price calculation based on amount
      const basePrice = 0.0015;
      const priceImpact = tradeAmount * 0.00001;
      const estimatedPrice = tradeType === 'buy' 
        ? basePrice + priceImpact
        : basePrice - priceImpact;
      
      setTokenPrice(parseFloat(estimatedPrice.toFixed(6)));
    } else {
      setTokenPrice(0.0015);
    }
  }, [tradeAmount, tradeType]);

  const handleTradeTypeChange = (newType: 'buy' | 'sell') => {
    if (newType === 'sell' && !connected) {
      toast.error("Please connect your wallet to sell tokens");
      return;
    }
    setTradeType(newType);
  };

  const handleTradeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setTradeAmount(isNaN(value) ? 0 : value);
  };

  const handleExecuteTrade = async () => {
    if (!connected) {
      toast.error("Please connect your wallet to trade");
      return;
    }

    if (tradeAmount <= 0) {
      toast.error("Please enter a valid trade amount");
      return;
    }

    setLoading(true);
    try {
      // Simulate trade execution
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock successful result
      const mockPrice = tradeType === 'buy' ? tokenPrice * 1.001 : tokenPrice * 0.999;
      
      toast.success(`Successfully executed ${tradeType} of ${tradeAmount} tokens at price: ${mockPrice.toFixed(6)} SOL per token`);

      // Update trade history
      const newTrade: TradeHistoryItem = {
        id: Date.now().toString(),
        type: tradeType,
        amount: tradeAmount,
        price: mockPrice,
        timestamp: new Date().toLocaleTimeString()
      };
      setTradeHistory(prevHistory => [newTrade, ...prevHistory]);
      
      // Reset trade amount
      setTradeAmount(0);
    } catch (error) {
      console.error("Trade execution failed:", error);
      toast.error("Failed to execute token trade");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Token Trading</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Token</label>
              <Input type="text" value={tokenSymbol} readOnly />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Trade Type</label>
              <div className="flex space-x-4">
                <Button
                  variant={tradeType === 'buy' ? 'default' : 'outline'}
                  onClick={() => handleTradeTypeChange('buy')}
                >
                  Buy <ArrowUp className="ml-2" />
                </Button>
                <Button
                  variant={tradeType === 'sell' ? 'default' : 'outline'}
                  onClick={() => handleTradeTypeChange('sell')}
                  disabled={!connected}
                >
                  Sell <ArrowDown className="ml-2" />
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Amount</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={tradeAmount || ''}
                onChange={handleTradeAmountChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Estimated Price</label>
              <Input type="text" value={tokenPrice > 0 ? `${tokenPrice} SOL` : '0 SOL'} readOnly />
            </div>
            <Button onClick={handleExecuteTrade} disabled={loading} className="w-full">
              {loading ? "Trading..." : `Execute ${tradeType} Trade`}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trade History</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tradeHistory.map((trade) => (
                <TableRow key={trade.id}>
                  <TableCell className={trade.type === 'buy' ? 'text-green-500' : 'text-red-500'}>
                    {trade.type.toUpperCase()}
                  </TableCell>
                  <TableCell>{trade.amount}</TableCell>
                  <TableCell>{trade.price.toFixed(6)} SOL</TableCell>
                  <TableCell>{trade.timestamp}</TableCell>
                </TableRow>
              ))}
              {tradeHistory.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    No trade history yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Bonding Curve Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <BondingCurveChart tokenSymbol={tokenSymbol} />
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingInterface;
