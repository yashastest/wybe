
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TradingInterface from '@/components/TradingInterface';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock tokens data with more complete information
const mockTokens = [
  { 
    id: "wybe-1", 
    symbol: "WYBE", 
    name: "Wybe Token", 
    price: 0.0015, 
    priceChange24h: 12.5,
    description: "The native token of the Wybe platform",
    contractAddress: "wybeHg9sbUYEFSj6SXZ5yzERF8WjT6zyXJDj1YCnx",
    marketCap: 1500000,
    volume24h: 125000,
    totalSupply: 1000000000,
    isAssisted: false,
    creatorAddress: "8zjX6U4CnCo8W2Nqf5TzjNADVhKBTwXCVVMEmM3e1BhR"
  },
  { 
    id: "pepe-2", 
    symbol: "PEPE", 
    name: "Pepe Token", 
    price: 0.000032, 
    priceChange24h: 5.7,
    description: "A popular meme token in the crypto space",
    contractAddress: "pepeHg9sbHJYEFSj6SXZ5yzERF8WjT6zyXJDj1YC5x",
    marketCap: 2500000,
    volume24h: 350000,
    totalSupply: 100000000000,
    isAssisted: false,
    creatorAddress: "9ajX6U4CnCo8W2Nqf5TzjNADVhKBTwXCVVMEmM3e1CyZ"
  },
  { 
    id: "doge-3", 
    symbol: "DOGE", 
    name: "Dogecoin", 
    price: 0.23, 
    priceChange24h: -3.2,
    description: "The original meme token that started it all",
    contractAddress: null, // Assisted launch, no contract yet
    marketCap: 30000000,
    volume24h: 1250000,
    totalSupply: 132500000000,
    isAssisted: true,
    creatorAddress: "7wpX6U4CnCo8W2Nqf5TzjNADVhKBTwXCVVMEmM3e1AiJ"
  }
];

const TradeDemo = () => {
  const [selectedToken, setSelectedToken] = useState(mockTokens[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
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
          
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-pulse text-xl">Loading trading interface...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Select Token to Trade</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="wybe-1" onValueChange={(value) => {
                    const token = mockTokens.find(t => t.id === value);
                    if (token) setSelectedToken(token);
                  }}>
                    <TabsList className="mb-4">
                      {mockTokens.map(token => (
                        <TabsTrigger key={token.id} value={token.id}>
                          {token.symbol}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    
                    {mockTokens.map(token => (
                      <TabsContent key={token.id} value={token.id}>
                        <div className="flex items-center gap-4 mb-4">
                          <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                            {token.symbol.charAt(0)}
                          </div>
                          <div>
                            <h2 className="text-xl font-bold">{token.name}</h2>
                            <div className="flex items-center">
                              <span className="text-lg font-medium">${token.price.toFixed(6)}</span>
                              <span className={`ml-2 ${token.priceChange24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                {token.priceChange24h > 0 ? '+' : ''}{token.priceChange24h}%
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
              
              <TradingInterface 
                tokenSymbol={selectedToken.symbol} 
                tokenName={selectedToken.name} 
                tokenId={selectedToken.id}
                contractAddress={selectedToken.contractAddress || undefined}
                isAssisted={selectedToken.isAssisted}
              />
            </div>
          )}
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TradeDemo;
