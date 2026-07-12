'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { GamButton } from '@/components/ds/GamButton';
import { GamCard } from '@/components/ds/GamCard';
import { ProdutosFisicosTab } from '@/components/loja/ProdutosFisicosTab';

interface Item {
  id: string;
  nome: string;
  descricao: string;
  custo_moedas: number;
  imagem_url?: string;
  tipo: string;
}

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
    if (moedas < item.custo_moedas) {
      alert(
        `Você precisa de ${item.custo_moedas} moedas, tem apenas ${moedas}`
      );
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

        // Celebration
        showCelebration(item.nome);
      } else {
        alert('Erro ao comprar item');
      }
    } catch (error) {
      console.error('Error buying item:', error);
      alert('Erro ao comprar item');
    } finally {
      setComprando(null);
    }
  };

  const showCelebration = (itemNome: string) => {
    alert(`🎉 Parabéns! Você comprou: ${itemNome}`);
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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <p className="eyebrow on-creme">Loja Gamellito</p>
          <h1 className="h-md text-ink">
            Cuidou, <span className="hl-orange">ganhou moedas</span>
          </h1>
          <p className="text-ink/60 font-body">Compre itens especiais com suas moedas</p>
        </div>
        <div className="flex items-center gap-2 bg-cream border-[3px] border-ink rounded-full shadow-pop px-4 py-2">
          <span className="coin-ico big" />
          <div className="leading-none">
            <p className="font-display font-extrabold text-xl text-ink">{moedas}</p>
            <p className="text-[11px] font-body font-bold text-ink/60">moedas</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('recompensas')}
          className={`px-5 py-2 rounded-full border-2 font-display font-bold text-sm transition-all ${
            tab === 'recompensas'
              ? 'bg-ink text-white border-ink shadow-pop-sm'
              : 'bg-white text-ink border-ink/20 hover:border-ink'
          }`}
        >
          Recompensas · moedas
        </button>
        <button
          onClick={() => setTab('produtos')}
          className={`px-5 py-2 rounded-full border-2 font-display font-bold text-sm transition-all ${
            tab === 'produtos'
              ? 'bg-ink text-white border-ink shadow-pop-sm'
              : 'bg-white text-ink border-ink/20 hover:border-ink'
          }`}
        >
          Produtos · loja física
        </button>
      </div>

      {tab === 'produtos' && <ProdutosFisicosTab />}

      {tab === 'recompensas' && (
      <>
      {/* Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => {
          const temItem = inventario.has(item.id);
          return (
            <GamCard key={item.id} surface="white">
              <div className="space-y-4">
                {/* Icon */}
                <div className="text-6xl text-center">
                  {getTypeEmoji(item.tipo)}
                </div>

                {/* Info */}
                <div>
                  <h3 className="text-xl font-bold text-ink">{item.nome}</h3>
                  <p className="text-sm text-ink opacity-70 mt-1">
                    {item.descricao}
                  </p>
                  <p className="text-xs text-ink opacity-50 mt-2">
                    Tipo: {item.tipo}
                  </p>
                </div>

                {/* Price */}
                <div className="bg-lilac-soft p-3 rounded-[16px] border-[3px] border-ink">
                  <p className="text-center text-lg font-bold text-ink flex items-center justify-center gap-2">
                    <span className="coin-ico" />{item.custo_moedas}
                  </p>
                </div>

                {/* Button */}
                {temItem ? (
                  <div className="bg-game-green/15 border-2 border-game-green rounded-[16px] p-3 text-center">
                    <p className="text-sm font-bold text-game-green">
                      Você tem este item!
                    </p>
                  </div>
                ) : (
                  <GamButton
                    onClick={() => handleComprar(item)}
                    disabled={moedas < item.custo_moedas || comprando === item.id}
                    variant={moedas >= item.custo_moedas ? 'primary' : 'secondary'}
                    className="w-full"
                  >
                    {comprando === item.id
                      ? 'Comprando...'
                      : moedas >= item.custo_moedas
                        ? '🛒 Comprar'
                        : '❌ Moedas insuficientes'}
                  </GamButton>
                )}
              </div>
            </GamCard>
          );
        })}
      </div>

      {/* Empty State */}
      {items.length === 0 && (
        <GamCard surface="cream">
          <div className="text-center py-12">
            <p className="text-ink opacity-70 mb-4">
              A loja está vazia no momento
            </p>
            <p className="text-sm text-ink opacity-50">
              Volte em breve para novas ofertas!
            </p>
          </div>
        </GamCard>
      )}

      {/* Info */}
      <GamCard surface="lilac">
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
  );
}
