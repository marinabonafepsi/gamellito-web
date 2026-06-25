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
  const [name, setName] = useState<string | null>(null);
  const [coins, setCoins] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const client = createClient();
    client.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      const key = data.user?.user_metadata?.avatar as string | undefined;
      const userName = data.user?.user_metadata?.name as string | undefined;
      setAvatarKey(key ?? "feliz");
      setName(userName ?? "Usuário");
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
      {/* Trigger: Avatar + Name */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-1 rounded-full border-2 border-gamellito-yellow bg-gamellito-yellow/20 hover:bg-gamellito-yellow/40 transition-colors"
        aria-label="Menu do usuário"
      >
        <div className="w-8 h-8 rounded-full border border-gamellito-yellow overflow-hidden flex items-center justify-center bg-white">
          <img src={getAvatarSrc(avatarKey)} alt="Avatar" className="w-7 h-7 object-contain" />
        </div>
        <span className="text-sm font-body font-semibold text-primary-foreground hidden sm:inline truncate max-w-[120px]">
          {name}
        </span>
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 top-12 w-56 bg-white rounded-lg shadow-xl border border-[#2B2233]/20 z-[9999] overflow-hidden">
          {/* Header */}
          <div className="bg-gamellito-cream px-4 py-3 border-b border-[#2B2233]/10">
            <p className="text-sm font-body font-semibold text-[#2B2233]">{name}</p>
            {coins !== null && (
              <p className="text-xs text-[#2B2233]/60 mt-1">🪙 {coins} moedas</p>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {MENU_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setOpen(false);
                  router.push(item.href);
                }}
                className="w-full px-4 py-2 text-left text-sm font-body text-[#2B2233] hover:bg-[#FFF3C9]/50 transition-colors flex items-center gap-2"
              >
                <img src={item.icon} alt={item.label} className="w-4 h-4 object-contain" />
                {item.label}
              </button>
            ))}

            {/* Divider */}
            <div className="border-t border-[#2B2233]/10 my-1" />

            {/* Logout */}
            <button
              onClick={sair}
              className="w-full px-4 py-2 text-left text-sm font-body text-red-600 hover:bg-red-50 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
