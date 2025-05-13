
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  FileCode2, 
  Download, 
  Copy, 
  CheckCircle2, 
  ArrowRight,
  FileCog,
  Globe,
  Terminal,
  Link,
  Save,
  Edit,
  X
} from "lucide-react";
import { toast } from "sonner";
import SmartContractSteps from "@/components/SmartContractSteps";

const SmartContractDashboard = () => {
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState({
    tokenContract: false,
    bondingCurveContract: false,
    treasuryContract: false
  });
  
  // Sample contract data with state for editing
  const [contractData, setContractData] = useState({
    tokenContract: "FG9SYnttGJKQsHqNPZhwGVkzkJEGnY8kaySvbSSNYNtw",
    bondingCurveContract: "Hj9R5Tender3SbKgX1CnUAaTPyYyXU23WgfST1KFsPJE",
    treasuryContract: "3gF2KHp6KkE2HUMvhiL9aVyvyWpBJ2Pu2fGwFeJXdPSS",
  });

  const [tempContractData, setTempContractData] = useState({...contractData});

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Copied to clipboard");
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const downloadContract = (type) => {
    toast.success(`${type} contract downloaded`);
  };

  const toggleEditMode = (contractType) => {
    if (editMode[contractType]) {
      // If saving changes
      setContractData({...contractData, [contractType]: tempContractData[contractType]});
      toast.success(`${contractType} address updated successfully`);
      // Here you would typically make an API call to update the contract address in the backend
    } else {
      // If entering edit mode
      setTempContractData({...contractData});
    }

    setEditMode({...editMode, [contractType]: !editMode[contractType]});
  };

  const handleInputChange = (contractType, value) => {
    setTempContractData({...tempContractData, [contractType]: value});
  };

  const cancelEdit = (contractType) => {
    setEditMode({...editMode, [contractType]: false});
    setTempContractData({...contractData});
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className="space-y-6"
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 }
        }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <FileCode2 className="text-orange-500" size={24} />
          Smart Contract Management
        </h2>

        <Tabs defaultValue="contracts">
          <TabsList className="mb-6">
            <TabsTrigger value="contracts" className="flex items-center gap-2">
              <FileCog size={16} />
              Deployed Contracts
            </TabsTrigger>
            <TabsTrigger value="implementation" className="flex items-center gap-2">
              <Terminal size={16} />
              Implementation
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="contracts" className="space-y-6">
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-lg border border-orange-500/20">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Token Contract</h3>
                  <div className="flex gap-2">
                    {!editMode.tokenContract ? (
                      <>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="bg-wybe-background/50 border-orange-500/20 h-8"
                          onClick={() => copyToClipboard(contractData.tokenContract)}
                        >
                          {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                          <span className="ml-1">Copy</span>
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="bg-wybe-background/50 border-orange-500/20 h-8"
                          onClick={() => downloadContract('Token')}
                        >
                          <Download size={14} />
                          <span className="ml-1">Download</span>
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-blue-600 h-8 hover:bg-blue-700"
                          onClick={() => toggleEditMode('tokenContract')}
                        >
                          <Edit size={14} />
                          <span className="ml-1">Edit</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          size="sm"
                          className="bg-red-600 h-8 hover:bg-red-700"
                          onClick={() => cancelEdit('tokenContract')}
                        >
                          <X size={14} />
                          <span className="ml-1">Cancel</span>
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-green-600 h-8 hover:bg-green-700"
                          onClick={() => toggleEditMode('tokenContract')}
                        >
                          <Save size={14} />
                          <span className="ml-1">Save</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                {!editMode.tokenContract ? (
                  <div className="p-3 bg-black/30 rounded text-sm font-mono overflow-x-auto">
                    <a
                      href={`https://solscan.io/token/${contractData.tokenContract}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:underline flex items-center gap-1"
                    >
                      {contractData.tokenContract}
                      <Link size={14} />
                    </a>
                  </div>
                ) : (
                  <Input 
                    value={tempContractData.tokenContract}
                    onChange={(e) => handleInputChange('tokenContract', e.target.value)}
                    className="bg-black/30 text-orange-500 font-mono text-sm"
                  />
                )}
              </div>
              
              <div className="bg-white/5 p-4 rounded-lg border border-orange-500/20">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Bonding Curve Contract</h3>
                  <div className="flex gap-2">
                    {!editMode.bondingCurveContract ? (
                      <>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="bg-wybe-background/50 border-orange-500/20 h-8"
                          onClick={() => copyToClipboard(contractData.bondingCurveContract)}
                        >
                          {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                          <span className="ml-1">Copy</span>
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="bg-wybe-background/50 border-orange-500/20 h-8"
                          onClick={() => downloadContract('Bonding Curve')}
                        >
                          <Download size={14} />
                          <span className="ml-1">Download</span>
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-blue-600 h-8 hover:bg-blue-700"
                          onClick={() => toggleEditMode('bondingCurveContract')}
                        >
                          <Edit size={14} />
                          <span className="ml-1">Edit</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          size="sm"
                          className="bg-red-600 h-8 hover:bg-red-700"
                          onClick={() => cancelEdit('bondingCurveContract')}
                        >
                          <X size={14} />
                          <span className="ml-1">Cancel</span>
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-green-600 h-8 hover:bg-green-700"
                          onClick={() => toggleEditMode('bondingCurveContract')}
                        >
                          <Save size={14} />
                          <span className="ml-1">Save</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                {!editMode.bondingCurveContract ? (
                  <div className="p-3 bg-black/30 rounded text-sm font-mono overflow-x-auto">
                    <a
                      href={`https://solscan.io/account/${contractData.bondingCurveContract}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:underline flex items-center gap-1"
                    >
                      {contractData.bondingCurveContract}
                      <Link size={14} />
                    </a>
                  </div>
                ) : (
                  <Input 
                    value={tempContractData.bondingCurveContract}
                    onChange={(e) => handleInputChange('bondingCurveContract', e.target.value)}
                    className="bg-black/30 text-orange-500 font-mono text-sm"
                  />
                )}
              </div>
              
              <div className="bg-white/5 p-4 rounded-lg border border-orange-500/20">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium">Treasury Contract</h3>
                  <div className="flex gap-2">
                    {!editMode.treasuryContract ? (
                      <>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="bg-wybe-background/50 border-orange-500/20 h-8"
                          onClick={() => copyToClipboard(contractData.treasuryContract)}
                        >
                          {copied ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                          <span className="ml-1">Copy</span>
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="bg-wybe-background/50 border-orange-500/20 h-8"
                          onClick={() => downloadContract('Treasury')}
                        >
                          <Download size={14} />
                          <span className="ml-1">Download</span>
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-blue-600 h-8 hover:bg-blue-700"
                          onClick={() => toggleEditMode('treasuryContract')}
                        >
                          <Edit size={14} />
                          <span className="ml-1">Edit</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          size="sm"
                          className="bg-red-600 h-8 hover:bg-red-700"
                          onClick={() => cancelEdit('treasuryContract')}
                        >
                          <X size={14} />
                          <span className="ml-1">Cancel</span>
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-green-600 h-8 hover:bg-green-700"
                          onClick={() => toggleEditMode('treasuryContract')}
                        >
                          <Save size={14} />
                          <span className="ml-1">Save</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                {!editMode.treasuryContract ? (
                  <div className="p-3 bg-black/30 rounded text-sm font-mono overflow-x-auto">
                    <a
                      href={`https://solscan.io/account/${contractData.treasuryContract}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 hover:underline flex items-center gap-1"
                    >
                      {contractData.treasuryContract}
                      <Link size={14} />
                    </a>
                  </div>
                ) : (
                  <Input 
                    value={tempContractData.treasuryContract}
                    onChange={(e) => handleInputChange('treasuryContract', e.target.value)}
                    className="bg-black/30 text-orange-500 font-mono text-sm"
                  />
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Contract Statistics</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Deployments</span>
                    <span>247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Contracts</span>
                    <span>231</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Trading Volume</span>
                    <span>4.2M SOL</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fee Collected</span>
                    <span>105,000 SOL</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/5 p-4 rounded-lg">
                <h3 className="font-medium mb-3">Recent Deployments</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Pepe Solana</p>
                      <p className="text-xs text-gray-400">2 days ago</p>
                    </div>
                    <Button size="sm" variant="outline" className="h-8">
                      View
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Doge Sol</p>
                      <p className="text-xs text-gray-400">3 days ago</p>
                    </div>
                    <Button size="sm" variant="outline" className="h-8">
                      View
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Floki Fortune</p>
                      <p className="text-xs text-gray-400">5 days ago</p>
                    </div>
                    <Button size="sm" variant="outline" className="h-8">
                      View
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="implementation">
            <SmartContractSteps className="glass-card" />
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default SmartContractDashboard;
