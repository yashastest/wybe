
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface WhitelistRequest {
  id: string;
  name: string;
  symbol: string;
  email: string;
  telegram: string;
  website: string;
  status: string;
  description: string;
  submitted: string;
}

const PendingApprovals = () => {
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<WhitelistRequest | null>(null);
  const [approvals, setApprovals] = useState<WhitelistRequest[]>([
    {
      id: "REQ-001",
      name: "Pepe Solana",
      symbol: "PEPES",
      email: "creator@pepesolana.com",
      telegram: "@pepesolcreator",
      website: "https://pepe-solana.io",
      status: "pending",
      description: "A new Pepe-themed token built on Solana with focus on community engagement and memes",
      submitted: "2023-05-12T14:30:00Z",
    },
    {
      id: "REQ-002",
      name: "Doge Sol",
      symbol: "DSOL",
      email: "founder@dogesol.io",
      telegram: "@dogesolfound",
      website: "https://dogesol.io",
      status: "pending",
      description: "Bringing the Doge meme to Solana ecosystem with innovative tokenomics and community rewards",
      submitted: "2023-05-12T16:45:00Z",
    },
    {
      id: "REQ-003",
      name: "Floki Fortune",
      symbol: "FLOKIF",
      email: "team@flokifortune.com",
      telegram: "@flokifortuneofficial",
      website: "",
      status: "pending",
      description: "A Floki-inspired token with a focus on charitable giving and community growth",
      submitted: "2023-05-13T09:15:00Z",
    }
  ]);
  
  const openApproveDialog = (request: WhitelistRequest) => {
    setSelectedRequest(request);
    setApprovalDialogOpen(true);
  };
  
  const openRejectDialog = (request: WhitelistRequest) => {
    setSelectedRequest(request);
    setRejectionDialogOpen(true);
  };
  
  const handleApprove = () => {
    if (!selectedRequest) return;
    
    // Update the status of the selected request
    const updatedApprovals = approvals.map(req => 
      req.id === selectedRequest.id ? { ...req, status: "approved" } : req
    );
    
    setApprovals(updatedApprovals);
    toast.success(`Approved request ${selectedRequest.id} - ${selectedRequest.name}`);
    setApprovalDialogOpen(false);
    
    // In a real application, this would make an API call to update the status in the backend
    console.log(`Approved request: ${selectedRequest.id}`);
  };
  
  const handleReject = () => {
    if (!selectedRequest) return;
    
    // Update the status of the selected request
    const updatedApprovals = approvals.map(req => 
      req.id === selectedRequest.id ? { ...req, status: "rejected" } : req
    );
    
    setApprovals(updatedApprovals);
    toast.success(`Rejected request ${selectedRequest.id} - ${selectedRequest.name}`);
    setRejectionDialogOpen(false);
    
    // In a real application, this would make an API call to update the status in the backend
    console.log(`Rejected request: ${selectedRequest.id}`);
  };
  
  // Filter to only show pending requests
  const pendingRequests = approvals.filter(request => request.status === "pending");
  
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
      className="glass-card p-6"
    >
      <h2 className="text-xl font-bold mb-4">Whitelist Requests</h2>
      
      {pendingRequests.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-wybe-primary/30 rounded-lg">
          <p className="text-gray-400">No pending whitelist requests</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingRequests.map((request, index) => (
            <motion.div 
              key={request.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { 
                  opacity: 1, 
                  y: 0,
                  transition: { duration: 0.3, delay: index * 0.1 }
                }
              }}
              className="border border-wybe-primary/20 rounded-lg p-4 bg-gradient-to-r from-wybe-background-light to-transparent hover:border-wybe-primary/40 transition-colors"
            >
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="text-lg font-medium">{request.name} <span className="text-wybe-primary">({request.symbol})</span></h3>
                  <p className="text-sm text-gray-400">Request ID: {request.id}</p>
                </div>
                <div className="bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs uppercase font-bold">
                  {request.status}
                </div>
              </div>
              <p className="text-sm text-gray-300 mb-3">{request.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white/5 rounded p-2">
                  <p className="text-xs text-gray-400">Contact Email</p>
                  <p className="text-sm">{request.email}</p>
                </div>
                <div className="bg-white/5 rounded p-2">
                  <p className="text-xs text-gray-400">Telegram</p>
                  <p className="text-sm">{request.telegram}</p>
                </div>
                <div className="bg-white/5 rounded p-2">
                  <p className="text-xs text-gray-400">Website</p>
                  <p className="text-sm">{request.website || "Not provided"}</p>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-400">
                  Submitted on {new Date(request.submitted).toLocaleString()}
                </p>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="bg-red-500/10 hover:bg-red-500/20 border-red-500/30 text-red-400"
                    size="sm"
                    onClick={() => openRejectDialog(request)}
                  >
                    <X size={16} className="mr-1" />
                    Reject
                  </Button>
                  <Button 
                    className="bg-green-500/80 hover:bg-green-500 text-white"
                    size="sm"
                    onClick={() => openApproveDialog(request)}
                  >
                    <Check size={16} className="mr-1" />
                    Approve
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Approve Dialog */}
      <AlertDialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <AlertDialogContent className="bg-wybe-background-light border-wybe-primary/20">
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Whitelist Request</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to approve the whitelist request for {selectedRequest?.name} ({selectedRequest?.symbol}).
              This will allow the creator to launch their token on the platform.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border border-white/20 hover:bg-white/5 text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleApprove} 
              className="bg-green-500/80 hover:bg-green-500 text-white"
            >
              Approve
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Dialog */}
      <AlertDialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
        <AlertDialogContent className="bg-wybe-background-light border-wybe-primary/20">
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Whitelist Request</AlertDialogTitle>
            <AlertDialogDescription>
              You are about to reject the whitelist request for {selectedRequest?.name} ({selectedRequest?.symbol}).
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border border-white/20 hover:bg-white/5 text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleReject} 
              className="bg-red-500/80 hover:bg-red-500 text-white"
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default PendingApprovals;
