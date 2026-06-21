const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gamellitoltda.com.br";

export function buildWelcomeEmail(email: string): { subject: string; html: string } {
  const subject = "Bem-vindo(a) ao Diário do Gamellito! 📒";

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#FFF3C9;font-family:'Nunito',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF3C9;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;" cellpadding="0" cellspacing="0">

        <!-- Header -->
        <tr><td align="center" style="padding-bottom:24px;">
          <span style="font-size:52px;">📒</span>
        </td></tr>

        <!-- Card principal -->
        <tr><td style="background:#ffffff;border:3px solid #2B2233;border-radius:24px;box-shadow:4px 4px 0 #2B2233;padding:40px 36px;">

          <h1 style="margin:0 0 8px;font-size:26px;font-weight:800;color:#2B2233;line-height:1.2;">
            Bem-vindo(a) ao Diário do Gamellito!
          </h1>
          <p style="margin:0 0 24px;font-size:15px;color:#6b5f76;line-height:1.6;">
            Sua conta está pronta. Agora você pode registrar as glicemias e chegar à consulta com tudo organizado.
          </p>

          <!-- Separador decorativo -->
          <div style="display:flex;gap:6px;margin-bottom:28px;">
            <span style="width:14px;height:14px;border-radius:50%;background:#EE2B2B;border:2px solid #2B2233;display:inline-block;"></span>
            <span style="width:14px;height:14px;border-radius:50%;background:#37B6E6;border:2px solid #2B2233;display:inline-block;"></span>
            <span style="width:14px;height:14px;border-radius:50%;background:#8DC63F;border:2px solid #2B2233;display:inline-block;"></span>
            <span style="width:14px;height:14px;border-radius:50%;background:#FFC400;border:2px solid #2B2233;display:inline-block;"></span>
          </div>

          <!-- O que fazer agora -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr>
              <td style="background:#FFF3C9;border:2px solid #2B2233;border-radius:16px;padding:20px 24px;">
                <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#6E59C9;text-transform:uppercase;letter-spacing:0.08em;">
                  O que fazer agora
                </p>
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="padding:4px 0;font-size:14px;color:#2B2233;">📝&nbsp; Registre a primeira glicemia</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;font-size:14px;color:#2B2233;">📊&nbsp; Acompanhe o histórico</td>
                  </tr>
                  <tr>
                    <td style="padding:4px 0;font-size:14px;color:#2B2233;">📄&nbsp; Exporte um PDF para a consulta</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- CTA -->
          <a href="${SITE_URL}/diario"
            style="display:block;text-align:center;background:#F26A00;color:#ffffff;font-weight:800;font-size:16px;padding:16px 24px;border-radius:999px;border:3px solid #2B2233;box-shadow:4px 4px 0 #2B2233;text-decoration:none;">
            Abrir meu Diário →
          </a>

        </td></tr>

        <!-- Rodapé -->
        <tr><td style="padding:24px 8px 0;text-align:center;">
          <p style="margin:0;font-size:12px;color:#9b8a9e;line-height:1.6;">
            Este diário organiza registros para apresentar à equipe de saúde.<br>
            <strong style="color:#2B2233;">Não substitui orientação médica.</strong>
          </p>
          <p style="margin:8px 0 0;font-size:11px;color:#b0a0b8;">
            Gamellito Ltda · <a href="${SITE_URL}" style="color:#9B8CF0;text-decoration:none;">gamellitoltda.com.br</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject, html };
}

export async function sendWelcomeEmail(email: string): Promise<{ ok: boolean; error?: string }> {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return { ok: false, error: "RESEND_API_KEY não configurada" };

  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "diario@gamellitoltda.com.br";
  const { subject, html } = buildWelcomeEmail(email);

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `Gamellito <${fromEmail}>`,
      to: email,
      subject,
      html,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    return { ok: false, error: JSON.stringify(err) };
  }

  return { ok: true };
}
