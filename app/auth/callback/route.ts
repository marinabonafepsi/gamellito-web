import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { upsertPerfil, trackProductEvent } from "@/lib/perfil";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/diario";

  if (code) {
    const supabase = await createClient();
    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // Cria perfil se for a primeira vez
      await upsertPerfil(supabase, data.user.id);

      // Detecta se é novo usuário (conta criada há menos de 30s)
      const criadoEm = new Date(data.user.created_at).getTime();
      const isNovo   = Date.now() - criadoEm < 30_000;

      await trackProductEvent(supabase, isNovo ? "novo_usuario" : "login", data.user.id, {
        email:    data.user.email,
        provider: data.user.app_metadata?.provider ?? "email",
      });

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/diario/login?erro=auth`);
}
