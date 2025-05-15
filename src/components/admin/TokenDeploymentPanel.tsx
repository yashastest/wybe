
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DeploymentStatus } from './DeploymentStatus';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { integrationService, DeploymentConfig } from '@/services/integrationService';
import { useWallet } from '@/lib/wallet';

const TokenDeploymentPanel: React.FC<{
  tokenId?: string;
  tokenName?: string;
  tokenSymbol?: string;
  creatorWallet?: string;
}> = ({ tokenId, tokenName, tokenSymbol, creatorWallet }) => {
  const [network, setNetwork] = useState<'mainnet' | 'testnet' | 'devnet' | 'localnet'>('devnet');
  const [deploymentStatus, setDeploymentStatus] = useState(integrationService.getDeploymentStatus());
  const [isInitializing, setIsInitializing] = useState(false);
  const [form, setForm] = useState<DeploymentConfig>({
    name: tokenName || '',
    symbol: tokenSymbol || '',
    initialSupply: 1000000,
    creatorWallet: creatorWallet || '',
    networkType: 'devnet',
    tokenDecimals: 9,
    mintAuthority: creatorWallet || '',
    bondingCurveType: 'linear',
    platformFee: 2.5,
    creatorFee: 2.5
  });
  const { address } = useWallet();
  
  // Poll for deployment status updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (deploymentStatus.deploymentInProgress) {
        setDeploymentStatus(integrationService.getDeploymentStatus());
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [deploymentStatus.deploymentInProgress]);
  
  // Handle network change
  const handleNetworkChange = (value: string) => {
    setNetwork(value as 'mainnet' | 'testnet' | 'devnet' | 'localnet');
    setForm({ ...form, networkType: value as 'mainnet' | 'testnet' | 'devnet' | 'localnet' });
    integrationService.setDeploymentNetwork(value as 'mainnet' | 'testnet' | 'devnet' | 'localnet');
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === 'initialSupply' || name === 'tokenDecimals' ? Number(value) : value });
  };
  
  // Handle bonding curve type change
  const handleBondingCurveChange = (value: string) => {
    setForm({ ...form, bondingCurveType: value as 'linear' | 'exponential' | 'logarithmic' });
  };
  
  // Handle deployment initialization
  const handleInitDeployment = async () => {
    try {
      setIsInitializing(true);
      
      // Validate form
      if (!form.name || !form.symbol || !form.creatorWallet) {
        toast.error("Please fill in all required fields");
        return;
      }
      
      // Initialize deployment
      const deploymentId = await integrationService.initializeDeployment({
        ...form,
        creatorWallet: form.creatorWallet || address || ''
      });
      
      // Start deployment process
      await integrationService.startDeployment();
      
      toast.success("Deployment started successfully");
      setDeploymentStatus(integrationService.getDeploymentStatus());
    } catch (error) {
      toast.error(`Failed to initialize deployment: ${error.message}`);
    } finally {
      setIsInitializing(false);
    }
  };
  
  // Handle deployment reset
  const handleResetDeployment = () => {
    integrationService.resetDeployment();
    setDeploymentStatus(integrationService.getDeploymentStatus());
    toast.info("Deployment reset");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Token Deployment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Token Name</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="Wybe Token" 
                value={form.name} 
                onChange={handleInputChange} 
                disabled={deploymentStatus.deploymentInProgress || isInitializing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="symbol">Token Symbol</Label>
              <Input 
                id="symbol" 
                name="symbol" 
                placeholder="WYBE" 
                value={form.symbol} 
                onChange={handleInputChange} 
                disabled={deploymentStatus.deploymentInProgress || isInitializing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="initialSupply">Initial Supply</Label>
              <Input 
                id="initialSupply" 
                name="initialSupply" 
                type="number" 
                placeholder="1000000" 
                value={form.initialSupply} 
                onChange={handleInputChange} 
                disabled={deploymentStatus.deploymentInProgress || isInitializing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tokenDecimals">Token Decimals</Label>
              <Input 
                id="tokenDecimals" 
                name="tokenDecimals" 
                type="number" 
                placeholder="9" 
                value={form.tokenDecimals} 
                onChange={handleInputChange} 
                disabled={deploymentStatus.deploymentInProgress || isInitializing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="creatorWallet">Creator Wallet</Label>
              <Input 
                id="creatorWallet" 
                name="creatorWallet" 
                placeholder="Solana wallet address" 
                value={form.creatorWallet || address || ''} 
                onChange={handleInputChange} 
                disabled={deploymentStatus.deploymentInProgress || isInitializing}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mintAuthority">Mint Authority</Label>
              <Input 
                id="mintAuthority" 
                name="mintAuthority" 
                placeholder="Mint authority address" 
                value={form.mintAuthority || form.creatorWallet || address || ''} 
                onChange={handleInputChange} 
                disabled={deploymentStatus.deploymentInProgress || isInitializing}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Network</Label>
              <Select 
                onValueChange={handleNetworkChange} 
                value={network}
                disabled={deploymentStatus.deploymentInProgress || isInitializing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="devnet">Devnet</SelectItem>
                  <SelectItem value="testnet">Testnet</SelectItem>
                  <SelectItem value="mainnet">Mainnet</SelectItem>
                  <SelectItem value="localnet">Localnet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Bonding Curve Type</Label>
              <Select 
                onValueChange={handleBondingCurveChange} 
                value={form.bondingCurveType}
                disabled={deploymentStatus.deploymentInProgress || isInitializing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select bonding curve" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="linear">Linear</SelectItem>
                  <SelectItem value="exponential">Exponential</SelectItem>
                  <SelectItem value="logarithmic">Logarithmic</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={handleResetDeployment}
              disabled={deploymentStatus.deploymentInProgress || isInitializing || !deploymentStatus.deploymentComplete}
            >
              Reset Deployment
            </Button>
            
            <Button 
              onClick={handleInitDeployment}
              disabled={deploymentStatus.deploymentInProgress || isInitializing}
            >
              {isInitializing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initializing...
                </>
              ) : deploymentStatus.deploymentProgress > 0 && !deploymentStatus.deploymentComplete ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Deploy Token
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {(deploymentStatus.deploymentInProgress || deploymentStatus.deploymentComplete) && (
        <DeploymentStatus
          deploymentNetwork={deploymentStatus.deploymentNetwork}
          deploymentProgress={deploymentStatus.deploymentProgress}
          currentStepIndex={deploymentStatus.currentStepIndex}
          steps={deploymentStatus.steps}
        />
      )}
    </div>
  );
};

export default TokenDeploymentPanel;
