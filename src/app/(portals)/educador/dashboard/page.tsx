'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { DashboardShell, type Recurso, type PacienteResumo } from '@/components/dashboard/DashboardShell';
import { TRILHAS_PROF } from '@/lib/trilhas-data';

export default function EducadorDashboardPage() {
  const [userName, setUserName] = useState('');
  const [coins, setCoins] = useState(0);
  const [atividades, setAtividades] = useState<Recurso[]>([]);
  const [alunos, setAlunos] = useState<PacienteResumo[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

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

  if (loading) return null;

  return (
    <DashboardShell
      variant="prof"
      coins={coins}
      streak={8}
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
