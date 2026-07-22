'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { GamCard } from '@/components/ds/GamCard';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ProdutosFisicosTab } from '@/components/loja/ProdutosFisicosTab';

interface Item {
  id: string;
  nome: string;
  descricao: string;
  custo_moedas: number;
  imagem_url?: string;
  tipo: string;
}

const TYPE_LABEL: Record<string, string> = {
  avatar_skin: 'Skin',
  badge: 'Emblema',
  poder_jogo: 'Poder',
  recurso: 'Recurso',
  cosmético: 'Cosmético',
};

interface InventarioItem {
  item_id: string;
  quantidade: number;
}

export default function LojaPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [moedas, setMoedas] = useState(0);
  const [inventario, setInventario] = useState<Map<string, InventarioItem>>(
    new Map()
  );
  const [loading, setLoading] = useState(true);
  const [comprando, setComprando] = useState<string | null>(null);
  const [tab, setTab] = useState<'recompensas' | 'produtos'>('recompensas');
  const [erro, setErro] = useState('');
  const [itemComprado, setItemComprado] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    loadLoja();
  }, []);

  const loadLoja = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Get items
      const { data: itemsData } = await supabase
        .from('loja_items')
        .select('*')
        .eq('ativo', true);

      setItems(itemsData || []);

      // Get user's moedas
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('coins')
        .eq('user_id', user.id)
        .single();

      setMoedas(profile?.coins || 0);

      // Get inventario
      const { data: inv } = await supabase
        .from('inventario_usuario')
        .select('item_id, quantidade')
        .eq('usuario_id', user.id);

      const invMap = new Map();
      inv?.forEach((i) => invMap.set(i.item_id, i));
      setInventario(invMap);
    } catch (error) {
      console.error('Error loading loja:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComprar = async (item: Item) => {
    setErro('');

    if (moedas < item.custo_moedas) {
      setErro(`Você precisa de ${item.custo_moedas} moedas — tem ${moedas} por enquanto.`);
      return;
    }

    setComprando(item.id);
    try {
      const response = await fetch('/api/loja/comprar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          item_id: item.id,
          quantidade: 1,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setMoedas(result.saldo_novo);

        const inv = new Map(inventario);
        inv.set(item.id, { item_id: item.id, quantidade: 1 });
        setInventario(inv);

        setItemComprado(item.nome);
      } else {
        setErro('Não foi possível trocar agora. Tenta de novo em instantes.');
      }
    } catch (error) {
      console.error('Error buying item:', error);
      setErro('Não foi possível trocar agora. Tenta de novo em instantes.');
    } finally {
      setComprando(null);
    }
  };

  const getTypeEmoji = (tipo: string) => {
    const emojis: Record<string, string> = {
      avatar_skin: '👤',
      badge: '🏅',
      poder_jogo: '⚡',
      recurso: '📚',
      cosmético: '✨',
    };
    return emojis[tipo] || '🎁';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Carregando loja...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      {/* ===== HERO ===== */}
      <section className="loja-hero">
        <div className="wrap">
          <div>
            <h1>Loja Gamellito</h1>
            <p>
              Troque moedas por skins e mimos digitais, ou leve o Gamellito pra vida real — pelúcias, roupinhas e
              materiais educativos.
            </p>
          </div>
          <div className="flex items-center gap-5">
            <div className="balance-pill">
              <span className="coin-ico big" />
              <div>
                <div className="bv">{moedas.toLocaleString('pt-BR')}</div>
                <div className="bl">moedas disponíveis</div>
              </div>
            </div>
            <img className="mascote" src="/assets/gamellito-contente.svg" alt="Gamellito contente" />
          </div>
        </div>
      </section>

      <div className="wrap">
        {/* ===== TABS ===== */}
        <div className="tabs-row">
          <button
            className={`tab-btn ${tab === 'recompensas' ? 'is-on' : ''}`}
            onClick={() => setTab('recompensas')}
          >
            Recompensas · moedas
          </button>
          <button
            className={`tab-btn ${tab === 'produtos' ? 'is-on' : ''}`}
            onClick={() => setTab('produtos')}
          >
            Produtos · loja física
          </button>
        </div>

        {erro && (
          <div
            onClick={() => setErro('')}
            style={{ cursor: 'pointer' }}
            className="bg-game-red/10 border-2 border-game-red rounded-[16px] p-3 text-game-red text-sm font-bold mb-5"
          >
            {erro}
          </div>
        )}

        {tab === 'produtos' && <ProdutosFisicosTab />}

        {tab === 'recompensas' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" style={{ marginBottom: 64 }}>
              {items.map((item) => {
                const temItem = inventario.has(item.id);
                const podeComprar = moedas >= item.custo_moedas;
                return (
                  <div key={item.id} className="prod">
                    <div className={`thumb ${!item.imagem_url ? 'ph' : ''}`}>
                      <span className="cat-badge">{TYPE_LABEL[item.tipo] || item.tipo}</span>
                      {item.imagem_url ? (
                        <img src={item.imagem_url} alt={item.nome} />
                      ) : (
                        <span style={{ fontSize: 44 }}>{getTypeEmoji(item.tipo)}</span>
                      )}
                    </div>
                    <div className="pname">{item.nome}</div>
                    <div className="pdesc">{item.descricao}</div>
                    {temItem ? (
                      <div className="price">
                        <span className="text-[13px] font-display font-bold text-game-green">
                          ✅ Você tem este item!
                        </span>
                      </div>
                    ) : (
                      <div className="price">
                        <span className="coin-ico" />
                        <span className="pv">{item.custo_moedas.toLocaleString('pt-BR')}</span>
                        <button
                          className="trocar"
                          disabled={!podeComprar || comprando === item.id}
                          onClick={() => handleComprar(item)}
                        >
                          {comprando === item.id ? 'Trocando...' : 'Trocar'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Empty State */}
            {items.length === 0 && (
              <GamCard surface="cream" className="mb-16">
                <div className="text-center py-12">
                  <p className="text-ink opacity-70 mb-4">A loja está vazia no momento</p>
                  <p className="text-sm text-ink opacity-50">Volte em breve para novas ofertas!</p>
                </div>
              </GamCard>
            )}

            {/* Info */}
            <GamCard surface="lilac" className="mb-16">
              <div className="p-4">
                <p className="text-sm font-medium text-ink mb-2">💡 Como ganhar moedas</p>
                <ul className="text-xs text-ink opacity-80 space-y-1">
                  <li>✅ +10 moedas ao registrar glicemia</li>
                  <li>✅ +5 moedas ao marcar humor (1x por dia)</li>
                  <li>✅ Bônus especiais em datas comemorativas</li>
                </ul>
              </div>
            </GamCard>
          </>
        )}
      </div>

      {itemComprado && (
        <div className="reward-overlay" onClick={() => setItemComprado(null)}>
          <div className="reward-card" onClick={(e) => e.stopPropagation()}>
            <img src="/assets/gamellito-contente.svg" alt="" width={130} height={130} className="reward-icon" />
            <h3>Item resgatado!</h3>
            <p className="reward-coins">{itemComprado}</p>
            <p className="reward-note">Já foi pro seu inventário. Bora aproveitar!</p>
            <button
              className="btn btn-orange"
              style={{ padding: '9px 16px', fontSize: 13.5, boxShadow: '3px 3px 0 #2b2233' }}
              onClick={() => setItemComprado(null)}
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
