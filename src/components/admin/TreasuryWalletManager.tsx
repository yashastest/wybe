
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Copy, CheckCircle2, Wallet, ArrowRight, RefreshCcw, Mail } from "lucide-react";
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
import { useIsMobile } from "@/hooks/use-mobile";
import OTPVerification from './OTPVerification';
import { integrationService } from '@/services/integrationService';

const TreasuryWalletManager = () => {
  const [treasuryWallet, setTreasuryWallet] = useState("8JzqrG4pQSSA7QuQeEjbDxKLBMqKriGCNzUL7Lxpk8iD");
  const [newTreasuryWallet, setNewTreasuryWallet] = useState("");
  const [copied, setCopied] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const isMobile = useIsMobile();

  // Admin email for OTP
  const adminEmail = "wybefun@gmail.com";

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
  
  // Proceed with OTP verification
  const handleProceedToOtp = () => {
    setConfirmDialogOpen(false);
    // Send OTP to admin email
    sendOtpEmail();
  };
  
  // Send OTP email simulation
  const sendOtpEmail = () => {
    setLoading(true);
    toast.info(`Sending OTP to ${adminEmail}...`);
    
    // Simulate API call to send OTP
    setTimeout(() => {
      setLoading(false);
      setOtpDialogOpen(true);
      toast.success(`OTP sent to ${adminEmail}`);
    }, 1500);
  };
  
  // Resend OTP email
  const handleResendOtp = () => {
    toast.info(`Resending OTP to ${adminEmail}...`);
    
    // Simulate API call to resend OTP
    setTimeout(() => {
      toast.success(`New OTP sent to ${adminEmail}`);
    }, 1500);
  };
  
  // Handle OTP verification
  const handleOtpVerify = (verified: boolean) => {
    setVerifyingOtp(true);
    
    if (verified) {
      setOtpVerified(true);
      // Close OTP dialog and proceed with wallet update
      setTimeout(() => {
        setOtpDialogOpen(false);
        handleUpdateTreasuryWallet();
      }, 1000);
    } else {
      setVerifyingOtp(false);
    }
  };

  // Update treasury wallet address after OTP verification
  const handleUpdateTreasuryWallet = async () => {
    setLoading(true);
    
    try {
      // Call integration service to update treasury wallet
      // In a real app, this would update the smart contract
      
      // Simulate blockchain transaction
      toast.info("Updating treasury wallet on blockchain...");
      
      // Wait for the "transaction" to complete
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update state with new wallet address
      setTreasuryWallet(newTreasuryWallet);
      setNewTreasuryWallet("");
      
      toast.success("Treasury wallet updated successfully");
    } catch (error) {
      console.error("Treasury update error:", error);
      toast.error("Failed to update treasury wallet");
    } finally {
      setOtpDialogOpen(false);
      setLoading(false);
      setVerifyingOtp(false);
      setOtpVerified(false);
    }
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
        className="glass-card p-4 md:p-6"
      >
        <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 flex items-center gap-2">
          <Wallet className="text-orange-500" size={20} />
          Treasury Wallet Management
        </h2>

        <div className="space-y-4 md:space-y-6">
          <div className="bg-white/5 p-3 md:p-4 rounded-lg border border-orange-500/20">
            <h3 className="text-base md:text-lg font-medium mb-2">Current Treasury Wallet</h3>
            <p className="text-xs md:text-sm text-gray-400 mb-2 md:mb-3">
              All fees and protocol revenues are sent to this wallet address
            </p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="p-2 md:p-3 bg-black/30 rounded font-mono text-xs md:text-sm flex-1 overflow-x-auto text-orange-500 whitespace-nowrap">
                {treasuryWallet}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-wybe-background/50 border-orange-500/20 whitespace-nowrap"
                onClick={handleCopyAddress}
              >
                {copied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                <span className="ml-1">{copied ? "Copied" : "Copy"}</span>
              </Button>
            </div>
          </div>

          <div className="bg-white/5 p-3 md:p-4 rounded-lg border border-orange-500/20">
            <h3 className="text-base md:text-lg font-medium mb-2">Update Treasury Wallet</h3>
            <p className="text-xs md:text-sm text-gray-400 mb-2 md:mb-3">
              Enter a new Solana wallet address to update the treasury
            </p>
            <div className="flex flex-col gap-3">
              <Input
                placeholder="Enter new treasury wallet address"
                value={newTreasuryWallet}
                onChange={(e) => setNewTreasuryWallet(e.target.value)}
                className="bg-black/30 border-white/10 text-sm"
              />
              <Button 
                className="bg-orange-500 hover:bg-orange-600 w-full sm:w-auto"
                onClick={handleOpenConfirmDialog}
              >
                Update Treasury
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </div>
          </div>

          <div className="bg-white/5 p-3 md:p-4 rounded-lg border border-orange-500/20">
            <h3 className="text-base md:text-lg font-medium mb-2">Treasury Management Guide</h3>
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-orange-500 text-sm md:text-base">Why Update Treasury?</h4>
                <p className="text-xs md:text-sm text-gray-300">
                  The treasury wallet receives all protocol fees and revenues. You might want to update it for security reasons or to change the fee recipient.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-orange-500 text-sm md:text-base">Security Considerations</h4>
                <p className="text-xs md:text-sm text-gray-300">
                  Only update the treasury to a wallet you fully control. The new address is written permanently to the smart contract and can only be changed with another transaction.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-orange-500 text-sm md:text-base">Gas Fees</h4>
                <p className="text-xs md:text-sm text-gray-300">
                  Updating the treasury wallet requires a blockchain transaction that will incur gas fees on the Solana network.
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Confirmation Dialog */}
      <AlertDialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <AlertDialogContent className="bg-wybe-background-light border-wybe-primary/20 max-w-[90%] w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">Confirm Treasury Update</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to update the treasury wallet to:
              <div className="font-mono text-wybe-primary bg-black/30 p-2 rounded mt-2 overflow-x-auto text-xs md:text-sm break-all">
                {newTreasuryWallet}
              </div>
              <p className="mt-2 text-sm">
                This action will require a blockchain transaction and cannot be undone. 
                For security, an OTP verification will be required.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="bg-transparent border border-white/20 hover:bg-white/5 text-white mt-0">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleProceedToOtp} 
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={loading}
            >
              {loading ? (
                <>
                  <RefreshCcw size={16} className="mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Mail size={16} className="mr-2" />
                  Send OTP Verification
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* OTP Verification Dialog */}
      <AlertDialog open={otpDialogOpen} onOpenChange={(open) => !verifyingOtp && setOtpDialogOpen(open)}>
        <AlertDialogContent className="bg-wybe-background-light border-wybe-primary/20 max-w-[90%] w-[500px]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg">OTP Verification</AlertDialogTitle>
          </AlertDialogHeader>
          
          <OTPVerification 
            email={adminEmail}
            onVerify={handleOtpVerify}
            onResend={handleResendOtp}
            isLoading={verifyingOtp}
          />
          
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0 mt-4">
            <AlertDialogCancel 
              className="bg-transparent border border-white/20 hover:bg-white/5 text-white mt-0"
              disabled={verifyingOtp}
            >
              Cancel
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default TreasuryWalletManager;
