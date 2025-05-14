
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { smartContractService } from "@/services/smartContractService";
import {
  FileCode,
  ArrowUpRight,
  Copy,
  RefreshCcw,
  CheckCircle,
  XCircle,
  ArrowRight
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useNavigate } from 'react-router-dom';

interface TestnetContract {
  name: string;
  programId: string;
  deployDate: string;
  network: string;
  txHash: string;
  status: string;
}

const SmartContractTestnet = () => {
  const [contracts, setContracts] = useState<TestnetContract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContract, setSelectedContract] = useState<TestnetContract | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadContracts();
  }, []);

  const loadContracts = () => {
    setIsLoading(true);
    
    // Load contracts from service
    const contracts = smartContractService.getTestnetContracts();
    
    setTimeout(() => {
      setContracts(contracts);
      setIsLoading(false);
    }, 500);
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast.success("Program ID copied to clipboard");
    
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleRefresh = () => {
    loadContracts();
    toast.success("Contract list refreshed");
  };

  const handleDeployToMainnet = (contract: TestnetContract) => {
    setSelectedContract(contract);
    
    // Redirect to deployment environment page
    navigate('/admin/environment', { 
      state: { contractName: contract.name, programId: contract.programId }
    });
    
    toast.success(`${contract.name} selected for mainnet deployment`, {
      description: "Redirecting to deployment environment"
    });
  };

  const handleNewDeployment = () => {
    navigate('/admin/deployment');
  };

  const filteredContracts = contracts.filter(contract =>
    contract.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    contract.programId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileCode className="text-orange-500" size={22} />
            Testnet Smart Contracts
          </h2>
          <p className="text-gray-400 text-sm">Smart contracts deployed to testnet and ready for production</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="h-9 text-xs" 
            onClick={handleRefresh}
          >
            <RefreshCcw size={14} className="mr-1" />
            Refresh
          </Button>
          
          <Button 
            className="bg-orange-500 hover:bg-orange-600 h-9 text-xs" 
            onClick={handleNewDeployment}
          >
            <FileCode size={14} className="mr-1" />
            Deploy Contract
          </Button>
        </div>
      </div>
      
      <div className="bg-white/5 rounded-lg p-4 mb-6">
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search by name or program ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-black/30"
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-20">
          <RefreshCcw size={24} className="animate-spin text-wybe-primary" />
        </div>
      ) : (
        <div className="glass-card rounded-lg overflow-hidden">
          {filteredContracts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-white/10 hover:bg-white/5">
                  <TableHead className="text-white">Name</TableHead>
                  <TableHead className="text-white">Program ID</TableHead>
                  <TableHead className="text-white">Network</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Deployed</TableHead>
                  <TableHead className="text-right text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContracts.map((contract, index) => (
                  <TableRow 
                    key={index} 
                    className="border-b border-white/10 hover:bg-white/5"
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <FileCode size={14} className="text-orange-500" />
                        {contract.name}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      <div className="flex items-center gap-1">
                        <span>
                          {`${contract.programId.substring(0, 8)}...${contract.programId.substring(
                            contract.programId.length - 8
                          )}`}
                        </span>
                        <button
                          onClick={() => handleCopyId(contract.programId)}
                          className="text-gray-400 hover:text-white"
                        >
                          {copiedId === contract.programId ? (
                            <CheckCircle size={14} className="text-green-500" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                        {contract.network}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {contract.status === 'active' ? (
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                          <span>Active</span>
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                          <span>Inactive</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{contract.deployDate}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs bg-green-500/10 hover:bg-green-500/20 text-green-400 border-green-500/30"
                        onClick={() => handleDeployToMainnet(contract)}
                      >
                        <ArrowUpRight size={12} className="mr-1" />
                        Deploy to Mainnet
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-8 text-center">
              <XCircle size={40} className="mx-auto mb-4 text-gray-500 opacity-20" />
              <p className="text-gray-400">No contracts found</p>
              <p className="text-gray-500 text-sm mt-1">Try deploying a contract first</p>
              <Button
                className="mt-4 bg-orange-500 hover:bg-orange-600"
                onClick={handleNewDeployment}
              >
                <ArrowRight size={14} className="mr-1" />
                Go to Deployment
              </Button>
            </div>
          )}
        </div>
      )}
      
      <div className="mt-8 text-center text-gray-400 text-sm">
        <p>Need help with contract deployment? Visit the <a href="#" className="text-orange-400 hover:underline">Master Deployment Guide</a>.</p>
      </div>
    </motion.div>
  );
};

export default SmartContractTestnet;
