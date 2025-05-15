import React, { useState } from 'react';
import { useWallet } from '@/hooks/useWallet.tsx';
import { useTokenListing } from '@/hooks/useTokenListing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader, Rocket, Wallet, AlertCircle, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const LaunchTokenForm: React.FC = () => {
  const navigate = useNavigate();
  const { connected, address, connect } = useWallet();
  const { launchToken, buyInitialSupply } = useTokenListing();
  
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [description, setDescription] = useState('');
  const [initialPrice, setInitialPrice] = useState('0.0001');
  const [totalSupply, setTotalSupply] = useState('1000000');
  const [buyAmount, setBuyAmount] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [launchStep, setLaunchStep] = useState<'form' | 'buy' | 'success'>('form');
  const [tokenId, setTokenId] = useState<string | null>(null);
  
  const handleLaunchToken = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected || !address) {
      connect();
      return;
    }
    
    // Validate inputs
    if (!name || !symbol) {
      toast.error('Please enter both name and symbol for your token');
      return;
    }
    
    // Normalize symbol
    const normalizedSymbol = symbol.toUpperCase().replace(/[^A-Z0-9]/g, '');
    
    if (normalizedSymbol.length < 3 || normalizedSymbol.length > 10) {
      toast.error('Symbol must be between 3-10 characters (letters and numbers only)');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await launchToken({
        name,
        symbol: normalizedSymbol,
        initialSupply: parseFloat(totalSupply),
        totalSupply: parseFloat(totalSupply),
        creatorWallet: address // Use creatorWallet directly
      });
      
      if (result.success && result.tokenId) {
        setTokenId(result.tokenId);
        setLaunchStep('buy');
        toast.success('Token created successfully!');
      } else {
        toast.error('Failed to launch token', { 
          description: result.error || 'Please try again later' 
        });
      }
    } catch (error) {
      console.error('Token launch error:', error);
      toast.error('Failed to launch token');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleBuyInitialSupply = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connected || !address || !tokenId) {
      return;
    }
    
    const amount = parseFloat(buyAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await buyInitialSupply(tokenId, address, amount);
      
      if (result.success) {
        setLaunchStep('success');
        toast.success('Initial supply purchased!');
      } else {
        toast.error('Failed to purchase initial supply', {
          description: result.error || 'Please try again'
        });
      }
    } catch (error) {
      console.error('Initial buy error:', error);
      toast.error('Failed to purchase initial supply');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGoToToken = () => {
    if (symbol) {
      navigate(`/trade/${symbol.toLowerCase()}`);
    }
  };

  if (!connected) {
    return (
      <div className="bg-gradient-to-br from-indigo-950 to-purple-900 p-8 rounded-xl shadow-xl max-w-md mx-auto border border-indigo-500/30 text-center">
        <Wallet className="w-12 h-12 mx-auto mb-4 text-indigo-400" />
        <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
        <p className="text-indigo-200 mb-6">
          Connect your wallet to launch your own token on the platform.
        </p>
        <Button 
          onClick={connect} 
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-6 text-lg"
        >
          Connect Wallet
        </Button>
      </div>
    );
  }
  
  return (
    <div className="bg-gradient-to-br from-indigo-950 to-purple-900 p-6 rounded-xl shadow-xl max-w-md mx-auto border border-indigo-500/30">
      {launchStep === 'form' && (
        <>
          <div className="text-center mb-6">
            <Rocket className="w-12 h-12 mx-auto mb-2 text-indigo-400" />
            <h2 className="text-2xl font-bold text-white">Launch Your Token</h2>
            <p className="text-indigo-200">Create your own tradeable token in seconds</p>
          </div>
          
          <form onSubmit={handleLaunchToken}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-indigo-200">Token Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. My Awesome Token"
                  className="bg-indigo-900/40 border-indigo-600/30 text-white"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="symbol" className="text-indigo-200">Token Symbol</Label>
                <Input
                  id="symbol"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value.toUpperCase())}
                  placeholder="e.g. TOKEN"
                  className="bg-indigo-900/40 border-indigo-600/30 text-white uppercase"
                  maxLength={10}
                  required
                />
                <p className="text-xs text-indigo-300 mt-1">3-10 characters, letters and numbers only</p>
              </div>
              
              <div>
                <Label htmlFor="description" className="text-indigo-200">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your token's purpose or vision..."
                  className="bg-indigo-900/40 border-indigo-600/30 text-white h-24"
                />
              </div>
              
              <div>
                <Label htmlFor="initialPrice" className="text-indigo-200">Initial Price (SOL)</Label>
                <Input
                  id="initialPrice"
                  type="number"
                  value={initialPrice}
                  onChange={(e) => setInitialPrice(e.target.value)}
                  className="bg-indigo-900/40 border-indigo-600/30 text-white"
                  min="0.00001"
                  step="0.00001"
                />
                <p className="text-xs text-indigo-300 mt-1">
                  The starting price for your token in SOL
                </p>
              </div>
              
              <div>
                <Label htmlFor="totalSupply" className="text-indigo-200">Total Supply</Label>
                <Input
                  id="totalSupply"
                  type="number"
                  value={totalSupply}
                  onChange={(e) => setTotalSupply(e.target.value)}
                  className="bg-indigo-900/40 border-indigo-600/30 text-white"
                  min="1000"
                  step="1000"
                />
                <p className="text-xs text-indigo-300 mt-1">
                  The total number of tokens that will be created
                </p>
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Creating Token...
                    </>
                  ) : (
                    <>
                      <Rocket className="mr-2 h-4 w-4" />
                      Launch Token
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </>
      )}
      
      {launchStep === 'buy' && (
        <>
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-full bg-indigo-700/50 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 text-indigo-200" />
            </div>
            <h2 className="text-2xl font-bold text-white mt-3">Token Created!</h2>
            <p className="text-indigo-200">Now purchase the initial supply to activate trading</p>
          </div>
          
          <form onSubmit={handleBuyInitialSupply}>
            <div className="bg-indigo-800/30 p-4 rounded-lg mb-6 border border-indigo-600/30">
              <div className="flex justify-between mb-2">
                <span className="text-indigo-200">Name:</span>
                <span className="text-white font-medium">{name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-indigo-200">Symbol:</span>
                <span className="text-white font-medium">{symbol}</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="buyAmount" className="text-indigo-200">Initial Buy Amount (SOL)</Label>
                <Input
                  id="buyAmount"
                  type="number"
                  value={buyAmount}
                  onChange={(e) => setBuyAmount(e.target.value)}
                  placeholder="0.1"
                  className="bg-indigo-900/40 border-indigo-600/30 text-white"
                  min="0.01"
                  step="0.01"
                  required
                />
                <p className="text-xs text-indigo-300 mt-1">
                  This will determine your initial token supply
                </p>
              </div>
              
              <div className="bg-indigo-800/20 p-3 rounded-lg flex items-start gap-2">
                <AlertCircle size={16} className="text-indigo-300 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-indigo-200">
                  To activate your token, you need to make an initial buy. This sets up 
                  the initial market and activates the bonding curve.
                </p>
              </div>
              
              <div className="pt-2">
                <Button 
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-500 text-white py-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Wallet className="mr-2 h-4 w-4" />
                      Buy Initial Supply
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </>
      )}
      
      {launchStep === 'success' && (
        <div className="text-center py-6">
          <div className="w-20 h-20 rounded-full bg-green-700/30 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-400" />
          </div>
          
          <h2 className="text-2xl font-bold text-white">Congratulations!</h2>
          <p className="text-green-200 mb-6">
            Your token {symbol} has been successfully launched!
          </p>
          
          <Button 
            onClick={handleGoToToken}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-6 mb-4"
          >
            Go to Token Page
          </Button>
          
          <div className="bg-indigo-800/20 p-3 rounded-lg">
            <p className="text-xs text-indigo-200">
              Your token is now live on the bonding curve and available for trading. 
              Share the token symbol with others to let them trade your token!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaunchTokenForm;
