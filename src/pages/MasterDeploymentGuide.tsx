
import React, { useState, useEffect } from 'react';
// Import DeploymentStep from integrationService
import { DeploymentStep, integrationService } from '@/services/integrationService';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  Check,
  ChevronDown,
  ChevronRight,
  HelpCircle,
  RefreshCcw,
  Terminal,
  AlertTriangle,
  CheckCircle,
  Code,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

// Type for the steps with fixed status values
type StepsWithFixedStatus = {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  command?: string;
  prerequisite?: string[];
  output?: string;
  verificationSteps?: {
    id: string;
    title: string;
    status: 'pending' | 'success' | 'error';
    message?: string;
  }[];
}[];

const MasterDeploymentGuide = () => {
  const [activeNetwork, setActiveNetwork] = useState<string>('testnet');
  const [steps, setSteps] = useState<DeploymentStep[]>([]);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentRunningStep, setCurrentRunningStep] = useState<string | null>(null);

  useEffect(() => {
    loadDeploymentSteps();
  }, [activeNetwork]);

  const loadDeploymentSteps = () => {
    setIsLoading(true);
    
    // Get steps from integration service
    setTimeout(() => {
      const deploymentSteps = integrationService.getDeploymentSteps(activeNetwork);
      setSteps(deploymentSteps);
      setIsLoading(false);
    }, 1000);
  };

  const handleToggleExpand = (stepId: string) => {
    if (expandedStep === stepId) {
      setExpandedStep(null);
    } else {
      setExpandedStep(stepId);
    }
  };

  const getStepStatusIcon = (status: 'pending' | 'in-progress' | 'completed' | 'failed') => {
    switch (status) {
      case 'completed':
        return <Check className="text-green-500" size={18} />;
      case 'in-progress':
        return <RefreshCcw className="text-blue-500 animate-spin" size={18} />;
      case 'failed':
        return <AlertCircle className="text-red-500" size={18} />;
      default:
        return <ChevronRight size={18} />;
    }
  };

  const handleRunCommand = (stepId: string, command?: string) => {
    if (!command) return;
    
    setIsRunning(true);
    setCurrentRunningStep(stepId);
    
    // Mark the step as in-progress
    const updatedSteps: StepsWithFixedStatus = steps.map(step => {
      if (step.id === stepId) {
        return {
          ...step,
          status: 'in-progress' as const,
        };
      }
      return step;
    });
    setSteps(updatedSteps as DeploymentStep[]);
    
    // Simulate command execution
    setTimeout(() => {
      // Generate some fake output
      const output = `Running command: ${command}\n\n$ ${command}\nInitializing deployment process...\nConnecting to network...\nDeployment in progress...\nSuccess! Deployment completed.`;
      
      // Add verification steps
      const verificationSteps = [
        {
          id: `${stepId}-verify-1`,
          title: "Configuration Verification",
          status: "success" as const,
          message: "All configuration parameters verified"
        },
        {
          id: `${stepId}-verify-2`,
          title: "Security Checks",
          status: "success" as const,
          message: "All security checks passed"
        },
        {
          id: `${stepId}-verify-3`,
          title: "Network Connection",
          status: "success" as const,
          message: "Successfully connected to the network"
        }
      ];
      
      // Update the step with output and mark as completed
      const completedSteps: StepsWithFixedStatus = updatedSteps.map(step => {
        if (step.id === stepId) {
          return {
            ...step,
            status: 'completed' as const,
            output,
            verificationSteps
          };
        }
        return step;
      });
      
      setSteps(completedSteps as DeploymentStep[]);
      setIsRunning(false);
      setCurrentRunningStep(null);
      setExpandedStep(stepId); // Auto-expand to show results
      
      toast.success(`Step "${steps.find(s => s.id === stepId)?.title}" completed successfully`);
    }, 3000);
  };

  const getCompletionPercentage = () => {
    if (!steps.length) return 0;
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    return (completedSteps / steps.length) * 100;
  };

  const allPrerequisitesMet = (step: DeploymentStep) => {
    if (!step.prerequisite || step.prerequisite.length === 0) return true;
    
    return step.prerequisite.every(prereqId => {
      const prerequisiteStep = steps.find(s => s.id === prereqId);
      return prerequisiteStep && prerequisiteStep.status === 'completed';
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Master Deployment Guide</h2>
          <p className="text-gray-400 text-sm">Step-by-step instructions to deploy your project</p>
        </div>
        
        <div className="flex flex-col xs:flex-row gap-2">
          <div className="flex border border-white/20 rounded-md overflow-hidden">
            <button 
              onClick={() => setActiveNetwork('testnet')} 
              className={`px-3 py-1.5 text-sm ${activeNetwork === 'testnet' ? 'bg-wybe-primary text-white' : 'bg-transparent text-gray-400'}`}
            >
              Testnet
            </button>
            <button 
              onClick={() => setActiveNetwork('devnet')} 
              className={`px-3 py-1.5 text-sm ${activeNetwork === 'devnet' ? 'bg-wybe-primary text-white' : 'bg-transparent text-gray-400'}`}
            >
              Devnet
            </button>
            <button 
              onClick={() => setActiveNetwork('mainnet')} 
              className={`px-3 py-1.5 text-sm ${activeNetwork === 'mainnet' ? 'bg-wybe-primary text-white' : 'bg-transparent text-gray-400'}`}
            >
              Mainnet
            </button>
          </div>
          
          <Button
            variant="outline"
            className="border-white/20"
            onClick={loadDeploymentSteps}
            disabled={isLoading}
          >
            <RefreshCcw size={14} className={`mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="bg-black/20 rounded-lg p-5 border border-wybe-primary/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Deployment Progress</h3>
            <p className="text-sm text-gray-400">Complete all steps to successfully deploy your project</p>
          </div>
          <div className="flex items-center gap-2 text-sm mt-2 md:mt-0">
            <Badge variant={activeNetwork === 'mainnet' ? "destructive" : "default"} className={activeNetwork === 'mainnet' ? "bg-red-500" : ""}>
              {activeNetwork.toUpperCase()}
            </Badge>
            <span className="text-gray-400">|</span>
            <span className="font-medium">{Math.round(getCompletionPercentage())}% Complete</span>
          </div>
        </div>
        
        <div className="mb-6">
          <Progress value={getCompletionPercentage()} className="h-2 bg-gray-800" />
        </div>
        
        <div className="space-y-4">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <RefreshCcw className="animate-spin text-wybe-primary" size={24} />
            </div>
          ) : (
            <>
              {steps.map((step) => (
                <Card key={step.id} className={`glass-card ${expandedStep === step.id ? "border-wybe-primary/40" : "border-wybe-primary/20"}`}>
                  <CardHeader className="py-3 px-4">
                    <div 
                      className="flex items-center justify-between cursor-pointer" 
                      onClick={() => handleToggleExpand(step.id)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1 rounded-full bg-wybe-primary/10">
                          {getStepStatusIcon(step.status)}
                        </div>
                        <CardTitle className="text-base font-medium">
                          {step.title}
                        </CardTitle>
                        {step.prerequisite && step.prerequisite.length > 0 && !allPrerequisitesMet(step) && (
                          <Badge variant="outline" className="border-amber-500/70 text-amber-500 text-xs">
                            Prerequisites Required
                          </Badge>
                        )}
                      </div>
                      <ChevronDown className={`transition-transform ${expandedStep === step.id ? "rotate-180" : ""}`} size={16} />
                    </div>
                  </CardHeader>
                  
                  {expandedStep === step.id && (
                    <>
                      <CardContent className="px-4 pt-0 pb-3">
                        <p className="text-sm text-gray-400 mb-4">{step.description}</p>
                        
                        {step.prerequisite && step.prerequisite.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Prerequisites</h4>
                            <div className="flex flex-wrap gap-2">
                              {step.prerequisite.map(prereqId => {
                                const prerequisiteStep = steps.find(s => s.id === prereqId);
                                const completed = prerequisiteStep?.status === 'completed';
                                return (
                                  <Badge 
                                    key={prereqId} 
                                    variant={completed ? "default" : "outline"}
                                    className={completed ? "bg-green-500/80" : "border-gray-500/50 text-gray-400"}
                                  >
                                    {completed && <Check size={10} className="mr-1" />}
                                    {prerequisiteStep?.title || prereqId}
                                  </Badge>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        
                        {step.command && (
                          <div className="mb-4">
                            <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Command</h4>
                            <div className="bg-black/40 p-2 rounded font-mono text-sm flex items-center justify-between">
                              <code>{step.command}</code>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-7 px-2"
                                onClick={() => navigator.clipboard.writeText(step.command || "")}
                              >
                                <Code size={12} className="mr-1" />
                                Copy
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        {step.output && (
                          <div className="mb-4">
                            <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Output</h4>
                            <Textarea 
                              value={step.output} 
                              readOnly 
                              className="font-mono text-xs h-32 bg-black/30"
                            />
                          </div>
                        )}
                        
                        {step.verificationSteps && step.verificationSteps.length > 0 && (
                          <div>
                            <h4 className="text-xs text-gray-500 uppercase tracking-wider mb-2">Verification</h4>
                            <div className="space-y-2">
                              {step.verificationSteps.map(verification => (
                                <div 
                                  key={verification.id} 
                                  className="flex items-start gap-2 bg-wybe-background-light/30 p-2 rounded"
                                >
                                  {verification.status === 'success' ? (
                                    <CheckCircle className="text-green-500 mt-0.5" size={14} />
                                  ) : verification.status === 'error' ? (
                                    <AlertCircle className="text-red-500 mt-0.5" size={14} />
                                  ) : (
                                    <HelpCircle className="text-amber-500 mt-0.5" size={14} />
                                  )}
                                  <div>
                                    <div className="text-sm font-medium">{verification.title}</div>
                                    {verification.message && (
                                      <p className="text-xs text-gray-400 mt-1">{verification.message}</p>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="px-4 py-3">
                        {step.status === 'completed' ? (
                          <div className="flex items-center text-sm text-green-400">
                            <CheckCircle size={14} className="mr-2" />
                            Step completed successfully
                          </div>
                        ) : step.status === 'failed' ? (
                          <div className="flex items-center text-sm text-red-400">
                            <AlertTriangle size={14} className="mr-2" />
                            This step failed. Please try again.
                          </div>
                        ) : (
                          <Button
                            onClick={() => handleRunCommand(step.id, step.command)}
                            disabled={isRunning || !allPrerequisitesMet(step)}
                            className="bg-orange-500 hover:bg-orange-600"
                          >
                            {isRunning && currentRunningStep === step.id ? (
                              <>
                                <RefreshCcw size={14} className="mr-2 animate-spin" />
                                Executing...
                              </>
                            ) : (
                              <>
                                <Terminal size={14} className="mr-2" />
                                Execute Step
                              </>
                            )}
                          </Button>
                        )}
                      </CardFooter>
                    </>
                  )}
                </Card>
              ))}
              
              <div className="bg-black/20 rounded-lg p-4 border border-wybe-primary/20 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Ready to proceed to production?</h3>
                  <p className="text-xs text-gray-400">Complete all steps before deploying to mainnet</p>
                </div>
                <Button 
                  className="bg-green-600 hover:bg-green-700" 
                  disabled={getCompletionPercentage() < 100}
                >
                  <ArrowRight size={14} className="mr-2" />
                  Continue to Production
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MasterDeploymentGuide;
