
import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import {
  Users,
  CheckCircle,
  XCircle,
  RefreshCcw,
  Search,
  ExternalLink,
  ChevronRight,
  Filter,
  ArrowUpDown,
  Clock
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Dummy data for approvals
const DUMMY_APPROVALS = [
  {
    id: "app1",
    tokenName: "Pepe Solana",
    tokenSymbol: "PEPES",
    creatorWallet: "So1Pe1234abcdefghijklmnopqrstuvwxyz56789AB",
    requestDate: new Date('2023-05-01').getTime(),
    status: "pending",
    type: "token",
    description: "Pepe-inspired meme token on Solana blockchain.",
    website: "https://pepesolana.io",
    twitter: "@PepeSolana",
    telegram: "@pepe_solana",
    initialSupply: 1000000000,
    creatorFee: 2.5
  },
  {
    id: "app2",
    tokenName: "MoonShot",
    tokenSymbol: "MOON",
    creatorWallet: "So1Mo1234abcdefghijklmnopqrstuvwxyz56789CD",
    requestDate: new Date('2023-05-02').getTime(),
    status: "pending",
    type: "token",
    description: "A token that's going to the moon! Join the rocket ship 🚀",
    website: "https://moonshot.finance",
    twitter: "@MoonShotToken",
    telegram: "@moonshot_community",
    initialSupply: 500000000,
    creatorFee: 3.0
  },
  {
    id: "app3",
    tokenName: "Solana Doge",
    tokenSymbol: "SOLDOGE",
    creatorWallet: "So1Do1234abcdefghijklmnopqrstuvwxyz56789EF",
    requestDate: new Date('2023-05-03').getTime(),
    status: "approved",
    type: "token",
    description: "The Doge community comes to Solana.",
    website: "https://solanadoge.com",
    twitter: "@SolanaDoge",
    telegram: "@solana_doge",
    initialSupply: 2000000000,
    creatorFee: 2.0
  },
  {
    id: "app4",
    tokenName: "Shiba Sol",
    tokenSymbol: "SHISOL",
    creatorWallet: "So1Sh1234abcdefghijklmnopqrstuvwxyz56789GH",
    requestDate: new Date('2023-05-04').getTime(),
    status: "rejected",
    type: "token",
    description: "Shiba Inu token for the Solana ecosystem.",
    website: "https://shibasol.com",
    twitter: "@ShibaSol",
    telegram: "@shiba_sol",
    initialSupply: 1500000000,
    creatorFee: 2.5,
    rejectionReason: "Too similar to existing token"
  },
  {
    id: "app5",
    tokenName: "Solkitty",
    tokenSymbol: "KITTY",
    creatorWallet: "So1Ki1234abcdefghijklmnopqrstuvwxyz56789IJ",
    requestDate: new Date('2023-05-05').getTime(),
    status: "pending",
    type: "token",
    description: "A cute cat-themed token on Solana.",
    website: "https://solkitty.io",
    twitter: "@SolKitty",
    telegram: "@sol_kitty",
    initialSupply: 800000000,
    creatorFee: 3.5
  }
];

const PendingApprovals = () => {
  const [approvals, setApprovals] = useState(DUMMY_APPROVALS);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedApproval, setSelectedApproval] = useState<string | null>(null);
  
  useEffect(() => {
    loadApprovals();
  }, []);
  
  const loadApprovals = () => {
    setIsLoading(true);
    
    // This would normally fetch from an API
    setTimeout(() => {
      setApprovals(DUMMY_APPROVALS);
      setIsLoading(false);
    }, 800);
  };
  
  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
  };
  
  const handleApprove = (id: string) => {
    setApprovals(prev => 
      prev.map(approval => 
        approval.id === id ? { ...approval, status: "approved" } : approval
      )
    );
    
    toast.success("Approval request accepted");
  };
  
  const handleReject = (id: string) => {
    setApprovals(prev => 
      prev.map(approval => 
        approval.id === id ? { ...approval, status: "rejected", rejectionReason: "Rejected by admin" } : approval
      )
    );
    
    toast.success("Approval request rejected");
  };
  
  const toggleApprovalDetails = (id: string) => {
    setSelectedApproval(prev => prev === id ? null : id);
  };
  
  const filteredApprovals = approvals.filter(approval => {
    // Filter by search term
    const matchesSearch = 
      approval.tokenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.tokenSymbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.creatorWallet.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filter by status
    const matchesStatus = 
      statusFilter === 'all' ||
      approval.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  
  // Get status badge style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
            <Clock size={12} className="mr-1" />
            Pending
          </Badge>
        );
      case 'approved':
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
            <CheckCircle size={12} className="mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">
            <XCircle size={12} className="mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Users className="text-orange-500" size={22} />
            Pending Approvals
          </h2>
          <p className="text-gray-400 text-sm">Manage approval requests for tokens and platform features</p>
        </div>
        
        <Button 
          variant="outline" 
          className="h-9 text-xs" 
          onClick={loadApprovals}
          disabled={isLoading}
        >
          <RefreshCcw size={14} className={`mr-1 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>
      
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="glass-card col-span-1 md:col-span-3">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="relative flex-grow">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search by token name, symbol, or creator wallet"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-black/20"
                />
              </div>
              
              <Select
                value={statusFilter}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-40 bg-black/20">
                  <Filter size={14} className="mr-1 text-gray-400" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <p className="text-sm text-gray-400 mb-1">Pending Approvals</p>
              <p className="text-2xl font-bold">
                {approvals.filter(a => a.status === 'pending').length}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Approvals List */}
      {isLoading ? (
        <div className="flex justify-center p-20">
          <RefreshCcw size={24} className="animate-spin text-wybe-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApprovals.length > 0 ? (
            filteredApprovals.map(approval => (
              <Card 
                key={approval.id} 
                className="glass-card border-wybe-primary/20 hover:bg-white/5 transition-colors overflow-hidden"
              >
                <CardContent className="p-0">
                  <div 
                    className="p-4 cursor-pointer"
                    onClick={() => toggleApprovalDetails(approval.id)}
                  >
                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-medium">{approval.tokenName}</h3>
                          <Badge 
                            variant="outline" 
                            className="bg-blue-500/10 text-blue-400 border-blue-500/30"
                          >
                            ${approval.tokenSymbol}
                          </Badge>
                          {getStatusBadge(approval.status)}
                        </div>
                        
                        <p className="text-sm text-gray-400 mb-2">
                          <span className="font-mono">{approval.creatorWallet.slice(0, 6)}...{approval.creatorWallet.slice(-4)}</span>
                        </p>
                        
                        <p className="text-sm text-gray-300">
                          {approval.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-400">
                          {new Date(approval.requestDate).toLocaleDateString()}
                        </p>
                        <ChevronRight 
                          size={18} 
                          className={`transform transition-transform ${selectedApproval === approval.id ? 'rotate-90' : ''}`} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded details */}
                  {selectedApproval === approval.id && (
                    <div className="border-t border-white/10 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Creator Information</p>
                            <div className="bg-white/5 p-3 rounded-lg space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-300">Wallet</span>
                                <span className="text-sm font-mono">{approval.creatorWallet.slice(0, 6)}...{approval.creatorWallet.slice(-4)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-300">Website</span>
                                <a 
                                  href={approval.website}
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-sm text-blue-400 flex items-center"
                                >
                                  {approval.website.replace('https://', '')}
                                  <ExternalLink size={12} className="ml-1" />
                                </a>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-300">Twitter</span>
                                <span className="text-sm">{approval.twitter}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-300">Telegram</span>
                                <span className="text-sm">{approval.telegram}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Request Details</p>
                            <div className="bg-white/5 p-3 rounded-lg space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-300">Request Type</span>
                                <Badge className="capitalize">{approval.type}</Badge>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-300">Request Date</span>
                                <span className="text-sm">{new Date(approval.requestDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-300">Status</span>
                                {getStatusBadge(approval.status)}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Token Details</p>
                            <div className="bg-white/5 p-3 rounded-lg space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-300">Name</span>
                                <span className="text-sm">{approval.tokenName}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-300">Symbol</span>
                                <span className="text-sm font-medium">${approval.tokenSymbol}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-300">Initial Supply</span>
                                <span className="text-sm">{approval.initialSupply.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-gray-300">Creator Fee</span>
                                <span className="text-sm">{approval.creatorFee}%</span>
                              </div>
                            </div>
                          </div>
                          
                          {approval.rejectionReason && (
                            <div>
                              <p className="text-xs text-gray-400 mb-1">Rejection Reason</p>
                              <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                <p className="text-sm text-red-400">{approval.rejectionReason}</p>
                              </div>
                            </div>
                          )}
                          
                          {approval.status === 'pending' && (
                            <div className="pt-3">
                              <p className="text-xs text-gray-400 mb-2">Actions</p>
                              <div className="flex gap-2">
                                <Button 
                                  className="flex-1 bg-green-500 hover:bg-green-600"
                                  size="sm"
                                  onClick={() => handleApprove(approval.id)}
                                >
                                  <CheckCircle size={14} className="mr-1" />
                                  Approve
                                </Button>
                                <Button 
                                  className="flex-1 bg-red-500 hover:bg-red-600"
                                  size="sm"
                                  onClick={() => handleReject(approval.id)}
                                >
                                  <XCircle size={14} className="mr-1" />
                                  Reject
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="glass-card border-wybe-primary/20 text-center py-16">
              <CardContent>
                <Users size={48} className="mx-auto mb-4 text-gray-500 opacity-20" />
                <h3 className="text-lg font-medium mb-2">No Approval Requests Found</h3>
                <p className="text-gray-400 mb-6">
                  {searchTerm || statusFilter !== 'all' 
                    ? "No approval requests match your search criteria." 
                    : "There are no pending approval requests at this time."}
                </p>
                <Button
                  variant="outline"
                  className="mx-auto"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                  }}
                >
                  <RefreshCcw size={14} className="mr-1" />
                  Reset Filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      )}
      
      {/* Summary & Statistics */}
      {!isLoading && filteredApprovals.length > 0 && (
        <Card className="glass-card border-wybe-primary/20 mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Approval Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400">Pending</p>
                  <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
                    <Clock size={12} className="mr-1" />
                    {approvals.filter(a => a.status === 'pending').length}
                  </Badge>
                </div>
              </div>
              
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400">Approved</p>
                  <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500/30">
                    <CheckCircle size={12} className="mr-1" />
                    {approvals.filter(a => a.status === 'approved').length}
                  </Badge>
                </div>
              </div>
              
              <div className="bg-white/5 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-400">Rejected</p>
                  <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/30">
                    <XCircle size={12} className="mr-1" />
                    {approvals.filter(a => a.status === 'rejected').length}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-400 text-center">
              <p>Approval rate: {
                Math.round(
                  (approvals.filter(a => a.status === 'approved').length / 
                  (approvals.filter(a => a.status === 'approved').length + 
                   approvals.filter(a => a.status === 'rejected').length)) * 100
                ) || 0
              }%</p>
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default PendingApprovals;
