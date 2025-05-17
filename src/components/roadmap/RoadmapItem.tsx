
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RoadmapItem as RoadmapItemType } from '@/data/roadmapData';

interface RoadmapItemProps {
  item: RoadmapItemType;
  allItems: RoadmapItemType[];
}

const RoadmapItem: React.FC<RoadmapItemProps> = ({ item, allItems }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };
  
  const getStatusIcon = () => {
    switch (item.status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-400" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
      default:
        return null;
    }
  };
  
  const getStatusColor = () => {
    switch (item.status) {
      case 'completed':
        return 'bg-green-500/20 border-green-500/50';
      case 'in-progress':
        return 'bg-blue-500/20 border-blue-500/50';
      case 'pending':
        return 'bg-gray-500/20 border-gray-500/30';
      default:
        return 'bg-gray-500/10 border-gray-500/20';
    }
  };
  
  const getCategoryBadge = () => {
    switch (item.category) {
      case 'frontend':
        return <Badge variant="outline" className="border-purple-500 text-purple-400">Frontend</Badge>;
      case 'backend':
        return <Badge variant="outline" className="border-green-500 text-green-400">Backend</Badge>;
      case 'smart-contract':
        return <Badge variant="outline" className="border-yellow-500 text-yellow-400">Smart Contract</Badge>;
      case 'deployment':
        return <Badge variant="outline" className="border-blue-500 text-blue-400">Deployment</Badge>;
      default:
        return <Badge variant="outline">Other</Badge>;
    }
  };
  
  const getStatusBadge = () => {
    switch (item.status) {
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-500">In Progress</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const getDependencyNames = () => {
    if (!item.dependencies || item.dependencies.length === 0) return [];
    return item.dependencies.map(depId => {
      const dep = allItems.find(i => i.id === depId);
      return dep ? dep.title : depId;
    });
  };
  
  const dependencyNames = getDependencyNames();
  
  return (
    <div className={cn('rounded-lg border p-4 shadow-sm', getStatusColor())}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {getStatusIcon()}
          <h3 className="text-lg font-semibold">{item.title}</h3>
          {getCategoryBadge()}
        </div>
        <div className="flex items-center space-x-2">
          {getStatusBadge()}
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8"
            onClick={toggleOpen}
          >
            {isOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 space-y-4">
              <p className="text-gray-400">{item.description}</p>
              
              {item.steps.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Implementation Steps</h4>
                  <div className="space-y-2">
                    {item.steps.map((step, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className={cn(
                          'w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5',
                          item.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                          item.status === 'in-progress' && index <= 1 ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        )}>
                          {item.status === 'completed' || (item.status === 'in-progress' && index <= 1) ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <span className="text-xs">{index + 1}</span>
                          )}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{step.title}</div>
                          <div className="text-xs text-gray-400">{step.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex justify-between items-center text-sm text-gray-400">
                <div className="flex items-center">
                  <span className="mr-1">Priority:</span>
                  <Badge variant="outline" className={cn(
                    'capitalize',
                    item.priority === 'high' ? 'text-red-400 border-red-400' :
                    item.priority === 'medium' ? 'text-yellow-400 border-yellow-400' :
                    'text-blue-400 border-blue-400'
                  )}>
                    {item.priority}
                  </Badge>
                </div>
                <div>Est: {item.estimatedTime} hours</div>
              </div>
              
              {dependencyNames.length > 0 && (
                <div className="text-sm">
                  <span className="text-gray-400">Dependencies: </span>
                  <span>{dependencyNames.join(', ')}</span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoadmapItem;
