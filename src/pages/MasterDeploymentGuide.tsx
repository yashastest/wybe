
import React from 'react';
import { motion } from "framer-motion";
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileText, Github, Globe } from 'lucide-react';

const MasterDeploymentGuide = () => {
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
          <div>
            <h1 className="text-3xl font-bold mb-2">Master Deployment Guide</h1>
            <p className="text-gray-400">
              Follow these steps to deploy your application to production
            </p>
          </div>
          
          <Card className="bg-black/30 border-wybe-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Github className="mr-2" size={20} />
                Step 1: Clone the Repository
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Clone the repository to your local machine using Git:</p>
              <div className="bg-black/40 p-3 rounded">
                <code className="text-green-400">git clone https://github.com/your-username/wybe-app.git</code>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/30 border-wybe-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2" size={20} />
                Step 2: Configure Environment Variables
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>Create a <code>.env</code> file in the project root with the following variables:</p>
              <div className="bg-black/40 p-3 rounded">
                <code className="text-green-400">
                  VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here<br />
                  VITE_SUPABASE_URL=your_supabase_url<br />
                  VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
                </code>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/30 border-wybe-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2" size={20} />
                Step 3: Deploy to Vercel
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>To deploy your application to Vercel:</p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Sign up for a <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 underline">Vercel account</a> if you don't already have one</li>
                <li>Install the Vercel CLI: <code>npm i -g vercel</code></li>
                <li>Run <code>vercel</code> in your project directory and follow the prompts</li>
                <li>Set up your environment variables in the Vercel dashboard</li>
                <li>Deploy with <code>vercel --prod</code></li>
              </ol>
              <div className="bg-amber-500/20 p-4 rounded mt-4 border border-amber-500/30">
                <p className="text-amber-300 font-medium">Important Notes for Vercel Deployment:</p>
                <ul className="list-disc pl-5 mt-2 text-sm">
                  <li>Ensure all environment variables are properly configured in the Vercel dashboard</li>
                  <li>Set the Framework Preset to "Vite" in your project settings</li>
                  <li>Configure any additional build settings if needed</li>
                  <li>Set up proper domains and TLS certificates</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center mt-8">
            <Button className="bg-wybe-primary hover:bg-wybe-primary/90" size="lg">
              <ArrowRight className="mr-2" size={16} />
              View Full Developer Roadmap
            </Button>
          </div>
        </motion.div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MasterDeploymentGuide;
