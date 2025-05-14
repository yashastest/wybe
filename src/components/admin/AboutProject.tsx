import React from "react";
import { motion } from "framer-motion";
import {
  Info,
  Code,
  Server,
  Database,
  Rocket,
  Shield,
  Clock,
  FileText,
  Settings,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AboutProject = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="bg-orange-500/20 p-3 rounded-full">
            <Info className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">About The Project</h2>
            <p className="text-gray-400">
              Comprehensive guide to the Wybe Finance platform, its features,
              architecture, and deployment process.
            </p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="bg-black/20 border border-white/10">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-500"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="architecture"
              className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-500"
            >
              Architecture
            </TabsTrigger>
            <TabsTrigger
              value="deployment"
              className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-500"
            >
              Deployment
            </TabsTrigger>
            <TabsTrigger
              value="contracts"
              className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-500"
            >
              Smart Contracts
            </TabsTrigger>
            <TabsTrigger
              value="roadmap"
              className="data-[state=active]:bg-orange-500/20 data-[state=active]:text-orange-500"
            >
              Roadmap
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <Card className="bg-black/30 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-orange-500" />
                  Project Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  Wybe Finance is a comprehensive platform for creating,
                  deploying, and trading creator tokens on the Solana blockchain.
                  It enables creators to launch their own branded tokens with
                  customizable parameters and automated market makers through
                  bonding curves.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Code className="h-5 w-5 text-blue-400" />
                      Core Features
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-1">
                          1
                        </Badge>
                        <div>
                          <span className="font-medium">Token Creation</span>
                          <p className="text-sm text-gray-400">
                            Deploy custom SPL tokens with configurable parameters
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-1">
                          2
                        </Badge>
                        <div>
                          <span className="font-medium">
                            Automated Trading
                          </span>
                          <p className="text-sm text-gray-400">
                            Bonding curve AMM with creator royalties
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-1">
                          3
                        </Badge>
                        <div>
                          <span className="font-medium">
                            Creator Marketplace
                          </span>
                          <p className="text-sm text-gray-400">
                            Discover and trade creator tokens
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-1">
                          4
                        </Badge>
                        <div>
                          <span className="font-medium">
                            Analytics Dashboard
                          </span>
                          <p className="text-sm text-gray-400">
                            Real-time data on token performance
                          </p>
                        </div>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge variant="outline" className="mt-1">
                          5
                        </Badge>
                        <div>
                          <span className="font-medium">Treasury Management</span>
                          <p className="text-sm text-gray-400">
                            Platform and creator fee processing
                          </p>
                        </div>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Settings className="h-5 w-5 text-green-400" />
                      Key Parameters
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex justify-between items-center">
                        <span className="text-gray-400">Creator Fee</span>
                        <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                          2.5%
                        </Badge>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-400">Platform Fee</span>
                        <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                          2.5%
                        </Badge>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-400">
                          Default Token Decimals
                        </span>
                        <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                          9
                        </Badge>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-400">
                          DEXScreener Threshold
                        </span>
                        <Badge className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30">
                          $50,000
                        </Badge>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-400">
                          Reward Claim Period
                        </span>
                        <Badge className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30">
                          5 days
                        </Badge>
                      </li>
                      <li className="flex justify-between items-center">
                        <span className="text-gray-400">
                          Default Deployment Network
                        </span>
                        <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30">
                          Devnet
                        </Badge>
                      </li>
                    </ul>
                  </div>
                </div>

                <Alert className="bg-blue-500/10 border-blue-500/30 mt-6">
                  <p className="text-blue-400">
                    This platform combines a user-friendly frontend with powerful
                    Solana blockchain technology to create a seamless token
                    creation and trading experience.
                  </p>
                </Alert>
              </CardContent>
            </Card>

            <Card className="bg-black/30 border-white/10 mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-orange-500" />
                  Tech Stack
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-blue-400">Frontend</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center gap-2 text-sm">
                        <span className="text-blue-400">•</span>
                        React + Vite (TypeScript)
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <span className="text-blue-400">•</span>
                        Tailwind CSS + Shadcn UI
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <span className="text-blue-400">•</span>
                        Framer Motion animations
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <span className="text-blue-400">•</span>
                        React Router DOM
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <span className="text-blue-400">•</span>
                        Sonner for toast notifications
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <span className="text-blue-400">•</span>
                        Recharts for data visualization
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <span className="text-blue-400">•</span>
                        Lucide React for icons
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-green-400">Backend</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center gap-2 text-sm">
                        <span className="text-green-400">•</span>
                        Node.js + Express API
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <span className="text-green-400">•</span>
                        GraphQL data layer (optional)
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <span className="text-green-400">•</span>
                        Redis for caching
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <span className="text-green-400">•</span>
                        JWT authentication
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <span className="text-green-400">•</span>
                        API rate limiting
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <span className="text-green-400">•</span>
                        Serverless functions
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-orange-400">
                      Blockchain
                    </h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex items-center gap-2 text-sm">
                        <span className="text-orange-400">•</span>
                        Solana blockchain
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <span className="text-orange-400">•</span>
                        Anchor framework
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <span className="text-orange-400">•</span>
                        Rust for smart contracts
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <span className="text-orange-400">•</span>
                        SPL Token standard
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <span className="text-orange-400">•</span>
                        Bonding curve AMM
                      </li>
                      <li className="flex items-center gap-2 text-sm">
                        <span className="text-orange-400">•</span>
                        Solana Web3.js
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Architecture Tab */}
          <TabsContent value="architecture">
            <Card className="bg-black/30 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-orange-500" />
                  System Architecture
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-black/40 p-6 rounded-lg border border-white/5">
                  <h3 className="text-lg font-semibold mb-4">Architecture Diagram</h3>
                  
                  <div className="relative bg-black/20 p-6 rounded-lg">
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="px-3 py-4 bg-blue-500/20 border border-blue-500/40 rounded text-center">
                        <p className="font-medium text-blue-400 mb-1">User Interface</p>
                        <p className="text-xs text-gray-400">React + Tailwind</p>
                      </div>
                      <div className="px-3 py-4 bg-blue-500/20 border border-blue-500/40 rounded text-center">
                        <p className="font-medium text-blue-400 mb-1">Admin Dashboard</p>
                        <p className="text-xs text-gray-400">Protected Routes</p>
                      </div>
                      <div className="px-3 py-4 bg-blue-500/20 border border-blue-500/40 rounded text-center">
                        <p className="font-medium text-blue-400 mb-1">Wallet Integration</p>
                        <p className="text-xs text-gray-400">Phantom/Solflare</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="w-12 h-6 border-l-2 border-r-2 border-b-2 border-gray-600"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 mb-8 mt-2">
                      <div className="px-3 py-4 bg-green-500/20 border border-green-500/40 rounded text-center">
                        <p className="font-medium text-green-400 mb-1">API Gateway & Service Layer</p>
                        <p className="text-xs text-gray-400">Express + Authentication + Rate Limiting</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="w-12 h-6 border-l-2 border-r-2 border-b-2 border-gray-600"></div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4 mt-2">
                      <div className="px-3 py-4 bg-purple-500/20 border border-purple-500/40 rounded text-center">
                        <p className="font-medium text-purple-400 mb-1">Database Layer</p>
                        <p className="text-xs text-gray-400">User Data & Platform Data</p>
                      </div>
                      <div className="px-3 py-4 bg-orange-500/20 border border-orange-500/40 rounded text-center">
                        <p className="font-medium text-orange-400 mb-1">Blockchain Integration</p>
                        <p className="text-xs text-gray-400">Smart Contract Interaction</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-center">
                      <div className="w-32 h-6 border-l-2 border-r-2 border-b-2 border-gray-600 mx-auto"></div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4 mt-2">
                      <div className="px-3 py-4 bg-yellow-500/20 border border-yellow-500/40 rounded text-center">
                        <p className="font-medium text-yellow-400">Solana Blockchain</p>
                        <p className="text-xs text-gray-400">SPL Token + Anchor Programs</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="frontend" className="border-white/10">
                    <AccordionTrigger className="text-white hover:text-orange-400">
                      Frontend Architecture
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      <div className="space-y-3">
                        <p className="mb-2">
                          The frontend is built using React with TypeScript and follows a component-based architecture.
                          Key aspects include:
                        </p>
                        <ul className="space-y-2 list-disc pl-5">
                          <li>Custom hooks for reusable logic (wallet connection, admin auth)</li>
                          <li>Responsive design using Tailwind CSS</li>
                          <li>Framer Motion for animations and transitions</li>
                          <li>Protected routes for admin functionality</li>
                          <li>Recharts for data visualization</li>
                          <li>React Router for navigation</li>
                          <li>Service layer for API and blockchain interactions</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="backend" className="border-white/10">
                    <AccordionTrigger className="text-white hover:text-orange-400">
                      Backend Architecture
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      <div className="space-y-3">
                        <p className="mb-2">
                          The backend serves as an intermediary between the frontend and the blockchain, providing:
                        </p>
                        <ul className="space-y-2 list-disc pl-5">
                          <li>User authentication and session management</li>
                          <li>API endpoints for token data and analytics</li>
                          <li>Caching layer for performance optimization</li>
                          <li>Blockchain event listener for real-time updates</li>
                          <li>Database operations for persistent storage</li>
                          <li>Rate limiting and security measures</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="blockchain" className="border-white/10">
                    <AccordionTrigger className="text-white hover:text-orange-400">
                      Blockchain Architecture
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      <div className="space-y-3">
                        <p className="mb-2">
                          The blockchain layer is built on Solana using the Anchor framework, featuring:
                        </p>
                        <ul className="space-y-2 list-disc pl-5">
                          <li>SPL token creation program for deploying new tokens</li>
                          <li>Bonding curve AMM for automated token trading</li>
                          <li>Fee distribution logic for creator and platform fees</li>
                          <li>Treasury management for collected fees</li>
                          <li>Token governance features for project management</li>
                          <li>On-chain token metadata storage</li>
                        </ul>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="data" className="border-white/10">
                    <AccordionTrigger className="text-white hover:text-orange-400">
                      Data Flow
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      <div className="space-y-3">
                        <p className="mb-2">
                          Data flows through the system in the following manner:
                        </p>
                        <ol className="space-y-2 list-decimal pl-5">
                          <li>User interacts with frontend components</li>
                          <li>Service layer processes requests</li>
                          <li>API Gateway authenticates and routes requests</li>
                          <li>Blockchain interactions are processed via Web3.js</li>
                          <li>Smart contracts execute token operations</li>
                          <li>Events are emitted and captured by listeners</li>
                          <li>Results are cached and stored in database</li>
                          <li>Updated data is returned to frontend</li>
                          <li>UI updates to reflect changes</li>
                        </ol>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Deployment Tab */}
          <TabsContent value="deployment">
            <Card className="bg-black/30 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-orange-500" />
                  Deployment Process
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-black/40 p-6 rounded-lg border border-white/5">
                  <h3 className="text-lg font-semibold mb-4">Deployment Overview</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-black/20 p-4 rounded-lg border border-blue-500/20">
                      <h4 className="text-blue-400 font-medium mb-2">Frontend Deployment</h4>
                      <p className="text-sm text-gray-300 mb-2">
                        Deploy the React application using Vercel or Netlify for optimal performance
                      </p>
                      <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">
                        Vercel/Netlify (Recommended)
                      </Badge>
                    </div>
                    
                    <div className="bg-black/20 p-4 rounded-lg border border-green-500/20">
                      <h4 className="text-green-400 font-medium mb-2">Backend Deployment</h4>
                      <p className="text-sm text-gray-300 mb-2">
                        Deploy Node.js API using serverless functions or container-based hosting
                      </p>
                      <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/30">
                        Vercel Edge/AWS Lambda
                      </Badge>
                    </div>
                    
                    <div className="bg-black/20 p-4 rounded-lg border border-orange-500/20">
                      <h4 className="text-orange-400 font-medium mb-2">Smart Contract Deployment</h4>
                      <p className="text-sm text-gray-300 mb-2">
                        Deploy Anchor programs to Solana devnet or mainnet
                      </p>
                      <Badge className="bg-orange-500/20 text-orange-400 hover:bg-orange-500/30">
                        Solana (Devnet/Mainnet)
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="bg-black/20 p-5 rounded-lg border border-white/10">
                  <h3 className="text-lg font-semibold mb-4">Step-by-Step Deployment Guide</h3>
                  
                  <ol className="space-y-6">
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 bg-blue-500/20 rounded-full h-8 w-8 flex items-center justify-center">
                        <span className="text-blue-400 font-medium">1</span>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">Prerequisites</h4>
                        <ul className="mt-2 space-y-2 text-gray-300">
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-blue-400">•</span>
                            Git repository with the project code
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-blue-400">•</span>
                            Node.js v16+ installed
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-blue-400">•</span>
                            Solana CLI tools (for blockchain deployment)
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-blue-400">•</span>
                            Anchor CLI (for smart contract deployment)
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-blue-400">•</span>
                            Vercel or Netlify account
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-blue-400">•</span>
                            Environment variables prepared
                          </li>
                        </ul>
                      </div>
                    </li>
                    
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 bg-green-500/20 rounded-full h-8 w-8 flex items-center justify-center">
                        <span className="text-green-400 font-medium">2</span>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">Smart Contract Deployment</h4>
                        <ul className="mt-2 space-y-2 text-gray-300">
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-green-400">•</span>
                            Navigate to the anchor-program directory
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-green-400">•</span>
                            Install dependencies: <code className="bg-black/30 px-2 py-0.5 rounded">npm install</code>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-green-400">•</span>
                            Build the program: <code className="bg-black/30 px-2 py-0.5 rounded">anchor build</code>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-green-400">•</span>
                            Deploy to desired network: <code className="bg-black/30 px-2 py-0.5 rounded">anchor deploy --provider.cluster devnet</code>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-green-400">•</span>
                            Update program ID in Anchor.toml and lib.rs
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-green-400">•</span>
                            Run tests: <code className="bg-black/30 px-2 py-0.5 rounded">anchor test</code>
                          </li>
                        </ul>
                      </div>
                    </li>
                    
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 bg-orange-500/20 rounded-full h-8 w-8 flex items-center justify-center">
                        <span className="text-orange-400 font-medium">3</span>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">Backend Deployment (API)</h4>
                        <ul className="mt-2 space-y-2 text-gray-300">
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-orange-400">•</span>
                            Option 1: Deploy to Vercel
                            <ul className="pl-6 space-y-1 mt-1">
                              <li className="text-xs">Connect GitHub repository</li>
                              <li className="text-xs">Configure environment variables</li>
                              <li className="text-xs">Set output directory to 'dist'</li>
                              <li className="text-xs">Deploy with Vercel CLI: <code className="bg-black/30 px-1 rounded">vercel --prod</code></li>
                            </ul>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-orange-400">•</span>
                            Option 2: Deploy to AWS
                            <ul className="pl-6 space-y-1 mt-1">
                              <li className="text-xs">Configure AWS credentials</li>
                              <li className="text-xs">Set up Serverless framework</li>
                              <li className="text-xs">Deploy with: <code className="bg-black/30 px-1 rounded">serverless deploy</code></li>
                            </ul>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-orange-400">•</span>
                            Set up environment variables:
                            <ul className="pl-6 space-y-1 mt-1">
                              <li className="text-xs">SOLANA_NETWORK (devnet/mainnet)</li>
                              <li className="text-xs">RPC_URL (Solana RPC endpoint)</li>
                              <li className="text-xs">JWT_SECRET (for authentication)</li>
                              <li className="text-xs">ADMIN_WALLET (admin wallet address)</li>
                            </ul>
                          </li>
                        </ul>
                      </div>
                    </li>
                    
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 bg-purple-500/20 rounded-full h-8 w-8 flex items-center justify-center">
                        <span className="text-purple-400 font-medium">4</span>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">Frontend Deployment</h4>
                        <ul className="mt-2 space-y-2 text-gray-300">
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-purple-400">•</span>
                            Build the frontend: <code className="bg-black/30 px-2 py-0.5 rounded">npm run build</code>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-purple-400">•</span>
                            Option 1: Deploy to Vercel (Recommended)
                            <ul className="pl-6 space-y-1 mt-1">
                              <li className="text-xs">Connect to GitHub repository</li>
                              <li className="text-xs">Set build command: <code className="bg-black/30 px-1 rounded">npm run build</code></li>
                              <li className="text-xs">Set output directory: <code className="bg-black/30 px-1 rounded">dist</code></li>
                              <li className="text-xs">Configure environment variables</li>
                            </ul>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-purple-400">•</span>
                            Option 2: Deploy to Netlify
                            <ul className="pl-6 space-y-1 mt-1">
                              <li className="text-xs">Connect to GitHub repository</li>
                              <li className="text-xs">Set build command: <code className="bg-black/30 px-1 rounded">npm run build</code></li>
                              <li className="text-xs">Set output directory: <code className="bg-black/30 px-1 rounded">dist</code></li>
                              <li className="text-xs">Configure environment variables</li>
                            </ul>
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-purple-400">•</span>
                            Set environment variables:
                            <ul className="pl-6 space-y-1 mt-1">
                              <li className="text-xs">VITE_API_URL (backend API URL)</li>
                              <li className="text-xs">VITE_SOLANA_NETWORK (devnet/mainnet)</li>
                              <li className="text-xs">VITE_PROGRAM_ID (deployed program ID)</li>
                            </ul>
                          </li>
                        </ul>
                      </div>
                    </li>
                    
                    <li className="flex gap-4">
                      <div className="flex-shrink-0 bg-blue-500/20 rounded-full h-8 w-8 flex items-center justify-center">
                        <span className="text-blue-400 font-medium">5</span>
                      </div>
                      <div className="flex-grow">
                        <h4 className="font-medium">Post-Deployment Configuration</h4>
                        <ul className="mt-2 space-y-2 text-gray-300">
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-blue-400">•</span>
                            Set up custom domain (optional)
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-blue-400">•</span>
                            Configure SSL certificates
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-blue-400">•</span>
                            Set up monitoring with Vercel Analytics or Google Analytics
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-blue-400">•</span>
                            Configure CDN caching rules
                          </li>
                          <li className="flex items-start gap-2 text-sm">
                            <span className="text-blue-400">•</span>
                            Test all functionality in the deployed environment
                          </li>
                        </ul>
                      </div>
                    </li>
                  </ol>
                </div>
                
                <Alert className="bg-blue-500/10 border-blue-500/30">
                  <p className="text-blue-400">
                    <strong>Pro Tip:</strong> Use GitHub Actions or similar CI/CD pipelines to automate the deployment process. 
                    This ensures consistent and reliable deployment with each code push.
                  </p>
                </Alert>
                
                <div className="bg-black/20 p-5 rounded-lg border border-white/10">
                  <h3 className="text-lg font-semibold mb-3">Service Cost Estimates</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-300">
                      <thead className="text-xs uppercase bg-black/30">
                        <tr>
                          <th scope="col" className="px-4 py-3">Service</th>
                          <th scope="col" className="px-4 py-3">Free Tier</th>
                          <th scope="col" className="px-4 py-3">Paid Option</th>
                          <th scope="col" className="px-4 py-3">Monthly Cost</th>
                          <th scope="col" className="px-4 py-3">Notes</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-white/5">
                          <td className="px-4 py-3">Vercel (Frontend)</td>
                          <td className="px-4 py-3">Yes</td>
                          <td className="px-4 py-3">Pro Plan</td>
                          <td className="px-4 py-3">$20+</td>
                          <td className="px-4 py-3">Custom domains, more builds</td>
                        </tr>
                        <tr className="border-t border-white/5">
                          <td className="px-4 py-3">Netlify (Alternative)</td>
                          <td className="px-4 py-3">Yes</td>
                          <td className="px-4 py-3">Pro Plan</td>
                          <td className="px-4 py-3">$19+</td>
                          <td className="px-4 py-3">Similar to Vercel</td>
                        </tr>
                        <tr className="border-t border-white/5">
                          <td className="px-4 py-3">AWS Lambda (Backend)</td>
                          <td className="px-4 py-3">Yes</td>
                          <td className="px-4 py-3">Pay-per-use</td>
                          <td className="px-4 py-3">$10-50</td>
                          <td className="px-4 py-3">Depends on traffic</td>
                        </tr>
                        <tr className="border-t border-white/5">
                          <td className="px-4 py-3">Database (MongoDB Atlas)</td>
                          <td className="px-4 py-3">Yes</td>
                          <td className="px-4 py-3">Shared Cluster</td>
                          <td className="px-4 py-3">$9+</td>
                          <td className="px-4 py-3">500MB-5GB storage</td>
                        </tr>
                        <tr className="border-t border-white/5">
                          <td className="px-4 py-3">Database (Supabase)</td>
                          <td className="px-4 py-3">Yes</td>
                          <td className="px-4 py-3">Pro Plan</td>
                          <td className="px-4 py-3">$25+</td>
                          <td className="px-4 py-3">8GB storage, auth included</td>
                        </tr>
                        <tr className="border-t border-white/5">
                          <td className="px-4 py-3">Solana RPC (QuickNode)</td>
                          <td className="px-4 py-3">No</td>
                          <td className="px-4 py-3">Dev Plan</td>
                          <td className="px-4 py-3">$49+</td>
                          <td className="px-4 py-3">Reliable RPC access</td>
                        </tr>
                        <tr className="border-t border-white/5">
                          <td className="px-4 py-3">Redis Cache (Upstash)</td>
                          <td className="px-4 py-3">Yes</td>
                          <td className="px-4 py-3">Pay-per-use</td>
                          <td className="px-4 py-3">$5-20</td>
                          <td className="px-4 py-3">Performance improvement</td>
                        </tr>
                        <tr className="border-t border-white/5 font-medium">
                          <td className="px-4 py-3">Total (Estimated)</td>
                          <td className="px-4 py-3">-</td>
                          <td className="px-4 py-3">-</td>
                          <td className="px-4 py-3 text-orange-400">$50-150</td>
                          <td className="px-4 py-3">Production-ready setup</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Smart Contracts Tab */}
          <TabsContent value="contracts">
            <Card className="bg-black/30 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-orange-500" />
                  Smart Contract Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-black/40 p-6 rounded-lg border border-white/5">
                  <h3 className="text-lg font-semibold mb-4">Contract Architecture</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                      <h4 className="text-orange-400 font-medium mb-3">Token Contract</h4>
                      <p className="text-sm text-gray-300 mb-4">
                        The core SPL token contract with creator-specific extensions
                      </p>
                      
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-sm font-medium text-white mb-1">Key Functions:</h5>
                          <ul className="text-xs space-y-1 text-gray-400">
                            <li>• token_initialize(name, symbol, decimals, supply)</li>
                            <li>• token_mint(to, amount)</li>
                            <li>• token_transfer(from, to, amount)</li>
                            <li>• token_burn(amount)</li>
                            <li>• update_metadata(metadata)</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium text-white mb-1">State Variables:</h5>
                          <ul className="text-xs space-y-1 text-gray-400">
                            <li>• name: String</li>
                            <li>• symbol: String</li>
                            <li>• decimals: u8</li>
                            <li>• supply: u64</li>
                            <li>• authority: Pubkey</li>
                            <li>• creator: Pubkey</li>
                            <li>• metadata: TokenMetadata</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                      <h4 className="text-orange-400 font-medium mb-3">Bonding Curve Contract</h4>
                      <p className="text-sm text-gray-300 mb-4">
                        Automated market maker with configurable bonding curves
                      </p>
                      
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-sm font-medium text-white mb-1">Key Functions:</h5>
                          <ul className="text-xs space-y-1 text-gray-400">
                            <li>• initialize_curve(curve_type, slope, initial_price)</li>
                            <li>• buy_tokens(amount)</li>
                            <li>• sell_tokens(amount)</li>
                            <li>• calculate_price(amount, direction)</li>
                            <li>• collect_fees()</li>
                          </ul>
                        </div>
                        
                        <div>
                          <h5 className="text-sm font-medium text-white mb-1">State Variables:</h5>
                          <ul className="text-xs space-y-1 text-gray-400">
                            <li>• curve_type: CurveType (Linear, Exponential, etc)</li>
                            <li>• slope: f64</li>
                            <li>• base_price: u64</li>
                            <li>• creator_fee_percent: u8</li>
                            <li>• platform_fee_percent: u8</li>
                            <li>• reserve_balance: u64</li>
                            <li>• token_supply: u64</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                      <h4 className="text-orange-400 font-medium mb-3">Treasury Contract</h4>
                      <p className="text-sm text-gray-300 mb-4">
                        Manages fee collection and distribution to creator and platform
                      </p>
                      
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-sm font-medium text-white mb-1">Key Functions:</h5>
                          <ul className="text-xs space-y-1 text-gray-400">
                            <li>• initialize_treasury(platform_wallet)</li>
                            <li>• deposit_fees(creator, amount)</li>
                            <li>• withdraw_creator_fees(creator, amount)</li>
                            <li>• withdraw_platform_fees(amount)</li>
                            <li>• get_balance(creator)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-black/20 p-4 rounded-lg border border-white/10">
                      <h4 className="text-orange-400 font-medium mb-3">Governance Contract</h4>
                      <p className="text-sm text-gray-300 mb-4">
                        Handles token governance and community proposals
                      </p>
                      
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-sm font-medium text-white mb-1">Key Functions:</h5>
                          <ul className="text-xs space-y-1 text-gray-400">
                            <li>• create_proposal(title, description, options)</li>
                            <li>• vote(proposal_id, option, amount)</li>
                            <li>• execute_proposal(proposal_id)</li>
                            <li>• cancel_proposal(proposal_id)</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="fees" className="border-white/10">
                    <AccordionTrigger className="text-white hover:text-orange-400">
                      Fee Structure
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      <div className="space-y-3">
                        <p className="mb-2">
                          The platform implements a dual fee structure to reward both creators and the platform:
                        </p>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-3 bg-green-500/10 rounded-lg">
                            <h4 className="text-green-400 font-medium mb-1">Creator Fee</h4>
                            <p className="text-xs">Default: 2.5% of transaction volume</p>
                            <ul className="mt-2 text-xs list-disc pl-4 space-y-1">
                              <li>Earned on every trade involving their token</li>
                              <li>Automatically credited to creator wallet</li>
                              <li>Withdrawable after 5-day holding period</li>
                              <li>Percentage adjustable by platform admin</li>
                            </ul>
                          </div>
                          
                          <div className="p-3 bg-blue-500/10 rounded-lg">
                            <h4 className="text-blue-400 font-medium mb-1">Platform Fee</h4>
                            <p className="text-xs">Default: 2.5% of transaction volume</p>
                            <ul className="mt-2 text-xs list-disc pl-4 space-y-1">
                              <li>Applied to all transactions on the platform</li>
                              <li>Used for platform maintenance and development</li>
                              <li>Collected in treasury contract</li>
                              <li>Only withdrawable by platform admin</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-black/30 rounded-lg mt-2">
                          <h4 className="text-white font-medium mb-1">Fee Calculation Example</h4>
                          <p className="text-xs mb-2">For a trade with 100 SOL volume:</p>
                          <ul className="text-xs space-y-1">
                            <li>• Creator fee: 100 SOL × 2.5% = 2.5 SOL</li>
                            <li>• Platform fee: 100 SOL × 2.5% = 2.5 SOL</li>
                            <li>• Total fees: 5 SOL (5% of transaction volume)</li>
                            <li>• Net trade amount: 95 SOL</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="bonding" className="border-white/10">
                    <AccordionTrigger className="text-white hover:text-orange-400">
                      Bonding Curve Mechanics
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      <div className="space-y-3">
                        <p className="mb-2">
                          The bonding curve determines the token price based on the current supply, 
                          creating an automated market maker (AMM) mechanism:
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="p-3 bg-black/20 rounded-lg">
                            <h4 className="text-purple-400 font-medium mb-1">Linear Curve</h4>
                            <p className="text-xs mb-2">Price = m × supply + b</p>
                            <ul className="text-xs list-disc pl-4 space-y-1">
                              <li>Price increases linearly with supply</li>
                              <li>Predictable price growth</li>
                              <li>Good for stable growth tokens</li>
                            </ul>
                          </div>
                          
                          <div className="p-3 bg-black/20 rounded-lg">
                            <h4 className="text-orange-400 font-medium mb-1">Exponential Curve</h4>
                            <p className="text-xs mb-2">Price = b × supply^m</p>
                            <ul className="text-xs list-disc pl-4 space-y-1">
                              <li>Price grows exponentially with supply</li>
                              <li>More dramatic price increases</li>
                              <li>Good for scarce token models</li>
                            </ul>
                          </div>
                          
                          <div className="p-3 bg-black/20 rounded-lg">
                            <h4 className="text-blue-400 font-medium mb-1">Sigmoid Curve</h4>
                            <p className="text-xs mb-2">More complex S-shaped curve</p>
                            <ul className="text-xs list-disc pl-4 space-y-1">
                              <li>Slow start, rapid middle growth, plateau</li>
                              <li>Models natural adoption curves</li>
                              <li>Advanced use cases</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-black/30 rounded-lg mt-2">
                          <h4 className="text-white font-medium mb-1">Price Calculation</h4>
                          <p className="text-xs mb-2">The smart contract calculates:</p>
                          <ul className="text-xs space-y-1">
                            <li>• Buy price: Current curve value at (supply + amount)</li>
                            <li>• Sell price: Current curve value at supply</li>
                            <li>• Price impact: How the trade affects the curve</li>
                            <li>• Slippage: Acceptable price deviation in %</li>
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="anchor" className="border-white/10">
                    <AccordionTrigger className="text-white hover:text-orange-400">
                      Anchor Program Structure
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-400">
                      <div className="space-y-3">
                        <p className="mb-2">
                          The smart contracts are built using the Anchor framework, which provides structure and safety:
                        </p>
                        
                        <div className="p-3 bg-black/20 rounded-lg">
                          <h4 className="text-white font-medium mb-2">Program Structure</h4>
                          <pre className="text-xs bg-black/40 p-3 rounded overflow-x-auto">
{`// Project structure
anchor-program/
├── Anchor.toml           # Configuration file
├── programs/
│   └── wybe_token_program/
│       ├── Cargo.toml    # Dependencies
│       └── src/
│           └── lib.rs    # Main program code
└── tests/               # JavaScript tests`}
                          </pre>
                        </div>
                        
                        <div className="p-3 bg-black/20 rounded-lg mt-4">
                          <h4 className="text-white font-medium mb-2">Program Account Structure</h4>
                          <pre className="text-xs bg-black/40 p-3 rounded overflow-x-auto">
{`#[account]
pub struct TokenAccount {
    pub name: String,
    pub symbol: String,
    pub decimals: u8,
    pub total_supply: u64,
    pub creator: Pubkey,
    pub authority: Pubkey,
}

#[account]
pub struct BondingCurve {
    pub token_mint: Pubkey,
    pub curve_type: u8,
    pub slope: u64,
    pub base_price: u64,
    pub creator_fee_percent: u8,
    pub platform_fee_percent: u8,
    pub reserve_balance: u64,
    pub token_supply: u64,
}

#[account]
pub struct Treasury {
    pub platform_wallet: Pubkey,
    pub total_fees_collected: u64,
}`}
                          </pre>
                        </div>
                        
                        <div className="p-3 bg-black/20 rounded-lg mt-4">
                          <h4 className="text-white font-medium mb-2">Main Program Entrypoint</h4>
                          <pre className="text-xs bg-black/40 p-3 rounded overflow-x-auto">
{`#[program]
pub mod wybe_token_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, name: String, symbol: String, decimals: u8) -> Result<()> {
        // Implementation
    }

    pub fn mint_token(ctx: Context<MintToken>, amount: u64) -> Result<()> {
        // Implementation
    }

    pub fn initialize_curve(ctx: Context<InitializeCurve>, curve_type: u8, slope: u64, base_price: u64) -> Result<()> {
        // Implementation
    }

    pub fn buy_tokens(ctx: Context<BuyTokens>, amount: u64) -> Result<()> {
        // Implementation
    }

    pub fn sell_tokens(ctx: Context<SellTokens>, amount: u64) -> Result<()> {
        // Implementation
    }

    // Other instructions...
}`}
                          </pre>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="bg-black/20 p-5 rounded-lg border border-white/10">
                  <h3 className="text-lg font-semibold mb-4">Implementation Status & Next Steps</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Shield className="h-5 w-5 text-green-500" />
                        <span>Completed Components</span>
                      </h4>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start gap-2">
                          <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-400">
                            ✓
                          </Badge>
                          <span>Basic SPL token program structure</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-400">
                            ✓
                          </Badge>
                          <span>Token initialization and minting logic</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-400">
                            ✓
                          </Badge>
                          <span>Fee calculation mechanisms</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Badge variant="outline" className="bg-green-500/10 border-green-500/20 text-green-400">
                            ✓
                          </Badge>
                          <span>Linear bonding curve implementation</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-yellow-500" />
                        <span>In Progress</span>
                      </h4>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start gap-2">
                          <Badge variant="outline" className="bg-yellow-500/10 border-yellow-500/20 text-yellow-400">
                            ⟳
                          </Badge>
                          <span>Exponential and sigmoid bonding curves</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Badge variant="outline" className="bg-yellow-500/10 border-yellow-500/20 text-yellow-400">
                            ⟳
                          </Badge>
                          <span>Treasury contract with fee distribution</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Badge variant="outline" className="bg-yellow-500/10 border-yellow-500/20 text-yellow-400">
                            ⟳
                          </Badge>
                          <span>Advanced testing scenarios</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <span>Next Steps</span>
                      </h4>
                      <ul className="space-y-2 text-gray-300">
                        <li className="flex items-start gap-2">
                          <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-400">
                            →
                          </Badge>
                          <div>
                            <span className="font-medium">Governance & voting contract</span>
                            <p className="text-xs text-gray-400 mt-1">Enable token holders to create and vote on proposals</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-400">
                            →
                          </Badge>
                          <div>
                            <span className="font-medium">Advanced token vesting</span>
                            <p className="text-xs text-gray-400 mt-1">Time-locked token release schedules for creators</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-400">
                            →
                          </Badge>
                          <div>
                            <span className="font-medium">Token staking rewards</span>
                            <p className="text-xs text-gray-400 mt-1">Allow token holders to earn rewards by staking</p>
                          </div>
                        </li>
                        <li className="flex items-start gap-2">
                          <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-400">
                            →
                          </Badge>
                          <div>
                            <span className="font-medium">Security audits</span>
                            <p className="text-xs text-gray-400 mt-1">Professional audit before mainnet deployment</p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Roadmap Tab */}
          <TabsContent value="roadmap">
            <Card className="bg-black/30 border-white/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-orange-500" />
                  Project Roadmap & Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative pl-8 before:absolute before:left-4 before:top-0 before:h-full before:border-l-2 before:border-gray-700">
                  <div className="mb-10 relative">
                    <div className="absolute -left-10 mt-1.5 h-6 w-6 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center">
                      <span className="text-green-500 text-xs">✓</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Phase 1: Core Platform Development</h3>
                      <p className="text-sm text-green-400 mb-2">Completed</p>
                      
                      <div className="bg-black/20 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <ul className="space-y-1 text-sm text-gray-300">
                            <li className="flex items-start gap-2">
                              <span className="text-green-400">✓</span>
                              <span>React + Vite project setup</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-400">✓</span>
                              <span>Tailwind CSS styling</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-400">✓</span>
                              <span>Admin dashboard</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-400">✓</span>
                              <span>Landing page</span>
                            </li>
                          </ul>
                          
                          <ul className="space-y-1 text-sm text-gray-300">
                            <li className="flex items-start gap-2">
                              <span className="text-green-400">✓</span>
                              <span>User registration & authentication</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-400">✓</span>
                              <span>Blockchain service integration</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-400">✓</span>
                              <span>Basic token deployment</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-400">✓</span>
                              <span>Responsive UI</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-10 relative">
                    <div className="absolute -left-10 mt-1.5 h-6 w-6 rounded-full bg-yellow-500/20 border border-yellow-500 flex items-center justify-center">
                      <span className="text-yellow-500 text-xs">⟳</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Phase 2: Smart Contract & Trading</h3>
                      <p className="text-sm text-yellow-400 mb-2">In Progress (75% Complete)</p>
                      
                      <div className="bg-black/20 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <ul className="space-y-1 text-sm text-gray-300">
                            <li className="flex items-start gap-2">
                              <span className="text-green-400">✓</span>
                              <span>Anchor program setup</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-400">✓</span>
                              <span>Basic SPL token contract</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-green-400">✓</span>
                              <span>Linear bonding curve</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-yellow-400">⟳</span>
                              <span>Advanced bonding curves</span>
                            </li>
                          </ul>
                          
                          <ul className="space-y-1 text-sm text-gray-300">
                            <li className="flex items-start gap-2">
                              <span className="text-green-400">✓</span>
                              <span>Fee collection mechanism</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-yellow-400">⟳</span>
                              <span>Treasury management</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-yellow-400">⟳</span>
                              <span>Smart contract integration test</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-400">→</span>
                              <span>Trading UI</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-10 relative">
                    <div className="absolute -left-10 mt-1.5 h-6 w-6 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center">
                      <span className="text-blue-500 text-xs">→</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Phase 3: Advanced Features & Deployment</h3>
                      <p className="text-sm text-blue-400 mb-2">Planned (Q3 2025)</p>
                      
                      <div className="bg-black/20 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <ul className="space-y-1 text-sm text-gray-300">
                            <li className="flex items-start gap-2">
                              <span className="text-blue-400">→</span>
                              <span>Token governance</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-400">→</span>
                              <span>Token staking</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-400">→</span>
                              <span>Advanced analytics</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-400">→</span>
                              <span>Security audits</span>
                            </li>
                          </ul>
                          
                          <ul className="space-y-1 text-sm text-gray-300">
                            <li className="flex items-start gap-2">
                              <span className="text-blue-400">→</span>
                              <span>Production deployment</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-400">→</span>
                              <span>Infrastructure scalability</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-400">→</span>
                              <span>Documentation enhancement</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-blue-400">→</span>
                              <span>Mainnet deployment</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-10 relative">
                    <div className="absolute -left-10 mt-1.5 h-6 w-6 rounded-full bg-purple-500/20 border border-purple-500 flex items-center justify-center">
                      <span className="text-purple-500 text-xs">+</span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Phase 4: Platform Growth & Expansion</h3>
                      <p className="text-sm text-purple-400 mb-2">Future (2026+)</p>
                      
                      <div className="bg-black/20 p-4 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <ul className="space-y-1 text-sm text-gray-300">
                            <li className="flex items-start gap-2">
                              <span className="text-purple-400">+</span>
                              <span>Multi-chain support</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-400">+</span>
                              <span>DEX integrations</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-400">+</span>
                              <span>Mobile app</span>
                            </li>
                          </ul>
                          
                          <ul className="space-y-1 text-sm text-gray-300">
                            <li className="flex items-start gap-2">
                              <span className="text-purple-400">+</span>
                              <span>Enterprise solutions</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-400">+</span>
                              <span>DAO governance</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <span className="text-purple-400">+</span>
                              <span>NFT integration</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <Card className="bg-black/20 border-green-500/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-green-400 flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        What's Complete
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <ul className="space-y-1 text-gray-300">
                        <li>✓ Frontend platform UI</li>
                        <li>✓ Admin dashboard</li>
                        <li>✓ Basic smart contracts</li>
                        <li>✓ Token creation flow</li>
                        <li>✓ Basic deployment pipeline</li>
                        <li>✓ Authentication system</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/20 border-yellow-500/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-yellow-400 flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Current Sprint
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <ul className="space-y-1 text-gray-300">
                        <li>⟳ Treasury contract</li>
                        <li>⟳ Advanced bonding curves</li>
                        <li>⟳ Fee distribution testing</li>
                        <li>⟳ Trading interface improvements</li>
                        <li>⟳ Analytics dashboard enhancement</li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-black/20 border-blue-500/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg text-blue-400 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Next Steps
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <ul className="space-y-1 text-gray-300">
                        <li>→ Complete testing suite</li>
                        <li>→ Security audit arrangements</li>
                        <li>→ Production deployment</li>
                        <li>→ Governance contract</li>
                        <li>→ Marketing site development</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <Alert className="bg-orange-500/10 border-orange-500/30">
                  <p className="text-orange-400">
                    <strong>Development Focus:</strong> Priority is to complete the treasury management system 
                    and bonding curve enhancements in the next 2 weeks before moving to production deployment.
                  </p>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default AboutProject;
