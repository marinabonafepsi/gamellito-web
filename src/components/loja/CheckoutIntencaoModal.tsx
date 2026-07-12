'use client';

import { useState } from 'react';
import { GamButton } from '@/components/ds/GamButton';

interface ItemResumo {
  id: string;
  nome: string;
  preco: number;
  quantidade: number;
}

interface CheckoutIntencaoModalProps {
  itens: ItemResumo[];
  subtotal: number;
  onClose: () => void;
  onConfirmado: () => void;
}

const fmtMoney = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;

export function CheckoutIntencaoModal({ itens, subtotal, onClose, onConfirmado }: CheckoutIntencaoModalProps) {
  const [step, setStep] = useState<'endereco' | 'confirmacao'>('endereco');
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [numeroPedido, setNumeroPedido] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nome.trim() || !cep.trim() || !rua.trim() || !numero.trim() || !bairro.trim() || !cidade.trim() || !estado.trim()) {
      setError('Preencha nome e endereço completo');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/loja/pedido-intencao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          carrinho: itens.map((i) => ({ id: i.id, quantidade: i.quantidade })),
          nome_contato: nome.trim(),
          telefone_contato: telefone.trim() || undefined,
          endereco: {
            cep: cep.trim(),
            rua: rua.trim(),
            numero: numero.trim(),
            complemento: complemento.trim() || undefined,
            bairro: bairro.trim(),
            cidade: cidade.trim(),
            estado: estado.trim(),
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Erro ao registrar pedido');
        return;
      }

      setNumeroPedido(result.numero_pedido);
      setStep('confirmacao');
      onConfirmado();
    } catch (err) {
      console.error('Error creating pedido de intenção:', err);
      setError('Erro ao registrar pedido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-cream border-[3px] border-ink rounded-[24px] shadow-pop max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        {step === 'endereco' && (
          <>
            <h2 className="text-2xl font-display font-bold text-ink mb-1">Finalizar pedido</h2>
            <p className="text-sm text-ink/60 font-body mb-4">
              Ainda não vendemos de verdade — é um teste pra saber quantas pessoas querem cada produto.
              Sem cartão, sem Pix: só confirma que você faria esse pedido.
            </p>

            <div className="bg-white border-[3px] border-ink rounded-[16px] p-3 mb-4 space-y-1">
              {itens.map((item) => (
                <div key={item.id} className="flex justify-between text-sm text-ink font-body">
                  <span>{item.quantidade}x {item.nome}</span>
                  <span className="font-bold">{fmtMoney(item.preco * item.quantidade)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 mt-2 border-t-2 border-ink/10 font-display font-bold text-ink">
                <span>Subtotal</span>
                <span>{fmtMoney(subtotal)}</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-ink mb-1">Nome completo</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                  autoFocus
                  className="w-full px-4 py-2 bg-white border-2 border-ink/20 rounded-lg text-ink placeholder-ink/40 focus:outline-none focus:shadow-pop-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">Telefone (opcional)</label>
                <input
                  type="tel"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="Pra avisar quando a loja abrir de verdade"
                  className="w-full px-4 py-2 bg-white border-2 border-ink/20 rounded-lg text-ink placeholder-ink/40 focus:outline-none focus:shadow-pop-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">CEP</label>
                  <input
                    type="text"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-white border-2 border-ink/20 rounded-lg text-ink focus:outline-none focus:shadow-pop-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Estado</label>
                  <input
                    type="text"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-white border-2 border-ink/20 rounded-lg text-ink focus:outline-none focus:shadow-pop-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">Rua</label>
                <input
                  type="text"
                  value={rua}
                  onChange={(e) => setRua(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-white border-2 border-ink/20 rounded-lg text-ink focus:outline-none focus:shadow-pop-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Número</label>
                  <input
                    type="text"
                    value={numero}
                    onChange={(e) => setNumero(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-white border-2 border-ink/20 rounded-lg text-ink focus:outline-none focus:shadow-pop-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-ink mb-1">Complemento</label>
                  <input
                    type="text"
                    value={complemento}
                    onChange={(e) => setComplemento(e.target.value)}
                    className="w-full px-4 py-2 bg-white border-2 border-ink/20 rounded-lg text-ink focus:outline-none focus:shadow-pop-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">Bairro</label>
                <input
                  type="text"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-white border-2 border-ink/20 rounded-lg text-ink focus:outline-none focus:shadow-pop-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-ink mb-1">Cidade</label>
                <input
                  type="text"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  required
                  className="w-full px-4 py-2 bg-white border-2 border-ink/20 rounded-lg text-ink focus:outline-none focus:shadow-pop-sm"
                />
              </div>

              {error && (
                <div className="bg-red-500 bg-opacity-20 border-2 border-red-500 rounded-lg p-3 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-white hover:bg-lilac-soft text-ink rounded-lg border-2 border-ink/20 font-medium transition-all disabled:opacity-50"
                >
                  Cancelar
                </button>
                <GamButton type="submit" disabled={loading} className="flex-1" variant="primary">
                  {loading ? 'Enviando...' : 'Confirmar pedido'}
                </GamButton>
              </div>
            </form>
          </>
        )}

        {step === 'confirmacao' && (
          <div className="text-center py-2">
            <div className="text-6xl mb-3">📦</div>
            <h2 className="text-2xl font-display font-bold text-ink mb-2">Pedido registrado!</h2>
            <div className="inline-block bg-white border-2 border-ink rounded-full px-4 py-2 font-display font-extrabold text-ink mb-4">
              Nº {numeroPedido}
            </div>
            <p className="text-sm text-ink/70 font-body mb-6">
              A loja física ainda não existe de verdade — a gente guardou seu pedido pra medir o interesse antes de
              montar produção e entrega. Se isso vingar, avisamos você por telefone ou e-mail assim que abrir de
              verdade. Obrigado por ajudar a gente a decidir! 💛
            </p>
            <GamButton onClick={onClose} variant="primary" className="w-full">
              Fechar
            </GamButton>
          </div>
        )}
      </div>
    </div>
  );
}
