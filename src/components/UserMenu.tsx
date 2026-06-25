"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Modal } from "@/components/Modal";
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
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const client = createClient();
    client.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      const key = data.user?.user_metadata?.avatar as string | undefined;
      setAvatarKey(key ?? "feliz");
    });
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
      {/* Botão avatar */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full border-2 border-gamellito-yellow bg-gamellito-yellow/20 overflow-hidden flex items-center justify-center hover:bg-gamellito-yellow/40 transition-colors"
        aria-label="Menu do usuário"
      >
        <img src={getAvatarSrc(avatarKey)} alt="Avatar" className="w-9 h-9 object-contain" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-12 w-48 bg-white border-4 border-[#2B2233] rounded-2xl shadow-lg overflow-hidden z-50">
          <button
            onClick={() => {
              setOpen(false);
              router.push("/diario/conta");
            }}
            className="w-full text-left px-4 py-3 text-sm font-body font-semibold text-[#2B2233] hover:bg-[#FFF3C9] transition-colors flex items-center gap-2"
          >
            <span>👤</span> Meu perfil
          </button>
          <button
            onClick={() => {
              setOpen(false);
              router.push("/diario");
            }}
            className="w-full text-left px-4 py-3 text-sm font-body font-semibold text-[#2B2233] hover:bg-[#FFF3C9] transition-colors flex items-center gap-2"
          >
            <span>📒</span> Meu diário
          </button>
          <div className="border-t border-[#2B2233]/20" />
          <button
            onClick={sair}
            className="w-full text-left px-4 py-3 text-sm font-body font-semibold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
          >
            <span>🚪</span> Sair
          </button>
        </div>
      )}
    </div>
  );
}
