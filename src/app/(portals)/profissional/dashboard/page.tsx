'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  DashboardShell,
  type Recurso,
  type PacienteResumo,
  type Artigo,
  type NovoArtigo,
} from '@/components/dashboard/DashboardShell';
import { TRILHAS_SAUDE } from '@/lib/trilhas-data';

export default function ProfissionalDashboardPage() {
  const [userName, setUserName] = useState('');
  const [coins, setCoins] = useState(0);
  const [materiais, setMateriais] = useState<Recurso[]>([]);
  const [pacientes, setPacientes] = useState<PacienteResumo[]>([]);
  const [artigos, setArtigos] = useState<Artigo[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();

  const loadArtigos = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('biblioteca_artigos')
      .select('id, titulo, autores, ano, categoria, status')
      .eq('submetido_por', user.id)
      .order('criado_em', { ascending: false });

    setArtigos((data as Artigo[]) || []);
  }, [supabase]);

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
        fetch('/api/recursos?papel=profissional').then((r) => (r.ok ? r.json() : { materiais: [] })),
        fetch('/api/pacientes').then((r) => (r.ok ? r.json() : { pacientes: [] })),
      ]);

      setMateriais(recursosRes.materiais || []);
      setPacientes(pacientesRes.pacientes || []);
      await loadArtigos();

      setLoading(false);
    };
    load();
  }, [supabase, loadArtigos]);

  const handleSubmitArtigo = async (novo: NovoArtigo) => {
    const response = await fetch('/api/biblioteca', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novo),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || 'Erro ao enviar artigo');
    }

    await loadArtigos();
  };

  if (loading) return null;

  return (
    <DashboardShell
      variant="saude"
      coins={coins}
      streak={15}
      materiais={materiais}
      pacientes={pacientes}
      pacienteHref={(id) => `/profissional/paciente/${id}`}
      artigos={artigos}
      onSubmitArtigo={handleSubmitArtigo}
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
