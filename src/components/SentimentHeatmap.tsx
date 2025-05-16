
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSentimentColor } from '@/utils/tradeUtils';

interface TokenSentiment {
  symbol: string;
  name: string;
  score: number;
  confidence: number;
}

interface SentimentHeatmapProps {
  tokens: TokenSentiment[];
  onSelect?: (symbol: string) => void;
}

const SentimentHeatmap: React.FC<SentimentHeatmapProps> = ({ tokens, onSelect }) => {
  // Organize tokens into a grid (sample with some fixed tokens)
  const sampleTokens: TokenSentiment[] = tokens.length > 0 ? tokens : [
    { symbol: 'DOGE', name: 'Dogecoin', score: 75, confidence: 92 },
    { symbol: 'SHIB', name: 'Shiba Inu', score: 45, confidence: 78 },
    { symbol: 'PEPE', name: 'Pepe', score: 20, confidence: 65 },
    { symbol: 'FLOKI', name: 'Floki', score: -10, confidence: 55 },
    { symbol: 'BONK', name: 'Bonk', score: 82, confidence: 88 },
    { symbol: 'WIF', name: 'Wif', score: 60, confidence: 80 },
    { symbol: 'MYRO', name: 'Myro', score: 30, confidence: 70 },
    { symbol: 'POPCAT', name: 'Popcat', score: -35, confidence: 60 },
    { symbol: 'MOCHI', name: 'Mochi', score: -55, confidence: 75 },
    { symbol: 'BOOK', name: 'Book', score: -80, confidence: 85 },
    { symbol: 'SNEK', name: 'Snek', score: 40, confidence: 72 },
    { symbol: 'TOSHI', name: 'Toshi', score: 65, confidence: 80 },
  ];
  
  const handleSelectToken = (symbol: string) => {
    if (onSelect) {
      onSelect(symbol);
    }
  };
  
  return (
    <Card className="bg-[#0F1118] border border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <span className="text-[#8B5CF6] mr-2">🔥</span> Sentiment Heatmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-1.5">
          {sampleTokens.map((token) => (
            <motion.div
              key={token.symbol}
              className={`${getSentimentColor(token.score)} p-1.5 rounded cursor-pointer`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelectToken(token.symbol)}
            >
              <div className="font-bold text-center text-white text-sm">
                {token.symbol}
              </div>
              <div className="text-center text-white text-xs opacity-80">
                {token.confidence}% conf
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentHeatmap;
