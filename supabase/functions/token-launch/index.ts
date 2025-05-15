
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Create a Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

// Connect to blockchain (mock implementation for now)
// In production, you would use a library like @solana/web3.js
const connectToBlockchain = () => {
  console.log("Connecting to blockchain...");
  // Implementation depends on your blockchain of choice
  return {
    deployToken: async (params: any) => {
      // Mock implementation
      console.log("Deploying token on blockchain:", params);
      return {
        tokenId: "TOKEN" + Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
        contractAddress: "ADDR" + Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
        success: true
      };
    },
    purchaseInitialSupply: async (params: any) => {
      // Mock implementation
      console.log("Purchasing initial supply:", params);
      return {
        txHash: "TX" + Date.now().toString(36) + Math.random().toString(36).substring(2, 7),
        success: true
      };
    }
  };
};

serve(async (req) => {
  // Handle CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Max-Age': '86400',
  };

  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    // Only allow POST requests
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }

    // Get path to determine operation
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    
    // Parse request body
    const requestData = await req.json();

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    // Connect to blockchain
    const blockchain = connectToBlockchain();

    // Handle different operations
    if (path === 'launch') {
      // Launch a new token
      return await handleLaunchToken(requestData, supabase, blockchain, corsHeaders);
    } else if (path === 'buy-initial') {
      // Purchase initial supply
      return await handleBuyInitialSupply(requestData, supabase, blockchain, corsHeaders);
    } else if (path === 'list') {
      // Get listed tokens
      return await handleGetListedTokens(supabase, corsHeaders);
    } else {
      // Unknown operation
      return new Response(JSON.stringify({ error: "Unknown operation" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});

async function handleLaunchToken(data: any, supabase: any, blockchain: any, corsHeaders: any) {
  // Validate required fields
  if (!data.name || !data.symbol || !data.initialSupply || !data.creatorWallet) {
    return new Response(JSON.stringify({ 
      success: false,
      message: "Missing required fields",
      error: "Name, symbol, initial supply, and creator wallet are required" 
    }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
  
  try {
    // Deploy token on blockchain
    const deployResult = await blockchain.deployToken({
      name: data.name,
      symbol: data.symbol,
      initialSupply: data.initialSupply,
      totalSupply: data.totalSupply || data.initialSupply,
      creatorWallet: data.creatorWallet
    });
    
    if (!deployResult.success) {
      return new Response(JSON.stringify({
        success: false,
        message: "Failed to deploy token",
        error: "Blockchain deployment failed"
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }
    
    // Store token in database
    const { data: tokenData, error } = await supabase
      .from('tokens')
      .insert({
        id: deployResult.tokenId,
        name: data.name,
        symbol: data.symbol,
        token_address: deployResult.contractAddress,
        creator_wallet: data.creatorWallet,
        market_cap: 0,
        bonding_curve: {
          price: 0.01,
          change_24h: 0,
          volume_24h: 0,
          tags: ['meme', 'new']
        },
        launched: false
      })
      .select()
      .single();
      
    if (error) {
      console.error("Database error:", error);
      // Continue even if database insert fails, as the token is already on blockchain
    }
    
    return new Response(JSON.stringify({
      success: true,
      message: "Token launched successfully",
      tokenId: deployResult.tokenId,
      contractAddress: deployResult.contractAddress,
      symbol: data.symbol,
      name: data.name
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error launching token:", error);
    return new Response(JSON.stringify({
      success: false,
      message: "Failed to launch token",
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
}

async function handleBuyInitialSupply(data: any, supabase: any, blockchain: any, corsHeaders: any) {
  // Validate required fields
  if (!data.tokenId || !data.walletAddress || !data.amount) {
    return new Response(JSON.stringify({ 
      success: false,
      error: "Token ID, wallet address, and amount are required" 
    }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
  
  try {
    // Calculate SOL required (using bonding curve)
    const initialPrice = 0.01; // Mock initial price per token
    const solRequired = data.amount * initialPrice;
    
    // Execute purchase on blockchain
    const purchaseResult = await blockchain.purchaseInitialSupply({
      tokenId: data.tokenId,
      walletAddress: data.walletAddress,
      amount: data.amount,
      solAmount: solRequired
    });
    
    if (!purchaseResult.success) {
      return new Response(JSON.stringify({
        success: false,
        error: "Failed to purchase initial supply on blockchain"
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }
    
    // Update token in database as launched
    const { error } = await supabase
      .from('tokens')
      .update({
        launched: true,
        launch_date: new Date().toISOString(),
        market_cap: solRequired
      })
      .eq('id', data.tokenId);
      
    if (error) {
      console.error("Database error:", error);
      // Continue even if database update fails
    }
    
    // Log transaction
    const { error: txError } = await supabase
      .from('transactions')
      .insert({
        token_id: data.tokenId,
        wallet: data.walletAddress,
        type: 'buy',
        amount: data.amount,
        price: initialPrice,
        fee: 0 // No fee on initial purchase
      });
    
    if (txError) {
      console.error("Transaction log error:", txError);
      // Continue even if transaction logging fails
    }
    
    return new Response(JSON.stringify({
      success: true,
      amountSol: solRequired,
      amountTokens: data.amount,
      txHash: purchaseResult.txHash
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error purchasing initial supply:", error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
}

async function handleGetListedTokens(supabase: any, corsHeaders: any) {
  try {
    // Get tokens from database
    const { data: tokens, error } = await supabase
      .from('tokens')
      .select('*')
      .order('market_cap', { ascending: false });
      
    if (error) {
      console.error("Database error:", error);
      return new Response(JSON.stringify({
        error: "Failed to fetch tokens"
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });
    }
    
    // Map tokens to ListedToken format
    const listedTokens = tokens.map((token: any) => {
      let bondingCurveData = token.bonding_curve || {};
      if (typeof bondingCurveData === 'string') {
        try {
          bondingCurveData = JSON.parse(bondingCurveData);
        } catch (e) {
          bondingCurveData = {};
        }
      }
      
      // Parse tags to ensure they're always an array
      let tags = bondingCurveData.tags || ['meme'];
      if (typeof tags === 'string') {
        tags = [tags];
      } else if (!Array.isArray(tags)) {
        tags = ['meme'];
      }
      
      return {
        id: token.id,
        name: token.name,
        symbol: token.symbol,
        price: bondingCurveData.price || 0.01,
        change24h: bondingCurveData.change_24h || 0,
        volume24h: bondingCurveData.volume_24h || 0,
        marketCap: token.market_cap || 0,
        logo: null, // No logo in database
        creatorWallet: token.creator_wallet,
        totalSupply: 1000000, // Default if not specified
        category: tags,
        devWallet: token.creator_wallet,
        holderStats: {
          whales: Math.floor(Math.random() * 5),
          retail: Math.floor(Math.random() * 100) + 20,
          devs: 1
        },
        holders: Math.floor(Math.random() * 150) + 30
      };
    });
    
    return new Response(JSON.stringify(listedTokens), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("Error fetching listed tokens:", error);
    return new Response(JSON.stringify({
      error: "Failed to fetch tokens",
      message: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  }
}
