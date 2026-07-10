'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { UserMenu } from './UserMenu';
import { AuthModal } from './AuthModal';

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  portalType?: 'familia' | 'profissional' | 'educador' | 'instituicao' | 'admin';
  navItems?: NavItem[];
}

export function Navbar({ portalType, navItems = [] }: NavbarProps) {
  const pathname = usePathname();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, [supabase]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Default nav items based on portal type
  const getDefaultNavItems = (): NavItem[] => {
    if (!portalType) {
      return [
        { label: 'Início', href: '/' },
        { label: 'Sobre', href: '/sobre' },
        { label: 'Ecossistema', href: '/ecossistema' },
        { label: 'Biblioteca de artigos', href: '/biblioteca' },
        { label: 'Loja', href: '/loja' },
      ];
    }

    const navs: Record<string, NavItem[]> = {
      familia: [
        { label: 'Dashboard', href: '/familia/dashboard' },
        { label: 'Meu Diário', href: '/familia/diario' },
        { label: 'Jogos', href: '/jogos' },
        { label: 'Loja', href: '/loja' },
      ],
      profissional: [
        { label: 'Meus Pacientes', href: '/profissional/dashboard' },
        { label: 'Relatórios', href: '/profissional/relatorios' },
        { label: 'Recursos', href: '/profissional/recursos' },
        { label: 'Biblioteca', href: '/biblioteca' },
      ],
      educador: [
        { label: 'Meus Grupos', href: '/educador/dashboard' },
        { label: 'Recursos', href: '/educador/recursos' },
        { label: 'Forum', href: '/educador/forum' },
      ],
      instituicao: [
        { label: 'Dashboard', href: '/instituicao/dashboard' },
        { label: 'Grupos', href: '/instituicao/grupos' },
        { label: 'Equipe', href: '/instituicao/equipe' },
        { label: 'Relatórios', href: '/instituicao/relatorios' },
      ],
      admin: [
        { label: 'Dashboard', href: '/admin/dashboard' },
        { label: 'Usuários', href: '/admin/usuarios' },
        { label: 'Instituições', href: '/admin/instituicoes' },
        { label: 'Analytics', href: '/admin/analytics' },
      ],
    };

    return navs[portalType] || navItems;
  };

  const displayNavItems = navItems.length > 0 ? navItems : getDefaultNavItems();

  return (
    <div className="sticky top-0 z-40 px-4 sm:px-10 pt-4 pb-2 bg-transparent">
      <div className="max-w-[1180px] mx-auto">
        <nav
          className="relative flex items-center justify-between h-[74px] bg-purple-soft border-[3px] border-ink rounded-[18px] shadow-pop-lg font-display"
        >
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3 h-full pl-3 pr-4 sm:pl-5 sm:pr-6 no-underline bg-purple-deep rounded-[15px_46px_46px_15px]"
          >
            <Image className="h-[38px] sm:h-[50px] w-auto block flex-none" src="/assets/gamellito-logo.svg" alt="" width={50} height={50} />
            <Image className="h-[24px] sm:h-[33px] w-auto block" src="/assets/wordmark-clean.svg" alt="Gamellito" width={140} height={33} />
            <span className="font-display font-bold text-[15px] text-cream self-end -mb-0 -ml-1 hidden sm:inline">Ltda.</span>
          </Link>

          <div className="hidden md:flex items-center gap-[3px]">
            {displayNavItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-display font-semibold text-[15px] no-underline px-[13px] py-[9px] rounded-full border-2 whitespace-nowrap transition-all duration-150 ease-bounce ${
                    active
                      ? 'bg-sun text-ink border-ink shadow-pop-sm'
                      : 'text-white border-transparent hover:bg-cream hover:text-ink hover:border-ink hover:shadow-pop-sm hover:-translate-x-px hover:-translate-y-px'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="relative flex items-center gap-2 pr-2 sm:pr-3.5">
            {!loading && (
              <>
                {user ? (
                  <UserMenu user={user} portalType={portalType} />
                ) : (
                  <button
                    type="button"
                    onClick={() => setAuthOpen(true)}
                    className="btn btn-sun !text-[13px] sm:!text-[15px] !py-2 !px-3.5 sm:!py-2.5 sm:!px-5"
                  >
                    Entrar
                  </button>
                )}
              </>
            )}

            <button
              type="button"
              aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full border-2 border-transparent hover:bg-cream hover:border-ink text-white hover:text-ink transition-colors flex-none"
            >
              {mobileOpen ? (
                <span className="text-xl leading-none font-display font-bold">✕</span>
              ) : (
                <span className="flex flex-col gap-[5px]">
                  <span className="block w-5 h-[3px] bg-current rounded-full" />
                  <span className="block w-5 h-[3px] bg-current rounded-full" />
                  <span className="block w-5 h-[3px] bg-current rounded-full" />
                </span>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile dropdown panel */}
        {mobileOpen && (
          <div className="md:hidden mt-2 bg-purple-soft border-[3px] border-ink rounded-[18px] shadow-pop-lg overflow-hidden animate-dd-in">
            {displayNavItems.map((item, i) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block font-display font-semibold text-[15px] no-underline px-5 py-3 transition-colors ${
                    i < displayNavItems.length - 1 ? 'border-b-2 border-white/10' : ''
                  } ${active ? 'bg-sun text-ink' : 'text-white hover:bg-cream hover:text-ink'}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </div>
  );
}
