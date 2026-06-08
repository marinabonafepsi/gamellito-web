import { createClient, SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

/**
 * Retorna o client Supabase de forma lazy.
 * Retorna null se as env vars não estiverem configuradas
 * (ex: durante build estático ou em desenvolvimento sem .env.local).
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  _client = createClient(url, key);
  return _client;
}
