
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

interface TradeLogRequest {
  wallet_address: string;
  token_symbol: string;
  side: 'buy' | 'sell';
  amount: number;
  tx_hash?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }

  try {
    // Only accept POST requests
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse request body
    const reqData: TradeLogRequest = await req.json();
    
    // Validate request data
    if (!reqData.wallet_address || !reqData.token_symbol || !reqData.side || reqData.amount === undefined) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") as string;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert trade record
    const { data, error } = await supabase.from('trades').insert({
      wallet_address: reqData.wallet_address,
      token_symbol: reqData.token_symbol,
      side: reqData.side,
      amount: reqData.amount,
      tx_hash: reqData.tx_hash
    }).select();

    if (error) {
      console.error("Error inserting trade:", error);
      return new Response(JSON.stringify({ error: "Failed to log trade" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Return success response
    return new Response(JSON.stringify({ 
      success: true, 
      message: "Trade logged successfully", 
      trade: data[0] 
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    // Handle unexpected errors
    console.error("Unexpected error:", error);
    return new Response(JSON.stringify({ 
      error: "An unexpected error occurred", 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
