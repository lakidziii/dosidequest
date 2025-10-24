import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments, Tabs } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Session } from '@supabase/supabase-js';
import '../global.css';

// Vytvoření QueryClient instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minut
      gcTime: 1000 * 60 * 10, // 10 minut
    },
  },
});

function RootLayoutNav() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Získej aktuální session při spuštění
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // Poslouchej změny auth stavu
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === 'auth';

    if (session && inAuthGroup) {
      // Uživatel je přihlášený ale je na auth stránce -> přesměruj na home
      router.replace('/(tabs)/quests');
    } else if (!session && !inAuthGroup) {
      // Uživatel není přihlášený ale není na auth stránce -> přesměruj na auth
      router.replace('/auth');
    }
  }, [session, segments, isLoading]);

  return (
    <Stack>
      <Stack.Screen 
        name="(tabs)" 
        options={{ 
          headerShown: false 
        }} 
      />
      <Stack.Screen 
        name="auth" 
        options={{ 
          title: 'Přihlášení',
          headerShown: false 
        }} 
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <RootLayoutNav />
    </QueryClientProvider>
  );
}