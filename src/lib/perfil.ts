import type { SupabaseClient } from "@supabase/supabase-js";

export const COINS_HUMOR    = 5;
export const COINS_REGISTRO = 10;

/** Garante que o perfil exista (idempotente). */
export async function upsertPerfil(supabase: SupabaseClient, userId: string) {
  await supabase
    .from("user_profiles")
    .upsert({ user_id: userId }, { onConflict: "user_id", ignoreDuplicates: true });
}

/** Adiciona coins atomicamente via RPC. */
export async function adicionarCoins(
  supabase: SupabaseClient,
  userId: string,
  quantidade: number
) {
  await supabase.rpc("incrementar_coins", {
    p_user_id: userId,
    p_quantidade: quantidade,
  });
}

/** Busca o saldo atual de coins do usuário. */
export async function buscarCoins(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const { data } = await supabase
    .from("user_profiles")
    .select("coins")
    .eq("user_id", userId)
    .single();
  return data?.coins ?? 0;
}

/** Registra um evento de produto para analytics interno. */
export async function trackProductEvent(
  supabase: SupabaseClient,
  event: string,
  userId: string | null,
  properties?: Record<string, unknown>
) {
  try {
    await supabase.from("product_events").insert({
      user_id: userId,
      event,
      properties: properties ?? {},
    });
  } catch {
    // Nunca bloquear o fluxo por falha de analytics
  }
}
