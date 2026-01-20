import { useState } from 'react';
import { Copy, Check, ExternalLink, ShieldCheck, Crown, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DiscountCode } from '@/types/discount';
import { ProbabilityRing } from './ProbabilityRing';
import { ContextBadge } from './ContextBadge';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DiscountCodeCardProps {
  code: DiscountCode;
  storeName: string;
}

export function DiscountCodeCard({ code, storeName }: DiscountCodeCardProps) {
  const [copied, setCopied] = useState(false);
  const { user, subscription } = useAuth();

  const handleCopy = async () => {
    if (!subscription.subscribed) return;
    await navigator.clipboard.writeText(code.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isHighProbability = code.probability >= 80;
  const canAccessCode = user && subscription.subscribed;

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
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {code.context.map((ctx) => (
              <ContextBadge key={ctx} label={ctx} />
            ))}
          </div>

          <div className="flex items-center gap-3 mt-3 flex-wrap">
            {canAccessCode ? (
              <>
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
                  Sist sjekket {code.lastVerified}
                </span>
              </>
            ) : (
              <div className="flex items-center gap-3 w-full">
                <div className="flex items-center gap-2 px-4 py-2 rounded-md bg-muted/50 border border-border">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  <span className="font-mono text-sm text-muted-foreground blur-sm select-none">
                    ••••••••
                  </span>
                </div>
                
                <Button asChild size="sm" className="gap-1.5">
                  <Link to={user ? "/premium" : "/auth"}>
                    <Crown className="w-4 h-4" />
                    {user ? 'Bli Premium' : 'Logg inn'}
                  </Link>
                </Button>
                
                <span className="text-xs text-muted-foreground">
                  for å se koden
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
