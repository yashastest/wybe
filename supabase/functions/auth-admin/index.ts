
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

interface AdminLoginRequest {
  email: string;
  password: string;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Session expiration in seconds (24 hours)
const SESSION_EXPIRATION = 24 * 60 * 60;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const { email, password }: AdminLoginRequest = await req.json();
    
    // Validate required fields
    if (!email || !password) {
      return new Response(
        JSON.stringify({ error: 'Email and password are required' }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }
    
    // Call the database function to authenticate admin
    const { data, error } = await supabase.rpc('authenticate_admin', {
      input_email: email,
      input_password: password
    });
    
    if (error || !data || data.length === 0) {
      console.error('Authentication error:', error);
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }
    
    // Admin authenticated successfully
    const admin = data[0];
    
    // Generate a session token - in a real app, use JWT or other secure method
    const sessionToken = crypto.randomUUID();
    
    // Current time
    const now = new Date();
    
    // Calculate expiration time
    const expiresAt = new Date(now.getTime() + (SESSION_EXPIRATION * 1000));
    
    return new Response(
      JSON.stringify({
        success: true,
        admin: {
          id: admin.id,
          email: admin.email
        },
        session: {
          token: sessionToken,
          expiresAt: expiresAt.toISOString()
        }
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
