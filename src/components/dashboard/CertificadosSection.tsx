'use client';

import { useEffect, useState } from 'react';
import s from './DashboardShell.module.css';

interface Certificado {
  id: string;
  slug: string;
  type: 'trail' | 'meta';
  formal_name: string;
  badge_name: string;
  badge_name_f: string | null;
  unlock_message: string | null;
  badge_color: string | null;
  coin_reward: number;
  conquistada: boolean;
  conquistada_em: string | null;
  certificate_code: string | null;
}

export function CertificadosSection() {
  const [certificados, setCertificados] = useState<Certificado[] | null>(null);

  useEffect(() => {
    let ativo = true;
    fetch('/api/certificados')
      .then((res) => (res.ok ? res.json() : { certificados: [] }))
      .then((data) => {
        if (ativo) setCertificados(data.certificados || []);
      })
      .catch(() => {
        if (ativo) setCertificados([]);
      });
    return () => {
      ativo = false;
    };
  }, []);

  if (certificados === null) return null;
  if (certificados.length === 0) return null;

  const conquistados = certificados.filter((c) => c.conquistada).length;

  return (
    <>
      <div className={s.sh} style={{ marginTop: 30 }}>
        <h2>Meus certificados</h2>
      </div>
      <div className={s.panel} style={{ marginBottom: 20 }}>
        <p className={s.psub}>
          Cada nível concluído vira um certificado — {conquistados} de {certificados.length} conquistados
        </p>
        <div className={s.medalgrid}>
          {certificados.map((c) => (
            <div key={c.id} className={`${s.medal} ${c.conquistada ? '' : s.locked}`}>
              <div
                className={s.mic}
                style={{ background: c.conquistada ? c.badge_color || undefined : undefined }}
              >
                {c.badge_name.charAt(0)}
              </div>
              <div>
                <div className={s.mt}>{c.badge_name}</div>
                <div className={s.md}>
                  {c.conquistada
                    ? c.unlock_message || `Conquistado — ${c.formal_name}`
                    : c.formal_name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
