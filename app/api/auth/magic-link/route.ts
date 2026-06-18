import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "E-mail obrigatório." }, { status: 400 });
  }

  const supabase = await createAdminClient();

  const origin = request.headers.get("origin") ?? process.env.NEXT_PUBLIC_SITE_URL ?? "";

  const { data, error } = await supabase.auth.admin.generateLink({
    type: "magiclink",
    email: email.trim().toLowerCase(),
    options: { redirectTo: `${origin}/diario` },
  });

  if (error || !data?.properties?.action_link) {
    return NextResponse.json({ error: error?.message ?? "Erro ao gerar link." }, { status: 500 });
  }

  const link = data.properties.action_link;

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json({ error: "Serviço de e-mail não configurado." }, { status: 500 });
  }

  const fromName = "Diário do Gamellito";
  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "diario@gamellito.com.br";

  const emailRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${fromName} <${fromEmail}>`,
      to: email.trim().toLowerCase(),
      subject: "Seu link de acesso ao Diário do Gamellito",
      html: `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#FFF3C9;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF3C9;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:480px;background:#ffffff;border:3px solid #2B2233;border-radius:24px;box-shadow:4px 4px 0 #2B2233;padding:40px 32px;" cellpadding="0" cellspacing="0">
        <tr><td align="center" style="padding-bottom:24px;">
          <span style="font-size:48px;">📒</span>
          <h1 style="margin:12px 0 4px;font-size:22px;font-weight:bold;color:#2B2233;">Diário do Gamellito</h1>
          <p style="margin:0;font-size:14px;color:#6b5f76;">Seu link de acesso chegou!</p>
        </td></tr>
        <tr><td style="padding-bottom:24px;">
          <p style="margin:0 0 16px;font-size:15px;color:#2B2233;line-height:1.6;">
            Clique no botão abaixo para entrar no diário. O link é válido por <strong>1 hora</strong> e pode ser usado apenas uma vez.
          </p>
          <a href="${link}" style="display:block;text-align:center;background:#F26A00;color:#ffffff;font-weight:bold;font-size:16px;padding:14px 24px;border-radius:999px;border:3px solid #2B2233;box-shadow:4px 4px 0 #2B2233;text-decoration:none;">
            Entrar no Diário →
          </a>
        </td></tr>
        <tr><td style="border-top:2px solid #2B2233;padding-top:20px;">
          <p style="margin:0;font-size:12px;color:#9b8a9e;line-height:1.5;">
            Se você não solicitou este link, ignore este e-mail com segurança.<br>
            Este diário ajuda a <strong>organizar registros</strong> para apresentar à equipe de saúde. Não substitui orientação médica.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
      `,
    }),
  });

  if (!emailRes.ok) {
    const err = await emailRes.json().catch(() => ({}));
    console.error("Resend error:", err);
    return NextResponse.json({ error: "Erro ao enviar e-mail. Tente novamente." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
