
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Flame, 
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { smartContractService } from '@/services/smartContractService';
import { toast } from "sonner";
import { Progress } from '@/components/ui/progress';

const ContractSecurityAudit: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [auditResults, setAuditResults] = useState<{
    score: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    findings: { severity: string; description: string; location: string; }[];
    issues?: number;
    passedChecks?: number;
  } | null>(null);
  
  const [tokenProgramId, setTokenProgramId] = useState('Wyb111111111111111111111111111111111111111');
  
  const [gasAnalysisResults, setGasAnalysisResults] = useState<{
    gasEstimates: any;
    optimizationSuggestions: string[];
    results: { functionName: string; averageGasUsed: number; }[];
  } | null>(null);
  
  const [testingResults, setTestingResults] = useState<{
    results: { function: string; status: 'passed' | 'failed'; error?: string; txHash?: string; }[];
  }>({ results: [] });
  
  const runSecurityAudit = async () => {
    setIsScanning(true);
    try {
      const results = await smartContractService.runSecurityAudit(tokenProgramId);
      setAuditResults(results);
      toast.success('Security audit completed');
    } catch (error) {
      console.error("Error running security audit:", error);
      toast.error("Failed to run security audit");
    } finally {
      setIsScanning(false);
    }
  };
  
  const runGasAnalysis = async () => {
    setIsScanning(true);
    try {
      const results = await smartContractService.analyzeGasUsage(tokenProgramId);
      
      const formattedResults = {
        gasEstimates: results.gasEstimates || {},
        optimizationSuggestions: results.optimizationSuggestions || [],
        results: results.map(item => ({
          functionName: item.functionName,
          averageGasUsed: item.averageGasUsed
        }))
      };
      
      setGasAnalysisResults(formattedResults);
      toast.success('Gas analysis completed');
    } catch (error) {
      console.error("Error running gas analysis:", error);
      toast.error("Failed to run gas analysis");
    } finally {
      setIsScanning(false);
    }
  };
  
  const runTestnetTests = async () => {
    setIsScanning(true);
    try {
      const results = await smartContractService.testOnTestnet(tokenProgramId, 'all');
      
      // Convert to the format expected by our state
      const convertedResults = {
        results: results.results.map(item => ({
          function: item.name,
          status: item.passed ? 'passed' as const : 'failed' as const,
          error: item.passed ? undefined : item.message,
          txHash: item.passed ? `tx_${Math.random().toString(36).substring(2, 10)}` : undefined
        }))
      };
      
      setTestingResults(convertedResults);
      toast.success('Testnet tests completed');
    } catch (error) {
      console.error("Error running testnet tests:", error);
      toast.error("Failed to run testnet tests");
    } finally {
      setIsScanning(false);
    }
  };
  
  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return <Flame className="text-red-500" size={16} />;
      case 'high':
        return <AlertCircle className="text-orange-500" size={16} />;
      case 'medium':
        return <AlertTriangle className="text-yellow-500" size={16} />;
      case 'low':
        return <AlertCircle className="text-blue-400" size={16} />;
      default:
        return <AlertCircle className="text-gray-400" size={16} />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            value={tokenProgramId}
            onChange={(e) => setTokenProgramId(e.target.value)}
            placeholder="Program ID"
            className="font-mono"
          />
        </div>
        <Button 
          variant="orange" 
          onClick={runSecurityAudit}
          disabled={isScanning}
          className="md:w-auto w-full"
        >
          {isScanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldAlert className="mr-2 h-4 w-4" />}
          Run Security Audit
        </Button>
        <Button 
          variant="secondary" 
          onClick={runGasAnalysis}
          disabled={isScanning}
          className="md:w-auto w-full"
        >
          {isScanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
          Analyze Gas Usage
        </Button>
        <Button 
          variant="outline" 
          onClick={runTestnetTests}
          disabled={isScanning}
          className="md:w-auto w-full"
        >
          {isScanning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
          Run Tests
        </Button>
      </div>
      
      {auditResults && (
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <h3 className="text-lg font-semibold flex items-center">
              <ShieldAlert className="mr-2 text-orange-500" size={20} />
              Security Audit Results
            </h3>
            <Badge 
              variant="outline" 
              className={
                auditResults.score >= 80 ? 'border-green-500 text-green-500' : 
                auditResults.score >= 50 ? 'border-yellow-500 text-yellow-500' : 
                'border-red-500 text-red-500'
              }
            >
              Score: {auditResults.score}/100
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3 justify-between">
                <div className="bg-black/20 rounded-lg p-3 flex items-center">
                  <div className="mr-3 bg-red-500/20 p-2 rounded-full">
                    <Flame className="text-red-500" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Critical</p>
                    <p className="font-bold text-lg">{auditResults.critical}</p>
                  </div>
                </div>
                <div className="bg-black/20 rounded-lg p-3 flex items-center">
                  <div className="mr-3 bg-orange-500/20 p-2 rounded-full">
                    <AlertCircle className="text-orange-500" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">High</p>
                    <p className="font-bold text-lg">{auditResults.high}</p>
                  </div>
                </div>
                <div className="bg-black/20 rounded-lg p-3 flex items-center">
                  <div className="mr-3 bg-yellow-500/20 p-2 rounded-full">
                    <AlertTriangle className="text-yellow-500" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Medium</p>
                    <p className="font-bold text-lg">{auditResults.medium}</p>
                  </div>
                </div>
                <div className="bg-black/20 rounded-lg p-3 flex items-center">
                  <div className="mr-3 bg-blue-500/20 p-2 rounded-full">
                    <AlertCircle className="text-blue-400" size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Low</p>
                    <p className="font-bold text-lg">{auditResults.low}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Security Check Progress</span>
                  <span>
                    {auditResults.passedChecks || 0}/{(auditResults.passedChecks || 0) + (auditResults.issues || 0)} Passed
                  </span>
                </div>
                <Progress 
                  value={(auditResults.passedChecks || 0) / ((auditResults.passedChecks || 0) + (auditResults.issues || 0)) * 100} 
                  className="h-2"
                />
              </div>
              
              {auditResults.findings.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Findings:</h4>
                  <div className="space-y-2">
                    {auditResults.findings.map((finding, index) => (
                      <div key={index} className="bg-black/30 p-2 rounded-md">
                        <div className="flex items-start">
                          {getSeverityIcon(finding.severity)}
                          <div className="ml-2">
                            <p className="text-sm font-medium">{finding.description}</p>
                            <p className="text-xs text-gray-400">
                              Location: <span className="font-mono">{finding.location}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {gasAnalysisResults && (
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <h3 className="text-lg font-semibold flex items-center">
              <Zap className="mr-2 text-orange-500" size={20} />
              Gas Usage Analysis
            </h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Function
                      </th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Average Gas (units)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {gasAnalysisResults.results.map((item, index) => (
                      <tr key={index} className="hover:bg-black/20">
                        <td className="px-4 py-2 text-sm font-mono">
                          {item.functionName}
                        </td>
                        <td className="px-4 py-2 text-sm text-right font-mono">
                          {item.averageGasUsed.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Optimization Suggestions:</h4>
                <ul className="space-y-1">
                  {gasAnalysisResults.optimizationSuggestions.map((suggestion, idx) => (
                    <li key={idx} className="text-sm flex items-start">
                      <AlertCircle className="text-blue-400 mr-2 shrink-0 mt-0.5" size={14} />
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {testingResults.results.length > 0 && (
        <Card className="glass-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <h3 className="text-lg font-semibold flex items-center">
              <ShieldCheck className="mr-2 text-orange-500" size={20} />
              Testnet Test Results
            </h3>
            <Badge variant="outline" className="border-blue-500 text-blue-500">
              {testingResults.results.filter(r => r.status === 'passed').length}/{testingResults.results.length} Passed
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {testingResults.results.map((result, idx) => (
                <div 
                  key={idx} 
                  className={`flex items-start p-3 rounded-md ${
                    result.status === 'passed' 
                      ? 'bg-green-500/10 border border-green-500/20' 
                      : 'bg-red-500/10 border border-red-500/20'
                  }`}
                >
                  {result.status === 'passed' 
                    ? <CheckCircle className="text-green-500 shrink-0 mt-0.5" size={16} /> 
                    : <XCircle className="text-red-500 shrink-0 mt-0.5" size={16} />
                  }
                  <div className="ml-2">
                    <p className="text-sm font-medium">{result.function}</p>
                    {result.error && (
                      <p className="text-xs text-red-400">{result.error}</p>
                    )}
                    {result.txHash && (
                      <p className="text-xs text-gray-400 font-mono">{result.txHash}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ContractSecurityAudit;
