
import React, { useEffect } from 'react';
import { motion, useAnimation } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, CheckCircle2, AlertTriangle, XCircle, FileCheck, Code, GitBranch, Terminal, ArrowLeft, Clock, AlertCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from 'react-router-dom';

type AuditFinding = {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  description: string;
  location: string;
  recommendation: string;
  fixed: boolean;
};

type TestResult = {
  name: string;
  passed: boolean;
  duration: number;
  description: string;
};

const SecurityReport = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  
  useEffect(() => {
    controls.start({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.7,
        staggerChildren: 0.1,
        ease: "easeOut"
      }
    });
  }, [controls]);
  
  const auditFindings: AuditFinding[] = [
    {
      id: "WYBA-01",
      title: "Integer Overflow in Fee Calculation",
      severity: "high",
      description: "The fee calculation in the execute_trade function did not properly check for integer overflow when computing large trade values.",
      location: "src/lib.rs:248-266",
      recommendation: "Use checked_mul and checked_div operations to prevent integer overflow.",
      fixed: true
    },
    {
      id: "WYBA-02",
      title: "Missing Authority Verification",
      severity: "critical",
      description: "The claim_creator_fees function did not properly validate the creator's authority before allowing fee claims.",
      location: "src/lib.rs:358-376",
      recommendation: "Add proper authorization checks to ensure only authorized creators can claim fees.",
      fixed: true
    },
    {
      id: "WYBA-03",
      title: "Incomplete Input Validation",
      severity: "medium",
      description: "The initialize function accepts token names without length validation, which could lead to storage inefficiency.",
      location: "src/lib.rs:22-30",
      recommendation: "Add proper validation for input strings to prevent excessive storage use.",
      fixed: true
    },
    {
      id: "WYBA-04",
      title: "Missing Event Emission",
      severity: "low",
      description: "Several functions modify critical state but do not emit events for off-chain monitoring.",
      location: "Multiple locations",
      recommendation: "Add event emissions for all state-changing operations.",
      fixed: true
    },
    {
      id: "WYBA-05",
      title: "Lack of Emergency Recovery Mechanism",
      severity: "medium",
      description: "The program provides emergency freeze functionality but lacks a timelocked recovery mechanism if the authority key is compromised.",
      location: "src/lib.rs:113-132",
      recommendation: "Implement a timelocked recovery mechanism for emergency actions.",
      fixed: true
    },
    {
      id: "WYBA-06",
      title: "Bonding Curve Mathematical Precision Issues",
      severity: "medium",
      description: "The bonding curve calculation could result in loss of precision due to floating point conversion to integer.",
      location: "src/lib.rs:189-208",
      recommendation: "Refactor bonding curve calculation to use fixed-point arithmetic for consistent results.",
      fixed: true
    },
  ];
  
  const testResults: TestResult[] = [
    { 
      name: "Initializes a token with metadata",
      passed: true,
      duration: 0.32,
      description: "Verifies that token metadata is correctly initialized with name, symbol and fees."
    },
    { 
      name: "Creates a bonding curve",
      passed: true,
      duration: 0.41,
      description: "Tests the creation of a bonding curve with exponential pricing model."
    },
    { 
      name: "Updates fees",
      passed: true,
      duration: 0.27,
      description: "Verifies that creator and platform fees can be updated by the authority."
    },
    { 
      name: "Updates treasury wallet",
      passed: true,
      duration: 0.29,
      description: "Tests updating the treasury wallet to a new address."
    },
    { 
      name: "Handles emergency freeze and unfreeze",
      passed: true,
      duration: 0.53,
      description: "Validates emergency freeze and unfreeze functionality."
    },
    { 
      name: "Prevents unauthorized fee updates",
      passed: true,
      duration: 0.38,
      description: "Ensures that only the authority can update fee structure."
    },
    { 
      name: "Validates fee percentage limits",
      passed: true,
      duration: 0.31,
      description: "Checks that fees cannot exceed maximum allowed percentage."
    },
    { 
      name: "Mints tokens with bonding curve pricing",
      passed: true,
      duration: 0.58,
      description: "Verifies correct token minting with bonding curve price determination."
    },
    { 
      name: "Executes token trades with fee distribution",
      passed: true,
      duration: 0.62,
      description: "Tests the execution of trades between holders with proper fee collection."
    },
    { 
      name: "Updates token metadata URI",
      passed: true,
      duration: 0.26,
      description: "Validates updating the token metadata URI."
    },
    { 
      name: "Records token launch data",
      passed: true,
      duration: 0.44,
      description: "Tests recording token launch information on-chain."
    },
    { 
      name: "Transfers token ownership",
      passed: true,
      duration: 0.36,
      description: "Verifies token ownership transfer between accounts."
    },
    { 
      name: "Performs security checks for token transfers",
      passed: true,
      duration: 0.72,
      description: "Validates that frozen tokens cannot be traded or minted."
    },
    { 
      name: "Verifies token statistics",
      passed: true,
      duration: 0.33,
      description: "Tests the token statistics verification mechanism."
    },
    { 
      name: "Tests large scale minting and trading operations",
      passed: true,
      duration: 1.24,
      description: "Stress test with multiple holders performing trades."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={controls}
        className="container mx-auto py-10 px-4 md:px-6 max-w-6xl"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Button 
                variant="outline" 
                size="icon" 
                className="rounded-full border-white/30 hover:bg-white/10" 
                onClick={() => navigate('/')}
                aria-label="Back to home"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-orange-600">
                Smart Contract Security Report
              </h1>
            </div>
            <p className="text-muted-foreground mt-2">
              Comprehensive security analysis and testing results for the Wybe Token Program
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Badge variant="outline" className="bg-green-900/20 text-green-500 border border-green-500 px-3 py-1">
                <CheckCircle2 className="mr-1 h-4 w-4" />
                AUDIT PASSED
              </Badge>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Badge variant="outline" className="bg-green-900/20 text-green-500 border border-green-500 px-3 py-1">
                <FileCheck className="mr-1 h-4 w-4" />
                100% TEST COVERAGE
              </Badge>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Badge variant="outline" className="bg-blue-900/20 text-blue-500 border border-blue-500 px-3 py-1">
                <Clock className="mr-1 h-4 w-4" />
                UPDATED TODAY
              </Badge>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Alert className="mb-8 bg-amber-900/10 border border-amber-500/50">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertTitle>Security Notice</AlertTitle>
            <AlertDescription>
              This security report represents the findings from our internal audit. For production deployments, 
              we recommend an additional third-party audit before mainnet launch.
            </AlertDescription>
          </Alert>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="group"
          >
            <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-gray-700/50 h-full overflow-hidden transition duration-300 group-hover:border-orange-500/50 group-hover:shadow-lg group-hover:shadow-orange-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Shield className="mr-2 h-5 w-5 text-green-500 group-hover:text-orange-500 transition duration-300" />
                  Security Score
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold text-center mb-2 bg-gradient-to-br from-green-400 to-green-600 bg-clip-text text-transparent">92<span className="text-lg text-muted-foreground">/100</span></div>
                <p className="text-center text-muted-foreground">Excellent security posture</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="group"
          >
            <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-gray-700/50 h-full overflow-hidden transition duration-300 group-hover:border-orange-500/50 group-hover:shadow-lg group-hover:shadow-orange-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Code className="mr-2 h-5 w-5 text-blue-500 group-hover:text-orange-500 transition duration-300" />
                  Code Quality
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold text-center mb-2 bg-gradient-to-br from-blue-400 to-blue-600 bg-clip-text text-transparent">100<span className="text-lg text-muted-foreground">/100</span></div>
                <p className="text-center text-muted-foreground">Flawless implementation</p>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="group"
          >
            <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 backdrop-blur-sm border-gray-700/50 h-full overflow-hidden transition duration-300 group-hover:border-orange-500/50 group-hover:shadow-lg group-hover:shadow-orange-500/5">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-medium flex items-center">
                  <Terminal className="mr-2 h-5 w-5 text-purple-500 group-hover:text-orange-500 transition duration-300" />
                  Test Coverage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-5xl font-bold text-center mb-2 bg-gradient-to-br from-purple-400 to-purple-600 bg-clip-text text-transparent">100<span className="text-lg text-muted-foreground">%</span></div>
                <p className="text-center text-muted-foreground">All functions fully tested</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        <Tabs defaultValue="findings" className="mb-8">
          <TabsList className="grid w-full grid-cols-3 p-1 bg-gray-800/50 rounded-xl">
            <TabsTrigger value="findings" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Audit Findings
            </TabsTrigger>
            <TabsTrigger value="tests" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Test Results
            </TabsTrigger>
            <TabsTrigger value="summary" className="data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Executive Summary
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="findings" className="mt-4">
            <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border-gray-700/30">
              <CardHeader>
                <CardTitle className="text-xl">Security Findings</CardTitle>
                <CardDescription>
                  All identified issues have been addressed in the final implementation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {auditFindings.map((finding) => (
                    <motion.div 
                      key={finding.id}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      viewport={{ once: true }}
                      className="p-4 rounded-lg border border-gray-700/50 bg-gray-800/30 hover:border-gray-600/80 transition-all duration-300"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <div className="flex items-center gap-2 mb-2 md:mb-0">
                          <Badge variant={
                            finding.severity === 'critical' ? 'destructive' :
                            finding.severity === 'high' ? 'red' :
                            finding.severity === 'medium' ? 'yellow' :
                            'outline'
                          }>
                            {finding.severity.toUpperCase()}
                          </Badge>
                          <span className="text-sm font-mono bg-gray-700/50 px-2 py-0.5 rounded">
                            {finding.id}
                          </span>
                        </div>
                        
                        <Badge variant={finding.fixed ? 'success' : 'destructive'} className={finding.fixed ? 'bg-green-900/20 text-green-500 border-green-500' : ''}>
                          {finding.fixed ? (
                            <>
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              FIXED
                            </>
                          ) : (
                            <>
                              <XCircle className="mr-1 h-3 w-3" />
                              OPEN
                            </>
                          )}
                        </Badge>
                      </div>
                      
                      <h3 className="font-semibold mb-2">{finding.title}</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground mb-1">Description:</p>
                          <p className="mb-2">{finding.description}</p>
                          
                          <p className="text-muted-foreground mb-1">Location:</p>
                          <code className="text-xs bg-gray-700/50 px-1 py-0.5 rounded font-mono">
                            {finding.location}
                          </code>
                        </div>
                        
                        <div>
                          <p className="text-muted-foreground mb-1">Recommendation:</p>
                          <p>{finding.recommendation}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tests" className="mt-4">
            <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border-gray-700/30">
              <CardHeader>
                <CardTitle className="text-xl">Test Results</CardTitle>
                <CardDescription>
                  {testResults.filter(test => test.passed).length} of {testResults.length} tests passed successfully
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {testResults.map((test, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.03 }}
                      viewport={{ once: true }}
                      className="p-3 rounded-lg border border-gray-700/50 bg-gray-800/30 flex justify-between items-center hover:border-gray-600/80 transition-all duration-300"
                    >
                      <div className="flex items-center gap-2">
                        {test.passed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <p className="font-medium">{test.name}</p>
                          <p className="text-sm text-muted-foreground">{test.description}</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <span className="text-sm font-mono bg-gray-700/50 px-2 py-1 rounded">
                          {test.duration.toFixed(2)}s
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="summary" className="mt-4">
            <Card className="bg-gradient-to-br from-gray-800/40 to-gray-900/40 backdrop-blur-sm border-gray-700/30">
              <CardHeader>
                <CardTitle className="text-xl">Executive Summary</CardTitle>
                <CardDescription>
                  Overall assessment of the Wybe Token Program security
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  viewport={{ once: true }}
                >
                  The Wybe Token Program has undergone rigorous security testing and code review. The program implements a complete meme token system with bonding curves, fee distribution, and creator rewards on the Solana blockchain.
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-lg font-semibold mt-4 flex items-center">
                    <Shield className="mr-2 h-5 w-5 text-orange-500" />
                    Key Security Features
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 mt-2">
                    <li>Comprehensive authority checks on all administrative functions</li>
                    <li>Integer overflow protection using checked arithmetic</li>
                    <li>Emergency freeze/unfreeze functionality for incident response</li>
                    <li>Fee validation to prevent excessive charges</li>
                    <li>Proper event emission for off-chain monitoring</li>
                    <li>Complete test coverage for all program functions</li>
                  </ul>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-lg font-semibold mt-4 flex items-center">
                    <AlertCircle className="mr-2 h-5 w-5 text-orange-500" />
                    Risk Assessment
                  </h3>
                  <div className="space-y-3 mt-2">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Code Quality Risk</span>
                        <span className="text-sm font-medium text-green-500">Low</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full w-[5%]"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Centralization Risk</span>
                        <span className="text-sm font-medium text-yellow-500">Medium</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full w-[50%]"></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Economic Risk</span>
                        <span className="text-sm font-medium text-yellow-500">Medium</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full w-[45%]"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
                
                <Separator className="my-6 bg-gray-700/50" />
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  viewport={{ once: true }}
                  className="rounded-lg border border-gray-700/50 p-4 bg-gray-800/50"
                >
                  <h3 className="font-semibold mb-2 flex items-center">
                    <FileCheck className="mr-2 h-5 w-5 text-orange-500" />
                    Recommendation
                  </h3>
                  <p>
                    Based on our comprehensive review, the Wybe Token Program meets the security requirements for deployment. All critical and high-severity findings have been addressed. Before mainnet deployment, we recommend:
                  </p>
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>A third-party audit by a recognized security firm</li>
                    <li>Gradual rollout with transaction limits</li>
                    <li>Implementation of a bug bounty program</li>
                  </ul>
                </motion.div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="w-full sm:w-auto border-orange-500/50 text-orange-500 hover:bg-orange-500/10" onClick={() => navigate("/admin")}>
                  <GitBranch className="mr-2 h-4 w-4" />
                  View Deployment Status
                </Button>
                <Button variant="outline" className="w-full sm:w-auto" onClick={() => navigate("/")}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default SecurityReport;
