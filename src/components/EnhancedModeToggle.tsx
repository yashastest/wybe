
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
      <motion.div 
        className="flex bg-[#1A1F2C] rounded-lg p-0.5 cursor-pointer shadow-md border border-gray-800"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={onToggle}
      >
        <Badge 
          variant={isEnhanced ? "outline" : "secondary"} 
          className={`transition-all duration-200 ${!isEnhanced ? 'bg-[#232734] text-white border-0' : 'bg-transparent border-transparent'}`}
        >
          Standard
        </Badge>
        <Badge 
          variant={isEnhanced ? "secondary" : "outline"}
          className={`transition-all duration-200 ${isEnhanced ? 'bg-[#8B5CF6] text-white border-0' : 'bg-transparent border-transparent'}`}
        >
          Pro
        </Badge>
      </motion.div>
      {isEnhanced && (
        <motion.div 
          className="text-[#8B5CF6] text-xs font-medium"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          ⚡ Enhanced
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedModeToggle;
