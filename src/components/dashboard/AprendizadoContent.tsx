import s from './DashboardShell.module.css';
import { TrilhasGrid } from './TrilhasGrid';
import type { Trilha } from './DashboardShell';

export function AprendizadoContent({ title, trilhas }: { title: string; trilhas: Trilha[] }) {
  const doneCount = trilhas.filter((t) => t.statusClass === 'done').length;
  const progPct = Math.round((doneCount / trilhas.length) * 100);

  return (
    <>
      <div className={s.sh}>
        <h2>{title}</h2>
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
      <TrilhasGrid trilhas={trilhas} />
    </>
  );
}
