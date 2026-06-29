"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { track } from "@/lib/analytics";
import { User, Activity, Plus, LogOut } from "lucide-react";

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
  { id: "perfil",    label: "Meu perfil",       icon: User,     href: "/diario/conta" },
  { id: "registros", label: "Meus registros",   icon: Activity, href: "/diario" },
  { id: "novo",      label: "Novo registro",    icon: Plus,     href: "/diario/lancar" },
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
        aria-label="Menu do usuário"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "4px 14px 4px 6px",
          borderRadius: 999,
          border: "3px solid #2B2233",
          background: open ? "rgba(242,106,0,0.45)" : "#F26A00",
          boxShadow: open ? "none" : "3px 3px 0 #2B2233",
          cursor: "pointer",
          transition: "background 150ms, box-shadow 150ms, transform 150ms",
          transform: open ? "translate(2px,2px)" : "none",
        }}
      >
        <div style={{
          width: 32, height: 32, borderRadius: "50%",
          border: "2px solid #2B2233",
          overflow: "hidden", background: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>
          <img src={getAvatarSrc(avatarKey)} alt="Avatar" style={{ width: 28, height: 28, objectFit: "contain" }} />
        </div>
        <span className="text-sm font-body font-semibold hidden sm:inline truncate" style={{ maxWidth: 120, color: "#fff" }}>
          {name}
        </span>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[99998]"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Dropdown Menu — Design System Card */}
      {open && (
        <div className="fixed right-6 top-20 w-64 ds-card z-[99999] overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b-2 border-[#2B2233]/10" style={{ background: "#FFF3C9" }}>
            <p className="text-sm font-body font-bold text-[#2B2233]">{name}</p>
            {coins !== null && (
              <p className="text-xs text-[#2B2233]/70 mt-1 font-semibold">Moedas: {coins}</p>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {MENU_ITEMS.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setOpen(false);
                    router.push(item.href);
                  }}
                  className="w-full px-4 py-2 text-left text-sm font-body text-[#2B2233] hover:bg-[#FFC400]/20 transition-colors flex items-center gap-3"
                >
                  <IconComponent size={18} className="text-orange flex-shrink-0" />
                  {item.label}
                </button>
              );
            })}

            {/* Divider */}
            <div className="border-t-2 border-[#2B2233]/10 my-1" />

            {/* Logout */}
            <button
              onClick={sair}
              className="w-full px-4 py-2 text-left text-sm font-body text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
            >
              <LogOut size={18} className="flex-shrink-0" />
              Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
