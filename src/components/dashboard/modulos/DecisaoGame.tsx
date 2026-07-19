'use client';

import { useState } from 'react';
import s from '../DashboardShell.module.css';
import { DECISAO_A5 } from '@/lib/modulos-content';
import { useConcluirModulo } from './ModuloCompletionContext';

export function DecisaoGame({ voltarHref: _voltarHref }: { voltarHref: string }) {
  const { concluir, concluindo } = useConcluirModulo();
  const [step, setStep] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [acertos, setAcertos] = useState(0);

  const cenario = DECISAO_A5[step];
  const isLast = step === DECISAO_A5.length - 1;
  const answered = choice !== null;

  const next = () => {
    if (!isLast) {
      setStep((s2) => s2 + 1);
      setChoice(null);
    } else {
      const estrelas = acertos === DECISAO_A5.length ? 3 : acertos >= Math.ceil(DECISAO_A5.length / 2) ? 2 : 1;
      concluir(estrelas);
    }
  };

  const escolher = (i: number) => {
    setChoice(i);
    if (cenario.opcoes[i].ok) setAcertos((a) => a + 1);
  };

  return (
    <>
      <p className={s.psub} style={{ marginBottom: 18 }}>Cenário {step + 1} de {DECISAO_A5.length} — o que você faria?</p>
      <div className={s.decisao}>
        <p className={s.decisaoSituacao}>{cenario.situacao}</p>
        {answered ? (
          <>
            <div className={`${s.decisaoDesfecho} ${cenario.opcoes[choice].ok ? s.decisaoDesfechoOk : s.decisaoDesfechoWrong}`}>
              {cenario.opcoes[choice].desfecho}
            </div>
            <button className={`${s.btn} ${s.btnOrange}`} onClick={next} disabled={isLast && concluindo}>
              {isLast ? 'Concluir módulo' : 'Próximo cenário →'}
            </button>
          </>
        ) : (
          <div className={s.decisaoOpcoes}>
            {cenario.opcoes.map((op, i) => (
              <button key={op.label} className={s.decisaoOpcao} onClick={() => escolher(i)}>
                {op.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
