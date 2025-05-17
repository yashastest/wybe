
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ShieldAlert, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { smartContractService, SecurityAuditResult } from "@/services/smartContractService";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface SecurityAuditReportProps {
  programId: string;
}

const SecurityAuditReport: React.FC<SecurityAuditReportProps> = ({ programId }) => {
  const [auditResults, setAuditResults] = useState<SecurityAuditResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [securityScore, setSecurityScore] = useState<number>(0);
  
  useEffect(() => {
    loadAuditResults();
  }, [programId]);
  
  const loadAuditResults = async () => {
    try {
      setIsLoading(true);
      const results = await smartContractService.runSecurityAudit("WYBE Token Program");
      setAuditResults(results);
      
      // Get security score
      const scoreData = smartContractService.getSecurityScore();
      setSecurityScore(scoreData.overall);
    } catch (error) {
      console.error("Error loading security audit results:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge className="bg-red-500">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-500">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500">Medium</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-blue-400 border-blue-400">Low</Badge>;
      case 'info':
        return <Badge variant="outline">Info</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getScoreColorClass = (score: number) => {
    if (score >= 90) return "text-green-500";
    if (score >= 80) return "text-lime-500";
    if (score >= 70) return "text-yellow-500";
    if (score >= 60) return "text-orange-500";
    return "text-red-500";
  };
  
  const getProgressColorClass = (score: number) => {
    if (score >= 90) return "bg-green-500";
    if (score >= 80) return "bg-lime-500";
    if (score >= 70) return "bg-yellow-500";
    if (score >= 60) return "bg-orange-500";
    return "bg-red-500";
  };
  
  return (
    <div className="space-y-6">
      <Card className="glass-card">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <h3 className="text-lg font-semibold flex items-center">
            <Shield className="mr-2 text-blue-400" size={20} />
            Security Audit Results
          </h3>
          <Badge className="font-mono text-xs">
            {programId.substring(0, 10)}...{programId.substring(programId.length - 6)}
          </Badge>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-pulse">Loading security audit results...</div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="p-4 border rounded-lg bg-black/20">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-300">Security Score</h4>
                    <span className={`text-xl font-bold ${getScoreColorClass(securityScore)}`}>
                      {securityScore}/100
                    </span>
                  </div>
                  <Progress 
                    value={securityScore} 
                    className="h-2 mt-2" 
                    indicatorClassName={getProgressColorClass(securityScore)} 
                  />
                  <div className="mt-4 text-xs text-gray-400">
                    {securityScore >= 90 ? (
                      <div className="flex items-center">
                        <CheckCircle size={14} className="text-green-500 mr-1" />
                        Contract security is excellent, ready for production
                      </div>
                    ) : securityScore >= 80 ? (
                      <div className="flex items-center">
                        <Check size={14} className="text-lime-500 mr-1" />
                        Contract security is good, minimal issues fixed
                      </div>
                    ) : securityScore >= 70 ? (
                      <div className="flex items-center">
                        <AlertTriangle size={14} className="text-yellow-500 mr-1" />
                        Contract security is adequate, some issues fixed
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <ShieldAlert size={14} className="text-red-500 mr-1" />
                        Contract security needs improvement
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="p-4 border rounded-lg bg-black/20">
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Audit Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Critical Issues:</span>
                      <span className="font-bold">{auditResults.filter(r => r.severity === 'critical').length} found / {auditResults.filter(r => r.severity === 'critical' && r.fixed).length} fixed</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>High Issues:</span>
                      <span className="font-bold">{auditResults.filter(r => r.severity === 'high').length} found / {auditResults.filter(r => r.severity === 'high' && r.fixed).length} fixed</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Medium Issues:</span>
                      <span className="font-bold">{auditResults.filter(r => r.severity === 'medium').length} found / {auditResults.filter(r => r.severity === 'medium' && r.fixed).length} fixed</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span>Low Issues:</span>
                      <span className="font-bold">{auditResults.filter(r => r.severity === 'low').length} found / {auditResults.filter(r => r.severity === 'low' && r.fixed).length} fixed</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Severity</TableHead>
                      <TableHead className="w-1/3">Finding</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead className="w-1/3">Recommendation</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {auditResults.map((result, index) => (
                      <TableRow key={index}>
                        <TableCell>{getSeverityBadge(result.severity)}</TableCell>
                        <TableCell className="font-medium">{result.finding}</TableCell>
                        <TableCell className="font-mono text-xs">{result.location}</TableCell>
                        <TableCell className="text-sm">{result.recommendation}</TableCell>
                        <TableCell>
                          {result.fixed ? (
                            <Badge variant="outline" className="bg-green-500/10 text-green-400 border-green-500">
                              <Check size={14} className="mr-1" />
                              Fixed
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-orange-500/10 text-orange-400 border-orange-500">
                              <AlertTriangle size={14} className="mr-1" />
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SecurityAuditReport;
