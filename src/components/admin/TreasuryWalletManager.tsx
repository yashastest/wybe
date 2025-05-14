import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  Wallet, 
  Plus, 
  Copy, 
  ExternalLink, 
  RefreshCcw,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  ArrowUpDown,
  Coins
} from "lucide-react";
import { integrationService } from "@/services/integrationService";
import { useWallet } from '@/hooks/useWallet';

// Treasury wallet types
interface TreasuryWallet {
  id: string;
  name: string;
  address: string;
  balance: number;
  tokenBalance?: {
    symbol: string;
    amount: number;
  }[];
  isMultisig: boolean;
  signers?: string[];
  threshold?: number;
}

const TreasuryWalletManager = () => {
  const [wallets, setWallets] = useState<TreasuryWallet[]>([]);
  const [isAddingWallet, setIsAddingWallet] = useState(false);
  const [isTransferring, setIsTransferring] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { address: connectedWallet } = useWallet();
  
  const [newWallet, setNewWallet] = useState<{
    name: string;
    address: string;
    isMultisig: boolean;
    signers: string[];
    threshold: number;
  }>({
    name: '',
    address: '',
    isMultisig: false,
    signers: [''],
    threshold: 1
  });
  
  const [transferDetails, setTransferDetails] = useState({
    fromWallet: '',
    toWallet: '',
    amount: 0,
    token: 'SOL'
  });

  // Load wallets on component mount
  useEffect(() => {
    loadWallets();
  }, [connectedWallet]);

  const loadWallets = async () => {
    if (!connectedWallet) return;
    
    setRefreshing(true);
    try {
      // In a real app, this would be an API call
      const treasuryWallets = await integrationService.getTreasuryWallets(connectedWallet);
      setWallets(treasuryWallets);
    } catch (error) {
      console.error("Failed to load treasury wallets:", error);
      toast.error("Failed to load treasury wallets");
    } finally {
      setRefreshing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewWallet(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignerChange = (index: number, value: string) => {
    setNewWallet(prev => {
      const updatedSigners = [...prev.signers];
      updatedSigners[index] = value;
      return {
        ...prev,
        signers: updatedSigners
      };
    });
  };

  const addSignerField = () => {
    setNewWallet(prev => ({
      ...prev,
      signers: [...prev.signers, '']
    }));
  };

  const removeSignerField = (index: number) => {
    setNewWallet(prev => {
      const updatedSigners = prev.signers.filter((_, i) => i !== index);
      return {
        ...prev,
        signers: updatedSigners.length ? updatedSigners : [''],
        threshold: Math.min(prev.threshold, updatedSigners.length)
      };
    });
  };

  const handleAddWallet = async () => {
    if (!newWallet.name || !newWallet.address) {
      toast.error("Wallet name and address are required");
      return;
    }
    
    if (newWallet.isMultisig && (!newWallet.signers.length || newWallet.signers.some(s => !s))) {
      toast.error("All signer addresses must be provided for multisig wallets");
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      const success = await integrationService.addTreasuryWallet({
        ...newWallet,
        id: `wallet-${Date.now()}`,
        balance: 0,
        tokenBalance: []
      }, connectedWallet || '');
      
      if (success) {
        toast.success(`Added new treasury wallet: ${newWallet.name}`);
        setNewWallet({
          name: '',
          address: '',
          isMultisig: false,
          signers: [''],
          threshold: 1
        });
        setIsAddingWallet(false);
        loadWallets();
      } else {
        toast.error("Failed to add wallet");
      }
    } catch (error) {
      console.error("Error adding wallet:", error);
      toast.error("An error occurred while adding the wallet");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWallet = async (id: string) => {
    if (!connectedWallet) {
      toast.error("Please connect your wallet");
      return;
    }
    
    try {
      const success = await integrationService.removeTreasuryWallet(id, connectedWallet);
      
      if (success) {
        setWallets(prev => prev.filter(wallet => wallet.id !== id));
        toast.success("Wallet removed from treasury");
      } else {
        toast.error("Failed to remove wallet");
      }
    } catch (error) {
      console.error("Error removing wallet:", error);
      toast.error("An error occurred while removing the wallet");
    }
  };

  const handleTransferSubmit = async () => {
    if (!transferDetails.fromWallet || !transferDetails.toWallet || transferDetails.amount <= 0) {
      toast.error("Please fill in all transfer details");
      return;
    }
    
    setLoading(true);
    
    try {
      // In a real app, this would be an API call
      const success = await integrationService.transferBetweenTreasuryWallets(
        transferDetails.fromWallet,
        transferDetails.toWallet,
        transferDetails.amount,
        transferDetails.token,
        connectedWallet || ''
      );
      
      if (success) {
        toast.success(`Transferred ${transferDetails.amount} ${transferDetails.token} successfully`);
        setIsTransferring(false);
        setTransferDetails({
          fromWallet: '',
          toWallet: '',
          amount: 0,
          token: 'SOL'
        });
        loadWallets();
      } else {
        toast.error("Transfer failed");
      }
    } catch (error) {
      console.error("Error during transfer:", error);
      toast.error("An error occurred during the transfer");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Address copied to clipboard");
  };

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.substring(0, 4)}...${address.substring(address.length - 4)}`;
  };

  const getTotalBalance = () => {
    return wallets.reduce((sum, wallet) => sum + wallet.balance, 0);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Wallet className="text-orange-500" size={22} />
            Treasury Management
          </h2>
          <p className="text-gray-400 text-sm">Manage project treasury wallets and funds</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={loadWallets}
            disabled={refreshing}
            className="border-white/20"
          >
            <RefreshCcw size={14} className={`mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          
          <Dialog open={isTransferring} onOpenChange={setIsTransferring}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="border-orange-500/50 text-orange-500">
                <ArrowUpDown size={14} className="mr-2" />
                Transfer
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-wybe-background-light sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Transfer Funds</DialogTitle>
                <DialogDescription>
                  Move funds between treasury wallets
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">From Wallet</label>
                  <select 
                    className="w-full p-2 rounded-md bg-black/30 border border-white/10"
                    value={transferDetails.fromWallet}
                    onChange={(e) => setTransferDetails(prev => ({ ...prev, fromWallet: e.target.value }))}
                  >
                    <option value="">Select source wallet</option>
                    {wallets.map(wallet => (
                      <option key={`from-${wallet.id}`} value={wallet.id}>
                        {wallet.name} ({formatAddress(wallet.address)}) - {wallet.balance} SOL
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">To Wallet</label>
                  <select 
                    className="w-full p-2 rounded-md bg-black/30 border border-white/10"
                    value={transferDetails.toWallet}
                    onChange={(e) => setTransferDetails(prev => ({ ...prev, toWallet: e.target.value }))}
                  >
                    <option value="">Select destination wallet</option>
                    {wallets.map(wallet => (
                      <option key={`to-${wallet.id}`} value={wallet.id}>
                        {wallet.name} ({formatAddress(wallet.address)})
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount</label>
                  <Input
                    type="number"
                    placeholder="0.0"
                    className="bg-black/30"
                    value={transferDetails.amount || ''}
                    onChange={(e) => setTransferDetails(prev => ({ 
                      ...prev, 
                      amount: parseFloat(e.target.value) || 0 
                    }))}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Token</label>
                  <select 
                    className="w-full p-2 rounded-md bg-black/30 border border-white/10"
                    value={transferDetails.token}
                    onChange={(e) => setTransferDetails(prev => ({ ...prev, token: e.target.value }))}
                  >
                    <option value="SOL">SOL</option>
                    <option value="USDC">USDC</option>
                    <option value="WYBE">WYBE</option>
                  </select>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline"
                  onClick={() => setIsTransferring(false)}
                  className="border-white/20"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleTransferSubmit}
                  className="bg-orange-500 hover:bg-orange-600"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowUpDown className="w-4 h-4 mr-2" />
                      Transfer Funds
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isAddingWallet} onOpenChange={setIsAddingWallet}>
            <DialogTrigger asChild>
              <Button className="bg-orange-500 hover:bg-orange-600">
                <Plus size={14} className="mr-2" />
                Add Wallet
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-wybe-background-light sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Treasury Wallet</DialogTitle>
                <DialogDescription>
                  Add a new wallet to the project treasury
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Wallet Name</label>
                  <Input
                    name="name"
                    placeholder="Main Treasury"
                    value={newWallet.name}
                    onChange={handleInputChange}
                    className="bg-black/30"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Wallet Address</label>
                  <Input
                    name="address"
                    placeholder="Solana wallet address"
                    value={newWallet.address}
                    onChange={handleInputChange}
                    className="bg-black/30 font-mono text-xs"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="isMultisig"
                    checked={newWallet.isMultisig}
                    onChange={(e) => setNewWallet(prev => ({ ...prev, isMultisig: e.target.checked }))}
                    className="rounded border-gray-300"
                  />
                  <label htmlFor="isMultisig" className="text-sm font-medium">
                    This is a multisig wallet
                  </label>
                </div>
                
                {newWallet.isMultisig && (
                  <div className="space-y-4 border border-white/10 rounded-md p-4 bg-black/20">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Approval Threshold</label>
                      <Input
                        type="number"
                        name="threshold"
                        min={1}
                        max={newWallet.signers.length}
                        value={newWallet.threshold}
                        onChange={(e) => setNewWallet(prev => ({ 
                          ...prev, 
                          threshold: Math.min(
                            Math.max(1, parseInt(e.target.value) || 1),
                            prev.signers.length
                          )
                        }))}
                        className="bg-black/30"
                      />
                      <p className="text-xs text-gray-400">
                        Number of signers required to approve transactions ({newWallet.threshold} of {newWallet.signers.length})
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Signers</label>
                      {newWallet.signers.map((signer, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            placeholder={`Signer ${index + 1} address`}
                            value={signer}
                            onChange={(e) => handleSignerChange(index, e.target.value)}
                            className="bg-black/30 font-mono text-xs"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeSignerField(index)}
                            disabled={newWallet.signers.length === 1}
                            className="shrink-0"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addSignerField}
                        className="mt-2"
                      >
                        <Plus size={14} className="mr-2" />
                        Add Signer
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline"
                  onClick={() => setIsAddingWallet(false)}
                  className="border-white/20"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleAddWallet}
                  className="bg-orange-500 hover:bg-orange-600"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <RefreshCcw className="w-4 h-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Wallet
                    </>
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-5 border-orange-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-poppins font-bold">Total Balance</h3>
            <Coins className="text-orange-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">{getTotalBalance().toFixed(2)} SOL</div>
          <div className="text-sm text-gray-400 mt-1">≈ ${(getTotalBalance() * 20).toFixed(2)} USD</div>
        </div>
        
        <div className="glass-card p-5 border-orange-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-poppins font-bold">Wallets</h3>
            <Wallet className="text-orange-500" size={20} />
          </div>
          <div className="text-3xl font-bold text-white">{wallets.length}</div>
          <div className="text-sm text-gray-400 mt-1">
            {wallets.filter(w => w.isMultisig).length} multisig, {wallets.length - wallets.filter(w => w.isMultisig).length} standard
          </div>
        </div>
        
        <div className="glass-card p-5 border-orange-500/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-poppins font-bold">Security Status</h3>
            {wallets.some(w => w.isMultisig) ? (
              <CheckCircle2 className="text-green-500" size={20} />
            ) : (
              <AlertTriangle className="text-amber-500" size={20} />
            )}
          </div>
          <div className="text-lg font-bold text-white">
            {wallets.some(w => w.isMultisig) ? "Multisig Enabled" : "No Multisig"}
          </div>
          <div className="text-sm text-gray-400 mt-1">
            {wallets.some(w => w.isMultisig) 
              ? "Enhanced security with multisig wallets" 
              : "Consider adding a multisig wallet for better security"}
          </div>
        </div>
      </div>
      
      <div className="glass-card border-orange-500/20">
        <div className="p-4 border-b border-white/10 flex items-center space-x-2">
          <Wallet className="text-orange-500" size={18} />
          <h3 className="font-poppins font-bold">Treasury Wallets</h3>
        </div>
        
        <div className="p-4 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-white/10">
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Balance</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wallets.map((wallet) => (
                <TableRow key={wallet.id} className="border-white/5">
                  <TableCell className="font-medium">{wallet.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs">{formatAddress(wallet.address)}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6" 
                        onClick={() => copyToClipboard(wallet.address)}
                      >
                        <Copy size={12} />
                      </Button>
                      <a 
                        href={`https://explorer.solana.com/address/${wallet.address}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-orange-500 hover:text-orange-400"
                      >
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </TableCell>
                  <TableCell>
                    {wallet.isMultisig ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-500/20 text-purple-300">
                        Multisig ({wallet.threshold} of {wallet.signers?.length})
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                        Standard
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-medium">{wallet.balance.toFixed(2)} SOL</div>
                    {wallet.tokenBalance && wallet.tokenBalance.length > 0 && (
                      <div className="text-xs text-gray-400">
                        {wallet.tokenBalance.map((token, i) => (
                          <div key={i}>
                            {token.amount.toLocaleString()} {token.symbol}
                          </div>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => {
                          setTransferDetails(prev => ({
                            ...prev,
                            fromWallet: wallet.id
                          }));
                          setIsTransferring(true);
                        }}
                      >
                        <ArrowUpDown size={14} />
                        <span className="sr-only">Transfer</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 hover:text-red-500"
                        onClick={() => handleDeleteWallet(wallet.id)}
                      >
                        <Trash2 size={14} />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              
              {wallets.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-400">
                    No treasury wallets found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      
      <div className="glass-card p-6 border-orange-500/20">
        <h3 className="font-poppins font-bold mb-4">Treasury Security Recommendations</h3>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-orange-500/20 p-2 rounded-full">
              <CheckCircle2 className="text-orange-500" size={18} />
            </div>
            <div>
              <h4 className="font-medium">Use Multisig Wallets</h4>
              <p className="text-sm text-gray-400">
                For main treasury funds, always use multisig wallets requiring multiple approvals for transactions.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-orange-500/20 p-2 rounded-full">
              <CheckCircle2 className="text-orange-500" size={18} />
            </div>
            <div>
              <h4 className="font-medium">Separate Operational Funds</h4>
              <p className="text-sm text-gray-400">
                Keep operational funds separate from long-term treasury holdings to limit exposure.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-orange-500/20 p-2 rounded-full">
              <CheckCircle2 className="text-orange-500" size={18} />
            </div>
            <div>
              <h4 className="font-medium">Regular Audits</h4>
              <p className="text-sm text-gray-400">
                Conduct regular audits of treasury wallets and transactions to ensure accountability.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TreasuryWalletManager;
