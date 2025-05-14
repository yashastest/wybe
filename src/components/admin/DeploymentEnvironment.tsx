
import React, { useState, useEffect } from 'react';
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Rocket,
  Server,
  Globe,
  RefreshCcw,
  Copy,
  Terminal,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { integrationService } from "@/services/integrationService";
// Use a type-only import for the type to avoid name conflict
import type { DeploymentEnvironment as DeploymentEnvironmentType } from "@/services/integrationService";

export default function DeploymentEnvironment() {
  const [deploymentEnvironments, setDeploymentEnvironments] = useState<DeploymentEnvironmentType[]>([]);
  const [newEnvironment, setNewEnvironment] = useState<{
    name: string;
    network: 'mainnet' | 'testnet' | 'devnet' | 'localnet';
  }>({
    name: '',
    network: 'testnet'
  });
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [checklist, setChecklist] = useState<{id: string; label: string; checked: boolean}[]>([]);
  
  useEffect(() => {
    // Load deployment checklist
    const loadedChecklist = integrationService.getDeploymentChecklist();
    setChecklist(loadedChecklist);
    
    // TODO: Load deployment environments from service when implemented
    const mockEnvironments: DeploymentEnvironmentType[] = [
      {
        name: 'Wybe Token Production',
        url: 'https://mainnet.wybe.io/wybe-token',
        programIds: [
          'WybeTokenV1111111111111111111111111111111111',
          'WybeTreasury11111111111111111111111111111111'
        ],
        deploymentDate: Date.now() - 7 * 24 * 60 * 60 * 1000, // 7 days ago
        network: 'mainnet',
        status: 'active'
      },
      {
        name: 'Wybe DEX Staging',
        url: 'https://testnet.wybe.io/wybe-dex',
        programIds: [
          'WybeTestDex111111111111111111111111111111111',
        ],
        deploymentDate: Date.now() - 3 * 24 * 60 * 60 * 1000, // 3 days ago
        network: 'testnet',
        status: 'active'
      },
      {
        name: 'Legacy Token',
        url: 'https://mainnet.wybe.io/legacy-token',
        programIds: [
          'WybeLegacy11111111111111111111111111111111111',
        ],
        deploymentDate: Date.now() - 60 * 24 * 60 * 60 * 1000, // 60 days ago
        network: 'mainnet',
        status: 'deprecated'
      }
    ];
    
    setDeploymentEnvironments(mockEnvironments);
  }, []);
  
  const toggleChecklistItem = (id: string, checked: boolean) => {
    integrationService.updateChecklistItem(id, checked);
    
    // Update state
    setChecklist(prevChecklist => 
      prevChecklist.map(item => 
        item.id === id ? { ...item, checked } : item
      )
    );
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };
  
  const handleNetworkChange = (value: string) => {
    setNewEnvironment(prev => ({
      ...prev,
      network: value as 'mainnet' | 'testnet' | 'devnet' | 'localnet'
    }));
  };
  
  const handleDeploy = async () => {
    if (!newEnvironment.name) {
      toast.error("Please enter an environment name");
      return;
    }
    
    // Check if all deployment checklist items are completed
    const allChecked = checklist.every(item => item.checked);
    if (!allChecked) {
      toast.error("Please complete all deployment checklist items before deploying");
      return;
    }
    
    setIsDeploying(true);
    setDeploymentProgress(0);
    
    // Simulate deployment process
    const interval = setInterval(() => {
      setDeploymentProgress(prev => {
        const next = prev + Math.random() * 15;
        return next >= 100 ? 100 : next;
      });
    }, 500);
    
    try {
      // In a real implementation, this would call a deployment service
      // This is a mock implementation
      const result = await integrationService.deployFullEnvironment(
        newEnvironment.name,
        newEnvironment.network
      );
      
      clearInterval(interval);
      setDeploymentProgress(100);
      
      // Add to environments list
      setDeploymentEnvironments(prev => [result, ...prev]);
      
      // Reset form
      setNewEnvironment({
        name: '',
        network: 'testnet'
      });
      
      toast.success("Deployment completed successfully!");
    } catch (error) {
      console.error("Deployment error:", error);
      clearInterval(interval);
      toast.error("Deployment failed");
    } finally {
      setIsDeploying(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <Card className="glass-card border-wybe-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="text-orange-500" />
            Deployment Checklist
          </CardTitle>
          <CardDescription>
            Complete these items before deploying to production
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {checklist.map((item) => (
              <div key={item.id} className="flex items-center gap-2 p-2 rounded-md hover:bg-black/20">
                <input
                  type="checkbox"
                  id={`checklist-${item.id}`}
                  checked={item.checked}
                  onChange={(e) => toggleChecklistItem(item.id, e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label 
                  htmlFor={`checklist-${item.id}`}
                  className={`flex-grow text-sm ${item.checked ? 'line-through text-gray-400' : ''}`}
                >
                  {item.label}
                </label>
                {item.checked && <CheckCircle2 size={16} className="text-green-500" />}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div className="text-sm text-gray-400">
            {checklist.filter(item => item.checked).length} of {checklist.length} completed
          </div>
          <Progress 
            value={(checklist.filter(item => item.checked).length / checklist.length) * 100}
            className="h-2 w-40"
          />
        </CardFooter>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-card lg:col-span-2 border-wybe-primary/20">
          <div className="p-4 border-b border-white/10">
            <h3 className="font-bold flex items-center gap-2">
              <Server className="text-orange-500" size={18} />
              Deployment Environments
            </h3>
          </div>
          <div className="p-4 space-y-4">
            {deploymentEnvironments.map((env, index) => (
              <Card key={index} className="bg-black/20 border-white/5">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{env.name}</h4>
                        <Badge 
                          variant={env.status === 'active' ? 'default' : 'outline'}
                          className={
                            env.status === 'active' 
                              ? 'bg-green-600' 
                              : env.status === 'inactive' 
                                ? 'bg-amber-600/50' 
                                : 'bg-red-600/50'
                          }
                        >
                          {env.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400 flex items-center gap-1">
                        <Globe size={12} />
                        {env.network}
                      </p>
                    </div>
                    
                    <Badge variant="outline" className="font-mono bg-black/30">
                      {env.programIds && env.programIds.length > 0 
                        ? `${env.programIds.length} program${env.programIds.length > 1 ? 's' : ''}` 
                        : 'No programs'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-400">URL:</span>
                      <div className="flex items-center gap-1">
                        <span className="text-blue-400">{env.url}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => copyToClipboard(env.url)}
                        >
                          <Copy size={12} />
                        </Button>
                        <a 
                          href={env.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-500"
                        >
                          <ExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                    
                    {env.programIds && env.programIds.map((programId, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Program ID {idx + 1}:</span>
                        <div className="flex items-center gap-1">
                          <span className="font-mono text-xs">{`${programId.substring(0, 8)}...${programId.substring(programId.length - 8)}`}</span>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6" 
                            onClick={() => copyToClipboard(programId)}
                          >
                            <Copy size={12} />
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {env.deploymentDate && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-400">Deployed:</span>
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(env.deploymentDate).toLocaleDateString()}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {deploymentEnvironments.length === 0 && (
              <div className="text-center py-8 text-gray-400">
                <Layers className="mx-auto mb-2 opacity-20" size={40} />
                <p>No deployments found</p>
              </div>
            )}
          </div>
        </div>
        
        <Card className="glass-card border-wybe-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="text-orange-500" />
              New Deployment
            </CardTitle>
            <CardDescription>
              Deploy a new smart contract environment
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="env-name">Environment Name</Label>
              <Input 
                id="env-name" 
                placeholder="e.g. Production Token" 
                value={newEnvironment.name}
                onChange={(e) => setNewEnvironment(prev => ({ ...prev, name: e.target.value }))}
                className="bg-black/30"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="network">Target Network</Label>
              <Select 
                value={newEnvironment.network} 
                onValueChange={handleNetworkChange}
              >
                <SelectTrigger className="bg-black/30">
                  <SelectValue placeholder="Select network" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mainnet">Mainnet</SelectItem>
                  <SelectItem value="testnet">Testnet</SelectItem>
                  <SelectItem value="devnet">Devnet</SelectItem>
                  <SelectItem value="localnet">Local Development</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {newEnvironment.network === 'mainnet' && (
              <div className="p-3 rounded-md border border-amber-500/30 bg-amber-500/10 text-sm flex items-start gap-2">
                <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-amber-500">Warning</p>
                  <p className="text-gray-300">Mainnet deployments cannot be reversed and will incur network fees.</p>
                </div>
              </div>
            )}
            
            {isDeploying && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Deployment progress</span>
                  <span>{Math.round(deploymentProgress)}%</span>
                </div>
                <Progress value={deploymentProgress} className="h-2" />
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600"
              onClick={handleDeploy}
              disabled={isDeploying || !newEnvironment.name}
            >
              {isDeploying ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Deploying...
                </>
              ) : (
                <>
                  <Rocket className="mr-2 h-4 w-4" />
                  Deploy Environment
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
