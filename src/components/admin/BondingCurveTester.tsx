
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { smartContractService, ContractConfig } from '@/services/smartContractService';

const BondingCurveTester: React.FC = () => {
  const [tokenAmount, setTokenAmount] = useState<number>(1000);
  const [solAmount, setSolAmount] = useState<number>(0);
  const [curveType, setCurveType] = useState<string>('quadratic');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [chartData, setChartData] = useState<Array<{ tokens: number; price: number }>>([]);
  
  // Generate chart data based on curve type
  React.useEffect(() => {
    const data = [];
    for (let i = 0; i <= 10; i++) {
      const tokens = i * 1000;
      let price;
      
      switch (curveType) {
        case 'linear':
          price = 0.001 * tokens + 0.01;
          break;
        case 'quadratic':
          price = 0.000001 * Math.pow(tokens, 2) + 0.01;
          break;
        case 'exponential':
          price = 0.01 * Math.exp(tokens / 5000);
          break;
        default:
          price = 0.001 * tokens + 0.01;
      }
      
      data.push({
        tokens,
        price: parseFloat(price.toFixed(4))
      });
    }
    setChartData(data);
  }, [curveType]);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setTokenAmount(value);
    } else {
      setTokenAmount(0);
    }
  };
  
  const handleSliderChange = (value: number[]) => {
    setTokenAmount(value[0]);
  };
  
  const handleMint = async () => {
    if (tokenAmount <= 0) {
      toast.error("Please enter a valid token amount");
      return;
    }
    
    setIsProcessing(true);
    try {
      const result = await smartContractService.mintTokensWithBondingCurve("WYBE", tokenAmount);
      setSolAmount(result.cost);
      toast.success(`Successfully simulated minting ${tokenAmount} tokens for ${result.cost} SOL`);
    } catch (error) {
      console.error("Minting simulation failed:", error);
      toast.error("Failed to simulate token minting");
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleTrade = async () => {
    if (tokenAmount <= 0) {
      toast.error("Please enter a valid token amount");
      return;
    }
    
    setIsProcessing(true);
    try {
      const result = await smartContractService.executeTokenTrade("WYBE", tokenAmount, true);
      if (result.success) {
        setSolAmount(result.price * tokenAmount);
        toast.success(`Successfully simulated trade at price: ${result.price} SOL per token`);
      } else {
        toast.error("Trade simulation failed");
      }
    } catch (error) {
      console.error("Trade simulation failed:", error);
      toast.error("Failed to simulate token trade");
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bonding Curve Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium">Curve Type</label>
              <div className="flex space-x-4">
                <Button 
                  variant={curveType === 'linear' ? 'default' : 'outline'}
                  onClick={() => setCurveType('linear')}
                >
                  Linear
                </Button>
                <Button 
                  variant={curveType === 'quadratic' ? 'default' : 'outline'}
                  onClick={() => setCurveType('quadratic')}
                >
                  Quadratic
                </Button>
                <Button 
                  variant={curveType === 'exponential' ? 'default' : 'outline'}
                  onClick={() => setCurveType('exponential')}
                >
                  Exponential
                </Button>
              </div>
            </div>
            
            <div>
              <label className="mb-2 block text-sm font-medium">Token Amount</label>
              <div className="flex items-center space-x-4">
                <Input
                  type="number"
                  value={tokenAmount}
                  onChange={handleAmountChange}
                  placeholder="Enter token amount"
                  min="1"
                />
                <span className="text-sm font-medium">WYBE</span>
              </div>
              
              <div className="mt-4">
                <Slider
                  value={[tokenAmount]}
                  min={0}
                  max={10000}
                  step={100}
                  onValueChange={handleSliderChange}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>5,000</span>
                  <span>10,000</span>
                </div>
              </div>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tokens" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} SOL`, 'Price']} />
                  <Legend />
                  <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="pt-4 space-y-4">
              <div className="flex justify-between">
                <span>Estimated Cost:</span>
                <span className="font-bold">{solAmount} SOL</span>
              </div>
              
              <div className="flex space-x-4">
                <Button 
                  onClick={handleMint} 
                  disabled={isProcessing}
                  className="w-full"
                >
                  {isProcessing ? "Processing..." : "Test Mint"}
                </Button>
                <Button 
                  onClick={handleTrade} 
                  disabled={isProcessing}
                  variant="secondary"
                  className="w-full"
                >
                  {isProcessing ? "Processing..." : "Test Trade"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BondingCurveTester;
