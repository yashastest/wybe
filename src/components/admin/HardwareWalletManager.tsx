import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { toast } from "sonner";
import { 
  ShieldCheck, 
  ExternalLink, 
  RefreshCcw,
  Wallet,
  Lock,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWallet } from '@/lib/wallet';

const HardwareWalletManager = () => {
  const { connect, connectHardwareWallet, address, isConnecting, isHardwareWallet } = useWallet();
  const [isChecking, setIsChecking] = useState(false);
  const [securityStatus, setSecurityStatus] = useState<'secure' | 'warning' | 'unknown'>('unknown');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    checkWalletSecurity();
  }, [address, isHardwareWallet]);

  const checkWalletSecurity = () => {
    setIsChecking(true);
    
    // Simulate security check
    setTimeout(() => {
      // For demo purposes, hardware wallets are always considered secure
      if (isHardwareWallet) {
        setSecurityStatus('secure');
      } else {
        // For demo purposes, regular wallets are considered less secure
        setSecurityStatus('warning');
      }
      
      setLastChecked(new Date());
      setIsChecking(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card className="glass-card border-wybe-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ShieldCheck className="mr-2 text-blue-500" />
            Treasury Hardware Wallet Security
          </CardTitle>
          <CardDescription>
            Secure your treasury with a hardware wallet for maximum protection
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium">Current Wallet Type:</p>
              {address ? (
                <div className="flex items-center mt-1">
                  {isHardwareWallet ? (
                    <Badge className="bg-green-500">Hardware Wallet</Badge>
                  ) : (
                    <Badge className="bg-amber-500">Regular Wallet</Badge>
                  )}
                  <span className="ml-2 text-sm text-muted-foreground truncate max-w-[180px] sm:max-w-xs">
                    {address}
                  </span>
                </div>
              ) : (
                <span className="text-sm text-muted-foreground">No wallet connected</span>
              )}
            </div>
            
            <div>
              {securityStatus === 'secure' && (
                <Badge className="bg-green-600 flex items-center">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Secure
                </Badge>
              )}
              {securityStatus === 'warning' && (
                <Badge className="bg-amber-500 flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Improve Security
                </Badge>
              )}
            </div>
          </div>
          
          {securityStatus === 'warning' && (
            <Alert className="border-amber-500/50 bg-amber-500/10">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-amber-500">
                For treasury management, we strongly recommend using a hardware wallet for enhanced security.
              </AlertDescription>
            </Alert>
          )}
          
          {securityStatus === 'secure' && (
            <Alert className="border-green-500/50 bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-500">
                Your treasury is secured with a hardware wallet. This provides the highest level of security.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2 mt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button
                variant="default"
                disabled={isConnecting}
                onClick={connectHardwareWallet}
                className="bg-blue-600 hover:bg-blue-700 flex items-center justify-center"
              >
                {isConnecting ? (
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="mr-2 h-4 w-4" />
                )}
                Connect Hardware Wallet
              </Button>
              
              <Button
                variant="outline"
                onClick={connect}
                disabled={isConnecting}
                className="border-wybe-primary text-wybe-primary hover:text-wybe-primary flex items-center justify-center"
              >
                {isConnecting ? (
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wallet className="mr-2 h-4 w-4" />
                )}
                Connect Standard Wallet
              </Button>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={checkWalletSecurity}
              disabled={isChecking || !address}
              className="w-full text-xs"
            >
              {isChecking ? (
                <RefreshCcw className="mr-2 h-3 w-3 animate-spin" />
              ) : (
                <RefreshCcw className="mr-2 h-3 w-3" />
              )}
              {isChecking ? "Checking Security..." : "Check Wallet Security"}
            </Button>
          </div>
          
          {lastChecked && (
            <p className="text-xs text-muted-foreground text-center mt-2">
              Last checked: {lastChecked.toLocaleString()}
            </p>
          )}
          
          <div className="mt-4 pt-4 border-t border-wybe-primary/10">
            <h4 className="text-sm font-medium mb-2">Security Recommendations:</h4>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start">
                <CheckCircle2 className="min-w-4 w-4 h-4 mr-2 text-green-500 mt-0.5" />
                Use a hardware wallet like Ledger or Trezor for treasury wallets
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="min-w-4 w-4 h-4 mr-2 text-green-500 mt-0.5" />
                Configure multi-signature requirements for treasury transactions
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="min-w-4 w-4 h-4 mr-2 text-green-500 mt-0.5" />
                Regularly rotate access keys for additional security
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="min-w-4 w-4 h-4 mr-2 text-green-500 mt-0.5" />
                Employ time-locks for large treasury withdrawals
              </li>
            </ul>
          </div>
          
          <div className="text-center mt-4">
            <a 
              href="https://docs.phantom.app/integrating/extension-and-mobile/ledger-hardware-wallet" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline flex items-center justify-center"
            >
              Learn more about Phantom's hardware wallet support
              <ExternalLink className="ml-1 w-3 h-3" />
            </a>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HardwareWalletManager;
