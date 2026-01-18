import { ChevronRight, ShoppingBag } from 'lucide-react';
import { Store } from '@/types/discount';
import { cn } from '@/lib/utils';

interface StoreCardProps {
  store: Store;
  onClick: () => void;
}

export function StoreCard({ store, onClick }: StoreCardProps) {
  const hasWorkingCodes = store.codes.length > 0;
  const bestProbability = hasWorkingCodes
    ? Math.max(...store.codes.map((c) => c.probability))
    : 0;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full text-left p-4 rounded-lg border transition-all duration-200',
        'bg-card hover:bg-card/80 border-border hover:border-primary/30',
        'shadow-soft hover:shadow-soft-lg',
        'animate-fade-in group'
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent flex items-center justify-center">
          <ShoppingBag className="w-6 h-6 text-accent-foreground" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">{store.name}</h3>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
          <p className="text-sm text-muted-foreground">{store.category}</p>
          
          <div className="flex items-center gap-2 mt-1">
            {hasWorkingCodes ? (
              <>
                <span
                  className={cn(
                    'inline-flex items-center gap-1 text-xs font-medium',
                    bestProbability >= 80
                      ? 'text-trust-high'
                      : bestProbability >= 60
                      ? 'text-trust-medium'
                      : 'text-trust-low'
                  )}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-current" />
                  {store.codes.length} {store.codes.length === 1 ? 'kode' : 'koder'} tilgjengelig
                </span>
                <span className="text-xs text-muted-foreground">
                  · Opptil {bestProbability}% sjanse
                </span>
              </>
            ) : (
              <span className="text-xs text-muted-foreground">
                Ingen koder – se alternativer
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
}
