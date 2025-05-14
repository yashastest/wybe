
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  FileCode,
  BarChart3,
  Package,
  Plus,
  ArrowRight,
  RefreshCcw,
  Code,
  Copy,
  ExternalLink,
  CheckCircle,
  Info
} from "lucide-react";
import { smartContractService } from "@/services/smartContractService";
import { useNavigate } from 'react-router-dom';

const SmartContractDashboard = () => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    loadContracts();
  }, []);
  
  const loadContracts = () => {
    setIsLoading(true);
    
    // Load contracts from the service
    setTimeout(() => {
      const contracts = smartContractService.getDeployedContracts();
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
  
  const handleDeployContract = () => {
    navigate('/admin/deployment');
  };
  
  const handleViewContract = (contract: any) => {
    // This would typically open contract details in a modal or new page
    console.log("View contract:", contract);
    toast.info(`Viewing contract ${contract.name}`);
  };
  
  const handleViewTestnetContracts = () => {
    navigate('/admin/testnet');
  };
  
  const getContractStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'deprecated':
        return 'text-red-400 bg-red-500/10 border-red-500/30';
      case 'pending':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-gray-400 bg-white/10 border-white/30';
    }
  };
  
  const filteredContracts = contracts.filter(contract => 
    contract.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.programId?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Stats calculation
  const totalContracts = contracts.length;
  const activeContracts = contracts.filter(c => c.status === 'active').length;
  const mainnetContracts = contracts.filter(c => c.network === 'mainnet').length;
  const testnetContracts = contracts.filter(c => c.network === 'testnet').length;
  
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
            Smart Contracts
          </h2>
          <p className="text-gray-400 text-sm">
            Manage and monitor your deployed smart contracts
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="h-9 text-xs" 
            onClick={handleViewTestnetContracts}
          >
            <Package size={14} className="mr-1" />
            Testnet Contracts
          </Button>
          
          <Button 
            className="bg-orange-500 hover:bg-orange-600 h-9 text-xs" 
            onClick={handleDeployContract}
          >
            <Plus size={14} className="mr-1" />
            Deploy New Contract
          </Button>
        </div>
      </div>
      
      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="glass-card border-wybe-primary/20 bg-gradient-to-br from-purple-500/10 to-transparent">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-400">Total Contracts</p>
              <FileCode size={18} className="text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold">{totalContracts}</h3>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-wybe-primary/20 bg-gradient-to-br from-green-500/10 to-transparent">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-400">Active Contracts</p>
              <CheckCircle size={18} className="text-green-400" />
            </div>
            <h3 className="text-2xl font-bold">{activeContracts}</h3>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-wybe-primary/20 bg-gradient-to-br from-blue-500/10 to-transparent">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-400">Mainnet Contracts</p>
              <BarChart3 size={18} className="text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold">{mainnetContracts}</h3>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-wybe-primary/20 bg-gradient-to-br from-amber-500/10 to-transparent">
          <CardContent className="pt-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-400">Testnet Contracts</p>
              <Code size={18} className="text-amber-400" />
            </div>
            <h3 className="text-2xl font-bold">{testnetContracts}</h3>
          </CardContent>
        </Card>
      </div>
      
      {/* Contract Search */}
      <div className="glass-card border-wybe-primary/20 p-4 mb-6">
        <div className="flex gap-2">
          <Input
            placeholder="Search by name or program ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-black/20"
          />
          <Button 
            variant="outline" 
            className="w-10 px-0 h-10 flex items-center justify-center"
            onClick={loadContracts}
          >
            <RefreshCcw size={16} className={isLoading ? 'animate-spin' : ''} />
          </Button>
        </div>
      </div>
      
      {/* Contracts List */}
      {isLoading ? (
        <div className="flex justify-center p-20">
          <RefreshCcw size={24} className="animate-spin text-wybe-primary" />
        </div>
      ) : (
        <div>
          {filteredContracts.length > 0 ? (
            <div className="space-y-4">
              {filteredContracts.map((contract, index) => (
                <Card 
                  key={index} 
                  className="glass-card border-wybe-primary/20 hover:bg-white/5 transition-colors overflow-hidden"
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-medium">{contract.name}</h3>
                          <Badge 
                            variant="outline" 
                            className={getContractStatusColor(contract.status)}
                          >
                            {contract.status}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className="bg-blue-500/10 text-blue-400 border-blue-500/30"
                          >
                            {contract.network}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-4">
                          <p className="text-sm font-mono text-gray-400">
                            {`${contract.programId.substring(0, 8)}...${contract.programId.substring(
                              contract.programId.length - 8
                            )}`}
                          </p>
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
                          <a
                            href={`https://solscan.io/account/${contract.programId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400"
                          >
                            <ExternalLink size={14} />
                          </a>
                        </div>
                        
                        <div className="text-sm text-gray-400">
                          Deployed on: {contract.deploymentDate ? new Date(contract.deploymentDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 md:self-end">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleViewContract(contract)}
                          className="text-xs h-8"
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="orange" 
                          size="sm"
                          className="text-xs h-8"
                          onClick={handleDeployContract}
                        >
                          <ArrowRight size={12} className="mr-1" />
                          Deploy Again
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="glass-card border-wybe-primary/20 text-center py-16">
              <CardContent>
                <FileCode size={48} className="mx-auto mb-4 text-gray-500 opacity-20" />
                <h3 className="text-lg font-medium mb-2">No Contracts Found</h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm ? "No contracts match your search criteria." : "You don't have any deployed contracts yet."}
                </p>
                <Button
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={handleDeployContract}
                >
                  <Plus size={16} className="mr-2" />
                  Deploy Your First Contract
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      {/* Help Section */}
      {!isLoading && filteredContracts.length > 0 && (
        <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm flex gap-2">
          <Info size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-blue-400 font-medium">Need help with your contracts?</p>
            <p className="text-gray-300 mt-1">
              Visit the <a className="text-blue-400 hover:underline" href="#" onClick={() => navigate('/admin/guide')}>Master Deployment Guide</a> for 
              detailed instructions on deploying, upgrading, and managing your contracts, or go to 
              the <a className="text-blue-400 hover:underline" href="#" onClick={() => navigate('/admin/testnet')}>Testnet Contracts</a> page to see your test deployments.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SmartContractDashboard;
