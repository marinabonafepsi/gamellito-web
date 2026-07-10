'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { DashboardShell, type Recurso, type PacienteResumo } from '@/components/dashboard/DashboardShell';

const TRILHAS_PROF = [
  { n: '1', color: 'var(--game-blue)', title: 'Identificar sinais do DM1', format: 'vídeo', lessons: '3 aulas', pct: '100%', barClass: 'g', status: 'concluída', statusClass: 'done' },
  { n: '2', color: 'var(--game-green)', title: 'Acolher o aluno', format: 'texto', lessons: '3 aulas', pct: '60%', status: 'em andamento' },
  { n: '3', color: 'var(--color-orange)', title: 'Agir em emergências', format: 'vídeo + quiz', lessons: '4 aulas', pct: '30%', status: 'em andamento' },
  { n: '4', color: 'var(--game-pink)', title: 'Inclusão da turma', format: 'texto', lessons: '3 aulas', pct: '0%', status: 'começar' },
];

export default function EducadorDashboardPage() {
  const [userName, setUserName] = useState('');
  const [coins, setCoins] = useState(0);
  const [atividades, setAtividades] = useState<Recurso[]>([]);
  const [alunos, setAlunos] = useState<PacienteResumo[]>([]);
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

      const [recursosRes, pacientesRes] = await Promise.all([
        fetch('/api/recursos?papel=educador').then((r) => (r.ok ? r.json() : { atividades: [] })),
        fetch('/api/pacientes').then((r) => (r.ok ? r.json() : { pacientes: [] })),
      ]);

      setAtividades(recursosRes.atividades || []);
      setAlunos(pacientesRes.pacientes || []);

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
      variant="prof"
      userName={userName}
      coins={coins}
      streak={8}
      onLogout={handleLogout}
      accountHref="/educador/perfil"
      atividades={atividades}
      alunos={alunos}
      content={{
        greetEb: 'Sua turma agradece',
        greetName: `Oi, ${userName}!`,
        progPct: 63,
        progLbl: 'da sua formação',
        contImg: '/assets/gamellito-adventures.svg',
        contTitle: 'Agir com segurança em emergências',
        contMeta: 'Formação "Gamellito na escola" · módulo 3 de 4',
        contPct: '30%',
        trilhasTitle: 'Sua formação',
        trilhas: TRILHAS_PROF,
      }}
    />
  );
}
