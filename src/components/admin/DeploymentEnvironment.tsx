
import React from "react";
import { motion } from "framer-motion";
import { 
  Rocket, 
  ArrowRight,
  CircleDollarSign,
  Shield,
  Star,
  Cloud,
  Server,
  Code
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { integrationService } from "@/services/integrationService";
import { toast } from "sonner";

const DeploymentEnvironment = () => {
  const [currentTab, setCurrentTab] = React.useState("overview");
  const [deploying, setDeploying] = React.useState(false);

  const handleDeployRequest = () => {
    setDeploying(true);
    
    // Simulate deployment process
    toast.info("Starting deployment process...");
    
    setTimeout(() => {
      toast.success("Deployment completed successfully!", {
        description: "Your environment is now live and ready to use."
      });
      setDeploying(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Cloud className="text-orange-500" size={24} />
          Deployment Environment Dashboard
        </h2>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="mb-6">
          <TabsList className="bg-black/20 border border-white/10">
            <TabsTrigger value="overview" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-500">
              Overview
            </TabsTrigger>
            <TabsTrigger value="frontend" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-500">
              Frontend
            </TabsTrigger>
            <TabsTrigger value="contracts" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-500">
              Smart Contracts
            </TabsTrigger>
            <TabsTrigger value="infrastructure" className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-500">
              Infrastructure
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="glass-card p-6 bg-gradient-to-br from-blue-900/20 to-transparent relative overflow-hidden"
              >
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="text-xl font-bold text-white">Frontend</h3>
                  <span className="bg-blue-500/20 p-2 rounded-full">
                    <Star size={18} className="text-blue-400" />
                  </span>
                </div>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-gray-300">
                    <span className="mr-2 text-blue-400">•</span>
                    React + Vite for fast development
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="mr-2 text-blue-400">•</span>
                    Framer Motion animations
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="mr-2 text-blue-400">•</span>
                    TailwindCSS for responsive design
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="mr-2 text-blue-400">•</span>
                    User dashboard with real-time charts
                  </li>
                </ul>
                <div className="mt-auto">
                  <Button variant="link" className="text-blue-400 p-0 flex items-center" onClick={() => setCurrentTab("frontend")}>
                    View Documentation
                    <ArrowRight size={14} className="ml-1" />
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="glass-card p-6 bg-gradient-to-br from-orange-900/20 to-transparent relative overflow-hidden"
              >
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="text-xl font-bold text-white">Smart Contracts</h3>
                  <span className="bg-orange-500/20 p-2 rounded-full">
                    <Shield size={18} className="text-orange-400" />
                  </span>
                </div>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-gray-300">
                    <span className="mr-2 text-orange-400">•</span>
                    Solana SPL token standards 
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="mr-2 text-orange-400">•</span>
                    Automated bonding curve deployment
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="mr-2 text-orange-400">•</span>
                    Creator royalty smart contracts
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="mr-2 text-orange-400">•</span>
                    Secure trading protocols
                  </li>
                </ul>
                <div className="mt-auto">
                  <Button variant="link" className="text-orange-400 p-0 flex items-center" onClick={() => setCurrentTab("contracts")}>
                    Smart Contract Docs
                    <ArrowRight size={14} className="ml-1" />
                  </Button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="glass-card p-6 bg-gradient-to-br from-green-900/20 to-transparent relative overflow-hidden"
              >
                <div className="mb-4 flex items-start justify-between">
                  <h3 className="text-xl font-bold text-white">Deployment</h3>
                  <span className="bg-green-500/20 p-2 rounded-full">
                    <Rocket size={18} className="text-green-400" />
                  </span>
                </div>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center text-gray-300">
                    <span className="mr-2 text-green-400">•</span>
                    One-click token deployment
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="mr-2 text-green-400">•</span>
                    Vercel frontend hosting included
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="mr-2 text-green-400">•</span>
                    Automated CI/CD pipeline setup
                  </li>
                  <li className="flex items-center text-gray-300">
                    <span className="mr-2 text-green-400">•</span>
                    Custom domain configuration
                  </li>
                </ul>
                <div className="mt-auto">
                  <Button variant="link" className="text-green-400 p-0 flex items-center" onClick={() => setCurrentTab("infrastructure")}>
                    Deployment Guide
                    <ArrowRight size={14} className="ml-1" />
                  </Button>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="glass-card p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-orange-500/20 p-3 rounded-full">
                  <CircleDollarSign className="text-orange-500 h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold">Infrastructure Integration</h3>
              </div>
              
              <div className="bg-black/30 border border-white/5 rounded-lg p-4 mb-6">
                <h4 className="font-mono text-sm text-gray-400 mb-2">Deployment Architecture</h4>
                <div className="grid grid-cols-3 gap-2">
                  <div className="border border-blue-500/20 rounded p-3 text-center">
                    <div className="text-xs text-blue-400 mb-1">Frontend</div>
                    <div className="text-gray-300 text-xs">Vercel/Netlify</div>
                  </div>
                  <div className="flex items-center justify-center">
                    <ArrowRight className="text-gray-500" size={14} />
                  </div>
                  <div className="border border-green-500/20 rounded p-3 text-center">
                    <div className="text-xs text-green-400 mb-1">API Layer</div>
                    <div className="text-gray-300 text-xs">Node.js + Express</div>
                  </div>
                </div>
                <div className="flex justify-center my-2">
                  <ArrowRight className="text-gray-500 transform rotate-90" size={14} />
                </div>
                <div className="border border-orange-500/20 rounded p-3 text-center mx-auto w-2/3">
                  <div className="text-xs text-orange-400 mb-1">Smart Contract</div>
                  <div className="text-gray-300 text-xs">Solana Blockchain</div>
                </div>
              </div>

              <div className="mt-8 text-center">
                <Button 
                  variant="orange" 
                  size="lg" 
                  className="px-8" 
                  onClick={handleDeployRequest}
                  disabled={deploying}
                >
                  <Rocket className="mr-2" size={16} />
                  {deploying ? "Deploying..." : "Deploy Your Environment"}
                </Button>
              </div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="frontend">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-6"
            >
              <div className="flex items-start mb-6">
                <div className="bg-blue-500/20 p-2 rounded-full mr-4">
                  <Code size={20} className="text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Frontend Deployment</h3>
                  <p className="text-gray-300">Deploy your frontend application to Vercel, Netlify, or any cloud provider with these easy steps.</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-blue-400">Prerequisites</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start">
                      <span className="mr-2 text-blue-400">1.</span>
                      <span>Node.js v16+ installed on your development machine</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-blue-400">2.</span>
                      <span>Git repository with your project code</span>
                    </li>
                    <li className="flex items-start">
                      <span className="mr-2 text-blue-400">3.</span>
                      <span>Vercel or Netlify account (free tier works fine)</span>
                    </li>
                  </ul>
                </div>
                
                <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-blue-400">Deployment Steps</h4>
                  <ol className="space-y-4 text-gray-300">
                    <li className="flex items-start">
                      <span className="mr-2 text-blue-400 font-mono">1.</span>
                      <div>
                        <p className="font-medium mb-1">Build your application</p>
                        <code className="block bg-black/50 p-2 rounded text-orange-400 text-sm mb-2">npm run build</code>
                        <p className="text-sm text-gray-400">This creates an optimized production build in the dist/ folder</p>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <span className="mr-2 text-blue-400 font-mono">2.</span>
                      <div>
                        <p className="font-medium mb-1">Connect to Git repository</p>
                        <p className="text-sm mb-2">Import your repository from GitHub/GitLab/Bitbucket to Vercel or Netlify</p>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <span className="mr-2 text-blue-400 font-mono">3.</span>
                      <div>
                        <p className="font-medium mb-1">Configure build settings</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Build command: <code className="bg-black/50 px-2 py-0.5 rounded text-orange-400">npm run build</code></li>
                          <li>Output directory: <code className="bg-black/50 px-2 py-0.5 rounded text-orange-400">dist</code></li>
                          <li>Environment variables: Add any required API keys or configuration</li>
                        </ul>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <span className="mr-2 text-blue-400 font-mono">4.</span>
                      <div>
                        <p className="font-medium mb-1">Deploy</p>
                        <p className="text-sm mb-2">Click deploy and your application will be built and published automatically</p>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <span className="mr-2 text-blue-400 font-mono">5.</span>
                      <div>
                        <p className="font-medium mb-1">Custom domain (optional)</p>
                        <p className="text-sm mb-2">Configure your custom domain in the provider's dashboard settings</p>
                      </div>
                    </li>
                  </ol>
                </div>
                
                <Alert className="bg-blue-500/10 border border-blue-500/30 text-blue-400">
                  <p>The platform automatically sets up a CI/CD pipeline for continuous deployment. Any push to your main branch will trigger a new build and deployment.</p>
                </Alert>
                
                <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-blue-400">Environment Variables</h4>
                  <p className="mb-3 text-gray-300">Required environment variables for your frontend deployment:</p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                      <thead className="text-xs uppercase bg-black/30">
                        <tr>
                          <th className="px-4 py-2">Variable Name</th>
                          <th className="px-4 py-2">Description</th>
                          <th className="px-4 py-2">Example</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-white/5">
                          <td className="px-4 py-2 font-mono text-green-400">VITE_API_URL</td>
                          <td className="px-4 py-2">Backend API endpoint</td>
                          <td className="px-4 py-2 font-mono text-xs">https://api.yourapp.com</td>
                        </tr>
                        <tr className="border-t border-white/5">
                          <td className="px-4 py-2 font-mono text-green-400">VITE_SOLANA_NETWORK</td>
                          <td className="px-4 py-2">Solana network (mainnet, testnet, devnet)</td>
                          <td className="px-4 py-2 font-mono text-xs">devnet</td>
                        </tr>
                        <tr className="border-t border-white/5">
                          <td className="px-4 py-2 font-mono text-green-400">VITE_PUBLIC_TOKEN_ADDRESS</td>
                          <td className="px-4 py-2">Your deployed token address</td>
                          <td className="px-4 py-2 font-mono text-xs">Gbj...</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="contracts">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-6"
            >
              <div className="flex items-start mb-6">
                <div className="bg-orange-500/20 p-2 rounded-full mr-4">
                  <Shield size={20} className="text-orange-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Smart Contract Deployment</h3>
                  <p className="text-gray-300">Deploy and manage smart contracts on the Solana blockchain.</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-orange-400">Contract Types</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-black/20 p-3 rounded-lg">
                      <h5 className="font-medium mb-2">SPL Token Contract</h5>
                      <p className="text-sm text-gray-300 mb-2">Standard Solana token implementation with custom parameters.</p>
                      <ul className="text-xs text-gray-400 space-y-1">
                        <li>• Name & Symbol configuration</li>
                        <li>• Custom total supply</li>
                        <li>• Decimals precision (default: 9)</li>
                        <li>• Authority management</li>
                      </ul>
                    </div>
                    
                    <div className="bg-black/20 p-3 rounded-lg">
                      <h5 className="font-medium mb-2">Bonding Curve Contract</h5>
                      <p className="text-sm text-gray-300 mb-2">Automated market maker with price function.</p>
                      <ul className="text-xs text-gray-400 space-y-1">
                        <li>• Linear or exponential curve</li>
                        <li>• Initial price configuration</li>
                        <li>• Slippage tolerance</li>
                        <li>• Fee distribution settings</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-orange-400">Deployment Process</h4>
                  <ol className="space-y-4 text-gray-300">
                    <li className="flex items-start">
                      <span className="mr-2 text-orange-400 font-mono">1.</span>
                      <div>
                        <p className="font-medium mb-1">Connect wallet</p>
                        <p className="text-sm mb-1">Connect your Solana wallet (Phantom, Solflare, etc.)</p>
                        <p className="text-xs text-gray-400">Ensure your wallet has enough SOL for deployment fees (~0.5 SOL recommended)</p>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <span className="mr-2 text-orange-400 font-mono">2.</span>
                      <div>
                        <p className="font-medium mb-1">Configure token</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Token name (e.g., "My Meme Token")</li>
                          <li>Token symbol (e.g., "MMT")</li>
                          <li>Total supply (e.g., 1,000,000,000)</li>
                          <li>Decimals (typically 9)</li>
                        </ul>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <span className="mr-2 text-orange-400 font-mono">3.</span>
                      <div>
                        <p className="font-medium mb-1">Configure bonding curve</p>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          <li>Curve type (linear, exponential, sigmoid)</li>
                          <li>Initial price</li>
                          <li>Creator fee percentage (e.g., 2.5%)</li>
                          <li>Platform fee percentage (default: 2.5%)</li>
                        </ul>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <span className="mr-2 text-orange-400 font-mono">4.</span>
                      <div>
                        <p className="font-medium mb-1">Deploy contracts</p>
                        <p className="text-sm mb-2">Our platform handles the contract compilation and deployment</p>
                        <code className="block bg-black/50 p-2 rounded text-orange-400 text-sm mb-2">
                          // Sample deployment command<br/>
                          solana program deploy ./build/token_program.so
                        </code>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <span className="mr-2 text-orange-400 font-mono">5.</span>
                      <div>
                        <p className="font-medium mb-1">Verify contracts</p>
                        <p className="text-sm mb-2">Contract verification is automatic with all deployments</p>
                      </div>
                    </li>
                  </ol>
                </div>
                
                <Alert className="bg-orange-500/10 border border-orange-500/30 text-orange-400">
                  <p>We recommend deploying to testnet first for testing before moving to mainnet. All contract deployments are immutable and cannot be changed after deployment.</p>
                </Alert>
                
                <div className="mt-4">
                  <Link to="/admin/deploy">
                    <Button variant="outline" className="border-orange-500 text-orange-400 hover:bg-orange-500/10">
                      Go to Smart Contract Deployment
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="infrastructure">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-card p-6"
            >
              <div className="flex items-start mb-6">
                <div className="bg-green-500/20 p-2 rounded-full mr-4">
                  <Server size={20} className="text-green-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Infrastructure & Integration</h3>
                  <p className="text-gray-300">Complete infrastructure setup with backend integration.</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-green-400">Architecture Overview</h4>
                  <div className="relative bg-black/20 p-6 rounded-lg">
                    <div className="mb-8">
                      <div className="flex items-center justify-center mb-2">
                        <div className="px-4 py-2 bg-blue-500/20 border border-blue-500/40 rounded text-blue-400">
                          User Frontend
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <ArrowRight className="text-gray-500 transform rotate-90" size={16} />
                      </div>
                      
                      <div className="flex items-center justify-center mb-2 mt-2">
                        <div className="px-4 py-2 bg-green-500/20 border border-green-500/40 rounded text-green-400">
                          API Gateway
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <ArrowRight className="text-gray-500 transform rotate-90" size={16} />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="px-3 py-2 bg-orange-500/20 border border-orange-500/40 rounded text-orange-400 text-center text-sm">
                        Token Contract
                      </div>
                      <div className="px-3 py-2 bg-orange-500/20 border border-orange-500/40 rounded text-orange-400 text-center text-sm">
                        Bonding Curve
                      </div>
                      <div className="px-3 py-2 bg-orange-500/20 border border-orange-500/40 rounded text-orange-400 text-center text-sm">
                        Treasury Contract
                      </div>
                    </div>
                    
                    <div className="absolute left-0 right-0 -bottom-3 text-center">
                      <span className="px-4 py-1 bg-gray-800/70 rounded-full text-xs text-gray-400">Solana Blockchain</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                    <h4 className="font-medium mb-3 text-green-400">Backend Integration</h4>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-start">
                        <span className="mr-2 text-green-400">•</span>
                        <div>
                          <p className="font-medium">Node.js Express Backend</p>
                          <p className="text-sm text-gray-400">API layer for interfacing with blockchain</p>
                        </div>
                      </li>
                      
                      <li className="flex items-start">
                        <span className="mr-2 text-green-400">•</span>
                        <div>
                          <p className="font-medium">GraphQL API</p>
                          <p className="text-sm text-gray-400">For efficient data querying</p>
                        </div>
                      </li>
                      
                      <li className="flex items-start">
                        <span className="mr-2 text-green-400">•</span>
                        <div>
                          <p className="font-medium">Event Listener</p>
                          <p className="text-sm text-gray-400">Real-time blockchain event monitoring</p>
                        </div>
                      </li>
                      
                      <li className="flex items-start">
                        <span className="mr-2 text-green-400">•</span>
                        <div>
                          <p className="font-medium">Cache Layer</p>
                          <p className="text-sm text-gray-400">Redis-based caching for performance</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                    <h4 className="font-medium mb-3 text-green-400">Hosting & DevOps</h4>
                    <ul className="space-y-3 text-gray-300">
                      <li className="flex items-start">
                        <span className="mr-2 text-green-400">•</span>
                        <div>
                          <p className="font-medium">Frontend Hosting</p>
                          <p className="text-sm text-gray-400">Vercel/Netlify with CDN</p>
                        </div>
                      </li>
                      
                      <li className="flex items-start">
                        <span className="mr-2 text-green-400">•</span>
                        <div>
                          <p className="font-medium">Backend Hosting</p>
                          <p className="text-sm text-gray-400">AWS/GCP with auto-scaling</p>
                        </div>
                      </li>
                      
                      <li className="flex items-start">
                        <span className="mr-2 text-green-400">•</span>
                        <div>
                          <p className="font-medium">CI/CD Pipeline</p>
                          <p className="text-sm text-gray-400">GitHub Actions for automated deployment</p>
                        </div>
                      </li>
                      
                      <li className="flex items-start">
                        <span className="mr-2 text-green-400">•</span>
                        <div>
                          <p className="font-medium">Monitoring</p>
                          <p className="text-sm text-gray-400">Prometheus & Grafana dashboards</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-black/30 border border-white/10 rounded-lg p-4">
                  <h4 className="font-medium mb-3 text-green-400">Configuration Steps</h4>
                  <ol className="space-y-4 text-gray-300">
                    <li className="flex items-start">
                      <span className="mr-2 text-green-400 font-mono">1.</span>
                      <div>
                        <p className="font-medium mb-1">Setup API server</p>
                        <code className="block bg-black/50 p-2 rounded text-orange-400 text-sm mb-2">
                          // Install dependencies<br/>
                          npm install<br/><br/>
                          // Start API server<br/>
                          npm run server
                        </code>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <span className="mr-2 text-green-400 font-mono">2.</span>
                      <div>
                        <p className="font-medium mb-1">Configure environment</p>
                        <p className="text-sm mb-2">Update .env files with appropriate settings:</p>
                        <code className="block bg-black/50 p-2 rounded text-orange-400 text-sm mb-2">
                          # Backend .env example<br/>
                          PORT=3001<br/>
                          SOLANA_NETWORK=devnet<br/>
                          RPC_URL=https://api.devnet.solana.com<br/>
                          REDIS_URL=redis://localhost:6379
                        </code>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <span className="mr-2 text-green-400 font-mono">3.</span>
                      <div>
                        <p className="font-medium mb-1">Deploy backend</p>
                        <p className="text-sm mb-2">Deploy backend services to cloud provider</p>
                      </div>
                    </li>
                    
                    <li className="flex items-start">
                      <span className="mr-2 text-green-400 font-mono">4.</span>
                      <div>
                        <p className="font-medium mb-1">Connect frontend</p>
                        <p className="text-sm mb-2">Update frontend configuration to use the deployed backend</p>
                      </div>
                    </li>
                  </ol>
                </div>
                
                <Alert className="bg-green-500/10 border border-green-500/30 text-green-400">
                  <p>For production deployment, we recommend setting up a dedicated monitoring system to track API performance, blockchain interactions, and overall system health.</p>
                </Alert>
                
                <div className="mt-4">
                  <Link to="/admin/deploy">
                    <Button variant="outline" className="border-green-500 text-green-400 hover:bg-green-500/10">
                      Complete Deployment Setup
                      <ArrowRight size={16} className="ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default DeploymentEnvironment;
