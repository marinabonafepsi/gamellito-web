'use client';

import { useState } from 'react';
import s from '../DashboardShell.module.css';
import { MOCHILA_CONTENT } from '@/lib/modulos-content-registry';
import { useConcluirModulo } from './ModuloCompletionContext';

export function MochilaGame({ moduloId }: { moduloId: string }) {
  const { intro, itens } = MOCHILA_CONTENT[moduloId];
  const [packed, setPacked] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [tentativas, setTentativas] = useState(0);
  const { concluir, concluindo } = useConcluirModulo();

  const essenciais = itens.filter((i) => i.essencial);
  const packedEssenciais = essenciais.filter((i) => packed.includes(i.key));
  const tudoEssencialNaMochila = packedEssenciais.length === essenciais.length;
  const estrelas = tentativas <= 1 ? 3 : tentativas === 2 ? 2 : 1;

  const toggle = (key: string) => {
    setPacked((p) => (p.includes(key) ? p.filter((k) => k !== key) : [...p, key]));
    setChecked(false);
  };
  const reset = () => {
    setPacked([]);
    setChecked(false);
  };

  const feedback = !checked
    ? ''
    : tudoEssencialNaMochila
      ? 'Mochila pronta! Todos os itens essenciais estão dentro.'
      : `Ainda faltam ${essenciais.length - packedEssenciais.length} item(ns) essencial(is) na mochila.`;

  return (
    <>
      <p className={s.psub} style={{ marginBottom: 18 }}>{intro}</p>
      <div className={s.pratoWrap}>
        <div className={s.plateWrap}>
          <div className={s.plate}>
            {packed.length > 0 ? (
              <div className={s.plateItems}>
                {packed.map((k) => {
                  const item = itens.find((x) => x.key === k)!;
                  return (
                    <button key={k} type="button" className={s.plateItem} title="toque para remover" onClick={() => toggle(k)}>
                      {item.glyph}
                    </button>
                  );
                })}
              </div>
            ) : (
              <span className={s.plateHint}>toque nos itens abaixo</span>
            )}
          </div>
          <div className={s.carbCounter}>
            <span className={s.carbNum}>{packedEssenciais.length}/{essenciais.length}</span>
            <span className={s.carbLabel}>itens essenciais na mochila</span>
          </div>
        </div>
        <div className={s.foodPool}>
          {itens.map((item) => (
            <div
              key={item.key}
              className={s.foodChip}
              style={{ opacity: packed.includes(item.key) ? 0.4 : 1 }}
              onClick={() => toggle(item.key)}
            >
              <span className={s.fGlyph}>{item.glyph}</span>
              <span className={s.fLabel}>{item.label}</span>
              <span className={s.fCarb}>{item.essencial ? 'essencial' : 'opcional'}</span>
            </div>
          ))}
        </div>
        {checked && (
          <p className={`${s.pratoFeedback} ${tudoEssencialNaMochila ? s.pratoFeedbackOk : s.pratoFeedbackWrong}`}>{feedback}</p>
        )}
        <div className={s.seqActions}>
          <button className={`${s.btn} ${s.btnCream} ${s.btnSm}`} onClick={reset}>Recomeçar</button>
          {checked && tudoEssencialNaMochila ? (
            <button
              className={`${s.btn} ${s.btnOrange} ${s.btnSm}`}
              disabled={concluindo}
              onClick={() => concluir(estrelas)}
            >
              Concluir módulo
            </button>
          ) : (
            <button
              className={`${s.btn} ${s.btnOrange} ${s.btnSm}`}
              onClick={() => {
                setTentativas((t) => t + 1);
                setChecked(true);
              }}
            >
              Conferir mochila
            </button>
          )}
        </div>
      </div>
    </>
  );
}
