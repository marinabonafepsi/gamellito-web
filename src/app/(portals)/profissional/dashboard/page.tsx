'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { DashboardShell } from '@/components/dashboard/DashboardShell';

const TRILHAS_SAUDE = [
  { n: '1', color: 'var(--game-blue)', title: 'Educação em saúde lúdica', format: 'vídeo', lessons: '4 aulas', pct: '100%', barClass: 'g', status: 'concluída', statusClass: 'done' },
  { n: '2', color: 'var(--game-green)', title: 'Rodas de conversa', format: 'texto', lessons: '3 aulas', pct: '80%', status: 'em andamento' },
  { n: '3', color: 'var(--color-orange)', title: 'Monitoramento de resultados', format: 'vídeo + quiz', lessons: '4 aulas', pct: '55%', status: 'em andamento' },
  { n: '4', color: 'var(--game-magenta)', title: 'Embasamento científico', format: 'texto', lessons: '3 aulas', pct: '0%', status: 'começar' },
];

export default function ProfissionalDashboardPage() {
  const [userName, setUserName] = useState('');
  const [coins, setCoins] = useState(0);
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
      variant="saude"
      userName={userName}
      coins={coins}
      streak={15}
      onLogout={handleLogout}
      accountHref="/profissional/perfil"
      content={{
        greetEb: 'Cuidando de quem cuida',
        greetName: `Oi, ${userName}!`,
        progPct: 71,
        progLbl: 'da metodologia',
        contImg: '/assets/gamellito-glicosimetro.svg',
        contTitle: 'Monitoramento de resultados',
        contMeta: 'Trilha "Método Gamellito" · módulo 3 de 4',
        contPct: '55%',
        trilhasTitle: 'Método Gamellito',
        trilhas: TRILHAS_SAUDE,
      }}
    />
  );
}
