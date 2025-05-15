
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, MoreHorizontal, RefreshCw, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { toast } from 'sonner';
import { ListedToken } from '@/services/token/types';

interface TokensListProps {
  tokens: ListedToken[];
  isLoading: boolean;
  onRefresh: () => Promise<void>;
}

const TokensList: React.FC<TokensListProps> = ({ tokens, isLoading, onRefresh }) => {
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const handleEdit = (tokenId: string) => {
    navigate(`/admin/token-deployment/${tokenId}`);
  };
  
  const handleDelete = async (tokenId: string) => {
    setDeleteLoading(tokenId);
    try {
      // In a real application, this would call an API to delete the token
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Token deleted successfully");
      onRefresh();
    } catch (error) {
      console.error("Error deleting token:", error);
      toast.error("Failed to delete token");
    } finally {
      setDeleteLoading(null);
    }
  };
  
  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch(status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <Card>
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Listed Tokens</h2>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onRefresh} 
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
      
      {tokens.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-gray-500">No tokens found</p>
          {!isLoading && (
            <Button 
              onClick={() => navigate('/admin/token-deployment')} 
              className="mt-4"
            >
              Create Your First Token
            </Button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Supply</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tokens.map((token) => (
                <TableRow key={token.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {token.logo ? (
                        <img 
                          src={token.logo} 
                          alt={token.name} 
                          className="w-6 h-6 mr-2 rounded-full"
                        />
                      ) : (
                        <div className="w-6 h-6 mr-2 rounded-full bg-gray-200 flex items-center justify-center">
                          {token.symbol.charAt(0)}
                        </div>
                      )}
                      {token.name}
                    </div>
                  </TableCell>
                  <TableCell>{token.symbol}</TableCell>
                  <TableCell>{token.totalSupply?.toLocaleString()}</TableCell>
                  <TableCell>${token.price.toFixed(4)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getStatusBadge(token.status)}>
                      {token.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(token.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(token.id)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDelete(token.id)}
                          disabled={deleteLoading === token.id}
                          className="text-red-600 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {deleteLoading === token.id ? "Deleting..." : "Delete"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </Card>
  );
};

export default TokensList;
