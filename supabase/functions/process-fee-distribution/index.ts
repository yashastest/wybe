
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Define the expected request structure
interface ProcessFeeRequest {
  tokenId?: string;
  creatorWallet?: string;
  forceSend?: boolean;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Create a Supabase client with the Auth context of the request
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse the request body
    const { tokenId, creatorWallet, forceSend = false } = await req.json() as ProcessFeeRequest;

    // Initialize query to get eligible fee distributions
    let query = supabase
      .from('fee_distributions')
      .select('*')
      .eq('distributed', false);

    // Filter by tokenId or creatorWallet if provided
    if (tokenId) {
      query = query.eq('token_id', tokenId);
    }
    if (creatorWallet) {
      query = query.eq('creator_wallet', creatorWallet);
    }

    // Get all eligible distributions
    const { data: distributions, error } = await query;

    if (error) {
      console.error('Error fetching fee distributions:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch fee distributions' }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    if (!distributions || distributions.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No eligible fee distributions found' }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Process each distribution
    const results = [];
    const now = new Date();

    for (const distribution of distributions) {
      // Skip if not eligible yet (unless force sending)
      if (!forceSend && distribution.eligible_timestamp && new Date(distribution.eligible_timestamp) > now) {
        results.push({
          id: distribution.id,
          status: 'skipped',
          reason: 'Not yet eligible',
          eligibleAt: distribution.eligible_timestamp,
        });
        continue;
      }

      try {
        // Here in a real implementation, we would:
        // 1. Make the actual blockchain transaction to transfer the fee
        // 2. Wait for confirmation
        // 3. Update the distribution record with the transaction details

        // For our demo, we'll simulate a successful distribution
        const { error: updateError } = await supabase
          .from('fee_distributions')
          .update({
            distributed: true,
            distribution_timestamp: now.toISOString()
          })
          .eq('id', distribution.id);

        if (updateError) {
          throw updateError;
        }

        results.push({
          id: distribution.id,
          status: 'processed',
          amount: distribution.amount,
          creator: distribution.creator_wallet,
          timestamp: now.toISOString(),
        });
      } catch (err) {
        console.error(`Error processing distribution ${distribution.id}:`, err);
        results.push({
          id: distribution.id,
          status: 'failed',
          error: err.message,
        });
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        processed: results.filter(r => r.status === 'processed').length,
        skipped: results.filter(r => r.status === 'skipped').length,
        failed: results.filter(r => r.status === 'failed').length,
        results
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (err) {
    console.error('Server error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: err.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
