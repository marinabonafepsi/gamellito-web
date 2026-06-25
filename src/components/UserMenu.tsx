"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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

const MENU_ITEMS = [
  {
    id: "ganhos",
    label: "Meus ganhos",
    desc: "Histórico de emoções",
    icon: "/assets/app-ui/progress_bar_tex.png",
    href: "/diario/moedas",
  },
  {
    id: "perfil",
    label: "Meu perfil",
    desc: "Avatar e configurações",
    icon: "/assets/gamellito-corpinho.svg",
    href: "/diario/conta",
  },
  {
    id: "registros",
    label: "Meus registros",
    desc: "Glicemia e gráficos",
    icon: "/assets/app-ui/Glicosimetro.png",
    href: "/diario",
  },
  {
    id: "novo",
    label: "Novo registro",
    desc: "Registrar glicemia",
    icon: "/assets/app-ui/Seringa.png",
    href: "/diario/lancar",
  },
];

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
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full border-2 border-gamellito-yellow bg-gamellito-yellow/20 overflow-hidden flex items-center justify-center hover:bg-gamellito-yellow/40 transition-colors"
        aria-label="Menu do usuário"
      >
        <img src={getAvatarSrc(avatarKey)} alt="Avatar" className="w-9 h-9 object-contain" />
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[999]"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Modal/Card do Perfil */}
      {open && (
        <div className="absolute right-0 top-14 w-96 gm-card gm-card--white z-[9999] shadow-2xl">
          {/* Header: Avatar + Moedas */}
          <div className="text-center pb-6 border-b-2 border-[#2B2233]/10">
            {/* Avatar */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full border-4 border-[#2B2233] bg-[#FFF3C9] flex items-center justify-center">
                <img
                  src={getAvatarSrc(avatarKey)}
                  alt="Avatar"
                  className="w-16 h-16 object-contain"
                />
              </div>
            </div>

            {/* Moedas */}
            {coins !== null && (
              <div className="inline-block">
                <p className="text-xs font-body text-[#2B2233]/60 font-semibold mb-1">
                  Saldo de moedas
                </p>
                <div className="gm-card gm-card--sun px-4 py-2 inline-block">
                  <p className="text-3xl font-display font-black text-[#F26A00]">
                    {coins}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Menu Navigation */}
          <div className="pt-6 space-y-2">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setOpen(false);
                  router.push(item.href);
                }}
                className="w-full group flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-[#FFF3C9]/50 transition-colors"
              >
                {/* Ícone */}
                <div className="w-10 h-10 rounded-lg bg-[#FFC400]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FFC400]/40 transition-colors">
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="w-6 h-6 object-contain"
                  />
                </div>

                {/* Texto */}
                <div className="flex-1 text-left">
                  <p className="font-body font-semibold text-[#2B2233] group-hover:text-[#F26A00] transition-colors">
                    {item.label}
                  </p>
                  <p className="text-xs font-body text-[#2B2233]/50">
                    {item.desc}
                  </p>
                </div>

                {/* Seta */}
                <span className="text-[#2B2233]/30 font-display font-bold">→</span>
              </button>
            ))}

            {/* Divider */}
            <div className="border-t border-[#2B2233]/10 my-4" />

            {/* Logout */}
            <button
              onClick={sair}
              className="w-full px-4 py-3 text-left font-body font-semibold text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Sair da conta
            </button>
          </div>

          {/* Game Dots (Design System Pattern) */}
          <div className="absolute -top-3 -right-3 flex gap-2">
            <span className="w-3 h-3 rounded-full border-2 border-[#2B2233] bg-[#EE2B2B]" />
            <span className="w-3 h-3 rounded-full border-2 border-[#2B2233] bg-[#37B6E6]" />
            <span className="w-3 h-3 rounded-full border-2 border-[#2B2233] bg-[#8DC63F]" />
          </div>
        </div>
      )}
    </div>
  );
}
