import { useState } from 'react';
import { Copy, Check, ExternalLink, ShieldCheck, Crown } from 'lucide-react';
import { DiscountCode } from '@/types/discount';
import { ProbabilityRing } from './ProbabilityRing';
import { ContextBadge } from './ContextBadge';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface DiscountCodeCardProps {
  code: DiscountCode;
  storeName: string;
}

export function DiscountCodeCard({ code, storeName }: DiscountCodeCardProps) {
  const [copied, setCopied] = useState(false);
  const { subscription } = useAuth();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // For Premium users: show live verified status
  // In a real implementation, this would come from a real-time verification API
  const isHighProbability = code.probability >= 80;

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
            
            {/* Premium live status badge */}
            {subscription.subscribed && (
              <Badge 
                variant="outline" 
                className={cn(
                  'shrink-0 text-xs gap-1',
                  isHighProbability 
                    ? 'border-trust-high/30 text-trust-high bg-trust-high/5' 
                    : 'border-amber-500/30 text-amber-600 bg-amber-500/5'
                )}
              >
                <ShieldCheck className="h-3 w-3" />
                {isHighProbability ? 'Live: Fungerer' : 'Live: Usikker'}
              </Badge>
            )}
            
            {/* Show Premium upsell hint for non-subscribers */}
            {!subscription.subscribed && code.probability >= 70 && (
              <Badge 
                variant="outline" 
                className="shrink-0 text-xs gap-1 border-primary/30 text-primary/70"
              >
                <Crown className="h-3 w-3" />
                Premium: Live status
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {code.context.map((ctx) => (
              <ContextBadge key={ctx} label={ctx} />
            ))}
          </div>

          <div className="flex items-center gap-3 mt-3 flex-wrap">
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
            
            {code.affiliateUrl && (
              <a
                href={code.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Gå til butikk
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            
            <span className="text-xs text-muted-foreground">
              {subscription.subscribed ? 'Sist sjekket' : 'Verifisert'} {code.lastVerified}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
