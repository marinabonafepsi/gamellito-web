'use client';

import { useState } from 'react';
import s from '../DashboardShell.module.css';
import { ROUNDS_A2, SEQ_ITEMS, SEQ_REACTIONS } from '@/lib/modulos-content';
import { useConcluirModulo } from './ModuloCompletionContext';

export function SequenciaGame({ voltarHref: _voltarHref }: { voltarHref: string }) {
  const { concluir, concluindo } = useConcluirModulo();
  const [round, setRound] = useState(0);
  const [placed, setPlaced] = useState<string[]>([]);
  const [result, setResult] = useState<'ok' | 'wrong' | null>(null);
  const [errors, setErrors] = useState(0);
  const [shake, setShake] = useState(false);
  const [starsTotal, setStarsTotal] = useState(0);

  const roundDef = ROUNDS_A2[round];
  const isLastRound = round === ROUNDS_A2.length - 1;

  const place = (key: string) => {
    if (placed.length >= 3) return;
    setPlaced((p) => [...p, key]);
    setResult(null);
  };

  const remove = (key: string) => {
    setPlaced((p) => p.filter((k) => k !== key));
    setResult(null);
  };

  const check = () => {
    const ok = placed.length === 3 && placed.every((k, i) => k === roundDef.order[i]);
    if (ok) {
      const stars = errors === 0 ? 3 : errors <= 2 ? 2 : 1;
      setResult('ok');
      setStarsTotal((t) => t + stars);
    } else {
      setResult('wrong');
      setErrors((e) => e + 1);
      setShake(true);
      setTimeout(() => setShake(false), 420);
    }
  };

  const reset = () => {
    setPlaced([]);
    setResult(null);
    setErrors(0);
  };

  const nextRound = () => {
    if (!isLastRound) {
      setRound((r) => r + 1);
      setPlaced([]);
      setResult(null);
      setErrors(0);
    }
  };

  const stars = errors === 0 ? 3 : errors <= 2 ? 2 : 1;
  const feedback = result === 'ok'
    ? (errors === 0 ? SEQ_REACTIONS.ok3 : errors <= 2 ? SEQ_REACTIONS.ok2 : SEQ_REACTIONS.ok1)
    : result === 'wrong' ? SEQ_REACTIONS.wrong : SEQ_REACTIONS.idle;

  return (
    <>
      <div className={s.seqRoundBar}>
        <span className={s.seqRoundNum}>Rodada {round + 1}/{ROUNDS_A2.length}</span>
        <span className={s.seqRoundTotal}>★ {starsTotal} conquistadas</span>
      </div>
      <p className={s.psub} style={{ marginBottom: 22 }}>{roundDef.label}: toque nos passos na ordem certa</p>
      <div className={s.seqWrap}>
        <div className={`${s.seqSlots} ${shake ? s.seqSlotsShake : ''}`}>
          {[0, 1, 2].map((i) => {
            const key = placed[i];
            const chip = key ? SEQ_ITEMS[key] : null;
            return (
              <div
                key={i}
                className={`${s.seqSlot} ${chip ? s.seqSlotFilled : ''}`}
                onClick={chip ? () => remove(key) : undefined}
              >
                {chip ? (
                  <>
                    <span className={s.sGlyph} style={{ background: chip.color }}>{chip.glyph}</span>
                    <span className={s.sLabel}>{chip.label}</span>
                  </>
                ) : (
                  <span>Passo {i + 1}</span>
                )}
              </div>
            );
          })}
        </div>
        <div className={s.seqPool}>
          {roundDef.order.filter((k) => !placed.includes(k)).map((k) => {
            const chip = SEQ_ITEMS[k];
            return (
              <div key={k} className={s.seqChip} onClick={() => place(k)}>
                <span className={s.sGlyph} style={{ background: chip.color }}>{chip.glyph}</span>
                <span className={s.sLabel}>{chip.label}</span>
              </div>
            );
          })}
        </div>
        {result === 'ok' && (
          <div className={s.seqStars}>
            {[1, 2, 3].map((i) => (
              <span key={i} className={`${s.seqStar} ${i <= stars ? s.seqStarLit : ''}`}>★</span>
            ))}
          </div>
        )}
        <p className={`${s.seqFeedback} ${result === 'ok' ? s.seqFeedbackOk : result === 'wrong' ? s.seqFeedbackWrong : ''}`}>
          {feedback}
        </p>
        {result === 'ok' ? (
          <div className={s.seqActions}>
            {isLastRound ? (
              <button
                className={`${s.btn} ${s.btnOrange} ${s.btnSm}`}
                disabled={concluindo}
                onClick={() => concluir(Math.max(1, Math.min(3, Math.round(starsTotal / ROUNDS_A2.length))))}
              >
                Concluir módulo
              </button>
            ) : (
              <button className={`${s.btn} ${s.btnOrange} ${s.btnSm}`} onClick={nextRound}>Próxima rodada →</button>
            )}
          </div>
        ) : (
          <div className={s.seqActions}>
            <button className={`${s.btn} ${s.btnCream} ${s.btnSm}`} onClick={reset}>Recomeçar</button>
            <button className={`${s.btn} ${s.btnOrange} ${s.btnSm}`} onClick={check}>Conferir ordem</button>
          </div>
        )}
      </div>
    </>
  );
}
