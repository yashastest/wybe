
import React, { useState } from 'react';
import { ListedToken } from '@/services/token/types'; // Updated import
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TokenSelectorProps {
  tokens: ListedToken[];
  selectedToken: ListedToken;
  onSelectToken: (token: ListedToken) => void;
}

const TokenSelector: React.FC<TokenSelectorProps> = ({ tokens, selectedToken, onSelectToken }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter tokens based on search query
  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="token-selector">
      {/* Search input */}
      <div className="relative mb-2">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search tokens..."
          className="w-full pl-9 h-9 bg-[#1A1F2C] border-gray-800"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Token list */}
      <div className="h-[260px] overflow-y-auto scrollbar-thin pr-1">
        <div className="space-y-1">
          {filteredTokens.map(token => (
            <div 
              key={token.id}
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-[#1A1F2C] transition-colors ${
                selectedToken.id === token.id ? 'bg-[#1A1F2C]' : ''
              }`}
              onClick={() => onSelectToken(token)}
            >
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-xs">
                  {token.symbol.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium">{token.symbol}</div>
                  <div className="text-xs text-gray-400">{token.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-medium">${token.price.toFixed(6)}</div>
                <div className={`text-xs ${
                  token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
                }`}>
                  {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h}%
                </div>
              </div>
            </div>
          ))}
          
          {filteredTokens.length === 0 && (
            <div className="flex items-center justify-center h-20 text-gray-400 text-sm">
              No tokens found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenSelector;
