'use client';

import { useState } from 'react';
import Link from 'next/link';
import s from '../DashboardShell.module.css';
import { ModuloCompletionContext } from './ModuloCompletionContext';

interface CertificacaoDesbloqueada {
  badge_name: string;
  unlock_message: string | null;
  badge_color: string | null;
  coin_reward: number;
}

interface Recompensa {
  moedas: number;
  jaConcluido: boolean;
  estrelas: number;
  certificacao: CertificacaoDesbloqueada | null;
}

export function ModuloShell({
  voltarHref,
  titulo,
  moduloId,
  children,
}: {
  voltarHref: string;
  titulo: string;
  moduloId: string;
  children: React.ReactNode;
}) {
  const [concluindo, setConcluindo] = useState(false);
  const [recompensa, setRecompensa] = useState<Recompensa | null>(null);

  const concluir = async (estrelas = 3) => {
    if (concluindo || recompensa) return;
    setConcluindo(true);
    try {
      const res = await fetch(`/api/modulos/${moduloId}/completar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estrelas }),
      });
      const data = await res.json();
      if (res.ok) {
        setRecompensa({
          moedas: data.moedas_ganhas ?? 0,
          jaConcluido: !!data.ja_concluido,
          estrelas: data.estrelas ?? estrelas,
          certificacao: data.certificacao_desbloqueada ?? null,
        });
        if (typeof data.saldo_novo === 'number') {
          window.dispatchEvent(new CustomEvent('gamellito:coins-updated', { detail: { coins: data.saldo_novo } }));
        }
      } else {
        // Sem bloquear a jornada do usuário por causa de um erro de rede/API.
        setRecompensa({ moedas: 0, jaConcluido: false, estrelas, certificacao: null });
      }
    } catch {
      setRecompensa({ moedas: 0, jaConcluido: false, estrelas, certificacao: null });
    } finally {
      setConcluindo(false);
    }
  };

  return (
    <ModuloCompletionContext.Provider value={{ concluir, concluindo }}>
      <div className={s.modHead}>
        <Link className={s.modBack} href={voltarHref}>← Aprendizado</Link>
        <div className={s.modTitle}>
          <h2>{titulo}</h2>
        </div>
      </div>
      {children}

      {recompensa && (
        <div className={s.ov}>
          <div className={s.modal}>
            <h3>{recompensa.jaConcluido ? 'Módulo revisado!' : 'Módulo concluído!'}</h3>
            <p className={s.msub}>
              {recompensa.jaConcluido
                ? 'Você já tinha concluído esse módulo antes — bom reforçar o que aprendeu!'
                : 'Isso mesmo! Continue assim.'}
            </p>
            <div className={s.seqStars} style={{ marginBottom: 16 }}>
              {[1, 2, 3].map((i) => (
                <span key={i} className={`${s.seqStar} ${i <= recompensa.estrelas ? s.seqStarLit : ''}`}>★</span>
              ))}
            </div>
            {recompensa.moedas > 0 && (
              <p className={s.psub} style={{ textAlign: 'center', marginBottom: recompensa.certificacao ? 12 : 20 }}>
                + {recompensa.moedas} GCoins
              </p>
            )}
            {recompensa.certificacao && (
              <div
                style={{
                  background: recompensa.certificacao.badge_color || 'var(--color-sun)',
                  border: '3px solid var(--color-ink)',
                  borderRadius: 18,
                  padding: '16px 18px',
                  marginBottom: 20,
                  textAlign: 'center',
                }}
              >
                <p style={{ fontFamily: 'Baloo 2', fontWeight: 800, fontSize: 16, marginBottom: 4 }}>
                  Novo certificado: {recompensa.certificacao.badge_name}!
                </p>
                {recompensa.certificacao.unlock_message && (
                  <p style={{ fontFamily: 'Nunito', fontWeight: 700, fontSize: 13 }}>
                    {recompensa.certificacao.unlock_message}
                  </p>
                )}
              </div>
            )}
            <Link href={voltarHref} className={`${s.btn} ${s.btnOrange}`} style={{ width: '100%' }}>
              Voltar para as trilhas
            </Link>
          </div>
        </div>
      )}
    </ModuloCompletionContext.Provider>
  );
}
