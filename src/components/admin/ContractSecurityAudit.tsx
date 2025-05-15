import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { InfoIcon, AlertTriangle, AlertCircle, ShieldAlert, CheckCircleIcon, Activity } from 'lucide-react';
import { toast } from 'sonner';
import { smartContractService, SecurityAuditResult, GasUsageResult } from '@/services/smartContractService';

const ContractSecurityAudit: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [securityResults, setSecurityResults] = useState<SecurityAuditResult[]>([]);
  const [gasUsageResults, setGasUsageResults] = useState<GasUsageResult[]>([]);
  const [testnetTestPassed, setTestnetTestPassed] = useState<boolean | null>(null);
  const [contractName] = useState<string>("wybe_token_program");
  
  useEffect(() => {
    // Initialize with empty results
  }, []);
  
  const handleRunSecurityAudit = async () => {
    setIsLoading(true);
    try {
      const results = await smartContractService.runSecurityAudit(contractName);
      setSecurityResults(results);
      toast.success("Security audit completed");
    } catch (error) {
      console.error("Security audit failed:", error);
      toast.error("Failed to complete security audit");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRunGasAnalysis = async () => {
    setIsLoading(true);
    try {
      const results = await smartContractService.analyzeGasUsage(contractName);
      setGasUsageResults(results);
      toast.success("Gas usage analysis completed");
    } catch (error) {
      console.error("Gas analysis failed:", error);
      toast.error("Failed to analyze gas usage");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTestnetTest = async () => {
    setIsLoading(true);
    try {
      const result = await smartContractService.testOnTestnet(contractName);
      setTestnetTestPassed(result);
      toast.success(result ? "Testnet test passed!" : "Testnet test failed!");
    } catch (error) {
      console.error("Testnet test failed:", error);
      toast.error("Failed to run testnet test");
      setTestnetTestPassed(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Map severity to the appropriate icon and color
  const getSeverityDetails = (severity: string) => {
    switch (severity) {
      case 'low':
        return { icon: <InfoIcon className="h-5 w-5" />, color: 'blue' };
      case 'medium':
        return { icon: <AlertTriangle className="h-5 w-5" />, color: 'yellow' };
      case 'high':
        return { icon: <AlertCircle className="h-5 w-5" />, color: 'orange' };
      case 'critical':
        return { icon: <ShieldAlert className="h-5 w-5" />, color: 'red' };
      default:
        return { icon: <InfoIcon className="h-5 w-5" />, color: 'gray' };
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Security Audit</span>
            <Button 
              onClick={handleRunSecurityAudit} 
              disabled={isLoading}
              size="sm"
            >
              {isLoading ? "Running..." : "Run Audit"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {securityResults.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No security audit results yet. Run an audit to see findings.
            </div>
          ) : (
            <div className="space-y-4">
              {securityResults.map((finding, index) => {
                const { icon, color } = getSeverityDetails(finding.severity);
                return (
                  <Alert key={index} variant="outline" className="border-l-4" style={{ borderLeftColor: `var(--${color}-500)` }}>
                    <div className="flex items-center gap-2">
                      {icon}
                      <AlertTitle className="flex items-center gap-2">
                        {finding.finding}
                        <Badge variant="outline" className={`bg-${color}-100 text-${color}-800 border-${color}-200`}>
                          {finding.severity}
                        </Badge>
                      </AlertTitle>
                    </div>
                    <AlertDescription className="mt-2">
                      <p className="text-sm mt-1"><strong>Location:</strong> {finding.location}</p>
                      <p className="text-sm mt-1"><strong>Recommendation:</strong> {finding.recommendation}</p>
                    </AlertDescription>
                  </Alert>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Gas Optimization</span>
            <Button 
              onClick={handleRunGasAnalysis} 
              disabled={isLoading}
              size="sm"
              variant="secondary"
            >
              {isLoading ? "Analyzing..." : "Analyze Gas Usage"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {gasUsageResults.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No gas usage analysis results yet. Run analysis to see optimization opportunities.
            </div>
          ) : (
            <div className="space-y-4">
              {gasUsageResults.map((result, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{result.functionName}</h3>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                      {result.estimatedGas.toLocaleString()} gas
                    </Badge>
                  </div>
                  <div className="mt-2">
                    <h4 className="text-sm font-medium">Suggestions:</h4>
                    <ul className="list-disc pl-5 mt-1 text-sm">
                      {result.suggestions.map((suggestion, sIndex) => (
                        <li key={sIndex}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Testnet Testing</span>
            <Button 
              onClick={handleTestnetTest} 
              disabled={isLoading}
              size="sm"
              variant="secondary"
            >
              {isLoading ? "Testing..." : "Run Testnet Test"}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {testnetTestPassed === null ? (
            <div className="text-center py-8 text-muted-foreground">
              No testnet test results yet. Run a test to verify contract functionality.
            </div>
          ) : (
            <Alert variant="default" className="mb-6">
              <div className="flex items-center gap-2">
                {testnetTestPassed ? 
                  <CheckCircleIcon className="h-5 w-5" /> : 
                  <Activity className="h-5 w-5" />
                }
                <AlertTitle>
                  {testnetTestPassed ? 
                    "Testnet test passed successfully!" : 
                    "Testnet test failed!"
                  }
                </AlertTitle>
              </div>
              <AlertDescription className="mt-2">
                {testnetTestPassed ? 
                  "Your contract is functioning as expected on the testnet environment." : 
                  "Your contract encountered issues during testnet execution. Check logs for details."
                }
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContractSecurityAudit;
