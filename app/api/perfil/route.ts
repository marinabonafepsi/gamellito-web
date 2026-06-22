import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buscarCoins, upsertPerfil } from "@/lib/perfil";

// GET /api/perfil → { coins }
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  await upsertPerfil(supabase, user.id);
  const coins = await buscarCoins(supabase, user.id);
  return NextResponse.json({ coins });
}
