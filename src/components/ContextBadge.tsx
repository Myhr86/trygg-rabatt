import { cn } from '@/lib/utils';

interface ContextBadgeProps {
  label: string;
  variant?: 'default' | 'subtle';
}

export function ContextBadge({ label, variant = 'default' }: ContextBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border transition-colors',
        variant === 'default'
          ? 'bg-accent text-accent-foreground border-transparent'
          : 'bg-transparent text-muted-foreground border-border'
      )}
    >
      {label}
    </span>
  );
}
