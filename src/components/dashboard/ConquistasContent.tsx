import s from './DashboardShell.module.css';
import { MedalItem } from './MedalItem';
import { MEDALS } from '@/lib/trilhas-data';
import { CertificadosSection } from './CertificadosSection';

export function ConquistasContent() {
  const unlocked = MEDALS.filter((m) => !m.locked).length;
  const pct = Math.round((unlocked / MEDALS.length) * 100);

  return (
    <>
      <div className={s.sh}>
        <h2>Conquistas</h2>
      </div>
      <div className={s.panel} style={{ marginBottom: 20 }}>
        <p className={s.psub}>Você já desbloqueou {unlocked} de {MEDALS.length}</p>
        <div className={`${s.prog} ${s.g}`}>
          <i style={{ width: `${pct}%` }} />
        </div>
      </div>
      <div className={s.medalgrid}>
        {MEDALS.map((m) => (
          <MedalItem key={m.t} medal={m} />
        ))}
      </div>
      <CertificadosSection />
    </>
  );
}
