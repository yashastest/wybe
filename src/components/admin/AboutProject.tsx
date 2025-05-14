
import React from 'react';
import { motion } from "framer-motion";
import { 
  Info, 
  CheckCircle2, 
  BadgeCheck, 
  Landmark, 
  ArrowRight, 
  ExternalLink,
  FileText,
  CreditCard,
  Users,
  Wallet,
  BarChart3,
  Percent,
  GalleryVertical,
  Coins
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const AboutProject = () => {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-lg bg-orange-500/20 flex items-center justify-center">
            <Info className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold">About Wybe Platform</h2>
            <p className="text-gray-400">Token creation and trading platform for the Solana ecosystem</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <CheckCircle2 size={18} className="text-green-500" />
              Platform Overview
            </h3>
            <p className="text-gray-300 leading-relaxed">
              The Wybe Platform is a decentralized token creation and trading ecosystem built on Solana. 
              It enables users to create, launch, and trade custom tokens with minimal technical expertise. 
              The platform leverages Solana's high throughput and low fees to provide a seamless experience 
              for token creators and traders.
            </p>
            
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2">
                <BadgeCheck size={16} className="text-green-500" />
                <span>Fast token creation and deployment</span>
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck size={16} className="text-green-500" />
                <span>Built-in trading functionality</span>
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck size={16} className="text-green-500" />
                <span>Automated DEXScreener integration</span>
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck size={16} className="text-green-500" />
                <span>Treasury fee management</span>
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck size={16} className="text-green-500" />
                <span>Creator fee distribution</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Landmark size={18} className="text-blue-500" />
              Technical Architecture
            </h3>
            <p className="text-gray-300 leading-relaxed">
              The platform consists of multiple smart contracts that work together to enable token creation, 
              trading, and fee management. The core components include the token creation contract, treasury 
              contract, and trading interfaces. All contracts are built using Anchor, a framework for Solana 
              smart contract development.
            </p>
            
            <div className="p-3 rounded-md bg-black/30 border border-white/10 mt-3">
              <div className="text-sm font-medium mb-1">Tech Stack</div>
              <div className="text-sm text-gray-400">
                <span className="inline-block bg-black/20 px-2 py-1 rounded mr-2 mb-2">Solana</span>
                <span className="inline-block bg-black/20 px-2 py-1 rounded mr-2 mb-2">Rust</span>
                <span className="inline-block bg-black/20 px-2 py-1 rounded mr-2 mb-2">Anchor</span>
                <span className="inline-block bg-black/20 px-2 py-1 rounded mr-2 mb-2">React</span>
                <span className="inline-block bg-black/20 px-2 py-1 rounded mr-2 mb-2">TypeScript</span>
                <span className="inline-block bg-black/20 px-2 py-1 rounded mr-2">Web3.js</span>
              </div>
            </div>
            
            <div className="flex mt-4 gap-3">
              <Button 
                variant="outline" 
                className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                onClick={() => window.open('/admin/deployment', '_blank')}
              >
                <ArrowRight size={14} className="mr-1" />
                Deployment Guide
              </Button>
              <Button 
                variant="outline" 
                className="border-orange-500/30 text-orange-500 hover:bg-orange-500/10"
                onClick={() => window.open('https://github.com/wybe-finance/wybe-token-platform', '_blank')}
              >
                <ExternalLink size={14} className="mr-1" />
                GitHub Repository
              </Button>
            </div>
          </div>
        </div>
        
        <Separator className="my-8 bg-white/10" />
        
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">
            <GalleryVertical className="inline-block mr-2 text-orange-500" size={20} />
            Platform Workflow
          </h3>
          
          <div className="bg-black/20 rounded-lg p-6 border border-white/10">
            <div className="relative">
              {/* Vertical timeline */}
              <div className="absolute left-3.5 top-0 h-full w-0.5 bg-orange-500/30 z-0"></div>
              
              {/* Steps */}
              <div className="space-y-8">
                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center z-10">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-lg flex items-center">
                      <CreditCard size={18} className="mr-2 text-orange-500" />
                      Token Creation
                    </h4>
                    <p className="text-gray-300 mt-1">
                      Users create a new token by specifying parameters like name, symbol, 
                      initial supply, and token metadata. The platform guides users through 
                      the token creation process with an intuitive interface.
                    </p>
                  </div>
                </div>
                
                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center z-10">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-lg flex items-center">
                      <Users size={18} className="mr-2 text-orange-500" />
                      Launch Options
                    </h4>
                    <p className="text-gray-300 mt-1">
                      Creators choose between self-launch or assisted launch. For assisted launch, 
                      the token goes through a whitelist application process where platform administrators 
                      review and approve the token before it's available for trading.
                    </p>
                  </div>
                </div>
                
                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center z-10">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-lg flex items-center">
                      <Coins size={18} className="mr-2 text-orange-500" />
                      Trading
                    </h4>
                    <p className="text-gray-300 mt-1">
                      Once launched, the token becomes available for trading on the Wybe platform. 
                      Users can buy and sell tokens through the integrated trading interface. 
                      All transactions are executed on-chain with fast settlement times.
                    </p>
                  </div>
                </div>
                
                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center z-10">
                    <span className="text-white text-sm font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-lg flex items-center">
                      <Percent size={18} className="mr-2 text-orange-500" />
                      Fee Collection
                    </h4>
                    <p className="text-gray-300 mt-1">
                      For each trade, a 2.5% platform fee is collected and sent to the treasury. 
                      Additionally, 1% of all minted tokens are allocated to the platform treasury. 
                      These fees support ongoing development and maintenance of the platform.
                    </p>
                  </div>
                </div>
                
                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center z-10">
                    <span className="text-white text-sm font-bold">5</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-lg flex items-center">
                      <BarChart3 size={18} className="mr-2 text-orange-500" />
                      DEXScreener Listing
                    </h4>
                    <p className="text-gray-300 mt-1">
                      When a token reaches $50,000 in market capitalization, it becomes eligible 
                      for automatic listing on DEXScreener. This increases visibility and attracts 
                      more traders to the token.
                    </p>
                  </div>
                </div>
                
                <div className="relative pl-10">
                  <div className="absolute left-0 top-0 w-7 h-7 rounded-full bg-orange-500 flex items-center justify-center z-10">
                    <span className="text-white text-sm font-bold">6</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-lg flex items-center">
                      <Wallet size={18} className="mr-2 text-orange-500" />
                      Creator Fee Sharing
                    </h4>
                    <p className="text-gray-300 mt-1">
                      As tokens reach specific milestones, creators receive a share of the fees 
                      collected from trades. This incentivizes creators to build and maintain quality 
                      tokens and communities on the platform.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass-card border-orange-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="text-orange-500" size={18} />
              Documentation
            </CardTitle>
            <CardDescription>Access platform documentation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start border-white/10 hover:bg-white/5"
              onClick={() => window.open('/admin/deployment', '_blank')}
            >
              <FileText size={14} className="mr-2" />
              Deployment Guide
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-white/10 hover:bg-white/5"
              onClick={() => window.open('/security-report', '_blank')}
            >
              <FileText size={14} className="mr-2" />
              Security Report
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start border-white/10 hover:bg-white/5"
              onClick={() => window.open('https://docs.wybe.finance', '_blank')}
            >
              <ExternalLink size={14} className="mr-2" />
              API Documentation
            </Button>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-orange-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="text-orange-500" size={18} />
              Support
            </CardTitle>
            <CardDescription>Get help and support</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-md bg-black/20">
              <div className="text-sm font-medium">Technical Support</div>
              <div className="text-sm text-gray-400 mt-1">support@wybe.finance</div>
            </div>
            <div className="p-3 rounded-md bg-black/20">
              <div className="text-sm font-medium">Security Issues</div>
              <div className="text-sm text-gray-400 mt-1">security@wybe.finance</div>
            </div>
            <div className="p-3 rounded-md bg-black/20">
              <div className="text-sm font-medium">Business Inquiries</div>
              <div className="text-sm text-gray-400 mt-1">business@wybe.finance</div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass-card border-orange-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BadgeCheck className="text-orange-500" size={18} />
              Platform Status
            </CardTitle>
            <CardDescription>Current operational status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Smart Contracts</span>
                <span className="inline-flex items-center text-green-500">
                  <BadgeCheck size={14} className="mr-1" /> Operational
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Token Creation</span>
                <span className="inline-flex items-center text-green-500">
                  <BadgeCheck size={14} className="mr-1" /> Operational
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Trading Platform</span>
                <span className="inline-flex items-center text-green-500">
                  <BadgeCheck size={14} className="mr-1" /> Operational
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Treasury Functions</span>
                <span className="inline-flex items-center text-green-500">
                  <BadgeCheck size={14} className="mr-1" /> Operational
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">API Services</span>
                <span className="inline-flex items-center text-green-500">
                  <BadgeCheck size={14} className="mr-1" /> Operational
                </span>
              </div>
            </div>
            
            <Separator className="my-4 bg-white/10" />
            
            <div className="text-center text-sm">
              <span className="text-green-500 font-medium">All Systems Operational</span>
              <p className="text-gray-400 text-xs mt-1">Last updated: 2023-10-01 08:30 UTC</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutProject;
