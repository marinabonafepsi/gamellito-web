import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { adicionarCoins, trackProductEvent, upsertPerfil, COINS_HUMOR } from "@/lib/perfil";

// GET /api/humor → humor de hoje
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const hoje = new Date().toISOString().slice(0, 10);
  const { data } = await supabase
    .from("humor_logs")
    .select("humor, coins_ganhos")
    .eq("user_id", user.id)
    .eq("data_local", hoje)
    .maybeSingle();

  return NextResponse.json(data ?? null);
}

// POST /api/humor → registra humor do dia + dá coins
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Não autenticado." }, { status: 401 });

  const body = await request.json();
  const humores = ["feliz", "animado", "raiva", "medo", "normal"] as const;
  type Humor = typeof humores[number];

  if (!humores.includes(body.humor as Humor)) {
    return NextResponse.json({ error: "Humor inválido." }, { status: 400 });
  }

  const hoje = new Date().toISOString().slice(0, 10);

  // Upsert: permite trocar o humor do dia
  const { data, error } = await supabase
    .from("humor_logs")
    .upsert(
      { user_id: user.id, humor: body.humor, coins_ganhos: COINS_HUMOR, data_local: hoje },
      { onConflict: "user_id,data_local" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Dá coins apenas uma vez por dia (se está inserindo pela primeira vez hoje)
  const jaExistia = body.ja_registrado_hoje === true;
  if (!jaExistia) {
    await upsertPerfil(supabase, user.id);
    await adicionarCoins(supabase, user.id, COINS_HUMOR);
  }

  await trackProductEvent(supabase, "humor_marcado", user.id, {
    humor: body.humor,
    ja_existia: jaExistia,
    coins: jaExistia ? 0 : COINS_HUMOR,
  });

  return NextResponse.json({ ...data, coins_adicionados: jaExistia ? 0 : COINS_HUMOR });
}
