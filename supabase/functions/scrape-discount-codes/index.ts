import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Known discount code aggregator sites for Norwegian stores
const DISCOUNT_SOURCES: Record<string, string[]> = {
  // Barn & baby
  jollyroom: [
    'https://www.cuponation.no/jollyroom-rabattkode',
    'https://kickback.no/rabattkode/jollyroom',
  ],
  elefun: [
    'https://www.cuponation.no/elefun-rabattkoder',
    'https://kickback.no/rabattkode/elefun',
  ],
  lekekassen: [
    'https://kickback.no/rabattkode/lekekassen',
  ],
  wee: [
    'https://kickback.no/rabattkode/wee',
  ],
  
  // Helse & skjønnhet
  blivakker: [
    'https://www.cuponation.no/blivakker-rabattkoder',
    'https://kickback.no/rabattkode/blivakker',
  ],
  lyko: [
    'https://www.cuponation.no/lyko-rabattkoder',
    'https://kickback.no/rabattkode/lyko',
  ],
  vita: [
    'https://www.cuponation.no/vita-rabattkoder',
    'https://kickback.no/rabattkode/vita',
  ],
  sephora: [
    'https://www.cuponation.no/sephora-rabattkoder',
    'https://kickback.no/rabattkode/sephora',
  ],
  farmasiet: [
    'https://www.cuponation.no/farmasiet',
    'https://kickback.no/rabattkode/farmasiet',
  ],
  apotek1: [
    'https://www.cuponation.no/apotek1-rabattkoder',
    'https://kickback.no/rabattkode/apotek1',
  ],
  staypro: [
    'https://www.cuponation.no/staypro-rabattkoder',
    'https://kickback.no/rabattkode/staypro',
  ],
  blush: [
    'https://www.cuponation.no/blush-rabattkoder',
    'https://kickback.no/rabattkode/blush',
  ],
  kondomeriet: [
    'https://www.cuponation.no/kondomeriet-rabattkoder',
    'https://kickback.no/rabattkode/kondomeriet',
  ],
  
  // Sport & friluft
  fjellsport: [
    'https://www.cuponation.no/fjellsport-rabattkoder',
    'https://kickback.no/rabattkode/fjellsport',
  ],
  getinspired: [
    'https://kickback.no/rabattkode/get-inspired',
  ],
  xxl: [
    'https://www.cuponation.no/xxl-rabattkoder',
    'https://kickback.no/rabattkode/xxl',
  ],
  gymshark: [
    'https://www.cuponation.no/gymshark-rabattkoder',
    'https://kickback.no/rabattkode/gymshark',
  ],
  hellyhansen: [
    'https://www.cuponation.no/helly-hansen-rabattkoder',
    'https://kickback.no/rabattkode/helly-hansen',
  ],
  
  // Klær & sko
  zalando: [
    'https://www.cuponation.no/zalando-rabattkoder',
    'https://kickback.no/rabattkode/zalando',
  ],
  boozt: [
    'https://www.cuponation.no/boozt-rabattkoder',
    'https://kickback.no/rabattkode/boozt',
  ],
  nelly: [
    'https://www.cuponation.no/nelly-rabattkoder',
    'https://kickback.no/rabattkode/nelly',
  ],
  hm: [
    'https://www.cuponation.no/hm-rabattkoder',
  ],
  ellos: [
    'https://www.cuponation.no/ellos-rabattkoder',
    'https://kickback.no/rabattkode/ellos',
  ],
  nakd: [
    'https://www.cuponation.no/nakd-rabattkoder',
    'https://kickback.no/rabattkode/nakd',
  ],
  shein: [
    'https://www.cuponation.no/shein',
    'https://kickback.no/rabattkode/shein',
  ],
  
  // Elektronikk
  elkjop: [
    'https://www.cuponation.no/elkjop-rabattkoder',
    'https://kickback.no/rabattkode/elkjop',
  ],
  komplett: [
    'https://www.cuponation.no/komplett-rabattkoder',
    'https://kickback.no/rabattkode/komplett',
  ],
  power: [
    'https://www.cuponation.no/power-rabattkoder',
    'https://kickback.no/rabattkode/power',
  ],
  proshop: [
    'https://www.cuponation.no/proshop-rabattkoder',
    'https://kickback.no/rabattkode/proshop',
  ],
  dustin: [
    'https://kickback.no/rabattkode/dustin-home',
  ],
  mytrendyphone: [
    'https://kickback.no/rabattkode/mytrendyphone',
  ],
  netonnet: [
    'https://www.cuponation.no/netonnet-rabattkoder',
    'https://kickback.no/rabattkode/netonnet',
  ],
  samsung: [
    'https://www.cuponation.no/samsung-rabattkoder',
    'https://kickback.no/rabattkode/samsung',
  ],
  dyson: [
    'https://www.cuponation.no/dyson-rabattkoder',
    'https://kickback.no/rabattkode/dyson',
  ],
  
  // Hjem & hage
  ikea: [
    'https://www.cuponation.no/ikea-rabattkoder',
  ],
  clasohlson: [
    'https://www.cuponation.no/clas-ohlson-rabattkoder',
    'https://kickback.no/rabattkode/clas-ohlson',
  ],
  jula: [
    'https://www.cuponation.no/jula-rabattkoder',
    'https://kickback.no/rabattkode/jula',
  ],
  plantasjen: [
    'https://www.cuponation.no/plantasjen-rabattkoder',
    'https://kickback.no/rabattkode/plantasjen',
  ],
  byggmax: [
    'https://www.cuponation.no/byggmax-rabattkoder',
    'https://kickback.no/rabattkode/byggmax',
  ],
  
  // Mat & levering
  foodora: [
    'https://www.cuponation.no/foodora-rabattkoder',
    'https://kickback.no/rabattkode/foodora',
  ],
  wolt: [
    'https://www.cuponation.no/wolt-rabattkoder',
    'https://kickback.no/rabattkode/wolt',
  ],
  morgenlevering: [
    'https://www.cuponation.no/morgenlevering-rabattkoder',
    'https://kickback.no/rabattkode/morgenlevering',
  ],
  
  // Kjæledyr
  zooplus: [
    'https://www.cuponation.no/zooplus-rabattkoder',
    'https://kickback.no/rabattkode/zooplus',
  ],
  
  // Reise
  hotels: [
    'https://www.cuponation.no/hotels-com-rabattkoder',
    'https://kickback.no/rabattkode/hotels',
  ],
  colorline: [
    'https://www.cuponation.no/color-line-rabattkoder',
    'https://kickback.no/rabattkode/color-line',
  ],
  norwegian: [
    'https://www.cuponation.no/norwegian-rabattkoder',
    'https://kickback.no/rabattkode/norwegian',
  ],
  ving: [
    'https://www.cuponation.no/ving-rabattkoder',
    'https://kickback.no/rabattkode/ving',
  ],
  apollo: [
    'https://www.cuponation.no/apollo-rabattkoder',
    'https://kickback.no/rabattkode/apollo',
  ],
  dfds: [
    'https://www.cuponation.no/dfds-rabattkoder',
    'https://kickback.no/rabattkode/dfds',
  ],
  
  // Bøker & media
  adlibris: [
    'https://www.cuponation.no/adlibris-rabattkoder',
    'https://kickback.no/rabattkode/adlibris',
  ],
};

interface DiscountCode {
  code: string;
  description: string;
  probability: number;
  context: string[];
  savings: string;
}

async function scrapeUrl(url: string, apiKey: string): Promise<string | null> {
  try {
    console.log(`Scraping: ${url}`);
    const response = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url,
        formats: ['markdown'],
        onlyMainContent: true,
      }),
    });

    if (!response.ok) {
      console.error(`Failed to scrape ${url}: ${response.status}`);
      return null;
    }

    const data = await response.json();
    return data.data?.markdown || data.markdown || null;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return null;
  }
}

async function extractCodesWithAI(
  storeId: string,
  storeName: string,
  scrapedContent: string,
  lovableApiKey: string
): Promise<DiscountCode[]> {
  try {
    console.log(`Extracting codes for ${storeName} using AI...`);
    
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${lovableApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: `Du er en ekspert på å finne og validere rabattkoder for norske nettbutikker. 
            
Analyser innholdet og ekstraher gyldige rabattkoder. For hver kode, vurder:
- Om koden ser aktiv og gyldig ut
- Sannsynlighet for at den fungerer (0-100)
- Eventuelle betingelser (ny kunde, student, minimum beløp, etc.)

Returner BARE et JSON-array med objekter. Ikke inkluder noe annet tekst.
Hver objekt skal ha: code, description, probability, context (array), savings.

Eksempel output:
[{"code":"VELKOMST10","description":"10% rabatt på første ordre","probability":85,"context":["Ny kunde"],"savings":"10%"}]

VIKTIG: 
- Returner kun koder som ser gyldige ut
- Sett probability basert på hvor pålitelig kilden virker
- Ignorer utløpte koder eller generiske tilbud uten kode
- Hvis ingen gyldige koder finnes, returner []`
          },
          {
            role: 'user',
            content: `Finn alle gyldige rabattkoder for ${storeName} fra dette innholdet:\n\n${scrapedContent.slice(0, 8000)}`
          }
        ],
        temperature: 0.1,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      console.error(`AI extraction failed: ${response.status}`);
      return [];
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    
    // Parse JSON from response
    const jsonMatch = content.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      console.log(`No codes found for ${storeName}`);
      return [];
    }

    const codes = JSON.parse(jsonMatch[0]) as DiscountCode[];
    console.log(`Found ${codes.length} codes for ${storeName}`);
    return codes;
  } catch (error) {
    console.error(`Error extracting codes for ${storeName}:`, error);
    return [];
  }
}

async function processStore(
  storeId: string,
  storeName: string,
  urls: string[],
  firecrawlKey: string,
  lovableApiKey: string,
  supabase: any
): Promise<number> {
  let allContent = '';
  
  // Scrape all sources for this store
  for (const url of urls) {
    const content = await scrapeUrl(url, firecrawlKey);
    if (content) {
      allContent += `\n\n--- Source: ${url} ---\n${content}`;
    }
  }

  if (!allContent) {
    console.log(`No content scraped for ${storeName}`);
    return 0;
  }

  // Extract codes using AI
  const codes = await extractCodesWithAI(storeId, storeName, allContent, lovableApiKey);
  
  let addedCount = 0;
  
  for (const code of codes) {
    // Skip codes with low probability
    if (code.probability < 60) continue;
    
    // Check if code already exists
    const { data: existing } = await supabase
      .from('discount_codes')
      .select('id, probability')
      .eq('store_id', storeId)
      .eq('code', code.code)
      .maybeSingle();

    if (existing) {
      // Update existing code if probability changed significantly
      if (Math.abs(existing.probability - code.probability) > 10) {
        await supabase
          .from('discount_codes')
          .update({
            probability: code.probability,
            description: code.description,
            context: code.context,
            savings: code.savings,
            last_verified: new Date().toISOString(),
          })
          .eq('id', existing.id);
        console.log(`Updated code ${code.code} for ${storeName}`);
      }
    } else {
      // Insert new code
      const newId = `${storeId}_${code.code.toLowerCase().replace(/[^a-z0-9]/g, '')}_${Date.now()}`;
      
      const { error } = await supabase
        .from('discount_codes')
        .insert({
          id: newId,
          store_id: storeId,
          code: code.code,
          description: code.description,
          probability: code.probability,
          trust_level: code.probability >= 80 ? 'high' : code.probability >= 60 ? 'medium' : 'low',
          context: code.context,
          savings: code.savings,
          is_active: true,
        });

      if (!error) {
        addedCount++;
        console.log(`Added new code ${code.code} for ${storeName}`);
      } else {
        console.error(`Failed to add code ${code.code}:`, error);
      }
    }
  }

  return addedCount;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const firecrawlKey = Deno.env.get('FIRECRAWL_API_KEY');
    const lovableApiKey = Deno.env.get('LOVABLE_API_KEY');
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    if (!firecrawlKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Firecrawl API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!lovableApiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'Lovable API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get optional store filter from request body
    let storeFilter: string[] | null = null;
    try {
      const body = await req.json();
      storeFilter = body.stores || null;
    } catch {
      // No body provided, process all stores
    }

    console.log('Starting discount code scraping...');
    
    // Get all stores from database
    const { data: stores, error: storesError } = await supabase
      .from('stores')
      .select('id, name');

    if (storesError) {
      console.error('Failed to fetch stores:', storesError);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to fetch stores' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const results: Record<string, number> = {};
    let totalAdded = 0;

    for (const store of stores) {
      // Skip if store filter is set and this store isn't in it
      if (storeFilter && !storeFilter.includes(store.id)) continue;
      
      const urls = DISCOUNT_SOURCES[store.id];
      if (!urls || urls.length === 0) {
        console.log(`No sources configured for ${store.name}`);
        continue;
      }

      const added = await processStore(
        store.id,
        store.name,
        urls,
        firecrawlKey,
        lovableApiKey,
        supabase
      );
      
      results[store.name] = added;
      totalAdded += added;

      // Small delay between stores to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`Scraping completed. Total codes added: ${totalAdded}`);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Discount code scraping completed',
        totalAdded,
        results,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Scraping error:', error);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
