'use client';

import { useState } from 'react';
import s from '../DashboardShell.module.css';
import { PRATO_FOODS, PRATO_TARGET } from '@/lib/modulos-content';
import { useConcluirModulo } from './ModuloCompletionContext';

export function PratoGame({ voltarHref: _voltarHref }: { voltarHref: string }) {
  const [items, setItems] = useState<string[]>([]);
  const [checked, setChecked] = useState(false);
  const [tentativas, setTentativas] = useState(0);
  const { concluir, concluindo } = useConcluirModulo();

  const total = items.reduce((sum, k) => sum + (PRATO_FOODS.find((f) => f.key === k)?.carbs ?? 0), 0);
  const inRange = total >= PRATO_TARGET.min && total <= PRATO_TARGET.max;
  const estrelas = tentativas <= 1 ? 3 : tentativas === 2 ? 2 : 1;

  const add = (key: string) => {
    setItems((it) => [...it, key]);
    setChecked(false);
  };
  const remove = (key: string) => {
    const idx = items.indexOf(key);
    if (idx === -1) return;
    setItems((it) => it.filter((_, i) => i !== idx));
    setChecked(false);
  };
  const reset = () => {
    setItems([]);
    setChecked(false);
  };

  const feedback = !checked ? '' : total < PRATO_TARGET.min
    ? `Faltam carboidratos — esse prato tem ${total}g, tente chegar entre ${PRATO_TARGET.min} e ${PRATO_TARGET.max}g.`
    : total > PRATO_TARGET.max
      ? `Um pouco além do ideal — esse prato tem ${total}g, tente tirar algo para chegar entre ${PRATO_TARGET.min} e ${PRATO_TARGET.max}g.`
      : `Prato equilibrado! ${total}g de carboidrato — na faixa certa para essa refeição.`;

  return (
    <>
      <p className={s.psub} style={{ marginBottom: 18 }}>
        Monte um prato de almoço com carboidrato entre {PRATO_TARGET.min}g e {PRATO_TARGET.max}g
      </p>
      <div className={s.pratoWrap}>
        <div className={s.plateWrap}>
          <div className={s.plate}>
            {items.length > 0 ? (
              <div className={s.plateItems}>
                {items.map((k, i) => {
                  const f = PRATO_FOODS.find((x) => x.key === k)!;
                  return (
                    <button key={`${k}-${i}`} type="button" className={s.plateItem} title="toque para remover" onClick={() => remove(k)}>
                      {f.glyph}
                    </button>
                  );
                })}
              </div>
            ) : (
              <span className={s.plateHint}>toque nos alimentos abaixo</span>
            )}
          </div>
          <div className={s.carbCounter}>
            <span className={s.carbNum}>{total}g</span>
            <span className={s.carbLabel}>carboidrato no prato</span>
          </div>
        </div>
        <div className={s.foodPool}>
          {PRATO_FOODS.map((f) => (
            <div key={f.key} className={s.foodChip} onClick={() => add(f.key)}>
              <span className={s.fGlyph}>{f.glyph}</span>
              <span className={s.fLabel}>{f.label}</span>
              <span className={s.fCarb}>{f.carbs}g</span>
            </div>
          ))}
        </div>
        {checked && (
          <p className={`${s.pratoFeedback} ${inRange ? s.pratoFeedbackOk : s.pratoFeedbackWrong}`}>{feedback}</p>
        )}
        <div className={s.seqActions}>
          <button className={`${s.btn} ${s.btnCream} ${s.btnSm}`} onClick={reset}>Recomeçar</button>
          {checked && inRange ? (
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
              Conferir prato
            </button>
          )}
        </div>
      </div>
    </>
  );
}
