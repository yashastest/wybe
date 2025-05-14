
import React, { useState } from 'react';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Book, CheckCircle2, FileCode, Info, Link2, ExternalLink, Copy, Terminal } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const DeploymentGuide = () => {
  const [activeStep, setActiveStep] = useState(1);
  const navigate = useNavigate();
  
  const totalSteps = 5;
  const progress = Math.min(100, (activeStep / totalSteps) * 100);
  
  const navigateToStep = (step: number) => {
    if (step >= 1 && step <= totalSteps) {
      setActiveStep(step);
    }
  };
  
  const handleNext = () => {
    if (activeStep < totalSteps) {
      setActiveStep(activeStep + 1);
    }
  };
  
  const handlePrevious = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };
  
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Would add toast here
  };
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Book className="text-orange-500" size={22} />
            Master Deployment Guide
          </h2>
          <p className="text-gray-400 text-sm">Step-by-step guide for deploying the Wybe platform</p>
        </div>
      </div>
      
      {/* Progress indicator */}
      <Card className="glass-card border-wybe-primary/20">
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">Deployment Progress</h3>
            <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
              Step {activeStep} of {totalSteps}
            </Badge>
          </div>
          
          <Progress value={progress} className="h-2 mb-4" />
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <button
                key={index}
                className={`rounded-lg p-3 transition-colors ${
                  activeStep === index + 1
                    ? 'bg-orange-500/20 border border-orange-500/30 text-orange-400'
                    : activeStep > index + 1
                    ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                    : 'bg-white/5 border border-white/10 text-gray-400'
                }`}
                onClick={() => navigateToStep(index + 1)}
              >
                <div className="flex items-center justify-center">
                  {activeStep > index + 1 ? (
                    <CheckCircle2 size={16} className="mr-2" />
                  ) : (
                    <span className="w-5 h-5 flex items-center justify-center rounded-full border border-current mr-2 text-xs">
                      {index + 1}
                    </span>
                  )}
                  <span className="text-sm">Step {index + 1}</span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Step Content */}
      {activeStep === 1 && (
        <Card className="glass-card border-wybe-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <h3 className="text-lg font-medium">Step 1: Environment Setup</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              Before deploying the Wybe token platform, you need to set up the required development environment.
              This includes installing the necessary tools and configuring your system.
            </p>
            
            <div className="bg-black/20 border border-white/10 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-medium mb-2">Prerequisites</h4>
              
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Solana CLI</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Required for interacting with the Solana blockchain
                  </p>
                  <div className="bg-black/40 p-2 rounded font-mono text-xs mt-2">
                    sh -c "$(curl -sSfL https://release.solana.com/v1.16.11/install)"
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Rust & Cargo</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Required for compiling Solana programs
                  </p>
                  <div className="bg-black/40 p-2 rounded font-mono text-xs mt-2">
                    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Anchor Framework</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    The development framework for Solana
                  </p>
                  <div className="bg-black/40 p-2 rounded font-mono text-xs mt-2">
                    cargo install --git https://github.com/coral-xyz/anchor avm --locked
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-2">
                <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">Node.js & npm</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Required for building the frontend application
                  </p>
                  <div className="bg-black/40 p-2 rounded font-mono text-xs mt-2">
                    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex gap-2">
              <Info size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-400 font-medium">Tip</p>
                <p className="text-gray-300 text-sm">
                  Make sure all tools are properly installed by running <code>solana --version</code>, <code>cargo --version</code>, 
                  and <code>anchor --version</code> to verify their installations.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {activeStep === 2 && (
        <Card className="glass-card border-wybe-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <h3 className="text-lg font-medium">Step 2: Project Setup</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              Set up the Wybe token project structure. This includes creating the Anchor project,
              configuring the necessary files, and setting up your development wallet.
            </p>
            
            <Tabs defaultValue="code" className="w-full">
              <TabsList className="w-full grid grid-cols-2">
                <TabsTrigger value="code">Code Setup</TabsTrigger>
                <TabsTrigger value="wallet">Wallet Setup</TabsTrigger>
              </TabsList>
              
              <TabsContent value="code" className="space-y-4 py-4">
                <div className="bg-black/20 border border-white/10 rounded-lg p-4 space-y-3">
                  <h4 className="text-sm font-medium mb-2">Project Initialization</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Terminal size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Create a new Anchor project</p>
                        <div className="bg-black/40 p-2 rounded font-mono text-xs mt-2">
                          anchor init wybe-token-project
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Terminal size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Navigate to the project directory</p>
                        <div className="bg-black/40 p-2 rounded font-mono text-xs mt-2">
                          cd wybe-token-project
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <FileCode size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Update Cargo.toml dependencies</p>
                        <div className="bg-black/40 p-2 rounded font-mono text-xs mt-2">
                          [dependencies]<br/>
                          anchor-lang = "0.29.0"
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <FileCode size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Project structure</p>
                        <div className="bg-black/40 p-2 rounded font-mono text-xs mt-2">
                          wybe-token-project/<br/>
                          ├── programs/             # Solana program code<br/>
                          │   └── wybe-token/<br/>
                          │       ├── src/<br/>
                          │       └── Cargo.toml<br/>
                          ├── app/                  # Frontend application<br/>
                          ├── tests/                # Test files<br/>
                          └── Anchor.toml           # Anchor configuration
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleNavigate('/admin/contracts')}
                >
                  View Smart Contract Dashboard
                </Button>
              </TabsContent>
              
              <TabsContent value="wallet" className="space-y-4 py-4">
                <div className="bg-black/20 border border-white/10 rounded-lg p-4 space-y-3">
                  <h4 className="text-sm font-medium mb-2">Wallet Configuration</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <Terminal size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Create a new development wallet</p>
                        <div className="bg-black/40 p-2 rounded font-mono text-xs mt-2">
                          solana-keygen new -o ~/.config/solana/id.json
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Terminal size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Configure Solana CLI to use testnet</p>
                        <div className="bg-black/40 p-2 rounded font-mono text-xs mt-2">
                          solana config set --url https://api.testnet.solana.com
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Terminal size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Get testnet tokens</p>
                        <div className="bg-black/40 p-2 rounded font-mono text-xs mt-2">
                          solana airdrop 2
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-2">
                      <Info size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-sm">Important wallet notes</p>
                        <ul className="list-disc list-inside text-xs text-gray-300 mt-1 space-y-1">
                          <li>Always back up your wallet's private key</li>
                          <li>Use dedicated wallets for development and production</li>
                          <li>Consider using hardware wallets for production deployments</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleNavigate('/admin/treasury')}
                >
                  Go to Treasury Management
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
      
      {activeStep === 3 && (
        <Card className="glass-card border-wybe-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <h3 className="text-lg font-medium">Step 3: Smart Contract Development</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              Develop and test the Wybe token smart contract. This includes implementing the token functionality,
              the bonding curve mechanics, and setting up the treasury.
            </p>
            
            <div className="bg-black/20 border border-white/10 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-medium mb-2">Token Contract Implementation</h4>
              
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <FileCode size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Key components to implement</p>
                    <ul className="list-disc list-inside text-xs text-gray-300 mt-1 space-y-1">
                      <li>Token initialization and minting</li>
                      <li>Bonding curve calculation logic</li>
                      <li>Buy and sell functions</li>
                      <li>Fee distribution mechanism</li>
                      <li>Treasury management</li>
                    </ul>
                  </div>
                </div>
                
                <div className="bg-black/40 p-3 rounded font-mono text-xs">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-blue-400">// Sample token initialization code</span>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 px-2 text-xs"
                      onClick={() => copyToClipboard(
                        'pub fn initialize(ctx: Context<Initialize>, name: String, symbol: String, creator_fee: u64, platform_fee: u64) -> Result<()> {'
                      )}
                    >
                      <Copy size={12} className="mr-1" />
                      Copy
                    </Button>
                  </div>
                  <pre className="text-gray-300 whitespace-pre-wrap">
{`pub fn initialize(ctx: Context<Initialize>, name: String, symbol: String, creator_fee: u64, platform_fee: u64) -> Result<()> {
    let token_account = &mut ctx.accounts.token_account;
    
    if creator_fee > 1000 || platform_fee > 1000 {
        return err!(ErrorCode::InvalidFees);
    }
    
    token_account.name = name;
    token_account.symbol = symbol;
    token_account.creator_fee = creator_fee;
    token_account.platform_fee = platform_fee;
    token_account.authority = ctx.accounts.authority.key();
    
    Ok(())
}`}
                  </pre>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 flex gap-2">
                  <Info size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-blue-400 font-medium text-sm">Best Practices</p>
                    <ul className="list-disc list-inside text-xs text-gray-300 mt-1 space-y-1">
                      <li>Implement comprehensive error handling</li>
                      <li>Add exhaustive input validation</li>
                      <li>Include detailed documentation</li>
                      <li>Use constants for magic numbers</li>
                      <li>Follow the principle of least privilege</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleNavigate('/admin/deployment')}
              >
                Go to Contract Deployment
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => handleNavigate('/admin/environment')}
              >
                View Deployment Environment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {activeStep === 4 && (
        <Card className="glass-card border-wybe-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <h3 className="text-lg font-medium">Step 4: Testing and Deployment</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              Test the smart contract thoroughly and deploy it to the testnet. This includes writing and running 
              test cases, auditing the code, and configuring the deployment.
            </p>
            
            <div className="bg-black/20 border border-white/10 rounded-lg p-4 space-y-4">
              <h4 className="text-sm font-medium mb-2">Testing Process</h4>
              
              <div className="space-y-3">
                <div className="flex items-start gap-2">
                  <Terminal size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Running unit tests</p>
                    <div className="bg-black/40 p-2 rounded font-mono text-xs mt-2">
                      anchor test
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-2">
                  <Terminal size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-sm">Deploying to testnet</p>
                    <div className="bg-black/40 p-2 rounded font-mono text-xs mt-2">
                      anchor deploy --provider.cluster testnet
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-white/10 pt-4">
                <h4 className="text-sm font-medium mb-3">Test Cases Checklist</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 p-2 bg-white/5 rounded">
                    <CheckCircle2 size={14} className="text-green-500" />
                    <p className="text-sm">Token initialization</p>
                  </div>
                  
                  <div className="flex items-center gap-2 p-2 bg-white/5 rounded">
                    <CheckCircle2 size={14} className="text-green-500" />
                    <p className="text-sm">Buy token functionality</p>
                  </div>
                  
                  <div className="flex items-center gap-2 p-2 bg-white/5 rounded">
                    <CheckCircle2 size={14} className="text-green-500" />
                    <p className="text-sm">Sell token functionality</p>
                  </div>
                  
                  <div className="flex items-center gap-2 p-2 bg-white/5 rounded">
                    <CheckCircle2 size={14} className="text-green-500" />
                    <p className="text-sm">Fee distribution</p>
                  </div>
                  
                  <div className="flex items-center gap-2 p-2 bg-white/5 rounded">
                    <CheckCircle2 size={14} className="text-green-500" />
                    <p className="text-sm">Bonding curve calculations</p>
                  </div>
                  
                  <div className="flex items-center gap-2 p-2 bg-white/5 rounded">
                    <CheckCircle2 size={14} className="text-green-500" />
                    <p className="text-sm">Treasury management</p>
                  </div>
                  
                  <div className="flex items-center gap-2 p-2 bg-white/5 rounded">
                    <CheckCircle2 size={14} className="text-green-500" />
                    <p className="text-sm">Error handling</p>
                  </div>
                  
                  <div className="flex items-center gap-2 p-2 bg-white/5 rounded">
                    <CheckCircle2 size={14} className="text-green-500" />
                    <p className="text-sm">Access control</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <h4 className="text-blue-400 font-medium mb-2 flex items-center gap-2">
                <Link2 size={16} />
                Important Resources
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <a 
                  href="https://docs.solana.com"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-black/30 rounded hover:bg-black/40 transition-colors"
                >
                  <ExternalLink size={14} className="text-blue-400" />
                  <span className="text-sm">Solana Documentation</span>
                </a>
                
                <a 
                  href="https://www.anchor-lang.com"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-black/30 rounded hover:bg-black/40 transition-colors"
                >
                  <ExternalLink size={14} className="text-blue-400" />
                  <span className="text-sm">Anchor Framework</span>
                </a>
                
                <a 
                  href="https://solscan.io"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-black/30 rounded hover:bg-black/40 transition-colors"
                >
                  <ExternalLink size={14} className="text-blue-400" />
                  <span className="text-sm">Solscan Explorer</span>
                </a>
                
                <a 
                  href="https://github.com/solana-labs/solana-program-library"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 bg-black/30 rounded hover:bg-black/40 transition-colors"
                >
                  <ExternalLink size={14} className="text-blue-400" />
                  <span className="text-sm">Solana Program Library</span>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {activeStep === 5 && (
        <Card className="glass-card border-wybe-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <h3 className="text-lg font-medium">Step 5: Mainnet Deployment</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              After successful testing on the testnet, deploy the Wybe token platform to the Solana mainnet
              for production use. This is the final step in the deployment process.
            </p>
            
            <div className="bg-black/20 border border-white/10 rounded-lg p-4 space-y-4">
              <h4 className="text-sm font-medium mb-2">Mainnet Deployment Checklist</h4>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                  <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="font-medium">Security audit completed</p>
                    <p className="text-xs text-gray-400">Ensure the contract has been thoroughly audited by security professionals</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                  <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="font-medium">Testnet deployment validated</p>
                    <p className="text-xs text-gray-400">Confirm that all functionality works as expected on testnet</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                  <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="font-medium">Frontend integration confirmed</p>
                    <p className="text-xs text-gray-400">Verify that the web application interacts correctly with the smart contract</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                  <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="font-medium">Hardware wallet configured</p>
                    <p className="text-xs text-gray-400">Use a hardware wallet for mainnet deployments for enhanced security</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg">
                  <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                  <div className="flex-grow">
                    <p className="font-medium">SOL balance confirmed</p>
                    <p className="text-xs text-gray-400">Ensure deployer account has sufficient SOL for deployment fees</p>
                  </div>
                </div>
              </div>
              
              <div className="p-3 bg-white/5 rounded-lg">
                <h4 className="text-sm font-medium mb-2">Mainnet Deployment Command</h4>
                <div className="flex">
                  <div className="bg-black/40 p-2 rounded font-mono text-xs flex-grow">
                    anchor deploy --provider.cluster mainnet-beta --program-keypair ./target/deploy/wybe_token-keypair.json
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="ml-2 h-8 px-2 text-xs"
                    onClick={() => copyToClipboard(
                      'anchor deploy --provider.cluster mainnet-beta --program-keypair ./target/deploy/wybe_token-keypair.json'
                    )}
                  >
                    <Copy size={12} className="mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 flex gap-2">
              <Info size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-amber-400 font-medium">Important</p>
                <p className="text-gray-300 text-sm">
                  Mainnet deployments are irreversible and involve real funds. Double-check all configurations
                  and ensure you have backups of all keypairs and deployment files. Consider using a multi-signature
                  approach for critical treasury management functions.
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                className="flex-1 bg-orange-500 hover:bg-orange-600"
                onClick={() => handleNavigate('/admin/environment')}
              >
                <ArrowRight size={14} className="mr-1" />
                Go to Deployment Environment
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={activeStep === 1}
        >
          Previous Step
        </Button>
        
        <Button
          className="bg-orange-500 hover:bg-orange-600"
          onClick={handleNext}
          disabled={activeStep === totalSteps}
        >
          Next Step
        </Button>
      </div>
    </motion.div>
  );
};

export default DeploymentGuide;
