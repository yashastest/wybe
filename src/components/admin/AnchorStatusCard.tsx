
import React from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle2, XCircle, ExternalLink } from "lucide-react";
import { smartContractService } from "@/services/smartContractService";

const AnchorStatusCard = () => {
  const config = smartContractService.getContractConfig();
  
  return (
    <Card className="glass-card border-wybe-primary/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <h3 className="text-lg font-semibold font-poppins">
          Anchor Development Environment
        </h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
              <div className="p-1.5 rounded-full bg-white/10">
                {config.anchorInstalled ? (
                  <CheckCircle2 size={18} className="text-green-500" />
                ) : (
                  <XCircle size={18} className="text-red-500" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">Anchor CLI</p>
                <p className="text-xs text-gray-400">
                  {config.anchorInstalled 
                    ? `Version ${config.anchorVersion} installed` 
                    : "Not detected"}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
              <div className="p-1.5 rounded-full bg-white/10">
                <CheckCircle2 size={18} className="text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Solana CLI</p>
                <p className="text-xs text-gray-400">
                  Version {config.solanaVersion} installed
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
              <div className="p-1.5 rounded-full bg-white/10">
                <CheckCircle2 size={18} className="text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Rust Compiler</p>
                <p className="text-xs text-gray-400">
                  Version {config.rustVersion} installed
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5">
              <div className="p-1.5 rounded-full bg-white/10">
                <CheckCircle2 size={18} className="text-green-500" />
              </div>
              <div>
                <p className="text-sm font-medium">Node.js</p>
                <p className="text-xs text-gray-400">
                  Version 18.x installed
                </p>
              </div>
            </div>
          </div>
          
          {!config.anchorInstalled && (
            <div className="mt-4 p-3 rounded-lg bg-amber-500/10 text-sm">
              <p className="font-medium text-amber-400 mb-1">Installation Required</p>
              <p className="text-gray-300 mb-2">
                You need to install Anchor CLI to build and deploy contracts. Use the following command:
              </p>
              <div className="bg-black/30 p-2 rounded font-mono text-xs mb-2">
                cargo install --git https://github.com/coral-xyz/anchor avm --locked
              </div>
              <a 
                href="https://www.anchor-lang.com/docs/installation" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-400 hover:underline text-xs"
              >
                View installation guide <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AnchorStatusCard;
