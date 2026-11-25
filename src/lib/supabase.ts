import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";
import { secureStorage } from "@/services/secureStorage";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Konfigurasi Supabase belum lengkap. Periksa file .env.");
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: secureStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});