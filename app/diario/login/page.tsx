"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { AssetImage } from "@/components/SiteAssets";

type Etapa = "selecao" | "novo" | "existente" | "confirmacao";
type RoleId = "familia" | "profissional" | "instituicao";

const ROLES: {
  id: RoleId;
  segment: string;
  emoji: string;
  name: string;
  desc: string;
  bg: string;
  fg: string;
}[] = [
  {
    id: "familia",
    segment: "B2C",
    emoji: "👨‍👩‍👧",
    name: "Família",
    desc: "Pai, mãe ou cuidador acompanhando o dia a dia da criança com DM1.",
    bg: "#FFC400",
    fg: "#2B2233",
  },
  {
    id: "profissional",
    segment: "B2B",
    emoji: "🩺",
    name: "Profissional",
    desc: "Médico, enfermeiro ou educador no cuidado e ensino sobre diabetes.",
    bg: "#9B8CF0",
    fg: "#ffffff",
  },
  {
    id: "instituicao",
    segment: "B2E",
    emoji: "🏥",
    name: "Instituição",
    desc: "Escola, clínica ou ONG parceira do ecossistema Gamellito.",
    bg: "#6E59C9",
    fg: "#ffffff",
  },
];

export default function LoginPage() {
  const [etapa, setEtapa] = useState<Etapa>("selecao");
  const [roleId, setRoleId] = useState<RoleId | null>(null);
  const [email, setEmail] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const role = ROLES.find((r) => r.id === roleId) ?? null;

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

  /* ── TELA 1: Seleção de perfil ── */
  if (etapa === "selecao") {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold" style={{ color: "#2B2233" }}>
              Quem é você?
            </h1>
            <p className="text-base font-body mt-2" style={{ color: "#6B7280" }}>
              Escolha seu perfil para começar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {ROLES.map((r) => (
              <button
                key={r.id}
                onClick={() => { setRoleId(r.id); setEtapa("novo"); }}
                className="flex flex-col gap-3 items-start text-left p-6 rounded-2xl transition-all hover:-translate-y-1"
                style={{
                  background: r.bg,
                  color: r.fg,
                  border: "3px solid #2B2233",
                  boxShadow: "5px 5px 0 #2B2233",
                  minHeight: 200,
                }}
              >
                <span
                  className="text-2xl flex items-center justify-center bg-white rounded-xl"
                  style={{ width: 52, height: 52, border: "2px solid #2B2233", flexShrink: 0 }}
                >
                  {r.emoji}
                </span>
                <span className="font-display font-bold text-xl leading-tight">{r.name}</span>
                <span className="text-sm leading-snug" style={{ opacity: 0.9 }}>{r.desc}</span>
                <span className="mt-auto font-display font-bold text-sm">Escolher →</span>
              </button>
            ))}
          </div>

          <p className="text-center text-sm font-body" style={{ color: "#6B7280" }}>
            Já tem conta?{" "}
            <button
              onClick={() => setEtapa("existente")}
              className="font-bold underline hover:opacity-70 transition-opacity"
              style={{ color: "#6E59C9" }}
            >
              Entrar
            </button>
          </p>
        </div>
      </div>
    );
  }

  /* ── TELA 3: Link enviado ── */
  if (etapa === "confirmacao") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="ds-card w-full max-w-md p-8 md:p-10">
          <div className="flex flex-col items-center gap-5 text-center">
            <AssetImage asset="gamellitoContente" alt="Gamellito comemorando" className="w-16 h-auto" width={64} height={64} />
            <h1 className="text-2xl font-display font-bold" style={{ color: "#2B2233" }}>
              Link enviado!
            </h1>
            <p className="text-sm font-body leading-relaxed max-w-xs" style={{ color: "#6B7280" }}>
              Verifique a caixa de entrada de{" "}
              <strong style={{ color: "#2B2233" }}>{email}</strong> e clique no
              link para entrar. Pode fechar esta aba.
            </p>
            <p className="text-xs font-body" style={{ color: "#9CA3AF" }}>
              Não recebeu? Verifique o spam ou{" "}
              <button
                onClick={() => { setEtapa(roleId ? "novo" : "existente"); setErro(null); }}
                className="underline hover:opacity-70 transition-opacity"
              >
                tente novamente
              </button>
              .
            </p>
          </div>
        </div>
      </div>
    );
  }

  /* ── TELA 2: Formulário (novo usuário ou existente) ── */
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
      <div className="ds-card w-full max-w-md p-8 md:p-10">
        <div className="flex flex-col gap-5">

          {/* Badge de perfil (só para novo usuário) */}
          {etapa === "novo" && role && (
            <div
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: role.bg, color: role.fg, border: "2px solid #2B2233" }}
            >
              <span
                className="flex items-center justify-center bg-white rounded-lg text-xl flex-shrink-0"
                style={{ width: 36, height: 36, border: "1.5px solid #2B2233" }}
              >
                {role.emoji}
              </span>
              <div className="flex-1 min-w-0">
                <span className="block text-xs font-bold uppercase tracking-wide" style={{ opacity: 0.75 }}>
                  Criar conta como
                </span>
                <span className="block font-display font-bold text-base leading-tight">{role.name}</span>
              </div>
              <button
                onClick={() => setEtapa("selecao")}
                className="text-xs font-bold flex-shrink-0 hover:opacity-70 transition-opacity"
                style={{ opacity: 0.7 }}
              >
                trocar
              </button>
            </div>
          )}

          <div className="text-center">
            <h1 className="text-2xl font-display font-bold" style={{ color: "#2B2233" }}>
              {etapa === "novo" ? "Criar conta" : "Entrar"}
            </h1>
            <p className="text-sm font-body mt-1" style={{ color: "#6B7280" }}>
              Escolha como prefere acessar o diário.
            </p>
          </div>

          {/* Google OAuth */}
          <button
            onClick={entrarComGoogle}
            disabled={loadingGoogle}
            className="ds-btn ds-btn--ghost w-full"
          >
            {loadingGoogle ? (
              "Conectando…"
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true" className="flex-shrink-0">
                  <path fill="#4285F4" d="M47.5 24.6c0-1.6-.1-3.1-.4-4.6H24v8.7h13.2c-.6 3-2.3 5.5-4.9 7.2v6h7.9c4.6-4.3 7.3-10.6 7.3-17.3z"/>
                  <path fill="#34A853" d="M24 48c6.5 0 12-2.2 16-5.8l-7.9-6c-2.2 1.5-5 2.3-8.1 2.3-6.2 0-11.5-4.2-13.4-9.9H2.5v6.2C6.5 42.7 14.7 48 24 48z"/>
                  <path fill="#FBBC05" d="M10.6 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6v-6.2H2.5C.9 16.6 0 20.2 0 24s.9 7.4 2.5 10.8l8.1-6.2z"/>
                  <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.8-6.8C35.9 2.2 30.5 0 24 0 14.7 0 6.5 5.3 2.5 13.2l8.1 6.2C12.5 13.7 17.8 9.5 24 9.5z"/>
                </svg>
                {etapa === "novo" ? "Cadastrar com Google" : "Entrar com Google"}
              </>
            )}
          </button>

          {/* Divisor */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "#2B223320" }} />
            <span className="text-xs font-body" style={{ color: "#6B7280" }}>ou por e-mail</span>
            <div className="flex-1 h-px" style={{ background: "#2B223320" }} />
          </div>

          {/* E-mail magic link */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-body font-medium" style={{ color: "#2B2233" }}>
              E-mail
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="voce@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && enviarMagicLink()}
              className="ds-input"
            />
            {erro && (
              <p className="text-sm font-body rounded-xl px-3 py-2" style={{ background: "#FEF2F2", color: "#DC2626" }}>
                {erro}
              </p>
            )}
          </div>

          <button
            onClick={enviarMagicLink}
            disabled={carregando}
            className="ds-btn ds-btn--lg w-full"
          >
            {carregando ? "Enviando…" : "Enviar link mágico"}
          </button>

          {/* Links de navegação entre etapas */}
          {etapa === "existente" ? (
            <p className="text-center text-sm font-body" style={{ color: "#6B7280" }}>
              Não tem conta?{" "}
              <button
                onClick={() => setEtapa("selecao")}
                className="font-bold underline hover:opacity-70 transition-opacity"
                style={{ color: "#6E59C9" }}
              >
                Criar agora
              </button>
            </p>
          ) : (
            <p className="text-center text-sm font-body" style={{ color: "#6B7280" }}>
              Já tem conta?{" "}
              <button
                onClick={() => setEtapa("existente")}
                className="font-bold underline hover:opacity-70 transition-opacity"
                style={{ color: "#6E59C9" }}
              >
                Entrar
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
