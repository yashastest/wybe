
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Switch } from '@/components/ui/switch';
import { Sparkles } from 'lucide-react';

interface EnhancedModeToggleProps {
  isEnhanced: boolean;
  onToggle: () => void;
}

const EnhancedModeToggle: React.FC<EnhancedModeToggleProps> = ({
  isEnhanced,
  onToggle
}) => {
  return (
    <motion.div 
      className="relative z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <div 
        className={`
          flex items-center gap-1.5 cursor-pointer p-0.5 rounded-xl 
          bg-gradient-to-r ${isEnhanced 
          ? 'from-purple-800/80 via-purple-700/60 to-purple-800/50'
          : 'from-gray-800 via-gray-800 to-gray-800'}
          backdrop-blur-md shadow-lg border border-white/10 hover:border-white/20 transition-all
          hover:shadow-purple-500/20
        `}
        onClick={onToggle}
        role="button"
        aria-pressed={isEnhanced}
        aria-label="Toggle Enhanced Mode"
      >
        <motion.div 
          className={`
            flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
            ${!isEnhanced 
              ? 'bg-[#1A1F2C]/90 text-white shadow-inner' 
              : 'text-gray-300 hover:text-gray-100'}
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Standard
        </motion.div>
        
        <motion.div 
          className={`
            flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
            ${isEnhanced 
              ? 'bg-purple-600 text-white shadow-lg' 
              : 'text-gray-400 hover:text-gray-200'}
          `}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Sparkles size={14} className={isEnhanced ? "text-white" : "text-gray-400"} />
          Pro
        </motion.div>
        
        {isEnhanced && (
          <motion.div 
            className="absolute -top-1 -right-1"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
          >
            <Badge className="bg-gradient-to-r from-purple-500 to-purple-700 px-1.5 text-[10px] font-bold border-0">
              PRO
            </Badge>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default EnhancedModeToggle;
