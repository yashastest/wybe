import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TradingInterface from '@/components/TradingInterface';
import EnhancedTradingInterface from '@/components/EnhancedTradingInterface';
import TradingViewChart from '@/components/TradingViewChart';
import TransactionHistory from '@/components/TransactionHistory';
import TokenPerformanceChart from '@/components/TokenPerformanceChart';
import TraderActivity from '@/components/TraderActivity';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Bookmark, ChevronLeft, ChevronRight, Clock, DollarSign, Share } from 'lucide-react';
import { tokenTradingService } from '@/services/tokenTradingService';
import { useWallet } from '@/hooks/useWallet.tsx';

const TradingViewChartWrapper = ({ symbol }: { symbol: string }) => {
  return (
    <div className="mb-6">
      <TradingViewChart 
        symbol={symbol} 
        style={{ height: '400px' }}
      />
    </div>
  );
};

const Trade: React.FC = () => {
  const { tokenId } = useParams<{ tokenId: string }>();
  const navigate = useNavigate();
  const { connected, connect } = useWallet();
  
  // State for current token and token list
  const [currentToken, setCurrentToken] = useState<any>(null);
  const [tokens, setTokens] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('trade');
  const [showAdvancedTrading, setShowAdvancedTrading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Fetch tokens on mount
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setIsLoading(true);
        const listedTokens = await tokenTradingService.getListedTokens();
        setTokens(listedTokens);
        
        // If tokenId is provided, find that token
        if (tokenId) {
          const selectedToken = listedTokens.find(token => token.id === tokenId || token.symbol === tokenId);
          if (selectedToken) {
            setCurrentToken(selectedToken);
          } else {
            // If token not found, use first token
            setCurrentToken(listedTokens[0]);
            toast.error("Token not found, showing default token");
          }
        } else if (listedTokens.length > 0) {
          // If no tokenId provided, use first token
          setCurrentToken(listedTokens[0]);
        }
      } catch (error) {
        console.error("Error fetching tokens:", error);
        toast.error("Failed to load tokens");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTokens();
  }, [tokenId]);
  
  // Navigation to next/prev token
  const navigateToken = (direction: 'next' | 'prev') => {
    if (!currentToken || tokens.length <= 1) return;
    
    const currentIndex = tokens.findIndex(t => t.id === currentToken.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = (currentIndex + 1) % tokens.length;
    } else {
      newIndex = (currentIndex - 1 + tokens.length) % tokens.length;
    }
    
    navigate(`/trade/${tokens[newIndex].id}`);
  };
  
  // Handle wallet connection
  const handleConnectWallet = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      toast.error("Failed to connect wallet");
    }
  };
  
  // Handle bookmark
  const handleBookmark = () => {
    toast.success(`Added ${currentToken?.symbol} to your watchlist`);
  };
  
  // Handle share
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };
  
  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="animate-pulse text-xl">Loading...</div>
        </div>
        <Footer />
      </div>
    );
  }
  
  // No tokens state
  if (!currentToken) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">No Tokens Available</h2>
          <p className="mb-6">There are no tokens available for trading at this time.</p>
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 pt-20 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center mb-4 md:mb-0">
              <Button variant="outline" size="icon" className="mr-2" onClick={() => navigate(-1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="flex items-center">
                {currentToken.logo ? (
                  <img src={currentToken.logo} alt={currentToken.name} className="w-10 h-10 mr-3 rounded-full" />
                ) : (
                  <div className="w-10 h-10 mr-3 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                    {currentToken.symbol.charAt(0)}
                  </div>
                )}
                
                <div>
                  <h1 className="text-2xl font-bold flex items-center">
                    {currentToken.name}
                    <Badge variant="outline" className="ml-2 text-xs">
                      {currentToken.symbol}
                    </Badge>
                  </h1>
                  <div className="flex items-center text-xl">
                    <span className="font-medium">${currentToken.price.toFixed(4)}</span>
                    {currentToken.priceChange24h && (
                      <span className={`ml-2 text-sm ${currentToken.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {currentToken.priceChange24h > 0 ? '+' : ''}{currentToken.priceChange24h.toFixed(2)}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={handleBookmark}>
                <Bookmark className="h-4 w-4 mr-2" />
                Watch
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              {tokens.length > 1 && (
                <div className="flex">
                  <Button variant="outline" size="icon" onClick={() => navigateToken('prev')}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => navigateToken('next')}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="mb-6">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Price Chart</CardTitle>
                </CardHeader>
                <CardContent>
                  <TradingViewChartWrapper symbol={currentToken.symbol} />
                </CardContent>
              </Card>
              
              <Tabs 
                defaultValue="markets" 
                className="mb-6"
              >
                <TabsList className="mb-4">
                  <TabsTrigger value="markets">Markets</TabsTrigger>
                  <TabsTrigger value="history">Trading History</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="markets">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Market Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 border rounded-lg">
                          <div className="text-sm text-gray-400 mb-1 flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            Market Cap
                          </div>
                          <div className="font-semibold">
                            ${currentToken.marketCap?.toLocaleString() || 'N/A'}
                          </div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="text-sm text-gray-400 mb-1 flex items-center">
                            <ArrowUpRight className="h-4 w-4 mr-1" />
                            24h Volume
                          </div>
                          <div className="font-semibold">
                            ${currentToken.volume24h?.toLocaleString() || 'N/A'}
                          </div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="text-sm text-gray-400 mb-1 flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            Circulating Supply
                          </div>
                          <div className="font-semibold">
                            {currentToken.totalSupply?.toLocaleString() || 'N/A'} {currentToken.symbol}
                          </div>
                        </div>
                        <div className="p-4 border rounded-lg">
                          <div className="text-sm text-gray-400 mb-1">
                            Platform Fee
                          </div>
                          <div className="font-semibold">
                            2.5%
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="history">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Trading History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {isMobile ? (
                        <div className="mt-4">
                          <TransactionHistory tokenSymbol={currentToken.symbol} />
                        </div>
                      ) : (
                        <TradingViewChartWrapper symbol={currentToken.symbol} />
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="analytics">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Performance</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <TokenPerformanceChart tokenSymbol={currentToken.symbol} />
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Trader Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <TraderActivity tokenSymbol={currentToken.symbol} />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            <div>
              <Card className="mb-6">
                <CardHeader className="py-3 px-4 flex flex-row items-center justify-between">
                  <CardTitle className="text-lg">Trade {currentToken.symbol}</CardTitle>
                  <div className="flex items-center">
                    <label className="text-xs mr-2">Advanced</label>
                    <input 
                      type="checkbox"
                      checked={showAdvancedTrading}
                      onChange={() => setShowAdvancedTrading(!showAdvancedTrading)}
                      className="toggle toggle-primary toggle-sm"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  {!connected ? (
                    <div className="text-center py-8">
                      <p className="mb-4">Connect your wallet to start trading</p>
                      <Button onClick={handleConnectWallet}>Connect Wallet</Button>
                    </div>
                  ) : showAdvancedTrading ? (
                    <EnhancedTradingInterface
                      tokenSymbol={currentToken.symbol}
                      tokenName={tokenDetails?.name || tokenSymbol}
                      tokenPrice={tokenDetails?.price || 0}
                      tokenLogo={tokenDetails?.logo || undefined}
                    />
                  ) : (
                    <TradingInterface 
                      tokenSymbol={currentToken.symbol} 
                      tokenName={currentToken.name}
                      tokenImage={currentToken.logo || ''}
                    />
                  )}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Token Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium mb-1">About</h3>
                      <p className="text-sm text-gray-400">
                        {currentToken.description || `${currentToken.name} (${currentToken.symbol}) is a token trading on the Wybe platform.`}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Contract Address</h3>
                      <div className="text-sm bg-black/20 p-2 rounded font-mono break-all">
                        {currentToken.contractAddress || 'Not yet deployed to blockchain'}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Created By</h3>
                      <div className="text-sm bg-black/20 p-2 rounded font-mono break-all">
                        {currentToken.creatorAddress || 'Unknown'}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Trade;
