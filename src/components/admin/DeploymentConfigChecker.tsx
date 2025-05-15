
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  RefreshCw,
  Settings,
  Shield,
  Network,
  FileCheck
} from "lucide-react";

interface ConfigCheck {
  id: string;
  name: string;
  description: string;
  status: 'success' | 'warning' | 'error' | 'pending';
  details?: string;
}

interface DeploymentConfigCheckerProps {
  environment: 'devnet' | 'testnet' | 'mainnet';
  onFixIssue?: (checkId: string) => void;
}

const DeploymentConfigChecker: React.FC<DeploymentConfigCheckerProps> = ({
  environment,
  onFixIssue
}) => {
  const [isChecking, setIsChecking] = useState(false);
  const [checks, setChecks] = useState<ConfigCheck[]>([
    {
      id: 'rpc_endpoint',
      name: 'RPC Endpoint Configuration',
      description: 'Verify the Solana RPC endpoint is correctly configured and accessible.',
      status: 'pending'
    },
    {
      id: 'contract_deployed',
      name: 'Smart Contract Deployment',
      description: 'Check if the token contract has been deployed to the selected network.',
      status: 'pending'
    },
    {
      id: 'env_variables',
      name: 'Environment Variables',
      description: 'Verify all required environment variables are set correctly.',
      status: 'pending'
    },
    {
      id: 'treasury_wallet',
      name: 'Treasury Wallet Setup',
      description: 'Check if the treasury wallet is properly configured and funded.',
      status: 'pending'
    },
    {
      id: 'security_audit',
      name: 'Security Audit Status',
      description: 'Verify that security audits have been completed.',
      status: 'pending'
    },
  ]);
  
  useEffect(() => {
    // Run checks automatically on component mount
    runChecks();
  }, [environment]);
  
  const runChecks = async () => {
    setIsChecking(true);
    
    // Reset all checks to pending
    setChecks(prevChecks => prevChecks.map(check => ({
      ...check,
      status: 'pending'
    })));
    
    // Simulate check process (would be real checks in production)
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Update check results based on environment
    setChecks(prevChecks => {
      return prevChecks.map(check => {
        // Simulated results based on environment
        if (environment === 'mainnet') {
          if (check.id === 'security_audit') {
            return {
              ...check,
              status: 'warning',
              details: 'Security audit is pending final review.'
            };
          } else if (check.id === 'treasury_wallet') {
            return {
              ...check,
              status: 'error',
              details: 'Treasury wallet needs additional funds for mainnet operation.'
            };
          }
        }
        
        if (environment === 'testnet' || environment === 'devnet') {
          if (check.id === 'security_audit') {
            return {
              ...check,
              status: 'success',
              details: 'Not required for testnet/devnet deployment.'
            };
          }
        }
        
        // Default to success for demo
        return {
          ...check,
          status: Math.random() > 0.3 ? 'success' : 'warning',
          details: Math.random() > 0.3 
            ? 'Configuration looks good.' 
            : 'Possible optimization opportunity identified.'
        };
      });
    });
    
    setIsChecking(false);
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
      default:
        return <RefreshCw className="h-5 w-5 text-gray-400 animate-spin" />;
    }
  };
  
  const getCheckIcon = (checkId: string) => {
    switch (checkId) {
      case 'rpc_endpoint':
        return <Network className="h-5 w-5 text-blue-400" />;
      case 'contract_deployed':
        return <FileCheck className="h-5 w-5 text-purple-400" />;
      case 'env_variables':
        return <Settings className="h-5 w-5 text-orange-400" />;
      case 'treasury_wallet':
        return <Shield className="h-5 w-5 text-green-400" />;
      case 'security_audit':
        return <Shield className="h-5 w-5 text-red-400" />;
      default:
        return <Settings className="h-5 w-5 text-gray-400" />;
    }
  };
  
  const handleFixIssue = (check: ConfigCheck) => {
    toast.info(`Attempting to fix issue: ${check.name}`);
    
    if (onFixIssue) {
      onFixIssue(check.id);
    } else {
      // Default fix action for demo
      setTimeout(() => {
        setChecks(prevChecks => {
          return prevChecks.map(c => {
            if (c.id === check.id) {
              return {
                ...c,
                status: 'success',
                details: 'Issue automatically resolved.'
              };
            }
            return c;
          });
        });
        
        toast.success(`Fixed: ${check.name}`);
      }, 1500);
    }
  };
  
  // Calculate overall deployment readiness
  const totalChecks = checks.length;
  const successfulChecks = checks.filter(check => check.status === 'success').length;
  const warningChecks = checks.filter(check => check.status === 'warning').length;
  const errorChecks = checks.filter(check => check.status === 'error').length;
  
  const deploymentReady = errorChecks === 0 && warningChecks < 2;
  
  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-xl">
          <Settings className="mr-2 text-orange-500" />
          Deployment Configuration Check
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-400">Environment: </span>
            <span className="text-sm font-medium capitalize">{environment}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={runChecks}
            disabled={isChecking}
            className="bg-black/30 border-orange-500/30 text-orange-400 hover:bg-orange-900/20 hover:text-orange-300"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isChecking ? 'animate-spin' : ''}`} />
            Refresh Checks
          </Button>
        </div>
        
        {/* Deployment readiness status */}
        {!isChecking && (
          <Alert variant={deploymentReady ? "default" : "destructive"} className="bg-opacity-20">
            {deploymentReady ? (
              <CheckCircle2 className="h-4 w-4 text-green-500" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <AlertDescription>
              {deploymentReady 
                ? `Ready for ${environment} deployment! ${successfulChecks}/${totalChecks} checks passed.`
                : `Not ready for deployment. ${errorChecks} critical issues and ${warningChecks} warnings need attention.`
              }
            </AlertDescription>
          </Alert>
        )}
        
        {/* Individual checks */}
        <div className="space-y-3 mt-4">
          {checks.map((check) => (
            <div 
              key={check.id} 
              className={`p-3 rounded-md border ${
                check.status === 'success' ? 'border-green-500/20 bg-green-900/10' :
                check.status === 'warning' ? 'border-yellow-500/20 bg-yellow-900/10' :
                check.status === 'error' ? 'border-red-500/20 bg-red-900/10' :
                'border-gray-500/20 bg-gray-900/10'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {getStatusIcon(check.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    {getCheckIcon(check.id)}
                    <h4 className="ml-2 font-medium">{check.name}</h4>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{check.description}</p>
                  
                  {check.details && (
                    <p className={`text-xs mt-1 ${
                      check.status === 'success' ? 'text-green-400' :
                      check.status === 'warning' ? 'text-yellow-400' :
                      check.status === 'error' ? 'text-red-400' :
                      'text-gray-400'
                    }`}>
                      {check.details}
                    </p>
                  )}
                  
                  {(check.status === 'warning' || check.status === 'error') && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleFixIssue(check)}
                      className="mt-2 h-7 text-xs"
                    >
                      Fix Issue
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DeploymentConfigChecker;
