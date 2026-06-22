const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.gamellitoltda.com.br";

export function buildWelcomeEmail(email: string): { subject: string; html: string } {
  const subject = "Bem-vindo à aventura, Gamellito! 📒";

  const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background:#FFF3C9;font-family:'Nunito',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF3C9;padding:36px 16px;">
<tr><td align="center">

  <!-- Projeto label -->
  <div style="max-width:600px;margin:0 auto 14px;text-align:center;font-size:12px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;color:rgba(43,34,51,0.60);">
    Projeto Gamellito · Educação em Diabetes Tipo 1
  </div>

  <!-- Card principal -->
  <table width="100%" style="max-width:600px;margin:0 auto;background:#FFFFFF;border:3px solid #2B2233;border-radius:32px;box-shadow:7px 7px 0 #2B2233;overflow:hidden;" cellpadding="0" cellspacing="0">

    <!-- HERO (fundo roxo escuro) -->
    <tr><td style="background:#3d1f74;padding:30px 32px 36px;">

      <!-- Logo + badge -->
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:26px;">
        <tr>
          <td style="font-family:'Baloo 2','Arial Black',Arial,sans-serif;font-weight:800;font-size:28px;line-height:1;color:#F26A00;">
            Gamellito<span style="color:#FFC400;">.</span>
          </td>
          <td align="right">
            <span style="display:inline-block;background:#FFC400;color:#2B2233;font-family:'Baloo 2','Arial Black',Arial,sans-serif;font-weight:800;font-size:11px;letter-spacing:0.07em;text-transform:uppercase;padding:4px 12px;border-radius:999px;border:2px solid #2B2233;">
              Boas-vindas
            </span>
          </td>
        </tr>
      </table>

      <!-- Game dots -->
      <div style="display:flex;gap:7px;margin-bottom:16px;">
        <span style="width:16px;height:16px;border-radius:50%;border:2px solid #2B2233;background:#EE2B2B;display:inline-block;"></span>
        <span style="width:16px;height:16px;border-radius:50%;border:2px solid #2B2233;background:#8DC63F;display:inline-block;"></span>
        <span style="width:16px;height:16px;border-radius:50%;border:2px solid #2B2233;background:#37B6E6;display:inline-block;"></span>
        <span style="width:16px;height:16px;border-radius:50%;border:2px solid #2B2233;background:#F25CA2;display:inline-block;"></span>
      </div>

      <!-- Título -->
      <h1 style="margin:0 0 14px;font-family:'Baloo 2','Arial Black',Arial,sans-serif;font-weight:800;font-size:42px;line-height:1.04;color:#FFFFFF;letter-spacing:-0.01em;">
        Bem-vindo à<br>aventura<span style="color:#FFC400;">!</span>
      </h1>

      <!-- Subtítulo -->
      <p style="margin:0 0 24px;font-family:'Nunito',Arial,sans-serif;font-weight:600;font-size:17px;line-height:1.5;color:#EBE3FF;max-width:420px;">
        Que bom ter você por aqui! Agora é só entrar no site, registrar a sua glicemia e chegar à consulta com tudo organizado — leve e sem complicação.
      </p>

      <!-- CTA button -->
      <a href="${SITE_URL}/diario"
        style="display:inline-block;background:#F26A00;color:#FFFFFF;font-family:'Baloo 2','Arial Black',Arial,sans-serif;font-weight:800;font-size:17px;padding:14px 28px;border-radius:999px;border:3px solid #2B2233;box-shadow:4px 4px 0 #2B2233;text-decoration:none;">
        Entrar no Diário →
      </a>

    </td></tr>

    <!-- COMO FUNCIONA -->
    <tr><td style="padding:30px 32px 8px;">
      <h2 style="margin:0 0 10px;font-family:'Baloo 2','Arial Black',Arial,sans-serif;font-weight:800;font-size:24px;line-height:1.1;color:#6E59C9;">
        Como funciona
      </h2>
      <p style="margin:0;font-family:'Nunito',Arial,sans-serif;font-size:17px;line-height:1.55;color:#2B2233;">
        É simples e leve: você entra na sua conta, registra a glicemia e o Gamellito te ajuda a levar tudo organizado para a consulta.
      </p>
    </td></tr>

    <!-- PASSOS -->
    <tr><td style="padding:24px 32px 8px;">

      <!-- Badge "Em 3 passos" -->
      <span style="display:inline-block;background:#FFF3C9;color:#2B2233;font-family:'Baloo 2','Arial Black',Arial,sans-serif;font-weight:800;font-size:11px;letter-spacing:0.07em;text-transform:uppercase;padding:4px 12px;border-radius:999px;border:2px solid #2B2233;margin-bottom:16px;">
        Em 3 passos
      </span>

      <!-- Passo 1 -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border:3px solid #2B2233;border-radius:20px;box-shadow:4px 4px 0 #2B2233;margin-bottom:16px;">
        <tr>
          <td style="padding:20px 22px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align:top;padding-right:18px;">
                  <span style="display:inline-flex;width:52px;height:52px;border-radius:50%;border:3px solid #2B2233;background:#F26A00;color:#FFFFFF;font-family:'Baloo 2','Arial Black',Arial,sans-serif;font-weight:800;font-size:26px;align-items:center;justify-content:center;text-align:center;line-height:52px;">1</span>
                </td>
                <td style="vertical-align:top;">
                  <h3 style="margin:0 0 4px;font-family:'Baloo 2','Arial Black',Arial,sans-serif;font-weight:700;font-size:20px;line-height:1.15;color:#2B2233;">Entre na sua conta</h3>
                  <p style="margin:0;font-family:'Nunito',Arial,sans-serif;font-size:15px;line-height:1.5;color:rgba(43,34,51,0.60);">Acesse o site com o seu login e comece a aventura.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Passo 2 -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border:3px solid #2B2233;border-radius:20px;box-shadow:4px 4px 0 #2B2233;margin-bottom:16px;">
        <tr>
          <td style="padding:20px 22px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align:top;padding-right:18px;">
                  <span style="display:inline-flex;width:52px;height:52px;border-radius:50%;border:3px solid #2B2233;background:#8DC63F;color:#2B2233;font-family:'Baloo 2','Arial Black',Arial,sans-serif;font-weight:800;font-size:26px;align-items:center;justify-content:center;text-align:center;line-height:52px;">2</span>
                </td>
                <td style="vertical-align:top;">
                  <h3 style="margin:0 0 4px;font-family:'Baloo 2','Arial Black',Arial,sans-serif;font-weight:700;font-size:20px;line-height:1.15;color:#2B2233;">Registre sua glicemia</h3>
                  <p style="margin:0;font-family:'Nunito',Arial,sans-serif;font-size:15px;line-height:1.5;color:rgba(43,34,51,0.60);">Coloque o valor da glicemia do momento — rapidinho, sem complicação.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <!-- Passo 3 -->
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border:3px solid #2B2233;border-radius:20px;box-shadow:4px 4px 0 #2B2233;margin-bottom:8px;">
        <tr>
          <td style="padding:20px 22px;">
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="vertical-align:top;padding-right:18px;">
                  <span style="display:inline-flex;width:52px;height:52px;border-radius:50%;border:3px solid #2B2233;background:#9B8CF0;color:#FFFFFF;font-family:'Baloo 2','Arial Black',Arial,sans-serif;font-weight:800;font-size:26px;align-items:center;justify-content:center;text-align:center;line-height:52px;">3</span>
                </td>
                <td style="vertical-align:top;">
                  <h3 style="margin:0 0 4px;font-family:'Baloo 2','Arial Black',Arial,sans-serif;font-weight:700;font-size:20px;line-height:1.15;color:#2B2233;">Leve tudo à consulta</h3>
                  <p style="margin:0;font-family:'Nunito',Arial,sans-serif;font-size:15px;line-height:1.5;color:rgba(43,34,51,0.60);">Exporte um PDF com o histórico e chegue organizado ao médico.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

    </td></tr>

    <!-- EM NÚMEROS -->
    <tr><td style="padding:28px 32px 8px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFC400;border:3px solid #2B2233;border-radius:24px;box-shadow:4px 4px 0 #2B2233;">
        <tr><td style="padding:26px 24px;">
          <span style="display:inline-block;background:#2B2233;color:#FFFFFF;font-family:'Baloo 2','Arial Black',Arial,sans-serif;font-weight:800;font-size:11px;letter-spacing:0.07em;text-transform:uppercase;padding:4px 12px;border-radius:999px;margin-bottom:18px;">
            Gamellito em números
          </span>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding:12px 0;">
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="min-width:140px;font-family:'Baloo 2','Arial Black',Arial,sans-serif;font-weight:900;font-size:54px;line-height:1;color:#F26A00;">+200</td>
                    <td style="font-family:'Nunito',Arial,sans-serif;font-weight:700;font-size:16px;line-height:1.3;color:#2B2233;padding-left:18px;">famílias acompanhadas</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr><td style="height:2px;background:rgba(43,34,51,0.12);"></td></tr>
            <tr>
              <td style="padding:12px 0;">
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="min-width:140px;font-family:'Baloo 2','Arial Black',Arial,sans-serif;font-weight:900;font-size:54px;line-height:1;color:#6E59C9;">13</td>
                    <td style="font-family:'Nunito',Arial,sans-serif;font-weight:700;font-size:16px;line-height:1.3;color:#2B2233;padding-left:18px;">fases de aventura</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr><td style="height:2px;background:rgba(43,34,51,0.12);"></td></tr>
            <tr>
              <td style="padding:12px 0;">
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="min-width:140px;font-family:'Baloo 2','Arial Black',Arial,sans-serif;font-weight:900;font-size:54px;line-height:1;color:#F26A00;">5</td>
                    <td style="font-family:'Nunito',Arial,sans-serif;font-weight:700;font-size:16px;line-height:1.3;color:#2B2233;padding-left:18px;">anos de projeto</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </td></tr>

    <!-- AJUDA -->
    <tr><td style="padding:28px 32px 6px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF3C9;border:3px solid #2B2233;border-radius:24px;box-shadow:4px 4px 0 #2B2233;">
        <tr><td style="padding:24px;">
          <h3 style="margin:0 0 6px;font-family:'Baloo 2','Arial Black',Arial,sans-serif;font-weight:700;font-size:20px;line-height:1.15;color:#6E59C9;">
            Estamos juntos nessa
          </h3>
          <p style="margin:0;font-family:'Nunito',Arial,sans-serif;font-size:15px;line-height:1.5;color:#2B2233;">
            Qualquer dúvida sobre a glicemia ou o Diabetes Tipo 1, é só responder este email — a gente te ajuda com todo o carinho.
          </p>
        </td></tr>
      </table>
    </td></tr>

    <!-- FOOTER -->
    <tr><td style="background:#2a1652;margin-top:30px;padding:30px 32px;border-radius:0 0 28px 28px;">
      <div style="font-family:'Baloo 2','Arial Black',Arial,sans-serif;font-weight:800;font-size:22px;color:#F26A00;">
        Gamellito<span style="color:#FFC400;">.</span>
      </div>
      <p style="margin:8px 0 18px;font-family:'Nunito',Arial,sans-serif;font-weight:700;font-size:14px;line-height:1.5;color:#C9BEEA;">
        Projeto Gamellito · Educação em Diabetes Tipo 1
      </p>
      <div style="height:1px;background:rgba(255,255,255,0.16);margin-bottom:16px;"></div>
      <p style="margin:0 0 4px;font-family:'Nunito',Arial,sans-serif;font-size:12px;line-height:1.6;color:#9A8DC2;">
        Gamellito Ltda. · São Paulo, Brasil
      </p>
      <p style="margin:0;font-family:'Nunito',Arial,sans-serif;font-size:12px;line-height:1.6;color:#9A8DC2;">
        Você recebeu este email porque criou uma conta no Gamellito. Este diário organiza registros para apresentar à equipe de saúde — <strong style="color:#C9BEEA;">não substitui orientação médica.</strong>
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
