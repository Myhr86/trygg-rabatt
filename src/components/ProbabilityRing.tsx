import { cn } from '@/lib/utils';
import { TrustLevel } from '@/types/discount';

interface ProbabilityRingProps {
  probability: number;
  trustLevel: TrustLevel;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function ProbabilityRing({
  probability,
  trustLevel,
  size = 'md',
  showLabel = true,
}: ProbabilityRingProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const strokeWidth = size === 'sm' ? 3 : size === 'md' ? 4 : 5;
  const radius = size === 'sm' ? 20 : size === 'md' ? 28 : 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (probability / 100) * circumference;

  const colorClasses = {
    high: 'text-trust-high',
    medium: 'text-trust-medium',
    low: 'text-trust-low',
  };

  const strokeColors = {
    high: 'stroke-trust-high',
    medium: 'stroke-trust-medium',
    low: 'stroke-trust-low',
  };

  return (
    <div className="flex flex-col items-center gap-1">
      <div className={cn('relative', sizeClasses[size])}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
          {/* Background circle */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/50"
          />
          {/* Progress circle */}
          <circle
            cx="40"
            cy="40"
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className={cn('transition-all duration-500', strokeColors[trustLevel])}
            style={{
              strokeDasharray: circumference,
              strokeDashoffset,
            }}
          />
        </svg>
        <div
          className={cn(
            'absolute inset-0 flex items-center justify-center font-semibold',
            textSizeClasses[size],
            colorClasses[trustLevel]
          )}
        >
          {probability}%
        </div>
      </div>
      {showLabel && (
        <span className="text-xs text-muted-foreground">sannsynlighet</span>
      )}
    </div>
  );
}
