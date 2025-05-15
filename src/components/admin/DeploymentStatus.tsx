import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DeploymentStep } from '@/services/integrationService';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

interface DeploymentStatusProps {
  deploymentNetwork: string;
  deploymentProgress: number;
  currentStepIndex: number;
  steps: DeploymentStep[];
}

export const DeploymentStatus: React.FC<DeploymentStatusProps> = ({
  deploymentNetwork,
  deploymentProgress,
  currentStepIndex,
  steps
}) => {
  const getDeploymentSummary = () => {
    const completed = steps.filter(step => step.status === 'completed').length;
    const failed = steps.filter(step => step.status === 'failed').length;
    const inProgress = steps.filter(step => step.status === 'in-progress').length;
    const pending = steps.filter(step => step.status === 'pending').length;
    
    return {
      completed,
      failed,
      inProgress,
      pending,
      total: steps.length
    };
  };
  
  const summary = getDeploymentSummary();
  
  const getNetworkInfo = () => {
    switch(deploymentNetwork) {
      case 'mainnet':
        return {
          name: 'Mainnet',
          url: 'https://api.mainnet-beta.solana.com',
          explorer: 'https://explorer.solana.com',
          status: 'Production'
        };
      case 'testnet':
        return {
          name: 'Testnet',
          url: 'https://api.testnet.solana.com',
          explorer: 'https://explorer.solana.com/?cluster=testnet',
          status: 'Testing'
        };
      case 'devnet':
        return {
          name: 'Devnet',
          url: 'https://api.devnet.solana.com',
          explorer: 'https://explorer.solana.com/?cluster=devnet',
          status: 'Development'
        };
      default:
        return {
          name: 'Localnet',
          url: 'http://localhost:8899',
          explorer: 'N/A',
          status: 'Local Development'
        };
    }
  };
  
  const networkInfo = getNetworkInfo();
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-black/20 border border-white/10">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Deployment Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Completed steps:</span>
                <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500/30">
                  {summary.completed}/{summary.total}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">In progress:</span>
                <Badge variant="outline" className="bg-orange-500/20 text-orange-400 border-orange-500/30">
                  {summary.inProgress}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Failed steps:</span>
                <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500/30">
                  {summary.failed}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Pending steps:</span>
                <Badge variant="outline" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {summary.pending}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total steps:</span>
                <span className="font-medium">{summary.total}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Current step:</span>
                <span className="font-medium">
                  {currentStepIndex + 1} - {steps[currentStepIndex]?.title || 'N/A'}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Overall progress:</span>
                <span className="font-medium text-orange-400">{deploymentProgress}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-black/20 border border-white/10">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium mb-4">Network Information</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Network:</span>
                <Badge className={
                  deploymentNetwork === 'mainnet' 
                    ? 'bg-red-500' 
                    : deploymentNetwork === 'testnet'
                      ? 'bg-orange-500'
                      : deploymentNetwork === 'devnet'
                        ? 'bg-blue-500'
                        : 'bg-green-500'
                }>
                  {networkInfo.name}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">RPC Endpoint:</span>
                <span className="text-sm font-mono truncate max-w-[200px]">{networkInfo.url}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Block Explorer:</span>
                <a 
                  href={networkInfo.explorer}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline text-sm"
                >
                  {networkInfo.explorer !== 'N/A' ? 'View Explorer' : 'N/A'}
                </a>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Environment:</span>
                <Badge variant="outline" className={
                  deploymentNetwork === 'mainnet' 
                    ? 'bg-red-500/20 text-red-400 border-red-500/30' 
                    : 'bg-green-500/20 text-green-400 border-green-500/30'
                }>
                  {networkInfo.status}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Estimated cost:</span>
                <span className="font-medium">
                  {deploymentNetwork === 'mainnet' 
                    ? '~7.5 SOL' 
                    : deploymentNetwork === 'testnet'
                      ? '~5 SOL'
                      : '~2 SOL'
                  }
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Fee parameters:</span>
                <span className="font-medium">2.5% trade / 1% mint</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Transaction confirmation:</span>
                <span className="font-medium">
                  {deploymentNetwork === 'mainnet' 
                    ? '~12 seconds' 
                    : '~6 seconds'
                  }
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-black/20 border border-white/10">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4">Deployed Programs</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 px-4 font-medium text-gray-400">Program</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-400">Program ID</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-400">Status</th>
                  <th className="text-left py-2 px-4 font-medium text-gray-400">Transaction</th>
                </tr>
              </thead>
              <tbody>
                {deploymentNetwork === 'testnet' ? (
                  <>
                    <tr className="border-b border-white/5">
                      <td className="py-2 px-4">Token Program</td>
                      <td className="py-2 px-4 font-mono text-xs">WybeToken111111111111111111111111111111111</td>
                      <td className="py-2 px-4">
                        <Badge className="bg-green-500">Active</Badge>
                      </td>
                      <td className="py-2 px-4 font-mono text-xs">5jQ77E3hZ...</td>
                    </tr>
                    <tr className="border-b border-white/5">
                      <td className="py-2 px-4">Treasury Program</td>
                      <td className="py-2 px-4 font-mono text-xs">WybeTreasury11111111111111111111111111111</td>
                      <td className="py-2 px-4">
                        <Badge className="bg-green-500">Active</Badge>
                      </td>
                      <td className="py-2 px-4 font-mono text-xs">9kPR2z5N7...</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4">Oracle Program</td>
                      <td className="py-2 px-4 font-mono text-xs">WybeOracle1111111111111111111111111111111</td>
                      <td className="py-2 px-4">
                        <Badge className="bg-amber-500">Pending</Badge>
                      </td>
                      <td className="py-2 px-4 font-mono text-xs">-</td>
                    </tr>
                  </>
                ) : deploymentNetwork === 'mainnet' ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-400">
                      No programs deployed to mainnet yet
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={4} className="py-6 text-center text-gray-400">
                      No programs deployed to {deploymentNetwork} yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
