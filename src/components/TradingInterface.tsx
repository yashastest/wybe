import React, { useState } from 'react';
import { useWallet } from '@/hooks/useWallet.tsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { smartContractService } from '@/services/smartContractService.ts';
import { ArrowDown, ArrowUp } from 'lucide-react';
import BondingCurveChart from '@/components/BondingCurveChart';
import { useTokenTrading } from '@/hooks/useTokenTrading.tsx';

interface TradingInterfaceProps {
  tokenSymbol?: string;
  tokenId?: string;
}

interface TradeHistoryItem {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: string;
}

const TradingInterface: React.FC<TradingInterfaceProps> = ({ tokenSymbol, tokenId }) => {
  const { connected, publicKey } = useWallet();
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [tradeAmount, setTradeAmount] = useState<number>(0);
  const [tokenPrice, setTokenPrice] = useState<number>(0);
  const [tradeHistory, setTradeHistory] = useState<TradeHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { executeTrade } = useTokenTrading();

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
      const result = await executeTrade(tokenSymbol || '', tradeAmount, tradeType === 'buy');
      if (result.success) {
        setTokenPrice(result.price);
        toast.success(`Successfully executed ${tradeType} of ${tradeAmount} tokens at price: ${result.price} SOL per token`);

        // Update trade history
        const newTrade: TradeHistoryItem = {
          id: Date.now().toString(),
          type: tradeType,
          amount: tradeAmount,
          price: result.price,
          timestamp: new Date().toLocaleTimeString()
        };
        setTradeHistory(prevHistory => [...prevHistory, newTrade]);
      } else {
        toast.error("Trade execution failed");
      }
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
                value={tradeAmount}
                onChange={handleTradeAmountChange}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Estimated Price</label>
              <Input type="text" value={`${tokenPrice} SOL`} readOnly />
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
                  <TableCell>{trade.type}</TableCell>
                  <TableCell>{trade.amount}</TableCell>
                  <TableCell>{trade.price} SOL</TableCell>
                  <TableCell>{trade.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card className="col-span-2">
        <CardHeader>
          <CardTitle>Bonding Curve Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <BondingCurveChart tokenSymbol={tokenSymbol || "WYBE"} />
        </CardContent>
      </Card>
    </div>
  );
};

export default TradingInterface;
