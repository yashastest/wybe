
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Discover from "./pages/Discover";
import Launch from "./pages/Launch";
import TradeDemo from "./pages/TradeDemo";
import NotFound from "./pages/NotFound";
import SecurityReport from "./pages/SecurityReport";
import BondingCurves from "./pages/BondingCurves";
import Dashboard from "./pages/Dashboard";
// Corrected imports for pages that were causing errors
import LaunchPackage from "./pages/LaunchPackage"; // Changed from Package to LaunchPackage
import Index from "./pages/Index"; // Changed from Home to Index

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/launch" element={<Launch />} />
        <Route path="/trade-demo" element={<TradeDemo />} />
        <Route path="/package" element={<LaunchPackage />} />
        <Route path="/security-report" element={<SecurityReport />} />
        <Route path="/bonding-curves" element={<BondingCurves />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
