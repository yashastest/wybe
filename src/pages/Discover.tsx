import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SearchIcon, TrendingUp, ChevronRight, Fire, ArrowUp, ArrowDown, Users } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { tokenTradingService, ListedToken } from '@/services/tokenTradingService';

export default function Discover() {
  const [tokens, setTokens] = useState<ListedToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        setLoading(true);
        const fetchedTokens = await tokenTradingService.getListedTokens();
        setTokens(fetchedTokens);
      } catch (error) {
        console.error('Failed to fetch tokens:', error);
        toast.error('Failed to load tokens');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTokens();
  }, []);
  
  // Filter tokens based on search term and category
  const filteredTokens = tokens.filter(token => {
    const matchesSearch = 
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || 
      (token.category && token.category.includes(selectedCategory));
    
    return matchesSearch && matchesCategory;
  });
  
  // Get all unique categories from tokens
  const allCategories = ['all', ...new Set(tokens.flatMap(token => token.category || []))];
  
  // Format market cap for display
  const formatMarketCap = (value: number) => {
    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  };

  return (
    <section className="container py-12 md:py-16">
      <motion.div 
        className="mb-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl md:text-4xl font-bold text-gradient mb-2">
          Discover New Tokens
        </h1>
        <p className="text-muted-foreground">
          Explore a wide variety of tokens and find the next big thing.
        </p>
      </motion.div>

      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div className="relative w-full md:max-w-sm">
          <Input
            type="search"
            placeholder="Search tokens..."
            className="bg-black/30 border-white/10 rounded-full pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>

        <Tabs defaultValue="all" className="w-full md:w-auto">
          <TabsList className="bg-black/20 rounded-full p-1">
            {allCategories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="data-[state=active]:bg-white data-[state=active]:text-black rounded-full px-4 py-2 text-sm font-medium"
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? 'All' : category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={`skeleton-${index}`} className="glass-card p-4">
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-gray-700 w-12 h-12 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-700 rounded-md w-32 animate-pulse" />
                    <div className="h-3 bg-gray-700 rounded-md w-24 animate-pulse" />
                  </div>
                </div>
                <div className="h-5 bg-gray-700 rounded-md animate-pulse" />
                <div className="flex justify-between">
                  <div className="h-4 bg-gray-700 rounded-md w-20 animate-pulse" />
                  <div className="h-4 bg-gray-700 rounded-md w-20 animate-pulse" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredTokens.length > 0 ? (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delayChildren: 0.2, staggerChildren: 0.1 }}
        >
          {filteredTokens.map(token => (
            <motion.div 
              key={token.id} 
              className="glass-card p-4 hover:shadow-glow-sm transition-all duration-300"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-black/40">
                    <AspectRatio ratio={1 / 1}>
                      <img
                        src={token.logo || "/placeholder.svg"}
                        alt={token.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                    </AspectRatio>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <h3 className="text-lg font-semibold">{token.name}</h3>
                      {token.category && token.category.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <Fire className="w-4 h-4 text-orange-500" />
                          <span className="text-xs text-orange-500 font-medium">
                            {token.category[0]}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{token.symbol}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Price</p>
                    <p className="font-medium">${token.price.toFixed(6)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Market Cap</p>
                    <p className="font-medium">{formatMarketCap(token.marketCap)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {token.change24h >= 0 ? (
                      <ArrowUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${token.change24h >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {token.change24h.toFixed(2)}%
                    </span>
                  </div>
                  <Link
                    to={`/trade/${token.symbol.toLowerCase()}`}
                    className="text-sm text-blue-500 hover:text-blue-400 transition-colors"
                  >
                    Trade <ChevronRight className="inline-block w-4 h-4 ml-1" />
                  </Link>
                </div>
              </CardContent>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">No tokens found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter options.
          </p>
        </div>
      )}
    </section>
  );
}
