"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Etapa = "form" | "confirmacao";

export default function LoginPage() {
  const [etapa, setEtapa] = useState<Etapa>("form");
  const [email, setEmail] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function enviarMagicLink() {
    if (!email.trim()) { setErro("Digite um e-mail válido."); return; }
    setCarregando(true);
    setErro(null);

    const res = await fetch("/api/auth/magic-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.trim().toLowerCase() }),
    });

    setCarregando(false);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setErro((err as { error?: string }).error ?? "Não foi possível enviar o link. Tente novamente.");
    } else {
      setEtapa("confirmacao");
    }
  }

  async function entrarComGoogle() {
    setLoadingGoogle(true);
    setErro(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/diario`,
        queryParams: { prompt: "select_account" },
      },
    });
    if (error) {
      setErro("Não foi possível conectar com o Google. Tente pelo e-mail.");
      setLoadingGoogle(false);
    }
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-full max-w-md ds-card p-8 md:p-10">

        {etapa === "form" && (
          <div className="flex flex-col gap-5">
            <div className="text-center">
              <span className="text-5xl">📒</span>
              <h1 className="text-2xl font-display font-bold mt-3" style={{ color: "#2B2233" }}>
                Diário do Gamellito
              </h1>
              <p className="text-sm font-body mt-2" style={{ color: "rgba(43,34,51,0.6)" }}>
                Entre para acessar os registros da sua família.
              </p>
            </div>

            {/* Google OAuth */}
            <button
              onClick={entrarComGoogle}
              disabled={loadingGoogle}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-full font-body font-semibold transition-all"
              style={{
                background: "#ffffff",
                border: "3px solid #2B2233",
                boxShadow: "4px 4px 0 #2B2233",
                color: "#2B2233",
                minHeight: 44,
              }}
            >
              {loadingGoogle ? "Conectando…" : (
                <>
                  <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#4285F4" d="M47.5 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.3 7.3-10.6 7.3-17.3z"/>
                    <path fill="#34A853" d="M24 48c6.5 0 12-2.2 16-5.8l-7.9-6c-2.2 1.5-5 2.3-8.1 2.3-6.2 0-11.5-4.2-13.4-9.9H2.5v6.2C6.5 42.7 14.7 48 24 48z"/>
                    <path fill="#FBBC05" d="M10.6 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6v-6.2H2.5C.9 16.6 0 20.2 0 24s.9 7.4 2.5 10.8l8.1-6.2z"/>
                    <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.8-6.8C35.9 2.2 30.5 0 24 0 14.7 0 6.5 5.3 2.5 13.2l8.1 6.2C12.5 13.7 17.8 9.5 24 9.5z"/>
                  </svg>
                  Entrar com Google
                </>
              )}
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ background: "#2B2233", opacity: 0.15 }} />
              <span className="text-xs font-body" style={{ color: "rgba(43,34,51,0.45)" }}>ou por e-mail</span>
              <div className="flex-1 h-px" style={{ background: "#2B2233", opacity: 0.15 }} />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-body font-medium" style={{ color: "#2B2233" }}>
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
                className="ds-input w-full"
              />
              {erro && (
                <p className="text-sm font-body px-3 py-2 rounded-xl"
                  style={{ background: "#FEE2E2", color: "#991B1B" }}>
                  {erro}
                </p>
              )}
            </div>

            <button
              onClick={enviarMagicLink}
              disabled={carregando}
              className="ds-btn w-full font-display font-bold"
            >
              {carregando ? "Enviando…" : "Enviar link mágico ✉️"}
            </button>
          </div>
        )}

        {etapa === "confirmacao" && (
          <div className="flex flex-col items-center gap-5 text-center">
            <span className="text-6xl">🎉</span>
            <h1 className="text-2xl font-display font-bold" style={{ color: "#2B2233" }}>
              Link enviado!
            </h1>
            <p className="text-sm font-body leading-relaxed max-w-xs" style={{ color: "rgba(43,34,51,0.7)" }}>
              Verifique a caixa de entrada de{" "}
              <strong style={{ color: "#2B2233" }}>{email}</strong> e clique
              no link para entrar.
            </p>
            <p className="text-xs font-body" style={{ color: "rgba(43,34,51,0.5)" }}>
              Não recebeu? Verifique o spam ou{" "}
              <button onClick={() => { setEtapa("form"); setErro(null); }} className="underline">
                tente novamente
              </button>.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
