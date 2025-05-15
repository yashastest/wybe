
// Follow Deno API documentation
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }
  
  // Parse request body
  let body;
  try {
    body = await req.json();
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Invalid request body" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      }
    );
  }
  
  const { tokenId, type, amount, walletAddress } = body;
  
  if (!tokenId || !type || !amount || !walletAddress) {
    return new Response(
      JSON.stringify({ error: "Missing required parameters" }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400 
      }
    );
  }
  
  // Initialize Supabase client
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Get token information
    const { data: token, error: tokenError } = await supabase
      .from("tokens")
      .select("*")
      .eq("id", tokenId)
      .single();
    
    if (tokenError || !token) {
      throw new Error("Token not found");
    }
    
    // Get current token supply (in a real app, this would come from blockchain)
    // Here we'll simulate by counting buy/sell transactions
    const { data: buyTxs, error: buyError } = await supabase
      .from("transactions")
      .select("amount")
      .eq("token_id", tokenId)
      .eq("type", "buy");
      
    const { data: sellTxs, error: sellError } = await supabase
      .from("transactions")
      .select("amount")
      .eq("token_id", tokenId)
      .eq("type", "sell");
    
    if (buyError || sellError) {
      throw new Error("Failed to retrieve transaction history");
    }
    
    const totalBought = buyTxs?.reduce((acc, tx) => acc + tx.amount, 0) || 0;
    const totalSold = sellTxs?.reduce((acc, tx) => acc + tx.amount, 0) || 0;
    const currentSupply = totalBought - totalSold;
    
    // Calculate price based on bonding curve
    let curve = 'linear';
    if (token.bonding_curve && token.bonding_curve.type) {
      curve = token.bonding_curve.type;
    }
    
    // Call the database function to calculate token price
    const { data: priceData, error: priceError } = await supabase.rpc(
      'calculate_token_price',
      { total_supply: currentSupply, amount: amount, curve_type: curve }
    );
    
    if (priceError) {
      throw new Error(`Failed to calculate price: ${priceError.message}`);
    }
    
    const price = priceData;
    const totalPrice = price * amount;
    const fee = totalPrice * 0.05; // 5% fee
    
    // Record the transaction
    const { data: tx, error: txError } = await supabase
      .from("transactions")
      .insert({
        token_id: tokenId,
        wallet: walletAddress,
        amount: amount,
        type: type,
        price: price,
        fee: fee
      })
      .select()
      .single();
    
    if (txError) {
      throw new Error(`Failed to record transaction: ${txError.message}`);
    }
    
    // Update market cap
    const updatedMarketCap = currentSupply * price;
    await supabase
      .from("tokens")
      .update({ market_cap: updatedMarketCap })
      .eq("id", tokenId);
    
    // Record fee distribution
    if (fee > 0) {
      await supabase
        .from("fee_distributions")
        .insert({
          token_id: tokenId,
          creator_wallet: token.creator_wallet,
          amount: fee,
          eligible_timestamp: new Date().toISOString()
        });
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        transaction: tx,
        price: price,
        fee: fee,
        marketCap: updatedMarketCap
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error) {
    console.error("Error processing transaction:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500 
      }
    );
  }
});
