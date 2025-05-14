
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, Download, AlertTriangle, Terminal, ExternalLink, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { smartContractService } from "@/services/smartContractService";
import { integrationService } from "@/services/integrationService";

const AnchorStatusCard = () => {
  const [isAnchorInstalled, setIsAnchorInstalled] = useState<boolean>(false);
  const [anchorVersion, setAnchorVersion] = useState<string | undefined>(undefined);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  
  useEffect(() => {
    checkAnchorStatus();
  }, []);
  
  const checkAnchorStatus = () => {
    const config = smartContractService.getContractConfig();
    setIsAnchorInstalled(config.anchorInstalled);
    setAnchorVersion(config.anchorVersion);
  };
  
  const handleRefreshStatus = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      checkAnchorStatus();
      setIsRefreshing(false);
      toast.success("Anchor status refreshed");
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 border-wybe-primary/20"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold font-poppins flex items-center">
          <Terminal className="mr-2 text-orange-500" size={20} />
          Anchor CLI Status
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRefreshStatus} 
          disabled={isRefreshing}
          className="h-8 px-2"
        >
          <RefreshCcw size={14} className={`mr-1 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
      
      <div className="space-y-3">
        {isAnchorInstalled ? (
          <Alert variant="default" className="bg-green-500/10 border-green-500/30">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <AlertTitle className="font-poppins">Anchor Detected</AlertTitle>
            <AlertDescription>
              Anchor CLI version {anchorVersion || "unknown"} is installed on this system.
              Smart contract deployment will use real Anchor builds.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert variant="destructive" className="bg-red-500/10 border-red-500/30">
            <XCircle className="h-5 w-5 text-red-500" />
            <AlertTitle className="font-poppins">Anchor Not Detected</AlertTitle>
            <AlertDescription>
              Anchor CLI is not installed or not in your PATH. Smart contract deployment will use simulation mode.
            </AlertDescription>
          </Alert>
        )}
        
        {!isAnchorInstalled && (
          <Alert variant="default" className="bg-amber-500/10 border-amber-500/30">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <AlertTitle className="font-poppins">Installation Instructions</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>To enable real smart contract deployment, please install Anchor CLI:</p>
              <div className="bg-black/50 p-3 rounded font-mono text-sm mb-2 overflow-x-auto">
                <code>npm install -g @project-serum/anchor-cli</code>
              </div>
              <Button className="flex items-center gap-2" size="sm" asChild>
                <a href="https://www.anchor-lang.com/docs/installation" target="_blank" rel="noreferrer">
                  <Download size={14} />
                  Installation Guide
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </Button>
            </AlertDescription>
          </Alert>
        )}
        
        <div className="pt-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Smart Contract Mode:</span>
            <Badge variant={isAnchorInstalled ? "default" : "outline"} className={isAnchorInstalled ? "bg-green-500/80" : "border-amber-500 text-amber-500"}>
              {isAnchorInstalled ? "Real Deployment" : "Simulation"}
            </Badge>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnchorStatusCard;
