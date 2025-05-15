
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  
  try {
    // Create a Supabase client with the Auth context of the logged in user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing Authorization header" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Get request body
    const { battleRoomId, tokenSymbol, tokenName, initialSupply, creatorWallet } = await req.json();
    
    // Validate required fields
    if (!battleRoomId || !tokenSymbol || !tokenName || !initialSupply || !creatorWallet) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Get Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );
    
    // Get battle room
    const { data: battleRoom, error: roomError } = await supabaseClient
      .from('battle_rooms')
      .select('*')
      .eq('id', battleRoomId)
      .maybeSingle();
    
    if (roomError || !battleRoom) {
      return new Response(JSON.stringify({ error: roomError?.message || "Battle room not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Check if room is open
    if (battleRoom.status !== 'open') {
      return new Response(JSON.stringify({ error: "Battle room is not open for registration" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Check if room is full
    if (battleRoom.participant_count >= battleRoom.max_participants) {
      return new Response(JSON.stringify({ error: "Battle room is already full" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Check if waiting time has passed
    if (new Date(battleRoom.waiting_time_end) < new Date()) {
      return new Response(JSON.stringify({ error: "Waiting time has already passed" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Check if token symbol is already taken in this battle
    const { data: existingToken } = await supabaseClient
      .from('battle_tokens')
      .select('id')
      .eq('battle_room_id', battleRoomId)
      .eq('token_symbol', tokenSymbol)
      .maybeSingle();
    
    if (existingToken) {
      return new Response(JSON.stringify({ error: "Token symbol already exists in this battle" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Start a transaction
    const { data: newToken, error: tokenError } = await supabaseClient
      .from('battle_tokens')
      .insert([
        {
          battle_room_id: battleRoomId,
          token_symbol: tokenSymbol,
          token_name: tokenName,
          creator_wallet: creatorWallet,
          initial_supply: initialSupply
        }
      ])
      .select()
      .single();
    
    if (tokenError) {
      return new Response(JSON.stringify({ error: tokenError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Update participant count
    const { error: updateError } = await supabaseClient
      .from('battle_rooms')
      .update({ participant_count: battleRoom.participant_count + 1 })
      .eq('id', battleRoomId);
    
    if (updateError) {
      return new Response(JSON.stringify({ error: updateError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Check if room is now full
    if (battleRoom.participant_count + 1 >= battleRoom.max_participants) {
      await supabaseClient
        .from('battle_rooms')
        .update({ status: 'full' })
        .eq('id', battleRoomId);
    }
    
    return new Response(JSON.stringify({ success: true, data: newToken }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
