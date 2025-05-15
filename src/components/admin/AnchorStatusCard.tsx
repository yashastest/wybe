
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, ExternalLink, Terminal, RefreshCcw } from "lucide-react";
import { smartContractService } from "@/services/smartContractService";
import { integrationService } from "@/services/integrationService";

const AnchorStatusCard = () => {
  const [isAnchorInstalled, setIsAnchorInstalled] = useState<boolean>(false);
  const [anchorVersion, setAnchorVersion] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [networkConfig, setNetworkConfig] = useState(integrationService.getNetworkConfig());
  
  useEffect(() => {
    checkAnchorStatus();
  }, []);
  
  const checkAnchorStatus = () => {
    setIsLoading(true);
    
    // Simulate fetching anchor status
    setTimeout(() => {
      const config = smartContractService.getContractConfig();
      setIsAnchorInstalled(config.anchorInstalled);
      setAnchorVersion(config.anchorVersion);
      setNetworkConfig(integrationService.getNetworkConfig());
      setIsLoading(false);
    }, 500);
  };
  
  return (
    <Card className="glass-card border-wybe-primary/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-semibold flex items-center">
          <Terminal className="mr-2 text-orange-500" size={20} />
          Environment Status
        </CardTitle>
        <Button
          variant="outline"
          size="sm"
          onClick={checkAnchorStatus}
          disabled={isLoading}
          className="h-8 px-2"
        >
          {isLoading ? (
            <RefreshCcw className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Anchor CLI</span>
            <div className="flex items-center">
              {isAnchorInstalled ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">Installed</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
                  <span className="text-sm text-amber-500">Not found</span>
                </>
              )}
            </div>
          </div>
          
          {anchorVersion && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Version</span>
              <span className="text-sm font-mono">{anchorVersion}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Network</span>
            <span className="text-sm font-medium capitalize">{networkConfig.network}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">RPC Endpoint</span>
            <div className="flex items-center">
              <span className="text-sm font-mono truncate max-w-[150px] md:max-w-[200px]">
                {networkConfig.endpoint}
              </span>
              <a 
                href={networkConfig.endpoint} 
                target="_blank" 
                rel="noopener noreferrer"
                className="ml-1 text-gray-400 hover:text-white"
              >
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Status</span>
            <div className="flex items-center">
              {networkConfig.isConnected ? (
                <>
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-500">Connected</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-500">Disconnected</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {!isAnchorInstalled && (
          <Alert className="bg-blue-500/10 border border-blue-500/20">
            <AlertDescription className="text-xs">
              <p className="font-semibold">Anchor CLI is required for deploying contracts.</p>
              <p className="mt-1">Install it using:</p>
              <pre className="bg-black/20 p-2 rounded mt-2 text-xs overflow-x-auto">
                npm install -g @coral-xyz/anchor-cli
              </pre>
              <p className="mt-2">
                <a
                  href="https://www.anchor-lang.com/docs/installation"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline flex items-center"
                >
                  Installation guide
                  <ExternalLink size={12} className="ml-1" />
                </a>
              </p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default AnchorStatusCard;
