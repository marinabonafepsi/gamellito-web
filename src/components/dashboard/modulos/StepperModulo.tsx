'use client';

import s from '../DashboardShell.module.css';
import { STEPPER_CONTENT } from '@/lib/modulos-content-registry';
import { useConcluirModulo } from './ModuloCompletionContext';

const DOT_COLORS = ['var(--game-blue)', 'var(--color-orange)', 'var(--game-green)', 'var(--color-purple)'];

export function StepperModulo({ moduloId }: { moduloId: string }) {
  const { intro, steps } = STEPPER_CONTENT[moduloId];
  const { concluir, concluindo } = useConcluirModulo();
  return (
    <>
      <p className={s.psub} style={{ marginBottom: 18 }}>{intro}</p>
      <div className={s.stepperWrap}>
        {steps.map((step, i) => (
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
