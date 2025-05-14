
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Wallet,
  Plus,
  ArrowUpDown,
  Copy,
  RefreshCcw,
  ExternalLink,
  Clock,
  CheckCircle2,
  Users,
  BarChart,
  Settings,
  Shield,
  Info
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { treasuryService } from "@/services/treasuryService";
import { useWallet } from '@/hooks/useWallet';

// Dummy wallets
const DUMMY_WALLETS = [
  {
    id: 'wallet1',
    name: 'Main Treasury',
    address: 'Wyb3T1WQdGzEC1sCeQTqcMRq3t91iGRwGQNLtFGbdcYv',
    balance: 6429.74,
    type: 'main',
    createdAt: new Date('2023-03-15').getTime(),
    lastActivity: new Date('2023-05-10').getTime(),
    signers: 3,
    required: 2
  },
  {
    id: 'wallet2',
    name: 'Operations',
    address: 'WybLtQJ3Cw1QsGwNMXsjhfecLCCjsMkxeE9FDfTi53GY',
    balance: 1820.55,
    type: 'operations',
    createdAt: new Date('2023-03-20').getTime(),
    lastActivity: new Date('2023-05-09').getTime(),
    signers: 2,
    required: 1
  },
  {
    id: 'wallet3',
    name: 'Development',
    address: 'Wybcz3mBYbRnGj4R5A6YxVzJgJLJMhczj8UoBXxPECSz',
    balance: 895.32,
    type: 'development',
    createdAt: new Date('2023-04-01').getTime(),
    lastActivity: new Date('2023-05-07').getTime(),
    signers: 2,
    required: 1
  }
];

// Dummy transactions
const DUMMY_TRANSACTIONS = [
  {
    id: 'tx1',
    type: 'deposit',
    amount: 500,
    token: 'SOL',
    from: 'External',
    to: 'Main Treasury',
    timestamp: new Date('2023-05-10T14:32:00').getTime(),
    status: 'completed',
    txHash: '4Pu7StwYV8aMV1tUzdchzBxdGrhKj2Ld3P4JY59Kxiiy'
  },
  {
    id: 'tx2',
    type: 'transfer',
    amount: 200,
    token: 'SOL',
    from: 'Main Treasury',
    to: 'Development',
    timestamp: new Date('2023-05-09T10:15:00').getTime(),
    status: 'completed',
    txHash: '3wMVzaGXfX7zZS9y6TKhYspomDC6hMNpBzmsQoHWbHrQ'
  },
  {
    id: 'tx3',
    type: 'withdraw',
    amount: 85.25,
    token: 'SOL',
    from: 'Operations',
    to: 'External Address',
    timestamp: new Date('2023-05-08T16:45:00').getTime(),
    status: 'completed',
    txHash: '2vB5J5VT8y9FHjgmfY7o6y1Sd3EShL6pcJfNsNqVx6DQ'
  },
  {
    id: 'tx4',
    type: 'deposit',
    amount: 1000,
    token: 'SOL',
    from: 'External',
    to: 'Main Treasury',
    timestamp: new Date('2023-05-06T09:22:00').getTime(),
    status: 'completed',
    txHash: '5fGgH2Vs1tpL3c7yZNT5VPvvVy7WxJqXdyDU1MV3Tkrw'
  }
];

const TreasuryWalletManager = () => {
  const [wallets, setWallets] = useState(DUMMY_WALLETS);
  const [transactions, setTransactions] = useState(DUMMY_TRANSACTIONS);
  const [activeTab, setActiveTab] = useState('wallets');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
  const [networkType, setNetworkType] = useState<'mainnet' | 'testnet' | 'devnet'>('mainnet');
  const { address: userWalletAddress } = useWallet();
  
  // Form states for transfer
  const [transferAmount, setTransferAmount] = useState('');
  const [sourceWallet, setSourceWallet] = useState('');
  const [destinationWallet, setDestinationWallet] = useState('');
  const [transferNote, setTransferNote] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  
  // Statistics
  const totalBalance = wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  const treasuryGrowth = 12.4; // Percentage
  const treasuryActivity = 65; // Percentage of goal

  useEffect(() => {
    if (wallets.length > 0 && !selectedWallet) {
      setSelectedWallet(wallets[0].id);
    }
  }, [wallets, selectedWallet]);
  
  const handleNetworkChange = (value: string) => {
    setNetworkType(value as 'mainnet' | 'testnet' | 'devnet');
    treasuryService.setNetworkType(value as 'mainnet' | 'testnet' | 'devnet');
    toast.success(`Switched to ${value}`);
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      // Would typically fetch fresh data from API
      toast.success("Treasury data refreshed");
      setIsLoading(false);
    }, 1000);
  };

  const handleCopyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard");
  };

  const handleTransfer = () => {
    if (!transferAmount || !sourceWallet || !destinationWallet) {
      toast.error("Please fill all required fields");
      return;
    }
    
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    setIsTransferring(true);
    
    // Find source wallet
    const source = wallets.find(w => w.id === sourceWallet);
    if (!source) {
      toast.error("Source wallet not found");
      setIsTransferring(false);
      return;
    }
    
    // Check balance
    if (source.balance < amount) {
      toast.error("Insufficient balance in source wallet");
      setIsTransferring(false);
      return;
    }
    
    // Simulate transfer
    setTimeout(() => {
      // Update wallet balances
      const updatedWallets = wallets.map(wallet => {
        if (wallet.id === sourceWallet) {
          return { ...wallet, balance: wallet.balance - amount, lastActivity: Date.now() };
        }
        if (wallet.id === destinationWallet) {
          return { ...wallet, balance: wallet.balance + amount, lastActivity: Date.now() };
        }
        return wallet;
      });
      
      setWallets(updatedWallets);
      
      // Add transaction record
      const sourceWalletName = wallets.find(w => w.id === sourceWallet)?.name || 'Unknown';
      const destWalletName = wallets.find(w => w.id === destinationWallet)?.name || 'Unknown';
      
      const newTransaction = {
        id: `tx${Date.now()}`,
        type: 'transfer',
        amount,
        token: 'SOL',
        from: sourceWalletName,
        to: destWalletName,
        timestamp: Date.now(),
        status: 'completed',
        txHash: `WybeTx${Date.now().toString(16).slice(-12)}`
      };
      
      setTransactions([newTransaction, ...transactions]);
      
      // Reset form
      setTransferAmount('');
      setTransferNote('');
      
      toast.success("Transfer completed successfully");
      setIsTransferring(false);
    }, 2000);
  };

  const getWalletById = (id: string) => {
    return wallets.find(w => w.id === id);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Wallet className="text-orange-500" size={22} />
            Treasury Management
          </h2>
          <p className="text-gray-400 text-sm">Manage project treasury and multi-signature wallets</p>
        </div>
        
        <div className="flex gap-3">
          <Select
            value={networkType}
            onValueChange={handleNetworkChange}
          >
            <SelectTrigger className="w-32 h-9 text-xs">
              <SelectValue placeholder="Network" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mainnet">Mainnet</SelectItem>
              <SelectItem value="testnet">Testnet</SelectItem>
              <SelectItem value="devnet">Devnet</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            className="h-9 text-xs" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCcw size={14} className={`mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="glass-card border-white/10 bg-gradient-to-br from-purple-500/10 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">Total Balance</p>
              <Badge variant="outline" className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                {networkType}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-bold">{totalBalance.toLocaleString()} SOL</h3>
              <span className="text-green-400 text-xs flex items-center">
                +{treasuryGrowth}% <BarChart size={12} className="ml-1" />
              </span>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">Monthly Activity</span>
                <span>{treasuryActivity}%</span>
              </div>
              <Progress value={treasuryActivity} className="h-1.5" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-white/10 bg-gradient-to-br from-blue-500/10 to-transparent">
          <CardContent className="pt-6">
            <div className="flex justify-between mb-2">
              <p className="text-sm text-gray-400">Security Status</p>
              <Shield size={16} className="text-blue-400" />
            </div>
            <h3 className="text-xl font-bold mb-2">Multi-Sig Protected</h3>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">Hardware wallet</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                  Connected
                </Badge>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-gray-400">2FA</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                  Enabled
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-white/10 bg-gradient-to-br from-amber-500/10 to-transparent">
          <CardContent className="pt-6">
            <div className="flex justify-between mb-2">
              <p className="text-sm text-gray-400">Quick Transfer</p>
              <ArrowUpDown size={16} className="text-amber-400" />
            </div>
            <div className="space-y-3">
              <Select
                value={sourceWallet}
                onValueChange={setSourceWallet}
              >
                <SelectTrigger className="w-full bg-black/30 text-sm">
                  <SelectValue placeholder="Source Wallet" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map(wallet => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      {wallet.name} ({wallet.balance.toLocaleString()} SOL)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select
                value={destinationWallet}
                onValueChange={setDestinationWallet}
              >
                <SelectTrigger className="w-full bg-black/30 text-sm">
                  <SelectValue placeholder="Destination Wallet" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map(wallet => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      {wallet.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Amount"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className="bg-black/30"
                />
                <Button
                  className="bg-amber-500 hover:bg-amber-600 whitespace-nowrap"
                  onClick={handleTransfer}
                  disabled={isTransferring || !sourceWallet || !destinationWallet || !transferAmount}
                >
                  {isTransferring ? (
                    <RefreshCcw size={14} className="animate-spin mr-1" />
                  ) : (
                    <ArrowUpDown size={14} className="mr-1" />
                  )}
                  Transfer
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tab navigation */}
      <div className="flex space-x-1 bg-black/20 p-1 rounded-lg mb-6">
        <button
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'wallets'
              ? 'bg-white/10 text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
          onClick={() => setActiveTab('wallets')}
        >
          Wallets
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'transactions'
              ? 'bg-white/10 text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
          onClick={() => setActiveTab('transactions')}
        >
          Transactions
        </button>
        <button
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'settings'
              ? 'bg-white/10 text-white'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
          onClick={() => setActiveTab('settings')}
        >
          Settings
        </button>
      </div>
      
      {/* Wallets Tab */}
      {activeTab === 'wallets' && (
        <div className="glass-card rounded-lg overflow-hidden">
          <div className="p-4 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-medium">Treasury Wallets</h3>
            <Button size="sm" className="bg-orange-500 hover:bg-orange-600 h-8 text-xs">
              <Plus size={14} className="mr-1" />
              Add Wallet
            </Button>
          </div>
          
          <div className="divide-y divide-white/5">
            {wallets.map((wallet) => (
              <div 
                key={wallet.id} 
                className={`p-4 hover:bg-white/5 transition-colors ${
                  selectedWallet === wallet.id ? 'bg-white/5' : ''
                }`}
                onClick={() => setSelectedWallet(wallet.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium flex items-center gap-2">
                      {wallet.name}
                      <Badge variant="outline" className="ml-2 text-xs bg-orange-500/10 text-orange-400 border-orange-500/30">
                        {wallet.type}
                      </Badge>
                    </h4>
                    <div className="flex items-center mt-1">
                      <p className="text-xs font-mono text-gray-400">
                        {`${wallet.address.substring(0, 8)}...${wallet.address.substring(
                          wallet.address.length - 8
                        )}`}
                      </p>
                      <button
                        onClick={() => handleCopyAddress(wallet.address)}
                        className="ml-1 text-gray-400 hover:text-white"
                      >
                        <Copy size={12} />
                      </button>
                      <a
                        href={`https://solscan.io/account/${wallet.address}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-1 text-blue-400"
                      >
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">{wallet.balance.toLocaleString()} SOL</p>
                    <p className="text-xs text-gray-400 flex items-center justify-end mt-1">
                      <Clock size={12} className="mr-1" />
                      Last activity: {new Date(wallet.lastActivity).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {selectedWallet === wallet.id && (
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-white/5 p-3 rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">Signers</p>
                        <div className="flex items-center">
                          <Users size={14} className="mr-2 text-blue-400" />
                          <p>{wallet.signers} signers ({wallet.required} required)</p>
                        </div>
                      </div>
                      
                      <div className="bg-white/5 p-3 rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">Created</p>
                        <div className="flex items-center">
                          <Clock size={14} className="mr-2 text-green-400" />
                          <p>{new Date(wallet.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="bg-white/5 p-3 rounded-lg">
                        <p className="text-xs text-gray-400 mb-1">Status</p>
                        <div className="flex items-center">
                          <CheckCircle2 size={14} className="mr-2 text-green-400" />
                          <p>Active</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button variant="outline" className="text-xs h-8">
                        View Details
                      </Button>
                      <Button variant="outline" className="text-xs h-8 text-blue-400 border-blue-500/30">
                        <ArrowUpDown size={12} className="mr-1" />
                        Transfer
                      </Button>
                      <Button variant="outline" className="text-xs h-8 text-orange-400 border-orange-500/30">
                        <Settings size={12} className="mr-1" />
                        Manage Signers
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="glass-card rounded-lg overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h3 className="font-medium">Recent Transactions</h3>
          </div>
          
          <Table>
            <TableHeader>
              <TableRow className="border-b border-white/10 hover:bg-white/5">
                <TableHead className="text-white">Type</TableHead>
                <TableHead className="text-white">Amount</TableHead>
                <TableHead className="text-white">From</TableHead>
                <TableHead className="text-white">To</TableHead>
                <TableHead className="text-white">Date</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">TX Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id} className="border-b border-white/10 hover:bg-white/5">
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={`
                        ${tx.type === 'deposit' ? 'bg-green-500/10 text-green-400 border-green-500/30' : ''}
                        ${tx.type === 'withdraw' ? 'bg-red-500/10 text-red-400 border-red-500/30' : ''}
                        ${tx.type === 'transfer' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : ''}
                      `}
                    >
                      {tx.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {tx.amount.toLocaleString()} {tx.token}
                  </TableCell>
                  <TableCell>{tx.from}</TableCell>
                  <TableCell>{tx.to}</TableCell>
                  <TableCell>{new Date(tx.timestamp).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                      <span>{tx.status}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    <div className="flex items-center gap-1">
                      <span>
                        {`${tx.txHash.substring(0, 6)}...${tx.txHash.substring(
                          tx.txHash.length - 6
                        )}`}
                      </span>
                      <button
                        onClick={() => handleCopyAddress(tx.txHash)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Copy size={12} />
                      </button>
                      <a
                        href={`https://solscan.io/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-400"
                      >
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      
      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="glass-card rounded-lg overflow-hidden">
          <div className="p-4 border-b border-white/10">
            <h3 className="font-medium">Treasury Settings</h3>
          </div>
          
          <div className="p-4 space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Shield size={16} className="text-orange-500" />
                Security Settings
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-medium">Require 2FA for all transfers</p>
                    <p className="text-xs text-gray-400">Add an extra layer of security with 2FA</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-medium">Hardware wallet confirmation</p>
                    <p className="text-xs text-gray-400">Require hardware wallet signature</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-medium">Spending limits</p>
                    <p className="text-xs text-gray-400">Set daily transfer limits</p>
                  </div>
                  <div className="w-32">
                    <Input 
                      type="number" 
                      defaultValue="1000" 
                      className="bg-black/20 h-8 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Users size={16} className="text-orange-500" />
                Multi-Signature Configuration
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-medium">Main Treasury</p>
                    <p className="text-xs text-gray-400">2 of 3 signers required</p>
                  </div>
                  <Button variant="outline" className="h-8 text-xs">
                    Manage Signers
                  </Button>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-medium">Operations Wallet</p>
                    <p className="text-xs text-gray-400">1 of 2 signers required</p>
                  </div>
                  <Button variant="outline" className="h-8 text-xs">
                    Manage Signers
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="text-sm font-medium flex items-center gap-2">
                <Info size={16} className="text-orange-500" />
                Notifications
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-medium">Email notifications</p>
                    <p className="text-xs text-gray-400">Receive alerts for all transactions</p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
                
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div>
                    <p className="font-medium">Large transaction alerts</p>
                    <p className="text-xs text-gray-400">
                      Notify for transactions over {" "}
                      <span className="font-mono">500 SOL</span>
                    </p>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </div>
            </div>
            
            <Button className="w-full bg-orange-500 hover:bg-orange-600">
              Save Settings
            </Button>
          </div>
        </div>
      )}
      
      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm flex gap-2">
        <Info size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-blue-400 font-medium">Treasury Management Best Practices</p>
          <p className="text-gray-300 mt-1">
            For enhanced security, we recommend using multi-signature wallets for all treasury operations. 
            Consider separating funds across multiple wallets for different purposes, and always enable 
            hardware wallet confirmation for large transfers.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TreasuryWalletManager;
