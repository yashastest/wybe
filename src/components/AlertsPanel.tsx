
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Alert {
  id: string;
  type: 'price' | 'whale' | 'gas';
  condition: string;
  active: boolean;
  createdAt: string;
}

interface AlertsPanelProps {
  onCreateAlert?: (alert: Omit<Alert, 'id' | 'createdAt'>) => void;
  onDeleteAlert?: (id: string) => void;
  onToggleAlert?: (id: string, active: boolean) => void;
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({
  onCreateAlert,
  onDeleteAlert,
  onToggleAlert
}) => {
  const [newAlertType, setNewAlertType] = useState<Alert['type']>('price');
  const [newAlertCondition, setNewAlertCondition] = useState<string>('');
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'price',
      condition: 'Price increases 2x from entry',
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      type: 'whale',
      condition: 'Whale buys > 5 SOL',
      active: true,
      createdAt: new Date().toISOString()
    },
    {
      id: '3',
      type: 'gas',
      condition: 'Gas spikes 2x above baseline',
      active: false,
      createdAt: new Date().toISOString()
    }
  ]);

  const handleCreateAlert = () => {
    if (!newAlertCondition) return;
    
    const newAlert: Alert = {
      id: Date.now().toString(),
      type: newAlertType,
      condition: newAlertCondition,
      active: true,
      createdAt: new Date().toISOString()
    };
    
    setAlerts([newAlert, ...alerts]);
    setNewAlertCondition('');
    
    if (onCreateAlert) {
      onCreateAlert({
        type: newAlertType,
        condition: newAlertCondition,
        active: true
      });
    }
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
    
    if (onDeleteAlert) {
      onDeleteAlert(id);
    }
  };

  const handleToggleAlert = (id: string) => {
    setAlerts(alerts.map(a => {
      if (a.id === id) {
        const updatedAlert = { ...a, active: !a.active };
        
        if (onToggleAlert) {
          onToggleAlert(id, updatedAlert.active);
        }
        
        return updatedAlert;
      }
      return a;
    }));
  };

  return (
    <Card className="bg-[#0F1118] border border-gray-800">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <span className="text-[#8B5CF6] mr-2">🚨</span> Custom Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <select
            value={newAlertType}
            onChange={(e) => setNewAlertType(e.target.value as Alert['type'])}
            className="bg-[#1A1F2C] text-white border border-gray-700 rounded-lg p-2 text-sm flex-shrink-0 w-24"
          >
            <option value="price">Price</option>
            <option value="whale">Whale</option>
            <option value="gas">Gas</option>
          </select>
          
          <Input
            placeholder="Alert condition..."
            value={newAlertCondition}
            onChange={(e) => setNewAlertCondition(e.target.value)}
            className="bg-[#1A1F2C] border-gray-700"
          />
          
          <Button 
            onClick={handleCreateAlert}
            className="bg-[#8B5CF6] hover:bg-[#7c4ddf] flex-shrink-0"
          >
            Add
          </Button>
        </div>
        
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {alerts.map(alert => (
            <div 
              key={alert.id} 
              className={`bg-[#1A1F2C] border border-gray-700 rounded-lg p-2 flex items-center ${
                !alert.active && 'opacity-60'
              }`}
            >
              <div className="flex-grow">
                <div className="flex items-center space-x-2">
                  <div className={`
                    w-2 h-2 rounded-full 
                    ${alert.type === 'price' ? 'bg-green-500' : 
                      alert.type === 'whale' ? 'bg-blue-500' : 'bg-orange-500'}`
                  }></div>
                  <span className="text-xs uppercase text-gray-400">{alert.type}</span>
                </div>
                <div className="mt-1">{alert.condition}</div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div 
                  className={`h-4 w-8 rounded-full relative cursor-pointer ${
                    alert.active ? 'bg-[#8B5CF6]' : 'bg-gray-600'
                  }`}
                  onClick={() => handleToggleAlert(alert.id)}
                >
                  <div 
                    className={`absolute h-3 w-3 rounded-full bg-white top-0.5 transition-transform ${
                      alert.active ? 'translate-x-4 right-0.5' : 'left-0.5'
                    }`}
                  />
                </div>
                
                <Button 
                  variant="outline" 
                  className="h-6 w-6 p-0 text-gray-400"
                  onClick={() => handleDeleteAlert(alert.id)}
                >
                  ×
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsPanel;
