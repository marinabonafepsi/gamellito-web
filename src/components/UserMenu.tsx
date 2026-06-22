"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { siteAssets } from "@/components/SiteAssets";
import { track } from "@/lib/analytics";

// Avatares baseados em emoções — usados tanto no perfil quanto no humor do dia
export const GAMELLITO_AVATARS = [
  { key: "feliz",   label: "Feliz",      diagnostico: "Humor: Feliz",      src: siteAssets.gamellitoFelizMaoNaBarriga },
  { key: "animado", label: "Animado",    diagnostico: "Humor: Animado",    src: siteAssets.gamellitoContente },
  { key: "raiva",   label: "Com raiva",  diagnostico: "Humor: Com raiva",  src: siteAssets.gamellitoFurioso },
  { key: "medo",    label: "Com medo",   diagnostico: "Humor: Com medo",   src: siteAssets.olhoDesconfiado },
] as const;

export type AvatarKey = typeof GAMELLITO_AVATARS[number]["key"];

export function getAvatarSrc(key: string | null | undefined): string {
  const found = GAMELLITO_AVATARS.find((a) => a.key === key);
  return found?.src ?? siteAssets.gamellitoFelizMaoNaBarriga;
}

export default function UserMenu() {
  const router = useRouter();
  const [avatarKey, setAvatarKey] = useState<string | null>(null);
  const [coins,     setCoins]     = useState<number | null>(null);
  const [open,      setOpen]      = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    createClient().auth.getUser().then(({ data }) => {
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
    setOpen(false);
    router.push("/diario/login");
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Menu do usuário"
        className="flex items-center gap-2 rounded-full pl-2 pr-3 py-1 border-2 border-primary bg-gamellito-yellow/10 hover:border-gamellito-yellow transition-colors"
      >
        <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center">
          {avatarKey && (
            <img src={getAvatarSrc(avatarKey)} alt="Avatar" className="w-7 h-7 object-contain" />
          )}
        </div>
        {coins !== null && (
          <span className="text-xs font-body font-bold text-gamellito-yellow tabular-nums">
            🪙 {coins}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-48 bg-gamellito-space border border-gamellito-purple/40 rounded-2xl shadow-lg overflow-hidden z-50">
          {coins !== null && (
            <div className="px-4 py-2.5 border-b border-gamellito-purple/20 flex items-center gap-2">
              <span className="text-base">🪙</span>
              <span className="text-sm font-body font-bold text-gamellito-yellow">{coins} moedas</span>
            </div>
          )}
          <Link
            href="/diario/conta"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-3 text-sm font-body font-semibold text-primary-foreground hover:bg-gamellito-purple/20 transition-colors"
          >
            <span className="text-base">👤</span> Minha conta
          </Link>
          <Link
            href="/diario"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-4 py-3 text-sm font-body font-semibold text-primary-foreground hover:bg-gamellito-purple/20 transition-colors"
          >
            <span className="text-base">📒</span> Meu diário
          </Link>
          <div className="border-t border-gamellito-purple/20 mx-3" />
          <button
            onClick={sair}
            className="w-full text-left flex items-center gap-2 px-4 py-3 text-sm font-body font-semibold text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <span className="text-base">🚪</span> Sair
          </button>
        </div>
      )}
    </div>
  );
}
