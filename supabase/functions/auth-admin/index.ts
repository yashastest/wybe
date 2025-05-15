
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

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
    // Create a Supabase client with the service role key (admin privileges)
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(
        JSON.stringify({ 
          error: "Email and password are required" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // First check if the user exists in the admins table
    const { data: adminData, error: adminError } = await supabase
      .rpc('authenticate_admin', {
        input_email: email,
        input_password: password
      });

    if (adminError || !adminData || adminData.length === 0) {
      return new Response(
        JSON.stringify({ 
          error: "Invalid credentials or user not found" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 401,
        }
      );
    }

    const adminId = adminData[0].id;

    // Check if admin already has a corresponding auth user
    const { data: adminUser, error: adminUserError } = await supabase
      .from('admins')
      .select('user_id')
      .eq('id', adminId)
      .single();

    let userId = adminUser?.user_id;

    // If no linked auth user exists, create one
    if (!userId) {
      // Create a new auth user
      const { data: authUser, error: createUserError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (createUserError || !authUser.user) {
        console.error("Error creating auth user:", createUserError);
        return new Response(
          JSON.stringify({ 
            error: "Failed to create authentication user" 
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }

      userId = authUser.user.id;

      // Link the auth user to the admin record
      const { error: updateError } = await supabase
        .from('admins')
        .update({ user_id: userId })
        .eq('id', adminId);

      if (updateError) {
        console.error("Error linking auth user to admin:", updateError);
        return new Response(
          JSON.stringify({ 
            error: "Failed to link authentication user to admin record" 
          }),
          {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
            status: 500,
          }
        );
      }
    }

    // Generate a session for the user
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
    });

    if (sessionError) {
      console.error("Error generating session:", sessionError);
      return new Response(
        JSON.stringify({ 
          error: "Failed to generate authentication session" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: adminId,
          email: email,
          user_id: userId,
        },
        session: {
          access_token: sessionData.properties?.action_link?.split('access_token=')[1]?.split('&')[0],
          expires_at: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
        }
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Server error:", error);
    return new Response(
      JSON.stringify({ 
        error: "Internal server error",
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
