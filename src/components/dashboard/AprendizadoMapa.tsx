'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import s from './DashboardShell.module.css';
import type { Trilha } from './DashboardShell';
import { MODULOS_DM1 } from '@/lib/modulos-content';
import { MODULOS_CRIANCA } from '@/lib/modulos-content-crianca';

interface ProgressoModulo {
  modulo_id: string;
  estrelas: number;
}

const NIVEL_ORDER = ['Primeiros passos', 'Rotina do dia a dia', 'Situações especiais', 'Autonomia e apoio'];
const NIVEL_COLORS: Record<string, string> = {
  'Primeiros passos': 'var(--game-green)',
  'Rotina do dia a dia': 'var(--game-blue)',
  'Situações especiais': 'var(--color-orange)',
  'Autonomia e apoio': 'var(--color-purple)',
};

function groupByNivel(trilhas: Trilha[], isConcluido: (t: Trilha) => boolean) {
  return NIVEL_ORDER.filter((niv) => trilhas.some((t) => t.nivel === niv)).map((niv) => {
    const items = trilhas.filter((t) => t.nivel === niv);
    return { nivel: niv, color: NIVEL_COLORS[niv], items, total: items.length, doneCount: items.filter(isConcluido).length };
  });
}

export function AprendizadoMapa({
  titulo,
  trilhas,
  contImg,
  contTitle,
  contMeta,
  contPct,
  contHref,
}: {
  titulo: string;
  trilhas: Trilha[];
  contImg: string;
  contTitle: string;
  contMeta: string;
  contPct: string;
  contHref: string;
}) {
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

  const isConcluido = (t: Trilha) => t.statusClass === 'done' || t.n.toLowerCase() in progresso;

  const doneCount = trilhas.filter(isConcluido).length;
  const progPct = Math.round((doneCount / trilhas.length) * 100);
  const grupos = groupByNivel(trilhas, isConcluido);

  return (
    <>
      <div className={s.sh}>
        <h2>{titulo}</h2>
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

      <div className={s.cont} style={{ marginBottom: 22 }}>
        <div className={s.ci}>
          <Image src={contImg} alt="" width={60} height={60} />
        </div>
        <div className={s.cbody}>
          <p className={s.eb}>Continue de onde parou</p>
          <h3>{contTitle}</h3>
          <p className={s.meta}>{contMeta}</p>
          <div className={`${s.prog} ${s.onp}`}>
            <i style={{ width: contPct }} />
          </div>
        </div>
        <Link href={contHref} className={`${s.btn} ${s.btnSun}`}>Continuar</Link>
      </div>

      {grupos.map((grp) => (
        <div key={grp.nivel}>
          <div className={s.nivelHead}>
            <span className={s.nivelBadge} style={{ background: grp.color }}>{grp.nivel}</span>
            <div className={s.nivelLine} />
            <span className={s.nivelCount}>{grp.doneCount}/{grp.total}</span>
          </div>
          <div className={s.trilhaMap}>
            {grp.items.map((t) => {
              const isDone = isConcluido(t);
              const estrelas = progresso[t.n.toLowerCase()];
              const modulo = MODULOS_DM1[t.n.toLowerCase()] || MODULOS_CRIANCA[t.n.toLowerCase()];
              const isOpenable = !!modulo;
              const stateClass = isOpenable || isDone ? s.mapNodeCurrent : s.mapNodeLocked;
              const circleBg = isDone ? 'var(--game-green)' : isOpenable ? t.color : '#fff';
              const circleBorder = isOpenable || isDone ? 'var(--color-ink)' : 'rgba(43,34,51,.25)';
              const circleGlyph = isDone ? '✓' : isOpenable ? t.n.replace(/^[AB]/, '') : '🔒';
              const statusLabel = isDone && estrelas !== undefined ? `Concluído · ${'★'.repeat(estrelas)}${'☆'.repeat(3 - estrelas)}` : t.status;
              const card = (
                <>
                  <div className={s.mapNodeCircle} style={{ background: circleBg, borderColor: circleBorder }}>
                    {circleGlyph}
                  </div>
                  <div className={s.mapNodeConnector} />
                  <div className={s.mapNodeCard}>
                    <h4>{t.title}</h4>
                    <span className={s.tag}>{t.format}</span>
                    <div className={`${s.mapNodeStatus} ${isDone ? s.mapNodeStatusDone : ''}`}>{statusLabel}</div>
                  </div>
                </>
              );
              return isOpenable ? (
                <Link key={t.n} href={`/familia/aprendizado/${t.n.toLowerCase()}`} className={`${s.mapNode} ${stateClass}`}>
                  {card}
                </Link>
              ) : (
                <div key={t.n} className={`${s.mapNode} ${s.mapNodeLocked}`}>
                  {card}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}
