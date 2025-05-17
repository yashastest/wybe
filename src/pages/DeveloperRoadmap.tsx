
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useToast } from "@/hooks/use-toast";
import { RoadmapItem } from '@/components/roadmap/RoadmapItem';
import { RoadmapProgress } from '@/components/roadmap/RoadmapProgress';
import { ProgressSummary } from '@/components/roadmap/ProgressSummary';
import { roadmapItems, calculateProgress } from '@/data/roadmapData';

const DeveloperRoadmap = () => {
  const progress = calculateProgress();
  const { toast } = useToast();
  
  useEffect(() => {
    // Show a welcome toast when the component mounts
    toast({
      title: "Developer Roadmap Updated",
      description: "Smart Contract Development and Testnet Deployment are now complete!",
    });
  }, [toast]);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Developer Roadmap</h1>
              <p className="text-gray-400">
                A comprehensive guide to implement and deploy the Wybe trading platform
              </p>
            </div>
            
            <RoadmapProgress 
              completed={progress.completed} 
              inProgress={progress.inProgress} 
              overall={progress.overall} 
            />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <ArrowRight className="mr-2 text-wybe-primary" size={20} />
                Implementation Steps
              </h2>
              
              <div className="space-y-6">
                {roadmapItems.map((item) => (
                  <RoadmapItem key={item.id} item={item} allItems={roadmapItems} />
                ))}
              </div>
            </div>
            
            <div>
              <div className="sticky top-24">
                <ProgressSummary roadmapItems={roadmapItems} />
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default DeveloperRoadmap;
