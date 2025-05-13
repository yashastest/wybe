
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const AdminSettings = () => {
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    tokenApprovals: true,
    feeDistribution: true,
    platformFee: 2.5
  });

  const handleSaveSettings = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success("Settings saved successfully");
    }, 1000);
  };

  const toggleSetting = (setting) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting]
    });
  };

  const handleFeeChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 10) {
      setSettings({
        ...settings,
        platformFee: value
      });
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className="glass-card p-6"
    >
      <motion.h2 
        className="text-xl font-bold mb-6"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 }
        }}
      >
        Admin Settings
      </motion.h2>
      
      <motion.div
        className="space-y-6 max-w-2xl"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
      >
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <h3 className="font-medium mb-2">Platform Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="font-medium">Maintenance Mode</p>
                <p className="text-xs text-gray-400">Temporarily disable public access to platform</p>
              </div>
              <Switch 
                checked={settings.maintenanceMode}
                onCheckedChange={() => toggleSetting('maintenanceMode')}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="font-medium">Token Approvals</p>
                <p className="text-xs text-gray-400">Require manual approval for new tokens</p>
              </div>
              <Switch 
                checked={settings.tokenApprovals}
                onCheckedChange={() => toggleSetting('tokenApprovals')}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="font-medium">Fee Distribution</p>
                <p className="text-xs text-gray-400">Automatically distribute fees to creators</p>
              </div>
              <Switch 
                checked={settings.feeDistribution}
                onCheckedChange={() => toggleSetting('feeDistribution')}
              />
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="font-medium">Platform Fee (%)</p>
                <p className="text-xs text-gray-400">Fee charged on all trades (0-10%)</p>
              </div>
              <div className="w-24">
                <Input 
                  type="number" 
                  value={settings.platformFee} 
                  onChange={handleFeeChange} 
                  min="0" 
                  max="10" 
                  step="0.1"
                  className="bg-wybe-background/40"
                />
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { delay: 0.2 } }
          }}
        >
          <h3 className="font-medium mb-2">Admin Access</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="font-medium">admin@wybe.com</p>
                <p className="text-xs text-gray-400">Super Admin</p>
              </div>
              <Button variant="outline" className="bg-wybe-background border-wybe-primary/30 text-wybe-primary text-xs h-8">
                Manage Permissions
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="font-medium">support@wybe.com</p>
                <p className="text-xs text-gray-400">Support Staff</p>
              </div>
              <Button variant="outline" className="bg-wybe-background border-wybe-primary/30 text-wybe-primary text-xs h-8">
                Manage Permissions
              </Button>
            </div>

            <div className="p-3 bg-white/5 rounded-lg">
              <Label htmlFor="new-admin" className="text-sm font-medium mb-2 block">Add New Admin</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="new-admin"
                  placeholder="Email address"
                  className="bg-wybe-background/40"
                />
                <Button 
                  variant="outline" 
                  className="whitespace-nowrap bg-wybe-background border-wybe-primary/30 text-wybe-primary"
                >
                  Add User
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { delay: 0.3 } }
          }}
          className="pt-4"
        >
          <Button 
            className="btn-primary"
            onClick={handleSaveSettings}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Settings"}
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default AdminSettings;
