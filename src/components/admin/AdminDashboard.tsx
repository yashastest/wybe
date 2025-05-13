
import React from "react";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Users,
  Package,
  Coins,
  ArrowUp,
  ArrowDown,
  Calendar,
  Clock
} from "lucide-react";

// Statistics component for admin dashboard
const AdminDashboard = () => {
  const statistics = [
    {
      title: "Total Meme Coins",
      value: "382",
      trend: "+12%",
      trendDirection: "up",
      icon: <Coins className="h-8 w-8" />,
      color: "bg-gradient-to-r from-purple-500/20 to-indigo-500/20"
    },
    {
      title: "Active Users",
      value: "2,845",
      trend: "+7%",
      trendDirection: "up",
      icon: <Users className="h-8 w-8" />,
      color: "bg-gradient-to-r from-blue-500/20 to-cyan-500/20"
    },
    {
      title: "Total Volume",
      value: "$5.2M",
      trend: "+24%",
      trendDirection: "up",
      icon: <BarChart3 className="h-8 w-8" />,
      color: "bg-gradient-to-r from-green-500/20 to-emerald-500/20"
    },
    {
      title: "Pending Approvals",
      value: "12",
      trend: "-3",
      trendDirection: "down",
      icon: <Package className="h-8 w-8" />,
      color: "bg-gradient-to-r from-amber-500/20 to-yellow-500/20"
    }
  ];

  const recentAlerts = [
    {
      type: "warning",
      message: "Unusual trading volume detected for MOON token",
      time: "10 minutes ago"
    },
    {
      type: "error",
      message: "Failed contract deployment for PEPEX",
      time: "25 minutes ago"
    },
    {
      type: "success",
      message: "New high-performance token SHDOGE qualified for 40% rewards",
      time: "1 hour ago"
    },
    {
      type: "info",
      message: "System maintenance completed successfully",
      time: "2 hours ago"
    }
  ];

  const upcomingEvents = [
    {
      title: "Review CATMEME whitelist application",
      date: "Today, 2:00 PM"
    },
    {
      title: "Launch new promotional campaign",
      date: "Tomorrow, 10:00 AM"
    },
    {
      title: "Smart contract audit review",
      date: "May 15, 2023"
    }
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gradient mb-6">Admin Dashboard</h2>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statistics.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`glass-card p-6 ${stat.color} hover:shadow-glow-sm transition-all`}
          >
            <div className="flex justify-between mb-4">
              <div>
                <h3 className="text-sm text-gray-400">{stat.title}</h3>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className="rounded-full p-2 bg-black/30">{stat.icon}</div>
            </div>
            <div className="flex items-center text-sm">
              {stat.trendDirection === "up" ? (
                <ArrowUp className="h-4 w-4 text-green-400 mr-1" />
              ) : (
                <ArrowDown className="h-4 w-4 text-red-400 mr-1" />
              )}
              <span className={stat.trendDirection === "up" ? "text-green-400" : "text-red-400"}>
                {stat.trend}
              </span>
              <span className="text-gray-400 ml-1">vs last week</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="glass-card p-6 lg:col-span-2"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Alerts</h3>
            <button className="text-wybe-primary text-sm hover:underline">View all</button>
          </div>
          
          <div className="space-y-3">
            {recentAlerts.map((alert, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index + 0.4, duration: 0.5 }}
                className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
              >
                {alert.type === "warning" && (
                  <div className="p-2 rounded-full bg-amber-500/20">
                    <AlertTriangle size={16} className="text-amber-500" />
                  </div>
                )}
                {alert.type === "error" && (
                  <div className="p-2 rounded-full bg-red-500/20">
                    <AlertTriangle size={16} className="text-red-500" />
                  </div>
                )}
                {alert.type === "success" && (
                  <div className="p-2 rounded-full bg-green-500/20">
                    <CheckCircle size={16} className="text-green-500" />
                  </div>
                )}
                {alert.type === "info" && (
                  <div className="p-2 rounded-full bg-blue-500/20">
                    <Activity size={16} className="text-blue-500" />
                  </div>
                )}
                <div>
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-gray-400">{alert.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-semibold mb-4">Upcoming Events</h3>
          
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index + 0.5, duration: 0.5 }}
                className="flex items-start gap-3"
              >
                <div className="p-2 rounded-full bg-wybe-primary/20 mt-1">
                  {event.date.includes("Today") ? (
                    <Clock size={16} className="text-wybe-primary" />
                  ) : (
                    <Calendar size={16} className="text-wybe-primary" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">{event.title}</p>
                  <p className="text-xs text-gray-400">{event.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <button className="mt-6 w-full py-2 border border-wybe-primary/30 rounded-lg text-sm text-wybe-primary hover:bg-wybe-primary/10 transition-colors">
            + Add New Event
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
