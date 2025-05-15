
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.33.1';

// Define the structure of the request body
interface TradeData {
  wallet_address: string;
  token_symbol: string;
  side: 'buy' | 'sell';
  amount: number;
  tx_hash?: string;
}

// Create a single Deno server for all requests
Deno.serve(async (req) => {
  try {
    // CORS headers to allow requests from any origin
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };

    // Handle OPTIONS request for CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response('ok', { headers: corsHeaders });
    }

    // Get request body
    const requestData: TradeData = await req.json();

    // Validate request data
    if (!requestData.wallet_address || !requestData.token_symbol || !requestData.side || requestData.amount === undefined) {
      return new Response(
        JSON.stringify({ 
          error: 'Missing required fields. Required: wallet_address, token_symbol, side, amount' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Create a Supabase client with the Deno runtime
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Insert the trade record
    const { data, error } = await supabase
      .from('trades')
      .insert([
        {
          wallet_address: requestData.wallet_address,
          token_symbol: requestData.token_symbol,
          side: requestData.side,
          amount: requestData.amount,
          tx_hash: requestData.tx_hash || null,
        },
      ]);

    if (error) {
      console.error('Error inserting trade:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Trade logged successfully' 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    // Handle any unexpected errors
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
});
