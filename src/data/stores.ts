import { Store, UserContext } from '@/types/discount';

export const stores: Store[] = [
  {
    id: 'zalando',
    name: 'Zalando',
    category: 'Klær & sko',
    lastUpdated: '2024-01-18',
    codes: [
      {
        id: 'z1',
        code: 'NYKUNDE15',
        description: '15% rabatt på første ordre',
        probability: 92,
        trustLevel: 'high',
        context: ['Ny kunde', 'Min. 500 kr'],
        lastVerified: '2024-01-17',
        savings: '15%',
      },
      {
        id: 'z2',
        code: 'ZAPP10',
        description: '10% ekstra i appen',
        probability: 78,
        trustLevel: 'high',
        context: ['Kun i app', 'Fullpris varer'],
        lastVerified: '2024-01-16',
        savings: '10%',
      },
    ],
    alternatives: [
      {
        type: 'newsletter',
        title: 'Nyhetsbrev-rabatt',
        description: 'Meld deg på nyhetsbrevet for 10% på første kjøp.',
      },
      {
        type: 'wait-for-sale',
        title: 'Venter på salg',
        description: 'Zalando har ofte 20-30% salg i slutten av sesongen.',
      },
    ],
  },
  {
    id: 'elkjop',
    name: 'Elkjøp',
    category: 'Elektronikk',
    lastUpdated: '2024-01-18',
    codes: [
      {
        id: 'e1',
        code: 'STUDENT10',
        description: '10% studentrabatt',
        probability: 95,
        trustLevel: 'high',
        context: ['Student', 'Verifisering kreves'],
        lastVerified: '2024-01-18',
        savings: '10%',
      },
    ],
    alternatives: [
      {
        type: 'cheaper-store',
        title: 'Prissammenligning',
        description: 'Sjekk Prisjakt.no – Elkjøp matcher ofte laveste pris.',
        actionLabel: 'Gå til Prisjakt',
        actionUrl: 'https://prisjakt.no',
      },
      {
        type: 'cashback',
        title: 'Vipps cashback',
        description: 'Få 2% tilbake via Vipps når du handler.',
      },
    ],
  },
  {
    id: 'hm',
    name: 'H&M',
    category: 'Klær',
    lastUpdated: '2024-01-17',
    codes: [
      {
        id: 'h1',
        code: 'MEDLEM20',
        description: '20% for H&M-medlemmer',
        probability: 85,
        trustLevel: 'high',
        context: ['Gratis medlemskap', 'Fullpris'],
        lastVerified: '2024-01-17',
        savings: '20%',
      },
    ],
    alternatives: [
      {
        type: 'newsletter',
        title: 'Bli medlem gratis',
        description: 'H&M-medlemmer får jevnlige rabatter og tidlig tilgang til salg.',
      },
    ],
  },
  {
    id: 'komplett',
    name: 'Komplett',
    category: 'Elektronikk',
    lastUpdated: '2024-01-18',
    codes: [],
    alternatives: [
      {
        type: 'cheaper-store',
        title: 'Sammenlign priser',
        description: 'Komplett har sjelden rabattkoder. Bruk Prisjakt for beste pris.',
        actionLabel: 'Prisjakt',
        actionUrl: 'https://prisjakt.no',
      },
      {
        type: 'wait-for-sale',
        title: 'Black Week',
        description: 'Komplett har gode tilbud under Black Week i november.',
      },
    ],
  },
  {
    id: 'boozt',
    name: 'Boozt',
    category: 'Klær & sko',
    lastUpdated: '2024-01-18',
    codes: [
      {
        id: 'b1',
        code: 'VELKOMST15',
        description: '15% på første ordre',
        probability: 88,
        trustLevel: 'high',
        context: ['Ny kunde', 'Ikke på salg'],
        lastVerified: '2024-01-18',
        savings: '15%',
      },
    ],
    alternatives: [
      {
        type: 'newsletter',
        title: 'Nyhetsbrev',
        description: 'Få varsler om flash sales og eksklusive tilbud.',
      },
    ],
  },
  {
    id: 'apotek1',
    name: 'Apotek 1',
    category: 'Helse & skjønnhet',
    lastUpdated: '2024-01-17',
    codes: [
      {
        id: 'a1',
        code: 'KUNDEKLUBB',
        description: 'Doble poeng for klubbmedlemmer',
        probability: 75,
        trustLevel: 'medium',
        context: ['Klubbmedlem', 'Kampanjeperiode'],
        lastVerified: '2024-01-15',
        savings: '2x poeng',
      },
    ],
    alternatives: [
      {
        type: 'student',
        title: 'Studentrabatt',
        description: 'Vis studentbevis i butikk for 10% rabatt.',
      },
    ],
  },
];

export function filterCodesForContext(store: Store, context: UserContext): Store {
  const filteredCodes = store.codes.filter((code) => {
    // Filter based on customer type
    if (code.context.some((c) => c.toLowerCase().includes('ny kunde')) && context.customerType === 'existing') {
      return false;
    }

    // Filter based on shopping context
    if (code.context.some((c) => c.toLowerCase().includes('kun i app')) && context.shoppingContext === 'browser') {
      return false;
    }

    // Filter based on student status
    if (code.context.some((c) => c.toLowerCase().includes('student')) && !context.isStudent) {
      return false;
    }

    // Only show codes with decent probability
    if (code.probability < 60) {
      return false;
    }

    return true;
  });

  return {
    ...store,
    codes: filteredCodes.slice(0, 3), // Max 3 codes
  };
}

export function searchStores(query: string): Store[] {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return stores;
  
  return stores.filter(
    (store) =>
      store.name.toLowerCase().includes(lowerQuery) ||
      store.category.toLowerCase().includes(lowerQuery)
  );
}
