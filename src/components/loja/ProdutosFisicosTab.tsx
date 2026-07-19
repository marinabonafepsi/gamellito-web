'use client';

import { useMemo, useState } from 'react';
import { CATEGORIAS_PRODUTOS, PRODUTOS_FISICOS } from '@/lib/loja-produtos';
import { CheckoutIntencaoModal } from './CheckoutIntencaoModal';

const fmtMoney = (v: number) => `R$ ${v.toFixed(2).replace('.', ',')}`;

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
    <>
      {/* Category chips */}
      <div className="flex flex-wrap gap-2 justify-center mb-7">
        {CATEGORIAS_PRODUTOS.map((c) => (
          <button
            key={c.id}
            onClick={() => setCatFiltro(c.id)}
            className={`fchip ${catFiltro === c.id ? 'on' : ''}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" style={{ marginBottom: 64 }}>
        {produtosFiltrados.map((produto) => (
          <div key={produto.id} className="prod">
            <div className="thumb ph">
              <span className="cat-badge">{produto.categoriaLabel}</span>
              <span>foto: {produto.nome.toLowerCase()}</span>
            </div>
            <div className="pname">{produto.nome}</div>
            <div className="pdesc">{produto.descricao}</div>
            <div className="qty-row">
              <span className="pv">{fmtMoney(produto.preco)}</span>
              <div className="stepper">
                <button onClick={() => setQtd(produto.id, getQtd(produto.id) - 1)}>–</button>
                <span className="qv">{getQtd(produto.id)}</span>
                <button onClick={() => setQtd(produto.id, getQtd(produto.id) + 1)}>+</button>
              </div>
            </div>
            <button className="add-btn" style={{ width: '100%' }} onClick={() => adicionarAoCarrinho(produto.id, produto.nome)}>
              Adicionar ao carrinho
            </button>
          </div>
        ))}
      </div>

      {/* Floating cart button */}
      {cartCount > 0 && (
        <button className="cart-fab" onClick={() => setCarrinhoAberto(true)}>
          🛒 Carrinho <span className="badge">{cartCount}</span>
        </button>
      )}

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}

      {/* Cart drawer */}
      {carrinhoAberto && (
        <>
          <div className="scrim" onClick={() => setCarrinhoAberto(false)} />
          <div className="drawer">
            <div className="drawer-head">
              <h3>Seu carrinho</h3>
              <button className="x-close" onClick={() => setCarrinhoAberto(false)}>✕</button>
            </div>
            <div className="drawer-body">
              {itensCarrinho.length === 0 ? (
                <div className="empty-cart">
                  <img src="/assets/gamellito-thinking-tipo1.svg" alt="" />
                  <div>Seu carrinho está vazio. Que tal levar uma pelúcia do Gamellito?</div>
                </div>
              ) : (
                itensCarrinho.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div className="ci-thumb" />
                    <div className="ci-info">
                      <div className="ci-name">{item.nome}</div>
                      <div className="ci-price">{fmtMoney(item.preco)} cada</div>
                      <div className="ci-foot">
                        <div className="stepper">
                          <button onClick={() => setQtdCarrinho(item.id, item.quantidade - 1)}>–</button>
                          <span className="qv">{item.quantidade}</span>
                          <button onClick={() => setQtdCarrinho(item.id, item.quantidade + 1)}>+</button>
                        </div>
                        <button className="remove-lnk" onClick={() => setQtdCarrinho(item.id, 0)}>remover</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="drawer-foot">
              <div className="sub-row"><span>Subtotal</span><span className="sv">{fmtMoney(subtotal)}</span></div>
              <button
                className="btn-checkout"
                disabled={itensCarrinho.length === 0}
                onClick={() => {
                  setCarrinhoAberto(false);
                  setCheckoutAberto(true);
                }}
              >
                Finalizar compra
              </button>
            </div>
          </div>
        </>
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
    </>
  );
}
