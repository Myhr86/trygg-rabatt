import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CodeReport {
  code_id: string;
  worked: boolean;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    console.log('Starting daily update job...');

    // 1. Trigger discount code scraping (runs in background)
    console.log('Triggering discount code scraping...');
    try {
      const scrapeResponse = await fetch(`${supabaseUrl}/functions/v1/scrape-discount-codes`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (scrapeResponse.ok) {
        const scrapeResult = await scrapeResponse.json();
        console.log('Scraping result:', scrapeResult);
      } else {
        console.error('Scraping failed:', await scrapeResponse.text());
      }
    } catch (scrapeError) {
      console.error('Error triggering scraping:', scrapeError);
    }

    // 2. Deactivate expired codes
    const { data: expiredCodes, error: expireError } = await supabase
      .from('discount_codes')
      .update({ is_active: false })
      .lt('valid_until', new Date().toISOString())
      .eq('is_active', true)
      .select('id');

    if (expireError) {
      console.error('Error deactivating expired codes:', expireError);
    } else {
      console.log(`Deactivated ${expiredCodes?.length || 0} expired codes`);
    }

    // 3. Update probabilities based on recent reports (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data: recentReports, error: reportsError } = await supabase
      .from('code_reports')
      .select('code_id, worked')
      .gte('reported_at', sevenDaysAgo.toISOString());

    if (reportsError) {
      console.error('Error fetching reports:', reportsError);
    } else if (recentReports && recentReports.length > 0) {
      // Group reports by code_id
      const reportsByCode = (recentReports as CodeReport[]).reduce((acc, report) => {
        if (!acc[report.code_id]) {
          acc[report.code_id] = { worked: 0, failed: 0 };
        }
        if (report.worked) {
          acc[report.code_id].worked++;
        } else {
          acc[report.code_id].failed++;
        }
        return acc;
      }, {} as Record<string, { worked: number; failed: number }>);

      // Update probability for each code based on reports
      for (const [codeId, stats] of Object.entries(reportsByCode)) {
        const total = stats.worked + stats.failed;
        if (total >= 3) {
          // Only update if we have enough reports
          const successRate = stats.worked / total;
          
          // Get current probability
          const { data: codeData } = await supabase
            .from('discount_codes')
            .select('probability')
            .eq('id', codeId)
            .maybeSingle();

          if (codeData) {
            // Blend current probability with reported success rate
            const newProbability = Math.round(
              codeData.probability * 0.7 + successRate * 100 * 0.3
            );

            // Update probability and trust level
            let trustLevel = 'low';
            if (newProbability >= 80) trustLevel = 'high';
            else if (newProbability >= 60) trustLevel = 'medium';

            await supabase
              .from('discount_codes')
              .update({
                probability: Math.max(0, Math.min(100, newProbability)),
                trust_level: trustLevel,
                last_verified: new Date().toISOString(),
              })
              .eq('id', codeId);

            console.log(`Updated code ${codeId}: probability=${newProbability}, trust=${trustLevel}`);

            // Deactivate codes with very low probability
            if (newProbability < 30) {
              await supabase
                .from('discount_codes')
                .update({ is_active: false })
                .eq('id', codeId);
              console.log(`Deactivated low-probability code: ${codeId}`);
            }
          }
        }
      }
    }

    // 4. Update store timestamps for stores with changes
    const { error: timestampError } = await supabase.rpc('update_all_store_timestamps');
    
    // This RPC might not exist, so we handle it gracefully
    if (timestampError && !timestampError.message.includes('does not exist')) {
      console.error('Error updating timestamps:', timestampError);
    }

    console.log('Daily update completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Daily update completed',
        expiredCodes: expiredCodes?.length || 0,
        reportsProcessed: recentReports?.length || 0,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Daily update error:', error);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
