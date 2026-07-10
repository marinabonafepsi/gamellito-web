'use client';

import { useState } from 'react';
import { GamButton } from '@/components/ds/GamButton';

export interface MedicamentoFormData {
  nome: string;
  tipo: 'basal' | 'bolus' | 'outro';
  dose: string;
  horarios: string;
  desde?: string;
  observacao?: string;
}

interface MedicamentoModalProps {
  initial?: Partial<MedicamentoFormData>;
  onSave: (data: MedicamentoFormData) => void;
  onClose: () => void;
}

const TIPOS: { value: MedicamentoFormData['tipo']; label: string }[] = [
  { value: 'basal', label: 'Basal' },
  { value: 'bolus', label: 'Bolus' },
  { value: 'outro', label: 'Outro' },
];

export function MedicamentoModal({ initial, onSave, onClose }: MedicamentoModalProps) {
  const [nome, setNome] = useState(initial?.nome || '');
  const [tipo, setTipo] = useState<MedicamentoFormData['tipo']>(initial?.tipo || 'basal');
  const [dose, setDose] = useState(initial?.dose || '');
  const [horarios, setHorarios] = useState(initial?.horarios || '');
  const [desde, setDesde] = useState(initial?.desde || '');
  const [observacao, setObservacao] = useState(initial?.observacao || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nome.trim() || !dose.trim() || !horarios.trim()) {
      setError('Preencha nome, dose e horários');
      return;
    }

    setLoading(true);
    onSave({
      nome: nome.trim(),
      tipo,
      dose: dose.trim(),
      horarios: horarios.trim(),
      desde: desde || undefined,
      observacao: observacao.trim() || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-cream border-4 border-purple-main rounded-3xl shadow-pop max-w-md w-full p-6">
        <h2 className="text-2xl font-display font-bold text-purple-main mb-4">
          💊 {initial ? 'Editar medicamento' : 'Novo medicamento'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-gray mb-2">Nome</label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Glargina (Lantus)"
              required
              autoFocus
              className="w-full px-4 py-3 bg-white border-2 border-sun rounded-lg text-dark-gray placeholder-ink/40 focus:outline-none focus:shadow-pop-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-gray mb-2">Tipo</label>
            <div className="grid grid-cols-3 gap-2">
              {TIPOS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setTipo(opt.value)}
                  className={`
                    p-2 rounded-lg border-2 font-medium transition-all text-sm
                    ${
                      tipo === opt.value
                        ? 'bg-sun border-purple-main text-ink'
                        : 'bg-white border-ink/20 text-dark-gray hover:border-sun'
                    }
                  `}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-gray mb-2">Dose</label>
            <input
              type="text"
              value={dose}
              onChange={(e) => setDose(e.target.value)}
              placeholder="Ex.: 8 UI ou 1 UI / 15g CHO"
              required
              className="w-full px-4 py-2 bg-white border-2 border-ink/20 rounded-lg text-dark-gray placeholder-ink/40 focus:outline-none focus:shadow-pop-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-gray mb-2">Horários</label>
            <input
              type="text"
              value={horarios}
              onChange={(e) => setHorarios(e.target.value)}
              placeholder="Ex.: 22:00, 1x/dia ou antes das refeições"
              required
              className="w-full px-4 py-2 bg-white border-2 border-ink/20 rounded-lg text-dark-gray placeholder-ink/40 focus:outline-none focus:shadow-pop-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-gray mb-2">Desde (opcional)</label>
            <input
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
              className="w-full px-4 py-2 bg-white border-2 border-ink/20 rounded-lg text-dark-gray focus:outline-none focus:shadow-pop-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-gray mb-2">Observação (opcional)</label>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Ex.: fator de correção 1:50 acima de 180"
              className="w-full px-4 py-2 bg-white border-2 border-ink/20 rounded-lg text-dark-gray placeholder-ink/40 focus:outline-none focus:shadow-pop-sm resize-none"
              rows={2}
            />
          </div>

          {error && (
            <div className="bg-red-500 bg-opacity-20 border-2 border-red-500 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-cream hover:bg-purple-light text-dark-gray rounded-lg border-2 border-ink/20 font-medium transition-all disabled:opacity-50"
            >
              Cancelar
            </button>
            <GamButton type="submit" disabled={loading} className="flex-1" variant="primary">
              {loading ? 'Salvando...' : '✅ Salvar'}
            </GamButton>
          </div>
        </form>
      </div>
    </div>
  );
}
