'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import s from './DashboardShell.module.css';
import { TRILHAS_DM1_CRIANCA } from '@/lib/trilhas-data';

interface VinculoFamilia {
  id: string;
  dm1UserId: string;
  nome: string;
}

// Vista somente-leitura do progresso do DM1 vinculado — os pais têm a
// própria trilha (acima) e só acompanham o quanto a criança/adolescente já
// avançou na trilha dela, sem navegar pelo conteúdo dela.
export function ProgressoVinculado() {
  const [vinculos, setVinculos] = useState<VinculoFamilia[]>([]);
  const [progressoPorDm1, setProgressoPorDm1] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ativo = true;
    const load = async () => {
      const res = await fetch('/api/familia/vinculos');
      if (!res.ok || !ativo) return;
      const data = await res.json();
      const lista: VinculoFamilia[] = data.vinculosComoFamilia || [];
      if (!ativo) return;
      setVinculos(lista);

      const entries = await Promise.all(
        lista.map(async (v) => {
          const r = await fetch(`/api/modulos/progresso?dm1_id=${v.dm1UserId}`);
          if (!r.ok) return [v.dm1UserId, 0] as const;
          const d = await r.json();
          return [v.dm1UserId, (d.progresso || []).length] as const;
        })
      );
      if (!ativo) return;
      setProgressoPorDm1(Object.fromEntries(entries));
      setLoading(false);
    };
    load();
    return () => {
      ativo = false;
    };
  }, []);

  if (loading || vinculos.length === 0) return null;

  return (
    <>
      <div className={s.sh} style={{ marginTop: 30 }}>
        <h2>Progresso da criança</h2>
      </div>
      {vinculos.map((v) => {
        const done = progressoPorDm1[v.dm1UserId] || 0;
        const total = TRILHAS_DM1_CRIANCA.length;
        const pct = Math.round((done / total) * 100);
        return (
          <div key={v.id} className={s.panel} style={{ marginBottom: 16 }}>
            <h3>{v.nome}</h3>
            <p className={s.psub}>{done} de {total} módulos concluídos</p>
            <div className={`${s.prog} ${s.g}`}>
              <i style={{ width: `${pct}%` }} />
            </div>
            <div style={{ marginTop: 14 }}>
              <Link href={`/familia/vinculo/${v.dm1UserId}`} className={`${s.btn} ${s.btnCream} ${s.btnSm}`}>
                Ver diário de glicemia
              </Link>
            </div>
          </div>
        );
      })}
    </>
  );
}
