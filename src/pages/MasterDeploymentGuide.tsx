import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  FileText,
  Download,
  GitBranch,
  Server,
  Database,
  Code,
  ChevronRight,
  ArrowRight,
  ArrowUpRight,
  FileCheck,
  Copy,
  CheckCircle,
  Tag,
  Network,
  Landmark,
  AlertTriangle,
  CheckCheck,
  UploadCloud,
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface MasterDeploymentGuideProps {
  isAdminPanel?: boolean;
}

const MasterDeploymentGuide: React.FC<MasterDeploymentGuideProps> = ({ isAdminPanel = false }) => {
  const navigate = useNavigate();
  
  // Define the Guide sections
  const stages = [
    {
      id: "preparation",
      title: "Preparation & Environment Setup",
      icon: <Server className="h-5 w-5 text-orange-500" />,
      description: "Setting up your development and deployment environment"
    },
    {
      id: "testnet",
      title: "Testnet Smart Contract Deployment",
      icon: <Network className="h-5 w-5 text-blue-500" />,
      description: "Testing your contracts on testnet before mainnet launch"
    },
    {
      id: "mainnet",
      title: "Mainnet Smart Contract Deployment",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      description: "Deploying verified contracts to the mainnet"
    },
    {
      id: "integration",
      title: "Backend & Frontend Integration",
      icon: <Code className="h-5 w-5 text-purple-500" />,
      description: "Connecting your frontend and backend with smart contracts"
    },
    {
      id: "database",
      title: "Database Synchronization",
      icon: <Database className="h-5 w-5 text-blue-400" />,
      description: "Setting up data flows between blockchain and database"
    },
    {
      id: "verification",
      title: "Testing & Verification",
      icon: <FileCheck className="h-5 w-5 text-yellow-500" />,
      description: "Final verification of all system components"
    },
    {
      id: "deployment",
      title: "Production Deployment",
      icon: <UploadCloud className="h-5 w-5 text-green-400" />,
      description: "Final production deployment and monitoring setup"
    },
  ];
  
  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command);
    toast.success("Command copied to clipboard!");
  };
  
  return (
    <>
      {!isAdminPanel && (
        <>
          <Header />
          <div className="py-20 bg-black">
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="text-center mb-12">
                <motion.h1 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ duration: 0.5 }}
                  className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-orange-500 to-orange-300 bg-clip-text text-transparent mb-6"
                >
                  Master Deployment Guide
                </motion.h1>
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-gray-300 text-lg max-w-3xl mx-auto"
                >
                  Complete step-by-step guide for deploying your blockchain application from development to production
                </motion.p>
              </div>
            </div>
          </div>
        </>
      )}

      {isAdminPanel ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold font-poppins flex items-center">
                <FileText className="mr-2 text-orange-500" size={22} />
                Master Deployment Guide
              </h2>
              <p className="text-gray-400 mt-1">Complete step-by-step guide for deploying your application</p>
            </div>
          </div>
          
          <GuideContent stages={stages} copyCommand={copyCommand} />
        </motion.div>
      ) : (
        <div className="container mx-auto px-4 max-w-7xl pb-20">
          <GuideContent stages={stages} copyCommand={copyCommand} />
        </div>
      )}

      {!isAdminPanel && <Footer />}
    </>
  );
};

// Separate component for guide content to avoid duplication
const GuideContent = ({ stages, copyCommand }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <Card className="glass-card border-orange-500/20 lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <FileText className="mr-2 text-orange-500" />
            Deployment Stages
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="px-4 py-2">
              <ul className="space-y-1">
                {stages.map((stage) => (
                  <li key={stage.id}>
                    <a
                      href={`#${stage.id}`}
                      className="flex items-center gap-3 px-2 py-3 rounded-md hover:bg-white/5 transition-colors"
                    >
                      {stage.icon}
                      <div>
                        <div className="font-medium text-sm">{stage.title}</div>
                        <div className="text-xs text-gray-400">{stage.description}</div>
                      </div>
                    </a>
                    <Separator className="bg-white/5" />
                  </li>
                ))}
              </ul>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <div className="lg:col-span-3 space-y-8">
        <div id="preparation" className="scroll-mt-24">
          <Card className="glass-card border-orange-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <Server className="mr-2 text-orange-500" />
                  1. Preparation & Environment Setup
                </CardTitle>
                <Badge variant="outline" className="border-orange-500 text-orange-400">Stage 1</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">1.1 System Requirements</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                  <li>Node.js v16+ and npm v8+</li>
                  <li>Git 2.20+</li>
                  <li>Rust and Cargo for Solana development</li>
                  <li>Docker and Docker Compose for containerization</li>
                  <li>Solana CLI tools for blockchain interaction</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">1.2 Repository Setup</h3>
                <div className="bg-gray-900 rounded-md p-3 font-mono text-sm">
                  <div className="flex items-center justify-between">
                    <code>git clone https://github.com/your-org/wybe-token-platform.git</code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => copyCommand("git clone https://github.com/your-org/wybe-token-platform.git")}
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <code>cd wybe-token-platform</code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => copyCommand("cd wybe-token-platform")}
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <code>npm install</code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => copyCommand("npm install")}
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">1.3 Environment Configuration</h3>
                <p className="text-gray-300 mb-2">Create a <code>.env</code> file in the root directory:</p>
                <div className="bg-gray-900 rounded-md p-3 font-mono text-sm">
                  <code>
                    VITE_API_URL=https://api.wybe.io<br />
                    VITE_SOLANA_NETWORK=devnet<br />
                    VITE_TREASURY_WALLET=your-treasury-wallet-address<br />
                    VITE_DEFAULT_FEE_PERCENTAGE=2.5
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">1.4 Anchor Installation</h3>
                <div className="bg-gray-900 rounded-md p-3 font-mono text-sm">
                  <div className="flex items-center justify-between">
                    <code>npm install -g @coral-xyz/anchor</code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => copyCommand("npm install -g @coral-xyz/anchor")}
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <code>anchor --version</code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => copyCommand("anchor --version")}
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="ml-auto flex" onClick={() => document.getElementById('testnet')?.scrollIntoView({ behavior: 'smooth' })}>
                Next Stage: Testnet Deployment
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div id="testnet" className="scroll-mt-24">
          <Card className="glass-card border-blue-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <Network className="mr-2 text-blue-500" />
                  2. Testnet Smart Contract Deployment
                </CardTitle>
                <Badge variant="outline" className="border-blue-500 text-blue-400">Stage 2</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">2.1 Configure Solana for Testnet</h3>
                <div className="bg-gray-900 rounded-md p-3 font-mono text-sm">
                  <div className="flex items-center justify-between">
                    <code>solana config set --url https://api.devnet.solana.com</code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => copyCommand("solana config set --url https://api.devnet.solana.com")}
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">2.2 Generate New Keypair</h3>
                <div className="bg-gray-900 rounded-md p-3 font-mono text-sm">
                  <div className="flex items-center justify-between">
                    <code>solana-keygen new --outfile ./keypair.json</code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => copyCommand("solana-keygen new --outfile ./keypair.json")}
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                </div>
                <p className="text-gray-300 mt-2 text-sm">
                  <span className="text-yellow-400 mr-1"><AlertTriangle className="inline h-4 w-4 mr-1" /></span>
                  Keep your keypair secure and never commit it to version control
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">2.3 Fund Testnet Wallet</h3>
                <div className="bg-gray-900 rounded-md p-3 font-mono text-sm">
                  <div className="flex items-center justify-between">
                    <code>solana airdrop 2 $(solana address)</code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => copyCommand("solana airdrop 2 $(solana address)")}
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">2.4 Build and Deploy Anchor Program</h3>
                <div className="bg-gray-900 rounded-md p-3 font-mono text-sm">
                  <div className="flex items-center justify-between">
                    <code>cd anchor-program</code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => copyCommand("cd anchor-program")}
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <code>anchor build</code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => copyCommand("anchor build")}
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <code>anchor deploy</code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => copyCommand("anchor deploy")}
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">2.5 Update Program ID in Configs</h3>
                <p className="text-gray-300 mb-2">Update the <code>Anchor.toml</code> and <code>lib.rs</code> files with the new Program ID</p>
                <div className="bg-gray-900 rounded-md p-3 font-mono text-sm">
                  <code>
                    # Get your program ID<br />
                    solana address -k target/deploy/wybe_token_program-keypair.json
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">2.6 Run Tests on Testnet</h3>
                <div className="bg-gray-900 rounded-md p-3 font-mono text-sm">
                  <div className="flex items-center justify-between">
                    <code>anchor test --provider.cluster devnet</code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => copyCommand("anchor test --provider.cluster devnet")}
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="ml-auto flex" onClick={() => document.getElementById('mainnet')?.scrollIntoView({ behavior: 'smooth' })}>
                Next Stage: Mainnet Deployment
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div id="mainnet" className="scroll-mt-24">
          <Card className="glass-card border-green-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <CheckCircle className="mr-2 text-green-500" />
                  3. Mainnet Smart Contract Deployment
                </CardTitle>
                <Badge variant="outline" className="border-green-500 text-green-400">Stage 3</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-yellow-900/30 border border-yellow-700/50 rounded-md p-4">
                <h3 className="text-lg font-semibold mb-2 text-yellow-400 flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Mainnet Deployment Warning
                </h3>
                <p className="text-gray-300">
                  Mainnet deployment involves real funds and irreversible transactions. Ensure you have:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-300 mt-2">
                  <li>Completed thorough testing on testnet</li>
                  <li>Performed security audits on the code</li>
                  <li>Secured adequate SOL for deployment fees</li>
                  <li>Made a backup of all keypairs</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">3.1 Configure for Mainnet</h3>
                <div className="bg-gray-900 rounded-md p-3 font-mono text-sm">
                  <div className="flex items-center justify-between">
                    <code>solana config set --url https://api.mainnet-beta.solana.com</code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => copyCommand("solana config set --url https://api.mainnet-beta.solana.com")}
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">3.2 Prepare Mainnet Wallet</h3>
                <p className="text-gray-300 mb-2">
                  For mainnet deployment, use a dedicated wallet with sufficient SOL balance. Never use test wallets.
                </p>
                <div className="bg-gray-900 rounded-md p-3 font-mono text-sm">
                  <div className="flex items-center justify-between">
                    <code>solana address</code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => copyCommand("solana address")}
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <code>solana balance</code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => copyCommand("solana balance")}
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">3.3 Update Configuration for Mainnet</h3>
                <p className="text-gray-300 mb-2">
                  Update <code>Anchor.toml</code> with mainnet configuration:
                </p>
                <div className="bg-gray-900 rounded-md p-3 font-mono text-sm">
                  <code>
                    [provider]<br />
                    cluster = "mainnet"<br />
                    wallet = "/path/to/mainnet-wallet.json"
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">3.4 Deploy to Mainnet</h3>
                <div className="bg-gray-900 rounded-md p-3 font-mono text-sm">
                  <div className="flex items-center justify-between">
                    <code>anchor build</code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => copyCommand("anchor build")}
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <code>anchor deploy</code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => copyCommand("anchor deploy")}
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">3.5 Verify Deployment</h3>
                <p className="text-gray-300 mb-2">
                  Verify the program ID on the Solana Explorer:
                </p>
                <div className="bg-gray-900 rounded-md p-3 font-mono text-sm flex items-center justify-between">
                  <code>https://explorer.solana.com/address/YOUR_PROGRAM_ID</code>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 w-6 p-0"
                    onClick={() => copyCommand("https://explorer.solana.com/address/YOUR_PROGRAM_ID")}
                  >
                    <Copy size={14} />
                  </Button>
                </div>
              </div>

              <Button variant="outline" className="ml-auto flex" onClick={() => document.getElementById('integration')?.scrollIntoView({ behavior: 'smooth' })}>
                Next Stage: Backend & Frontend Integration
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div id="integration" className="scroll-mt-24">
          <Card className="glass-card border-purple-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <Code className="mr-2 text-purple-500" />
                  4. Backend & Frontend Integration
                </CardTitle>
                <Badge variant="outline" className="border-purple-500 text-purple-400">Stage 4</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">4.1 Update Environment Variables</h3>
                <p className="text-gray-300 mb-2">
                  Update the <code>.env</code> file with the mainnet program ID and configuration:
                </p>
                <div className="bg-gray-900 rounded-md p-3 font-mono text-sm">
                  <code>
                    VITE_API_URL=https://api.wybe.io<br />
                    VITE_SOLANA_NETWORK=mainnet-beta<br />
                    VITE_PROGRAM_ID=your-mainnet-program-id<br />
                    VITE_TREASURY_WALLET=your-treasury-wallet-address<br />
                    VITE_DEFAULT_FEE_PERCENTAGE=2.5
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">4.2 Configure Frontend Client</h3>
                <p className="text-gray-300 mb-2">
                  Update the web3 configuration in your frontend:
                </p>
                <div className="bg-gray-900 rounded-md p-3 font-mono text-sm">
                  <code>
                    {`// src/services/smartContractService.ts
const programID = import.meta.env.VITE_PROGRAM_ID;
const network = import.meta.env.VITE_SOLANA_NETWORK;

export const initializeConnection = () => {
  return new Connection(
    network === 'mainnet-beta' 
      ? 'https://api.mainnet-beta.solana.com' 
      : 'https://api.devnet.solana.com'
  );
};`}
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">4.3 Configure Backend Services</h3>
                <p className="text-gray-300 mb-2">
                  Update backend API services to interact with mainnet:
                </p>
                <div className="bg-gray-900 rounded-md p-3 font-mono text-sm">
                  <code>
                    {`// backend/services/blockchainService.js
const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
const PROGRAM_ID = process.env.PROGRAM_ID;

const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

async function getTokenMetadata(tokenAddress) {
  // Implementation to fetch token metadata
}`}
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">4.4 Implement Transaction Webhooks</h3>
                <p className="text-gray-300 mb-2">
                  Set up webhooks to listen for blockchain events:
                </p>
                <div className="bg-gray-900 rounded-md p-3 font-mono text-sm">
                  <code>
                    {`// backend/webhooks/transactionWebhook.js
async function setupTransactionWebhook() {
  // Subscribe to program events
  connection.onProgramAccountChange(
    new PublicKey(PROGRAM_ID),
    async (accountInfo, context) => {
      // Process transaction data
      await processTransaction(accountInfo, context);
    },
    'confirmed'
  );
}`}
                  </code>
                </div>
              </div>

              <Button variant="outline" className="ml-auto flex" onClick={() => document.getElementById('database')?.scrollIntoView({ behavior: 'smooth' })}>
                Next Stage: Database Synchronization
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div id="database" className="scroll-mt-24">
          <Card className="glass-card border-blue-400/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <Database className="mr-2 text-blue-400" />
                  5. Database Synchronization
                </CardTitle>
                <Badge variant="outline" className="border-blue-400 text-blue-400">Stage 5</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">5.1 Database Schema Setup</h3>
                <p className="text-gray-300 mb-2">
                  Create the necessary database tables for blockchain data:
                </p>
                <div className="bg-gray-900 rounded-md p-3 font-mono text-sm">
                  <code>
                    {`CREATE TABLE tokens (
  id SERIAL PRIMARY KEY,
  address VARCHAR(44) NOT NULL,
  name VARCHAR(100) NOT NULL,
  symbol VARCHAR(10) NOT NULL,
  decimals INTEGER NOT NULL,
  total_supply NUMERIC NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
  id SERIAL PRIMARY KEY,
  tx_hash VARCHAR(64) UNIQUE NOT NULL,
  token_id INTEGER REFERENCES tokens(id),
  sender VARCHAR(44) NOT NULL,
  recipient VARCHAR(44) NOT NULL,
  amount NUMERIC NOT NULL,
  fee NUMERIC NOT NULL,
  timestamp TIMESTAMP NOT NULL,
  status VARCHAR(20) NOT NULL
);`}
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">5.2 Implement Data Synchronization Service</h3>
                <p className="text-gray-300 mb-2">
                  Create a service to sync blockchain data with your database:
                </p>
                <div className="bg-gray-900 rounded-md p-3 font-mono text-sm">
                  <code>
                    {`// backend/services/syncService.js
async function syncBlockchainData() {
  // Get latest blockchain transactions
  const recentTransactions = await fetchRecentTransactions();
  
  // Process and store in database
  for (const tx of recentTransactions) {
    await db.query(
      'INSERT INTO transactions (tx_hash, token_id, sender, recipient, amount, fee, timestamp, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) ON CONFLICT (tx_hash) DO NOTHING',
      [tx.signature, tx.tokenId, tx.sender, tx.recipient, tx.amount, tx.fee, tx.timestamp, tx.status]
    );
  }
}`}
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">5.3 Configure Scheduled Jobs</h3>
                <p className="text-gray-300 mb-2">
                  Set up cron jobs to regularly sync blockchain data:
                </p>
                <div className="bg-gray-900 rounded-md p-3 font-mono text-sm">
                  <code>
                    {`// backend/cron.js
const cron = require('node-cron');
const syncService = require('./services/syncService');

// Run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('Running blockchain sync job...');
  await syncService.syncBlockchainData();
});`}
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">5.4 Implement API Endpoints</h3>
                <p className="text-gray-300 mb-2">
                  Create API endpoints to serve the synced blockchain data:
                </p>
                <div className="bg-gray-900 rounded-md p-3 font-mono text-sm">
                  <code>
                    {`// backend/routes/transactions.js
router.get('/api/transactions', async (req, res) => {
  try {
    const { page = 1, limit = 20, token } = req.query;
    const offset = (page - 1) * limit;
    
    let query = 'SELECT * FROM transactions';
    const params = [];
    
    if (token) {
      query += ' WHERE token_id = $1';
      params.push(token);
    }
    
    query += ' ORDER BY timestamp DESC LIMIT $' + (params.length + 1) + ' OFFSET $' + (params.length + 2);
    params.push(limit, offset);
    
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});`}
                  </code>
                </div>
              </div>

              <Button variant="outline" className="ml-auto flex" onClick={() => document.getElementById('verification')?.scrollIntoView({ behavior: 'smooth' })}>
                Next Stage: Testing & Verification
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div id="verification" className="scroll-mt-24">
          <Card className="glass-card border-yellow-500/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <FileCheck className="mr-2 text-yellow-500" />
                  6. Testing & Verification
                </CardTitle>
                <Badge variant="outline" className="border-yellow-500 text-yellow-400">Stage 6</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">6.1 Frontend Integration Testing</h3>
                <p className="text-gray-300 mb-2">
                  Verify all frontend components interact correctly with the blockchain:
                </p>
                <div className="bg-gray-900 rounded-md p-3 space-y-2">
                  <div className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Wallet connection and disconnection</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Token creation flow</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Trading interface</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Transaction signing</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Fee calculation and display</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">6.2 Backend Integration Testing</h3>
                <p className="text-gray-300 mb-2">
                  Verify all backend services function correctly:
                </p>
                <div className="bg-gray-900 rounded-md p-3 space-y-2">
                  <div className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Blockchain event listeners</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Database synchronization</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>API endpoints</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Authentication and authorization</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">6.3 End-to-End Transaction Testing</h3>
                <p className="text-gray-300 mb-2">
                  Test complete transaction flows from end to end:
                </p>
                <ol className="list-decimal pl-5 space-y-2 text-gray-300">
                  <li>Create a test token on mainnet</li>
                  <li>Execute trades between test wallets</li>
                  <li>Verify transaction appears in blockchain explorer</li>
                  <li>Verify transaction synced to database</li>
                  <li>Verify transaction appears in frontend UI</li>
                  <li>Verify fees are correctly calculated and distributed</li>
                </ol>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">6.4 Performance Testing</h3>
                <p className="text-gray-300 mb-2">
                  Test system performance under load:
                </p>
                <div className="bg-gray-900 rounded-md p-3 space-y-2">
                  <div className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>API response times under load</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Database query performance</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Frontend rendering performance</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Blockchain transaction throughput</span>
                  </div>
                </div>
              </div>

              <Button variant="outline" className="ml-auto flex" onClick={() => document.getElementById('deployment')?.scrollIntoView({ behavior: 'smooth' })}>
                Final Stage: Production Deployment
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div id="deployment" className="scroll-mt-24">
          <Card className="glass-card border-green-400/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center">
                  <UploadCloud className="mr-2 text-green-400" />
                  7. Production Deployment
                </CardTitle>
                <Badge variant="outline" className="border-green-400 text-green-400">Final Stage</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">7.1 Frontend Deployment</h3>
                <p className="text-gray-300 mb-2">
                  Deploy the frontend application to Vercel or other hosting provider:
                </p>
                <div className="bg-gray-900 rounded-md p-3 font-mono text-sm">
                  <div className="flex items-center justify-between">
                    <code>npm run build</code>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-6 w-6 p-0"
                      onClick={() => copyCommand("npm run build")}
                    >
                      <Copy size={14} />
                    </Button>
                  </div>
                  <div className="mt-2">
                    <code>npx vercel --prod</code>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">7.2 Backend Deployment</h3>
                <p className="text-gray-300 mb-2">
                  Deploy the backend services to your cloud provider:
                </p>
                <div className="bg-gray-900 rounded-md p-3 font-mono text-sm">
                  <code>
                    {`# Example Docker deployment
docker build -t wybe-backend .
docker tag wybe-backend:latest registry.example.com/wybe-backend:latest
docker push registry.example.com/wybe-backend:latest

# Deploy to Kubernetes
kubectl apply -f k8s/deployment.yaml`}
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">7.3 Database Migration</h3>
                <p className="text-gray-300 mb-2">
                  Apply database migrations to production:
                </p>
                <div className="bg-gray-900 rounded-md p-3 font-mono text-sm">
                  <code>
                    {`# Using a migration tool like Flyway or Liquibase
npx sequelize-cli db:migrate --env production

# Or manually apply SQL scripts
psql -h production-db-host -U db-user -d wybe-db -f migrations/001_initial_schema.sql`}
                  </code>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">7.4 Final Verification Checklist</h3>
                <div className="bg-gray-900 rounded-md p-3 space-y-2">
                  <div className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>All environment variables correctly set in production</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>SSL certificates properly configured</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Database backups enabled</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Monitoring and alerting set up</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>Load balancing and scaling configured</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCheck className="h-5 w-5 text-green-500 mr-2" />
                    <span>CORS and security headers configured</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">7.5 Launch!</h3>
                <div className="bg-green-900/30 border border-green-700/50 rounded-md p-4">
                  <p className="text-gray-300">
                    Once all checks pass, your application is ready for public launch. Monitor performance and transactions closely during the initial launch period.
                  </p>
                  <div className="mt-4">
                    <Button variant="green" className="w-full sm:w-auto">
                      <CheckCheck className="mr-2 h-5 w-5" />
                      Complete Master Deployment
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MasterDeploymentGuide;
