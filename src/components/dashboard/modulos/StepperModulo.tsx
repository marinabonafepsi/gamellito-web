'use client';

import s from '../DashboardShell.module.css';
import { STEPPER_A7 } from '@/lib/modulos-content';
import { useConcluirModulo } from './ModuloCompletionContext';

const DOT_COLORS = ['var(--game-blue)', 'var(--color-orange)', 'var(--game-green)', 'var(--color-purple)'];

export function StepperModulo({ voltarHref: _voltarHref }: { voltarHref: string }) {
  const { concluir, concluindo } = useConcluirModulo();
  return (
    <>
      <p className={s.psub} style={{ marginBottom: 18 }}>
        Um roteiro simples para os dias em que a família enfrenta febre ou outra doença junto com o diabetes.
      </p>
      <div className={s.stepperWrap}>
        {STEPPER_A7.map((step, i) => (
          <div key={step.title} className={s.stepperStep}>
            <span className={s.stepperDot} style={{ background: DOT_COLORS[i % DOT_COLORS.length] }}>{i + 1}</span>
            <div>
              <div className={s.stepTitle}>{step.title}</div>
              <div className={s.stepBody}>{step.body}</div>
            </div>
          </div>
        ))}
      </div>
      <button
        className={`${s.btn} ${s.btnOrange}`}
        style={{ marginTop: 22 }}
        disabled={concluindo}
        onClick={() => concluir(3)}
      >
        Concluir módulo
      </button>
    </>
  );
}
