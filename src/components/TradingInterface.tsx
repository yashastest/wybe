
import React, { useState, useEffect } from 'react';
import { useWallet } from '@/hooks/useWallet.tsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowDown, ArrowUp, Search, Share, Facebook, Twitter, Linkedin } from 'lucide-react';
import BondingCurveChart from '@/components/BondingCurveChart';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface TradingInterfaceProps {
  tokenSymbol?: string;
  tokenId?: string;
  tokenName?: string;
  tokenImage?: string;
  contractAddress?: string;
  isAssisted?: boolean;
}

interface TradeHistoryItem {
  id: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  timestamp: string;
}

const TradingInterface: React.FC<TradingInterfaceProps> = ({ 
  tokenSymbol = "WYBE", 
  tokenId, 
  tokenName = "Wybe Token", 
  tokenImage,
  contractAddress,
  isAssisted = false
}) => {
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
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

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

  // Simulate searching for a token by contract address
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error("Please enter a valid token address");
      return;
    }

    setSearchLoading(true);
    try {
      // Mock search function with delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo, we'll just assume we found something
      if (searchQuery.length > 20) {
        toast.success(`Token found: DEMO (DemoToken)`);
        // In a real implementation, this would update the current token being viewed
      } else {
        toast.error("Token not found. Please check the address and try again.");
      }
    } catch (error) {
      toast.error("Error searching for token");
    } finally {
      setSearchLoading(false);
    }
  };

  // Generate a shareable URL for the token
  const getShareableUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/token/${tokenSymbol.toLowerCase()}`;
  };

  // For social sharing
  const shareableText = `Check out ${tokenName} (${tokenSymbol}) on Wybe.fun! ${contractAddress ? `\nContract: ${contractAddress}` : ''}`;
  const shareableUrl = getShareableUrl();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Token Search Card */}
      <Card className="md:col-span-2">
        <CardContent className="pt-4">
          <div className="flex items-center space-x-2">
            <Input 
              type="text"
              placeholder="Search by token address" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow"
            />
            <Button 
              onClick={handleSearch}
              disabled={searchLoading}
              variant="secondary"
            >
              {searchLoading ? "Searching..." : <Search className="h-4 w-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Token Trading</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Share className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Share {tokenName} ({tokenSymbol})</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="flex justify-center space-x-4">
                  {/* Social Media Share Buttons */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        <Facebook className="h-4 w-4 mr-2" />
                        Share on Facebook
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <p className="text-sm">Copy link to share on Facebook:</p>
                      <div className="mt-2">
                        <Input readOnly value={shareableUrl} />
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="mt-2 w-full"
                          onClick={() => {
                            navigator.clipboard.writeText(shareableUrl);
                            toast.success("Link copied to clipboard");
                          }}
                        >
                          Copy Link
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">
                        <Twitter className="h-4 w-4 mr-2" />
                        Share on Twitter
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent>
                      <p className="text-sm">Copy text to share on Twitter:</p>
                      <div className="mt-2">
                        <Input readOnly value={shareableText} />
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="mt-2 w-full"
                          onClick={() => {
                            navigator.clipboard.writeText(`${shareableText} ${shareableUrl}`);
                            toast.success("Text copied to clipboard");
                          }}
                        >
                          Copy Text
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                {contractAddress && (
                  <div className="pt-2">
                    <p className="text-sm font-medium mb-2">Contract Address:</p>
                    <div className="bg-muted p-2 rounded-md font-mono text-xs break-all">
                      {contractAddress}
                    </div>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => {
                        navigator.clipboard.writeText(contractAddress);
                        toast.success("Contract address copied to clipboard");
                      }}
                    >
                      Copy Contract Address
                    </Button>
                  </div>
                )}

                <div className="pt-2">
                  <p className="text-sm font-medium mb-2">Share Link:</p>
                  <div className="flex space-x-2">
                    <Input readOnly value={shareableUrl} />
                    <Button 
                      variant="secondary" 
                      onClick={() => {
                        navigator.clipboard.writeText(shareableUrl);
                        toast.success("Link copied to clipboard");
                      }}
                    >
                      Copy
                    </Button>
                  </div>
                </div>

                <div className="bg-muted p-3 rounded-md mt-2">
                  <div className="flex items-center space-x-2">
                    <img 
                      src="/lovable-uploads/dcb3ea81-25ba-4438-90a5-c7403026c91e.png" 
                      alt="Wybe Logo" 
                      className="h-5 w-5" 
                    />
                    <p className="text-sm font-medium">Powered by Wybe.fun</p>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Close</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
