
import React from 'react';
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const PendingApprovals = () => {
  const approvals = [
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
  ];
  
  const handleApprove = (id) => {
    toast.success(`Approved request ${id}`);
  };
  
  const handleReject = (id) => {
    toast.success(`Rejected request ${id}`);
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
      className="glass-card p-6"
    >
      <h2 className="text-xl font-bold mb-4">Whitelist Requests</h2>
      <div className="space-y-4">
        {approvals.map((request, index) => (
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
                  onClick={() => handleReject(request.id)}
                >
                  Reject
                </Button>
                <Button 
                  className="bg-green-500/80 hover:bg-green-500 text-white"
                  size="sm"
                  onClick={() => handleApprove(request.id)}
                >
                  Approve
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default PendingApprovals;
