import s from './DashboardShell.module.css';
import type { Medalha } from '@/lib/trilhas-data';

export function MedalItem({ medal: m }: { medal: Medalha }) {
  return (
    <div className={`${s.medal} ${m.locked ? s.locked : ''}`}>
      <div className={s.mic} style={{ background: m.locked ? undefined : m.color }}>{m.n}</div>
      <div>
        <div className={s.mt}>{m.t}</div>
        <div className={s.md}>{m.d}</div>
      </div>
    </div>
  );
}
