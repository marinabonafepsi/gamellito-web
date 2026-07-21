'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { DashboardShell, type RegistroGlicemia } from '@/components/dashboard/DashboardShell';
import { TRILHAS_DM1 } from '@/lib/trilhas-data';

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
  const [metas, setMetas] = useState<Record<string, { min: number; max: number }>>({});
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

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
        .limit(7);

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

      const { data: metasData } = await supabase
        .from('metas_glicemia')
        .select('momento, min, max')
        .eq('familia_id', user.id);

      if (metasData) {
        const map: Record<string, { min: number; max: number }> = {};
        metasData.forEach((m) => { map[m.momento] = { min: m.min, max: m.max }; });
        setMetas(map);
      }

      setLoading(false);
    };
    load();
  }, [supabase]);

  if (loading) return null;

  return (
    <DashboardShell
      variant="dm1"
      coins={coins}
      streak={streak}
      registros={registros}
      metas={metas}
      pdfHref={userId ? `/imprimir/diario/${userId}` : undefined}
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
        contHref: '/familia/aprendizado/a5',
        trilhasTitle: 'Suas trilhas',
        trilhas: TRILHAS_DM1,
      }}
    />
  );
}
