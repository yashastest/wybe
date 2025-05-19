
// import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';

// 1. Get projectId from https://cloud.walletconnect.com
// For Vite, environment variables must start with VITE_
export const WALLETCONNECT_PROJECT_ID = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "YOUR_WALLETCONNECT_PROJECT_ID";

// 2. Set chains
const mainnet = {
  chainId: 1,
  name: 'Ethereum',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://cloudflare-eth.com'
};

const sepolia = {
  chainId: 11155111,
  name: 'Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://sepolia.etherscan.io',
  rpcUrl: 'https://rpc.sepolia.org'
}

// 3. Create modal
const metadata = {
  name: 'Wybe DApp',
  description: 'Wybe Decentralized Application',
  url: typeof window !== 'undefined' ? window.location.origin : '', // Dynamically set the URL, handle SSR/build time
  icons: typeof window !== 'undefined' ? [`${window.location.origin}/favicon.ico`] : [] // Dynamically set the icon path
};

export const configureWeb3Modal = () => {
  if (!WALLETCONNECT_PROJECT_ID || WALLETCONNECT_PROJECT_ID === "YOUR_WALLETCONNECT_PROJECT_ID") {
    console.warn(
      "WalletConnect Project ID is not set. Please create a .env file in the project root and add VITE_WALLETCONNECT_PROJECT_ID='your_project_id'. Get your project ID from https://cloud.walletconnect.com"
    );
    // Potentially return or throw an error if you want to prevent initialization without a project ID.
    // For now, we'll let it proceed so the UI doesn't break entirely, but Web3Modal might not work.
  }
  
  // createWeb3Modal({
  //   ethersConfig: defaultConfig({ metadata }),
  //   chains: [mainnet, sepolia],
  //   projectId: WALLETCONNECT_PROJECT_ID,
  //   enableAnalytics: true, // Optional - defaults to your Cloud configuration
  //   themeMode: 'dark',
  //   defaultChain: mainnet,
  //   tokens: {
  //     [mainnet.chainId]: {
  //       address: '0x substituethiswithyourtokenaddress', // Optional: your app's token
  //       // image: 'https://...', // Optional: your app's token image
  //     }
  //   }
  // });
};
