'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { DashboardShell, type RegistroGlicemia } from '@/components/dashboard/DashboardShell';

const ROTULO_LABEL: Record<string, string> = {
  jejum: 'Jejum',
  antes: 'Antes de comer',
  depois: 'Depois de comer',
  dormir: 'Antes de dormir',
};

const ROTULO_DOT: Record<string, string> = {
  jejum: 'var(--game-green)',
  antes: 'var(--color-purple)',
  depois: 'var(--game-blue)',
  dormir: 'var(--color-purple)',
};

const TRILHAS_DM1 = [
  { n: '1', color: 'var(--game-red)', title: 'Os primeiros 30 dias', format: 'vídeo', lessons: '4 aulas', pct: '100%', barClass: 'g', status: 'concluída', statusClass: 'done' },
  { n: '2', color: 'var(--game-blue)', title: 'Entendendo o DM1', format: 'texto + quiz', lessons: '4 aulas', pct: '75%', status: '3/4' },
  { n: '3', color: 'var(--game-green)', title: 'No dia a dia', format: 'vídeo', lessons: '6 aulas', pct: '40%', status: 'em andamento' },
  { n: '4', color: 'var(--color-purple-soft)', title: 'Sentimentos após o diagnóstico', format: 'texto', lessons: '3 aulas', pct: '0%', status: 'começar' },
  { n: '5', color: 'var(--game-magenta)', title: 'Adolescência com DM1', format: 'vídeo + quiz', lessons: '4 aulas', pct: '0%', status: 'começar' },
  { n: '6', color: 'var(--color-orange)', title: 'DM1 na escola', format: 'texto', lessons: '3 aulas', pct: '20%', status: '1/3' },
];

function formatWhen(dataHora: string) {
  const d = new Date(dataHora);
  const hoje = new Date();
  const isHoje = d.toDateString() === hoje.toDateString();
  const hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  return isHoje ? `hoje, ${hora}` : `${d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}, ${hora}`;
}

export default function FamiliaDashboardPage() {
  const [userName, setUserName] = useState('');
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [registros, setRegistros] = useState<RegistroGlicemia[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const router = useRouter();

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

      const { data: regs } = await supabase
        .from('registros')
        .select('*')
        .eq('familia_id', user.id)
        .order('data_hora', { ascending: false })
        .limit(3);

      if (regs) {
        setRegistros(
          regs.map((r) => ({
            id: r.id,
            valor: r.valor,
            rotulo: ROTULO_LABEL[r.rotulo] || r.rotulo,
            when: formatWhen(r.data_hora),
            dot: ROTULO_DOT[r.rotulo] || 'var(--color-purple)',
          }))
        );
        setStreak(regs.length);
      }

      setLoading(false);
    };
    load();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) return null;

  return (
    <DashboardShell
      variant="dm1"
      userName={userName}
      coins={coins}
      streak={streak}
      onLogout={handleLogout}
      accountHref="/familia/perfil"
      registros={registros}
      onOpenRegistro={() => router.push('/familia/diario')}
      content={{
        greetEb: 'Bom te ver de novo',
        greetName: `Oi, ${userName}!`,
        progPct: 39,
        progLbl: 'do seu aprendizado',
        contImg: '/assets/gamellito-glicosimetro.svg',
        contTitle: 'Reconhecer hipoglicemia',
        contMeta: 'Trilha "No dia a dia" · aula 3 de 6',
        contPct: '40%',
        trilhasTitle: 'Suas trilhas',
        trilhas: TRILHAS_DM1,
      }}
    />
  );
}
