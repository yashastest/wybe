import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Play,
  Shield,
  AlertTriangle,
  Info,
  RefreshCcw,
  CheckCircle2,
  Zap,
  Server,
  Check
} from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { smartContractService } from '@/services/smartContractService';
import { Badge } from '@/components/ui/badge';
import { integrationService } from '@/services/integrationService';

const ContractSecurityAudit = () => {
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [isAnalyzingGas, setIsAnalyzingGas] = useState(false);
  const [isRunningTests, setIsRunningTests] = useState(false);
  
  const [auditResults, setAuditResults] = useState<{
    issues: Array<{severity: 'high' | 'medium' | 'low' | 'info'; description: string; location?: string}>;
    passedChecks: string[];
  } | null>(null);
  
  const [gasResults, setGasResults] = useState<{
    gasEstimates: {[key: string]: number};
    optimizationSuggestions: string[];
  } | null>(null);
  
  const [testResults, setTestResults] = useState<{
    results: Array<{
      function: string;
      status: 'passed' | 'failed';
      error?: string;
      txHash?: string;
    }>;
  } | null>(null);

  const handleRunSecurityAudit = async () => {
    setIsRunningAudit(true);
    
    try {
      toast.info("Running smart contract security audit...");
      
      // Run security audit
      const results = await smartContractService.runSecurityAudit();
      
      setAuditResults(results);
      
      // Update checklist
      integrationService.updateChecklistItem('5', true);
      
      // Find high risk issues
      const highRisks = results.issues.filter(issue => issue.severity === 'high');
      
      if (highRisks.length > 0) {
        toast.error("Security audit found high risk issues", {
          description: "Please address them before deploying to mainnet."
        });
      } else {
        toast.success("Security audit completed", {
          description: "No critical issues found."
        });
      }
    } catch (error) {
      console.error("Security audit error:", error);
      toast.error("Failed to complete security audit");
    } finally {
      setIsRunningAudit(false);
    }
  };

  const handleAnalyzeGasUsage = async () => {
    setIsAnalyzingGas(true);
    
    try {
      toast.info("Analyzing gas usage...");
      
      // Analyze gas usage
      const results = await smartContractService.analyzeGasUsage();
      
      setGasResults(results);
      
      toast.success("Gas analysis completed");
    } catch (error) {
      console.error("Gas analysis error:", error);
      toast.error("Failed to analyze gas usage");
    } finally {
      setIsAnalyzingGas(false);
    }
  };

  const handleRunTestnetTests = async () => {
    setIsRunningTests(true);
    
    try {
      toast.info("Running testnet validation...");
      
      // Run testnet tests
      const results = await smartContractService.testOnTestnet();
      
      setTestResults(results);
      
      // Check for failures
      const failures = results.results.filter(result => result.status === 'failed');
      
      if (failures.length > 0) {
        toast.error(`${failures.length} test(s) failed`, {
          description: "Please fix issues before deploying to mainnet."
        });
      } else {
        toast.success("All testnet tests passed successfully!");
      }
    } catch (error) {
      console.error("Testnet testing error:", error);
      toast.error("Failed to run testnet tests");
    } finally {
      setIsRunningTests(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-wybe-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="text-orange-500" size={18} />
              Smart Contract Security Audit
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-orange-500 hover:bg-orange-600 mb-4"
              onClick={handleRunSecurityAudit}
              disabled={isRunningAudit}
              data-run-audit-btn
            >
              {isRunningAudit ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Running Audit...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Security Audit
                </>
              )}
            </Button>
            
            {auditResults && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Audit Results</h4>
                  {auditResults.issues.length > 0 ? (
                    <>
                      <p className="text-sm mb-2">Found {auditResults.issues.length} issues to review:</p>
                      <div className="space-y-2">
                        {auditResults.issues.map((issue, index) => (
                          <div key={index} className="bg-black/30 p-3 rounded-lg border border-white/10">
                            <div className="flex items-center gap-2 mb-1">
                              {issue.severity === 'high' && <AlertTriangle size={14} className="text-red-500" />}
                              {issue.severity === 'medium' && <AlertTriangle size={14} className="text-amber-500" />}
                              {issue.severity === 'low' && <AlertTriangle size={14} className="text-yellow-500" />}
                              {issue.severity === 'info' && <Info size={14} className="text-blue-500" />}
                              <span className="text-sm capitalize">{issue.severity} Risk</span>
                            </div>
                            {issue.location && <div className="text-xs text-gray-400 mb-1">{issue.location}</div>}
                            <p className="text-sm">{issue.description}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20 text-center">
                      <CheckCircle2 size={24} className="text-green-500 mx-auto mb-2" />
                      <p className="text-sm">No issues found!</p>
                    </div>
                  )}
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Passed Security Checks</h4>
                  <ul className="space-y-2">
                    {auditResults.passedChecks.map((check, index) => (
                      <li key={index} className="text-sm flex items-start gap-2">
                        <Check size={14} className="text-green-500 mt-1 flex-shrink-0" />
                        <span>{check}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="glass-card border-wybe-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="text-orange-500" size={18} />
              Gas Optimization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 mb-4"
              onClick={handleAnalyzeGasUsage}
              disabled={isAnalyzingGas}
            >
              {isAnalyzingGas ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Gas...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Analyze Gas Usage
                </>
              )}
            </Button>
            
            {gasResults && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Gas Usage Estimates</h4>
                  <div className="space-y-2">
                    {Object.entries(gasResults.gasEstimates).map(([fn, gas]) => (
                      <div key={fn} className="flex justify-between items-center">
                        <span className="text-sm">{fn}</span>
                        <Badge variant="secondary" className="bg-black/30">{gas.toLocaleString()} gas</Badge>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Optimization Suggestions</h4>
                  <ul className="space-y-2 list-disc pl-5">
                    {gasResults.optimizationSuggestions.map((suggestion, index) => (
                      <li key={index} className="text-sm text-gray-300">{suggestion}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="glass-card border-wybe-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Server className="text-orange-500" size={18} />
              Testnet Validation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700 mb-4"
              onClick={handleRunTestnetTests}
              disabled={isRunningTests}
            >
              {isRunningTests ? (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Run Testnet Tests
                </>
              )}
            </Button>
            
            {testResults && (
              <div>
                <h4 className="text-sm font-medium mb-2">Test Results</h4>
                <div className="space-y-2">
                  {testResults.results.map((result, index) => (
                    <div key={index} className="bg-black/30 p-2 rounded-lg border border-white/10">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">{result.function}</span>
                        <Badge 
                          variant={result.status === 'passed' ? 'default' : 'destructive'} 
                          className={result.status === 'passed' ? 'bg-green-500/80' : ''}
                        >
                          {result.status}
                        </Badge>
                      </div>
                      {result.txHash && (
                        <div className="text-xs text-gray-400 mt-1">
                          TX: <span className="font-mono">{result.txHash}</span>
                        </div>
                      )}
                      {result.error && (
                        <div className="text-xs text-red-400 mt-1">
                          Error: {result.error}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContractSecurityAudit;
