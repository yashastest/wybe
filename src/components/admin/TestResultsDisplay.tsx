
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { smartContractService, TestResult } from "@/services/smartContractService";

const TestResultsDisplay = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [passRate, setPassRate] = useState(0);
  
  useEffect(() => {
    loadTestResults();
  }, []);
  
  const loadTestResults = async () => {
    try {
      setIsLoading(true);
      const results = await smartContractService.getTestResults();
      setTestResults(results);
      
      // Calculate pass rate
      const passedTests = results.filter(test => test.passed).length;
      const passRateValue = (passedTests / results.length) * 100;
      setPassRate(passRateValue);
    } catch (error) {
      console.error("Error loading test results:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="glass-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <h3 className="text-lg font-semibold">Contract Test Results</h3>
        <Badge className={passRate === 100 ? "bg-green-500" : "bg-yellow-500"}>
          {passRate}% Passing
        </Badge>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-pulse">Loading test results...</div>
          </div>
        ) : (
          <div className="space-y-3">
            {testResults.map((test, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-md ${test.passed ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}
              >
                <div className="flex justify-between">
                  <div className="flex items-center">
                    {test.passed ? 
                      <CheckCircle size={16} className="text-green-500 mr-2" /> : 
                      <XCircle size={16} className="text-red-500 mr-2" />
                    }
                    <span className="font-medium">{test.name}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-400">
                    <Clock size={12} className="mr-1" />
                    {test.duration}s
                  </div>
                </div>
                <div className="mt-1 text-sm text-gray-400">{test.description}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TestResultsDisplay;
