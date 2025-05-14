
import React, { useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { toast } from "sonner";

interface DeploymentConsoleProps {
  consoleOutput: string[];
}

export const DeploymentConsole: React.FC<DeploymentConsoleProps> = ({ consoleOutput }) => {
  const consoleRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Auto-scroll to bottom when console output changes
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleOutput]);
  
  const handleCopyOutput = () => {
    const output = consoleOutput.join('\n');
    navigator.clipboard.writeText(output);
    toast.success('Console output copied to clipboard');
  };
  
  return (
    <div className="bg-black/30 border border-white/10 rounded-md flex flex-col">
      <div className="flex items-center justify-between p-2 border-b border-white/10">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        
        <div className="text-xs text-center text-gray-400">Deployment Console</div>
        
        <Button 
          variant="outline" 
          size="icon" 
          className="h-7 w-7" 
          onClick={handleCopyOutput}
        >
          <Copy size={12} />
        </Button>
      </div>
      
      <div 
        ref={consoleRef}
        className="p-4 font-mono text-xs text-green-400 overflow-auto h-[300px]"
      >
        {consoleOutput.length === 0 ? (
          <div className="text-gray-500 italic">
            // Console output will appear here once deployment starts
          </div>
        ) : (
          consoleOutput.map((line, index) => (
            <div key={index} className="whitespace-pre-wrap mb-1">{line}</div>
          ))
        )}
      </div>
    </div>
  );
};
