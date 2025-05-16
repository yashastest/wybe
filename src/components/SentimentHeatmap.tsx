
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSentimentColor } from '@/utils/tradeUtils';
import { Tooltip } from '@/components/ui/tooltip';
import { MessageSquare, TrendingUp, TrendingDown } from 'lucide-react';

interface TokenSentiment {
  symbol: string;
  name: string;
  score: number;
  confidence: number;
  change24h?: number;
}

interface SentimentHeatmapProps {
  tokens: TokenSentiment[];
  onSelect?: (symbol: string) => void;
}

const SentimentHeatmap: React.FC<SentimentHeatmapProps> = ({ tokens, onSelect }) => {
  const [highlightedToken, setHighlightedToken] = useState<string | null>(null);
  
  // Organize tokens into a grid (sample with some fixed tokens)
  const sampleTokens: TokenSentiment[] = tokens.length > 0 ? tokens : [
    { symbol: 'WYBE', name: 'Wybe Token', score: 86, confidence: 94, change24h: 15.4 },
    { symbol: 'DOGE', name: 'Dogecoin', score: 75, confidence: 92, change24h: 5.2 },
    { symbol: 'SHIB', name: 'Shiba Inu', score: 45, confidence: 78, change24h: -2.8 },
    { symbol: 'PEPE', name: 'Pepe', score: 20, confidence: 65, change24h: 8.9 },
    { symbol: 'FLOKI', name: 'Floki', score: -10, confidence: 55, change24h: -4.7 },
    { symbol: 'BONK', name: 'Bonk', score: 82, confidence: 88, change24h: 32.1 },
    { symbol: 'WIF', name: 'Wif', score: 60, confidence: 80, change24h: 3.6 },
    { symbol: 'MYRO', name: 'Myro', score: 30, confidence: 70, change24h: 1.2 },
    { symbol: 'POPCAT', name: 'Popcat', score: -35, confidence: 60, change24h: -15.6 },
    { symbol: 'MOCHI', name: 'Mochi', score: -55, confidence: 75, change24h: -22.3 },
    { symbol: 'BOOK', name: 'Book', score: -80, confidence: 85, change24h: -35.1 },
    { symbol: 'SNEK', name: 'Snek', score: 40, confidence: 72, change24h: 9.5 },
    { symbol: 'TOSHI', name: 'Toshi', score: 65, confidence: 80, change24h: 18.3 },
    { symbol: 'SLERF', name: 'Slerf', score: 53, confidence: 76, change24h: 7.1 },
    { symbol: 'GOAT', name: 'Goat', score: -25, confidence: 68, change24h: -6.9 },
    { symbol: 'MOON', name: 'Moonshot', score: 72, confidence: 84, change24h: 24.8 },
  ];
  
  const handleSelectToken = (symbol: string) => {
    if (onSelect) {
      onSelect(symbol);
    }
  };
  
  // Sort tokens by sentiment score (most positive first)
  const sortedTokens = [...sampleTokens].sort((a, b) => b.score - a.score);
  
  return (
    <Card className="bg-[#0F1118]/80 border border-gray-800 backdrop-blur-md rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <MessageSquare className="text-[#8B5CF6] w-5 h-5 mr-2" />
            <span>Sentiment Heatmap</span>
          </div>
          <span className="text-xs text-gray-400">Live data</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-1.5">
          {sortedTokens.map((token) => (
            <motion.div
              key={token.symbol}
              className={`${getSentimentColor(token.score)} relative p-2 rounded-lg cursor-pointer overflow-hidden`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSelectToken(token.symbol)}
              onMouseEnter={() => setHighlightedToken(token.symbol)}
              onMouseLeave={() => setHighlightedToken(null)}
            >
              {/* Glowing effect based on sentiment score */}
              <motion.div 
                className="absolute inset-0 opacity-20 rounded-lg"
                style={{ 
                  background: `radial-gradient(circle, ${token.score > 0 ? '#4ade80' : '#ef4444'} 0%, transparent 70%)`,
                }}
                animate={{ 
                  opacity: [0.1, 0.25, 0.1],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                }}
              />
              
              {/* Confidence indicator (brighter = higher confidence) */}
              <div className="absolute top-0 right-0 left-0 h-0.5 bg-white rounded-full opacity-10" 
                style={{ opacity: token.confidence / 200 }} 
              />
              
              <div className="font-bold text-center text-white text-sm flex items-center justify-center gap-1">
                {token.symbol}
                {token.change24h && token.change24h !== 0 && (
                  token.change24h > 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )
                )}
              </div>
              <div className="text-center text-white text-xs opacity-80">
                {token.confidence}% conf
              </div>
              
              {/* Expanded token info on hover */}
              {highlightedToken === token.symbol && (
                <motion.div 
                  className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-sm font-medium">{token.name}</div>
                  <div className={`text-xs mt-0.5 ${token.score >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    Score: {token.score}
                  </div>
                  {token.change24h && (
                    <div className={`text-xs ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(1)}%
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Legend */}
        <div className="mt-3 flex justify-between items-center">
          <div className="flex items-center text-xs text-gray-400">
            <span className="w-3 h-3 bg-red-500 rounded-sm inline-block mr-1"></span>
            <span className="mr-2">Bearish</span>
            
            <span className="w-3 h-3 bg-orange-400/80 rounded-sm inline-block mr-1"></span>
            <span className="mr-2">Neutral</span>
            
            <span className="w-3 h-3 bg-green-500 rounded-sm inline-block mr-1"></span>
            <span>Bullish</span>
          </div>
          
          <span className="text-[10px] text-gray-500">Click to trade</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentHeatmap;
