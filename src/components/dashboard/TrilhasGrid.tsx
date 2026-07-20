import Link from 'next/link';
import s from './DashboardShell.module.css';
import type { Trilha } from './DashboardShell';

interface TrilhaCardProps {
  trilha: Trilha;
  href?: string;
  isDone?: boolean;
  estrelas?: number;
}

export function TrilhaCard({ trilha: t, href, isDone, estrelas }: TrilhaCardProps) {
  const statusLabel = isDone && estrelas !== undefined
    ? `Concluído · ${'★'.repeat(estrelas)}${'☆'.repeat(3 - estrelas)}`
    : t.status;

  const card = (
    <div className={s.tcard}>
      <div className={s.tnum} style={{ background: t.color }}>{t.n}</div>
      <h4>{t.title}</h4>
      <span className={s.tag}>{t.format}</span>
      <div className={`${s.prog} ${t.barClass === 'g' ? s.g : ''}`}>
        <i style={{ width: t.pct }} />
      </div>
      <div className={s.tmeta}>
        <span>{t.lessons}</span>
        <span className={isDone || t.statusClass === 'done' ? s.done : ''}>{statusLabel}</span>
      </div>
    </div>
  );

  if (!href) return card;

  return (
    <Link href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
      {card}
    </Link>
  );
}

interface TrilhasGridProps {
  trilhas: Trilha[];
  basePath?: string;
  moduloIdFor?: (t: Trilha) => string;
  progresso?: Record<string, number>;
}

export function TrilhasGrid({ trilhas, basePath, moduloIdFor, progresso }: TrilhasGridProps) {
  return (
    <div className={s.trilhas}>
      {trilhas.map((t) => {
        const moduloId = moduloIdFor?.(t);
        const href = basePath && moduloId ? `${basePath}/aprendizado/${moduloId}` : undefined;
        const estrelas = moduloId ? progresso?.[moduloId] : undefined;
        const isDone = t.statusClass === 'done' || estrelas !== undefined;
        return <TrilhaCard key={t.n} trilha={t} href={href} isDone={isDone} estrelas={estrelas} />;
      })}
    </div>
  );
}
