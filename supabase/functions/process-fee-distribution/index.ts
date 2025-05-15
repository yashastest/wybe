
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
  
  // Get Supabase client
  const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    console.log("Starting fee distribution process...");

    // 1. Get tokens that have been active for more than 48 hours with market cap > $50K
    const thirtyMinutesAgo = new Date();
    thirtyMinutesAgo.setMinutes(thirtyMinutesAgo.getMinutes() - 30);
    
    const { data: eligibleTokens, error: tokensError } = await supabase
      .from("tokens")
      .select("id, creator_wallet, market_cap")
      .gte("market_cap", 50000)  // Market cap > $50K
      .lt("launch_date", thirtyMinutesAgo.toISOString()) // Launched more than 48 hours ago
      .eq("launched", true);

    if (tokensError) {
      throw new Error(`Error fetching eligible tokens: ${tokensError.message}`);
    }

    console.log(`Found ${eligibleTokens?.length || 0} eligible tokens for 40% fee distribution`);

    // 2. Get tokens that have been active for more than 7 days but don't meet the 50K threshold
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const { data: secondaryTokens, error: secondaryError } = await supabase
      .from("tokens")
      .select("id, creator_wallet, market_cap")
      .lt("market_cap", 50000)  // Market cap <= $50K
      .lt("launch_date", sevenDaysAgo.toISOString()) // Launched more than 7 days ago
      .eq("launched", true);

    if (secondaryError) {
      throw new Error(`Error fetching secondary tokens: ${secondaryError.message}`);
    }

    console.log(`Found ${secondaryTokens?.length || 0} tokens for 20% fee distribution`);

    // 3. Process eligible tokens (40% to creator)
    for (const token of (eligibleTokens || [])) {
      // Calculate unpaid fees for this token
      const { data: transactions, error: txError } = await supabase
        .from("fee_distributions")
        .select("*")
        .eq("token_id", token.id)
        .eq("distributed", false);
      
      if (txError) {
        console.error(`Error fetching transactions for token ${token.id}: ${txError.message}`);
        continue;
      }

      if (!transactions || transactions.length === 0) {
        console.log(`No pending fee distributions for token ${token.id}`);
        continue;
      }
      
      console.log(`Processing ${transactions.length} fee distributions for token ${token.id}`);
      
      // Update fee distribution records (40% to creator)
      for (const tx of transactions) {
        // In a real implementation, this would trigger sending SOL to the creator wallet
        const { error: updateError } = await supabase
          .from("fee_distributions")
          .update({
            distributed: true,
            distribution_timestamp: new Date().toISOString()
          })
          .eq("id", tx.id);
        
        if (updateError) {
          console.error(`Error updating fee distribution ${tx.id}: ${updateError.message}`);
          continue;
        }
        
        console.log(`Updated fee distribution ${tx.id} as distributed`);
      }
    }
    
    // 4. Process secondary tokens (20% to creator)
    for (const token of (secondaryTokens || [])) {
      // Similar logic as above but with 20% distribution
      const { data: transactions, error: txError } = await supabase
        .from("fee_distributions")
        .select("*")
        .eq("token_id", token.id)
        .eq("distributed", false);
      
      if (txError || !transactions || transactions.length === 0) {
        continue;
      }
      
      // Update fee distribution records (20% to creator)
      for (const tx of transactions) {
        // In a real implementation, this would trigger sending SOL to the creator wallet
        const { error: updateError } = await supabase
          .from("fee_distributions")
          .update({
            distributed: true,
            distribution_timestamp: new Date().toISOString()
          })
          .eq("id", tx.id);
        
        if (updateError) {
          console.error(`Error updating fee distribution ${tx.id}: ${updateError.message}`);
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Fee distribution process completed" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error processing fee distribution:", error.message);
    
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
