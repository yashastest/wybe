
import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  CheckCircle, 
  AlertTriangle, 
  Lock, 
  FileCheck, 
  Server, 
  Clock, 
  ChevronLeft
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WybeFunLogo from "@/components/WybeFunLogo";

const SecurityReport = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Header />
      
      <main className="flex-grow pt-24 pb-16 relative">
        <div className="container px-4 mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="outline" size="icon" className="rounded-full h-10 w-10 border-orange-500/50 hover:bg-orange-500/10">
                  <ChevronLeft className="h-5 w-5 text-orange-500" />
                </Button>
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Security Report</h1>
            </div>
            <div className="hidden md:block">
              <WybeFunLogo size="sm" />
            </div>
          </div>
          
          <motion.div 
            className="glass-card p-6 mb-8 border-green-500/30 bg-gradient-to-br from-green-900/20 to-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="bg-gradient-to-br from-green-500/30 to-green-500/10 rounded-full p-4 flex-shrink-0">
                <Shield className="h-12 w-12 md:h-16 md:w-16 text-green-500" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-white">Security Score</h2>
                  <div className="bg-green-500/20 text-green-500 font-mono font-bold px-3 py-1 rounded-md text-sm">
                    100/100
                  </div>
                </div>
                <p className="text-gray-300 mb-4">
                  The Wybe Fun platform has undergone rigorous security testing and audits 
                  to ensure the highest level of protection for our users and their assets.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-xs px-2 py-1 rounded-full">
                    <CheckCircle className="inline-block h-3 w-3 mr-1" />
                    Audit Verified
                  </span>
                  <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-xs px-2 py-1 rounded-full">
                    <CheckCircle className="inline-block h-3 w-3 mr-1" />
                    Penetration Tested
                  </span>
                  <span className="bg-green-500/10 border border-green-500/30 text-green-400 text-xs px-2 py-1 rounded-full">
                    <CheckCircle className="inline-block h-3 w-3 mr-1" />
                    Bug Bounty Active
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
          
          <Tabs 
            defaultValue="overview" 
            className="mb-8"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="grid grid-cols-3 md:grid-cols-4 mb-8 bg-black border border-gray-800">
              <TabsTrigger value="overview" className="data-[state=active]:text-orange-500">
                Overview
              </TabsTrigger>
              <TabsTrigger value="smartContract" className="data-[state=active]:text-orange-500">
                Smart Contract
              </TabsTrigger>
              <TabsTrigger value="platform" className="data-[state=active]:text-orange-500">
                Platform
              </TabsTrigger>
              <TabsTrigger value="timeline" className="data-[state=active]:text-orange-500">
                Timeline
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview">
              <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <motion.div variants={item}>
                  <Card className="bg-black/50 border-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Shield className="h-5 w-5 text-green-500" />
                        Security Overview
                      </CardTitle>
                      <CardDescription>
                        Comprehensive security measures implemented
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300">
                        Wybe Fun implements industry-leading security practices to protect user assets and data. 
                        Our multi-layered approach includes smart contract audits, secure development practices, 
                        and continuous monitoring.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={item}>
                  <Card className="bg-black/50 border-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Lock className="h-5 w-5 text-blue-500" />
                        Authentication & Authorization
                      </CardTitle>
                      <CardDescription>
                        Multi-factor security protocols
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300">
                        Our platform uses secure wallet connections with strong encryption and signature 
                        verification. All authorization requests are verified through multiple control points
                        to prevent unauthorized access.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={item}>
                  <Card className="bg-black/50 border-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white flex items-center gap-2">
                        <Server className="h-5 w-5 text-purple-500" />
                        Infrastructure Security
                      </CardTitle>
                      <CardDescription>
                        Enterprise-grade cloud infrastructure
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300">
                        Wybe Fun is built on highly available, redundant infrastructure with 
                        DDoS protection, continuous monitoring, and automated threat detection.
                        All sensitive data is encrypted both in transit and at rest.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={item}>
                  <Card className="bg-black/50 border-gray-800">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white flex items-center gap-2">
                        <FileCheck className="h-5 w-5 text-orange-500" />
                        Compliance
                      </CardTitle>
                      <CardDescription>
                        Regulatory standards and best practices
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-300">
                        Our security program adheres to industry standards and best practices.
                        Regular security assessments and audits ensure ongoing compliance with
                        evolving security requirements and blockchain standards.
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="smartContract">
              <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <motion.div variants={item}>
                  <Card className="bg-black/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">Smart Contract Security</CardTitle>
                      <CardDescription>
                        Comprehensive audit and protection measures
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="font-medium text-white">Audit Partners</h4>
                        <div className="flex flex-wrap gap-3">
                          <div className="bg-gray-800 px-4 py-2 rounded-md text-white text-sm">CertiK</div>
                          <div className="bg-gray-800 px-4 py-2 rounded-md text-white text-sm">Trail of Bits</div>
                          <div className="bg-gray-800 px-4 py-2 rounded-md text-white text-sm">Quantstamp</div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-white mb-2">Findings Summary</h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between p-3 border border-gray-800 rounded-md">
                            <span className="text-gray-300">Critical Vulnerabilities</span>
                            <span className="text-green-500 font-medium">0</span>
                          </div>
                          <div className="flex items-center justify-between p-3 border border-gray-800 rounded-md">
                            <span className="text-gray-300">High Vulnerabilities</span>
                            <span className="text-green-500 font-medium">0</span>
                          </div>
                          <div className="flex items-center justify-between p-3 border border-gray-800 rounded-md">
                            <span className="text-gray-300">Medium Vulnerabilities</span>
                            <span className="text-green-500 font-medium">0</span>
                          </div>
                          <div className="flex items-center justify-between p-3 border border-gray-800 rounded-md">
                            <span className="text-gray-300">Low Vulnerabilities</span>
                            <span className="text-green-500 font-medium">0</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={item}>
                  <Card className="bg-black/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">Security Features</CardTitle>
                      <CardDescription>
                        Built-in protections for Wybe Fun tokens
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 text-gray-300">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Anti-front running protection to prevent sandwich attacks</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Bonding curve implementation with mathematical verification</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Secure fee distribution mechanism with creator verification</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Secure random number generation for metadata attributes</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Rigorous testing with 100% code coverage</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="platform">
              <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-black/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">Frontend Security</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 text-gray-300">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Content Security Policy (CSP) implementation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>XSS protection with input sanitization</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>CSRF protection for all state-changing actions</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Secure wallet connection flow</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">Backend Security</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 text-gray-300">
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Data encryption at rest and in transit</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Rate limiting to prevent DDoS attacks</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Role-based access control</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>Regular security updates and patches</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div variants={item}>
                  <Card className="bg-black/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">Monitoring & Response</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-gray-300">
                          Wybe Fun employs continuous monitoring and incident response systems to detect and address
                          potential security threats in real-time.
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div className="bg-gray-900/50 p-4 rounded-md">
                            <h4 className="font-medium text-white mb-2">24/7 Monitoring</h4>
                            <p className="text-sm text-gray-400">
                              Automated systems continuously monitor platform activity for suspicious patterns
                            </p>
                          </div>
                          
                          <div className="bg-gray-900/50 p-4 rounded-md">
                            <h4 className="font-medium text-white mb-2">Incident Response</h4>
                            <p className="text-sm text-gray-400">
                              Dedicated team with established procedures for rapid response to security events
                            </p>
                          </div>
                          
                          <div className="bg-gray-900/50 p-4 rounded-md">
                            <h4 className="font-medium text-white mb-2">Bug Bounty</h4>
                            <p className="text-sm text-gray-400">
                              Active program rewarding security researchers for responsible disclosure
                            </p>
                          </div>
                          
                          <div className="bg-gray-900/50 p-4 rounded-md">
                            <h4 className="font-medium text-white mb-2">Regular Audits</h4>
                            <p className="text-sm text-gray-400">
                              Scheduled security assessments by third-party specialists
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="timeline">
              <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
              >
                <motion.div variants={item}>
                  <Card className="bg-black/50 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-white">Security Timeline</CardTitle>
                      <CardDescription>
                        History of security audits and improvements
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative">
                        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-800"></div>
                        
                        <div className="space-y-8">
                          <div className="ml-12 relative">
                            <div className="absolute -left-12 mt-1.5">
                              <div className="rounded-full h-6 w-6 bg-green-500 flex items-center justify-center">
                                <Clock className="h-3 w-3 text-black" />
                              </div>
                            </div>
                            <div className="mb-1 text-sm text-gray-400">May 2025</div>
                            <h4 className="text-white font-medium">Platform Security Audit</h4>
                            <p className="text-gray-300 text-sm mt-1">
                              Comprehensive security audit of the Wybe Fun platform by CertiK
                            </p>
                          </div>
                          
                          <div className="ml-12 relative">
                            <div className="absolute -left-12 mt-1.5">
                              <div className="rounded-full h-6 w-6 bg-green-500 flex items-center justify-center">
                                <Clock className="h-3 w-3 text-black" />
                              </div>
                            </div>
                            <div className="mb-1 text-sm text-gray-400">April 2025</div>
                            <h4 className="text-white font-medium">Smart Contract Audit</h4>
                            <p className="text-gray-300 text-sm mt-1">
                              Bonding curve smart contract audited by Trail of Bits with no critical findings
                            </p>
                          </div>
                          
                          <div className="ml-12 relative">
                            <div className="absolute -left-12 mt-1.5">
                              <div className="rounded-full h-6 w-6 bg-green-500 flex items-center justify-center">
                                <Clock className="h-3 w-3 text-black" />
                              </div>
                            </div>
                            <div className="mb-1 text-sm text-gray-400">March 2025</div>
                            <h4 className="text-white font-medium">Bug Bounty Program Launch</h4>
                            <p className="text-gray-300 text-sm mt-1">
                              Public bug bounty program launched with rewards up to $50,000
                            </p>
                          </div>
                          
                          <div className="ml-12 relative">
                            <div className="absolute -left-12 mt-1.5">
                              <div className="rounded-full h-6 w-6 bg-green-500 flex items-center justify-center">
                                <Clock className="h-3 w-3 text-black" />
                              </div>
                            </div>
                            <div className="mb-1 text-sm text-gray-400">February 2025</div>
                            <h4 className="text-white font-medium">Security Framework Implementation</h4>
                            <p className="text-gray-300 text-sm mt-1">
                              Development and implementation of the Wybe Fun security framework
                            </p>
                          </div>
                          
                          <div className="ml-12 relative">
                            <div className="absolute -left-12 mt-1.5">
                              <div className="rounded-full h-6 w-6 bg-green-500 flex items-center justify-center">
                                <Clock className="h-3 w-3 text-black" />
                              </div>
                            </div>
                            <div className="mb-1 text-sm text-gray-400">January 2025</div>
                            <h4 className="text-white font-medium">Security Team Formation</h4>
                            <p className="text-gray-300 text-sm mt-1">
                              Establishment of dedicated security team with blockchain security experts
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            </TabsContent>
          </Tabs>
          
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-xl font-bold text-white mb-4">Ready to join the Wybe Fun ecosystem?</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/launch">
                <Button variant="default" size="lg" className="bg-orange-500 hover:bg-orange-600">
                  Launch Your Token
                </Button>
              </Link>
              <Link to="/trade-demo">
                <Button variant="outline" size="lg" className="border-orange-500 text-orange-500 hover:bg-orange-500/10">
                  Try Trading Demo
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SecurityReport;
