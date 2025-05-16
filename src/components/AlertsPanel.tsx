
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Plus, X, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useWallet } from '@/lib/wallet';
import { toast } from 'sonner';

interface TokenAlert {
  id: string;
  token: string;
  type: 'price' | 'volume' | 'marketcap' | 'whale';
  threshold: number; 
  condition: 'above' | 'below';
  enabled: boolean;
  triggered?: boolean;
}

const AlertsPanel = () => {
  const { connected } = useWallet();
  const [alerts, setAlerts] = useState<TokenAlert[]>([
    {
      id: '1',
      token: 'WYBE',
      type: 'price',
      threshold: 0.0018,
      condition: 'above',
      enabled: true
    },
    {
      id: '2',
      token: 'DOGE',
      type: 'whale',
      threshold: 100000,
      condition: 'above',
      enabled: false
    },
    {
      id: '3',
      token: 'SHIB',
      type: 'price',
      threshold: 0.000020,
      condition: 'below',
      enabled: true,
      triggered: true
    }
  ]);
  
  const [newAlert, setNewAlert] = useState({
    token: '',
    type: 'price',
    threshold: '',
    condition: 'above'
  });
  
  const [showAddForm, setShowAddForm] = useState(false);
  
  const addNewAlert = () => {
    if (!connected) {
      toast.error("Please connect wallet to add alerts");
      return;
    }
    
    if (!newAlert.token || !newAlert.threshold) {
      toast.error("Please fill all fields");
      return;
    }
    
    const alert = {
      id: Date.now().toString(),
      token: newAlert.token.toUpperCase(),
      type: newAlert.type as any,
      threshold: parseFloat(newAlert.threshold),
      condition: newAlert.condition as 'above' | 'below',
      enabled: true
    };
    
    setAlerts([...alerts, alert]);
    setNewAlert({
      token: '',
      type: 'price',
      threshold: '',
      condition: 'above'
    });
    setShowAddForm(false);
    toast.success(`Alert created for ${alert.token}`);
  };
  
  const toggleAlertStatus = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, enabled: !alert.enabled } : alert
    ));
  };
  
  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast.success("Alert removed");
  };
  
  const getAlertTypeLabel = (type: string) => {
    switch(type) {
      case 'price': return 'Price';
      case 'volume': return 'Volume';
      case 'marketcap': return 'Market Cap';
      case 'whale': return 'Whale Transaction';
      default: return type;
    }
  };
  
  return (
    <Card className="bg-[#0F1118]/80 border border-gray-800 backdrop-blur-md rounded-xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <div className="flex items-center">
            <Bell className="text-[#8B5CF6] w-5 h-5 mr-2" />
            <span>Price Alerts</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="h-7 bg-transparent border-gray-700 hover:bg-[#1A1F2C]"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showAddForm && (
          <motion.div 
            className="mb-3 p-3 bg-[#1A1F2C]/70 border border-gray-800 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-sm font-medium mb-2">New Alert</div>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Token (e.g. WYBE)"
                  className="bg-[#0F1118] border-gray-800 text-sm"
                  value={newAlert.token}
                  onChange={(e) => setNewAlert({...newAlert, token: e.target.value})}
                />
                <select 
                  className="bg-[#0F1118] border border-gray-800 rounded-md text-sm px-3 py-1"
                  value={newAlert.type}
                  onChange={(e) => setNewAlert({...newAlert, type: e.target.value})}
                >
                  <option value="price">Price</option>
                  <option value="volume">Volume</option>
                  <option value="marketcap">Market Cap</option>
                  <option value="whale">Whale Activity</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-800 bg-[#0F1118] text-gray-400 text-sm">
                    {newAlert.condition === 'above' ? 'Above' : 'Below'}
                  </span>
                  <Input
                    type="text"
                    className="bg-[#0F1118] border-gray-800 text-sm rounded-l-none"
                    placeholder="Threshold"
                    value={newAlert.threshold}
                    onChange={(e) => setNewAlert({...newAlert, threshold: e.target.value})}
                  />
                </div>
                <div className="flex gap-2 items-center bg-[#0F1118]/70 rounded-md border border-gray-800 px-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-7 px-2 ${newAlert.condition === 'above' ? 'bg-[#2A1F3D] text-purple-400' : ''}`}
                    onClick={() => setNewAlert({...newAlert, condition: 'above'})}
                  >
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-7 px-2 ${newAlert.condition === 'below' ? 'bg-[#2A1F3D] text-purple-400' : ''}`}
                    onClick={() => setNewAlert({...newAlert, condition: 'below'})}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between gap-2">
                <Button 
                  variant="ghost" 
                  className="flex-1 bg-transparent hover:bg-[#1A1F2C]"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 bg-purple-700 hover:bg-purple-800 text-white"
                  onClick={addNewAlert}
                >
                  Add Alert
                </Button>
              </div>
            </div>
          </motion.div>
        )}
        
        <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1">
          {alerts.length > 0 ? alerts.map((alert, index) => (
            <motion.div 
              key={alert.id} 
              className={`p-3 border rounded-lg ${
                alert.triggered 
                  ? 'bg-red-900/20 border-red-800/30 animate-pulse' 
                  : 'bg-[#1A1F2C]/70 border-gray-800'
              }`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Badge className="mr-2 bg-[#2A1F3D] text-purple-300 border-0">
                    {alert.token}
                  </Badge>
                  <div className="text-sm">
                    {getAlertTypeLabel(alert.type)} {alert.condition} {alert.type === 'whale' ? formatNumber(alert.threshold) : formatValue(alert.threshold, alert.type)}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch
                    checked={alert.enabled}
                    onCheckedChange={() => toggleAlertStatus(alert.id)}
                    className="data-[state=checked]:bg-purple-600"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-gray-500 hover:text-white hover:bg-red-900/30"
                    onClick={() => deleteAlert(alert.id)}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
              
              {alert.triggered && (
                <div className="mt-2 text-xs bg-red-500/10 border border-red-800/30 rounded p-1.5 text-red-300">
                  Alert triggered! {alert.token} is now {
                    alert.condition === 'below' ? 'below' : 'above'
                  } your threshold.
                </div>
              )}
            </motion.div>
          )) : (
            <div className="text-center py-8 text-gray-400">
              <Bell className="h-5 w-5 mx-auto mb-2 opacity-50" />
              <p>No alerts configured</p>
              <p className="text-sm mt-1">Click the + button to add one</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function to format values based on their type
const formatValue = (value: number, type: string): string => {
  if (type === 'price') {
    return `$${value < 0.001 ? value.toFixed(6) : value.toFixed(4)}`;
  }
  if (type === 'marketcap') {
    return `$${value >= 1000000 ? (value / 1000000).toFixed(2) + 'M' : (value / 1000).toFixed(2) + 'K'}`;
  }
  if (type === 'volume') {
    return `$${value >= 1000000 ? (value / 1000000).toFixed(2) + 'M' : (value / 1000).toFixed(2) + 'K'}`;
  }
  return value.toString();
};

// Helper function to format large numbers
const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(2) + 'M';
  }
  if (value >= 1000) {
    return (value / 1000).toFixed(2) + 'K';
  }
  return value.toString();
};

export default AlertsPanel;
