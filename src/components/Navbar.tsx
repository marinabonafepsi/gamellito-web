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
  portalType?: 'familia' | 'profissional' | 'educador' | 'instituicao';
  navItems?: NavItem[];
}

export function Navbar({ portalType, navItems = [] }: NavbarProps) {
  const pathname = usePathname();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const isHome = pathname === '/';

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

  useEffect(() => {
    if (!isHome) {
      setActiveSection('');
      return;
    }
    const sectionIds = ['ecossistema', 'sobre'];
    const onScroll = () => {
      const offset = 140;
      let current = '';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top - offset <= 0) {
          current = id;
        }
      }
      setActiveSection(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  // Default nav items based on portal type
  const getDefaultNavItems = (): NavItem[] => {
    if (!portalType) {
      const items: NavItem[] = [];
      if (scrolled) items.push({ label: 'Início', href: '/' });
      items.push(
        { label: 'Ecossistema', href: '/#ecossistema' },
        { label: 'Sobre', href: '/#sobre' },
        { label: 'Biblioteca de artigos', href: '/biblioteca' },
        { label: 'Contato', href: '/contato' },
        { label: 'Loja', href: '/loja' },
      );
      return items;
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
            <Image className="h-16 sm:h-24 w-auto block flex-none" src="/assets/gamellito-logo.svg" alt="" width={50} height={50} />
            <Image className="h-9 sm:h-[54px] w-auto block" src="/assets/wordmark-clean.svg" alt="Gamellito" width={140} height={33} />
            <span className="font-display font-bold text-[15px] text-cream self-end mb-[13px] -ml-1 hidden sm:inline">Ltda.</span>
          </Link>

          <div className="hidden md:flex items-center gap-[3px]">
            {displayNavItems.map((item) => {
              const [itemPath, itemHash] = item.href.split('#');
              const samePage = isHome && !!itemHash && (itemPath || '/') === pathname;
              const active = itemHash
                ? activeSection === itemHash
                : pathname === (itemPath || '/') && !activeSection;
              const linkClassName = `font-display font-semibold text-[15px] no-underline px-[13px] py-[9px] rounded-full border-2 whitespace-nowrap transition-all duration-150 ease-bounce ${
                active
                  ? 'bg-sun text-ink border-ink shadow-pop-sm'
                  : 'text-white border-transparent hover:bg-cream hover:text-ink hover:border-ink hover:shadow-pop-sm hover:-translate-x-px hover:-translate-y-px'
              }`;
              // Same-page section links use a native anchor: Next's <Link> doesn't
              // reliably scroll to a hash when the route itself doesn't change.
              if (samePage) {
                return (
                  <a key={item.href} href={`#${itemHash}`} className={linkClassName}>
                    {item.label}
                  </a>
                );
              }
              return (
                <Link key={item.href} href={item.href} className={linkClassName}>
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
                  <>
                    {/* Mobile: full-page auth flow (native-feeling, no modal fighting for space) */}
                    <span className="md:hidden">
                      <Link href="/auth/login" className="btn btn-sun !text-[13px] !py-2 !px-3.5">
                        Entrar
                      </Link>
                    </span>
                    {/* Desktop: quick modal */}
                    <span className="hidden md:inline-block">
                      <button
                        type="button"
                        onClick={() => setAuthOpen(true)}
                        className="btn btn-sun !text-[15px] !py-2.5 !px-5"
                      >
                        Entrar
                      </button>
                    </span>
                  </>
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
              const [itemPath, itemHash] = item.href.split('#');
              const samePage = isHome && !!itemHash && (itemPath || '/') === pathname;
              const active = itemHash
                ? activeSection === itemHash
                : pathname === (itemPath || '/') && !activeSection;
              const linkClassName = `block font-display font-semibold text-[15px] no-underline px-5 py-3 transition-colors ${
                i < displayNavItems.length - 1 ? 'border-b-2 border-white/10' : ''
              } ${active ? 'bg-sun text-ink' : 'text-white hover:bg-cream hover:text-ink'}`;
              if (samePage) {
                return (
                  <a key={item.href} href={`#${itemHash}`} className={linkClassName}>
                    {item.label}
                  </a>
                );
              }
              return (
                <Link key={item.href} href={item.href} className={linkClassName}>
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
