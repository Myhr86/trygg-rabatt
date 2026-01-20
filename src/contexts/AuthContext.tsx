import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface SubscriptionStatus {
  subscribed: boolean;
  subscriptionEnd: string | null;
  billingInterval: 'month' | 'year' | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  subscription: SubscriptionStatus;
  checkSubscription: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<SubscriptionStatus>({
    subscribed: false,
    subscriptionEnd: null,
    billingInterval: null,
  });
  
  // Track if we're currently checking subscription to prevent duplicate calls
  const isCheckingRef = useRef(false);
  const lastCheckRef = useRef<number>(0);
  const MIN_CHECK_INTERVAL = 10000; // Minimum 10 seconds between checks

  const checkSubscription = async () => {
    // Prevent duplicate/rapid calls
    const now = Date.now();
    if (isCheckingRef.current || now - lastCheckRef.current < MIN_CHECK_INTERVAL) {
      return;
    }

    // Get current session
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    
    if (!currentSession) {
      setSubscription({ subscribed: false, subscriptionEnd: null, billingInterval: null });
      return;
    }

    isCheckingRef.current = true;
    lastCheckRef.current = now;

    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) {
        console.error('Error checking subscription:', error);
        return;
      }

      setSubscription({
        subscribed: data?.subscribed || false,
        subscriptionEnd: data?.subscription_end || null,
        billingInterval: data?.billing_interval || null,
      });
    } catch (err) {
      console.error('Failed to check subscription:', err);
    } finally {
      isCheckingRef.current = false;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);

      if (session?.user) {
        checkSubscription();
      }
    });

    // Set up auth state listener
    const { data: { subscription: authSubscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        if (session?.user && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          // Small delay to avoid race conditions
          setTimeout(() => {
            if (mounted) checkSubscription();
          }, 500);
        } else if (!session) {
          setSubscription({ subscribed: false, subscriptionEnd: null, billingInterval: null });
        }
      }
    );

    return () => {
      mounted = false;
      authSubscription.unsubscribe();
    };
  }, []);

  // Periodic subscription check (every 2 minutes, not every minute)
  useEffect(() => {
    if (!session) return;

    const interval = setInterval(() => {
      checkSubscription();
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, [session?.user?.id]); // Only re-run if user ID changes

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl },
    });
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSubscription({ subscribed: false, subscriptionEnd: null, billingInterval: null });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        subscription,
        checkSubscription,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
