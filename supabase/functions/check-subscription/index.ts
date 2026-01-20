import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    logStep("Stripe key verified");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, returning unsubscribed state");
      return new Response(JSON.stringify({ subscribed: false }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    // Check for both active and trialing subscriptions (trial period)
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      limit: 10,
    });
    
    logStep("Raw subscriptions data", { 
      count: subscriptions.data.length,
      statuses: subscriptions.data.map((s: { id: string; status: string }) => ({ id: s.id, status: s.status }))
    });
    
    // Filter for active or trialing status
    const validSubscriptions = subscriptions.data.filter(
      (sub: { status: string }) => sub.status === 'active' || sub.status === 'trialing'
    );

    const hasActiveSub = validSubscriptions.length > 0;
    let subscriptionEnd: string | null = null;
    let billingInterval: string | null = null;

    if (hasActiveSub) {
      const subscription = validSubscriptions[0];
      
      // Get period end from subscription items (Stripe API v2025 structure)
      const firstItem = subscription.items?.data?.[0];
      const periodEnd = firstItem?.current_period_end || subscription.current_period_end;
      
      logStep("Processing subscription", { 
        id: subscription.id,
        status: subscription.status,
        item_period_end: firstItem?.current_period_end,
        sub_period_end: subscription.current_period_end,
        period_end_used: periodEnd
      });
      
      // Handle the period end - it should be a Unix timestamp in seconds
      if (periodEnd && typeof periodEnd === 'number') {
        subscriptionEnd = new Date(periodEnd * 1000).toISOString();
      }
      
      billingInterval = firstItem?.price?.recurring?.interval || null;
      logStep("Active/trial subscription found", { 
        subscriptionId: subscription.id, 
        status: subscription.status,
        endDate: subscriptionEnd,
        interval: billingInterval 
      });
    } else {
      logStep("No active or trialing subscription found");
    }

    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      subscription_end: subscriptionEnd,
      billing_interval: billingInterval
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
