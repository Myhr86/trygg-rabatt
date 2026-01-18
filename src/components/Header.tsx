import { ShieldCheck } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-foreground">Trygg Rabatt</span>
          </div>
          
          <p className="hidden sm:block text-sm text-muted-foreground">
            Færre koder – men de som fungerer
          </p>
        </div>
      </div>
    </header>
  );
}
