import { Info } from 'lucide-react';
import { Alternative } from '@/types/discount';
import { AlternativeCard } from './AlternativeCard';

interface NoCodesMessageProps {
  storeName: string;
  alternatives?: Alternative[];
}

export function NoCodesMessage({ storeName, alternatives }: NoCodesMessageProps) {
  return (
    <div className="animate-fade-in">
      <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 border border-border">
        <Info className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-foreground">
            Ingen verifiserte rabattkoder for {storeName} akkurat nå
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Vi viser kun koder vi er trygge på at fungerer. Bedre å spare litt sikkert enn å teste mange som ikke virker.
          </p>
        </div>
      </div>

      {alternatives && alternatives.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-foreground mb-3">
            Andre måter å spare på:
          </h4>
          <div className="space-y-2">
            {alternatives.map((alt, index) => (
              <AlternativeCard key={index} alternative={alt} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
