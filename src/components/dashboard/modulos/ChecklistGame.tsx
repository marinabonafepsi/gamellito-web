'use client';

import { useState } from 'react';
import s from '../DashboardShell.module.css';
import { CHECK_A6, CHECK_A6_ALERTA } from '@/lib/modulos-content';
import { useConcluirModulo } from './ModuloCompletionContext';

export function ChecklistGame({ voltarHref: _voltarHref }: { voltarHref: string }) {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [done, setDone] = useState(false);
  const { concluir, concluindo } = useConcluirModulo();

  const toggle = (key: string) => setChecked((c) => ({ ...c, [key]: !c[key] }));

  return (
    <>
      <p className={s.psub} style={{ marginBottom: 18 }}>
        Marque os sinais que você já observou ou reconhece — quanto mais cedo identificar, mais rápido é buscar ajuda.
      </p>
      <div className={s.checklist}>
        {CHECK_A6.map((c) => (
          <div
            key={c.key}
            className={`${s.checkItem} ${checked[c.key] ? s.checkItemOn : ''}`}
            onClick={() => toggle(c.key)}
          >
            <span className={s.checkbox}>✓</span>
            <span className={s.checkLabel}>{c.label}</span>
          </div>
        ))}
      </div>
      {done ? (
        <>
          <div className={`${s.decisaoDesfecho} ${s.decisaoDesfechoWrong}`} style={{ marginTop: 16 }}>
            {CHECK_A6_ALERTA}
          </div>
          <button
            className={`${s.btn} ${s.btnOrange}`}
            style={{ marginTop: 10 }}
            disabled={concluindo}
            onClick={() => concluir(3)}
          >
            Concluir módulo
          </button>
        </>
      ) : (
        <button className={`${s.btn} ${s.btnOrange}`} style={{ marginTop: 16 }} onClick={() => setDone(true)}>
          Ver o que fazer
        </button>
      )}
    </>
  );
}
