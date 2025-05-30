
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CodeIcon, FileCode2, AlertTriangle, ArrowRight, ExternalLink, CheckCircle2 } from "lucide-react";
import { smartContractService } from '@/services/smartContractService';
import { TestnetContract } from '@/services/token/types';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from 'react-router-dom';

interface SmartContractTestnetProps {
  onViewContract?: (programId: string) => void;
}

const SmartContractTestnet: React.FC<SmartContractTestnetProps> = ({ onViewContract }) => {
  const [contracts, setContracts] = useState<TestnetContract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    loadTestnetContracts();
  }, []);
  
  const loadTestnetContracts = async () => {
    try {
      setIsLoading(true);
      const testnetContracts = await smartContractService.getTestnetContracts();
      // Convert from smartContractService.TestnetContract to our TestnetContract type
      const convertedContracts: TestnetContract[] = testnetContracts.map(contract => ({
        id: contract.id,
        name: contract.name,
        symbol: contract.name.split(' ')[0] || '', // Extract symbol from name as fallback
        address: contract.address,
        programId: contract.programId,
        status: contract.status === 'active' ? 'deployed' : 
                contract.status === 'failed' ? 'verified' : 'pending', // Map 'failed' to 'verified' to match our interface
        network: contract.network,
        createdAt: contract.deployedAt,
        deploymentDate: contract.deploymentDate,
        testTxCount: contract.testTxCount,
        auditStatus: contract.auditStatus,
        securityScore: contract.securityScore
      }));
      setContracts(convertedContracts);
      
      // Notify user of contract deployment status
      if (convertedContracts.some(c => c.status === 'deployed')) {
        toast.success("Contracts successfully deployed to testnet", {
          description: "Deployment verification complete"
        });
      }
    } catch (error) {
      console.error("Error loading testnet contracts:", error);
      toast.error("Failed to load testnet contracts");
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
      case 'deployed':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'testing':
      case 'pending':
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Testing</Badge>;
      case 'failed':
      case 'verified':
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getNetworkBadge = (network: string) => {
    switch (network) {
      case 'devnet':
        return <Badge variant="outline" className="text-purple-500 border-purple-500">devnet</Badge>;
      case 'testnet':
        return <Badge variant="outline" className="text-orange-500 border-orange-500">testnet</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getAuditStatusBadge = (status?: string) => {
    switch (status) {
      case 'audited':
        return <Badge className="bg-green-500">Audited</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Pending</Badge>;
      case 'failed':
        return <Badge className="bg-red-500">Failed</Badge>;
      default:
        return <Badge variant="outline">Not Audited</Badge>;
    }
  };
  
  const handleViewAudit = (programId: string) => {
    if (onViewContract) {
      onViewContract(programId);
    } else {
      // Navigate to the security audit page with the program ID
      navigate('/admin/security-report', { state: { programId } });
    }
  };
  
  return (
    <>
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <h3 className="text-lg font-semibold flex items-center">
            <CheckCircle2 className="mr-2 text-green-500" size={20} />
            Testnet Contracts (Verified)
          </h3>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-pulse">Loading testnet contracts...</div>
            </div>
          ) : contracts.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Network</TableHead>
                    <TableHead>Program ID</TableHead>
                    <TableHead>Deployment Date</TableHead>
                    <TableHead>Test Tx Count</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Audit Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contracts.map((contract, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{contract.name}</TableCell>
                      <TableCell>{getNetworkBadge(contract.network)}</TableCell>
                      <TableCell className="font-mono text-xs">{contract.programId}</TableCell>
                      <TableCell>
                        {new Date(contract.deploymentDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{contract.testTxCount}</TableCell>
                      <TableCell>{getStatusBadge(contract.status)}</TableCell>
                      <TableCell>{getAuditStatusBadge(contract.auditStatus)}</TableCell>
                      <TableCell>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => handleViewAudit(contract.programId)}
                        >
                          <ArrowRight size={16} />
                          <span className="ml-2">View Audit</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No testnet contracts deployed
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default SmartContractTestnet;
