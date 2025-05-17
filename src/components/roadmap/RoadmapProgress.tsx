
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface RoadmapProgressProps {
  completed: number;
  inProgress: number;
  overall: number;
}

export const RoadmapProgress: React.FC<RoadmapProgressProps> = ({ 
  completed, 
  inProgress, 
  overall 
}) => {
  return (
    <Card className="w-full md:w-64 bg-black/30 border-wybe-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-gray-300">Overall Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>Completed</span>
            <span>{Math.round(completed)}%</span>
          </div>
          <Progress value={completed} className="h-1 bg-gray-800" />
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span>In Progress</span>
            <span>{Math.round(inProgress)}%</span>
          </div>
          <Progress value={inProgress} className="h-1 bg-gray-800" />
        </div>
        
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="font-medium">Overall</span>
            <span className="font-medium">{Math.round(overall)}%</span>
          </div>
          <Progress value={overall} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
};
