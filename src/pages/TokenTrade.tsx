
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EnhancedTradingInterface from '@/components/EnhancedTradingInterface';
import TradingInterface from '@/components/TradingInterface';
import { tokenTradingService } from '@/services/tokenTradingService';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ArrowLeftIcon, Share, Facebook, Twitter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface TokenDetails {
  name: string;
  symbol: string;
  price: number;
  logo: string | null;
  contractAddress?: string;
  isAssisted?: boolean;
  description?: string;
}

const TokenTrade: React.FC = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const [loading, setLoading] = useState(true);
  const [tokenDetails, setTokenDetails] = useState<TokenDetails | null>(null);

  useEffect(() => {
    const fetchTokenDetails = async () => {
      if (!tokenId) return;
      
      setLoading(true);
      try {
        // Get all tokens and find the matching one
        const tokens = await tokenTradingService.getListedTokens();
        const token = tokens.find(t => t.symbol.toLowerCase() === tokenId.toLowerCase());
        
        if (token) {
          setTokenDetails({
            name: token.name,
            symbol: token.symbol,
            price: token.price,
            logo: token.logo,
            contractAddress: token.contractAddress,
            isAssisted: token.isAssisted || false,
            description: token.description
          });
        } else {
          toast.error(`Token ${tokenId} not found`);
        }
      } catch (error) {
        console.error("Failed to fetch token details:", error);
        toast.error("Failed to load token data");
      } finally {
        setLoading(false);
      }
    };

    fetchTokenDetails();
  }, [tokenId]);

  // Generate a shareable URL
  const getShareableUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/token/${tokenId}`;
  };

  // For social sharing
  const shareableText = tokenDetails 
    ? `Check out ${tokenDetails.name} (${tokenDetails.symbol}) on Wybe.fun! ${tokenDetails.contractAddress ? `\nContract: ${tokenDetails.contractAddress}` : ''}`
    : `Check out this token on Wybe.fun!`;
  const shareableUrl = getShareableUrl();

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      
      <main className="flex-1 container py-8">
        <Link to="/trade" className="flex items-center text-indigo-400 hover:text-indigo-300 mb-6">
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to all tokens
        </Link>
        
        {loading ? (
          <div className="max-w-xl mx-auto">
            <Skeleton className="h-12 w-64 mb-6" />
            <Skeleton className="h-[500px] w-full rounded-xl" />
          </div>
        ) : tokenDetails ? (
          <div className="max-w-xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold">
                Trade {tokenDetails.name} ({tokenDetails.symbol})
              </h1>
              
              {/* Share Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Share {tokenDetails.name} ({tokenDetails.symbol})</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="flex justify-center space-x-4">
                      {/* Social Media Share Buttons */}
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline">
                            <Facebook className="h-4 w-4 mr-2" />
                            Share on Facebook
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <p className="text-sm">Copy link to share on Facebook:</p>
                          <div className="mt-2">
                            <Input readOnly value={shareableUrl} />
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="mt-2 w-full"
                              onClick={() => {
                                navigator.clipboard.writeText(shareableUrl);
                                toast.success("Link copied to clipboard");
                              }}
                            >
                              Copy Link
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline">
                            <Twitter className="h-4 w-4 mr-2" />
                            Share on Twitter
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent>
                          <p className="text-sm">Copy text to share on Twitter:</p>
                          <div className="mt-2">
                            <Input readOnly value={shareableText} />
                            <Button 
                              variant="secondary" 
                              size="sm" 
                              className="mt-2 w-full"
                              onClick={() => {
                                navigator.clipboard.writeText(`${shareableText} ${shareableUrl}`);
                                toast.success("Text copied to clipboard");
                              }}
                            >
                              Copy Text
                            </Button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>

                    {tokenDetails.contractAddress && (
                      <div className="pt-2">
                        <p className="text-sm font-medium mb-2">Contract Address:</p>
                        <div className="bg-muted p-2 rounded-md font-mono text-xs break-all">
                          {tokenDetails.contractAddress}
                        </div>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="mt-2"
                          onClick={() => {
                            navigator.clipboard.writeText(tokenDetails.contractAddress || '');
                            toast.success("Contract address copied to clipboard");
                          }}
                        >
                          Copy Contract Address
                        </Button>
                      </div>
                    )}

                    <div className="pt-2">
                      <p className="text-sm font-medium mb-2">Share Link:</p>
                      <div className="flex space-x-2">
                        <Input readOnly value={shareableUrl} />
                        <Button 
                          variant="secondary" 
                          onClick={() => {
                            navigator.clipboard.writeText(shareableUrl);
                            toast.success("Link copied to clipboard");
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </div>

                    <div className="bg-muted p-3 rounded-md mt-2">
                      <div className="flex items-center space-x-2">
                        <img 
                          src="/lovable-uploads/dcb3ea81-25ba-4438-90a5-c7403026c91e.png" 
                          alt="Wybe Logo" 
                          className="h-5 w-5" 
                        />
                        <p className="text-sm font-medium">Powered by Wybe.fun</p>
                      </div>
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Close</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            
            {tokenDetails.isAssisted && (
              <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 p-3 rounded-md mb-4">
                <p className="text-sm flex items-center">
                  <span className="bg-purple-500 h-2 w-2 rounded-full mr-2"></span>
                  This token is being launched through Wybe's Assisted Launch program.
                </p>
              </div>
            )}
            
            {tokenDetails.description && (
              <p className="text-gray-400 mb-4">{tokenDetails.description}</p>
            )}
            
            {tokenDetails.logo && (
              <div className="flex justify-center mb-6">
                <img src={tokenDetails.logo} alt={tokenDetails.name} className="w-16 h-16 rounded-full" />
              </div>
            )}
            
            <TradingInterface 
              tokenSymbol={tokenDetails.symbol}
              tokenName={tokenDetails.name}
              tokenImage={tokenDetails.logo || undefined}
              contractAddress={tokenDetails.contractAddress}
              isAssisted={tokenDetails.isAssisted}
            />
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Token Not Found</h2>
            <p className="text-gray-400 mb-8">The token you are looking for doesn't exist or hasn't been launched yet.</p>
            <Link to="/trade" className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg text-white">
              Browse Available Tokens
            </Link>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default TokenTrade;
