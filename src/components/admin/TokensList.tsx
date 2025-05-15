import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Edit,
  ArrowUpRight,
  Trash2,
  Check,
  X,
  Loader2,
  Play
} from "lucide-react";
import { toast } from "sonner";
import integrationService from '@/services/integrationService';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';

// Token type definition
interface Token {
  id: string;
  name: string;
  symbol: string;
  creator_wallet: string;
  market_cap: number;
  launched: boolean;
  token_address?: string;
  launch_date?: string;
  created_at?: string;
  bonding_curve?: any;
  approved?: boolean;
  rejection_reason?: string;
}

// This is a pseudo fix since we don't have full access to this file
// Import the supabase client at the beginning of the file
import { supabase } from "@/integrations/supabase/client";

const TokensList: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const navigate = useNavigate();
  
  // Fetch tokens from the database
  const fetchTokens = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('tokens')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw new Error(error.message);
      }
      
      setTokens(data || []);
    } catch (error) {
      toast.error(`Failed to fetch tokens: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchTokens();
  }, []);
  
  // Handle token approval
  const handleApprove = async (token: Token) => {
    try {
      await integrationService.approveToken(token.id);
      fetchTokens(); // Refresh the list
    } catch (error) {
      toast.error(`Failed to approve token: ${error.message}`);
    }
  };
  
  // Open rejection dialog
  const openRejectDialog = (token: Token) => {
    setSelectedToken(token);
    setRejectionReason('');
  };
  
  // Handle token rejection
  const handleReject = async () => {
    try {
      if (!selectedToken) return;
      
      await integrationService.rejectToken(selectedToken.id, rejectionReason);
      fetchTokens(); // Refresh the list
      setSelectedToken(null);
    } catch (error) {
      toast.error(`Failed to reject token: ${error.message}`);
    }
  };
  
  // Handle deploy token
  const handleDeploy = (token: Token) => {
    navigate(`/token-deployment/${token.id}`);
  };
  
  // Handle view token
  const handleViewToken = (token: Token) => {
    // Navigate to token details page (to be implemented later)
    toast.info("Token details page not implemented yet");
  };
  
  // Format wallet address
  const formatWalletAddress = (address: string) => {
    if (!address) return '';
    return address.length > 12 
      ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
      : address;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Tokens</CardTitle>
        <Button size="sm" onClick={() => navigate('/token-deployment')}>
          New Token
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : tokens.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No tokens found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Creator</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Market Cap</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tokens.map((token) => (
                  <TableRow key={token.id}>
                    <TableCell className="font-medium">{token.name}</TableCell>
                    <TableCell>{token.symbol}</TableCell>
                    <TableCell className="font-mono text-xs">
                      {formatWalletAddress(token.creator_wallet)}
                    </TableCell>
                    <TableCell>
                      {token.launched ? (
                        <Badge className="bg-green-500">Launched</Badge>
                      ) : token.approved === true ? (
                        <Badge className="bg-blue-500">Approved</Badge>
                      ) : token.approved === false ? (
                        <Badge className="bg-red-500">Rejected</Badge>
                      ) : (
                        <Badge className="bg-amber-500">Pending</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {token.market_cap ? `$${token.market_cap.toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell>
                      {token.created_at 
                        ? new Date(token.created_at).toLocaleDateString() 
                        : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        {!token.launched && token.approved !== true && token.approved !== false && (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0 text-green-500"
                              onClick={() => handleApprove(token)}
                              title="Approve"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-red-500"
                                  onClick={() => openRejectDialog(token)}
                                  title="Reject"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Reject Token</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to reject this token? This action cannot be undone.
                                    <div className="mt-4">
                                      <Textarea
                                        placeholder="Reason for rejection"
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        className="w-full"
                                      />
                                    </div>
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={handleReject}
                                    className="bg-red-500 hover:bg-red-600"
                                  >
                                    Reject
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
                        )}
                        
                        {token.approved === true && !token.launched && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => handleDeploy(token)}
                            title="Deploy"
                          >
                            <Play className="h-4 w-4" />
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          onClick={() => handleViewToken(token)}
                          title="View Details"
                        >
                          <ArrowUpRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TokensList;
