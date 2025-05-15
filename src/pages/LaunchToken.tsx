
import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import LaunchTokenForm from '@/components/LaunchTokenForm';

const LaunchToken = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-black via-indigo-950/40 to-black bg-fixed">
      <Header />
      
      <main className="flex-grow w-full px-4 pt-20 md:pt-24">
        <div className="max-w-7xl mx-auto py-8 md:py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 md:mb-16"
          >
            <h1 className="text-3xl md:text-5xl font-bold font-poppins mb-4">
              <span className="bg-gradient-to-r from-purple-500 via-indigo-400 to-blue-500 bg-clip-text text-transparent">
                Launch Your Token
              </span>
            </h1>
            <p className="text-indigo-200 max-w-2xl mx-auto text-lg">
              Create your own tradeable token in seconds with our bonding curve mechanism. 
              No coding required.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
            <div className="lg:col-span-3 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6"
              >
                <div className="bg-indigo-900/30 p-5 rounded-xl border border-indigo-500/30">
                  <h3 className="text-xl font-bold text-white mb-3">📈 Bonding Curve Mechanism</h3>
                  <p className="text-indigo-200 text-sm">
                    Our bonding curve automatically determines token prices based on supply, ensuring
                    consistent liquidity and predictable price movements.
                  </p>
                </div>
                
                <div className="bg-indigo-900/30 p-5 rounded-xl border border-indigo-500/30">
                  <h3 className="text-xl font-bold text-white mb-3">💰 Earn Creator Fees</h3>
                  <p className="text-indigo-200 text-sm">
                    Receive 1% of all trading volume directly to your wallet every time someone trades your token.
                    Fees are automatically distributed to creators.
                  </p>
                </div>
                
                <div className="bg-indigo-900/30 p-5 rounded-xl border border-indigo-500/30">
                  <h3 className="text-xl font-bold text-white mb-3">🔐 Secure & Transparent</h3>
                  <p className="text-indigo-200 text-sm">
                    All tokens are created on the Solana blockchain with full transparency. 
                    Smart contracts are audited and open-source.
                  </p>
                </div>
              </motion.div>
            </div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-4"
            >
              <LaunchTokenForm />
            </motion.div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default LaunchToken;
