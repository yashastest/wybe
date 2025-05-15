
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TradingInterface from '@/components/TradingInterface';
import EnhancedTradingInterface from '@/components/EnhancedTradingInterface';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import TradingViewChart from '@/components/TradingViewChart';
import { tokenTradingService, ListedToken } from '@/services/tokenTradingService';

const TradeDemo = () => {
  const [tokens, setTokens] = useState<ListedToken[]>([]);
  const [selectedToken, setSelectedToken] = useState<ListedToken | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [interfaceType, setInterfaceType] = useState<'standard' | 'enhanced'>('standard');

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const listedTokens = await tokenTradingService.getListedTokens();
        setTokens(listedTokens);
        setSelectedToken(listedTokens[0]); // Set the first token as default
      } catch (error) {
        console.error("Failed to fetch tokens:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokens();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold mb-6">Trading Demo</h1>
          
          <Tabs defaultValue={interfaceType} onValueChange={(v) => setInterfaceType(v as 'standard' | 'enhanced')} className="mb-6">
            <TabsList>
              <TabsTrigger value="standard">Standard Trading Interface</TabsTrigger>
              <TabsTrigger value="enhanced">Enhanced Trading Interface</TabsTrigger>
            </TabsList>
            
            <TabsContent value="standard" className="mt-4">
              <Card className="bg-black/30 border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Standard Trading Interface</CardTitle>
                      <CardDescription>Basic trading interface with chart and trade history</CardDescription>
                    </div>
                    <Badge variant="secondary" className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20">For Beginners</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-pulse text-xl">Loading trading interface...</div>
                    </div>
                  ) : selectedToken && (
                    <div>
                      <Card className="bg-black/30 border-gray-800">
                        <CardHeader>
                          <CardTitle>Select Token to Trade</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Tabs defaultValue={selectedToken.id} onValueChange={(value) => {
                            const token = tokens.find(t => t.id === value);
                            if (token) setSelectedToken(token);
                          }}>
                            <TabsList className="mb-4">
                              {tokens.map(token => (
                                <TabsTrigger key={token.id} value={token.id}>
                                  {token.symbol}
                                </TabsTrigger>
                              ))}
                            </TabsList>
                            
                            {tokens.map(token => (
                              <TabsContent key={token.id} value={token.id}>
                                <div className="flex items-center gap-4 mb-4">
                                  <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                    {token.symbol.charAt(0)}
                                  </div>
                                  <div>
                                    <h2 className="text-xl font-bold">{token.name}</h2>
                                    <div className="flex items-center">
                                      <span className="text-lg font-medium">${token.price.toFixed(6)}</span>
                                      <span className={`ml-2 ${token.priceChange24h && token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {token.priceChange24h && token.priceChange24h > 0 ? '+' : ''}{token.priceChange24h}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-gray-400 mb-4">{token.description}</p>
                                
                                {/* Add Launch Status Banner */}
                                {token.isAssisted && (
                                  <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 p-3 rounded-md mb-4">
                                    <p className="text-sm flex items-center">
                                      <span className="bg-purple-500 h-2 w-2 rounded-full mr-2"></span>
                                      This token is being launched through Wybe's Assisted Launch program. Contract address will be available soon.
                                    </p>
                                  </div>
                                )}
                                
                                {/* Contract Address (if available) */}
                                {token.contractAddress && (
                                  <div className="text-sm mt-2">
                                    <p className="text-gray-400 mb-1">Contract Address:</p>
                                    <div className="bg-black/30 p-2 rounded font-mono text-xs break-all">
                                      {token.contractAddress}
                                    </div>
                                  </div>
                                )}
                              </TabsContent>
                            ))}
                          </Tabs>
                        </CardContent>
                      </Card>
                      
                      <div className="mt-6">
                        <TradingInterface 
                          tokenSymbol={selectedToken.symbol} 
                          tokenName={selectedToken.name} 
                          tokenId={selectedToken.id}
                          contractAddress={selectedToken.contractAddress || undefined}
                          isAssisted={selectedToken.isAssisted}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="enhanced" className="mt-4">
              <Card className="bg-black/30 border-gray-800">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Enhanced Trading Interface</CardTitle>
                      <CardDescription>Advanced trading features for experienced traders</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20">Pro Features</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-pulse text-xl">Loading enhanced trading interface...</div>
                    </div>
                  ) : selectedToken && (
                    <div>
                      <Card className="bg-black/30 border-gray-800">
                        <CardHeader>
                          <CardTitle>Select Token to Trade</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <Tabs defaultValue={selectedToken.id} onValueChange={(value) => {
                            const token = tokens.find(t => t.id === value);
                            if (token) setSelectedToken(token);
                          }}>
                            <TabsList className="mb-4">
                              {tokens.map(token => (
                                <TabsTrigger key={token.id} value={token.id}>
                                  {token.symbol}
                                </TabsTrigger>
                              ))}
                            </TabsList>
                            
                            {tokens.map(token => (
                              <TabsContent key={token.id} value={token.id}>
                                <div className="flex items-center gap-4 mb-4">
                                  <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                                    {token.symbol.charAt(0)}
                                  </div>
                                  <div>
                                    <h2 className="text-xl font-bold">{token.name}</h2>
                                    <div className="flex items-center">
                                      <span className="text-lg font-medium">${token.price.toFixed(6)}</span>
                                      <span className={`ml-2 ${token.priceChange24h && token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        {token.priceChange24h && token.priceChange24h > 0 ? '+' : ''}{token.priceChange24h}%
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <p className="text-gray-400 mb-4">{token.description}</p>
                                
                                {/* Add Launch Status Banner */}
                                {token.isAssisted && (
                                  <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 p-3 rounded-md mb-4">
                                    <p className="text-sm flex items-center">
                                      <span className="bg-purple-500 h-2 w-2 rounded-full mr-2"></span>
                                      This token is being launched through Wybe's Assisted Launch program. Contract address will be available soon.
                                    </p>
                                  </div>
                                )}
                                
                                {/* Contract Address (if available) */}
                                {token.contractAddress && (
                                  <div className="text-sm mt-2">
                                    <p className="text-gray-400 mb-1">Contract Address:</p>
                                    <div className="bg-black/30 p-2 rounded font-mono text-xs break-all">
                                      {token.contractAddress}
                                    </div>
                                  </div>
                                )}
                              </TabsContent>
                            ))}
                          </Tabs>
                        </CardContent>
                      </Card>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                        <div className="lg:col-span-2">
                          <Card className="bg-black/30 border-gray-800">
                            <CardHeader className="pb-2">
                              <CardTitle>Advanced Chart</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <TradingViewChart 
                                symbol={selectedToken.symbol} 
                              />
                            </CardContent>
                          </Card>
                        </div>
                        
                        <div>
                          <EnhancedTradingInterface 
                            tokenSymbol={selectedToken.symbol} 
                            tokenName={selectedToken.name} 
                            tokenPrice={selectedToken.price}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TradeDemo;
