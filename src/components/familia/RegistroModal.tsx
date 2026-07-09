'use client';

import { useState } from 'react';
import { GamButton } from '@/components/ds/GamButton';

interface RegistroModalProps {
  onSave: (data: {
    valor: number;
    rotulo: string;
    observacao?: string;
  }) => void;
  onClose: () => void;
}

export function RegistroModal({ onSave, onClose }: RegistroModalProps) {
  const [valor, setValor] = useState('');
  const [rotulo, setRotulo] = useState('depois');
  const [observacao, setObservacao] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate
    const numValor = parseInt(valor);
    if (!valor || isNaN(numValor)) {
      setError('Digite um valor válido');
      return;
    }
    if (numValor < 50 || numValor > 600) {
      setError('Valor deve estar entre 50 e 600 mg/dL');
      return;
    }

    setLoading(true);
    onSave({
      valor: numValor,
      rotulo,
      observacao: observacao || undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-cream border-4 border-purple-main rounded-3xl shadow-pop max-w-md w-full p-6">
        <h2 className="text-2xl font-display font-bold text-purple-main mb-4">
          📊 Novo Registro de Glicemia
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Valor */}
          <div>
            <label className="block text-sm font-medium text-dark-gray mb-2">
              Valor (mg/dL)
            </label>
            <input
              type="number"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              min="50"
              max="600"
              required
              className="w-full px-4 py-3 bg-white border-2 border-sun rounded-lg text-dark-gray text-2xl text-center font-bold placeholder-ink/40 focus:outline-none focus:shadow-pop-sm"
              placeholder="120"
              autoFocus
            />
            <p className="text-xs text-ink/60 mt-1">Mínimo: 50 | Máximo: 600</p>
          </div>

          {/* Rótulo */}
          <div>
            <label className="block text-sm font-medium text-dark-gray mb-2">
              Quando foi medido?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: 'jejum', label: '🌅 Jejum' },
                { value: 'antes', label: '🍽️ Antes de comer' },
                { value: 'depois', label: '🍴 Depois de comer' },
                { value: 'dormir', label: '😴 Antes de dormir' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setRotulo(opt.value)}
                  className={`
                    p-2 rounded-lg border-2 font-medium transition-all text-sm
                    ${
                      rotulo === opt.value
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

          {/* Observação */}
          <div>
            <label className="block text-sm font-medium text-dark-gray mb-2">
              Observações (opcional)
            </label>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Ex: Depois do lanche..."
              className="w-full px-4 py-2 bg-white border-2 border-ink/20 rounded-lg text-dark-gray placeholder-ink/40 focus:outline-none focus:shadow-pop-sm resize-none"
              rows={2}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500 bg-opacity-20 border-2 border-red-500 rounded-lg p-3 text-red-200 text-sm">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-cream hover:bg-purple-light text-dark-gray rounded-lg border-2 border-ink/20 font-medium transition-all disabled:opacity-50"
            >
              Cancelar
            </button>
            <GamButton
              type="submit"
              disabled={loading}
              className="flex-1"
              variant="primary"
            >
              {loading ? 'Salvando...' : '✅ Salvar'}
            </GamButton>
          </div>
        </form>
      </div>
    </div>
  );
}
