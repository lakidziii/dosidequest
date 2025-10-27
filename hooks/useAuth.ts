import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useUserStore } from '../stores/userStore';

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const { user, setUser, clearUser } = useUserStore();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  const signOut = async () => {
    await supabase.auth.signOut();
    clearUser();
  };

  return {
    user,
    loading,
    signOut,
  };
}