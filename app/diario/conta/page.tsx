"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { GAMELLITO_AVATARS, getAvatarSrc, type AvatarKey } from "@/components/UserMenu";
import { track } from "@/lib/analytics";

// Humores disponíveis — mesma lista dos avatares, mais "normal"
const HUMORES = [
  ...GAMELLITO_AVATARS,
  { key: "normal", label: "Normal", diagnostico: "Humor: Normal", src: "/assets/gamellito-corpinho.svg" },
] as const;

type HumorKey = typeof HUMORES[number]["key"];

export default function ContaPage() {
  const router = useRouter();

  // Conta
  const [email,     setEmail]     = useState<string | null>(null);
  const [avatarKey, setAvatarKey] = useState<AvatarKey>("feliz");

  // Coins
  const [coins,     setCoins]     = useState<number | null>(null);

  // Humor do dia
  const [humor,            setHumor]            = useState<HumorKey | null>(null);
  const [jaRegistrouHoje,  setJaRegistrouHoje]  = useState(false);
  const [coinsGanhos,      setCoinsGanhos]       = useState<number | null>(null);
  const [celebrando,       setCelebrando]        = useState(false);
  const [salvandoHumor,    setSalvandoHumor]     = useState(false);

  // Avatar
  const [salvandoAvatar, setSalvandoAvatar] = useState(false);
  const [avatarOk,       setAvatarOk]       = useState(false);

  // Conta / exclusão
  const [apagando, setApagando] = useState(false);
  const [erro,     setErro]     = useState<string | null>(null);

  const carregarDados = useCallback(async () => {
    const { data } = await createClient().auth.getUser();
    setEmail(data.user?.email ?? null);
    const saved = data.user?.user_metadata?.avatar as AvatarKey | undefined;
    if (saved) setAvatarKey(saved);

    // Coins
    fetch("/api/perfil")
      .then((r) => r.json())
      .then((d) => { if (typeof d.coins === "number") setCoins(d.coins); })
      .catch(() => {});

    // Humor de hoje
    fetch("/api/humor")
      .then((r) => r.json())
      .then((d) => {
        if (d?.humor) {
          setHumor(d.humor as HumorKey);
          setJaRegistrouHoje(true);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => { carregarDados(); }, [carregarDados]);

  // ── Avatar ─────────────────────────────────────────────────────────────────
  async function salvarAvatar(key: AvatarKey) {
    setAvatarKey(key);
    setSalvandoAvatar(true);
    setAvatarOk(false);
    const { error } = await createClient().auth.updateUser({ data: { avatar: key } });
    setSalvandoAvatar(false);
    if (!error) {
      setAvatarOk(true);
      track("user_signout", window.location.pathname, { acao: "avatar_changed", avatar: key });
      setTimeout(() => setAvatarOk(false), 2500);
    }
  }

  // ── Humor do dia ──────────────────────────────────────────────────────────
  async function marcarHumor(key: HumorKey) {
    if (salvandoHumor) return;
    setSalvandoHumor(true);
    setHumor(key);

    const res = await fetch("/api/humor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ humor: key, ja_registrado_hoje: jaRegistrouHoje }),
    });

    setSalvandoHumor(false);

    if (res.ok) {
      const d = await res.json();
      const ganhou = d.coins_adicionados ?? 0;

      if (!jaRegistrouHoje && ganhou > 0) {
        setCoinsGanhos(ganhou);
        setCelebrando(true);
        setCoins((prev) => (prev !== null ? prev + ganhou : ganhou));
        setTimeout(() => { setCelebrando(false); setCoinsGanhos(null); }, 3000);
      }

      setJaRegistrouHoje(true);
    }
  }

  // ── Sair / Apagar ─────────────────────────────────────────────────────────
  async function sair() {
    await createClient().auth.signOut();
    router.push("/diario/login");
  }

  async function apagarTudo() {
    const confirmado = window.confirm(
      "Tem certeza? Todos os registros desta família serão apagados permanentemente e a conta será removida. Esta ação não pode ser desfeita."
    );
    if (!confirmado) return;
    setApagando(true);
    setErro(null);
    const res = await fetch("/api/conta", { method: "DELETE" });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setErro((err as { error?: string }).error ?? "Erro ao apagar. Tente novamente.");
      setApagando(false);
      return;
    }
    await createClient().auth.signOut();
    router.push("/diario/login");
  }

  return (
    <div className="max-w-md mx-auto flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-display font-bold text-[#2B2233]">Minha conta</h1>
        {coins !== null && (
          <div className="flex items-center gap-1.5 bg-[#2B2233] text-gamellito-yellow rounded-full px-4 py-1.5">
            <span className="text-base">🪙</span>
            <span className="font-display font-bold text-lg tabular-nums">{coins}</span>
          </div>
        )}
      </header>

      {/* ── Como você está hoje? ─────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border-[3px] border-[#2B2233] shadow-[4px_4px_0_#2B2233] p-6 flex flex-col gap-4 relative overflow-hidden">

        {/* Celebração de coins */}
        {celebrando && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#FFF3C9]/95 z-10 gap-2 pointer-events-none">
            <span className="text-4xl animate-bounce">🪙</span>
            <p className="font-display font-bold text-xl text-[#2B2233]">
              +{coinsGanhos} moedas!
            </p>
            <p className="font-body text-sm text-[#2B2233]/60">Obrigada por marcar seu humor</p>
          </div>
        )}

        <div>
          <div className="text-xs font-body font-semibold uppercase tracking-widest mb-1 text-[#6E59C9]">
            Como você está hoje?
          </div>
          {!jaRegistrouHoje && (
            <p className="text-xs font-body text-[#2B2233]/50 mb-3">
              Marque seu humor e ganhe <span className="font-bold text-[#F26A00]">+5 🪙</span> por dia!
            </p>
          )}
          {jaRegistrouHoje && (
            <p className="text-xs font-body text-[#2B2233]/50 mb-3">
              Você já marcou hoje. Pode trocar quando quiser.
            </p>
          )}
        </div>

        <div className="grid grid-cols-5 gap-2">
          {HUMORES.map((h) => {
            const selecionado = humor === h.key;
            return (
              <button
                key={h.key}
                onClick={() => marcarHumor(h.key as HumorKey)}
                disabled={salvandoHumor}
                title={h.label}
                className={`rounded-2xl border-[2px] p-2 flex flex-col items-center gap-1 transition-all disabled:opacity-50 ${
                  selecionado
                    ? "border-[#F26A00] bg-[#FFF3C9] shadow-[2px_2px_0_#F26A00] scale-105"
                    : "border-[#2B2233]/20 hover:border-[#2B2233]/60 hover:bg-[#FFF3C9]/60"
                }`}
              >
                <img src={h.src} alt={h.label} className="w-9 h-9 object-contain" />
                <span className="text-[9px] font-body font-semibold text-[#2B2233]/60 leading-tight text-center">
                  {h.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Avatar ──────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border-[3px] border-[#2B2233] shadow-[4px_4px_0_#2B2233] p-6 flex flex-col gap-4">
        <div className="text-xs font-body font-semibold uppercase tracking-widest text-[#6E59C9]">
          Seu avatar
        </div>

        {/* Preview */}
        <div className="flex justify-center">
          <div className="w-20 h-20 rounded-full border-[3px] border-[#2B2233] bg-[#FFF3C9] shadow-[3px_3px_0_#2B2233] flex items-center justify-center overflow-hidden">
            <img src={getAvatarSrc(avatarKey)} alt="Avatar atual" className="w-16 h-16 object-contain" />
          </div>
        </div>

        {/* Grade: SVG + label diagnóstico do lado */}
        <div className="flex flex-col gap-2">
          {GAMELLITO_AVATARS.map((a) => {
            const selecionado = avatarKey === a.key;
            return (
              <button
                key={a.key}
                onClick={() => salvarAvatar(a.key)}
                className={`flex items-center gap-3 rounded-2xl border-[2px] px-4 py-2.5 transition-all ${
                  selecionado
                    ? "border-[#F26A00] bg-[#FFF3C9] shadow-[2px_2px_0_#F26A00]"
                    : "border-[#2B2233]/20 hover:border-[#2B2233]/60 hover:bg-[#FFF3C9]/40"
                }`}
              >
                <img src={a.src} alt={a.label} className="w-10 h-10 object-contain flex-shrink-0" />
                <div className="text-left">
                  <div className="font-body font-bold text-sm text-[#2B2233]">{a.label}</div>
                  <div className="font-body text-xs text-[#6E59C9]">{a.diagnostico}</div>
                </div>
                {selecionado && (
                  <div className="ml-auto w-4 h-4 rounded-full bg-[#F26A00] flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {salvandoAvatar && <p className="text-xs font-body text-center text-[#2B2233]/50">Salvando…</p>}
        {avatarOk && <p className="text-xs font-body text-center text-[#2B8A00] font-semibold">✓ Avatar salvo!</p>}
      </div>

      {/* ── Informações da conta ─────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border-[3px] border-[#2B2233] shadow-[4px_4px_0_#2B2233] p-6 flex flex-col gap-4">
        <div>
          <div className="text-xs font-body font-semibold uppercase tracking-widest mb-1 text-[#6E59C9]">
            E-mail
          </div>
          <div className="font-body font-medium text-lg text-[#2B2233]">
            {email ?? "Carregando…"}
          </div>
        </div>
        <button
          onClick={sair}
          className="w-full rounded-full border-[2px] border-[#2B2233] bg-white text-[#2B2233] font-display font-bold py-3 hover:-translate-y-px hover:shadow-[2px_2px_0_#2B2233] transition-all"
        >
          Sair da conta
        </button>
      </div>

      {/* ── Zona de risco ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-3xl border-[3px] border-[#EE2B2B]/60 p-6 flex flex-col gap-4">
        <div>
          <h2 className="font-display font-bold text-lg mb-1 text-[#EE2B2B]">Apagar todos os dados</h2>
          <p className="text-sm font-body text-[#2B2233]">
            Ao confirmar, todos os registros desta família serão apagados permanentemente
            e a conta será removida. Esta ação não pode ser desfeita.
          </p>
          <p className="text-xs font-body mt-2 text-[#2B2233]/50">
            Direito ao esquecimento — Lei nº 13.709/2018 (LGPD), art. 18, IV.
          </p>
        </div>
        {erro && (
          <p className="text-sm font-body bg-[#EE2B2B]/10 text-[#EE2B2B] rounded-xl px-4 py-3 border-[2px] border-[#EE2B2B]/40">
            {erro}
          </p>
        )}
        <button
          onClick={apagarTudo}
          disabled={apagando}
          className="w-full rounded-full bg-[#EE2B2B] text-white font-display font-bold py-3 hover:bg-[#CC2020] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {apagando ? "Apagando…" : "Apagar tudo e encerrar conta"}
        </button>
      </div>

      <div className="text-center">
        <Link href="/diario" className="text-sm font-body text-[#2B2233]/50 hover:text-[#2B2233] transition-colors">
          ← Voltar ao diário
        </Link>
      </div>
    </div>
  );
}
