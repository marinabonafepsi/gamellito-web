/**
 * Helpers de sessão do Diário do Gamellito.
 * A família é identificada pelo user.id do Supabase Auth,
 * que serve diretamente como familia_id (RLS garante isolamento).
 */
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

/** Retorna a sessão ativa ou null (sem redirecionar). */
export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

/** Retorna o usuário autenticado ou redireciona para /diario/login. */
export async function requireAuth() {
  const session = await getSession();
  if (!session) redirect("/diario/login");
  return session.user;
}

/** familia_id = user.id do Supabase Auth (UUID gerado na criação da conta). */
export async function getFamiliaId(): Promise<string | null> {
  const session = await getSession();
  return session?.user.id ?? null;
}
