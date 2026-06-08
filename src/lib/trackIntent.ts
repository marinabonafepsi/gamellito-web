/**
 * Registra uma intenção de clique no Supabase.
 * Usado como "fake door" para medir interesse real do usuário.
 *
 * Tabela necessária no Supabase:
 * ─────────────────────────────────────────────────────
 * create table intent_clicks (
 *   id          uuid        default gen_random_uuid() primary key,
 *   event_type  text        not null,
 *   page        text        not null,
 *   metadata    jsonb,
 *   created_at  timestamptz default now()
 * );
 *
 * -- Política de RLS para inserção pública:
 * alter table intent_clicks enable row level security;
 * create policy "allow_insert" on intent_clicks for insert with check (true);
 * ─────────────────────────────────────────────────────
 */

import { getSupabaseClient } from "@/lib/supabase";

export type IntentEvent =
  | "fridge_click"
  | "snack_select"
  | "play_button"
  | "educator_guide_download"
  | "nursing_partnership_request";

export async function trackIntent(
  event: IntentEvent,
  page: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return; // silencioso quando env vars não configuradas

    await supabase.from("intent_clicks").insert({
      event_type: event,
      page,
      metadata: metadata ?? null,
    });
  } catch {
    // Silencia erros de tracking — nunca bloquear UX por falha de analytics
  }
}
