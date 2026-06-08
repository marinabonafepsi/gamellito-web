/**
 * Cliente Supabase para uso no browser (analytics, tracking).
 * Retorna null se as variáveis de ambiente não estiverem configuradas,
 * para que o site funcione sem banco em desenvolvimento.
 *
 * Para o Diário (auth + dados da família), use lib/supabase/client.ts
 * e lib/supabase/server.ts (DIA-002).
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return null;

  if (!_client) {
    _client = createClient(url, key);
  }

  return _client;
}
