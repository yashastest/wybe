import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ChevronRight,
  PlayCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeploymentStep } from "@/services/integrationService";

interface DeploymentStepperProps {
  steps: DeploymentStep[];
  currentStepIndex: number;
  setCurrentStepIndex: (index: number) => void;
  onRunStep: (index: number) => void;
  deploymentStarted: boolean;
}

export const DeploymentStepper: React.FC<DeploymentStepperProps> = ({
  steps,
  currentStepIndex,
  setCurrentStepIndex,
  onRunStep,
  deploymentStarted
}) => {
  return (
    <div className="bg-black/20 border border-white/10 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <h3 className="font-medium">Deployment Steps</h3>
      </div>
      <div className="max-h-[600px] overflow-y-auto p-2">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={`relative flex mb-4 ${
              index < steps.length - 1 ? 'pb-6' : ''
            }`}
          >
            {/* Vertical line */}
            {index < steps.length - 1 && (
              <div className="absolute w-0.5 h-full left-3.5 top-8 bg-gray-700/50 z-0"></div>
            )}
            
            {/* Step content */}
            <div 
              className={`relative flex flex-col w-full ${
                currentStepIndex === index ? 'z-10' : 'z-0'
              }`}
            >
              <div 
                className={`flex items-start p-3 rounded-md ${
                  currentStepIndex === index 
                    ? 'bg-orange-500/10 border-orange-500/30 border' 
                    : 'hover:bg-black/20'
                }`}
                onClick={() => {
                  // Only allow navigation to steps that are completed or the next pending step
                  if (
                    deploymentStarted && 
                    (step.status === 'completed' || step.status === 'failed' || index <= currentStepIndex + 1)
                  ) {
                    setCurrentStepIndex(index);
                  }
                }}
              >
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mr-3 ${
                    step.status === 'completed'
                      ? 'bg-green-500'
                      : step.status === 'failed'
                        ? 'bg-red-500'
                        : step.status === 'in-progress'
                          ? 'bg-orange-500'
                          : 'bg-gray-700'
                  }`}
                >
                  {step.status === 'completed' && <CheckCircle2 size={16} className="text-white" />}
                  {step.status === 'failed' && <AlertTriangle size={16} className="text-white" />}
                  {step.status === 'in-progress' && <Clock size={16} className="text-white animate-pulse" />}
                  {step.status === 'pending' && <span className="text-white text-xs font-mono">{index + 1}</span>}
                </div>
                
                <div className="flex-grow">
                  <h4 className="font-medium">{step.title}</h4>
                  <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                  
                  {step.status === 'pending' && currentStepIndex === index && deploymentStarted && (
                    <Button 
                      className="mt-3 bg-orange-500 hover:bg-orange-600 p-2 h-auto text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRunStep(index);
                      }}
                    >
                      <PlayCircle size={14} className="mr-1" />
                      Run Step
                    </Button>
                  )}
                  
                  {step.status === 'failed' && (
                    <Button 
                      className="mt-3 bg-red-500 hover:bg-red-600 p-2 h-auto text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        onRunStep(index);
                      }}
                    >
                      <PlayCircle size={14} className="mr-1" />
                      Retry
                    </Button>
                  )}
                </div>
                
                <div className="flex-shrink-0 ml-2 text-gray-400">
                  <ChevronRight size={18} />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
