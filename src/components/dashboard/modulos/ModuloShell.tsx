'use client';

import { useState } from 'react';
import Link from 'next/link';
import s from '../DashboardShell.module.css';
import { ModuloCompletionContext } from './ModuloCompletionContext';

interface Recompensa {
  moedas: number;
  jaConcluido: boolean;
  estrelas: number;
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
        });
        if (typeof data.saldo_novo === 'number') {
          window.dispatchEvent(new CustomEvent('gamellito:coins-updated', { detail: { coins: data.saldo_novo } }));
        }
      } else {
        // Sem bloquear a jornada do usuário por causa de um erro de rede/API.
        setRecompensa({ moedas: 0, jaConcluido: false, estrelas });
      }
    } catch {
      setRecompensa({ moedas: 0, jaConcluido: false, estrelas });
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
              <p className={s.psub} style={{ textAlign: 'center', marginBottom: 20 }}>
                + {recompensa.moedas} GCoins
              </p>
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
