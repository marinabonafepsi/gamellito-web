import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/email/welcome";

const VERSAO_CONSENTIMENTO = "1.0";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const userAgent = request.headers.get("user-agent") ?? null;

  const { error } = await supabase
    .from("consentimentos")
    .insert({
      user_id: user.id,
      versao: VERSAO_CONSENTIMENTO,
      user_agent: userAgent,
    });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Dispara email de boas-vindas e registra a interação (não bloqueia a resposta)
  if (user.email) {
    sendWelcomeEmail(user.email).then(async (result) => {
      await supabase.from("email_logs").insert({
        user_id: user.id,
        email:   user.email,
        tipo:    "boas_vindas",
        status:  result.ok ? "enviado" : "erro",
        erro:    result.error ?? null,
      });
    }).catch(() => {/* falha silenciosa — não afeta o login */});
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set("diario_consentido", "1", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
    path: "/",
  });

  return response;
}

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ consentido: false });
  }

  const { data } = await supabase
    .from("consentimentos")
    .select("id")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  return NextResponse.json({ consentido: !!data });
}
