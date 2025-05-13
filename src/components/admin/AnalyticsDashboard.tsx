
import React from 'react';
import { motion } from "framer-motion";
import {
  BarChart3,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Users,
  CreditCard
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

// Generate sample data for charts
const generateTradingVolumeData = () => {
  const data = [];
  const today = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);
    
    // Generate a random amount between 50k and 500k
    const amount = Math.floor(Math.random() * 450000) + 50000;
    
    data.push({
      date: date.toISOString().slice(0, 10),
      amount: amount,
    });
  }
  
  return data;
};

const tradingVolumeData = generateTradingVolumeData();

const AnalyticsDashboard = () => {
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
      <h2 className="text-xl font-bold mb-6">Platform Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="glass-card p-4 bg-gradient-to-r from-purple-500/20 to-transparent"
        >
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-400">Total Tokens Launched</p>
            <div className="bg-purple-500/20 p-2 rounded-full">
              <BarChart3 size={16} className="text-purple-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gradient mb-1">247</h3>
          <div className="flex items-center text-xs text-green-400">
            <ArrowUpRight size={12} className="mr-1" />
            <span>+12% from last month</span>
          </div>
        </motion.div>
        
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { delay: 0.1 } }
          }}
          className="glass-card p-4 bg-gradient-to-r from-blue-500/20 to-transparent"
        >
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-400">Total Trading Volume</p>
            <div className="bg-blue-500/20 p-2 rounded-full">
              <TrendingUp size={16} className="text-blue-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gradient mb-1">$4.2M</h3>
          <div className="flex items-center text-xs text-green-400">
            <ArrowUpRight size={12} className="mr-1" />
            <span>+8.3% from last month</span>
          </div>
        </motion.div>
        
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { delay: 0.2 } }
          }}
          className="glass-card p-4 bg-gradient-to-r from-green-500/20 to-transparent"
        >
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm text-gray-400">Active Users</p>
            <div className="bg-green-500/20 p-2 rounded-full">
              <Users size={16} className="text-green-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gradient mb-1">5,487</h3>
          <div className="flex items-center text-xs text-green-400">
            <ArrowUpRight size={12} className="mr-1" />
            <span>+15.7% from last month</span>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { delay: 0.3 } }
        }}
        className="glass-card p-4 h-64 bg-gradient-to-b from-wybe-background-light to-transparent mb-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium flex items-center gap-2">
            <Activity size={18} className="text-wybe-primary" />
            Trading Volume (Last 30 Days)
          </h3>
          <div className="bg-wybe-primary/20 text-wybe-primary px-3 py-1 rounded-full text-xs">
            $4.2M Total
          </div>
        </div>
        <ResponsiveContainer width="100%" height="75%">
          <AreaChart data={tradingVolumeData}>
            <defs>
              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 10 }}
              tickFormatter={(value) => {
                const date = new Date(value);
                return `${date.getDate()}/${date.getMonth() + 1}`;
              }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#666', fontSize: 10 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <CartesianGrid stroke="#444" strokeDasharray="5 5" vertical={false}  opacity={0.1} />
            <Tooltip 
              formatter={(value) => [`$${value.toLocaleString()}`, "Volume"]}
              labelFormatter={(label) => `Date: ${new Date(label).toLocaleDateString()}`}
              contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', borderRadius: '8px' }}
            />
            <Area 
              type="monotone" 
              dataKey="amount" 
              stroke="#8B5CF6" 
              fillOpacity={1} 
              fill="url(#colorVolume)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { delay: 0.4 } }
          }}
          className="glass-card p-4 bg-gradient-to-r from-red-500/10 to-transparent"
        >
          <h3 className="text-lg font-medium mb-3">Top Performing Tokens</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-white/5 rounded">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-wybe-primary/20 flex items-center justify-center">
                  <span className="text-xs">🐶</span>
                </div>
                <div>
                  <p className="font-medium">Doge Sol</p>
                  <p className="text-xs text-gray-400">DSOL</p>
                </div>
              </div>
              <div className="text-green-400 text-sm">+124.5%</div>
            </div>
            <div className="flex justify-between items-center p-2 bg-white/5 rounded">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-wybe-primary/20 flex items-center justify-center">
                  <span className="text-xs">🐸</span>
                </div>
                <div>
                  <p className="font-medium">Pepe Solana</p>
                  <p className="text-xs text-gray-400">PEPES</p>
                </div>
              </div>
              <div className="text-green-400 text-sm">+98.2%</div>
            </div>
            <div className="flex justify-between items-center p-2 bg-white/5 rounded">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-wybe-primary/20 flex items-center justify-center">
                  <span className="text-xs">🦊</span>
                </div>
                <div>
                  <p className="font-medium">Floki Fortune</p>
                  <p className="text-xs text-gray-400">FLOKIF</p>
                </div>
              </div>
              <div className="text-green-400 text-sm">+67.3%</div>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { delay: 0.5 } }
          }}
          className="glass-card p-4 bg-gradient-to-r from-yellow-500/10 to-transparent"
        >
          <h3 className="text-lg font-medium mb-3">Revenue Overview</h3>
          <div className="grid grid-cols-2 gap-4 mb-3">
            <div className="bg-white/5 p-3 rounded">
              <p className="text-xs text-gray-400 mb-1">Total Revenue</p>
              <p className="text-lg font-medium">14,780 SOL</p>
            </div>
            <div className="bg-white/5 p-3 rounded">
              <p className="text-xs text-gray-400 mb-1">Platform Fee</p>
              <p className="text-lg font-medium">2.5%</p>
            </div>
          </div>
          <div className="bg-white/5 p-3 rounded mb-3">
            <div className="flex justify-between mb-1">
              <p className="text-xs text-gray-400">Revenue Target (Monthly)</p>
              <p className="text-xs text-white">75%</p>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-wybe-primary to-purple-400" style={{ width: '75%' }}></div>
            </div>
          </div>
          <div className="flex justify-between text-sm">
            <p className="text-gray-400">Next payout</p>
            <p>May 31, 2025</p>
          </div>
        </motion.div>
      </div>
      
      <motion.div 
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { delay: 0.6 } }
        }}
      >
        <p className="text-center text-gray-400 text-sm">
          Analytics data last updated: {new Date().toLocaleString()}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default AnalyticsDashboard;
