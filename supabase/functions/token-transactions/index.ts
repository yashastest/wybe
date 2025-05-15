
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Create a Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

interface TradeRequest {
  wallet_address: string;
  token_symbol: string;
  side: "buy" | "sell";
  amount: number;
  sol_amount: number;
  gas_priority?: number;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  try {
    // Only allow POST requests
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Parse request body
    const tradeReq: TradeRequest = await req.json();

    // Validate required fields
    if (!tradeReq.wallet_address || !tradeReq.token_symbol || !tradeReq.side || tradeReq.amount === undefined) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // 1. Verify token exists
    const { data: token, error: tokenError } = await supabase
      .from("tokens")
      .select("id, symbol, market_cap, launched")
      .eq("symbol", tradeReq.token_symbol.toUpperCase())
      .single();

    if (tokenError || !token) {
      return new Response(JSON.stringify({ error: "Token not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // 2. Calculate token price using bonding curve
    // In a real implementation, this would call the smart contract
    // For now, we'll use a simple formula
    const basePrice = Math.pow(token.market_cap / 10000, 2) + 0.01;
    
    // Add a small spread for buy/sell difference
    const price = tradeReq.side === "buy"
      ? basePrice * 1.01
      : basePrice * 0.99;

    // 3. Calculate SOL amount if selling tokens
    const solAmount = tradeReq.side === "buy"
      ? tradeReq.sol_amount
      : price * tradeReq.amount;
    
    // 4. Calculate tokens amount if buying with SOL
    const tokenAmount = tradeReq.side === "buy"
      ? tradeReq.sol_amount / price
      : tradeReq.amount;

    // 5. Calculate fees
    const platformFee = solAmount * 0.01; // 1% platform fee
    const creatorFee = solAmount * 0.01; // 1% creator fee
    
    // Generate a mock transaction hash
    const txHash = "tx_" + Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
    
    // 6. Log trade to the database
    const { data: trade, error: tradeError } = await supabase
      .from("transactions")
      .insert({
        wallet: tradeReq.wallet_address,
        token_id: token.id,
        type: tradeReq.side,
        price: price,
        amount: tokenAmount,
        fee: platformFee + creatorFee,
      })
      .select()
      .single();

    if (tradeError) {
      console.error("Error logging trade:", tradeError);
      return new Response(JSON.stringify({ error: "Failed to log trade" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // 7. Update token market cap
    let newMarketCap = token.market_cap;
    
    if (tradeReq.side === "buy") {
      // If buying, increase market cap by the SOL amount (simplified)
      newMarketCap += solAmount;
    } else {
      // If selling, decrease market cap by the SOL amount (simplified)
      newMarketCap -= solAmount;
      // Ensure market cap doesn't go below a minimum value
      newMarketCap = Math.max(newMarketCap, 1000);
    }
    
    await supabase
      .from("tokens")
      .update({ market_cap: newMarketCap })
      .eq("id", token.id);

    // 8. In a real implementation, we would also:
    // - Call the smart contract to execute the trade
    // - Wait for blockchain confirmation
    // - Update token balances in user wallets

    // Return successful response
    return new Response(
      JSON.stringify({
        success: true,
        transaction: {
          id: trade.id,
          txHash,
          tokenSymbol: token.symbol,
          side: tradeReq.side,
          amount: tokenAmount,
          price: price,
          solAmount: solAmount,
          fees: {
            platform: platformFee,
            creator: creatorFee,
            total: platformFee + creatorFee,
          },
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Error processing trade:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
});
