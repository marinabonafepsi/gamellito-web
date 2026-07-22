'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { GamButton } from '@/components/ds/GamButton';
import { GamCard } from '@/components/ds/GamCard';
import { RegistroModal } from '@/components/familia/RegistroModal';
import { RewardModal } from '@/components/familia/RewardModal';

const CONTEXTO_INFO: Record<string, { label: string; glyph: string }> = {
  exercicio: { label: 'Fez exercício', glyph: '🏃' },
  doente: { label: 'Não tá bem / doente', glyph: '🤒' },
  estresse: { label: 'Dia estressante', glyph: '⚡' },
  comida: { label: 'Comida diferente', glyph: '🍽️' },
};

interface Registro {
  id: string;
  valor: number;
  data_hora: string;
  rotulo: string;
  observacao?: string;
  lancado_por?: string;
  contexto?: string | null;
}

export default function RegistrosPage() {
  const params = useParams();
  const id = params.id as string;
  const [registros, setRegistros] = useState<Registro[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [rewardCoins, setRewardCoins] = useState<number | null>(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const supabase = createClientComponentClient();

  const loadRegistros = async (pageOffset: number = 0) => {
    try {
      const response = await fetch(
        `/api/registros?limit=50&offset=${pageOffset}`
      );
      const data = await response.json();

      if (pageOffset === 0) {
        setRegistros(data.registros);
      } else {
        setRegistros((prev) => [...prev, ...data.registros]);
      }

      setHasMore(data.paginacao.has_more);
      setOffset(pageOffset + 50);
    } catch (error) {
      console.error('Error loading registros:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistros(0);
  }, []);

  const handleAddRegistro = async (data: {
    valor: number;
    rotulo: string;
    observacao?: string;
    lancado_por?: string;
    medicamentos_tomados?: string[];
    contexto?: string;
  }) => {
    try {
      const response = await fetch('/api/registros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        // Reload registros
        setRegistros([result.registro, ...registros]);
        setShowModal(false);

        // Show celebration
        showCelebration(result.moedas_ganhas);
      }
    } catch (error) {
      console.error('Error adding registro:', error);
      alert('Erro ao salvar registro');
    }
  };

  const showCelebration = (moedas: number) => {
    setRewardCoins(moedas);
  };

  const handleDeleteRegistro = async (registroId: string) => {
    if (!confirm('Tem certeza que deseja deletar este registro?')) return;

    try {
      const response = await fetch(`/api/registros/${registroId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setRegistros(registros.filter((r) => r.id !== registroId));
        alert('Registro deletado com sucesso');
      }
    } catch (error) {
      console.error('Error deleting registro:', error);
      alert('Erro ao deletar registro');
    }
  };

  const getRolotuloEmoji = (rotulo: string) => {
    const emojis: Record<string, string> = {
      jejum: '🌅',
      antes: '🍽️',
      depois: '🍴',
      dormir: '😴',
      outro: '📝',
    };
    return emojis[rotulo] || '📊';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-display font-bold text-purple-main mb-2">
            📋 Meu Diário de Glicemia
          </h1>
          <p className="text-dark-gray">
            Registre e acompanhe seus valores de glicemia
          </p>
        </div>
        <GamButton
          variant="primary"
          onClick={() => setShowModal(true)}
          data-test="btn-novo-registro"
        >
          + Registrar glicemia
        </GamButton>
      </div>

      {/* Modal */}
      {showModal && (
        <RegistroModal
          onSave={handleAddRegistro}
          onClose={() => setShowModal(false)}
        />
      )}

      {rewardCoins !== null && (
        <RewardModal coins={rewardCoins} onClose={() => setRewardCoins(null)} />
      )}

      {/* Registros List */}
      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Carregando registros...</p>
        </div>
      ) : registros.length > 0 ? (
        <div className="space-y-3">
          {registros.map((registro) => (
            <GamCard key={registro.id} surface="white">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl">
                      {getRolotuloEmoji(registro.rotulo)}
                    </span>
                    <div>
                      <p className="text-2xl font-bold text-ink">
                        {registro.valor} mg/dL
                      </p>
                      <p className="text-sm text-ink opacity-70">
                        {registro.rotulo.charAt(0).toUpperCase() +
                          registro.rotulo.slice(1)}
                      </p>
                    </div>
                  </div>
                  {registro.observacao && (
                    <p className="text-sm text-ink opacity-60 mt-2">
                      💬 {registro.observacao}
                    </p>
                  )}
                  {registro.contexto && CONTEXTO_INFO[registro.contexto] && (
                    <p className="text-sm text-ink opacity-60 mt-2">
                      {CONTEXTO_INFO[registro.contexto].glyph}{' '}
                      {CONTEXTO_INFO[registro.contexto].label}
                    </p>
                  )}
                  {registro.lancado_por && (
                    <p className="text-xs text-ink opacity-50 mt-1">
                      Registrado por: {registro.lancado_por}
                    </p>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-sm text-ink opacity-70">
                    {new Date(registro.data_hora).toLocaleDateString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: '2-digit',
                    })}
                  </p>
                  <p className="text-sm text-ink opacity-70">
                    {new Date(registro.data_hora).toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  <button
                    onClick={() => handleDeleteRegistro(registro.id)}
                    className="text-xs text-red-400 hover:text-red-300 mt-2 underline"
                  >
                    Deletar
                  </button>
                </div>
              </div>
            </GamCard>
          ))}

          {hasMore && (
            <div className="text-center py-6">
              <GamButton
                variant="secondary"
                onClick={() => loadRegistros(offset)}
              >
                Carregar Mais
              </GamButton>
            </div>
          )}
        </div>
      ) : (
        <GamCard surface="cream">
          <div className="text-center py-12">
            <p className="text-ink opacity-70 mb-6">
              Nenhum registro ainda. Comece a registrar agora!
            </p>
            <GamButton variant="primary" onClick={() => setShowModal(true)}>
              + Registrar minha primeira glicemia
            </GamButton>
          </div>
        </GamCard>
      )}
    </div>
  );
}
