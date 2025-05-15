
import React, { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CodeIcon, FileCode2, Code2, Cpu, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { smartContractService, DeployedContract } from '@/services/smartContractService';
import { toast } from 'sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const SmartContractDashboard: React.FC = () => {
  const [contracts, setContracts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    loadDeployedContracts();
  }, []);
  
  const loadDeployedContracts = async () => {
    try {
      setIsLoading(true);
      const deployedContracts = await smartContractService.getDeployedContracts();
      setContracts(deployedContracts);
    } catch (error) {
      console.error("Error loading deployed contracts:", error);
      toast.error("Failed to load deployed contracts");
    } finally {
      setIsLoading(false);
    }
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'deprecated':
        return <Badge variant="outline" className="text-yellow-500 border-yellow-500">Deprecated</Badge>;
      case 'testing':
        return <Badge variant="outline" className="text-blue-500 border-blue-500">Testing</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  return (
    <>
      <div className="space-y-6">
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <h3 className="text-lg font-semibold flex items-center">
              <FileCode2 className="mr-2 text-orange-500" size={20} />
              Deployed Contracts
            </h3>
            <div className="flex space-x-2">
              <Badge variant="outline" className="border-orange-500 text-orange-500">
                mainnet
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-pulse">Loading contracts...</div>
              </div>
            ) : contracts.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Program ID</TableHead>
                      <TableHead>Version</TableHead>
                      <TableHead>Deployment Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contracts.map((contract, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{contract.name}</TableCell>
                        <TableCell className="font-mono text-xs">{contract.programId}</TableCell>
                        <TableCell>{contract.version}</TableCell>
                        <TableCell>
                          {new Date(contract.deploymentDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(contract.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No mainnet contracts deployed
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SmartContractDashboard;
