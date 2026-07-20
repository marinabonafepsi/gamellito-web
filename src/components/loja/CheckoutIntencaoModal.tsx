'use client';

import { useState } from 'react';

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
    <div className="scrim">
      <div className="modal-wrap">
        <div className="modal">
          {step === 'endereco' && (
            <button type="button" className="x-close" onClick={onClose} aria-label="Fechar">✕</button>
          )}

          <div className="steps-row">
            <div className={`step-dot ${step === 'endereco' ? 'is-on' : 'is-done'}`}>
              <span className="sd">1</span>Endereço
            </div>
            <div className="step-line" />
            <div className={`step-dot ${step === 'confirmacao' ? 'is-on' : ''}`}>
              <span className="sd">2</span>Confirmação
            </div>
          </div>

          {step === 'endereco' && (
            <>
              <h3 style={{ fontSize: 21, marginBottom: 6 }}>Finalizar pedido</h3>
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

              <form onSubmit={handleSubmit}>
                <div className="field">
                  <label>Nome completo</label>
                  <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required autoFocus />
                </div>

                <div className="field">
                  <label>Telefone (opcional)</label>
                  <input
                    type="tel"
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="Pra avisar quando a loja abrir de verdade"
                  />
                </div>

                <div className="field-row">
                  <div className="field">
                    <label>CEP</label>
                    <input type="text" value={cep} onChange={(e) => setCep(e.target.value)} required />
                  </div>
                  <div className="field">
                    <label>Estado</label>
                    <input type="text" value={estado} onChange={(e) => setEstado(e.target.value)} required />
                  </div>
                </div>

                <div className="field">
                  <label>Rua</label>
                  <input type="text" value={rua} onChange={(e) => setRua(e.target.value)} required />
                </div>

                <div className="field-row">
                  <div className="field">
                    <label>Número</label>
                    <input type="text" value={numero} onChange={(e) => setNumero(e.target.value)} required />
                  </div>
                  <div className="field">
                    <label>Complemento</label>
                    <input type="text" value={complemento} onChange={(e) => setComplemento(e.target.value)} />
                  </div>
                </div>

                <div className="field">
                  <label>Bairro</label>
                  <input type="text" value={bairro} onChange={(e) => setBairro(e.target.value)} required />
                </div>

                <div className="field">
                  <label>Cidade</label>
                  <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} required />
                </div>

                {error && (
                  <div className="bg-red-500 bg-opacity-20 border-2 border-red-500 rounded-lg p-3 text-red-700 text-sm mb-4">
                    {error}
                  </div>
                )}

                <div className="modal-nav">
                  <button type="button" className="btn btn-ghost" onClick={onClose} disabled={loading}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-orange" disabled={loading}>
                    {loading ? 'Enviando...' : 'Confirmar pedido'}
                  </button>
                </div>
              </form>
            </>
          )}

          {step === 'confirmacao' && (
            <div className="confirm-wrap">
              <img src="/assets/gamellito-contente.svg" alt="Gamellito celebrando" />
              <h3 style={{ fontSize: 23 }}>Pedido registrado!</h3>
              <p className="font-body text-ink/70 mt-2">
                A loja física ainda não existe de verdade — a gente guardou seu pedido pra medir o interesse antes de
                montar produção e entrega. Se isso vingar, avisamos você por telefone ou e-mail assim que abrir de
                verdade. Obrigado por ajudar a gente a decidir! 💛
              </p>
              <div className="order-no">Pedido #{numeroPedido}</div>
              <div className="modal-nav" style={{ justifyContent: 'center', marginTop: 28 }}>
                <button className="btn btn-orange" onClick={onClose}>Fechar</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
