import { ArrowLeft, Clock, ShieldCheck } from 'lucide-react';
import { Store, UserContext } from '@/types/discount';
import { DiscountCodeCard } from './DiscountCodeCard';
import { NoCodesMessage } from './NoCodesMessage';
import { ContextFilter } from './ContextFilter';
import { filterCodesForContext } from '@/data/stores';

interface StoreDetailProps {
  store: Store;
  context: UserContext;
  onContextChange: (context: UserContext) => void;
  onBack: () => void;
}

export function StoreDetail({ store, context, onContextChange, onBack }: StoreDetailProps) {
  const filteredStore = filterCodesForContext(store, context);
  const hasCodes = filteredStore.codes.length > 0;

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{store.name}</h1>
          <p className="text-muted-foreground">{store.category}</p>
        </div>
      </div>

      {/* Trust banner */}
      <div className="flex items-center gap-2 p-3 rounded-lg bg-accent/50 border border-accent mb-6">
        <ShieldCheck className="w-5 h-5 text-primary" />
        <p className="text-sm text-foreground">
          Vi viser kun koder med høy sannsynlighet for å fungere
        </p>
      </div>

      {/* Context filter */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Tilpass til din situasjon
        </h3>
        <ContextFilter context={context} onChange={onContextChange} />
      </div>

      {/* Codes or no codes message */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">
            {hasCodes ? 'Tilgjengelige rabattkoder' : 'Rabattkoder'}
          </h3>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            Oppdatert {store.lastUpdated}
          </div>
        </div>

        {hasCodes ? (
          <div className="space-y-3">
            {filteredStore.codes.map((code) => (
              <DiscountCodeCard
                key={code.id}
                code={code}
                storeName={store.name}
              />
            ))}
          </div>
        ) : (
          <NoCodesMessage
            storeName={store.name}
            alternatives={store.alternatives}
          />
        )}

        {/* Show alternatives even when codes exist */}
        {hasCodes && store.alternatives && store.alternatives.length > 0 && (
          <div className="mt-6 pt-6 border-t border-border">
            <h4 className="text-sm font-medium text-foreground mb-3">
              Andre sparetips
            </h4>
            <div className="space-y-2">
              {store.alternatives.map((alt, index) => (
                <div
                  key={index}
                  className="text-sm text-muted-foreground p-2 rounded bg-muted/30"
                >
                  <span className="font-medium text-foreground">{alt.title}:</span>{' '}
                  {alt.description}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
