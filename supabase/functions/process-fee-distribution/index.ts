import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

// CORS headers for allowing cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders
    });
  }
  
  try {
    // Create Supabase client with the Deno runtime
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    
    // Handle POST request to process fee distribution
    if (req.method === "POST") {
      // Parse request body
      const requestData = await req.json();
      const { creator_wallet, distribution_id } = requestData;
      
      if (!creator_wallet) {
        return new Response(
          JSON.stringify({ error: "Creator wallet is required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
      
      // If distribution_id is provided, process specific distribution
      if (distribution_id) {
        return await processSpecificDistribution(supabase, creator_wallet, distribution_id, corsHeaders);
      }
      
      // Otherwise, process all eligible distributions for the creator
      return await processAllDistributions(supabase, creator_wallet, corsHeaders);
    }
    
    // Handle GET request to check distribution status
    if (req.method === "GET") {
      const url = new URL(req.url);
      const creator_wallet = url.searchParams.get("creator_wallet");
      
      if (!creator_wallet) {
        return new Response(
          JSON.stringify({ error: "Creator wallet is required" }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
      
      // Get eligible distributions for the creator
      const { data: eligibleDistributions, error } = await supabase
        .from("fee_distributions")
        .select("*")
        .eq("creator_wallet", creator_wallet)
        .eq("distributed", false)
        .lte("eligible_timestamp", new Date().toISOString())
        .order("eligible_timestamp", { ascending: true });
      
      if (error) {
        console.error("Error fetching eligible distributions:", error);
        return new Response(
          JSON.stringify({ error: "Failed to fetch eligible distributions" }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          }
        );
      }
      
      // Return the eligible distributions
      return new Response(
        JSON.stringify({
          success: true,
          eligibleDistributions,
          count: eligibleDistributions.length,
          totalAmount: eligibleDistributions.reduce((sum, dist) => sum + dist.amount, 0)
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
    
    // If neither POST nor GET, return method not allowed
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});

// Process a specific distribution
async function processSpecificDistribution(supabase, creator_wallet, distribution_id, corsHeaders) {
  // Check if the distribution exists and is eligible
  const { data: distribution, error } = await supabase
    .from("fee_distributions")
    .select("*")
    .eq("id", distribution_id)
    .eq("creator_wallet", creator_wallet)
    .eq("distributed", false)
    .lte("eligible_timestamp", new Date().toISOString())
    .single();
  
  if (error || !distribution) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Distribution not found or not eligible for claiming"
      }),
      {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
  
  // Update the distribution status
  const { error: updateError } = await supabase
    .from("fee_distributions")
    .update({
      distributed: true,
      distribution_timestamp: new Date().toISOString()
    })
    .eq("id", distribution_id);
  
  if (updateError) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to process distribution"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
  
  // In a real implementation, trigger blockchain transaction to send tokens to creator
  
  // Return success response
  return new Response(
    JSON.stringify({
      success: true,
      message: "Distribution processed successfully",
      distribution
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
}

// Process all eligible distributions for a creator
async function processAllDistributions(supabase, creator_wallet, corsHeaders) {
  // Get eligible distributions
  const { data: eligibleDistributions, error } = await supabase
    .from("fee_distributions")
    .select("*")
    .eq("creator_wallet", creator_wallet)
    .eq("distributed", false)
    .lte("eligible_timestamp", new Date().toISOString());
  
  if (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to fetch eligible distributions"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
  
  if (!eligibleDistributions || eligibleDistributions.length === 0) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "No eligible distributions found"
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
  
  // Update all eligible distributions
  const distributionIds = eligibleDistributions.map(dist => dist.id);
  const { error: updateError } = await supabase
    .from("fee_distributions")
    .update({
      distributed: true,
      distribution_timestamp: new Date().toISOString()
    })
    .in("id", distributionIds);
  
  if (updateError) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to process distributions"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
  
  // In a real implementation, trigger blockchain transaction to send tokens to creator
  
  // Calculate total amount distributed
  const totalAmount = eligibleDistributions.reduce((sum, dist) => sum + dist.amount, 0);
  
  // Return success response
  return new Response(
    JSON.stringify({
      success: true,
      message: `Successfully processed ${eligibleDistributions.length} distributions`,
      totalAmount,
      distributions: eligibleDistributions
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    }
  );
}
