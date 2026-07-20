'use client';

import { useState } from 'react';
import s from '../DashboardShell.module.css';
import { ARTIGO_CONTENT } from '@/lib/modulos-content-registry';
import { useConcluirModulo } from './ModuloCompletionContext';

export function ArtigoModulo({ moduloId }: { moduloId: string }) {
  const { intro, paragrafos, destaque } = ARTIGO_CONTENT[moduloId];
  const [lido, setLido] = useState(false);
  const { concluir, concluindo } = useConcluirModulo();

  return (
    <>
      <p className={s.psub} style={{ marginBottom: 18 }}>{intro}</p>
      <div className={s.acolhimento}>
        {paragrafos.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      {destaque && (
        <div className={`${s.decisaoDesfecho} ${s.decisaoDesfechoOk}`} style={{ marginTop: 16, marginBottom: 16 }}>
          {destaque}
        </div>
      )}
      <div
        className={`${s.checkItem} ${lido ? s.checkItemOn : ''}`}
        style={{ marginBottom: 18, marginTop: destaque ? 0 : 16 }}
        onClick={() => setLido((v) => !v)}
      >
        <span className={s.checkbox}>✓</span>
        <span className={s.checkLabel}>Já li e entendi</span>
      </div>
      <button
        className={`${s.btn} ${s.btnOrange}`}
        disabled={!lido || concluindo}
        onClick={() => concluir(3)}
      >
        {lido ? 'Concluir módulo' : 'Marque que já leu para continuar'}
      </button>
    </>
  );
}
