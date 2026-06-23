/**
 * Analytics global do Gamellito.
 * Rastreia eventos de intenção, seção, navegação e identificação.
 *
 * Tabelas Supabase necessárias:
 * ─ intent_clicks (já existe)
 * ─ identified_users (criar):
 *
 *   create table identified_users (
 *     id          text        primary key,
 *     email       text        not null,
 *     name        text,
 *     created_at  timestamptz default now()
 *   );
 *   create unique index on identified_users(email);
 *   alter table identified_users enable row level security;
 *   create policy "allow_insert" on identified_users for insert with check (true);
 *   create policy "allow_update" on identified_users for update with check (true);
 */

import { getSupabaseClient } from "@/lib/supabase";

/* ─── Identidade anônima ──────────────────────────────── */

const KEY_UID        = "gml_uid";
const KEY_IDENTIFIED = "gml_identified";
const KEY_EMAIL      = "gml_email";
const KEY_NAME       = "gml_name";

export function getAnonymousId(): string {
  if (typeof window === "undefined") return "ssr";
  let id = localStorage.getItem(KEY_UID);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(KEY_UID, id);
  }
  return id;
}

export function isIdentified(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY_IDENTIFIED) === "true";
}

export function getIdentifiedEmail(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY_EMAIL);
}

export function getIdentifiedName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY_NAME);
}

function persistIdentity(name: string, email: string) {
  localStorage.setItem(KEY_IDENTIFIED, "true");
  localStorage.setItem(KEY_EMAIL, email);
  localStorage.setItem(KEY_NAME, name);
}

/* ─── Tipos de evento ────────────────────────────────── */

export type AnalyticsEvent =
  | "page_view"
  | "section_view"
  | "nav_click"
  | "game_interest"
  | "product_interest"
  | "fridge_click"
  | "snack_select"
  | "play_button"
  | "educator_guide_download"
  | "nursing_partnership_request"
  | "identify_modal_shown"
  | "identify_modal_dismissed"
  | "user_identified"
  | "user_signout"
  | "humor_marcado"
  | "avatar_changed"
  | "registro_salvo"
  | "novo_usuario"
  | "login"
  | "product_cta"
  | "game_play_click"
  | "ecosystem_cta_click";

/* ─── track() ─────────────────────────────────────────── */

export async function track(
  event: AnalyticsEvent,
  page: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    const userId = getAnonymousId();
    const email  = getIdentifiedEmail();
    const name   = getIdentifiedName();

    await supabase.from("intent_clicks").insert({
      event_type: event,
      page,
      metadata: {
        ...metadata,
        user_id: userId,
        ...(email ? { email, name } : {}),
      },
    });
  } catch {
    // Silencioso — nunca bloquear UX por falha de analytics
  }
}

/* ─── identifyUser() ──────────────────────────────────── */

export async function identifyUser(
  name: string,
  email: string
): Promise<void> {
  try {
    const supabase = getSupabaseClient();
    const userId   = getAnonymousId();

    if (supabase) {
      await supabase.from("identified_users").upsert(
        { id: userId, name, email },
        { onConflict: "email" }
      );
    }

    persistIdentity(name, email);

    await track("user_identified", window.location.pathname, { name, email });
  } catch {
    // Silencioso
  }
}

/* ─── trackPageView() ─────────────────────────────────── */

export function trackPageView(page: string) {
  track("page_view", page);
}

/* ─── useSectionTracking() ────────────────────────────── *
 * Hook utilitário: observa elementos com data-track-section
 * e dispara um evento "section_view" quando entram na tela.
 */
export function observeSections(pathname: string): () => void {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    return () => {};
  }

  const seen = new Set<string>();

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const section = (entry.target as HTMLElement).dataset.trackSection;
        if (section && !seen.has(section)) {
          seen.add(section);
          track("section_view", pathname, { section });
        }
      });
    },
    { threshold: 0.3 }
  );

  // Observa todos os elementos com data-track-section
  document.querySelectorAll("[data-track-section]").forEach((el) => {
    observer.observe(el);
  });

  return () => observer.disconnect();
}
