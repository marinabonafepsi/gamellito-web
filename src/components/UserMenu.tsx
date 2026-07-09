'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface UserMenuProps {
  user: any;
  portalType?: string;
}

export function UserMenu({ user, portalType }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const getProfile = async () => {
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      setProfile(data);
    };
    getProfile();
  }, [user, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const dashboardLinks: Record<string, string> = {
    familia: '/familia/dashboard',
    profissional: '/profissional/dashboard',
    educador: '/educador/dashboard',
    instituicao: '/instituicao/dashboard',
    admin: '/admin/dashboard',
  };

  const profileLink = portalType
    ? `${dashboardLinks[portalType]?.replace('dashboard', 'perfil') || '/perfil'}`
    : '/perfil';

  const coins = profile?.coins ?? 0;
  const displayName = profile?.display_name || user.email?.split('@')[0] || 'Gamellito';

  return (
    <div className="relative">
      {/* Avatar pill trigger */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        data-test="btn-user-menu"
        className="flex items-center gap-2 h-[52px] pl-[5px] pr-4 bg-cream border-[3px] border-ink rounded-full shadow-pop cursor-pointer transition-all duration-150 ease-out hover:-translate-x-px hover:-translate-y-px hover:shadow-pop-lg active:translate-x-[3px] active:translate-y-[3px] active:shadow-pop-press"
      >
        <span className="w-[42px] h-[42px] rounded-full bg-sun border-2 border-ink overflow-hidden flex items-end justify-center flex-none">
          <Image src="/assets/gamellito-logo.svg" alt="Gamellito" width={40} height={40} className="w-10 h-auto -mb-0.5" />
        </span>
        <span className="hidden md:inline font-display font-bold text-base leading-none text-ink">{displayName}</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-50" onClick={() => setIsOpen(false)} />
          <div className="absolute top-[60px] right-0 w-[250px] bg-white border-[3px] border-ink rounded-[20px] shadow-pop-lg overflow-hidden z-[60] animate-dd-in">
            <div className="flex items-center gap-[11px] px-[15px] py-3.5 bg-cream border-b-2 border-ink">
              <span className="coin-ico big" />
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-display font-extrabold text-xl text-ink">{coins.toLocaleString('pt-BR')}</span>
                <span className="font-body font-bold text-[11px] text-ink/60">moedas Gamellito</span>
              </div>
              <Link
                href="/loja"
                onClick={() => setIsOpen(false)}
                className="ml-auto flex items-center gap-[5px] px-[13px] py-2 bg-orange border-2 border-ink rounded-full shadow-pop-sm text-white no-underline font-display font-bold text-[13px] cursor-pointer transition-all duration-100 hover:bg-orange-deep hover:-translate-x-px hover:-translate-y-px hover:shadow-pop active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
              >
                Trocar<span>→</span>
              </Link>
            </div>

            <Link
              href={profileLink}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-[11px] px-4 py-[13px] font-body font-bold text-sm text-ink no-underline cursor-pointer transition-colors duration-100 hover:bg-cream"
            >
              <span className="w-2.5 h-2.5 rounded-full border-2 border-ink flex-none bg-game-blue" />
              Minha conta
            </Link>
            {portalType === 'familia' && (
              <Link
                href="/familia/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-[11px] px-4 py-[13px] font-body font-bold text-sm text-ink no-underline cursor-pointer transition-colors duration-100 hover:bg-cream"
              >
                <span className="w-2.5 h-2.5 rounded-full border-2 border-ink flex-none bg-game-green" />
                Meu diário
              </Link>
            )}

            <div className="h-0.5 bg-ink/10 mx-3.5" />

            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="w-full text-left flex items-center gap-[11px] px-4 py-[13px] font-body font-bold text-sm text-game-red cursor-pointer transition-colors duration-100 hover:bg-game-red/10"
            >
              <span className="w-2.5 h-2.5 rounded-full border-2 border-ink flex-none bg-game-red" />
              Sair
            </button>
          </div>
        </>
      )}
    </div>
  );
}
