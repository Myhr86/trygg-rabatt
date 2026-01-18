import { ArrowRight, Mail, GraduationCap, Clock, Coins, Store } from 'lucide-react';
import { Alternative } from '@/types/discount';
import { cn } from '@/lib/utils';

interface AlternativeCardProps {
  alternative: Alternative;
}

const iconMap = {
  'cheaper-store': Store,
  'newsletter': Mail,
  'student': GraduationCap,
  'wait-for-sale': Clock,
  'cashback': Coins,
};

export function AlternativeCard({ alternative }: AlternativeCardProps) {
  const Icon = iconMap[alternative.type];

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-surface-subtle border border-border/50 animate-fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
        <Icon className="w-4 h-4 text-accent-foreground" />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-foreground">{alternative.title}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{alternative.description}</p>
        
        {alternative.actionLabel && alternative.actionUrl && (
          <a
            href={alternative.actionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center gap-1 text-sm font-medium text-primary mt-2',
              'hover:underline underline-offset-2'
            )}
          >
            {alternative.actionLabel}
            <ArrowRight className="w-3 h-3" />
          </a>
        )}
      </div>
    </div>
  );
}
