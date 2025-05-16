
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/utils/tradeUtils';
import { ArrowUpRight, ArrowDownRight, Eye, Plus, Bell, Whale } from 'lucide-react';
import { useWallet } from '@/lib/wallet';
import { toast } from 'sonner';

interface WhaleWallet {
  address: string;
  autoTrade: boolean;
  delaySec: number;
  maxAmount: number;
}

interface WhaleTransaction {
  id: string;
  address: string;
  action: 'buy' | 'sell';
  amount: number;
  value: number;
  tokenSymbol: string;
  timestamp: string;
}

const WhaleSniperPanel: React.FC = () => {
  const [trackedWallets, setTrackedWallets] = useState<WhaleWallet[]>([
    {
      address: "wybeYJMA3dyYxYko9rRR6EpKERiJP4mvKLSAA5AMZf2",
      autoTrade: true,
      delaySec: 1,
      maxAmount: 1
    }
  ]);
  
  const [newWalletAddress, setNewWalletAddress] = useState('');
  const [whaleTransactions, setWhaleTransactions] = useState<WhaleTransaction[]>([]);
  const [isWatching, setIsWatching] = useState(true);
  
  const { connected } = useWallet();
  
  // Simulate fetching whale transactions
  useEffect(() => {
    if (isWatching && trackedWallets.length > 0) {
      const interval = setInterval(() => {
        // Randomly decide if we should add a new transaction
        if (Math.random() > 0.7) {
          const randomWallet = trackedWallets[Math.floor(Math.random() * trackedWallets.length)];
          const action = Math.random() > 0.5 ? 'buy' : 'sell';
          const amount = Math.floor(Math.random() * 100000) + 10000;
          const value = amount * 0.00002;
          const tokens = ['PEPE', 'DOGE', 'SHIB', 'FLOKI', 'WYBE'];
          const tokenSymbol = tokens[Math.floor(Math.random() * tokens.length)];
          
          const newTransaction: WhaleTransaction = {
            id: Date.now().toString(),
            address: randomWallet.address,
            action,
            amount,
            value,
            tokenSymbol,
            timestamp: new Date().toISOString()
          };
          
          setWhaleTransactions(prev => [newTransaction, ...prev].slice(0, 5));
        }
      }, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isWatching, trackedWallets]);
  
  const handleAddWallet = () => {
    if (!newWalletAddress.trim()) {
      toast.error("Please enter a wallet address");
      return;
    }
    
    if (trackedWallets.some(wallet => wallet.address === newWalletAddress)) {
      toast.error("This wallet is already being tracked");
      return;
    }
    
    const newWallet: WhaleWallet = {
      address: newWalletAddress,
      autoTrade: false,
      delaySec: 2,
      maxAmount: 0.5
    };
    
    setTrackedWallets(prev => [...prev, newWallet]);
    setNewWalletAddress('');
    toast.success("Whale wallet added for tracking");
  };
  
  const toggleWalletAutoTrade = (address: string) => {
    setTrackedWallets(prev => prev.map(wallet => {
      if (wallet.address === address) {
        return { ...wallet, autoTrade: !wallet.autoTrade };
      }
      return wallet;
    }));
  };
  
  return (
    <Card className="bg-[#0F1118]/80 border border-gray-800 backdrop-blur-md rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <Whale className="text-[#8B5CF6] w-5 h-5 mr-2" /> 
            <span>Whale Sniper</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsWatching(!isWatching)}
            className={`h-7 text-xs ${isWatching ? 'text-green-400 border-green-600/50' : 'text-gray-400 border-gray-700'}`}
          >
            <Eye className="h-3 w-3 mr-1" />
            {isWatching ? 'Watching' : 'Paused'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Add Wallet Input */}
          <div className="flex gap-2">
            <Input 
              type="text" 
              value={newWalletAddress} 
              onChange={(e) => setNewWalletAddress(e.target.value)}
              placeholder="Wallet address to track..."
              className="bg-[#1A1F2C] border-gray-700 text-sm"
            />
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleAddWallet}
              className="bg-[#1A1F2C] border-gray-700 shrink-0"
              disabled={!connected}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Tracked Wallets */}
          <div className="space-y-2">
            {trackedWallets.map((wallet) => (
              <div 
                key={wallet.address} 
                className="bg-[#1A1F2C]/70 border border-gray-800 rounded-lg p-2.5"
              >
                <div className="flex justify-between items-center">
                  <div className="truncate max-w-[180px] text-sm">
                    {wallet.address.substring(0, 8)}...{wallet.address.substring(wallet.address.length - 4)}
                  </div>
                  <Badge
                    variant={wallet.autoTrade ? "default" : "outline"}
                    className={`cursor-pointer ${
                      wallet.autoTrade
                        ? 'bg-green-600/80 hover:bg-green-700 text-white'
                        : 'border-gray-600 bg-transparent'
                    }`}
                    onClick={() => toggleWalletAutoTrade(wallet.address)}
                  >
                    {wallet.autoTrade ? 'Auto' : 'Manual'}
                  </Badge>
                </div>
                {wallet.autoTrade && (
                  <div className="mt-2 space-y-1.5">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Delay: {wallet.delaySec}s</span>
                      <span>Max: {wallet.maxAmount} SOL</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-full bg-gray-700/30 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-blue-500 rounded-full" 
                          style={{ width: `${(wallet.delaySec / 5) * 100}%` }}
                        />
                      </div>
                      <Bell className="h-3 w-3 text-purple-400" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Recent Whale Transactions */}
          <div className="mt-3">
            <h4 className="text-xs font-medium text-gray-400 mb-2">Recent Whale Activity</h4>
            <div className="space-y-2 max-h-[150px] overflow-y-auto scrollbar-thin pr-1">
              {whaleTransactions.map((tx) => (
                <div 
                  key={tx.id}
                  className="flex items-center justify-between p-2 bg-[#1A1F2C]/50 border border-gray-800 rounded-lg text-sm"
                >
                  <div className="flex items-center">
                    {tx.action === 'buy' ? (
                      <ArrowUpRight className="h-3 w-3 text-green-400 mr-1.5" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-400 mr-1.5" />
                    )}
                    <span className="font-medium">{tx.amount.toLocaleString()} {tx.tokenSymbol}</span>
                  </div>
                  <div className="text-xs text-gray-400">
                    ${formatCurrency(tx.value)}
                  </div>
                </div>
              ))}
              
              {whaleTransactions.length === 0 && (
                <div className="text-center py-4 text-gray-500 text-sm">
                  No whale activity detected
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WhaleSniperPanel;
