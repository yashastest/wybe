
import React, { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Wallet, ShieldCheck, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const HardwareWalletManager = () => {
  const { address, connected, connect, disconnect, connecting } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  
  const connectHardwareWallet = async () => {
    if (connected) {
      toast.info("Wallet already connected");
      return;
    }
    
    setIsLoading(true);
    try {
      await connect();
      toast.success("Hardware wallet connected successfully");
    } catch (error) {
      toast.error("Failed to connect hardware wallet");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Hardware Wallet Management</h2>
        <ShieldCheck className="text-green-500" />
      </div>
      
      <div className="space-y-4">
        <div className="p-4 bg-secondary/20 rounded-md">
          <h3 className="font-medium mb-2">Wallet Status</h3>
          <p className="text-sm text-muted-foreground">
            {connected ? 
              `Connected: ${address?.substring(0, 6)}...${address?.substring(address.length - 4)}` : 
              "No hardware wallet connected"}
          </p>
        </div>
        
        <div className="flex space-x-2">
          {connected ? (
            <Button variant="outline" onClick={disconnect}>
              Disconnect Wallet
            </Button>
          ) : (
            <Button 
              onClick={connectHardwareWallet} 
              disabled={connecting || isLoading}
            >
              {(connecting || isLoading) ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Connecting...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" /> Connect Hardware Wallet
                </>
              )}
            </Button>
          )}
          
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => {
              setIsLoading(true);
              setTimeout(() => {
                toast.info("Wallet status refreshed");
                setIsLoading(false);
              }, 500);
            }}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        
        {connected && (
          <div className="mt-6 space-y-4">
            <h3 className="font-medium">Available Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm">Export Public Key</Button>
              <Button variant="outline" size="sm">Update Firmware</Button>
              <Button variant="outline" size="sm">Verify Connection</Button>
              <Button variant="outline" size="sm">View Transactions</Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default HardwareWalletManager;
