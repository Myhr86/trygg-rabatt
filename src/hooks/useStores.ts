import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Store, DiscountCode, Alternative, TrustLevel } from '@/types/discount';

interface DbStore {
  id: string;
  name: string;
  category: string;
  logo: string | null;
  last_updated: string;
}

interface DbDiscountCode {
  id: string;
  store_id: string;
  code: string;
  description: string;
  probability: number;
  trust_level: string;
  context: string[];
  valid_until: string | null;
  last_verified: string;
  savings: string | null;
  is_active: boolean;
}

interface DbAlternative {
  id: string;
  store_id: string;
  type: string;
  title: string;
  description: string;
  action_label: string | null;
  action_url: string | null;
}

function mapDbCodeToCode(dbCode: DbDiscountCode): DiscountCode {
  return {
    id: dbCode.id,
    code: dbCode.code,
    description: dbCode.description,
    probability: dbCode.probability,
    trustLevel: dbCode.trust_level as TrustLevel,
    context: dbCode.context || [],
    validUntil: dbCode.valid_until || undefined,
    lastVerified: dbCode.last_verified,
    savings: dbCode.savings || undefined,
  };
}

function mapDbAlternativeToAlternative(dbAlt: DbAlternative): Alternative {
  return {
    type: dbAlt.type as Alternative['type'],
    title: dbAlt.title,
    description: dbAlt.description,
    actionLabel: dbAlt.action_label || undefined,
    actionUrl: dbAlt.action_url || undefined,
  };
}

export function useStores() {
  return useQuery({
    queryKey: ['stores'],
    queryFn: async (): Promise<Store[]> => {
      // Fetch stores
      const { data: storesData, error: storesError } = await supabase
        .from('stores')
        .select('*')
        .order('name');

      if (storesError) throw storesError;

      // Fetch codes
      const { data: codesData, error: codesError } = await supabase
        .from('discount_codes')
        .select('*')
        .eq('is_active', true)
        .gte('probability', 60);

      if (codesError) throw codesError;

      // Fetch alternatives
      const { data: alternativesData, error: alternativesError } = await supabase
        .from('alternatives')
        .select('*');

      if (alternativesError) throw alternativesError;

      // Map and combine data
      const stores: Store[] = (storesData as DbStore[]).map((store) => {
        const storeCodes = (codesData as DbDiscountCode[])
          .filter((c) => c.store_id === store.id)
          .map(mapDbCodeToCode);

        const storeAlternatives = (alternativesData as DbAlternative[])
          .filter((a) => a.store_id === store.id)
          .map(mapDbAlternativeToAlternative);

        return {
          id: store.id,
          name: store.name,
          category: store.category,
          logo: store.logo || undefined,
          lastUpdated: store.last_updated.split('T')[0],
          codes: storeCodes,
          alternatives: storeAlternatives,
        };
      });

      return stores;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSearchStores(query: string, stores: Store[]) {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return stores;

  return stores.filter(
    (store) =>
      store.name.toLowerCase().includes(lowerQuery) ||
      store.category.toLowerCase().includes(lowerQuery)
  );
}
