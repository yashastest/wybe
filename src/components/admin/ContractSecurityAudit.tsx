
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCcw,
  Fuel,
  CircleDollarSign,
  FileCode,
  Network,
  ShieldAlert,
  AlertCircle,
  Info
} from "lucide-react";
import { smartContractService } from "@/services/smartContractService";

type AuditIssue = {
  severity: 'high' | 'medium' | 'low' | 'info';
  description: string;
  location?: string;
};

const ContractSecurityAudit = () => {
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<{
    issues: AuditIssue[];
    passedChecks: string[];
  } | null>(null);
  
  const [isTestingOnTestnet, setIsTestingOnTestnet] = useState(false);
  const [testnetResult, setTestnetResult] = useState<{
    success: boolean;
    results: Array<{
      function: string;
      status: 'passed' | 'failed';
      error?: string;
      txHash?: string;
    }>;
  } | null>(null);
  
  const [isAnalyzingGas, setIsAnalyzingGas] = useState(false);
  const [gasAnalysis, setGasAnalysis] = useState<{
    gasEstimates: {[key: string]: number};
    optimizationSuggestions: string[];
  } | null>(null);

  const runSecurityAudit = async () => {
    setIsAuditing(true);
    setAuditResult(null);
    
    try {
      toast.info("Running security audit on smart contracts...");
      
      const result = await smartContractService.runSecurityAudit();
      
      setAuditResult({
        issues: result.issues,
        passedChecks: result.passedChecks
      });
      
      if (result.issues.length === 0) {
        toast.success("Security audit completed. No issues found!");
      } else {
        const highSeverity = result.issues.filter(issue => issue.severity === 'high').length;
        const mediumSeverity = result.issues.filter(issue => issue.severity === 'medium').length;
        
        if (highSeverity > 0) {
          toast.error(`Security audit found ${highSeverity} high severity issues!`);
        } else if (mediumSeverity > 0) {
          toast.warning(`Security audit found ${mediumSeverity} medium severity issues.`);
        } else {
          toast.success("Security audit completed with minor issues only.");
        }
      }
    } catch (error) {
      console.error("Audit error:", error);
      toast.error("Failed to complete security audit");
    } finally {
      setIsAuditing(false);
    }
  };
  
  const runGasAnalysis = async () => {
    setIsAnalyzingGas(true);
    setGasAnalysis(null);
    
    try {
      toast.info("Analyzing contract gas usage...");
      
      const result = await smartContractService.analyzeGasUsage();
      
      if (result.success) {
        setGasAnalysis({
          gasEstimates: result.gasEstimates,
          optimizationSuggestions: result.optimizationSuggestions
        });
        
        toast.success("Gas analysis completed successfully!");
      } else {
        toast.error("Failed to complete gas analysis");
      }
    } catch (error) {
      console.error("Gas analysis error:", error);
      toast.error("Failed to analyze gas usage");
    } finally {
      setIsAnalyzingGas(false);
    }
  };
  
  const runTestnetTests = async () => {
    setIsTestingOnTestnet(true);
    setTestnetResult(null);
    
    try {
      toast.info("Running tests on testnet...");
      
      const result = await smartContractService.testOnTestnet();
      
      setTestnetResult(result);
      
      if (result.success) {
        const failedTests = result.results.filter(r => r.status === 'failed').length;
        
        if (failedTests === 0) {
          toast.success("All tests passed successfully on testnet!");
        } else {
          toast.error(`${failedTests} tests failed on testnet.`);
        }
      } else {
        toast.error("Failed to complete testnet testing");
      }
    } catch (error) {
      console.error("Testnet testing error:", error);
      toast.error("Failed to run testnet tests");
    } finally {
      setIsTestingOnTestnet(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-500 bg-red-500/10';
      case 'medium': return 'text-amber-500 bg-amber-500/10';
      case 'low': return 'text-yellow-500 bg-yellow-500/10';
      case 'info': return 'text-blue-500 bg-blue-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertCircle size={16} className="text-red-500" />;
      case 'medium': return <AlertTriangle size={16} className="text-amber-500" />;
      case 'low': return <AlertTriangle size={16} className="text-yellow-500" />;
      case 'info': return <Info size={16} className="text-blue-500" />;
      default: return <Info size={16} className="text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="glass-card p-5 border border-orange-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldAlert size={20} className="text-orange-500" />
            <h3 className="text-lg font-bold font-poppins">Smart Contract Security Audit</h3>
          </div>
          <Button
            onClick={runSecurityAudit}
            disabled={isAuditing}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {isAuditing ? (
              <><RefreshCcw size={16} className="mr-2 animate-spin" /> Auditing...</>
            ) : (
              <><Shield size={16} className="mr-2" /> Run Security Audit</>
            )}
          </Button>
        </div>
        
        {auditResult ? (
          <div className="space-y-4">
            <div className="mt-2">
              <h4 className="font-medium mb-2 text-white/80">Audit Results</h4>
              
              {auditResult.issues.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm mb-2">
                    Found {auditResult.issues.length} issues to review:
                  </p>
                  {auditResult.issues.map((issue, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-md border border-white/10 ${getSeverityColor(issue.severity)}`}
                    >
                      <div className="flex items-start gap-2">
                        {getSeverityIcon(issue.severity)}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium capitalize">{issue.severity} Risk</span>
                            {issue.location && (
                              <span className="text-xs bg-black/30 px-2 py-0.5 rounded">
                                {issue.location}
                              </span>
                            )}
                          </div>
                          <p className="text-sm mt-1">{issue.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-md">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={20} />
                    <p className="font-medium text-green-500">No security issues found!</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white/5 p-4 rounded-md border border-white/10">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Shield size={16} className="text-green-500" />
                Passed Security Checks
              </h4>
              <ul className="space-y-2">
                {auditResult.passedChecks.map((check, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle size={14} className="text-green-500 shrink-0" />
                    <span>{check}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="bg-white/5 p-6 rounded-md text-center border border-white/10">
            <Shield size={32} className="mx-auto text-gray-500 mb-2" />
            <p className="text-gray-300">
              Run a security audit to check for vulnerabilities in your smart contracts.
            </p>
          </div>
        )}
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass-card p-5 border border-orange-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Fuel size={20} className="text-orange-500" />
              <h3 className="text-lg font-bold font-poppins">Gas Optimization</h3>
            </div>
            <Button
              onClick={runGasAnalysis}
              disabled={isAnalyzingGas}
              variant="outline"
              className="border-orange-500/20"
            >
              {isAnalyzingGas ? (
                <><RefreshCcw size={16} className="mr-2 animate-spin" /> Analyzing...</>
              ) : (
                <><Fuel size={16} className="mr-2" /> Analyze Gas Usage</>
              )}
            </Button>
          </div>
          
          {gasAnalysis ? (
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-md border border-white/10">
                <h4 className="font-medium mb-2 text-white/80">Gas Usage Estimates</h4>
                <div className="space-y-2">
                  {Object.entries(gasAnalysis.gasEstimates).map(([func, gas]) => (
                    <div key={func} className="flex items-center justify-between text-sm">
                      <span className="font-mono">{func}()</span>
                      <span className="font-mono bg-black/30 px-2 py-0.5 rounded">
                        {gas.toLocaleString()} gas
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2 text-white/80">Optimization Suggestions</h4>
                <ul className="space-y-2">
                  {gasAnalysis.optimizationSuggestions.map((suggestion, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="mt-0.5 shrink-0">•</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 p-6 rounded-md text-center border border-white/10">
              <Fuel size={32} className="mx-auto text-gray-500 mb-2" />
              <p className="text-gray-300">
                Analyze gas usage to optimize transaction costs.
              </p>
            </div>
          )}
        </div>
        
        <div className="glass-card p-5 border border-orange-500/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Network size={20} className="text-orange-500" />
              <h3 className="text-lg font-bold font-poppins">Testnet Validation</h3>
            </div>
            <Button
              onClick={runTestnetTests}
              disabled={isTestingOnTestnet}
              variant="outline"
              className="border-orange-500/20"
            >
              {isTestingOnTestnet ? (
                <><RefreshCcw size={16} className="mr-2 animate-spin" /> Testing...</>
              ) : (
                <><Network size={16} className="mr-2" /> Run Testnet Tests</>
              )}
            </Button>
          </div>
          
          {testnetResult ? (
            <div className="space-y-4">
              <div className="bg-white/5 p-4 rounded-md border border-white/10">
                <h4 className="font-medium mb-2 text-white/80">Test Results</h4>
                <div className="space-y-2">
                  {testnetResult.results.map((result, index) => (
                    <div 
                      key={index} 
                      className={`p-2 rounded-md border ${
                        result.status === 'passed' 
                          ? 'border-green-500/30 bg-green-500/10' 
                          : 'border-red-500/30 bg-red-500/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {result.status === 'passed' ? (
                            <CheckCircle size={16} className="text-green-500" />
                          ) : (
                            <XCircle size={16} className="text-red-500" />
                          )}
                          <span className="font-mono text-sm">{result.function}()</span>
                        </div>
                        
                        <span className={`text-xs font-medium px-2 py-0.5 rounded capitalize ${
                          result.status === 'passed' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                        }`}>
                          {result.status}
                        </span>
                      </div>
                      
                      {result.txHash && (
                        <div className="mt-1 flex items-center gap-1">
                          <span className="text-xs text-gray-400">TX:</span>
                          <span className="text-xs font-mono">{result.txHash}</span>
                        </div>
                      )}
                      
                      {result.error && (
                        <div className="mt-1 text-xs text-red-400">{result.error}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="p-3 rounded-md bg-white/5 border border-white/10 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  {testnetResult.results.every(r => r.status === 'passed') ? (
                    <>
                      <CheckCircle size={18} className="text-green-500" />
                      <span className="font-medium">All tests passed successfully!</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={18} className="text-amber-500" />
                      <span className="font-medium">
                        {testnetResult.results.filter(r => r.status === 'failed').length} tests failed.
                        Review issues before deploying.
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white/5 p-6 rounded-md text-center border border-white/10">
              <Network size={32} className="mx-auto text-gray-500 mb-2" />
              <p className="text-gray-300">
                Run tests on testnet to validate contract functionality.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContractSecurityAudit;
