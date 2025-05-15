
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
    const { roomId, maxParticipants, battleDurationHours } = await req.json();
    
    // Validate required fields
    if (!roomId || !maxParticipants || !battleDurationHours) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Validate max participants
    if (maxParticipants < 2 || maxParticipants > 5) {
      return new Response(JSON.stringify({ error: "maxParticipants must be between 2 and 5" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Validate battle duration
    if (battleDurationHours < 1 || battleDurationHours > 24) {
      return new Response(JSON.stringify({ error: "battleDurationHours must be between 1 and 24" }), {
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
    
    // Check if room ID is already taken
    const { data: existingRoom } = await supabaseClient
      .from('battle_rooms')
      .select('id')
      .eq('room_id', roomId)
      .maybeSingle();
    
    if (existingRoom) {
      return new Response(JSON.stringify({ error: "Room ID already exists" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    // Calculate timestamps
    const now = new Date();
    const waitingTimeEnd = new Date(now.getTime() + 60 * 1000); // 1 minute from now
    const battleEndTime = new Date(waitingTimeEnd.getTime() + battleDurationHours * 60 * 60 * 1000);
    
    // Create battle room
    const { data: newRoom, error: createError } = await supabaseClient
      .from('battle_rooms')
      .insert([
        {
          room_id: roomId,
          status: 'open',
          waiting_time_end: waitingTimeEnd.toISOString(),
          battle_end_time: battleEndTime.toISOString(),
          max_participants: maxParticipants,
          participant_count: 0,
          platform_fee_percentage: 10
        }
      ])
      .select()
      .single();
    
    if (createError) {
      return new Response(JSON.stringify({ error: createError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    
    return new Response(JSON.stringify({ success: true, data: newRoom }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
    
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
