/**
 * Cliente Supabase para uso no browser (analytics, tracking).
 * Retorna null se as variáveis de ambiente não estiverem configuradas.
 * Para auth + dados do Diário, use @/lib/supabase/client (DIA-002).
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (_client) return _client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  _client = createClient(url, key);
  return _client;
}
