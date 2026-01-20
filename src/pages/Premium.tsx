import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { STRIPE_PRICES } from '@/lib/stripe-config';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Loader2, Shield, Clock, Zap, ArrowLeft, Settings } from 'lucide-react';
import { toast } from 'sonner';

const Premium = () => {
  const navigate = useNavigate();
  const { user, subscription, checkSubscription } = useAuth();
  const [loadingPrice, setLoadingPrice] = useState<string | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);

  const handleCheckout = async (priceId: string) => {
    if (!user) {
      navigate('/auth');
      return;
    }

    setLoadingPrice(priceId);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { priceId },
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Kunne ikke starte betalingsprosessen');
    } finally {
      setLoadingPrice(null);
    }
  };

  const handleManageSubscription = async () => {
    setLoadingPortal(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (err) {
      console.error('Portal error:', err);
      toast.error('Kunne ikke åpne abonnementsportalen');
    } finally {
      setLoadingPortal(false);
    }
  };

  const features = [
    {
      icon: Shield,
      title: 'Live kode-verifisering',
      description: 'Se om koder faktisk fungerer akkurat nå – ikke bare sannsynlighet',
    },
    {
      icon: Clock,
      title: 'Sanntidsstatus',
      description: 'Tidsstempel for sist bekreftet fungerende',
    },
    {
      icon: Zap,
      title: 'Prioriterte oppdateringer',
      description: 'Få status raskere enn gratisbrukere',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-6 max-w-4xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Tilbake
        </Button>

        <div className="text-center mb-8">
          <Badge className="mb-3 bg-green-600 hover:bg-green-700">
            14 dager gratis prøveperiode
          </Badge>
          <h1 className="text-3xl font-bold text-foreground mb-3">
            Slippe usikkerhet. Spare tid.
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            For deg som vil vite at koden fungerer før du prøver den – ikke etterpå.
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {features.map((feature, index) => (
            <Card key={index} className="border-border/50">
              <CardContent className="pt-6">
                <feature.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Current subscription status */}
        {subscription.subscribed && (
          <Card className="mb-8 border-primary/30 bg-primary/5">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Check className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-foreground">Du har Premium!</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {subscription.billingInterval === 'year' ? 'Årlig' : 'Månedlig'} abonnement
                    {subscription.subscriptionEnd && (
                      <> · Fornyes {new Date(subscription.subscriptionEnd).toLocaleDateString('nb-NO')}</>
                    )}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleManageSubscription}
                  disabled={loadingPortal}
                >
                  {loadingPortal ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Settings className="h-4 w-4 mr-2" />
                  )}
                  Administrer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Pricing cards */}
        {!subscription.subscribed && (
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            {/* Monthly */}
            <Card className="relative border-border">
              <CardHeader>
                <CardTitle className="text-lg">Månedlig</CardTitle>
                <CardDescription>Fleksibelt, avbryt når som helst</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-foreground">
                    {STRIPE_PRICES.monthly.amount} kr
                  </span>
                  <span className="text-muted-foreground">/mnd</span>
                </div>
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => handleCheckout(STRIPE_PRICES.monthly.priceId)}
                  disabled={loadingPrice !== null}
                >
                  {loadingPrice === STRIPE_PRICES.monthly.priceId ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Prøv 14 dager gratis
                </Button>
              </CardContent>
            </Card>

            {/* Yearly */}
            <Card className="relative border-primary">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">
                  {STRIPE_PRICES.yearly.savings}
                </Badge>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">Årlig</CardTitle>
                <CardDescription>Best verdi for pengene</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-foreground">
                    {STRIPE_PRICES.yearly.amount} kr
                  </span>
                  <span className="text-muted-foreground">/år</span>
                </div>
                <Button
                  className="w-full"
                  onClick={() => handleCheckout(STRIPE_PRICES.yearly.priceId)}
                  disabled={loadingPrice !== null}
                >
                  {loadingPrice === STRIPE_PRICES.yearly.priceId ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Prøv 14 dager gratis
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Trust note */}
        <p className="text-center text-sm text-muted-foreground">
          Prøv 14 dager gratis. Ingen betaling før prøveperioden er over. Avbryt når som helst.
        </p>
      </main>
    </div>
  );
};

export default Premium;
