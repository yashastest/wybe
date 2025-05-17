
import React from 'react';
import { Circle, CheckCircle2, AlertCircle, Lock, LayoutDashboard, Database, Code, Server, BarChart3 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RoadmapItem as RoadmapItemType } from '@/data/roadmapData';

interface RoadmapItemProps {
  item: RoadmapItemType;
  allItems: RoadmapItemType[];
}

export const RoadmapItem: React.FC<RoadmapItemProps> = ({ item, allItems }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'frontend': return <LayoutDashboard size={18} />;
      case 'backend': return <Database size={18} />;
      case 'smart-contract': return <Code size={18} />;
      case 'deployment': return <Server size={18} />;
      default: return <BarChart3 size={18} />;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="text-green-500" size={20} />;
      case 'in-progress': return <Circle className="text-amber-400" size={20} />;
      case 'pending': return <Circle className="text-gray-400" size={20} />;
      default: return <AlertCircle className="text-red-500" size={20} />;
    }
  };

  return (
    <Card className="bg-black/30 border-wybe-primary/10 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon(item.status)}
            <CardTitle className="text-lg">{item.title}</CardTitle>
          </div>
          <Badge
            variant={item.priority === 'high' ? 'destructive' : item.priority === 'medium' ? 'default' : 'outline'}
            className="capitalize"
          >
            {item.priority} priority
          </Badge>
        </div>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-0">
        <div className="space-y-3">
          {item.steps.map((step, stepIndex) => (
            <div key={stepIndex} className="pb-2">
              <div className="font-medium text-sm mb-1">{stepIndex + 1}. {step.title}</div>
              <div className="text-xs text-gray-400">{step.description}</div>
            </div>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="pt-3 pb-3 flex items-center justify-between text-xs text-gray-400 border-t border-gray-800">
        <div className="flex items-center gap-2">
          <div className="bg-gray-800 p-1 rounded">
            {getCategoryIcon(item.category)}
          </div>
          <span className="capitalize">{item.category}</span>
        </div>
        
        <div className="flex items-center gap-4">
          {item.dependencies && (
            <div className="flex items-center gap-1">
              <Lock size={12} />
              <span>
                Dependencies: {item.dependencies.map(dep => {
                  const depItem = allItems.find(i => i.id === dep);
                  return depItem ? depItem.title.split(' ')[0] : dep;
                }).join(', ')}
              </span>
            </div>
          )}
          <div>Est. time: {item.estimatedTime}</div>
        </div>
      </CardFooter>
    </Card>
  );
};
