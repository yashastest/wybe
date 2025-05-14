
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCcw, CheckCircle2, Bug } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface DeploymentTestsProps {
  isRunningTest: boolean;
  onRunTests: () => void;
  deploymentNetwork: string;
}

interface TestCase {
  id: string;
  name: string;
  description: string;
  status: 'passed' | 'failed' | 'pending';
  runtime?: string;
  error?: string;
}

export const DeploymentTests: React.FC<DeploymentTestsProps> = ({
  isRunningTest,
  onRunTests,
  deploymentNetwork
}) => {
  const [testCategory, setTestCategory] = useState<string>('functional');
  
  const functionalTests: TestCase[] = [
    {
      id: 'test-token-minting',
      name: 'Token Minting',
      description: 'Tests the token creation and minting process',
      status: 'passed',
      runtime: '1.2s'
    },
    {
      id: 'test-token-transfer',
      name: 'Token Transfer',
      description: 'Tests the transfer functionality between wallets',
      status: 'passed',
      runtime: '0.8s'
    },
    {
      id: 'test-fee-calculation',
      name: 'Fee Calculation',
      description: 'Tests the correct fee calculation and distribution',
      status: 'passed',
      runtime: '1.5s'
    },
    {
      id: 'test-treasury-allocation',
      name: 'Treasury Allocation',
      description: 'Tests the 1% allocation to treasury on mint',
      status: 'passed',
      runtime: '1.1s'
    }
  ];
  
  const securityTests: TestCase[] = [
    {
      id: 'test-unauthorized-access',
      name: 'Unauthorized Access',
      description: 'Tests protection against unauthorized access',
      status: 'passed',
      runtime: '2.1s'
    },
    {
      id: 'test-overflow-protection',
      name: 'Overflow Protection',
      description: 'Tests integer overflow protection',
      status: 'passed',
      runtime: '1.3s'
    },
    {
      id: 'test-reentrancy',
      name: 'Reentrancy Protection',
      description: 'Tests protection against reentrancy attacks',
      status: 'failed',
      runtime: '1.7s',
      error: 'Contract state not properly reset after call'
    }
  ];
  
  const performanceTests: TestCase[] = [
    {
      id: 'test-gas-efficiency',
      name: 'Gas Efficiency',
      description: 'Tests optimization of gas usage',
      status: 'passed',
      runtime: '3.2s'
    },
    {
      id: 'test-concurrent-transactions',
      name: 'Concurrent Transactions',
      description: 'Tests handling of concurrent transactions',
      status: 'passed',
      runtime: '4.5s'
    },
    {
      id: 'test-load-simulation',
      name: 'Load Simulation',
      description: 'Tests performance under high transaction load',
      status: 'pending'
    }
  ];
  
  const tests = {
    functional: functionalTests,
    security: securityTests,
    performance: performanceTests
  };
  
  const getTestSummary = (category: 'functional' | 'security' | 'performance') => {
    const testList = tests[category];
    const passed = testList.filter(test => test.status === 'passed').length;
    const failed = testList.filter(test => test.status === 'failed').length;
    const pending = testList.filter(test => test.status === 'pending').length;
    
    return { passed, failed, pending, total: testList.length };
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Deployment Test Suite</h3>
        
        <Button
          onClick={onRunTests}
          disabled={isRunningTest}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isRunningTest ? (
            <>
              <RefreshCcw size={16} className="mr-2 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <Bug size={16} className="mr-2" />
              Run All Tests
            </>
          )}
        </Button>
      </div>
      
      <Tabs value={testCategory} onValueChange={setTestCategory}>
        <TabsList className="bg-black/30 border border-white/10 w-full">
          <TabsTrigger value="functional" className="flex-1">
            Functional
            <Badge variant="outline" className="ml-2 bg-green-500/20 text-green-400">
              {getTestSummary('functional').passed}/{getTestSummary('functional').total}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex-1">
            Security
            <Badge variant="outline" className="ml-2 bg-red-500/20 text-red-400">
              {getTestSummary('security').passed}/{getTestSummary('security').total}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex-1">
            Performance
            <Badge variant="outline" className="ml-2 bg-amber-500/20 text-amber-400">
              {getTestSummary('performance').passed}/{getTestSummary('performance').total}
            </Badge>
          </TabsTrigger>
        </TabsList>
        
        {Object.keys(tests).map(category => (
          <TabsContent key={category} value={category} className="mt-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tests[category as keyof typeof tests].map(test => (
                <Card key={test.id} className="bg-black/20 border border-white/10">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-sm font-medium">{test.name}</CardTitle>
                      
                      <Badge 
                        variant="outline" 
                        className={
                          test.status === 'passed' 
                            ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                            : test.status === 'failed'
                              ? 'bg-red-500/20 text-red-400 border-red-500/30'
                              : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }
                      >
                        {test.status === 'passed' && <CheckCircle2 size={12} className="mr-1" />}
                        {test.status.charAt(0).toUpperCase() + test.status.slice(1)}
                      </Badge>
                    </div>
                    <CardDescription className="text-xs">{test.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    {test.status === 'failed' && test.error && (
                      <div className="mt-2 text-xs p-2 rounded bg-red-500/10 border border-red-500/30 text-red-400">
                        {test.error}
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0">
                    <div className="flex justify-between items-center w-full text-xs text-gray-400">
                      <span>Network: {deploymentNetwork}</span>
                      {test.runtime && <span>Runtime: {test.runtime}</span>}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
