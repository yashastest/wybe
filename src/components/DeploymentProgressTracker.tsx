
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

export interface DeploymentStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  dependsOn?: string[];
}

interface DeploymentProgressTrackerProps {
  steps: DeploymentStep[];
  currentStepId?: string;
  overallProgress: number;
}

const DeploymentProgressTracker: React.FC<DeploymentProgressTrackerProps> = ({
  steps,
  currentStepId,
  overallProgress
}) => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Deployment Progress</span>
          <span>{Math.round(overallProgress)}%</span>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>
      
      <div className="space-y-3">
        {steps.map((step) => {
          const isCurrent = step.id === currentStepId;
          const isCompleted = step.status === 'completed';
          const isFailed = step.status === 'failed';
          
          return (
            <div 
              key={step.id}
              className={`p-3 rounded-lg border ${
                isCurrent ? 'bg-orange-500/10 border-orange-500/40' : 
                isCompleted ? 'bg-green-500/10 border-green-500/40' :
                isFailed ? 'bg-red-500/10 border-red-500/40' :
                'bg-black/20 border-white/10'
              }`}
            >
              <div className="flex items-start">
                <div className={`p-1.5 rounded-full mr-3 mt-0.5 ${
                  isCompleted ? 'bg-green-500/20 text-green-500' :
                  isFailed ? 'bg-red-500/20 text-red-500' :
                  isCurrent ? 'bg-orange-500/20 text-orange-500' :
                  'bg-gray-500/20 text-gray-500'
                }`}>
                  {isCompleted ? (
                    <CheckCircle size={16} />
                  ) : isFailed ? (
                    <AlertCircle size={16} />
                  ) : (
                    <Clock size={16} />
                  )}
                </div>
                <div>
                  <h4 className={`text-sm font-medium ${
                    isCurrent ? 'text-orange-400' :
                    isCompleted ? 'text-green-400' :
                    isFailed ? 'text-red-400' :
                    'text-gray-300'
                  }`}>{step.title}</h4>
                  <p className="text-xs text-gray-400 mt-1">{step.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeploymentProgressTracker;
