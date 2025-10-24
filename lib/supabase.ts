import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const SUPABASE_URL = 'https://ccyibjjioovtthhsktko.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjeWliamppb292dHRoaHNrdGtvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyNDYyMzQsImV4cCI6MjA3NjgyMjIzNH0.l1Ow17srp70W7564rZqHv_Fgume0ByhkKVpwCDVNTzk';

// Bezpečné úložiště pro session tokeny s podporou velkých hodnot
const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    try {
      // Zkusíme získat počet částí
      const chunksCount = await SecureStore.getItemAsync(`${key}_chunks`);
      
      if (chunksCount) {
        // Sestavíme hodnotu z částí
        const count = parseInt(chunksCount);
        let value = '';
        for (let i = 0; i < count; i++) {
          const chunk = await SecureStore.getItemAsync(`${key}_${i}`);
          if (chunk) value += chunk;
        }
        return value;
      } else {
        // Normální získání hodnoty
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.warn('SecureStore getItem error:', error);
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      // Pokud je hodnota příliš velká, rozdělíme ji na části
      if (value.length > 2000) {
        const chunks = [];
        for (let i = 0; i < value.length; i += 2000) {
          chunks.push(value.substring(i, i + 2000));
        }
        
        // Uložíme počet částí
        await SecureStore.setItemAsync(`${key}_chunks`, chunks.length.toString());
        
        // Uložíme každou část
        for (let i = 0; i < chunks.length; i++) {
          await SecureStore.setItemAsync(`${key}_${i}`, chunks[i]);
        }
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.warn('SecureStore setItem error:', error);
    }
  },
  removeItem: async (key: string) => {
    try {
      // Zkusíme získat počet částí
      const chunksCount = await SecureStore.getItemAsync(`${key}_chunks`);
      
      if (chunksCount) {
        // Smažeme všechny části
        const count = parseInt(chunksCount);
        for (let i = 0; i < count; i++) {
          await SecureStore.deleteItemAsync(`${key}_${i}`);
        }
        await SecureStore.deleteItemAsync(`${key}_chunks`);
      } else {
        // Smažeme normální klíč
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.warn('SecureStore removeItem error:', error);
    }
  },
};

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
