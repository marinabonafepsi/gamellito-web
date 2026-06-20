"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Etapa = "consentimento" | "email" | "confirmacao";

export default function LoginPage() {
  const [etapa, setEtapa] = useState<Etapa>("consentimento");
  const [consentido, setConsentido] = useState(false);
  const [email, setEmail] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function enviarMagicLink() {
    if (!email.trim()) {
      setErro("Digite um e-mail válido.");
      return;
    }
    setCarregando(true);
    setErro(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/diario`,
      },
    });

    setCarregando(false);

    if (error) {
      setErro("Não foi possível enviar o link. Tente novamente.");
    } else {
      setEtapa("confirmacao");
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-md bg-card rounded-3xl border border-border shadow-sm p-8 md:p-10">

        {/* ── Etapa 1: Consentimento ── */}
        {etapa === "consentimento" && (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <span className="text-5xl">📒</span>
              <h1 className="text-2xl font-display font-bold text-foreground mt-3">
                Diário do Gamellito
              </h1>
              <p className="text-sm text-muted-foreground font-body mt-2">
                Antes de começar, leia como seus dados são usados.
              </p>
            </div>

            {/* Caixa de consentimento */}
            <div className="rounded-2xl bg-muted/60 border border-border p-5 text-sm text-muted-foreground font-body leading-relaxed space-y-3">
              {/* TEXTO JURÍDICO PENDENTE — DIA-000 */}
              <p>
                <strong className="text-foreground">O que coletamos:</strong>{" "}
                apenas o e-mail da conta e os registros de glicemia que você
                mesmo digitar (valor, data/hora, rótulo descritivo e
                observação opcional).
              </p>
              <p>
                <strong className="text-foreground">Para que serve:</strong>{" "}
                guardar seus registros com segurança e mostrar o histórico
                para levar organizado à consulta médica.
              </p>
              <p>
                <strong className="text-foreground">O que não fazemos:</strong>{" "}
                não interpretamos valores, não emitimos alertas clínicos, não
                compartilhamos seus dados com terceiros sem sua autorização.
              </p>
              <p>
                <strong className="text-foreground">Seus direitos (LGPD):</strong>{" "}
                você pode apagar todos os seus dados a qualquer momento em
                Conta → Apagar todos os dados.
              </p>
              <p className="text-xs text-muted-foreground/70 pt-1 border-t border-border">
                {/* TEXTO JURÍDICO PENDENTE — DIA-000: substituir pelo texto
                    validado pelo advogado antes do lançamento. */}
                Política de privacidade completa: <em>[link pendente — DIA-000]</em>
              </p>
            </div>

            {/* Checkbox de consentimento */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={consentido}
                onChange={(e) => setConsentido(e.target.checked)}
                className="mt-1 h-5 w-5 shrink-0 rounded border-border accent-primary cursor-pointer"
              />
              <span className="text-sm font-body text-foreground leading-relaxed">
                Li e aceito o uso dos meus dados conforme descrito acima para
                utilizar o Diário do Gamellito.
              </span>
            </label>

            <button
              disabled={!consentido}
              onClick={() => setEtapa("email")}
              className="w-full rounded-full bg-primary py-3 font-display font-bold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continuar →
            </button>
          </div>
        )}

        {/* ── Etapa 2: Inserir e-mail ── */}
        {etapa === "email" && (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <span className="text-5xl">✉️</span>
              <h1 className="text-2xl font-display font-bold text-foreground mt-3">
                Entrar com e-mail
              </h1>
              <p className="text-sm text-muted-foreground font-body mt-2">
                Vamos enviar um link mágico — sem senha para lembrar.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-body font-medium text-foreground"
              >
                E-mail da família
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                inputMode="email"
                placeholder="familia@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && enviarMagicLink()}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 font-body text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              {erro && (
                <p className="text-sm text-destructive font-body">{erro}</p>
              )}
            </div>

            <button
              onClick={enviarMagicLink}
              disabled={carregando}
              className="w-full rounded-full bg-primary py-3 font-display font-bold text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {carregando ? "Enviando…" : "Enviar link mágico"}
            </button>

            <button
              onClick={() => setEtapa("consentimento")}
              className="text-sm text-muted-foreground font-body hover:text-foreground transition-colors text-center"
            >
              ← Voltar
            </button>
          </div>
        )}

        {/* ── Etapa 3: Confirmação ── */}
        {etapa === "confirmacao" && (
          <div className="flex flex-col items-center gap-5 text-center">
            <span className="text-6xl">🎉</span>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Link enviado!
            </h1>
            <p className="text-sm text-muted-foreground font-body leading-relaxed max-w-xs">
              Verifique a caixa de entrada de{" "}
              <strong className="text-foreground">{email}</strong> e clique no
              link para entrar. Pode fechar esta aba.
            </p>
            <p className="text-xs text-muted-foreground/70 font-body">
              Não recebeu? Verifique o spam ou{" "}
              <button
                onClick={() => {
                  setEtapa("email");
                  setErro(null);
                }}
                className="underline hover:text-foreground transition-colors"
              >
                tente novamente
              </button>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
