'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import s from '@/components/dashboard/DashboardShell.module.css';
import type { Recurso, PacienteResumo } from '@/components/dashboard/DashboardShell';

export default function TurmasPage() {
  const [atividades, setAtividades] = useState<Recurso[]>([]);
  const [alunos, setAlunos] = useState<PacienteResumo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [recursosRes, pacientesRes] = await Promise.all([
        fetch('/api/recursos?papel=educador').then((r) => (r.ok ? r.json() : { atividades: [] })),
        fetch('/api/pacientes').then((r) => (r.ok ? r.json() : { pacientes: [] })),
      ]);
      setAtividades(recursosRes.atividades || []);
      setAlunos(pacientesRes.pacientes || []);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return null;

  const precisamAtencao = alunos.filter((a) => a.status !== 'ok').length;

  return (
    <>
      <div className={s.sh}>
        <h2>Minhas turmas</h2>
      </div>
      <div className={s.stats3} style={{ gridTemplateColumns: 'repeat(2,1fr)', marginBottom: 20 }}>
        <div className={s.scard}>
          <div className={s.sic} style={{ background: 'var(--game-blue)' }}>{alunos.length}</div>
          <div>
            <div className={s.snum}>{alunos.length}</div>
            <div className={s.slbl}>alunos com DM1</div>
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
          <h3>Atividades para a turma</h3>
          <p className={s.psub}>Pronto para aplicar em sala — sem improvisar</p>
          {atividades.length > 0 ? (
            <div className={s.acts}>
              {atividades.map((a) => (
                <div className={s.act} key={a.id}>
                  <span className={s.ai}>
                    <Image src={a.icone || '/assets/gamellito-logo.svg'} alt="" width={34} height={34} />
                  </span>
                  <div style={{ flex: 1 }}>
                    <div className={s.at}>{a.titulo}</div>
                    <div className={s.ad}>{a.descricao}</div>
                  </div>
                  <a className={`${s.btn} ${s.btnCream} ${s.btnSm}`} href={a.url || '#'}>{a.acao_label}</a>
                </div>
              ))}
            </div>
          ) : (
            <p className={s.psub}>Nenhuma atividade disponível no momento</p>
          )}
        </div>
        <div className={s.panel}>
          <h3>Alunos com DM1</h3>
          <p className={s.psub}>Acompanhe quem precisa de atenção</p>
          {alunos.length > 0 ? (
            alunos.map((al) => (
              <div className={s.reg} key={al.id}>
                <span className={s.avatar} style={{ width: 38, height: 38 }}>
                  <Image src="/assets/gamellito-logo.svg" alt="" width={32} height={32} />
                </span>
                <div style={{ flex: 1 }}>
                  <div className={s.at} style={{ fontSize: 14 }}>{al.nome}</div>
                </div>
                <span className={s.rtag}>
                  <span className={s.rdot} style={{ background: al.status === 'ok' ? 'var(--game-green)' : 'var(--color-orange)' }} />
                  {al.status}
                </span>
              </div>
            ))
          ) : (
            <p className={s.psub}>
              Nenhum aluno compartilhou os dados com você ainda. Peça para a família ativar o
              compartilhamento no diário dela.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
