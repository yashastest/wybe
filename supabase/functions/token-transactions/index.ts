
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Define the transaction request structure
interface TokenTransactionRequest {
  tokenId: string;
  wallet: string;
  amount: number;
  type: 'buy' | 'sell';
  price?: number;
}

// Define the bonding curve calculation config
interface BondingCurveConfig {
  type: 'linear' | 'exponential' | 'logarithmic';
  basePrice: number;
  coefficient: number;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Platform configuration
const PLATFORM_FEE_PERCENTAGE = 0.05; // 5%
const CREATOR_FEE_PERCENTAGE_HIGH = 0.40; // 40% of fee when market cap > threshold
const CREATOR_FEE_PERCENTAGE_LOW = 0.20; // 20% of fee when market cap <= threshold
const MARKET_CAP_THRESHOLD = 50000; // $50K threshold
const HIGH_FEE_HOLDING_PERIOD_HOURS = 48; // 48 hours
const LOW_FEE_HOLDING_PERIOD_DAYS = 7; // 7 days

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
    const transaction = await req.json() as TokenTransactionRequest;

    // Validate required fields
    if (!transaction.tokenId || !transaction.wallet || !transaction.amount || !transaction.type) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Get token details
    const { data: token, error: tokenError } = await supabase
      .from('tokens')
      .select('*')
      .eq('id', transaction.tokenId)
      .single();

    if (tokenError || !token) {
      console.error('Error fetching token:', tokenError);
      return new Response(
        JSON.stringify({ error: 'Token not found' }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 404,
        }
      );
    }

    // Check if the token has been launched
    if (!token.launched) {
      return new Response(
        JSON.stringify({ error: 'Token has not been launched yet' }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 400,
        }
      );
    }

    // Get the current supply and calculate price using the bonding curve
    const { data: transactions, error: txError } = await supabase
      .from('transactions')
      .select('amount, type')
      .eq('token_id', transaction.tokenId);

    if (txError) {
      console.error('Error fetching transactions:', txError);
      return new Response(
        JSON.stringify({ error: 'Failed to calculate token price' }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Calculate current supply
    let currentSupply = 0;
    if (transactions) {
      for (const tx of transactions) {
        if (tx.type === 'buy') {
          currentSupply += tx.amount;
        } else if (tx.type === 'sell') {
          currentSupply -= tx.amount;
        }
      }
    }

    // Ensure the current supply is never negative
    currentSupply = Math.max(0, currentSupply);

    // Calculate price using bonding curve
    let curveType = 'linear';
    let calculatedPrice = 0;

    if (token.bonding_curve) {
      const curve = token.bonding_curve as BondingCurveConfig;
      curveType = curve.type || 'linear';
    }

    // Use the Supabase function to calculate price
    const { data: priceData, error: priceError } = await supabase
      .rpc('calculate_token_price', {
        total_supply: transaction.type === 'buy' ? currentSupply : currentSupply - transaction.amount,
        amount: transaction.amount,
        curve_type: curveType
      });

    if (priceError) {
      console.error('Error calculating price:', priceError);
      return new Response(
        JSON.stringify({ error: 'Failed to calculate token price' }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    calculatedPrice = priceData;

    // Override with provided price if specified (mainly for testing)
    const price = transaction.price || calculatedPrice;

    // Calculate transaction total value
    const transactionValue = price * transaction.amount;

    // Calculate fee
    const fee = transactionValue * PLATFORM_FEE_PERCENTAGE;

    // Create the transaction record
    const { data: newTransaction, error: insertError } = await supabase
      .from('transactions')
      .insert({
        token_id: transaction.tokenId,
        wallet: transaction.wallet,
        amount: transaction.amount,
        type: transaction.type,
        price,
        fee
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating transaction:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to record transaction' }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    // Update token market cap
    const newMarketCap = currentSupply * price;
    const { error: updateError } = await supabase
      .from('tokens')
      .update({ market_cap: newMarketCap })
      .eq('id', transaction.tokenId);

    if (updateError) {
      console.error('Error updating token market cap:', updateError);
      // Non-critical, continue processing
    }

    // Create fee distribution record
    let eligibleTimestamp: Date | null = null;
    
    if (newMarketCap > MARKET_CAP_THRESHOLD) {
      // High market cap: eligible after 48 hours
      eligibleTimestamp = new Date();
      eligibleTimestamp.setHours(eligibleTimestamp.getHours() + HIGH_FEE_HOLDING_PERIOD_HOURS);
    } else {
      // Low market cap: eligible after 7 days
      eligibleTimestamp = new Date();
      eligibleTimestamp.setDate(eligibleTimestamp.getDate() + LOW_FEE_HOLDING_PERIOD_DAYS);
    }

    // Calculate creator fee portion
    const creatorFeePercentage = newMarketCap > MARKET_CAP_THRESHOLD 
      ? CREATOR_FEE_PERCENTAGE_HIGH 
      : CREATOR_FEE_PERCENTAGE_LOW;
    
    const creatorFee = fee * creatorFeePercentage;

    const { error: feeDistributionError } = await supabase
      .from('fee_distributions')
      .insert({
        token_id: transaction.tokenId,
        creator_wallet: token.creator_wallet,
        amount: creatorFee,
        eligible_timestamp: eligibleTimestamp.toISOString(),
        distributed: false
      });

    if (feeDistributionError) {
      console.error('Error creating fee distribution record:', feeDistributionError);
      // Non-critical, continue processing
    }

    return new Response(
      JSON.stringify({
        success: true,
        transaction: newTransaction,
        marketCap: newMarketCap,
        supply: transaction.type === 'buy' ? currentSupply + transaction.amount : currentSupply - transaction.amount,
        fee: {
          total: fee,
          creator: creatorFee,
          platform: fee - creatorFee,
          eligibleAt: eligibleTimestamp
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
