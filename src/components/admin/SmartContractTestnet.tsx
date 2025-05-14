import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  FileCode2, 
  Check, 
  ArrowUpRight, 
  Settings, 
  BarChart4, 
  ChevronRight, 
  ExternalLink, 
  Code, 
  Copy,
  Edit,
  Trash2,
  Plus,
  Save,
  XCircle,
  AlertTriangle,
  RefreshCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

import { smartContractService } from "@/services/smartContractService";
import { integrationService } from "@/services/integrationService";
import type { TestnetContract } from "@/services/integrationService";

const SmartContractTestnet = () => {
  const navigate = useNavigate();
  const [testnetContracts, setTestnetContracts] = useState<TestnetContract[]>([]);
  const [copiedText, setCopiedText] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newContract, setNewContract] = useState<Omit<TestnetContract, 'id'>>({
    name: "",
    programId: "",
    network: "testnet",
    deployDate: new Date().toISOString().split('T')[0],
    txHash: "",
    status: "pending"
  });
  const [editingContractId, setEditingContractId] = useState<string | null>(null);
  const [editedContract, setEditedContract] = useState<TestnetContract | null>(null);
  const [isDeletingContractId, setIsDeletingContractId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importData, setImportData] = useState<string>('');
  const [isExporting, setIsExporting] = useState(false);
  const [isImportValid, setIsImportValid] = useState(true);
  const [isImportingSample, setIsImportingSample] = useState(false);
  
  useEffect(() => {
    loadTestnetContracts();
  }, []);
  
  const loadTestnetContracts = () => {
    const contracts = integrationService.getTestnetContracts();
    setTestnetContracts([...contracts]); // Create a new array to ensure state update
  };
  
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedText(text);
      toast.success(`${type} copied to clipboard!`);
      
      // Reset copy state after 2 seconds
      setTimeout(() => {
        setCopiedText("");
      }, 2000);
    });
  };
  
  const handleGoToDeploymentEnvironment = () => {
    navigate('/admin/deployment');
  };
  
  const handleViewDeploymentGuide = () => {
    // Using data-tab attribute to trigger the tab change in Admin.tsx
    const guideTabBtn = document.querySelector('[data-tab="guide"]');
    if (guideTabBtn) {
      (guideTabBtn as HTMLElement).click();
    } else {
      // Fallback in case the button isn't found
      const event = new CustomEvent('guide-tab-request');
      document.dispatchEvent(event);
      // Set the activeTab in localStorage to be picked up by Admin component  
      localStorage.setItem('admin-active-tab', 'guide');
    }
  };
  
  const handleStatusChange = (contractId: string, status: TestnetContract['status']) => {
    integrationService.updateTestnetContract(contractId, { status });
    loadTestnetContracts();
    toast.success(`Contract status updated to ${status}`);
  };
  
  const handleAddNewContract = () => {
    setIsAddingNew(true);
  };
  
  const handleSaveNewContract = () => {
    if (!newContract.name || !newContract.programId) {
      toast.error("Name and Program ID are required");
      return;
    }
    
    const success = integrationService.addTestnetContract(newContract);
    if (success) {
      loadTestnetContracts();
      setIsAddingNew(false);
      setNewContract({
        name: "",
        programId: "",
        network: "testnet",
        deployDate: new Date().toISOString().split('T')[0],
        txHash: "",
        status: "pending"
      });
      toast.success("Contract added successfully");
    } else {
      toast.error("Failed to add contract");
    }
  };
  
  const handleCancelNewContract = () => {
    setIsAddingNew(false);
    setNewContract({
      name: "",
      programId: "",
      network: "testnet",
      deployDate: new Date().toISOString().split('T')[0],
      txHash: "",
      status: "pending"
    });
  };
  
  const handleEditContract = (contractId: string) => {
    const contract = integrationService.getTestnetContract(contractId);
    if (contract) {
      setEditingContractId(contractId);
      setEditedContract({ ...contract });
    }
  };
  
  const handleSaveEditedContract = () => {
    if (!editedContract || !editingContractId) return;
    
    // Make a copy to avoid type issues
    const updatedContract = { ...editedContract };
    
    const success = integrationService.updateTestnetContract(editingContractId, updatedContract);
    if (success) {
      loadTestnetContracts();
      setEditingContractId(null);
      setEditedContract(null);
      toast.success("Contract updated successfully");
    } else {
      toast.error("Failed to update contract");
    }
  };
  
  const handleCancelEditContract = () => {
    setEditingContractId(null);
    setEditedContract(null);
  };
  
  const handleDeleteContract = (contractId: string) => {
    setIsDeletingContractId(contractId);
  };
  
  const confirmDeleteContract = async () => {
    if (!isDeletingContractId) return;
    
    setIsDeleting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const success = integrationService.deleteTestnetContract(isDeletingContractId);
      if (success) {
        loadTestnetContracts();
        toast.success("Contract deleted successfully");
      } else {
        toast.error("Failed to delete contract");
      }
    } catch (error) {
      toast.error("Failed to delete contract");
    } finally {
      setIsDeleting(false);
      setIsDeletingContractId(null);
    }
  };
  
  const cancelDeleteContract = () => {
    setIsDeletingContractId(null);
  };
  
  const handleImportContracts = () => {
    setIsImporting(true);
  };
  
  const handleExportContracts = () => {
    setIsExporting(true);
    
    // Prepare data for export
    const dataStr = JSON.stringify(testnetContracts, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    // Create a temporary link and trigger the download
    const exportFileName = 'testnet_contracts.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
    
    setIsExporting(false);
  };
  
  const handleImportDataChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setImportData(e.target.value);
    try {
      JSON.parse(e.target.value);
      setIsImportValid(true);
    } catch (error) {
      setIsImportValid(false);
    }
  };
  
  const handleImportSubmit = () => {
    if (!isImportValid) {
      toast.error("Invalid JSON format");
      return;
    }
    
    try {
      const importedContracts = JSON.parse(importData) as TestnetContract[];
      
      if (!Array.isArray(importedContracts)) {
        throw new Error("Import data must be an array of contracts");
      }
      
      // Validate each contract
      for (const contract of importedContracts) {
        if (!contract.name || !contract.programId || !contract.network || !contract.deployDate) {
          throw new Error("Invalid contract format");
        }
      }
      
      // Import contracts
      const success = integrationService.importTestnetContracts(importedContracts);
      if (success) {
        loadTestnetContracts();
        setIsImporting(false);
        setImportData('');
        toast.success("Contracts imported successfully");
      } else {
        toast.error("Failed to import contracts");
      }
    } catch (error: any) {
      toast.error(`Failed to import contracts: ${error.message}`);
    }
  };
  
  const handleCancelImport = () => {
    setIsImporting(false);
    setImportData('');
  };
  
  const handleImportSample = () => {
    setIsImportingSample(true);
    
    const sampleData = JSON.stringify([
      {
        "name": "Sample Token 1",
        "programId": "WybSample1111111111111111111111111111111",
        "network": "testnet",
        "deployDate": "2024-01-01",
        "txHash": "tx_sample1",
        "status": "active"
      },
      {
        "name": "Sample Token 2",
        "programId": "WybSample2222222222222222222222222222222",
        "network": "testnet",
        "deployDate": "2024-01-05",
        "txHash": "tx_sample2",
        "status": "pending"
      }
    ], null, 2);
    
    setImportData(sampleData);
    setIsImportValid(true);
    toast.info("Sample data loaded. Please review and submit.");
  };
  
  const handleCancelImportSample = () => {
    setIsImportingSample(false);
    setImportData('');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-poppins flex items-center">
            <FileCode2 className="mr-2 text-orange-500" size={22} />
            Testnet Contracts
          </h2>
          <p className="text-gray-400 mt-1">Manage and monitor deployed contracts on the testnet</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            onClick={handleGoToDeploymentEnvironment} 
            variant="outline" 
            className="flex items-center gap-2 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
          >
            <Code size={14} />
            Deployment Environment
          </Button>
          <Button 
            onClick={handleAddNewContract} 
            variant="orange" 
            className="flex items-center gap-2"
          >
            <Plus size={14} />
            Add New Contract
          </Button>
        </div>
      </div>
      
      <div className="glass-card p-5 border-wybe-primary/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold font-poppins flex items-center">
            Deployed Contracts
          </h3>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs border-wybe-primary/30 text-wybe-primary hover:bg-wybe-primary/10"
              onClick={handleViewDeploymentGuide}
            >
              Deployment Guide
              <ArrowUpRight size={12} className="ml-1" />
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs border-green-500/30 text-green-400 hover:bg-green-500/10"
              onClick={handleExportContracts}
              disabled={isExporting}
            >
              {isExporting ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <ArrowUpRight size={12} className="mr-1" />
                  Export Contracts
                </>
              )}
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              className="text-xs border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
              onClick={handleImportContracts}
            >
              <ArrowUpRight size={12} className="mr-1" />
              Import Contracts
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-400 border-b border-white/10">
                <th className="pb-2 font-medium">Token</th>
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Transaction</th>
                <th className="pb-2 font-medium">Program ID</th>
                <th className="pb-2 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {testnetContracts.map((contract, index) => (
                <tr key={contract.id} className="border-b border-white/5">
                  <td className="py-3">
                    <div>
                      <div className="font-medium">{contract.name}</div>
                      <div className="text-sm text-gray-400">{contract.network}</div>
                    </div>
                  </td>
                  <td className="py-3 text-sm">{contract.deployDate}</td>
                  <td className="py-3">
                    {editingContractId === contract.id ? (
                      <Select 
                        value={editedContract?.status} 
                        onValueChange={(value) => setEditedContract(prev => ({ ...prev as TestnetContract, status: value as "active" | "inactive" | "pending" | "failed" }))}
                      >
                        <SelectTrigger className="bg-black/30 w-[120px]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge 
                        variant={contract.status === 'active' ? 'default' : contract.status === 'pending' ? 'outline' : 'destructive'}
                        className={
                          contract.status === 'active' 
                            ? 'bg-green-500/80' 
                            : contract.status === 'pending' 
                              ? 'border-amber-500 text-amber-500' 
                              : 'bg-red-500/80'
                        }
                      >
                        {contract.status === 'active' && <Check size={12} className="mr-1" />}
                        {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                      </Badge>
                    )}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center">
                      <span className="font-mono text-xs">{contract.txHash}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-1 h-6 w-6 p-0"
                        onClick={() => copyToClipboard(contract.txHash, "Transaction Hash")}
                      >
                        {copiedText === contract.txHash ? <Check size={12} /> : <Copy size={12} />}
                      </Button>
                    </div>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center">
                      <span className="font-mono text-xs">{contract.programId}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="ml-1 h-6 w-6 p-0"
                        onClick={() => copyToClipboard(contract.programId, "Program ID")}
                      >
                        {copiedText === contract.programId ? <Check size={12} /> : <Copy size={12} />}
                      </Button>
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    {editingContractId === contract.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-green-500" onClick={handleSaveEditedContract}>
                          <Save size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-400" onClick={handleCancelEditContract}>
                          <XCircle size={14} />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-400" onClick={() => handleEditContract(contract.id)}>
                          <Edit size={14} />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-red-500" onClick={() => handleDeleteContract(contract.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {testnetContracts.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <FileCode2 className="mx-auto mb-2 opacity-20" size={40} />
              <p>No deployed contracts found</p>
            </div>
          )}
        </div>
      </div>
      
      {isAddingNew && (
        <Card className="glass-card border-wybe-primary/20">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Add New Contract</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contract-name">Contract Name</Label>
              <Input
                id="contract-name"
                placeholder="e.g. MyToken"
                value={newContract.name}
                onChange={(e) => setNewContract({ ...newContract, name: e.target.value })}
                className="bg-black/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="program-id">Program ID</Label>
              <Input
                id="program-id"
                placeholder="e.g. WybToken123..."
                value={newContract.programId}
                onChange={(e) => setNewContract({ ...newContract, programId: e.target.value })}
                className="bg-black/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="network">Network</Label>
              <Select 
                value={newContract.network} 
                onValueChange={(value) => setNewContract({ ...newContract, network: value as "testnet" | "devnet" | "localnet" | "mainnet" })}
              >
                <SelectTrigger className="bg-black/30">
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="testnet">Testnet</SelectItem>
                  <SelectItem value="devnet">Devnet</SelectItem>
                  <SelectItem value="localnet">Local Development</SelectItem>
                  <SelectItem value="mainnet">Mainnet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deploy-date">Deploy Date</Label>
              <Input
                type="date"
                id="deploy-date"
                value={newContract.deployDate}
                onChange={(e) => setNewContract({ ...newContract, deployDate: e.target.value })}
                className="bg-black/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tx-hash">Transaction Hash</Label>
              <Input
                id="tx-hash"
                placeholder="e.g. tx_123abc..."
                value={newContract.txHash}
                onChange={(e) => setNewContract({ ...newContract, txHash: e.target.value })}
                className="bg-black/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={newContract.status} 
                onValueChange={(value) => setNewContract({ ...newContract, status: value as "active" | "inactive" | "pending" | "failed" })}
              >
                <SelectTrigger className="bg-black/30">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={handleCancelNewContract}>Cancel</Button>
              <Button onClick={handleSaveNewContract}>Save</Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {editingContractId && editedContract && (
        <Card className="glass-card border-wybe-primary/20">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Edit Contract</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="contract-name">Contract Name</Label>
              <Input
                id="contract-name"
                placeholder="e.g. MyToken"
                value={editedContract.name}
                onChange={(e) => setEditedContract({ ...editedContract, name: e.target.value })}
                className="bg-black/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="program-id">Program ID</Label>
              <Input
                id="program-id"
                placeholder="e.g. WybToken123..."
                value={editedContract.programId}
                onChange={(e) => setEditedContract({ ...editedContract, programId: e.target.value })}
                className="bg-black/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="network">Network</Label>
              <Select 
                value={editedContract.network} 
                onValueChange={(value) => setEditedContract({ ...editedContract, network: value as "testnet" | "devnet" | "localnet" | "mainnet" })}
              >
                <SelectTrigger className="bg-black/30">
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="testnet">Testnet</SelectItem>
                  <SelectItem value="devnet">Devnet</SelectItem>
                  <SelectItem value="localnet">Local Development</SelectItem>
                  <SelectItem value="mainnet">Mainnet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="deploy-date">Deploy Date</Label>
              <Input
                type="date"
                id="deploy-date"
                value={editedContract.deployDate}
                onChange={(e) => setEditedContract({ ...editedContract, deployDate: e.target.value })}
                className="bg-black/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tx-hash">Transaction Hash</Label>
              <Input
                id="tx-hash"
                placeholder="e.g. tx_123abc..."
                value={editedContract.txHash}
                onChange={(e) => setEditedContract({ ...editedContract, txHash: e.target.value })}
                className="bg-black/30"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={handleCancelEditContract}>Cancel</Button>
              <Button onClick={handleSaveEditedContract}>Save</Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {isDeletingContractId && (
        <Alert variant="destructive" className="glass-card border-red-500/50">
          <AlertTitle className="flex items-center">
            <AlertTriangle className="mr-2" size={18} />
            Are you sure you want to delete this contract?
          </AlertTitle>
          <AlertDescription>
            This action cannot be undone.
          </AlertDescription>
          <div className="flex justify-end space-x-2 mt-4">
            <Button 
              variant="destructive" 
              className="bg-red-500/90 hover:bg-red-600"
              disabled={isDeleting}
              onClick={confirmDeleteContract}
            >
              {isDeleting ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : "Delete"}
            </Button>
            <Button 
              variant="outline" 
              onClick={cancelDeleteContract}
            >
              Cancel
            </Button>
          </div>
        </Alert>
      )}
      
      {isImporting && (
        <Card className="glass-card border-wybe-primary/20">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Import Contracts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="default">
              <AlertTitle>Instructions</AlertTitle>
              <AlertDescription>
                Paste your JSON data below. Ensure it is a valid array of contract objects.
              </AlertDescription>
            </Alert>
            <div className="space-y-2">
              <Label htmlFor="import-data">Import Data</Label>
              <textarea
                id="import-data"
                placeholder="Paste your JSON data here"
                value={importData}
                onChange={(e) => handleImportDataChange(e)}
                className="bg-black/30 min-h-[150px] font-mono text-xs w-full rounded-md border border-input p-2"
              />
              {!isImportValid && (
                <p className="text-red-500 text-sm">Invalid JSON format</p>
              )}
            </div>
            <div className="flex justify-between">
              <Button 
                variant="ghost" 
                onClick={handleImportSample}
                disabled={isImportingSample}
              >
                {isImportingSample ? (
                  <>
                    <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                    Loading Sample...
                  </>
                ) : "Load Sample"}
              </Button>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={handleCancelImport}>Cancel</Button>
                <Button onClick={handleImportSubmit} disabled={!isImportValid}>Import</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default SmartContractTestnet;
