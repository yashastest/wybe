import React from 'react';

interface TraderActivityProps {
  symbol?: string;
  tokenSymbol?: string; // Add this for backward compatibility
}

const TraderActivity: React.FC<TraderActivityProps> = ({ symbol, tokenSymbol }) => {
  const tokenIdentifier = symbol || tokenSymbol;
  
  // Use tokenIdentifier for your component logic

  return (
    <div>
      {/* Your component content here */}
      <p>Trader activity for {tokenIdentifier}</p>
    </div>
  );
};

export default TraderActivity;
