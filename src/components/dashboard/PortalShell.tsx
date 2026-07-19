'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import s from './DashboardShell.module.css';
import { type DashboardVariant, BASE_PATH_BY_VARIANT } from './DashboardShell';

const ROLE_TAG: Record<DashboardVariant, string> = {
  dm1: 'Família',
  prof: 'Professor',
  saude: 'Saúde',
};

const EXTRA_NAV_BY_VARIANT: Record<DashboardVariant, { color: string; label: string; href: string }[]> = {
  dm1: [
    { color: 'var(--game-red)', label: 'Diário de glicemia', href: '/familia/diario' },
    { color: 'var(--game-blue)', label: 'Medicamentos', href: '/familia/medicamentos' },
  ],
  prof: [],
  saude: [
    { color: 'var(--game-blue)', label: 'Repositório de artigos', href: '/profissional/recursos' },
    { color: 'var(--game-magenta)', label: 'Relatórios', href: '/profissional/relatorios' },
  ],
};

interface PortalShellProps {
  variant: DashboardVariant;
  accountHref: string;
  children: React.ReactNode;
}

export function PortalShell({ variant, accountHref, children }: PortalShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [userName, setUserName] = useState('');
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('name, coins')
        .eq('user_id', user.id)
        .single();
      setUserName(profile?.name || user.email?.split('@')[0] || 'Gamellito');
      setCoins(profile?.coins || 0);
    };
    load();
  }, [supabase]);

  useEffect(() => {
    const onCoinsUpdated = (e: Event) => {
      const detail = (e as CustomEvent<{ coins: number }>).detail;
      if (typeof detail?.coins === 'number') setCoins(detail.coins);
    };
    window.addEventListener('gamellito:coins-updated', onCoinsUpdated);
    return () => window.removeEventListener('gamellito:coins-updated', onCoinsUpdated);
  }, []);

  const basePath = BASE_PATH_BY_VARIANT[variant];

  const navItems = [
    { color: 'var(--color-sun)', label: 'Dashboard', href: `${basePath}/dashboard` },
    { color: 'var(--game-pink)', label: 'Aprendizado', href: `${basePath}/aprendizado` },
    ...EXTRA_NAV_BY_VARIANT[variant],
    { color: 'var(--color-sun)', label: 'Conquistas', href: `${basePath}/conquistas` },
    { color: 'var(--game-green)', label: 'Loja', href: '/loja' },
    { color: 'var(--color-lilac)', label: 'Minha conta', href: accountHref },
  ];

  const mobileTabs = [
    { color: 'var(--game-pink)', label: 'Início', href: `${basePath}/dashboard` },
    ...(variant === 'dm1'
      ? [{ color: 'var(--game-red)', label: 'Diário', href: '/familia/diario' }]
      : variant === 'saude'
        ? [{ color: 'var(--game-blue)', label: 'Artigos', href: '/profissional/recursos' }]
        : []),
    { color: 'var(--color-sun)', label: 'Conquistas', href: `${basePath}/conquistas` },
    { color: 'var(--game-green)', label: 'Loja', href: '/loja' },
    { color: 'var(--color-lilac)', label: 'Conta', href: accountHref },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  return (
    <div className={s.app}>
      {/* ================= SIDEBAR ================= */}
      <aside className={s.side}>
        <div className={s.sideBrand}>
          <Image src="/assets/gamellito-logo.svg" alt="" width={42} height={42} />
          <div className={s.wm}>
            Gamellito
            <small>{ROLE_TAG[variant]}</small>
          </div>
        </div>

        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${s.navI} ${pathname === item.href ? s.active : ''}`}
          >
            <span className={s.nd} style={{ background: item.color }} />
            {item.label}
          </Link>
        ))}

        <div className={s.sideFoot}>
          <div className={s.sideUser}>
            <span className={s.avatar} style={{ width: 38, height: 38 }}>
              <Image src="/assets/gamellito-logo.svg" alt="" width={32} height={32} />
            </span>
            <div>
              <div className={s.name}>{userName}</div>
              <div className={s.coins}>{coins.toLocaleString('pt-BR')} moedas</div>
            </div>
          </div>
          <button className={s.sideLogout} onClick={handleLogout}>
            Sair
          </button>
        </div>
      </aside>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <nav className={s.bottomNav}>
        {mobileTabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`${s.bnItem} ${pathname === tab.href ? s.active : ''}`}
          >
            <span className={s.nd} style={{ background: tab.color }} />
            {tab.label}
          </Link>
        ))}
      </nav>
      {variant === 'dm1' && (
        <button
          type="button"
          aria-label="Registrar glicemia"
          className={s.fab}
          onClick={() => router.push('/familia/diario')}
        >
          +
        </button>
      )}

      {/* ================= MAIN ================= */}
      <main className={s.main}>
        <div className={s.wrap}>{children}</div>
      </main>
    </div>
  );
}
