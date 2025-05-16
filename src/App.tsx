
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Discover from "./pages/Discover";
import Launch from "./pages/Launch";
import TradeDemo from "./pages/TradeDemo";
import Package from "./pages/Package";
import NotFound from "./pages/NotFound";
import SecurityReport from "./pages/SecurityReport";
import BondingCurves from "./pages/BondingCurves";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/launch" element={<Launch />} />
        <Route path="/trade-demo" element={<TradeDemo />} />
        <Route path="/package" element={<Package />} />
        <Route path="/security-report" element={<SecurityReport />} />
        <Route path="/bonding-curves" element={<BondingCurves />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
