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

  const cardClass =
    "w-full max-w-md bg-white rounded-3xl border-[3px] border-[#2B2233] shadow-[4px_4px_0_#2B2233] p-8 md:p-10";

  const inputClass =
    "w-full rounded-2xl border-[2px] border-[#2B2233] bg-[#EBF4FF] px-4 py-3 font-body text-[#2B2233] placeholder:text-[#2B2233]/40 focus:outline-none focus:ring-2 focus:ring-[#9B8CF0]/60";

  const btnPrimary =
    "w-full rounded-full bg-[#F26A00] border-[3px] border-[#2B2233] shadow-[3px_3px_0_#2B2233] py-3 font-display font-bold text-white text-base hover:-translate-y-px hover:shadow-[4px_4px_0_#2B2233] active:translate-y-0.5 active:shadow-[1px_1px_0_#2B2233] transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className={cardClass}>

        {/* ── Etapa 1: Consentimento ── */}
        {etapa === "consentimento" && (
          <div className="flex flex-col gap-6">
            <div className="text-center">
              <span className="text-5xl">📒</span>
              <h1 className="text-2xl font-display font-bold text-[#2B2233] mt-3">
                Diário do Gamellito
              </h1>
              <p className="text-sm text-[#2B2233]/70 font-body mt-2">
                Antes de começar, leia como seus dados são usados.
              </p>
            </div>

            <div className="rounded-2xl bg-[#FFF3C9] border-[2px] border-[#2B2233] p-5 text-sm text-[#2B2233] font-body leading-relaxed space-y-3">
              <p>
                <strong>O que coletamos:</strong>{" "}
                apenas o e-mail da conta e os registros de glicemia que você
                mesmo digitar (valor, data/hora, rótulo descritivo e
                observação opcional).
              </p>
              <p>
                <strong>Para que serve:</strong>{" "}
                guardar seus registros com segurança e mostrar o histórico
                para levar organizado à consulta médica.
              </p>
              <p>
                <strong>O que não fazemos:</strong>{" "}
                não interpretamos valores, não emitimos alertas clínicos, não
                compartilhamos seus dados com terceiros sem sua autorização.
              </p>
              <p>
                <strong>Seus direitos (LGPD):</strong>{" "}
                você pode apagar todos os seus dados a qualquer momento em
                Conta → Apagar todos os dados.
              </p>
              <p className="text-xs text-[#2B2233]/60 pt-1 border-t border-[#2B2233]/20">
                Política de privacidade completa: <em>[link pendente — DIA-000]</em>
              </p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consentido}
                onChange={(e) => setConsentido(e.target.checked)}
                className="mt-1 h-5 w-5 shrink-0 rounded border-2 border-[#2B2233] accent-[#F26A00] cursor-pointer"
              />
              <span className="text-sm font-body text-[#2B2233] leading-relaxed">
                Li e aceito o uso dos meus dados conforme descrito acima para
                utilizar o Diário do Gamellito.
              </span>
            </label>

            <button
              disabled={!consentido}
              onClick={() => setEtapa("email")}
              className={btnPrimary}
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
              <h1 className="text-2xl font-display font-bold text-[#2B2233] mt-3">
                Entrar com e-mail
              </h1>
              <p className="text-sm text-[#2B2233]/70 font-body mt-2">
                Vamos enviar um link mágico — sem senha para lembrar.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="email"
                className="text-sm font-body font-semibold text-[#F26A00]"
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
                className={inputClass}
              />
              {erro && (
                <p className="text-sm text-[#EE2B2B] font-body bg-[#EE2B2B]/10 rounded-xl px-4 py-2">
                  {erro}
                </p>
              )}
            </div>

            <button
              onClick={enviarMagicLink}
              disabled={carregando}
              className={btnPrimary}
            >
              {carregando ? "Enviando…" : "Enviar link mágico ✉️"}
            </button>

            <button
              onClick={() => setEtapa("consentimento")}
              className="text-sm text-[#2B2233]/60 font-body hover:text-[#2B2233] transition-colors text-center"
            >
              ← Voltar
            </button>
          </div>
        )}

        {/* ── Etapa 3: Confirmação ── */}
        {etapa === "confirmacao" && (
          <div className="flex flex-col items-center gap-5 text-center">
            <span className="text-6xl">🎉</span>
            <h1 className="text-2xl font-display font-bold text-[#2B2233]">
              Link enviado!
            </h1>
            <p className="text-sm text-[#2B2233]/70 font-body leading-relaxed max-w-xs">
              Verifique a caixa de entrada de{" "}
              <strong className="text-[#2B2233]">{email}</strong> e clique no
              link para entrar. Pode fechar esta aba.
            </p>
            <p className="text-xs text-[#2B2233]/50 font-body">
              Não recebeu? Verifique o spam ou{" "}
              <button
                onClick={() => {
                  setEtapa("email");
                  setErro(null);
                }}
                className="underline hover:text-[#F26A00] transition-colors"
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
