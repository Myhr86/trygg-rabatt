import { Heart } from 'lucide-react';

export function AffiliateDisclosure() {
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border/50">
      <Heart className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
      <div className="text-sm text-muted-foreground">
        <p>
          <strong className="text-foreground">Slik tjener vi penger:</strong>{' '}
          Vi får en liten provisjon hvis du handler via noen av lenkene våre – uten at det koster deg noe ekstra.
        </p>
        <p className="mt-1">
          Vi viser alltid det beste alternativet for deg først, uavhengig av om vi tjener på det.
        </p>
      </div>
    </div>
  );
}
