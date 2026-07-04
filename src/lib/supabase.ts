import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ??
  "https://dxekeerwrhpqmdlqrciv.supabase.co";
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

/**
 * null when VITE_SUPABASE_ANON_KEY is not set — the app then runs fully on
 * mock data, so a missing key never breaks local development.
 */
export const supabase: SupabaseClient | null = anonKey
  ? createClient(url, anonKey)
  : null;

export const isSupabaseConfigured = Boolean(anonKey);
