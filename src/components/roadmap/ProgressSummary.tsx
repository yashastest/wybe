
import React from 'react';
import { BarChart3, CheckCircle2, Circle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RoadmapItem } from '@/data/roadmapData';

interface ProgressSummaryProps {
  roadmapItems: RoadmapItem[];
}

export const ProgressSummary: React.FC<ProgressSummaryProps> = ({ roadmapItems }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="text-green-500" size={20} />;
      case 'in-progress': return <Circle className="text-amber-400" size={20} />;
      case 'pending': return <Circle className="text-gray-400" size={20} />;
      default: return <Circle className="text-red-500" size={20} />;
    }
  };
  
  const estimatedTotalHours = roadmapItems.reduce((acc, item) => {
    const [min, max] = item.estimatedTime.split('-').map(t => parseInt(t, 10));
    return acc + (min + max) / 2;
  }, 0).toFixed(0);

  return (
    <>
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <BarChart3 className="mr-2 text-wybe-primary" size={20} />
        Progress Summary
      </h2>
      
      <Card className="bg-black/30 border-wybe-primary/10">
        <CardHeader>
          <CardTitle className="text-base">Task Completion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm">Completed</span>
              <Badge variant="outline" className="bg-green-500/10 text-green-500">
                {roadmapItems.filter(item => item.status === 'completed').length} / {roadmapItems.length}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">In Progress</span>
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                {roadmapItems.filter(item => item.status === 'in-progress').length} / {roadmapItems.length}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Pending</span>
              <Badge variant="outline" className="bg-gray-500/10 text-gray-400">
                {roadmapItems.filter(item => item.status === 'pending').length} / {roadmapItems.length}
              </Badge>
            </div>
            
            <Separator className="my-2" />
            
            <div className="space-y-1">
              <div className="text-sm font-medium">Estimated Completion Time</div>
              <div className="text-2xl font-bold">
                {estimatedTotalHours} hours
              </div>
              <div className="text-xs text-gray-400">
                Assuming sequential implementation of dependent tasks
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-black/30 border-wybe-primary/10 mt-6">
        <CardHeader>
          <CardTitle className="text-base">Priority Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {roadmapItems
              .filter(item => item.priority === 'high' && item.status !== 'completed')
              .map(item => (
                <div key={item.id} className="flex items-start gap-2 pb-2 border-b border-gray-800 last:border-0 last:pb-0">
                  <div className="mt-0.5">{getStatusIcon(item.status)}</div>
                  <div>
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-gray-400">{item.category} • {item.estimatedTime}</div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
