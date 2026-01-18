import { UserContext } from '@/types/discount';
import { cn } from '@/lib/utils';

interface ContextFilterProps {
  context: UserContext;
  onChange: (context: UserContext) => void;
}

export function ContextFilter({ context, onChange }: ContextFilterProps) {
  const options = [
    {
      key: 'customerType',
      label: 'Kundetype',
      choices: [
        { value: 'new', label: 'Ny kunde' },
        { value: 'existing', label: 'Eksisterende' },
        { value: 'unknown', label: 'Vet ikke' },
      ],
    },
    {
      key: 'shoppingContext',
      label: 'Handler via',
      choices: [
        { value: 'browser', label: 'Nettleser' },
        { value: 'app', label: 'App' },
        { value: 'unknown', label: 'Vet ikke' },
      ],
    },
  ];

  return (
    <div className="space-y-4">
      {options.map((option) => (
        <div key={option.key}>
          <label className="text-sm font-medium text-muted-foreground mb-2 block">
            {option.label}
          </label>
          <div className="flex flex-wrap gap-2">
            {option.choices.map((choice) => (
              <button
                key={choice.value}
                onClick={() =>
                  onChange({
                    ...context,
                    [option.key]: choice.value,
                  })
                }
                className={cn(
                  'px-3 py-1.5 text-sm rounded-md border transition-all duration-200',
                  context[option.key as keyof UserContext] === choice.value
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-card text-foreground border-border hover:border-primary/50'
                )}
              >
                {choice.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={context.isStudent}
            onChange={(e) =>
              onChange({
                ...context,
                isStudent: e.target.checked,
              })
            }
            className="w-4 h-4 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
          />
          <span className="text-sm text-foreground">Jeg er student</span>
        </label>
      </div>
    </div>
  );
}
