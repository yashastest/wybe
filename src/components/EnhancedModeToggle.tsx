
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface EnhancedModeToggleProps {
  isEnhanced: boolean;
  onToggle: () => void;
}

const EnhancedModeToggle: React.FC<EnhancedModeToggleProps> = ({
  isEnhanced,
  onToggle
}) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-gray-400">Mode:</span>
      <div 
        className="flex bg-[#1A1F2C] rounded-lg p-0.5 cursor-pointer"
        onClick={onToggle}
      >
        <Badge 
          variant={isEnhanced ? "outline" : "secondary"} 
          className={`transition-all duration-200 ${!isEnhanced ? 'bg-[#232734]' : 'bg-transparent'}`}
        >
          Standard
        </Badge>
        <Badge 
          variant={isEnhanced ? "secondary" : "outline"}
          className={`transition-all duration-200 ${isEnhanced ? 'bg-[#8B5CF6] text-white' : 'bg-transparent'}`}
        >
          Pro
        </Badge>
      </div>
      {isEnhanced && (
        <div className="text-[#8B5CF6] text-xs animate-pulse">
          ⚡ Enhanced
        </div>
      )}
    </div>
  );
};

export default EnhancedModeToggle;
