import { CheckCircle2 } from 'lucide-react';

export function TrustIndicator() {
  return (
    <div className="bg-accent/30 border border-accent rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div>
          <h3 className="font-medium text-foreground text-sm">Vårt løfte</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Vi viser kun rabattkoder med dokumentert høy suksessrate. Ingen spam, ingen uverifiserte koder, ingen clickbait.
          </p>
        </div>
      </div>
    </div>
  );
}
