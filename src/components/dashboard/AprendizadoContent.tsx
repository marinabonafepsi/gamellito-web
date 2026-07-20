'use client';

import { useEffect, useState } from 'react';
import s from './DashboardShell.module.css';
import { TrilhasGrid } from './TrilhasGrid';
import type { Trilha } from './DashboardShell';

interface ProgressoModulo {
  modulo_id: string;
  estrelas: number;
}

interface AprendizadoContentProps {
  title: string;
  trilhas: Trilha[];
  basePath: string;
  moduloPrefix: string;
}

export function AprendizadoContent({ title, trilhas, basePath, moduloPrefix }: AprendizadoContentProps) {
  const [progresso, setProgresso] = useState<Record<string, number>>({});

  useEffect(() => {
    let ativo = true;
    fetch('/api/modulos/progresso')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!ativo || !data?.progresso) return;
        const mapa: Record<string, number> = {};
        for (const p of data.progresso as ProgressoModulo[]) {
          mapa[p.modulo_id] = p.estrelas;
        }
        setProgresso(mapa);
      })
      .catch(() => {});
    return () => {
      ativo = false;
    };
  }, []);

  const moduloIdFor = (t: Trilha) => `${moduloPrefix}${t.n}`;
  const doneCount = trilhas.filter((t) => t.statusClass === 'done' || moduloIdFor(t) in progresso).length;
  const progPct = Math.round((doneCount / trilhas.length) * 100);

  return (
    <>
      <div className={s.sh}>
        <h2>{title}</h2>
      </div>
      <div className={s.stats3} style={{ gridTemplateColumns: 'repeat(2,1fr)', marginBottom: 20 }}>
        <div className={s.scard}>
          <div className={s.sic} style={{ background: 'var(--game-green)' }}>✓</div>
          <div>
            <div className={s.snum}>{doneCount}/{trilhas.length}</div>
            <div className={s.slbl}>trilhas concluídas</div>
          </div>
        </div>
        <div className={s.scard}>
          <div className={s.sic} style={{ background: 'var(--game-blue)' }}>%</div>
          <div>
            <div className={s.snum}>{progPct}%</div>
            <div className={s.slbl}>de progresso</div>
          </div>
        </div>
      </div>
      <TrilhasGrid trilhas={trilhas} basePath={basePath} moduloIdFor={moduloIdFor} progresso={progresso} />
    </>
  );
}
