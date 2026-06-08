/**
 * Helpers de sessão do Diário do Gamellito.
 * familia_id = user.id do Supabase Auth (RLS garante isolamento).
 */
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) redirect("/diario/login");
  return session.user;
}

export async function getFamiliaId(): Promise<string | null> {
  const session = await getSession();
  return session?.user.id ?? null;
}
