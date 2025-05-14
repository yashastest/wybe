
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Copy, CheckCircle2, Wallet, ArrowRight } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const TreasuryWalletManager = () => {
  const [treasuryWallet, setTreasuryWallet] = useState("8JzqrG4pQSSA7QuQeEjbDxKLBMqKriGCNzUL7Lxpk8iD");
  const [newTreasuryWallet, setNewTreasuryWallet] = useState("");
  const [copied, setCopied] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Copy treasury wallet address to clipboard
  const handleCopyAddress = () => {
    navigator.clipboard.writeText(treasuryWallet);
    setCopied(true);
    toast.success("Address copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  // Open confirmation dialog
  const handleOpenConfirmDialog = () => {
    if (!newTreasuryWallet || !isValidSolanaAddress(newTreasuryWallet)) {
      toast.error("Please enter a valid Solana wallet address");
      return;
    }
    setConfirmDialogOpen(true);
  };

  // Simple validation for Solana addresses (base58, typically 32-44 characters)
  const isValidSolanaAddress = (address) => {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  };

  // Update treasury wallet address
  const handleUpdateTreasuryWallet = () => {
    setLoading(true);
    
    // Simulate API call to update treasury wallet in smart contract
    setTimeout(() => {
      setTreasuryWallet(newTreasuryWallet);
      setNewTreasuryWallet("");
      setConfirmDialogOpen(false);
      setLoading(false);
      toast.success("Treasury wallet updated successfully");
    }, 1500);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className="space-y-6"
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 }
        }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Wallet className="text-orange-500" size={24} />
          Treasury Wallet Management
        </h2>

        <div className="space-y-6">
          <div className="bg-white/5 p-4 rounded-lg border border-orange-500/20">
            <h3 className="text-lg font-medium mb-2">Current Treasury Wallet</h3>
            <p className="text-sm text-gray-400 mb-3">
              All fees and protocol revenues are sent to this wallet address
            </p>
            <div className="flex items-center gap-2">
              <div className="p-3 bg-black/30 rounded font-mono text-sm flex-1 overflow-x-auto text-orange-500">
                {treasuryWallet}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-wybe-background/50 border-orange-500/20"
                onClick={handleCopyAddress}
              >
                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                <span className="ml-1 whitespace-nowrap">{copied ? "Copied" : "Copy"}</span>
              </Button>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-orange-500/20">
            <h3 className="text-lg font-medium mb-2">Update Treasury Wallet</h3>
            <p className="text-sm text-gray-400 mb-3">
              Enter a new Solana wallet address to update the treasury
            </p>
            <div className="flex flex-col md:flex-row gap-3">
              <Input
                placeholder="Enter new treasury wallet address"
                value={newTreasuryWallet}
                onChange={(e) => setNewTreasuryWallet(e.target.value)}
                className="bg-black/30 border-white/10"
              />
              <Button 
                className="bg-orange-500 hover:bg-orange-600"
                onClick={handleOpenConfirmDialog}
              >
                Update Treasury
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>

          <div className="bg-white/5 p-4 rounded-lg border border-orange-500/20">
            <h3 className="text-lg font-medium mb-3">Treasury Management Guide</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-orange-500">Why Update Treasury?</h4>
                <p className="text-sm text-gray-300">
                  The treasury wallet receives all protocol fees and revenues. You might want to update it for security reasons or to change the fee recipient.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-orange-500">Security Considerations</h4>
                <p className="text-sm text-gray-300">
                  Only update the treasury to a wallet you fully control. The new address is written permanently to the smart contract and can only be changed with another transaction.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-orange-500">Gas Fees</h4>
                <p className="text-sm text-gray-300">
                  Updating the treasury wallet requires a blockchain transaction that will incur gas fees on the Solana network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent className="bg-wybe-background-light border-wybe-primary/20">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Treasury Update</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to update the treasury wallet to:
              <div className="font-mono text-wybe-primary bg-black/30 p-2 rounded mt-2 overflow-x-auto">
                {newTreasuryWallet}
              </div>
              <p className="mt-2">
                This action will require a blockchain transaction and cannot be undone. 
                Are you sure you want to continue?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border border-white/20 hover:bg-white/5 text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleUpdateTreasuryWallet} 
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={loading}
            >
              {loading ? "Updating..." : "Confirm Update"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default TreasuryWalletManager;
