"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { track } from "@/lib/analytics";

export const GAMELLITO_AVATARS = [
  { key: "feliz",   label: "Feliz",      src: "/assets/gamellito-feliz-mao-na-barriga.svg" },
  { key: "animado", label: "Animado",    src: "/assets/gamellito-contente.svg" },
  { key: "raiva",   label: "Com raiva",  src: "/assets/gamellito-furioso.svg" },
  { key: "medo",    label: "Com medo",   src: "/assets/olho-desconfiado.svg" },
] as const;

export type AvatarKey = typeof GAMELLITO_AVATARS[number]["key"];

export function getAvatarSrc(key: string | null | undefined): string {
  const found = GAMELLITO_AVATARS.find((a) => a.key === key);
  return found?.src ?? "/assets/gamellito-feliz-mao-na-barriga.svg";
}

export default function UserMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [avatarKey, setAvatarKey] = useState<string | null>(null);
  const [coins, setCoins] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const client = createClient();
    client.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      const key = data.user?.user_metadata?.avatar as string | undefined;
      setAvatarKey(key ?? "feliz");
    });

    fetch("/api/perfil")
      .then((r) => r.json())
      .then((d) => { if (typeof d.coins === "number") setCoins(d.coins); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function sair() {
    track("user_signout", window.location.pathname, {});
    await createClient().auth.signOut();
    router.push("/diario/login");
  }

  if (!avatarKey) return null;

  return (
    <div ref={ref} className="relative">
      {/* Botão: avatar (trigger) */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full border-2 border-gamellito-yellow bg-gamellito-yellow/20 overflow-hidden flex items-center justify-center hover:bg-gamellito-yellow/40 transition-colors"
        aria-label="Menu do usuário"
      >
        <img src={getAvatarSrc(avatarKey)} alt="Avatar" className="w-9 h-9 object-contain" />
      </button>

      {/* Dropdown: Perfil com moedas */}
      {open && (
        <div className="absolute right-0 top-14 w-72 gm-card gm-card--cream z-50">
          {/* Header: Avatar + Moedas */}
          <div className="text-center pb-4 border-b-2 border-[#2B2233]/20">
            {/* Avatar grande */}
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 rounded-full bg-white border-3 border-[#2B2233] flex items-center justify-center">
                <img src={getAvatarSrc(avatarKey)} alt="Avatar" className="w-14 h-14 object-contain" />
              </div>
            </div>

            {/* Moedas */}
            {coins !== null && (
              <div className="bg-[#FFC400]/30 rounded-lg py-2 px-3 inline-block">
                <p className="text-xs font-body text-[#2B2233]/60">Saldo de moedas</p>
                <p className="text-xl font-display font-bold text-[#F26A00]">
                  🪙 {coins}
                </p>
              </div>
            )}
          </div>

          {/* Menu items */}
          <div className="pt-4 space-y-1">
            <button
              onClick={() => {
                setOpen(false);
                router.push("/diario/moedas");
              }}
              className="w-full text-left px-4 py-2 text-sm font-body font-semibold text-[#2B2233] hover:bg-white/50 transition-colors rounded-lg flex items-center gap-3"
            >
              <span className="text-lg">💰</span>
              <div>
                <p>Meus ganhos</p>
                <p className="text-xs text-[#2B2233]/50">Histórico de emoções</p>
              </div>
            </button>

            <button
              onClick={() => {
                setOpen(false);
                router.push("/diario/conta");
              }}
              className="w-full text-left px-4 py-2 text-sm font-body font-semibold text-[#2B2233] hover:bg-white/50 transition-colors rounded-lg flex items-center gap-3"
            >
              <span className="text-lg">👤</span>
              <div>
                <p>Meu perfil</p>
                <p className="text-xs text-[#2B2233]/50">Avatar e settings</p>
              </div>
            </button>

            <button
              onClick={() => {
                setOpen(false);
                router.push("/diario");
              }}
              className="w-full text-left px-4 py-2 text-sm font-body font-semibold text-[#2B2233] hover:bg-white/50 transition-colors rounded-lg flex items-center gap-3"
            >
              <span className="text-lg">📒</span>
              <div>
                <p>Meu diário</p>
                <p className="text-xs text-[#2B2233]/50">Registros de glicemia</p>
              </div>
            </button>

            <div className="border-t border-[#2B2233]/20 my-2" />

            <button
              onClick={sair}
              className="w-full text-left px-4 py-2 text-sm font-body font-semibold text-red-600 hover:bg-red-50 transition-colors rounded-lg flex items-center gap-3"
            >
              <span className="text-lg">🚪</span>
              <p>Sair</p>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
