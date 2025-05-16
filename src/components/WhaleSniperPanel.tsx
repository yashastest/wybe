
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatWalletAddress } from '@/utils/tradeUtils';

interface WhaleWallet {
  address: string;
  autoTrade: boolean;
  delaySec: number;
  maxAmount: number;
}

interface WhaleSniperPanelProps {
  onFollow?: (wallet: string) => void;
  onUnfollow?: (wallet: string) => void;
  onSettingsChange?: (wallet: string, settings: Partial<WhaleWallet>) => void;
}

const WhaleSniperPanel: React.FC<WhaleSniperPanelProps> = ({ 
  onFollow,
  onUnfollow,
  onSettingsChange
}) => {
  const [newWallet, setNewWallet] = useState<string>('');
  const [wallets, setWallets] = useState<WhaleWallet[]>([
    {
      address: '8xpzCU5Mj3uZdqtpRKr8z5faAJFZQ6XA9vcWrYgLC3GV',
      autoTrade: true,
      delaySec: 5,
      maxAmount: 1
    },
    {
      address: 'AiYSy6ES3BW56t7srVKDDNon9YWPBtYiwsYnvD4FGZD7',
      autoTrade: false,
      delaySec: 10,
      maxAmount: 2.5
    }
  ]);

  const handleAddWallet = () => {
    if (!newWallet || wallets.some(w => w.address === newWallet)) return;
    
    const newWalletObj: WhaleWallet = {
      address: newWallet,
      autoTrade: false,
      delaySec: 5,
      maxAmount: 1
    };
    
    setWallets([...wallets, newWalletObj]);
    setNewWallet('');
    
    if (onFollow) {
      onFollow(newWallet);
    }
  };

  const handleRemoveWallet = (address: string) => {
    setWallets(wallets.filter(w => w.address !== address));
    
    if (onUnfollow) {
      onUnfollow(address);
    }
  };

  const handleSettingChange = (address: string, setting: keyof WhaleWallet, value: any) => {
    setWallets(wallets.map(w => {
      if (w.address === address) {
        const updated = { ...w, [setting]: value };
        
        if (onSettingsChange) {
          onSettingsChange(address, { [setting]: value });
        }
        
        return updated;
      }
      return w;
    }));
  };

  return (
    <Card className="bg-[#0F1118] border border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <span className="text-[#8B5CF6] mr-2">🐋</span> Whale Sniper
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex">
          <Input
            placeholder="Wallet address to follow"
            value={newWallet}
            onChange={(e) => setNewWallet(e.target.value)}
            className="bg-[#1A1F2C] border-gray-700 rounded-r-none"
          />
          <Button 
            onClick={handleAddWallet}
            className="bg-[#8B5CF6] hover:bg-[#7c4ddf] rounded-l-none"
          >
            Follow
          </Button>
        </div>
        
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {wallets.map(wallet => (
            <div 
              key={wallet.address} 
              className="bg-[#1A1F2C] border border-gray-700 rounded-lg p-2"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <Badge variant="outline" className="mr-2">Whale</Badge>
                  <span className="font-mono text-xs">{formatWalletAddress(wallet.address)}</span>
                </div>
                <Button 
                  variant="outline" 
                  className="h-6 w-6 p-0 text-gray-400"
                  onClick={() => handleRemoveWallet(wallet.address)}
                >
                  ×
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-gray-400">Auto Trade</label>
                    <div 
                      className={`h-4 w-8 rounded-full relative cursor-pointer ${
                        wallet.autoTrade ? 'bg-[#8B5CF6]' : 'bg-gray-600'
                      }`}
                      onClick={() => handleSettingChange(wallet.address, 'autoTrade', !wallet.autoTrade)}
                    >
                      <div 
                        className={`absolute h-3 w-3 rounded-full bg-white top-0.5 transition-transform ${
                          wallet.autoTrade ? 'translate-x-4 right-0.5' : 'left-0.5'
                        }`}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-gray-400">Delay (sec)</label>
                    <span className="text-xs">{wallet.delaySec}s</span>
                  </div>
                  <Slider
                    value={[wallet.delaySec]}
                    min={0}
                    max={30}
                    step={1}
                    onValueChange={([value]) => handleSettingChange(wallet.address, 'delaySec', value)}
                    className="h-1.5"
                  />
                </div>
                
                <div className="col-span-2">
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs text-gray-400">Max Amount (SOL)</label>
                    <span className="text-xs">{wallet.maxAmount} SOL</span>
                  </div>
                  <Slider
                    value={[wallet.maxAmount]}
                    min={0.1}
                    max={10}
                    step={0.1}
                    onValueChange={([value]) => handleSettingChange(wallet.address, 'maxAmount', value)}
                    className="h-1.5"
                  />
                </div>
                
                <div className="col-span-2 grid grid-cols-2 gap-1">
                  <Button 
                    className="bg-green-500 hover:bg-green-600 h-7 text-xs"
                    onClick={() => console.log(`Quick buy for wallet ${wallet.address}`)}
                  >
                    Quick Buy
                  </Button>
                  <Button 
                    className="bg-red-500 hover:bg-red-600 h-7 text-xs"
                    onClick={() => console.log(`Quick sell for wallet ${wallet.address}`)}
                  >
                    Quick Sell
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default WhaleSniperPanel;
