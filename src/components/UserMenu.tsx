"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Modal } from "@/components/Modal";
import { track } from "@/lib/analytics";

// Avatares baseados em emoções — usados tanto no perfil quanto no humor do dia
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

  const [open,      setOpen]      = useState(false);
  const [coins,     setCoins]     = useState<number | null>(null);
  const [avatarKey, setAvatarKey] = useState<string | null>(null);

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

  async function sair() {
    track("user_signout", window.location.pathname, {});
    await createClient().auth.signOut();
    router.push("/diario/login");
  }

  if (!avatarKey) return null;

  return (
    <>
      {/* Botão na navbar */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 px-3 py-1.5 rounded-full border-2 border-gamellito-yellow bg-gamellito-yellow/10 hover:bg-gamellito-yellow/20 transition-colors"
        aria-label="Abrir perfil"
      >
        <img src={getAvatarSrc(avatarKey)} alt="Avatar" className="w-5 h-5 object-contain" />
        {coins !== null && (
          <span className="text-xs font-display font-bold text-gamellito-yellow">
            🪙 {coins}
          </span>
        )}
      </button>

      {/* Modal de perfil */}
      <Modal isOpen={open} onClose={() => setOpen(false)} variant="white">
        <div className="text-center space-y-6">
          {/* Avatar */}
          <div className="flex justify-center">
            <div className="w-24 h-24 rounded-full bg-[#FFF3C9] border-4 border-[#2B2233] shadow-md flex items-center justify-center">
              <img src={getAvatarSrc(avatarKey)} alt="Avatar" className="w-20 h-20 object-contain" />
            </div>
          </div>

          {/* Moedas */}
          {coins !== null && (
            <div className="text-center">
              <p className="text-xs text-[#6B7280] mb-1">Saldo de moedas</p>
              <p className="text-3xl font-display font-bold text-[#F26A00]">
                🪙 {coins}
              </p>
            </div>
          )}

          {/* Botões */}
          <div className="space-y-2">
            <button
              onClick={() => {
                setOpen(false);
                router.push("/diario/conta");
              }}
              className="w-full ds-btn ds-btn--lg"
            >
              Meu perfil
            </button>

            <button
              onClick={() => {
                setOpen(false);
                router.push("/diario");
              }}
              className="w-full ds-btn ds-btn--outline"
            >
              Meu diário
            </button>

            <button
              onClick={sair}
              className="w-full ds-btn ds-btn--outline text-red-600 hover:text-red-700"
            >
              Sair
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
