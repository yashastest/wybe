
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

// Mock tokens data
const mockTokens = [
  { 
    id: "wybe-1", 
    symbol: "WYBE", 
    name: "Wybe Token", 
    price: 0.0015, 
    priceChange24h: 12.5,
    description: "The native token of the Wybe platform"
  },
  { 
    id: "pepe-2", 
    symbol: "PEPE", 
    name: "Pepe Token", 
    price: 0.000032, 
    priceChange24h: 5.7,
    description: "A popular meme token in the crypto space"
  },
  { 
    id: "doge-3", 
    symbol: "DOGE", 
    name: "Dogecoin", 
    price: 0.23, 
    priceChange24h: -3.2,
    description: "The original meme token that started it all"
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
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
              
              <TradingInterface 
                tokenSymbol={selectedToken.symbol} 
                tokenName={selectedToken.name} 
                tokenId={selectedToken.id}
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
