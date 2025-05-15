
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EnhancedTradingInterface from '@/components/EnhancedTradingInterface';
import { tokenTradingService } from '@/services/tokenTradingService';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { ArrowLeftIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TokenDetails {
  name: string;
  symbol: string;
  price: number;
  logo: string | null;
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
            logo: token.logo
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
            <h1 className="text-3xl font-bold mb-6">
              Trade {tokenDetails.name} ({tokenDetails.symbol})
            </h1>
            
            <EnhancedTradingInterface 
              tokenSymbol={tokenDetails.symbol}
              tokenName={tokenDetails.name}
              tokenPrice={tokenDetails.price}
              tokenLogo={tokenDetails.logo || undefined}
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
