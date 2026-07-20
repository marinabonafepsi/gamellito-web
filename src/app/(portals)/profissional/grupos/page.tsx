'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import s from '@/components/dashboard/DashboardShell.module.css';
import type { Recurso, PacienteResumo } from '@/components/dashboard/DashboardShell';

export default function GruposPage() {
  const [materiais, setMateriais] = useState<Recurso[]>([]);
  const [pacientes, setPacientes] = useState<PacienteResumo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [recursosRes, pacientesRes] = await Promise.all([
        fetch('/api/recursos?papel=profissional').then((r) => (r.ok ? r.json() : { materiais: [] })),
        fetch('/api/pacientes').then((r) => (r.ok ? r.json() : { pacientes: [] })),
      ]);
      setMateriais(recursosRes.materiais || []);
      setPacientes(pacientesRes.pacientes || []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return null;

  const precisamAtencao = pacientes.filter((p) => p.status !== 'ok').length;

  return (
    <>
      <div className={s.sh}>
        <h2>Grupos e pacientes</h2>
      </div>
      <div className={s.stats3} style={{ gridTemplateColumns: 'repeat(2,1fr)', marginBottom: 20 }}>
        <div className={s.scard}>
          <div className={s.sic} style={{ background: 'var(--game-green)' }}>{pacientes.length}</div>
          <div>
            <div className={s.snum}>{pacientes.length}</div>
            <div className={s.slbl}>pacientes acompanhados</div>
          </div>
        </div>
        <div className={s.scard}>
          <div className={s.sic} style={{ background: 'var(--color-orange)' }}>!</div>
          <div>
            <div className={s.snum}>{precisamAtencao}</div>
            <div className={s.slbl}>precisa de atenção</div>
          </div>
        </div>
      </div>
      <div className={s.cols}>
        <div className={s.panel}>
          <h3>Pacientes</h3>
          <p className={s.psub}>Famílias que compartilharam dados com você</p>
          {pacientes.length > 0 ? (
            pacientes.map((p) => (
              <Link href={`/profissional/paciente/${p.id}`} className={s.reg} key={p.id} style={{ textDecoration: 'none', color: 'inherit' }}>
                <span className={s.avatar} style={{ width: 38, height: 38 }}>
                  <Image src="/assets/gamellito-logo.svg" alt="" width={32} height={32} />
                </span>
                <div style={{ flex: 1 }}>
                  <div className={s.at} style={{ fontSize: 14 }}>{p.nome}</div>
                </div>
                <span className={s.rtag}>
                  <span className={s.rdot} style={{ background: p.status === 'ok' ? 'var(--game-green)' : 'var(--color-orange)' }} />
                  {p.status}
                </span>
              </Link>
            ))
          ) : (
            <p className={s.psub}>
              Nenhum paciente compartilhou os dados com você ainda. Peça para a família ativar o
              compartilhamento no diário dela.
            </p>
          )}
        </div>
        <div className={s.panel}>
          <h3>Materiais do método</h3>
          <p className={s.psub}>Baseado em evidência (USP + UEL)</p>
          {materiais.length > 0 ? (
            <div className={s.acts}>
              {materiais.map((m) => (
                <div className={s.act} key={m.id}>
                  <span className={s.ai}>
                    <Image src={m.icone || '/assets/gamellito-logo.svg'} alt="" width={34} height={34} />
                  </span>
                  <div style={{ flex: 1 }}>
                    <div className={s.at}>{m.titulo}</div>
                    <div className={s.ad}>{m.descricao}</div>
                  </div>
                  <a className={`${s.btn} ${s.btnCream} ${s.btnSm}`} href={m.url || '#'}>{m.acao_label}</a>
                </div>
              ))}
            </div>
          ) : (
            <p className={s.psub}>Nenhum material disponível no momento</p>
          )}
        </div>
      </div>
    </>
  );
}
