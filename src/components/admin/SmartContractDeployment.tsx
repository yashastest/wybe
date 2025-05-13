
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  FileCode2, 
  Code, 
  CheckCircle2, 
  Shield, 
  Rocket,
  ArrowRight,
  CircleDollarSign
} from "lucide-react";
import SmartContractSteps from "@/components/SmartContractSteps";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SmartContractDeployment = () => {
  const [requestSent, setRequestSent] = useState(false);
  
  const handleDeploymentRequest = () => {
    setRequestSent(true);
    toast.success("Deployment request submitted successfully", {
      description: "Our team will contact you within 24 hours."
    });
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className="space-y-6 pt-8"
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0 }
        }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold font-poppins mb-6 flex items-center gap-2">
          <FileCode2 className="text-wybe-primary" size={24} />
          Smart Contract Deployment
        </h2>

        <Tabs defaultValue="guide">
          <TabsList className="mb-6">
            <TabsTrigger value="guide" className="flex items-center gap-2 font-poppins font-bold">
              <Code size={16} />
              Implementation Guide
            </TabsTrigger>
            <TabsTrigger value="request" className="flex items-center gap-2 font-poppins font-bold">
              <Rocket size={16} />
              Request Deployment
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="guide">
            <SmartContractSteps className="bg-transparent" />
          </TabsContent>
          
          <TabsContent value="request" className="space-y-8">
            <div className="space-y-6">
              <div className="glass-card p-6 bg-gradient-to-br from-wybe-primary/10 to-transparent">
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-wybe-primary/20 p-3 rounded-full">
                    <Shield className="text-wybe-primary h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-poppins font-bold">Professional Deployment Service</h3>
                </div>
                <p className="text-gray-300 leading-relaxed mb-6">
                  Our expert team will handle all aspects of your token deployment and smart contract setup, ensuring a smooth and secure launch on the Solana blockchain. We take care of the technical details so you can focus on building your community.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-black/30 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CheckCircle2 className="text-green-500 mr-2 h-5 w-5" />
                      <h4 className="font-poppins font-bold">Security Audited</h4>
                    </div>
                    <p className="text-sm text-gray-400">All contracts undergo multi-layer security audits before deployment</p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CheckCircle2 className="text-green-500 mr-2 h-5 w-5" />
                      <h4 className="font-poppins font-bold">Custom Parameters</h4>
                    </div>
                    <p className="text-sm text-gray-400">Configure tokenomics, supply, and bonding curve parameters</p>
                  </div>
                  <div className="bg-black/30 p-4 rounded-lg">
                    <div className="flex items-center mb-2">
                      <CheckCircle2 className="text-green-500 mr-2 h-5 w-5" />
                      <h4 className="font-poppins font-bold">Full Support</h4>
                    </div>
                    <p className="text-sm text-gray-400">Dedicated technical support during and after deployment</p>
                  </div>
                </div>
                
                <div className="bg-wybe-background/80 border border-white/10 p-4 rounded-lg mb-6">
                  <h4 className="flex items-center text-lg font-poppins font-bold mb-3">
                    <CircleDollarSign className="text-wybe-primary mr-2" />
                    Pricing
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="font-mono font-bold mb-1">Standard Package</p>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-2xl font-bold">2 SOL</span>
                        <span className="text-gray-400 text-sm">+ gas fees</span>
                      </div>
                      <ul className="text-sm space-y-1 text-gray-300">
                        <li className="flex items-center">
                          <CheckCircle2 className="text-green-500 mr-2 h-3 w-3" />
                          Basic token setup
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="text-green-500 mr-2 h-3 w-3" />
                          Linear bonding curve
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="text-green-500 mr-2 h-3 w-3" />
                          Standard fee model
                        </li>
                      </ul>
                    </div>
                    <div>
                      <p className="font-mono font-bold mb-1">Premium Package</p>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-2xl font-bold">5 SOL</span>
                        <span className="text-gray-400 text-sm">+ gas fees</span>
                      </div>
                      <ul className="text-sm space-y-1 text-gray-300">
                        <li className="flex items-center">
                          <CheckCircle2 className="text-green-500 mr-2 h-3 w-3" />
                          Advanced tokenomics
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="text-green-500 mr-2 h-3 w-3" />
                          Custom bonding curve
                        </li>
                        <li className="flex items-center">
                          <CheckCircle2 className="text-green-500 mr-2 h-3 w-3" />
                          Advanced features (staking, etc.)
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className={`w-full py-6 font-poppins font-bold text-base ${
                    requestSent ? "bg-green-600 hover:bg-green-700" : "btn-primary"
                  }`}
                  onClick={handleDeploymentRequest}
                  disabled={requestSent}
                >
                  {requestSent ? (
                    <>
                      <CheckCircle2 className="mr-2 h-5 w-5" />
                      Request Submitted
                    </>
                  ) : (
                    <>
                      Request Deployment Assistance
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {requestSent && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 border-green-500/30"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-500/20 p-2 rounded-full">
                    <CheckCircle2 className="text-green-500" />
                  </div>
                  <h3 className="text-xl font-poppins font-bold">Request Received</h3>
                </div>
                <p className="text-gray-300">
                  Your deployment request has been successfully submitted. Our team will review your request and contact you within 24 hours to discuss next steps. Please ensure your contact information is up-to-date in your account settings.
                </p>
              </motion.div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
};

export default SmartContractDeployment;
