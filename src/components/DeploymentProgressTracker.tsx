
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock,
  Loader2,
  Server,
  Database,
  Wallet,
  Globe
} from 'lucide-react';

interface DeploymentStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'pending' | 'in-progress' | 'failed';
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
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-gray-400" />;
      case 'in-progress':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-500/20 bg-green-950/10';
      case 'pending':
        return 'border-gray-500/10 bg-gray-950/10';
      case 'in-progress':
        return 'border-blue-500/20 bg-blue-950/10';
      case 'failed':
        return 'border-red-500/20 bg-red-950/10';
      default:
        return 'border-gray-500/10 bg-gray-950/10';
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Deployment Progress</h3>
          <span className="text-sm text-orange-400 font-mono">{overallProgress}%</span>
        </div>
        <Progress value={overallProgress} className="h-2" />
      </div>
      
      <div className="space-y-3">
        {steps.map((step) => {
          const isCurrentStep = step.id === currentStepId;
          const cardClass = getStatusClass(step.status);
          
          return (
            <Card 
              key={step.id} 
              className={`${cardClass} ${isCurrentStep ? 'ring-2 ring-orange-500/50' : ''} transition-all`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1">
                    {getStatusIcon(step.status)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{step.title}</h4>
                    <p className="text-sm text-gray-400 mt-1">{step.description}</p>
                    
                    {step.dependsOn && step.dependsOn.length > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        <span>Depends on: </span>
                        {step.dependsOn.map((depId, i) => {
                          const depStep = steps.find(s => s.id === depId);
                          return depStep ? (
                            <span key={depId} className={
                              depStep.status === 'completed' 
                                ? 'text-green-400' 
                                : 'text-gray-400'
                            }>
                              {depStep.title}
                              {i < step.dependsOn!.length - 1 ? ', ' : ''}
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DeploymentProgressTracker;
