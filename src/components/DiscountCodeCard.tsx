import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { DiscountCode } from '@/types/discount';
import { ProbabilityRing } from './ProbabilityRing';
import { ContextBadge } from './ContextBadge';
import { cn } from '@/lib/utils';

interface DiscountCodeCardProps {
  code: DiscountCode;
  storeName: string;
}

export function DiscountCodeCard({ code, storeName }: DiscountCodeCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group bg-card rounded-lg border border-border p-4 shadow-soft hover:shadow-soft-lg transition-all duration-200 animate-fade-in">
      <div className="flex items-start gap-4">
        <ProbabilityRing
          probability={code.probability}
          trustLevel={code.trustLevel}
          size="md"
        />
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium text-foreground">{code.description}</p>
              {code.savings && (
                <p className="text-lg font-semibold text-primary mt-0.5">
                  Spar {code.savings}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {code.context.map((ctx) => (
              <ContextBadge key={ctx} label={ctx} />
            ))}
          </div>

          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={handleCopy}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-md font-mono text-sm font-medium transition-all duration-200',
                copied
                  ? 'bg-trust-high/10 text-trust-high'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Kopiert!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  {code.code}
                </>
              )}
            </button>
            
            <span className="text-xs text-muted-foreground">
              Verifisert {code.lastVerified}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
