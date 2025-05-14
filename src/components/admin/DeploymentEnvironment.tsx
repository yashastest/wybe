
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Check, AlertCircle, Settings, RefreshCcw, Server } from "lucide-react";
import { motion } from "framer-motion";
import { DeploymentEnvironment, integrationService } from "@/services/integrationService";

const DeploymentEnvironmentPage = () => {
  const [activeTab, setActiveTab] = useState<string>("environments");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [environments, setEnvironments] = useState<DeploymentEnvironment[]>([]);
  const [networkType, setNetworkType] = useState<"testnet" | "devnet" | "mainnet">("testnet");
  const [projectName, setProjectName] = useState<string>("Wybe Token Platform");
  const [deploymentStatus, setDeploymentStatus] = useState<{
    success: boolean;
    message: string;
    timestamp?: string;
  } | null>(null);

  // Load environments
  useEffect(() => {
    setIsLoading(true);
    const envs = integrationService.getDeploymentEnvironments();
    
    // Convert from the deployment checklist format to our environment format
    setEnvironments(envs);
    setIsLoading(false);
  }, []);

  // Handle environment selection
  const handleEnvironmentSelect = (id: string) => {
    setEnvironments(prev => 
      prev.map(env => ({
        ...env,
        checked: env.id === id ? !env.checked : env.checked
      }))
    );
  };

  // Handle deployment
  const handleDeploy = async () => {
    if (!projectName.trim()) {
      toast.error("Please enter a project name");
      return;
    }
    
    setIsDeploying(true);
    
    try {
      const result = await integrationService.deployFullEnvironment(projectName, networkType);
      
      setDeploymentStatus({
        success: true,
        message: result.message,
        timestamp: result.timestamp
      });
      
      toast.success("Deployment successful!");
    } catch (error) {
      console.error("Deployment error:", error);
      
      setDeploymentStatus({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred"
      });
      
      toast.error("Deployment failed!");
    } finally {
      setIsDeploying(false);
    }
  };

  // Reset deployment status
  const handleReset = () => {
    setDeploymentStatus(null);
    setNetworkType("testnet");
    setProjectName("Wybe Token Platform");
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Server className="text-orange-500" size={22} />
            Deployment Environment
          </h2>
          <p className="text-gray-400 text-sm">Configure and manage your deployment environments</p>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full bg-black/40 border border-wybe-primary/20 rounded-md p-1">
          <TabsTrigger value="environments" className="w-full">
            Environments
          </TabsTrigger>
          <TabsTrigger value="deploy" className="w-full">
            Deploy
          </TabsTrigger>
          <TabsTrigger value="logs" className="w-full">
            Logs
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="environments" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {isLoading ? (
              <div className="col-span-2 flex justify-center py-10">
                <RefreshCcw className="animate-spin text-wybe-primary" size={24} />
              </div>
            ) : (
              <>
                {environments.map((env) => (
                  <Card key={env.id} className="glass-card">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            checked={env.checked} 
                            onCheckedChange={() => handleEnvironmentSelect(env.id)}
                            className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                          />
                          <CardTitle className="text-base">{env.label}</CardTitle>
                        </div>
                        <div>
                          <Settings className="w-4 h-4 text-gray-400 cursor-pointer hover:text-white" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-400">
                      <p>Configure this environment for deployment.</p>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="deploy" className="pt-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Deploy Your Project</CardTitle>
              <CardDescription>
                Select the target network and deploy your project
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input 
                  id="project-name" 
                  placeholder="Enter project name" 
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="bg-black/30"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Target Network</Label>
                <div className="flex border border-white/20 rounded-md overflow-hidden w-full">
                  <button 
                    onClick={() => setNetworkType("testnet")} 
                    className={`flex-1 px-3 py-2 text-sm ${networkType === 'testnet' ? 'bg-wybe-primary text-white' : 'bg-transparent text-gray-400'}`}
                  >
                    Testnet
                  </button>
                  <button 
                    onClick={() => setNetworkType("devnet")} 
                    className={`flex-1 px-3 py-2 text-sm ${networkType === 'devnet' ? 'bg-wybe-primary text-white' : 'bg-transparent text-gray-400'}`}
                  >
                    Devnet
                  </button>
                  <button 
                    onClick={() => setNetworkType("mainnet")} 
                    className={`flex-1 px-3 py-2 text-sm ${networkType === 'mainnet' ? 'bg-orange-600 text-white' : 'bg-transparent text-gray-400'}`}
                  >
                    Mainnet
                  </button>
                </div>
              </div>
              
              {deploymentStatus && (
                <div className={`p-4 rounded-md ${deploymentStatus.success ? 'bg-green-500/20 border border-green-500/40' : 'bg-red-500/20 border border-red-500/40'}`}>
                  <div className="flex items-start gap-3">
                    {deploymentStatus.success ? (
                      <Check className="text-green-400 mt-0.5" size={18} />
                    ) : (
                      <AlertCircle className="text-red-400 mt-0.5" size={18} />
                    )}
                    <div>
                      <p className="font-medium">{deploymentStatus.success ? 'Deployment Successful' : 'Deployment Failed'}</p>
                      <p className="text-sm mt-1">{deploymentStatus.message}</p>
                      {deploymentStatus.timestamp && (
                        <p className="text-xs mt-2 text-gray-400">
                          {new Date(deploymentStatus.timestamp).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            
            <div className="px-6 pb-6 flex gap-3">
              {!deploymentStatus ? (
                <Button 
                  onClick={handleDeploy}
                  disabled={isDeploying || !projectName.trim()}
                  className="bg-orange-500 hover:bg-orange-600 w-full"
                >
                  {isDeploying ? (
                    <>
                      <RefreshCcw size={16} className="mr-2 animate-spin" />
                      Deploying...
                    </>
                  ) : (
                    'Deploy Project'
                  )}
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={handleReset}
                    variant="outline"
                    className="border-white/20 w-full"
                  >
                    Reset
                  </Button>
                  
                  {deploymentStatus.success && (
                    <Button className="bg-green-600 hover:bg-green-700 w-full">
                      View Deployment
                    </Button>
                  )}
                </>
              )}
            </div>
          </Card>
        </TabsContent>
        
        <TabsContent value="logs" className="pt-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Deployment Logs</CardTitle>
              <CardDescription>
                View recent deployment logs
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="bg-black/50 rounded-md p-4 font-mono text-sm text-gray-300 h-80 overflow-y-auto">
                <div className="text-green-400">[INFO] 2023-11-15 15:42:18 - Starting deployment process...</div>
                <div className="text-gray-400">[DEBUG] 2023-11-15 15:42:19 - Loading configuration from anchor.toml</div>
                <div className="text-gray-400">[DEBUG] 2023-11-15 15:42:20 - Verifying wallet connection</div>
                <div className="text-blue-400">[COMMAND] 2023-11-15 15:42:21 - anchor build</div>
                <div className="text-green-400">[SUCCESS] 2023-11-15 15:43:15 - Build completed successfully</div>
                <div className="text-blue-400">[COMMAND] 2023-11-15 15:43:16 - anchor deploy --provider.cluster devnet</div>
                <div className="text-yellow-400">[WARN] 2023-11-15 15:43:20 - Low balance in deployment wallet</div>
                <div className="text-green-400">[SUCCESS] 2023-11-15 15:44:30 - Deployment to devnet successful</div>
                <div className="text-gray-400">[INFO] 2023-11-15 15:44:31 - Program ID: DevFbH3T2sjrJoH5zL8WPpkGBWc3sRJYPvAf4GwAqsGY</div>
                <div className="text-blue-400">[COMMAND] 2023-11-15 15:44:35 - anchor test</div>
                <div className="text-green-400">[SUCCESS] 2023-11-15 15:46:12 - All tests passed successfully</div>
                <div className="text-green-400">[INFO] 2023-11-15 15:46:15 - Deployment process completed</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default DeploymentEnvironmentPage;
