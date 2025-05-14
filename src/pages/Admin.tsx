import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { toast } from "sonner";
import { 
  Settings, 
  BarChart4, 
  ChevronRight, 
  ExternalLink, 
  Code, 
  Copy,
  Edit,
  Trash2,
  Plus,
  Save,
  XCircle,
  AlertTriangle,
  RefreshCcw,
  ToggleLeft,
  ToggleRight,
  FileCode2,
  Rocket,
  Server,
  Globe,
  Terminal,
  CheckCircle2,
  Clock,
  Layers,
  UserPlus,
  Shield,
  Mail,
  Lock,
  Download,
  XCircle as XCircleIcon,
  CheckCircle as CheckCircleIcon,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

import AnchorStatusCard from '@/components/admin/AnchorStatusCard';
import SmartContractTestnet from '@/components/admin/SmartContractTestnet';
import DeploymentEnvironment from '@/components/admin/DeploymentEnvironment';
import AdminUserManager from '@/components/admin/AdminUserManager';
import MasterDeploymentGuide from '@/pages/MasterDeploymentGuide';

const Admin = () => {
  const [activeTab, setActiveTab] = useState("status");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a stored active tab in localStorage
    const storedTab = localStorage.getItem('admin-active-tab');
    if (storedTab) {
      setActiveTab(storedTab);
      localStorage.removeItem('admin-active-tab');
    }

    // Listen for custom event to switch to guide tab
    const handleGuideTabRequest = () => {
      setActiveTab('guide');
    };

    document.addEventListener('guide-tab-request', handleGuideTabRequest);

    return () => {
      document.removeEventListener('guide-tab-request', handleGuideTabRequest);
    };
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container py-10 space-y-6"
    >
      <div className="text-center">
        <h1 className="text-3xl font-bold font-poppins">Admin Panel</h1>
        <p className="text-gray-400">Manage your smart contracts and deployments</p>
      </div>

      <Tabs defaultValue={activeTab} className="space-y-4" onValueChange={handleTabChange}>
        <TabsList className="w-full justify-center">
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="deployment">Deployment</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="guide" data-tab="guide">Deployment Guide</TabsTrigger>
        </TabsList>
        <TabsContent value="status" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnchorStatusCard isAdminPanel={true} />
            <Card className="glass-card p-5 border-wybe-primary/20">
              <CardHeader>
                <CardTitle className="text-lg font-semibold font-poppins">Quick Actions</CardTitle>
                <CardDescription>Manage your smart contracts and deployments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start" onClick={() => navigate('/admin/contracts')}>
                  <FileCode2 className="mr-2 h-4 w-4" />
                  Manage Contracts
                </Button>
                <Button className="w-full justify-start" onClick={() => navigate('/admin/deployment')}>
                  <Rocket className="mr-2 h-4 w-4" />
                  Manage Deployments
                </Button>
                <Button className="w-full justify-start" onClick={() => navigate('/admin/users')}>
                  <Shield className="mr-2 h-4 w-4" />
                  Manage Users
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="contracts" className="space-y-4">
          <SmartContractTestnet />
        </TabsContent>
        <TabsContent value="deployment" className="space-y-4">
          <DeploymentEnvironment />
        </TabsContent>
        <TabsContent value="users" className="space-y-4">
          <AdminUserManager />
        </TabsContent>
        <TabsContent value="guide" className="space-y-4">
          <MasterDeploymentGuide />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Admin;
