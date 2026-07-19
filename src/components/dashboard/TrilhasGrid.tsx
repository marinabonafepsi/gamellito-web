import s from './DashboardShell.module.css';
import type { Trilha } from './DashboardShell';

export function TrilhaCard({ trilha: t }: { trilha: Trilha }) {
  return (
    <div className={s.tcard}>
      <div className={s.tnum} style={{ background: t.color }}>{t.n}</div>
      <h4>{t.title}</h4>
      <span className={s.tag}>{t.format}</span>
      <div className={`${s.prog} ${t.barClass === 'g' ? s.g : ''}`}>
        <i style={{ width: t.pct }} />
      </div>
      <div className={s.tmeta}>
        <span>{t.lessons}</span>
        <span className={t.statusClass === 'done' ? s.done : ''}>{t.status}</span>
      </div>
    </div>
  );
}

export function TrilhasGrid({ trilhas }: { trilhas: Trilha[] }) {
  return (
    <div className={s.trilhas}>
      {trilhas.map((t) => (
        <TrilhaCard key={t.n} trilha={t} />
      ))}
    </div>
  );
}
