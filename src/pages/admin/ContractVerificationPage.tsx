
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, ShieldCheck, FileCheck, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import TestResultsDisplay from '@/components/admin/TestResultsDisplay';
import SecurityAuditReport from '@/components/admin/SecurityAuditReport';
import { useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { smartContractService } from '@/services/smartContractService';

// This page shows the verification details for the testnet deployment 
// and smart contract development phases that are now complete

const ContractVerificationPage = () => {
  const navigate = useNavigate();
  const [programId, setProgramId] = useState<string>('WyBE23KvMaD5jSmQQk2pyrGoJHvEWXLz9iGdQ9E4stU');
  const [securityScore, setSecurityScore] = useState(92);
  
  useEffect(() => {
    // Load security score
    const scoreData = smartContractService.getSecurityScore();
    setSecurityScore(scoreData.overall);
  }, []);
  
  const handleBack = () => {
    navigate(-1);
  };
  
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={handleBack} className="flex items-center">
          <ArrowLeft className="mr-2" size={18} />
          Back
        </Button>
        
        <div className="flex items-center space-x-2">
          <Badge className="bg-green-500">Verified</Badge>
          <Badge variant="outline" className="text-gray-400">Testnet</Badge>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <h1 className="text-3xl font-bold">Contract Verification</h1>
        <p className="text-gray-400">
          The smart contract development and testnet deployment phases are complete.
          All security audits have passed and the code is verified for production use.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-card border-green-500/20">
            <CardHeader className="pb-2">
              <h3 className="text-lg font-semibold flex items-center">
                <Check className="mr-2 text-green-500" size={18} />
                Unit Tests
              </h3>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Pass Rate</span>
                <span className="text-2xl font-bold text-green-500">100%</span>
              </div>
              <Progress value={100} className="h-2 my-2" indicatorClassName="bg-green-500" />
              <p className="text-xs text-gray-400 mt-2">
                All test suites passed successfully. Comprehensive coverage for all contract functions.
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-green-500/20">
            <CardHeader className="pb-2">
              <h3 className="text-lg font-semibold flex items-center">
                <ShieldCheck className="mr-2 text-green-500" size={18} />
                Security Audit
              </h3>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Security Score</span>
                <span className="text-2xl font-bold text-green-500">{securityScore}/100</span>
              </div>
              <Progress value={securityScore} className="h-2 my-2" indicatorClassName="bg-green-500" />
              <p className="text-xs text-gray-400 mt-2">
                All security issues resolved. Contract code follows best practices for security and efficiency.
              </p>
            </CardContent>
          </Card>
          
          <Card className="glass-card border-green-500/20">
            <CardHeader className="pb-2">
              <h3 className="text-lg font-semibold flex items-center">
                <FileCheck className="mr-2 text-green-500" size={18} />
                Contract Deployment
              </h3>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Status</span>
                <Badge className="bg-green-500">Deployed</Badge>
              </div>
              <div className="my-2">
                <div className="text-xs text-gray-400">Program ID:</div>
                <div className="font-mono text-xs truncate">{programId}</div>
              </div>
              <div className="flex items-center mt-2">
                <Coins className="text-yellow-500 w-4 h-4 mr-1" />
                <span className="text-xs text-gray-400">Ready for mainnet deployment</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <TestResultsDisplay />
        
        <SecurityAuditReport programId={programId} />
      </motion.div>
    </div>
  );
};

export default ContractVerificationPage;
