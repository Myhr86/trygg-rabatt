import { useState, useMemo } from 'react';
import { Header } from '@/components/Header';
import { SearchInput } from '@/components/SearchInput';
import { StoreCard } from '@/components/StoreCard';
import { StoreDetail } from '@/components/StoreDetail';
import { TrustIndicator } from '@/components/TrustIndicator';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

import { useStores, useSearchStores } from '@/hooks/useStores';
import { Store, UserContext } from '@/types/discount';
import { Loader2, Tag } from 'lucide-react';

const defaultContext: UserContext = {
  customerType: 'unknown',
  shoppingContext: 'unknown',
  priceContext: 'unknown',
  isStudent: false,
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [userContext, setUserContext] = useState<UserContext>(defaultContext);
  const [showOnlyWithCodes, setShowOnlyWithCodes] = useState(false);

  const { data: stores = [], isLoading, error } = useStores();
  const searchedStores = useSearchStores(searchQuery, stores);
  
  // Apply "has codes" filter
  const filteredStores = useMemo(() => {
    if (!showOnlyWithCodes) return searchedStores;
    return searchedStores.filter((store) => store.codes.length > 0);
  }, [searchedStores, showOnlyWithCodes]);

  const categories = useMemo(() => {
    const cats = new Set(filteredStores.map((s) => s.category));
    return Array.from(cats);
  }, [filteredStores]);
  
  const storesWithCodesCount = useMemo(() => {
    return stores.filter((s) => s.codes.length > 0).length;
  }, [stores]);

  if (selectedStore) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-6">
          <StoreDetail
            store={selectedStore}
            context={userContext}
            onContextChange={setUserContext}
            onBack={() => setSelectedStore(null)}
          />
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-6 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Laster butikker...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-6">
          <div className="text-center py-12">
            <p className="text-destructive">Kunne ikke laste butikker. Prøv igjen senere.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container py-6">
        {/* Hero section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3 text-balance">
            Rabattkoder du kan stole på
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto text-balance">
            Vi viser færre koder – men bare de som faktisk fungerer. Ingen spam, ingen gjetning.
          </p>
        </div>

        {/* Trust indicator */}
        <TrustIndicator />

        {/* Search and filter */}
        <div className="mb-8 space-y-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Søk etter butikk (f.eks. Zalando, Elkjøp...)"
          />
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border border-border">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              <Label htmlFor="show-codes-filter" className="text-sm font-medium cursor-pointer">
                Vis kun butikker med rabattkode
              </Label>
              <span className="text-xs text-muted-foreground">
                ({storesWithCodesCount} butikker)
              </span>
            </div>
            <Switch
              id="show-codes-filter"
              checked={showOnlyWithCodes}
              onCheckedChange={setShowOnlyWithCodes}
            />
          </div>
        </div>

        {/* Results */}
        {searchQuery ? (
          <div>
            <p className="text-sm text-muted-foreground mb-4">
              {filteredStores.length} {filteredStores.length === 1 ? 'butikk' : 'butikker'} funnet
            </p>
            <div className="space-y-3">
              {filteredStores.map((store) => (
                <StoreCard
                  key={store.id}
                  store={store}
                  onClick={() => setSelectedStore(store)}
                />
              ))}
            </div>
            {filteredStores.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  Ingen butikker matcher søket ditt
                </p>
              </div>
            )}
          </div>
        ) : (
          <div>
            {categories.map((category) => {
              const categoryStores = filteredStores.filter((s) => s.category === category);
              return (
                <div key={category} className="mb-8">
                  <h2 className="text-lg font-semibold text-foreground mb-3">
                    {category}
                  </h2>
                  <div className="space-y-3">
                    {categoryStores.map((store) => (
                      <StoreCard
                        key={store.id}
                        store={store}
                        onClick={() => setSelectedStore(store)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}


        {/* Footer info */}
        <footer className="mt-8 pt-8 border-t border-border">
          <div className="text-center text-sm text-muted-foreground space-y-2">
            <p>
              <strong className="text-foreground">Hvordan fungerer det?</strong>
            </p>
            <p className="max-w-lg mx-auto">
              Vi samler inn og analyserer data fra brukerrapporter, forum og sosiale medier for å estimere 
              sannsynligheten for at en kode fungerer. Vi viser kun koder med høy sannsynlighet.
            </p>
            <p className="text-xs mt-4">
              Sist oppdatert: 18. januar 2024 · Norske butikker
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
