'use client';

import { useState } from 'react';
import s from '../DashboardShell.module.css';
import { GLOSS_A1, A1_ACOLHIMENTO } from '@/lib/modulos-content';
import { useConcluirModulo } from './ModuloCompletionContext';

export function GlossarioFlip({ voltarHref }: { voltarHref: string }) {
  const [flipped, setFlipped] = useState<Record<number, boolean>>({});
  const { concluir, concluindo } = useConcluirModulo();
  const todasViradas = GLOSS_A1.every((_, i) => flipped[i]);

  return (
    <>
      <div className={s.acolhimento}>
        {A1_ACOLHIMENTO.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <h3 style={{ fontSize: 18, color: 'var(--color-ink)', marginBottom: 4 }}>Glossário vivo</h3>
      <p className={s.psub} style={{ marginBottom: 14 }}>Toque em cada cartão para virar e ver o significado</p>
      <div className={s.glossGrid}>
        {GLOSS_A1.map((g, i) => (
          <button
            key={g.term}
            type="button"
            className={`${s.flipCard} ${flipped[i] ? s.flipCardFlipped : ''}`}
            onClick={() => setFlipped((f) => ({ ...f, [i]: !f[i] }))}
            style={{ background: 'none', border: 0, padding: 0 }}
          >
            <div className={s.flipInner}>
              <div className={`${s.flipFace} ${s.flipFront}`}>
                <div className={s.ft}>{g.term}</div>
                <div className={s.fhint}>toque para virar</div>
              </div>
              <div className={`${s.flipFace} ${s.flipBack}`}>
                <p>{g.def}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      <button
        type="button"
        className={`${s.btn} ${s.btnOrange}`}
        style={{ marginTop: 26 }}
        disabled={!todasViradas || concluindo}
        onClick={() => concluir(3)}
      >
        {todasViradas ? 'Concluir módulo' : 'Vire todos os cartões'}
      </button>
    </>
  );
}
