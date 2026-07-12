'use client';

import { useMemo, useState } from 'react';
import { GamButton } from '@/components/ds/GamButton';
import { GamCard } from '@/components/ds/GamCard';
import { CATEGORIAS_PRODUTOS, PRODUTOS_FISICOS } from '@/lib/loja-produtos';
import { CheckoutIntencaoModal } from './CheckoutIntencaoModal';

const fmtMoney = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;

const CATEGORY_EMOJI: Record<string, string> = {
  pelucia: '🧸',
  roupa: '👕',
  adesivo: '✨',
  educativo: '📚',
};

export function ProdutosFisicosTab() {
  const [catFiltro, setCatFiltro] = useState('todos');
  const [qtds, setQtds] = useState<Record<string, number>>({});
  const [carrinho, setCarrinho] = useState<Record<string, number>>({});
  const [carrinhoAberto, setCarrinhoAberto] = useState(false);
  const [checkoutAberto, setCheckoutAberto] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const produtosFiltrados = useMemo(
    () => (catFiltro === 'todos' ? PRODUTOS_FISICOS : PRODUTOS_FISICOS.filter((p) => p.categoria === catFiltro)),
    [catFiltro]
  );

  const dispararToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const getQtd = (id: string) => qtds[id] || 1;
  const setQtd = (id: string, q: number) => setQtds((prev) => ({ ...prev, [id]: Math.max(1, q) }));

  const adicionarAoCarrinho = (id: string, nome: string) => {
    const q = getQtd(id);
    setCarrinho((prev) => ({ ...prev, [id]: (prev[id] || 0) + q }));
    setQtds((prev) => ({ ...prev, [id]: 1 }));
    dispararToast(`${nome} no carrinho!`);
  };

  const setQtdCarrinho = (id: string, q: number) => {
    setCarrinho((prev) => {
      const next = { ...prev };
      if (q <= 0) delete next[id];
      else next[id] = q;
      return next;
    });
  };

  const itensCarrinho = Object.entries(carrinho)
    .filter(([, q]) => q > 0)
    .map(([id, quantidade]) => {
      const produto = PRODUTOS_FISICOS.find((p) => p.id === id)!;
      return { id, nome: produto.nome, preco: produto.preco, quantidade };
    });

  const cartCount = itensCarrinho.reduce((acc, i) => acc + i.quantidade, 0);
  const subtotal = itensCarrinho.reduce((acc, i) => acc + i.preco * i.quantidade, 0);

  return (
    <div className="space-y-6">
      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIAS_PRODUTOS.map((c) => (
          <button
            key={c.id}
            onClick={() => setCatFiltro(c.id)}
            className={`px-4 py-2 rounded-full border-2 font-display font-bold text-sm transition-all ${
              catFiltro === c.id
                ? 'bg-orange text-white border-ink shadow-pop-sm'
                : 'bg-white text-ink border-ink/20 hover:border-ink'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {produtosFiltrados.map((produto) => (
          <GamCard key={produto.id} surface="white">
            <div className="space-y-4">
              <div className="text-6xl text-center">{CATEGORY_EMOJI[produto.categoria] || '🎁'}</div>

              <div>
                <p className="text-[11px] font-body font-bold text-ink/50 uppercase">{produto.categoriaLabel}</p>
                <h3 className="text-xl font-bold text-ink">{produto.nome}</h3>
                <p className="text-sm text-ink opacity-70 mt-1">{produto.descricao}</p>
              </div>

              <div className="bg-lilac-soft p-3 rounded-[16px] border-[3px] border-ink">
                <p className="text-center text-lg font-bold text-ink">{fmtMoney(produto.preco)}</p>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setQtd(produto.id, getQtd(produto.id) - 1)}
                  className="w-8 h-8 rounded-full border-2 border-ink bg-white font-bold text-ink"
                >
                  −
                </button>
                <span className="font-display font-bold text-ink w-6 text-center">{getQtd(produto.id)}</span>
                <button
                  onClick={() => setQtd(produto.id, getQtd(produto.id) + 1)}
                  className="w-8 h-8 rounded-full border-2 border-ink bg-white font-bold text-ink"
                >
                  +
                </button>
              </div>

              <GamButton onClick={() => adicionarAoCarrinho(produto.id, produto.nome)} variant="primary" className="w-full">
                🛒 Adicionar ao carrinho
              </GamButton>
            </div>
          </GamCard>
        ))}
      </div>

      {/* Floating cart button */}
      {cartCount > 0 && (
        <button
          onClick={() => setCarrinhoAberto(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-ink text-white font-display font-bold rounded-full px-5 py-3 shadow-pop-lg border-[3px] border-ink"
        >
          🛒 {cartCount} · {fmtMoney(subtotal)}
        </button>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed left-1/2 bottom-24 -translate-x-1/2 z-50 bg-ink text-white font-body font-bold text-sm px-5 py-3 rounded-full shadow-pop">
          {toast}
        </div>
      )}

      {/* Cart drawer */}
      {carrinhoAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50" onClick={() => setCarrinhoAberto(false)}>
          <div
            className="bg-cream border-l-[3px] border-ink h-full w-full max-w-sm p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-display font-bold text-ink">Seu carrinho</h2>
              <button onClick={() => setCarrinhoAberto(false)} className="text-ink/60 text-2xl leading-none">
                ×
              </button>
            </div>

            {itensCarrinho.length === 0 ? (
              <p className="text-ink/60 text-sm font-body">Seu carrinho está vazio.</p>
            ) : (
              <div className="space-y-3">
                {itensCarrinho.map((item) => (
                  <div key={item.id} className="bg-white border-2 border-ink rounded-[16px] p-3">
                    <div className="flex justify-between gap-2">
                      <p className="text-sm font-bold text-ink">{item.nome}</p>
                      <p className="text-sm font-bold text-ink whitespace-nowrap">{fmtMoney(item.preco * item.quantidade)}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => setQtdCarrinho(item.id, item.quantidade - 1)}
                        className="w-7 h-7 rounded-full border-2 border-ink bg-white font-bold text-ink text-sm"
                      >
                        −
                      </button>
                      <span className="font-display font-bold text-ink w-6 text-center text-sm">{item.quantidade}</span>
                      <button
                        onClick={() => setQtdCarrinho(item.id, item.quantidade + 1)}
                        className="w-7 h-7 rounded-full border-2 border-ink bg-white font-bold text-ink text-sm"
                      >
                        +
                      </button>
                      <button
                        onClick={() => setQtdCarrinho(item.id, 0)}
                        className="ml-auto text-xs font-bold text-game-red"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between pt-3 border-t-2 border-ink/10 font-display font-bold text-ink">
                  <span>Subtotal</span>
                  <span>{fmtMoney(subtotal)}</span>
                </div>

                <GamButton
                  onClick={() => {
                    setCarrinhoAberto(false);
                    setCheckoutAberto(true);
                  }}
                  variant="primary"
                  className="w-full"
                >
                  Finalizar pedido
                </GamButton>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout (fake door) */}
      {checkoutAberto && (
        <CheckoutIntencaoModal
          itens={itensCarrinho}
          subtotal={subtotal}
          onClose={() => setCheckoutAberto(false)}
          onConfirmado={() => setCarrinho({})}
        />
      )}
    </div>
  );
}
