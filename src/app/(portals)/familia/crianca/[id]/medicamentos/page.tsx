'use client';

import { useEffect, useState } from 'react';
import { GamButton } from '@/components/ds/GamButton';
import { GamCard } from '@/components/ds/GamCard';
import { MedicamentoModal, type MedicamentoFormData } from '@/components/familia/MedicamentoModal';

interface Medicamento extends MedicamentoFormData {
  id: string;
  ativo: boolean;
}

const TIPO_LABEL: Record<Medicamento['tipo'], string> = {
  basal: 'Basal',
  bolus: 'Bolus',
  outro: 'Outro',
};

function formatDesde(desde?: string) {
  if (!desde) return '—';
  const d = new Date(`${desde}T00:00:00`);
  return d.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }).replace('.', '');
}

export default function MedicamentosPage() {
  const [medicamentos, setMedicamentos] = useState<Medicamento[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editando, setEditando] = useState<Medicamento | null>(null);

  const loadMedicamentos = async () => {
    try {
      const response = await fetch('/api/medicamentos');
      const data = await response.json();
      setMedicamentos(data.medicamentos || []);
    } catch (error) {
      console.error('Error loading medicamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMedicamentos();
  }, []);

  const handleSave = async (data: MedicamentoFormData) => {
    try {
      const response = editando
        ? await fetch(`/api/medicamentos/${editando.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })
        : await fetch('/api/medicamentos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });

      if (response.ok) {
        setShowModal(false);
        setEditando(null);
        loadMedicamentos();
      } else {
        const err = await response.json().catch(() => ({}));
        alert(err.error || 'Erro ao salvar medicamento');
      }
    } catch (error) {
      console.error('Error saving medicamento:', error);
      alert('Erro ao salvar medicamento');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover este medicamento?')) return;

    try {
      const response = await fetch(`/api/medicamentos/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setMedicamentos((prev) => prev.filter((m) => m.id !== id));
      } else {
        alert('Erro ao remover medicamento');
      }
    } catch (error) {
      console.error('Error deleting medicamento:', error);
      alert('Erro ao remover medicamento');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-display font-bold text-purple-main mb-2">
            💊 Posologia atual
          </h1>
          <p className="text-dark-gray">
            Medicamentos e doses de hoje — informado por você, visível para quem cuida junto
          </p>
        </div>
        <GamButton variant="primary" onClick={() => { setEditando(null); setShowModal(true); }}>
          ➕ Novo medicamento
        </GamButton>
      </div>

      <GamCard surface="purple">
        <div className="p-2">
          <p className="text-sm font-medium text-white mb-1">
            Gestão completa de medicamentos chega em breve
          </p>
          <p className="text-xs text-white/80">
            Por ora, os dados abaixo são preenchidos manualmente por você — sem lembretes ou cálculo
            automático de dose ainda.
          </p>
        </div>
      </GamCard>

      {showModal && (
        <MedicamentoModal
          initial={editando || undefined}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditando(null); }}
        />
      )}

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-400">Carregando...</p>
        </div>
      ) : medicamentos.length > 0 ? (
        <div className="space-y-3">
          {medicamentos.map((m) => (
            <GamCard key={m.id} surface="white">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <p className="text-lg font-bold text-ink">{m.nome}</p>
                    <span className="tag" style={{ color: '#6E59C9' }}>{TIPO_LABEL[m.tipo]}</span>
                  </div>
                  <p className="text-sm text-ink opacity-70 mt-1">
                    {m.dose} · {m.horarios}
                  </p>
                  <p className="text-xs text-ink opacity-50 mt-1">Desde {formatDesde(m.desde)}</p>
                  {m.observacao && (
                    <p className="text-sm text-ink opacity-60 mt-2">💬 {m.observacao}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <button
                    onClick={() => { setEditando(m); setShowModal(true); }}
                    className="text-xs text-purple-main hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="text-xs text-red-400 hover:text-red-300 underline"
                  >
                    Remover
                  </button>
                </div>
              </div>
            </GamCard>
          ))}
        </div>
      ) : (
        <GamCard surface="cream">
          <div className="text-center py-12">
            <p className="text-ink opacity-70 mb-6">
              Nenhum medicamento cadastrado ainda.
            </p>
            <GamButton variant="primary" onClick={() => { setEditando(null); setShowModal(true); }}>
              ➕ Cadastrar primeiro medicamento
            </GamButton>
          </div>
        </GamCard>
      )}
    </div>
  );
}
